'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders } from 'lucide-react';
import { FilterCriteria, FilterOptions } from '@/types';
import { SmoothSlider } from './FilterShared';
import { TimePriceSlider } from '@/components/ui/TimePriceSlider';
import { AirlineCheckbox } from './shared/AirlineCheckbox';
import { StopsCheckbox } from './shared/StopsCheckbox';
import { AirportGroup } from './shared/AirportGroup';
import { AIRPORT_DETAILS } from '@/lib/data/airports';

interface FilterSidebarProps {
    /** Current active filter criteria */
    filters: FilterCriteria;
    /** State setter for updating filters */
    setFilters: (filters: FilterCriteria) => void;
    /** Available filter options derived from search results (min/max prices, airlines, etc.) */
    options: FilterOptions;
}

/**
 * FilterSidebar Component
 * 
 * A comprehensive sidebar for filtering flight search results.
 * Supports filtering by:
 * - Price range (SmoothSlider)
 * - Duration (SmoothSlider)
 * - Stops (Direct, 1 Stop, 2+ Stops)
 * - Departure/Arrival times (TimePriceSlider with histogram)
 * - Airlines
 * - Baggage allowance
 * - Layover duration
 * - Connecting airports
 */
export function FilterSidebar({ filters, setFilters, options }: FilterSidebarProps) {
    // Local State for Sliders (Performance Optimization)
    // We only trigger the parent `setFilters` (which updates URL) when the user *releases* the slider.
    const [depWindow, setDepWindow] = useState<[number, number]>(filters.departureWindow || [0, 1440]);
    const [arrWindow, setArrWindow] = useState<[number, number]>(filters.arrivalWindow || [0, 1440]);


    const handleAirlineToggle = (airline: string) => {
        const newAirlines = filters.airlines.includes(airline)
            ? filters.airlines.filter((a: string) => a !== airline)
            : [...filters.airlines, airline];
        setFilters({ ...filters, airlines: newAirlines });
    };

    const handleStopToggle = (stopCount: number) => {
        const newStops = filters.stops.includes(stopCount)
            ? filters.stops.filter((s: number) => s !== stopCount)
            : [...filters.stops, stopCount];
        setFilters({ ...filters, stops: newStops });
    };

    /**
     * Formats duration in minutes to "Xh Ym" string
     */
    const formatDuration = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    // Helper to partial update filters (needed for AirportGroup)
    const handlePartialUpdate = (updates: Partial<FilterCriteria>) => {
        setFilters({ ...filters, ...updates });
    };

    return (
        <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-64"
        >
            <div className="glass-panel rounded-2xl p-6 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                    <Sliders size={18} className="text-sky-400" />
                    <h3 className="font-semibold text-white">Filters</h3>
                </div>

                {/* Price Slider */}
                <SmoothSlider
                    label="Max Price"
                    min={options.minPrice}
                    max={options.maxPrice}
                    value={filters.maxPrice}
                    onChange={(val: number) => setFilters({ ...filters, maxPrice: val })}
                    formatLabel={(val: number) => `$${val}`}
                />

                {/* Duration Slider */}
                <SmoothSlider
                    label="Max Duration"
                    min={options.minDuration}
                    max={options.maxDuration}
                    value={filters.maxDuration || options.maxDuration}
                    onChange={(val: number) => setFilters({ ...filters, maxDuration: val })}
                    formatLabel={(val: number) => formatDuration(val)}
                />

                {/* Stops */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-300">Stops</h4>
                    <div className="space-y-2">
                        {[0, 1, 2].map((stop: number) => (
                            <StopsCheckbox
                                key={stop}
                                stopCount={stop}
                                isSelected={filters.stops.includes(stop)}
                                onToggle={handleStopToggle}
                            />
                        ))}
                    </div>
                </div>

                {/* Departure Histogram Slider - Debounced */}
                <div className="pt-2">
                    <TimePriceSlider
                        label="Departure"
                        cityCode={undefined}
                        histogram={options.departureHistogram || new Array(24).fill(0)}
                        window={depWindow}
                        onChange={(vals) => setDepWindow(vals)} // Only update local visual state
                        onCommit={(vals) => setFilters({ ...filters, departureWindow: vals })} // Update Actual Filters on Drop
                    />
                </div>

                {/* Return/Arrival Histogram Slider */}
                <div className="pt-2">
                    <TimePriceSlider
                        label="Return"
                        cityCode={undefined}
                        histogram={options.arrivalHistogram || new Array(24).fill(0)}
                        window={arrWindow}
                        onChange={(vals) => setArrWindow(vals)}
                        onCommit={(vals) => setFilters({ ...filters, arrivalWindow: vals })}
                    />
                </div>

                {/* Baggage (New) */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-300">Baggage</h4>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${filters.hasBaggage ? 'bg-sky-500 border-sky-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
                            {filters.hasBaggage && <span className="text-[10px] text-white">✓</span>}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={filters.hasBaggage || false}
                            onChange={() => setFilters({ ...filters, hasBaggage: !filters.hasBaggage })}
                        />
                        <span className="text-sm text-slate-400 group-hover:text-white transition">Checked Bag Included</span>
                    </label>
                </div>

                {/* Layover Duration (New) */}
                {(options.layoverMax || 0) > 0 && (
                    <SmoothSlider
                        label="Max Layover"
                        min={0}
                        max={options.layoverMax || 0}
                        value={filters.maxLayoverDuration ?? options.layoverMax ?? 0}
                        onChange={(val: number) => setFilters({ ...filters, maxLayoverDuration: val })}
                        formatLabel={(val: number) => formatDuration(val)}
                    />
                )}

                {/* Connecting Airports (Grouped & Collapsible) */}
                {(options.connectingAirports?.length || 0) > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                            <h4 className="text-sm font-semibold text-slate-300">Connecting Airports</h4>
                        </div>

                        <div className="space-y-1">
                            {(() => {
                                // 1. Group by Country
                                const grouped: Record<string, string[]> = {};
                                const unknown: string[] = [];

                                options.connectingAirports?.forEach((code: string) => {
                                    // @ts-ignore
                                    const detail = AIRPORT_DETAILS[code];
                                    if (detail) {
                                        if (!grouped[detail.country]) grouped[detail.country] = [];
                                        grouped[detail.country].push(code);
                                    } else {
                                        unknown.push(code);
                                    }
                                });

                                // 2. Sort Countries
                                const countries = Object.keys(grouped).sort();

                                return (
                                    <>
                                        {countries.map((country: string) => (
                                            <AirportGroup
                                                key={country}
                                                country={country}
                                                codes={grouped[country]}
                                                filters={filters}
                                                onUpdate={handlePartialUpdate}
                                                options={options}
                                            />
                                        ))}

                                        {unknown.length > 0 && (
                                            <AirportGroup
                                                country="Other Regions"
                                                codes={unknown}
                                                filters={filters}
                                                onUpdate={handlePartialUpdate}
                                                options={options}
                                            />
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}

                {/* Airlines */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-300">Airlines</h4>
                    <div className="space-y-2">
                        {(options.airlines || []).map((airline: string) => (
                            <AirlineCheckbox
                                key={airline}
                                airlineCode={airline}
                                isSelected={filters.airlines.includes(airline)}
                                onToggle={handleAirlineToggle}
                                dictionaries={options.dictionaries}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </motion.aside>
    );
}


