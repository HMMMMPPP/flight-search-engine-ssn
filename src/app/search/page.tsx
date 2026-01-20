import { SortOption, DEFAULT_FILTER_OPTIONS } from '@/lib/utils/flightFilters';
import { orchestrateSearch } from '@/features/orchestrator/swarm-engine';
import Link from 'next/link';
import { SearchResultsLayout } from '@/components/search/layout/SearchResultsLayout';
import { SearchFormWrapper } from '@/components/search/form/SearchFormWrapper';
import { SearchPageHeader } from '@/components/search/layout/SearchPageHeader';


export const dynamic = 'force-dynamic';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams;
    const origin = resolvedParams.origin as string;
    const destination = resolvedParams.destination as string;
    const date = resolvedParams.date as string;
    const returnDate = resolvedParams.returnDate as string;
    const pax = resolvedParams.pax as string;
    const cabinClass = resolvedParams.cabinClass as string;
    const currency = resolvedParams.currency as string;
    const limit = resolvedParams.limit ? parseInt(resolvedParams.limit as string, 10) : 10;
    const page = resolvedParams.page ? parseInt(resolvedParams.page as string, 10) : 1;

    // Filters & Sort
    const sort = resolvedParams.sort as string;
    const maxPrice = resolvedParams.maxPrice as string;
    const airlines = resolvedParams.airlines as string;
    const stops = resolvedParams.stops as string;
    const maxDuration = resolvedParams.maxDuration as string;

    // Advanced Filters
    const depWindow = resolvedParams.depWindow as string;
    const arrWindow = resolvedParams.arrWindow as string;
    const baggage = resolvedParams.baggage as string;
    const layover = resolvedParams.layover as string;
    const connections = resolvedParams.connections as string;

    // Validate Sort Option to satisfy TypeScript union type
    const validSortOptions: SortOption[] = ['best', 'duration_asc', 'departure_asc', 'departure_desc'];
    const safeSort: SortOption = validSortOptions.includes(sort as SortOption)
        ? (sort as SortOption)
        : 'best';

    // Execute Search Server-Side
    const formData = new FormData();
    if (origin) formData.append('origin', origin);
    if (destination) formData.append('destination', destination);
    if (date) formData.append('date', date);
    if (returnDate) formData.append('returnDate', returnDate);
    if (pax) formData.append('pax', pax);
    if (cabinClass) formData.append('cabinClass', cabinClass);
    if (currency) formData.append('currency', currency);
    formData.append('limit', limit.toString());
    formData.append('page', page.toString());

    if (sort) formData.append('sort', sort);
    if (maxPrice) formData.append('maxPrice', maxPrice);
    if (airlines) formData.append('airlines', airlines);
    if (stops) formData.append('stops', stops);
    if (maxDuration) formData.append('maxDuration', maxDuration);

    // Append Advanced Filters
    if (depWindow) formData.append('depWindow', depWindow);
    if (arrWindow) formData.append('arrWindow', arrWindow);
    if (baggage) formData.append('baggage', baggage);
    if (layover) formData.append('layover', layover);
    if (connections) formData.append('connections', connections);

    // Use orchestrateSearch directly (server-to-server)
    const {
        flights,
        priceHistory,
        dictionaries,
        pagination,
        filterOptions,
        flightAnalysis,
        intradayMetrics
    } = await orchestrateSearch(formData);

    const currentFilters = {
        maxPrice: maxPrice ? parseFloat(maxPrice) : (filterOptions?.maxPrice || 10000),
        airlines: airlines ? airlines.split(',').filter(Boolean) : [],
        stops: stops ? stops.split(',').map(Number) : [],
        maxDuration: maxDuration ? parseInt(maxDuration, 10) : undefined,
        departureWindow: depWindow ? depWindow.split('-').map(Number) as [number, number] : undefined,
        arrivalWindow: arrWindow ? arrWindow.split('-').map(Number) as [number, number] : undefined,
        hasBaggage: baggage === 'true',
        maxLayoverDuration: layover ? parseInt(layover, 10) : undefined,
        connectingAirports: connections ? connections.split(',').filter(Boolean) : [],
    };

    return (
        <main className="min-h-screen relative text-slate-200 font-sans selection:bg-sky-500/30 bg-[#0a0a12]">

            {/* Client Header Handling Responsiveness */}
            <SearchPageHeader>
                <SearchFormWrapper
                    initialValues={{
                        origin,
                        destination,
                        date,
                        returnDate,
                        pax,
                        cabinClass
                    }}
                />
            </SearchPageHeader>

            {/* 3-Column Layout */}
            <SearchResultsLayout
                initialFlights={flights}
                priceHistory={priceHistory}
                dictionaries={dictionaries}
                selectedDate={date}
                returnDate={returnDate}
                pagination={pagination}
                // Server-Side Orchestration Props
                filterOptions={filterOptions ?? DEFAULT_FILTER_OPTIONS}
                activeFilters={currentFilters}
                sortBy={safeSort}
                // Global Analysis
                globalAnalysis={flightAnalysis}
                globalIntraday={intradayMetrics}
            />

        </main>
    );
}
