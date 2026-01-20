'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { FilterCriteria, FilterOptions } from '@/types';
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

    // Sync with external value ONLY when it changes and we are NOT dragging.
    // We use useEffect to avoid render-loop issues and ensure this only happens on prop updates.
    useEffect(() => {
        if (!isDragging) {
            setLocalValue(value);
        }
    }, [value]);
    // ^ Critical: Dependency is ONLY [value]. 
    // We do NOT want to re-sync when isDragging changes to false, because 'value' prop might still be old.

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


