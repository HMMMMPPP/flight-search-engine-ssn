'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Flight, PriceMetrics, FilterCriteria, FilterOptions } from '@/types';
import { FilterSidebar } from '@/components/search/filters/FilterSidebar';
import { BentoFlightCard } from '@/components/flight/BentoFlightCard';
import { PriceHistoryGraph } from '@/components/analytics/PriceHistoryGraph';
import { AIStrategistPanel } from '@/components/ai-assistant/AIStrategistPanel';
import { MobileFilterBar } from '@/components/search/filters/MobileFilterBar';
import { motion, AnimatePresence } from 'framer-motion';
import { SortOption } from '@/lib/utils/flightFilters';
import { analyzeBatch } from '@/lib/agents/strategist';
import { TrendingDown } from 'lucide-react';
import clsx from 'clsx';
import { PaginationControls } from '@/components/ui/PaginationControls';

interface SearchResultsLayoutProps {
    initialFlights: Flight[];
    priceHistory?: any[];
    dictionaries?: any;
    selectedDate?: string;
    returnDate?: string;
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        limit: number;
        hasMore: boolean;
    };
    filterOptions: FilterOptions;
    activeFilters: FilterCriteria;
    sortBy: SortOption;
}

export function SearchResultsLayout({
    initialFlights,
    priceHistory,
    dictionaries,
    selectedDate,
    returnDate,
    pagination,
    filterOptions,
    activeFilters,
    sortBy
}: SearchResultsLayoutProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Sorting State
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Update Filters (URL-Driven)
    const updateFilters = (newFilters: FilterCriteria) => {
        const params = new URLSearchParams(searchParams.toString());

        // Update Max Price
        if (newFilters.maxPrice && newFilters.maxPrice < 100000) {
            params.set('maxPrice', newFilters.maxPrice.toString());
        } else {
            params.delete('maxPrice');
        }

        // Update Airlines
        if (newFilters.airlines && newFilters.airlines.length > 0) {
            params.set('airlines', newFilters.airlines.join(','));
        } else {
            params.delete('airlines');
        }

        // Update Stops
        if (newFilters.stops && newFilters.stops.length > 0) {
            params.set('stops', newFilters.stops.join(','));
        } else {
            params.delete('stops');
        }

        // Update Duration
        if (newFilters.maxDuration) {
            params.set('maxDuration', newFilters.maxDuration.toString());
        } else {
            params.delete('maxDuration');
        }

        // Reset Page to 1 on filter change
        params.set('page', '1');

        router.replace(`/search?${params.toString()}`, { scroll: false });
    };

    // Functional State Setter Adapter for Child Components
    const setFiltersAdapter = (update: FilterCriteria | ((prev: FilterCriteria) => FilterCriteria)) => {
        let nextFilters: FilterCriteria;
        if (typeof update === 'function') {
            nextFilters = update(activeFilters);
        } else {
            nextFilters = update;
        }
        updateFilters(nextFilters);
    };

    const handleSortChange = (newSort: SortOption) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', newSort);
        params.set('page', '1'); // Reset page on sort
        router.replace(`/search?${params.toString()}`, { scroll: false });
        setIsSortOpen(false);
    };

    // Sort Options Map for UI
    const sortOptions: { label: string; value: SortOption }[] = [
        { label: 'Best Match', value: 'best' },
        { label: 'Fastest First', value: 'duration_asc' },
        { label: 'Earliest Departure', value: 'departure_asc' },
        { label: 'Latest Departure', value: 'departure_desc' },
    ];

    // Flight Selection Stack (LIFO for Virtual Monitor)
    const [expandedFlightIds, setExpandedFlightIds] = useState<string[]>([]);

    // Derive the flight to show in the monitor (the last one interacted with/opened)
    const activeFlight = useMemo(() => {
        if (expandedFlightIds.length === 0) return null;
        const lastId = expandedFlightIds[expandedFlightIds.length - 1];
        return initialFlights.find(f => f.id === lastId) || null;
    }, [expandedFlightIds, initialFlights]);

    // Stack Management Handler
    const handleFlightToggle = (flight: Flight | null, isOpen: boolean) => {
        if (!flight) return;

        setExpandedFlightIds(prev => {
            if (isOpen) {
                // Remove if exists to push to top (re-focus), then add
                const others = prev.filter(id => id !== flight.id);
                return [...others, flight.id];
            } else {
                // Remove from stack
                return prev.filter(id => id !== flight.id);
            }
        });
    };

    // Reset selection when flights change (new search or filters)
    useEffect(() => {
        setExpandedFlightIds([]);
    }, [initialFlights]);

    // Use Server-Provided Flights directly
    const filteredFlights = initialFlights;

    // 4. AI Command Handler
    const handleAICommand = (action: any) => {
        if (!action) return;

        if (action.type === 'FILTER') {
            // Sanitize input: AI might return single values where arrays are expected
            const sanitizedCriteria = { ...action.criteria };

            // Fix: 'stops' must be an array
            if (typeof sanitizedCriteria.stops === 'number') {
                sanitizedCriteria.stops = [sanitizedCriteria.stops];
            }

            setFiltersAdapter(prev => ({
                ...prev,
                ...sanitizedCriteria
            }));
        } else if (action.type === 'SORT') {
            handleSortChange(action.sortBy as SortOption);
        } else if (action.type === 'RESCUE') {
            console.log("AI Rescue Request:", action.strategy);
        }
    };

    // 4.5. Flight Analysis Context
    const flightAnalysis = useMemo(() => {
        if (!filteredFlights || filteredFlights.length === 0) return null;
        return analyzeBatch(filteredFlights, priceHistory);
    }, [filteredFlights, priceHistory]);

    // 5. Price Point Handler
    const handlePricePointSelect = (flightId: string) => {
        const targetFlight = initialFlights.find(f => f.id === flightId);
        if (!targetFlight) return;

        handleFlightToggle(targetFlight, true);

        setTimeout(() => {
            const element = document.getElementById(`flight-card-${flightId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                element.classList.add('ring-2', 'ring-emerald-500/50');
                setTimeout(() => element.classList.remove('ring-2', 'ring-emerald-500/50'), 2000);
            }
        }, 100);
    };

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-8">
            <div className="grid grid-cols-1 min-[1000px]:grid-cols-12 gap-6 relative">

                {/* LEFT COLUMN: Filtering System */}
                <div className="hidden min-[1000px]:block min-[1000px]:col-span-3 min-[1300px]:col-span-2">
                    <div className="sticky top-24">
                        <FilterSidebar
                            filters={activeFilters}
                            setFilters={setFiltersAdapter}
                            options={filterOptions}
                        />
                    </div>
                </div>

                {/* MIDDLE COLUMN: Flight Information */}
                <div className="min-[1000px]:col-span-9 min-[1300px]:col-span-7 flex flex-col">

                    {/* Mobile Filters (< 1000px) */}
                    <div className="block min-[1000px]:hidden">
                        <MobileFilterBar
                            filters={activeFilters}
                            setFilters={setFiltersAdapter}
                            options={filterOptions}
                        />
                    </div>

                    {/* Header with Sort Dropdown */}
                    <div className="flex justify-between items-center mb-4 px-2 relative z-20">
                        <h2 className="text-xl font-bold text-white">
                            {pagination ? pagination.totalCount : filteredFlights.length} Flights Found
                        </h2>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors focus:outline-none"
                            >
                                <span>Sort by:</span>
                                <span className="text-white font-semibold flex items-center gap-1">
                                    {sortOptions.find(o => o.value === sortBy)?.label}
                                    <TrendingDown size={14} className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isSortOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.1 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a12] border border-white/10 rounded-xl shadow-xl overflow-hidden py-1 z-50 backdrop-blur-md"
                                    >
                                        {sortOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => handleSortChange(option.value)}
                                                className={clsx(
                                                    "w-full text-left px-4 py-2.5 text-sm transition-colors",
                                                    sortBy === option.value
                                                        ? "bg-sky-500/10 text-sky-400 font-medium"
                                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                                )}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Scrollable List */}
                    <div className="flex-1 space-y-4 pb-20">
                        {filteredFlights.length === 0 ? (
                            <div className="glass-panel p-10 text-center text-slate-500 rounded-2xl">
                                No flights match your filters.
                            </div>
                        ) : (
                            <>
                                {filteredFlights.map((flight, index) => (
                                    <BentoFlightCard
                                        key={flight.id}
                                        id={`flight-card-${flight.id}`}
                                        flight={flight}
                                        index={index}
                                        dictionaries={dictionaries}
                                        onToggle={(isOpen) => handleFlightToggle(flight, isOpen)}
                                        // Pass calculated analysis context for consistent recommendations
                                        batchAnalysis={flightAnalysis}
                                    />
                                ))}

                                {/* Pagination Controls */}
                                {pagination && pagination.totalPages > 1 && (
                                    <PaginationControls
                                        currentPage={pagination.currentPage}
                                        totalPages={pagination.totalPages}
                                        baseUrl="/search"
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Price Graph */}
                <div className="hidden min-[1300px]:block min-[1300px]:col-span-3 space-y-10">
                    <div className="sticky top-24 space-y-6">
                        <PriceHistoryGraph
                            key={filteredFlights.map(f => f.id).join(',')}
                            flights={filteredFlights}
                            priceHistory={priceHistory}
                            selectedDate={selectedDate}
                            returnDate={returnDate}
                            onSelectPricePoint={handlePricePointSelect}
                        />

                        {/* AI Strategist (Replaces Alerts) */}
                        <AIStrategistPanel
                            flights={filteredFlights}
                            currentFilters={activeFilters}
                            onCommand={handleAICommand}
                            selectedFlight={activeFlight}
                            priceHistory={priceHistory}
                            preCalculatedAnalysis={flightAnalysis}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
