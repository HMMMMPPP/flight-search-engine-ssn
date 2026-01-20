'use client';

interface StopsCheckboxProps {
    stopCount: number;
    isSelected: boolean;
    onToggle: (stopCount: number) => void;
}

export function StopsCheckbox({ stopCount, isSelected, onToggle }: StopsCheckboxProps) {
    const label = stopCount === 0 ? 'Direct' : stopCount === 1 ? '1 Stop' : '2+ Stops';

    return (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${isSelected ? 'bg-sky-500 border-sky-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
                {isSelected && <span className="text-[10px] text-white">✓</span>}
            </div>
            <input
                type="checkbox"
                className="hidden"
                checked={isSelected}
                onChange={() => onToggle(stopCount)}
            />
            <span className="text-sm text-slate-400 group-hover:text-white transition">
                {label}
            </span>
        </label>
    );
}
