'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { FilterCriteria, FilterOptions } from '@/types';
import { FilterSection, toTitleCase, SmoothSlider, CountryGroup, groupAirportsByCountry } from './FilterShared';
import { TimePriceSlider } from '@/components/ui/TimePriceSlider';
import { AIRPORT_DETAILS } from '@/lib/data/airports';

interface MobileFilterBarProps {
    filters: FilterCriteria;
    setFilters: (filters: FilterCriteria) => void;
    options: FilterOptions;
}

export function MobileFilterBar({ filters, setFilters, options }: MobileFilterBarProps) {
    const [activeDefaults, setActiveDefaults] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const categories = [
        { id: 'price', label: `Max $${filters.maxPrice}` },
        { id: 'stops', label: filters.stops.length ? `${filters.stops.length} Types` : 'Stops' },
        { id: 'times', label: 'Times' },
        { id: 'airlines', label: 'Airlines' },
        { id: 'duration', label: 'Duration' },
        { id: 'baggage', label: filters.hasBaggage ? 'Baggage' : 'Baggage' },
        { id: 'layover', label: 'Max Layover' },
        { id: 'airports', label: 'Airports' }
    ];

    const closeDrawer = () => setActiveCategory(null);

    const renderFilterContent = (category: string) => {
        switch (category) {
            case 'price':
                return (
                    <div className="space-y-4">
                        <p className="text-slate-400 text-sm">Limit the maximum price for your trip.</p>
                        <input
                            type="range"
                            min={options.minPrice}
                            max={options.maxPrice}
                            value={filters.maxPrice}
                            onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                        <div className="flex justify-between font-mono text-white">
                            <span>${options.minPrice}</span>
                            <span>${filters.maxPrice}</span>
                        </div>
                    </div>
                );
            case 'stops':
                return (
                    <div className="space-y-4">
                        {[0, 1, 2].map(stop => (
                            <label key={stop} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.stops.includes(stop)}
                                    onChange={() => {
                                        const newStops = filters.stops.includes(stop)
                                            ? filters.stops.filter((s: number) => s !== stop)
                                            : [...filters.stops, stop];
                                        setFilters({ ...filters, stops: newStops });
                                    }}
                                    className="w-5 h-5 accent-sky-500"
                                />
                                <span className="text-white font-medium">
                                    {stop === 0 ? 'Direct Flights' : stop === 1 ? '1 Stop' : '2+ Stops'}
                                </span>
                            </label>
                        ))}
                    </div>
                );
            case 'times':
                return (
                    <div className="space-y-8">
                        <TimePriceSlider
                            label="Departure Time"
                            cityCode={undefined}
                            histogram={options.departureHistogram || new Array(24).fill(0)}
                            window={filters.departureWindow || [0, 1440]}
                            onChange={(vals: number[]) => setFilters({ ...filters, departureWindow: vals as [number, number] })}
                        />
                        <div className="h-px bg-white/10" />
                        <TimePriceSlider
                            label="Return Time"
                            cityCode={undefined}
                            histogram={options.arrivalHistogram || new Array(24).fill(0)}
                            window={filters.arrivalWindow || [0, 1440]}
                            onChange={(vals: number[]) => setFilters({ ...filters, arrivalWindow: vals as [number, number] })}
                        />
                    </div>
                );
            case 'airlines':
                return (
                    <div className="space-y-2">
                        {(options.airlines || []).map((airline: string) => (
                            <label key={airline} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg cursor-pointer">
                                <span className="text-slate-300">{airline}</span>
                                <input
                                    type="checkbox"
                                    checked={filters.airlines.includes(airline)}
                                    onChange={() => {
                                        const newAirlines = filters.airlines.includes(airline)
                                            ? filters.airlines.filter((a: string) => a !== airline)
                                            : [...filters.airlines, airline];
                                        setFilters({ ...filters, airlines: newAirlines });
                                    }}
                                    className="w-5 h-5 accent-sky-500 rounded"
                                />
                            </label>
                        ))}
                    </div>
                );
            case 'duration':
                return (
                    <div className="space-y-4">
                        <p className="text-slate-400 text-sm">Maximum flight duration.</p>
                        <input
                            type="range"
                            min={options.minDuration}
                            max={options.maxDuration}
                            value={filters.maxDuration || options.maxDuration}
                            onChange={(e) => setFilters({ ...filters, maxDuration: Number(e.target.value) })}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                        <div className="flex justify-between font-mono text-white">
                            <span>{Math.floor(options.minDuration / 60)}h</span>
                            <span>{Math.floor((filters.maxDuration || options.maxDuration) / 60)}h</span>
                        </div>
                    </div>
                );
            case 'baggage':
                return (
                    <div className="space-y-4">
                        <p className="text-slate-400 text-sm">Baggage preferences.</p>
                        <label className="flex items-center gap-4 p-4 bg-white/5 rounded-xl cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.hasBaggage || false}
                                onChange={() => setFilters({ ...filters, hasBaggage: !filters.hasBaggage })}
                                className="w-5 h-5 accent-sky-500"
                            />
                            <span className="text-white font-medium">Checked Bag Included</span>
                        </label>
                    </div>
                );
            case 'layover':
                return (
                    <div className="space-y-4">
                        <p className="text-slate-400 text-sm">Maximum layover duration.</p>
                        {(options.layoverMax || 0) > 0 ? (
                            <SmoothSlider
                                label="Max Layover"
                                min={0}
                                max={options.layoverMax || 0}
                                value={filters.maxLayoverDuration ?? options.layoverMax ?? 0}
                                onChange={(val: number) => setFilters({ ...filters, maxLayoverDuration: val })}
                                formatLabel={(val: number) => {
                                    const h = Math.floor(val / 60);
                                    const m = val % 60;
                                    return `${h}h ${m}m`;
                                }}
                            />
                        ) : (
                            <div className="text-slate-500">No layover data available.</div>
                        )}
                    </div>
                );
            case 'airports':
                return (
                    <div className="space-y-4">
                        <p className="text-slate-400 text-sm">Select connecting airports.</p>
                        {(options.connectingAirports?.length || 0) > 0 ? (
                            <div className="space-y-1">
                                {(() => {
                                    if (!options.connectingAirports) return null;
                                    const { grouped, unknown, countries } = groupAirportsByCountry(options.connectingAirports);
                                    return (
                                        <>
                                            {countries.map((country: string) => (
                                                <CountryGroup
                                                    key={country}
                                                    country={country}
                                                    codes={grouped[country]}
                                                    filters={filters}
                                                    setFilters={setFilters}
                                                    options={options}
                                                />
                                            ))}
                                            {unknown.length > 0 && (
                                                <CountryGroup
                                                    country="Other Regions"
                                                    codes={unknown}
                                                    filters={filters}
                                                    setFilters={setFilters}
                                                    options={options}
                                                />
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        ) : (
                            <div className="text-slate-500">No connecting airports available.</div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };








    return (
        <div className="mb-4">
            {/* Horizontal Scroll List */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-4 px-4">
                {/* All Filters Button */}
                <button
                    onClick={() => setActiveCategory('all')}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium border transition-all flex items-center gap-2
                        ${activeCategory === 'all'
                            ? 'bg-sky-500 text-white border-sky-500'
                            : 'bg-[#0a0a12] text-slate-300 border-white/10 hover:border-white/30'
                        }`}
                >
                    <div className="flex flex-col gap-[3px]">
                        <div className="w-4 h-0.5 bg-current rounded-full" />
                        <div className="w-4 h-0.5 bg-current rounded-full" />
                        <div className="w-4 h-0.5 bg-current rounded-full" />
                    </div>
                </button>

                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium border transition-all flex items-center gap-2
                            ${activeCategory === cat.id
                                ? 'bg-sky-500 text-white border-sky-500'
                                : 'bg-[#0a0a12] text-slate-300 border-white/10 hover:border-white/30'
                            }`}
                    >
                        {cat.label}
                        <ChevronDown size={14} className="opacity-50" />
                    </button>
                ))}
            </div>

            {/* Filter Drawer / Bottom Sheet */}
            <AnimatePresence>
                {activeCategory && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeDrawer}
                            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-[#0a0a12] rounded-t-3xl z-[70] max-h-[85vh] overflow-y-auto border-t border-white/10"
                        >
                            <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0a0a12] z-50">
                                <h3 className="text-lg font-bold text-white capitalize">{activeCategory === 'all' ? 'All Filters' : `${activeCategory} Filter`}</h3>
                                <button onClick={closeDrawer} className="p-2 bg-white/5 rounded-full text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-8 pb-12">
                                {/* Scrollable Content */}
                                <div className="p-6 space-y-8 pb-32">
                                    {activeCategory === 'all' ? (
                                        // Render ALL categories
                                        categories.map(cat => (
                                            <div key={cat.id} className="space-y-4 pt-4 first:pt-0 border-b border-white/10 last:border-0 pb-6 last:pb-0">
                                                <h4 className="text-white font-semibold text-lg">{cat.label.includes('Max') || cat.label.includes('Types') ? cat.id.charAt(0).toUpperCase() + cat.id.slice(1) : cat.label}</h4>
                                                {renderFilterContent(cat.id)}
                                            </div>
                                        ))
                                    ) : (
                                        // Render SINGLE category
                                        renderFilterContent(activeCategory!)
                                    )}
                                </div>

                                {/* Fixed Footer */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0a0a12] border-t border-white/10 flex gap-4 backdrop-blur-xl">
                                    <button
                                        onClick={() => {
                                            // Reset logic here - assumes initial defaults or passed props could handle it better.
                                            // For now we just manual reset to safe defaults or we can pass a reset function prop.
                                            // Since we don't have a direct 'reset' prop, we can manually set to 'empty' values
                                            // OR ideally we should trigger the parent reset.
                                            // Given the context, let's just close for now or do a partial reset if possible.
                                            // User requested "Reset" button.
                                            setFilters({
                                                maxPrice: options.maxPrice,
                                                airlines: [],
                                                stops: [],
                                                maxDuration: options.maxDuration,
                                                hasBaggage: false,
                                                maxLayoverDuration: options.layoverMax,
                                                connectingAirports: []
                                            });
                                        }}
                                        className="flex-1 py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={closeDrawer}
                                        className="flex-[2] py-4 bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20"
                                    >
                                        Show Results
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
