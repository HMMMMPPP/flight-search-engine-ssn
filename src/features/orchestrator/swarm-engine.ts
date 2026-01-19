// import { parserAgent } from '@/lib/agents/parser';
import { aggregatorAgent } from '@/lib/agents/aggregator_v2';
import { amadeusService } from '@/lib/services/amadeus';
import { enricherAgent } from '@/lib/agents/enricher';
import { strategistAgent } from '@/lib/agents/strategist';
import { Flight, UserIntent } from '@/types';
import { UserIntentSchema } from '@/types/schemas';

export async function orchestrateSearch(formData: FormData): Promise<{ flights: Flight[], priceHistory?: any[], dictionaries?: any }> {
    const searchId = `SwarmLatency-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.time(searchId);

    // Step 1: Parser (Blocking)
    // Extract structured data from FormData
    // Helper to safely get string or undefined (Zod treats null as invalid for optional string)
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

    const { flights: rawFlights, dictionaries } = aggregatorResult;

    // Map Cheapest Dates to PriceGraph format directly here
    const priceAnalysis = Array.isArray(cheapestDates) ? cheapestDates.map((item: any) => ({
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

    let enrichedFlights = rawFlights;

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

    console.timeEnd(searchId);
    return { flights: enrichedFlights, priceHistory: priceAnalysis, dictionaries };
}
