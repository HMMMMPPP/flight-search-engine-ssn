import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { FilterCriteria, FilterOptions } from '@/types';
import { toTitleCase, SmoothSlider, groupAirportsByCountry } from './FilterShared';
import { TimePriceSlider } from '@/components/ui/TimePriceSlider';
import { AirlineCheckbox } from './shared/AirlineCheckbox';
import { StopsCheckbox } from './shared/StopsCheckbox';
import { AirportGroup } from './shared/AirportGroup';
import { AIRPORT_DETAILS } from '@/lib/data/airports';

interface MobileFilterBarProps {
    filters: FilterCriteria;
    setFilters: (filters: FilterCriteria) => void;
    options: FilterOptions;
}

export function MobileFilterBar({ filters, setFilters, options }: MobileFilterBarProps) {
    // Draft State: Stores changes locally while the drawer is open.
    // We initialize it with the props, and sync it whenever the drawer opens or filters change externally.
    const [draftFilters, setDraftFilters] = useState<FilterCriteria>(filters);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Sync draft state with actual filters when specific events happen
    useEffect(() => {
        // Only sync if the drawer is closed to prevent overwriting user's work in progress
        // OR if the user just opened the drawer (we'll handle that in the open handler usually, 
        // but syncing on prop change is good practice if background updates happen).
        if (!activeCategory) {
            setDraftFilters(filters);
        }
    }, [filters, activeCategory]);

    // Handle Opening Drawer
    const openDrawer = (category: string) => {
        setDraftFilters(filters); // Reset draft to current "committed" state
        setActiveCategory(category);
    };

    const closeDrawer = () => {
        setActiveCategory(null);
        // We don't apply changes on close (Cancel behavior). 
        // Changes are only applied via "Show Results".
    };

    const applyFilters = () => {
        setFilters(draftFilters);
        setActiveCategory(null);
    };

    const resetFilters = () => {
        setDraftFilters({
            maxPrice: options.maxPrice,
            airlines: [],
            stops: [],
            maxDuration: options.maxDuration,
            hasBaggage: false,
            maxLayoverDuration: options.layoverMax,
            connectingAirports: []
        });
    };

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

    // Helper for shared components to update draft state
    const handlePartialUpdate = (updates: Partial<FilterCriteria>) => {
        setDraftFilters({ ...draftFilters, ...updates });
    };

    const renderFilterContent = (category: string) => {
        switch (category) {
            case 'price':
                return (
                    <div className="space-y-4">
                        <p className="text-slate-400 text-sm">Limit the maximum price for your trip.</p>
                        <SmoothSlider
                            label="Max Price"
                            min={options.minPrice}
                            max={options.maxPrice}
                            value={draftFilters.maxPrice} // Use Draft
                            onChange={(val) => setDraftFilters({ ...draftFilters, maxPrice: val })}
                            formatLabel={(val) => `$${val}`}
                        />
                    </div>
                );
            case 'stops':
                return (
                    <div className="space-y-4">
                        {[0, 1, 2].map(stop => (
                            <div key={stop} className="p-4 bg-white/5 rounded-xl">
                                <StopsCheckbox
                                    stopCount={stop}
                                    isSelected={draftFilters.stops.includes(stop)}
                                    onToggle={(val) => {
                                        const newStops = draftFilters.stops.includes(val)
                                            ? draftFilters.stops.filter(s => s !== val)
                                            : [...draftFilters.stops, val];
                                        setDraftFilters({ ...draftFilters, stops: newStops });
                                    }}
                                />
                            </div>
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
                            window={draftFilters.departureWindow || [0, 1440]} // Use Draft
                            onChange={(vals: number[]) => setDraftFilters({ ...draftFilters, departureWindow: vals as [number, number] })}
                        />
                        <div className="h-px bg-white/10" />
                        <TimePriceSlider
                            label="Return Time"
                            cityCode={undefined}
                            histogram={options.arrivalHistogram || new Array(24).fill(0)}
                            window={draftFilters.arrivalWindow || [0, 1440]} // Use Draft
                            onChange={(vals: number[]) => setDraftFilters({ ...draftFilters, arrivalWindow: vals as [number, number] })}
                        />
                    </div>
                );
            case 'airlines':
                return (
                    <div className="space-y-2">
                        {(options.airlines || []).map((airline: string) => (
                            <div key={airline} className="p-3 hover:bg-white/5 rounded-lg">
                                <AirlineCheckbox
                                    airlineCode={airline}
                                    isSelected={draftFilters.airlines.includes(airline)}
                                    onToggle={(val) => {
                                        const newAirlines = draftFilters.airlines.includes(val)
                                            ? draftFilters.airlines.filter(a => a !== val)
                                            : [...draftFilters.airlines, val];
                                        setDraftFilters({ ...draftFilters, airlines: newAirlines });
                                    }}
                                    dictionaries={options.dictionaries}
                                />
                            </div>
                        ))}
                    </div>
                );
            case 'duration':
                return (
                    <div className="space-y-4">
                        <p className="text-slate-400 text-sm">Maximum flight duration.</p>
                        <SmoothSlider
                            label="Max Duration"
                            min={options.minDuration}
                            max={options.maxDuration}
                            value={draftFilters.maxDuration || options.maxDuration} // Use Draft
                            onChange={(val) => setDraftFilters({ ...draftFilters, maxDuration: val })}
                            formatLabel={(val) => {
                                const h = Math.floor(val / 60);
                                const m = val % 60;
                                return `${h}h ${m}m`;
                            }}
                        />
                    </div>
                );
            case 'baggage':
                return (
                    <div className="space-y-4">
                        <p className="text-slate-400 text-sm">Baggage preferences.</p>
                        <label className="flex items-center gap-4 p-4 bg-white/5 rounded-xl cursor-pointer">
                            <input
                                type="checkbox"
                                checked={draftFilters.hasBaggage || false} // Use Draft
                                onChange={() => setDraftFilters({ ...draftFilters, hasBaggage: !draftFilters.hasBaggage })}
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
                                value={draftFilters.maxLayoverDuration ?? options.layoverMax ?? 0} // Use Draft
                                onChange={(val: number) => setDraftFilters({ ...draftFilters, maxLayoverDuration: val })}
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
                                                <AirportGroup
                                                    key={country}
                                                    country={country}
                                                    codes={grouped[country]}
                                                    filters={draftFilters}
                                                    onUpdate={handlePartialUpdate}
                                                    options={options}
                                                />
                                            ))}
                                            {unknown.length > 0 && (
                                                <AirportGroup
                                                    country="Other Regions"
                                                    codes={unknown}
                                                    filters={draftFilters}
                                                    onUpdate={handlePartialUpdate}
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
                    onClick={() => openDrawer('all')}
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
                        onClick={() => openDrawer(cat.id)}
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
                        {/* Drawer */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-[#0a0a12] rounded-t-3xl z-[70] max-h-[85vh] border-t border-white/10 flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0a0a12] shrink-0 rounded-t-3xl">
                                <h3 className="text-lg font-bold text-white capitalize">{activeCategory === 'all' ? 'All Filters' : `${activeCategory} Filter`}</h3>
                                <button onClick={closeDrawer} className="p-2 bg-white/5 rounded-full text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
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
                            <div className="p-4 bg-[#0a0a12] border-t border-white/10 flex gap-4 shrink-0 pb-8 sm:pb-4">
                                <button
                                    onClick={resetFilters}
                                    className="flex-1 py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={applyFilters}
                                    className="flex-[2] py-4 bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20"
                                >
                                    Show Results
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
