// import { parserAgent } from '@/lib/agents/parser';
import { aggregatorAgent } from '@/lib/agents/aggregator_v2';
import { amadeusService } from '@/lib/services/amadeus';
import { enricherAgent } from '@/lib/agents/enricher';
import { strategistAgent } from '@/lib/agents/strategist';
import { Flight, UserIntent, FilterCriteria } from '@/types';
import { UserIntentSchema } from '@/types/schemas';
import { searchCache } from '@/lib/utils/cache';
import { filterFlights, sortFlights, SortOption, extractFilters } from '@/lib/utils/flightFilters';

export async function orchestrateSearch(formData: FormData): Promise<{ flights: Flight[], priceHistory?: any[], dictionaries?: any, pagination?: any, filterOptions?: any }> {
    const searchId = `SwarmLatency-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.time(searchId);

    // 0. Cache Check (Optimization for Pagination)
    const cachedResult = searchCache.get(formData);

    let enrichedFlights: Flight[] = [];
    let priceAnalysis: any[] = [];
    let dictionaries: any = {};

    if (cachedResult) {
        // CACHE HIT: Skip agents, use memory
        console.log(`[CACHE HIT] Serving from memory for ${searchId}`);
        enrichedFlights = cachedResult.flights;
        priceAnalysis = cachedResult.priceHistory;
        dictionaries = cachedResult.dictionaries;
    } else {
        // CACHE MISS: Execute Full Swarm Logic

        // Step 1: Parser (Blocking)

        // Extract structured data from FormData
        const getStr = (key: string) => {
            const val = formData.get(key);
            return val ? val.toString() : undefined;
        };

        const getNum = (key: string) => {
            const val = formData.get(key);
            return val ? parseInt(val.toString(), 10) : undefined;
        };

        const rawIntent = {
            origin: getStr('origin'),
            destination: getStr('destination'),
            dateStr: getStr('date'),
            returnDateStr: getStr('returnDate'),
            pax: getNum('pax') || 1,
            adults: getNum('adults'),
            children: getNum('children'),
            infants: getNum('infants'),
            cabinClass: (getStr('cabinClass') as any) || 'ECONOMY',
            persona: 'budget' as const,
            currency: getStr('currency')
        };

        // Simulate Parsing/Validation Latency
        // Latency removed for production optimization
        // await new Promise(resolve => setTimeout(resolve, 300));

        // Only parse intent if not cached (but we are inside else block so it's fine)
        const intent = UserIntentSchema.parse(rawIntent) as UserIntent;

        if (!intent.destination) {
            console.timeEnd(searchId);
            return { flights: [] };
        }

        // Step 2: Aggregator & Analytics (Parallel)
        const [aggregatorResult, cheapestDates] = await Promise.all([
            aggregatorAgent(intent),
            amadeusService.getCheapestDates(intent.origin || '', intent.destination || '')
        ]);

        const { flights: rawFlights, dictionaries: rawDicts } = aggregatorResult;
        dictionaries = rawDicts; // Assign to outer var

        // Map Cheapest Dates to PriceGraph format directly here
        priceAnalysis = Array.isArray(cheapestDates) ? cheapestDates.map((item: any) => ({
            date: item.departureDate,
            price: parseFloat(item.price.total),
            min: parseFloat(item.price.total), // Since it's "cheapest", min/val/max are the same point
            max: parseFloat(item.price.total)
        })) : [];

        // Step 3: Parallel Logic (Enricher & Strategist)
        // We use allSettled to ensure if one fails, the other can still contribute
        const results = await Promise.allSettled([
            enricherAgent(rawFlights), // Agent 3
            strategistAgent(rawFlights) // Agent 4
        ]);

        enrichedFlights = rawFlights;

        // Merge Enricher Results
        if (results[0].status === 'fulfilled') {
            enrichedFlights = results[0].value;
        } else {
            console.error('Enricher Agent Failed');
        }

        // Merge Strategist Results
        // Note: Strategist usually returns a modified list.
        // If we had separate lists, we'd need to merge by ID.
        // Since our mocks map inputs->outputs preserving order/IDs, we can merge objects.
        if (results[1].status === 'fulfilled') {
            const predictions = results[1].value;
            enrichedFlights = enrichedFlights.map((f: Flight) => {
                const pred = predictions.find((p: Flight) => p.id === f.id);
                return pred ? { ...f, prediction: pred.prediction } : f;
            });
        } else {
            console.error('Strategist Agent Failed');
        }

        // Populate Cache
        searchCache.set(formData, {
            flights: enrichedFlights,
            priceHistory: priceAnalysis,
            dictionaries
        });

    } // END CACHE MISS ELSE BLOCK



    // --- SERVER-SIDE ORCHESTRATION: FILTER -> SORT -> PAGE ---

    // 1. Extract Filter/Sort Params
    const sort = (formData.get('sort')?.toString() || 'best') as SortOption;

    const maxPrice = formData.get('maxPrice') ? parseFloat(formData.get('maxPrice')!.toString()) : undefined;
    const airlines = formData.get('airlines')?.toString().split(',').filter(Boolean) || [];
    const stops = formData.get('stops')?.toString().split(',').map(Number).filter(n => !isNaN(n)) || [];
    const maxDuration = formData.get('maxDuration') ? parseInt(formData.get('maxDuration')!.toString(), 10) : undefined;

    const filterCriteria: FilterCriteria = {
        maxPrice: maxPrice || 100000,
        airlines: airlines,
        stops: stops,
        maxDuration: maxDuration,
    };

    // 1.5 Calculate Facets (Global Options before filtering)
    // We calculate this from the full enriched set so the UI shows all possibilities
    const filterOptions = extractFilters(enrichedFlights);

    // 2. Apply Filters (Global)
    const filteredFlights = filterFlights(enrichedFlights, filterCriteria);

    // 3. Apply Sorting (Global)
    const sortedFlights = sortFlights(filteredFlights, sort);

    // 4. Pagination (Slicing)
    const page = parseInt(formData.get('page')?.toString() || '1', 10);
    const limit = parseInt(formData.get('limit')?.toString() || '10', 10);

    // Calculate Slicing
    const totalCount = sortedFlights.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Slice Data
    const paginatedFlights = sortedFlights.slice(startIndex, endIndex);
    const totalPages = Math.ceil(totalCount / limit);

    console.timeEnd(searchId);
    return {
        flights: paginatedFlights,
        priceHistory: priceAnalysis,
        dictionaries,
        filterOptions: { ...filterOptions, dictionaries },
        pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            limit,
            hasMore: page < totalPages
        }
    };
}
