'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { FilterCriteria, FilterOptions } from '@/types';
import { toTitleCase } from '../FilterShared';
import { AIRPORT_DETAILS } from '@/lib/data/airports';

interface AirportGroupProps {
    country: string;
    codes: string[];
    filters: FilterCriteria;
    /** Adapter to update specific filter fields */
    onUpdate: (updates: Partial<FilterCriteria>) => void;
    options: FilterOptions;
}

export function AirportGroup({ country, codes, filters, onUpdate, options }: AirportGroupProps) {
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
                            onUpdate={onUpdate}
                            options={options}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
}

function AirportCheckbox({ code, filters, onUpdate, options }: {
    code: string,
    filters: FilterCriteria,
    onUpdate: (updates: Partial<FilterCriteria>) => void;
    options: FilterOptions
}) {
    const isSelected = filters.connectingAirports?.includes(code) || false;

    const handleToggle = () => {
        const current = filters.connectingAirports || [];
        const newCodes = current.includes(code) ? current.filter(c => c !== code) : [...current, code];
        onUpdate({ connectingAirports: newCodes });
    };

    return (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${isSelected ? 'bg-sky-500 border-sky-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
                {isSelected && <span className="text-[10px] text-white">✓</span>}
            </div>
            <input
                type="checkbox"
                className="hidden"
                checked={isSelected}
                onChange={handleToggle}
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
