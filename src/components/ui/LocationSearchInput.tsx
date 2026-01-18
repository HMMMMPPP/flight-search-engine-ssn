
'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Plane, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIRPORT_DETAILS } from '@/lib/data/airports';

interface Location {
    iataCode: string;
    name: string;
    address: {
        cityName?: string;
        countryName?: string;
    };
    detailedName?: string;
}

interface LocationSearchInputProps {
    name: string;
    placeholder: string;
    defaultValue?: string;
    icon: 'map' | 'plane';
    required?: boolean;
}

export function LocationSearchInput({ name, placeholder, defaultValue, icon, required }: LocationSearchInputProps) {
    const [query, setQuery] = useState(defaultValue || '');
    const [results, setResults] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Timer refs
    const debounceRef = useRef<NodeJS.Timeout>(null);
    const blurTimerRef = useRef<NodeJS.Timeout>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync state with defaultValue prop (e.g. when navigation happens)
    useEffect(() => {
        if (defaultValue) {
            // Check if we have details for this IATA code
            const details = AIRPORT_DETAILS[defaultValue];
            if (details) {
                setQuery(`${details.city}, ${details.country} (${defaultValue})`);
            } else {
                setQuery(defaultValue);
            }
            setIataCode(defaultValue);
        }
    }, [defaultValue]);

    const handleSearch = async (val: string) => {
        if (val.length < 2) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/locations?keyword=${encodeURIComponent(val)}`);
            const json = await res.json();
            if (json.data && Array.isArray(json.data)) {
                setResults(json.data);
                setShowDropdown(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        setIataCode(''); // Clear ID on change so we force re-selection

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            handleSearch(val);
        }, 300);
    };

    const handleSelect = (loc: Location) => {
        // Cancel pending blur check if any
        if (blurTimerRef.current) clearTimeout(blurTimerRef.current);

        setQuery(`${loc.address.cityName || loc.name} (${loc.iataCode})`);
        setIataCode(loc.iataCode);
        setResults([]);
        setShowDropdown(false);
    };

    const handleBlur = () => {
        // Delay checking if we have a valid selection
        blurTimerRef.current = setTimeout(() => {
            if (!iataCode) {
                // Check against the REF equivalent if needed, but since we cleared ID on change,
                // this closure state 'iataCode' is effectively what we want to check.
                // HOWEVER, to be safe against stale closures, we should check a ref OR just assume
                // if this timer fires, IT WASN'T CANCELLED by handleSelect, so implies no selection was made.

                // PROBLEM: iataCode matches the render scope. If we selected, we cancelled this timer.
                // So if this runs, we didn't select.
                // But did we have a value before?
                // If I modify handleChange to clear iataCode, then if this runs, it's truly invalid.

                setQuery('');
            }
        }, 200);
    };

    // We'll use a hidden input to store the actual IATA code for cleaner submission
    const [iataCode, setIataCode] = useState(defaultValue || '');

    return (
        <div className="relative group/input" ref={wrapperRef}>
            {icon === 'map' ? (
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-sky-400 transition" size={18} />
            ) : (
                <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-purple-400 transition" size={18} />
            )}

            <input
                type="text"
                value={query}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
                className={`w-full bg-white/5 border ${showDropdown ? 'border-sky-500/50 rounded-t-xl' : 'border-white/10 rounded-xl'} py-3 pl-9 pr-4 text-white text-sm focus:bg-white/10 focus:border-sky-500/50 outline-none transition-all placeholder:text-slate-600`}
                placeholder={placeholder}
                autoComplete="off"
                required={required}
            />

            {/* The actual value submitted to the server - STRICTLY the IATA Code */}
            <input type="hidden" name={name} value={iataCode} />

            {isLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 className="animate-spin text-slate-500" size={16} />
                </div>
            )}

            <AnimatePresence>
                {showDropdown && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 top-full mt-0 bg-[#1a1a24] border border-white/10 border-t-0 rounded-b-xl shadow-2xl z-50 max-h-[300px] overflow-y-auto custom-scrollbar"
                    >
                        {results.map((loc) => (
                            <button
                                key={loc.iataCode}
                                type="button" // Prevent form sub
                                onClick={() => handleSelect(loc)}
                                className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between group/item transition"
                            >
                                <div>
                                    <div className="text-white font-medium">
                                        {loc.address.cityName} <span className="text-slate-500 text-sm font-normal">({loc.iataCode})</span>
                                    </div>
                                    <div className="text-xs text-slate-400 group-hover/item:text-slate-300">
                                        {loc.name}
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-slate-600 bg-white/5 px-2 py-1 rounded">
                                    {loc.iataCode}
                                </span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
