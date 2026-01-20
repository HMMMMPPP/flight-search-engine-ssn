'use client';

import { toTitleCase } from '../FilterShared';
import { FilterOptions } from '@/types';

interface AirlineCheckboxProps {
    airlineCode: string;
    isSelected: boolean;
    onToggle: (airlineCode: string) => void;
    dictionaries?: FilterOptions['dictionaries'];
}

export function AirlineCheckbox({ airlineCode, isSelected, onToggle, dictionaries }: AirlineCheckboxProps) {
    return (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${isSelected ? 'bg-sky-500 border-sky-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
                {isSelected && <span className="text-[10px] text-white">✓</span>}
            </div>
            <input
                type="checkbox"
                className="hidden"
                checked={isSelected}
                onChange={() => onToggle(airlineCode)}
            />
            <span className="text-sm text-slate-400 group-hover:text-white transition truncate max-w-[180px]" title={airlineCode}>
                {(() => {
                    // Amadeus returns 'carriers', not 'airlines' in dictionaries. We check both just in case.
                    const entry = dictionaries?.carriers?.[airlineCode] || dictionaries?.airlines?.[airlineCode];
                    let name = entry || airlineCode;

                    // Title Case
                    if (name) {
                        name = toTitleCase(name);
                        const display = `${name} (${airlineCode})`;
                        return display.length > 25 ? display.slice(0, 25) + '...' : display;
                    }
                    return airlineCode;
                })()}
            </span>
        </label>
    );
}
