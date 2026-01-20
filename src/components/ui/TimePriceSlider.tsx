'use client';

import React from 'react';
import { DualRangeSlider } from './DualRangeSlider';

interface TimePriceSliderProps {
    label: string;
    histogram: number[]; // 24 values (price per hour, 0 if no flights)
    window: [number, number];
    onChange: (val: [number, number]) => void;
    onCommit?: (val: [number, number]) => void;
    cityCode?: string;
}

export const TimePriceSlider: React.FC<TimePriceSliderProps> = ({
    label,
    histogram,
    window,
    onChange,
    onCommit,
    cityCode
}) => {
    // 1. Determine Range for Scaling
    // Filter out 0s to find min/max displayed prices
    // ... (rest of logic) ...
    const prices = histogram.filter(p => p > 0);
    const minPrice = Math.min(...prices, 0); // avoid infinity
    const maxPrice = Math.max(...prices, 100);

    const formatTime = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        const mStr = m < 10 ? `0${m}` : m;
        return `${h12}:${mStr} ${ampm}`;
    };

    return (
        <div className="relative group pt-4 pb-2 px-1">
            {/* Histogram Popup */}
            <div className="absolute bottom-full left-0 w-full mb-3 p-3 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-20 pointer-events-none">
                <div className="flex justify-end items-center mb-2 px-1">
                    <span className="text-[10px] text-slate-400 font-mono">Price Distribution</span>
                </div>

                <div className="relative h-20 w-full flex items-end gap-[1px]">
                    {/* Y-Axis Grid Lines (Simplified) */}
                    <div className="absolute inset-0 flex flex-col justify-between opacity-20">
                        <div className="border-t border-dashed border-slate-500 w-full pt-1"></div>
                        <div className="border-t border-dashed border-slate-500 w-full pt-1"></div>
                        <div className="border-t border-dashed border-slate-500 w-full pt-1"></div>
                    </div>

                    {histogram.map((price, hour) => {
                        let heightPercent = 0;
                        if (price > 0) {
                            heightPercent = Math.max((price / maxPrice) * 100, 15);
                        }

                        const startMin = window[0] || 0;
                        const endMin = window[1] || 1440;
                        const hourMin = hour * 60;
                        const isActive = hourMin >= startMin && hourMin < endMin;

                        return (
                            <div key={hour} className="flex-1 flex flex-col justify-end h-full relative group/bar">
                                {/* Price Tooltip per bar */}
                                {price > 0 && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-sky-600 text-[9px] text-white px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-30">
                                        ${price}
                                    </div>
                                )}
                                <div
                                    className={`w-full rounded-t-[1px] transition-all duration-300 ${isActive ? 'bg-sky-500' : 'bg-slate-700'} ${price === 0 ? 'h-0' : ''}`}
                                    style={{ height: `${heightPercent}%` }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Slider Controls (Always Visible) */}
            <div className="relative z-10 space-y-2">
                <div className="flex justify-between items-center -ml-1">
                    <span className="text-sm font-semibold text-slate-300">{label} {cityCode && <span className="text-slate-400">from {cityCode}</span>}</span>
                </div>
                <div className="px-1">
                    <DualRangeSlider
                        min={0}
                        max={1440}
                        minVal={window[0] ?? 0}
                        maxVal={window[1] ?? 1440}
                        onChange={onChange}
                        onCommit={onCommit}
                    />
                </div>
                {/* Time Labels */}
                <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>{formatTime(window[0] ?? 0)}</span>
                    <span>{formatTime(window[1] ?? 1440)}</span>
                </div>
            </div>
        </div>
    );
};
