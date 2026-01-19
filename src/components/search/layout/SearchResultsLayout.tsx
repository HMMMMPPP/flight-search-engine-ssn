'use client';

import { useState, useMemo, useEffect } from 'react';
import { Flight, PriceMetrics, FilterCriteria } from '@/types';
import { FilterSidebar } from '@/components/search/filters/FilterSidebar';
import { BentoFlightCard } from '@/components/flight/BentoFlightCard';
import { PriceHistoryGraph } from '@/components/analytics/PriceHistoryGraph';
import { AIStrategistPanel } from '@/components/ai-assistant/AIStrategistPanel';
import { MobileFilterBar } from '@/components/search/filters/MobileFilterBar';
import { motion, AnimatePresence } from 'framer-motion';
import { extractFilters, filterFlights, parseDuration } from '@/lib/utils/flightFilters';
import { analyzeBatch } from '@/lib/agents/strategist';
import { TrendingDown } from 'lucide-react';
import clsx from 'clsx';

interface SearchResultsLayoutProps {
    initialFlights: Flight[];
    priceHistory?: any[];
    dictionaries?: any;
    selectedDate?: string;
    returnDate?: string;
}

export function SearchResultsLayout({ initialFlights, priceHistory, dictionaries, selectedDate, returnDate }: SearchResultsLayoutProps) {

    // 1. Extract potential filter options from the full dataset
    const filterOptions = useMemo(() => {
        const options = extractFilters(initialFlights);
        return { ...options, dictionaries };
    }, [initialFlights, dictionaries]);

    // 2. Filter State
    const [filters, setFilters] = useState<FilterCriteria>({
        maxPrice: filterOptions.maxPrice,
        airlines: [],
        stops: [],
        maxDuration: undefined
    });

    // Sorting State
    type SortOption = 'best' | 'duration_asc' | 'departure_asc' | 'departure_desc';
    const [sortBy, setSortBy] = useState<SortOption>('best');
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Sort Options Map for UI
    const sortOptions: { label: string; value: SortOption }[] = [
        { label: 'Best Match', value: 'best' },
        { label: 'Fastest First', value: 'duration_asc' },
        { label: 'Earliest Departure', value: 'departure_asc' },
        { label: 'Latest Departure', value: 'departure_desc' },
    ];

    // Helper: Sort Logic
    const sortFlights = (flights: Flight[], sort: SortOption) => {
        const sorted = [...flights];
        switch (sort) {
            case 'best':
            default: // Default: Best Match = Cheapest (Price Ascending)
                return sorted.sort((a, b) => a.price - b.price);
            case 'duration_asc':
                return sorted.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
            case 'departure_asc':
                return sorted.sort((a, b) => new Date(a.departure.time).getTime() - new Date(b.departure.time).getTime());
            case 'departure_desc':
                return sorted.sort((a, b) => new Date(b.departure.time).getTime() - new Date(a.departure.time).getTime());
        }
    };

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

    // Reset filters when options change (new search)
    // Reset filters when options change (new search context)
    useMemo(() => {
        // We use useMemo as a side-effect trigger here or better, useEffect.
        // But better to just reset state if the options ID changes? 
        // actually, let's just use the useEffect intended.
    }, []);

    // Reset filters when a new search is performed
    useEffect(() => {
        setFilters({
            maxPrice: filterOptions.maxPrice,
            airlines: [],
            stops: [],
            maxDuration: undefined,
            departureWindow: undefined,
            arrivalWindow: undefined
        });
        setExpandedFlightIds([]); // Clear selection on new search
    }, [initialFlights, filterOptions.maxPrice]); // specific deps to avoid loops

    // 3. Apply Filters & Sorting
    const filteredFlights = useMemo(() => {
        const filtered = filterFlights(initialFlights, filters);
        return sortFlights(filtered, sortBy);
    }, [initialFlights, filters, sortBy]);

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

            setFilters(prev => ({
                ...prev,
                ...sanitizedCriteria
            }));
        } else if (action.type === 'SORT') {
            // Placeholder: sorting is handled by URL params or client-side sort
            // For now, we'll just log or maybe set a state if we had a sort state
            console.log("AI Sort Request:", action.sortBy);
        } else if (action.type === 'RESCUE') {
            // Placeholder for Rescue logic (e.g., date shift)
            console.log("AI Rescue Request:", action.strategy);
        }
    };

    // 4.5. Flight Analysis Context (Lifted from Panel for shared use)
    const flightAnalysis = useMemo(() => {
        if (!filteredFlights || filteredFlights.length === 0) return null;
        return analyzeBatch(filteredFlights, priceHistory);
    }, [filteredFlights, priceHistory]);

    // 5. Price Point Handler
    const handlePricePointSelect = (flightId: string) => {
        // Find flight
        const targetFlight = initialFlights.find(f => f.id === flightId);
        if (!targetFlight) return;

        // 1. Open it (add to stack)
        // Force open to ensure it activates in the Strategist Panel
        handleFlightToggle(targetFlight, true);

        // 2. Scroll to it (Put on Top)
        setTimeout(() => {
            const element = document.getElementById(`flight-card-${flightId}`);
            if (element) {
                // block: 'start' aligns the top of the element with the top of the visible area
                // smooth scrolling for better UX
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Optional: visual cue
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
                            filters={filters}
                            setFilters={setFilters}
                            options={filterOptions}
                        />
                    </div>
                </div>

                {/* MIDDLE COLUMN: Flight Information */}
                <div className="min-[1000px]:col-span-9 min-[1300px]:col-span-7 flex flex-col">

                    {/* Mobile Filters (< 1000px) */}
                    <div className="block min-[1000px]:hidden">
                        <MobileFilterBar
                            filters={filters}
                            setFilters={setFilters}
                            options={filterOptions}
                        />
                    </div>

                    {/* Header with Sort Dropdown */}
                    <div className="flex justify-between items-center mb-4 px-2 relative z-20">
                        <h2 className="text-xl font-bold text-white">
                            {filteredFlights.length} Flights Found
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
                                                onClick={() => {
                                                    setSortBy(option.value);
                                                    setIsSortOpen(false);
                                                }}
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
                            filteredFlights.map((flight, index) => (
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
                            ))
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
                            currentFilters={filters}
                            onCommand={handleAICommand}
                            selectedFlight={activeFlight}
                            priceHistory={priceHistory}
                            // Pass the already calculated analysis
                            preCalculatedAnalysis={flightAnalysis}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
