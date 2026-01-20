'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';

interface DualRangeSliderProps {
    min: number;
    max: number;
    minVal: number;
    maxVal: number;
    onChange: (values: [number, number]) => void;
    onCommit?: (values: [number, number]) => void;
    formatLabel?: (val: number) => string;
}

export const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
    min,
    max,
    minVal,
    maxVal,
    onChange,
    onCommit,
    formatLabel
}) => {
    const [minValState, setMinValState] = useState(minVal);
    const [maxValState, setMaxValState] = useState(maxVal);
    const minValRef = useRef(minVal);
    const maxValRef = useRef(maxVal);
    const range = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Convert to percentage
    const getPercent = useCallback(
        (value: number) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    // Set width of the range to decrease from the left side
    useEffect(() => {
        const minPercent = getPercent(minValState);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minValState, getPercent]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxValState);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxValState, getPercent]);

    // Props change: SYNC ONLY IF NOT DRAGGING
    useEffect(() => {
        if (!isDragging) {
            setMinValState(minVal);
            setMaxValState(maxVal);
            minValRef.current = minVal;
            maxValRef.current = maxVal;
        }
    }, [minVal, maxVal, isDragging]);

    const handleCommit = () => {
        setIsDragging(false);
        if (onCommit) {
            onCommit([minValState, maxValState]);
        }
    };

    const handleStart = () => {
        setIsDragging(true);
    };

    return (
        <div className="container relative h-12 flex items-center justify-center w-full">
            <input
                type="range"
                min={min}
                max={max}
                value={minValState}
                onChange={(event) => {
                    const value = Math.min(Number(event.target.value), maxValState - 1);
                    setMinValState(value);
                    minValRef.current = value;
                    onChange([value, maxValState]);
                }}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                onMouseUp={handleCommit}
                onTouchEnd={handleCommit}
                className="thumb thumb--left z-[3] absolute w-full pointer-events-none opacity-0 cursor-pointer h-0"
                style={{ zIndex: minValState > max - 100 ? 5 : 3 }}
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxValState}
                onChange={(event) => {
                    const value = Math.max(Number(event.target.value), minValState + 1);
                    setMaxValState(value);
                    maxValRef.current = value;
                    onChange([minValState, value]);
                }}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                onMouseUp={handleCommit}
                onTouchEnd={handleCommit}
                className="thumb thumb--right z-[4] absolute w-full pointer-events-none opacity-0 cursor-pointer h-0"
            />

            <div className="slider relative w-full">
                <div className="slider__track absolute rounded h-1 bg-slate-700 w-full z-[1]" />
                <div ref={range} className="slider__range absolute rounded h-1 bg-sky-500 z-[2]" />

                {/* Visual Thumbs (Since inputs are hidden/overlay) */}
                <div
                    className="absolute w-4 h-4 bg-sky-400 rounded-full -mt-1.5 -ml-2 z-[5] pointer-events-none shadow-md border border-white/20"
                    style={{ left: `${getPercent(minValState)}%` }}
                />
                <div
                    className="absolute w-4 h-4 bg-sky-400 rounded-full -mt-1.5 -ml-2 z-[5] pointer-events-none shadow-md border border-white/20"
                    style={{ left: `${getPercent(maxValState)}%` }}
                />
            </div>

            <style jsx>{`
                /* Custom styles for the invisible inputs that handle interaction */
                input[type='range']::-webkit-slider-thumb {
                    pointer-events: auto;
                    width: 24px;
                    height: 24px;
                    background-color: transparent; 
                    -webkit-appearance: none;
                }
            `}</style>
        </div>
    );
};
