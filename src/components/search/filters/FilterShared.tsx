'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { FilterCriteria, FilterOptions } from '@/lib/types';
import { AIRPORT_DETAILS } from '@/lib/data/airports';
import { TimePriceSlider } from '@/components/ui/TimePriceSlider';

// --- Shared Types ---
export interface FilterSharedProps {
    filters: FilterCriteria;
    setFilters: React.Dispatch<React.SetStateAction<FilterCriteria>>;
    options: FilterOptions;
}

// --- Shared Components ---
export function FilterSection({ title, children, isOpen = true }: { title: string, children: React.ReactNode, isOpen?: boolean }) {
    const [isExpanded, setIsExpanded] = useState(isOpen);

    return (
        <div className="border-b border-white/10 py-5 last:border-0">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full mb-4 group"
            >
                <h3 className="text-sm font-semibold text-white group-hover:text-sky-400 transition-colors">{title}</h3>
                <ChevronDown
                    size={16}
                    className={`text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
            </button>
            <motion.div
                initial={false}
                animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
            >
                <div className="space-y-4">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}

// --- Helper Functions ---
export const toTitleCase = (str: string) => {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
};

export const groupAirportsByCountry = (codes: string[]) => {
    const grouped: Record<string, string[]> = {};
    const unknown: string[] = [];

    codes.forEach(code => {
        // @ts-ignore
        const detail = AIRPORT_DETAILS[code];
        if (detail) {
            if (!grouped[detail.country]) grouped[detail.country] = [];
            grouped[detail.country].push(code);
        } else {
            unknown.push(code);
        }
    });

    return { grouped, unknown, countries: Object.keys(grouped).sort() };
};

// --- Smooth Slider Component ---
export interface SmoothSliderProps {
    min: number;
    max: number;
    value: number;
    onChange: (val: number) => void;
    formatLabel?: (val: number) => string;
    label: string;
}

export function SmoothSlider({ min, max, value, onChange, formatLabel, label }: SmoothSliderProps) {
    const [localValue, setLocalValue] = useState(value);
    const [isDragging, setIsDragging] = useState(false);

    // Sync with external value when not dragging or when external value changes significantly
    if (value !== localValue && !isDragging) {
        setLocalValue(value);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = Number(e.target.value);
        setLocalValue(newVal);
    };

    const handleCommit = () => {
        setIsDragging(false);
        onChange(localValue);
    };

    const handleStart = () => {
        setIsDragging(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between text-sm">
                <span className="text-slate-400">{label}</span>
                <span className="text-white font-mono">
                    {formatLabel ? formatLabel(localValue) : localValue}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={localValue}
                onChange={handleChange}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                onMouseUp={handleCommit}
                onTouchEnd={handleCommit}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
        </div>
    );
}

// --- Country Group & Airport Checkbox ---

export function CountryGroup({ country, codes, filters, setFilters, options }: {
    country: string,
    codes: string[],
    filters: FilterCriteria,
    setFilters: (f: FilterCriteria) => void,
    options: FilterOptions
}) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-white/5 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-2 hover:bg-white/5 transition px-2 rounded-lg group"
            >
                <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 uppercase tracking-wider">{country}</span>
                {isOpen ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
            </button>

            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pl-2 pb-2 space-y-2 overflow-hidden"
                >
                    {codes.map(code => (
                        <AirportCheckbox
                            key={code}
                            code={code}
                            filters={filters}
                            setFilters={setFilters}
                            options={options}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
}

export function AirportCheckbox({ code, filters, setFilters, options }: {
    code: string,
    filters: FilterCriteria,
    setFilters: (f: FilterCriteria) => void,
    options: FilterOptions
}) {
    return (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${filters.connectingAirports?.includes(code) ? 'bg-sky-500 border-sky-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
                {filters.connectingAirports?.includes(code) && <span className="text-[10px] text-white">✓</span>}
            </div>
            <input
                type="checkbox"
                className="hidden"
                checked={filters.connectingAirports?.includes(code) || false}
                onChange={() => {
                    const current = filters.connectingAirports || [];
                    const newCodes = current.includes(code) ? current.filter(c => c !== code) : [...current, code];
                    setFilters({ ...filters, connectingAirports: newCodes });
                }}
            />
            <span className="text-sm text-slate-400 group-hover:text-white transition truncate max-w-[180px]" title={code}>
                {(() => {
                    // @ts-ignore
                    const localDetails = AIRPORT_DETAILS[code];
                    if (localDetails) {
                        return `${localDetails.city} (${code})`;
                    }

                    const entry = options.dictionaries?.locations?.[code];
                    let name = code;
                    if (entry && typeof entry === 'object') {
                        // @ts-ignore
                        name = entry.name || entry.detailedName || entry.cityCode || code;
                    } else if (typeof entry === 'string') {
                        name = entry;
                    }

                    if (name === code) return code;
                    const display = `${toTitleCase(name)} (${code})`;
                    return display.length > 25 ? display.slice(0, 25) + '...' : display;
                })()}
            </span>
        </label>
    );
}
