'use client';

import { Flight, FlightAnalysis } from '@/lib/types';
import { motion } from 'framer-motion';
import { Luggage, Armchair, TrendingUp, TrendingDown, Info } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import { AIRPORT_CODES } from '@/lib/data/airports';
import { useSettings } from '@/context/SettingsContext';
import { getFlightRecommendationType } from '@/lib/agents/strategist';
import { useRouter, useSearchParams } from 'next/navigation';

interface BentoFlightCardProps {
    flight: Flight;
    index: number;
    dictionaries?: any;
    onToggle?: (isOpen: boolean) => void;
    id?: string;
    batchAnalysis?: FlightAnalysis | null;
}

export function BentoFlightCard({ flight, index, dictionaries, onToggle, id, batchAnalysis }: BentoFlightCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const isBestVibe = flight.vibe?.score ? flight.vibe.score > 8.5 : false;
    const router = useRouter();
    const searchParams = useSearchParams();

    // Helper for names
    const getLocationName = (code: string) => {
        // 1. Try API Dictionary
        if (dictionaries?.locations?.[code]) {
            const entry = dictionaries.locations[code];
            if (typeof entry === 'string') return entry;
            // @ts-ignore
            if (entry?.name) return entry.name;
        }

        // 2. Try Static Fallback
        if (AIRPORT_CODES[code]) {
            return AIRPORT_CODES[code];
        }

        // 3. Fallback to Code
        return code;
    };

    // Helper to format time to 12h format (e.g., 10:30 PM)
    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    // Helper to format date (e.g. 1 FEB)
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toUpperCase();
    };

    // Check for next day arrival
    const isNextDay = (dep: string, arr: string) => {
        const d1 = new Date(dep);
        const d2 = new Date(arr);
        return d2.getDate() !== d1.getDate();
    };

    // Helper for Airline Names
    const getAirlineName = (code: string) => {
        if (dictionaries?.carriers?.[code]) return dictionaries.carriers[code];
        if (dictionaries?.airlines?.[code]) return dictionaries.airlines[code];
        return code;
    };

    const toTitleCase = (str: string) => {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const originName = toTitleCase(getLocationName(flight.departure.code));
    const destName = toTitleCase(getLocationName(flight.arrival.code));
    const airlineName = toTitleCase(getAirlineName(flight.airline));

    // Logo Error State
    const [logoError, setLogoError] = useState(false);
    const logoUrl = `https://pics.avs.io/200/200/${flight.airline}.png`;

    const { currency } = useSettings();

    // Determine Dynamic Recommendation
    let recommendationLabel = 'BUY NOW';
    let recommendationColor = 'text-emerald-400';

    if (batchAnalysis) {
        const type = getFlightRecommendationType(flight, batchAnalysis);
        if (type === 'monitor') {
            recommendationLabel = 'WAIT';
            recommendationColor = 'text-amber-400';
        } else if (type === 'fair') {
            recommendationLabel = 'FAIR VALUE';
            recommendationColor = 'text-blue-400';
        }
    } else if (flight.prediction?.recommendation === 'monitor') {
        recommendationLabel = 'WAIT';
        recommendationColor = 'text-amber-400';
    }

    return (
        <motion.div
            id={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={clsx(
                "glass-card rounded-xl p-6 relative group overflow-hidden transition-all duration-300 hover:bg-white/5 border border-white/10",
                isExpanded ? "mb-4" : "mb-4",
                isBestVibe ? "border-sky-400/30" : "border-white/10"
            )}
        >
            {/* Top Row: Airline & Price - Simplified */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-6">
                    {/* Airline Logo or Fallback */}
                    <div className="flex items-center justify-center">
                        {!logoError ? (
                            <div className="flex items-center justify-start h-16 w-48 sm:w-64 md:w-80 overflow-hidden relative">
                                <img
                                    src={logoUrl}
                                    alt={airlineName}
                                    className="h-full w-full object-contain object-left scale-[2] sm:scale-[2.5] md:scale-[3] lg:scale-[3.5] xl:scale-[4] origin-left brightness-0 invert opacity-90"
                                    onError={() => setLogoError(true)}
                                />
                            </div>
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
                                <span className="text-black font-bold text-sm">
                                    {flight.airline.slice(0, 2).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                    <div>
                        {isBestVibe && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                Vibe {flight.vibe?.score}
                            </span>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-white">{currency.symbol}{Number(flight.price).toFixed(2)}</span>
                </div>
            </div>

            {/* Flight Segment Rows */}
            <div className="flex flex-col gap-6 mb-6">

                {/* Outbound Leg */}
                <FlightLegRow
                    departure={flight.departure}
                    arrival={flight.arrival}
                    duration={flight.duration}
                    segments={flight.segments}
                    dictionaries={dictionaries}
                    formatTime={formatTime}
                    formatDate={formatDate}
                    getLocationName={getLocationName}
                    isNextDay={isNextDay}
                />

                {/* Return Leg (if exists) */}
                {flight.returnFlight && (
                    <div className="relative pt-6 border-t border-white/5">
                        <FlightLegRow
                            departure={flight.returnFlight.departure}
                            arrival={flight.returnFlight.arrival}
                            duration={flight.returnFlight.duration}
                            segments={flight.returnFlight.segments}
                            dictionaries={dictionaries}
                            formatTime={formatTime}
                            formatDate={formatDate}
                            getLocationName={getLocationName}
                            isNextDay={isNextDay}
                        />
                    </div>
                )}
            </div>

            {/* Actions / Prediction Row */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                {/* Prediction or Info */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            const willExpand = !isExpanded;
                            setIsExpanded(willExpand);
                            if (onToggle) onToggle(willExpand);
                        }}
                        className="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                        <Info size={14} />
                        {isExpanded ? 'Hide Details' : 'Flight Details'}
                    </button>

                    <span className={clsx(
                        "text-xs font-bold uppercase tracking-wider",
                        recommendationColor
                    )}>
                        {recommendationLabel}
                    </span>
                </div>

                <button
                    onClick={() => {
                        // Clicking Select implies we are interested
                        if (onToggle) onToggle(true);

                        // Navigate to booking page with flight details
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('origin', flight.departure.code);
                        params.set('destination', flight.arrival.code);
                        params.set('airline', airlineName);
                        params.set('price', `${currency.symbol}${Number(flight.price).toFixed(2)}`);

                        router.push(`/booking?${params.toString()}`);
                    }}
                    className="bg-white text-black text-sm font-bold py-2 px-6 rounded-lg hover:bg-slate-200 transition-colors shadow-lg shadow-white/5 flex items-center gap-2"
                >
                    <span>Select</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                </button>
            </div>

            {/* Expanded Content (TrueCost) */}
            {isExpanded && flight.trueCost && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/5 space-y-3 bg-white/5 -mx-5 -mb-5 p-5"
                >
                    <div className="flex justify-between text-sm text-slate-400">
                        <span className="flex items-center gap-2"><Luggage size={14} /> Baggage (25kg)</span>
                        <span>+{currency.symbol}{Number(flight.trueCost.baggageFee).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-400">
                        <span className="flex items-center gap-2"><Armchair size={14} /> Seat Selection</span>
                        <span>+{currency.symbol}{Number(flight.trueCost.seatSelectionFee).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg text-white font-bold pt-2 border-t border-white/5">
                        <span>Total (TrueCost™)</span>
                        <span>{currency.symbol}{Number(flight.trueCost.total).toFixed(2)}</span>
                    </div>

                    {flight.vibe && (
                        <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <div className="text-xs text-purple-400 font-semibold mb-1 uppercase tracking-wider">Vibe Check</div>
                            <p className="text-sm text-purple-200">{flight.vibe.description}</p>
                        </div>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}

function FlightLegRow({ departure, arrival, duration, segments, dictionaries, formatTime, formatDate, getLocationName, isNextDay }: any) {
    const originName = getLocationName(departure.code);
    const destName = getLocationName(arrival.code);

    return (
        <div className="flex items-center justify-between px-2">
            {/* Departure */}
            <div className="flex flex-col text-left min-w-[90px] sm:min-w-[120px]">
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-light text-white tracking-tighter">
                        {formatTime(departure.time).split(' ')[0]}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-400 font-medium">
                        {formatTime(departure.time).split(' ')[1]}
                    </span>
                </div>
                <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                    {formatDate(departure.time)}
                </div>
                <div className="text-sm text-slate-300 mt-1 font-medium truncate max-w-[140px]" title={originName}>
                    {originName.split(' ')[0]}
                </div>
            </div>

            {/* Route Visual */}
            <div className="flex-1 flex flex-col items-center px-1 sm:px-6 relative">
                <div className="text-sm text-slate-400 mb-3 font-medium">{duration}</div>

                {/* Route Line Container */}
                <div className="relative w-full h-8 flex items-center justify-center">
                    {/* Line */}
                    <div className="absolute left-0 right-0 h-[1px] bg-slate-600 top-1/2 -translate-y-1/2"></div>
                    {/* Start Dot */}
                    <div className="absolute left-0 w-2 h-2 rounded-full border border-slate-500 bg-[#0a0a12] top-1/2 -translate-y-1/2 z-10"></div>
                    {/* End Dot */}
                    <div className="absolute right-0 w-2 h-2 rounded-full border border-slate-500 bg-[#0a0a12] top-1/2 -translate-y-1/2 z-10"></div>
                    {/* Stop Dots */}
                    {segments && segments.length > 1 && segments.slice(0, -1).map((_: any, idx: number, arr: any[]) => (
                        <div
                            key={idx}
                            className="absolute w-2 h-2 rounded-full border border-slate-500 bg-[#0a0a12] top-1/2 -translate-y-1/2 z-10 -ml-1"
                            style={{ left: `${(idx + 1) * (100 / (arr.length + 1))}%` }}
                        ></div>
                    ))}
                </div>

                {/* Labels Row */}
                <div className="relative w-full h-6">
                    <span className="absolute left-0 text-xs font-bold text-slate-500 -translate-x-1/4">{departure.code}</span>
                    <span className="absolute right-0 text-xs font-bold text-slate-500 translate-x-1/4">{arrival.code}</span>
                    {(!segments || segments.length <= 1) ? (
                        <span className="absolute inset-x-0 top-0 text-center text-[10px] font-bold text-slate-500/50 uppercase tracking-widest hidden sm:block">
                            Direct Flight
                        </span>
                    ) : (
                        segments.slice(0, -1).map((seg: any, idx: number, arr: any[]) => (
                            <span
                                key={idx}
                                className="absolute top-0 text-xs font-bold text-slate-500 -translate-x-1/2"
                                style={{ left: `${(idx + 1) * (100 / (arr.length + 1))}%` }}
                            >
                                {seg.arrival.iataCode}
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* Arrival */}
            <div className="flex flex-col text-right min-w-[90px] sm:min-w-[120px]">
                <div className="flex items-baseline justify-end gap-1">
                    {isNextDay(departure.time, arrival.time) && (
                        <span className="text-xs font-bold text-rose-500 mr-1">+1</span>
                    )}
                    <span className="text-3xl sm:text-4xl font-light text-white tracking-tighter">
                        {formatTime(arrival.time).split(' ')[0]}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-400 font-medium">
                        {formatTime(arrival.time).split(' ')[1]}
                    </span>
                </div>
                <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                    {formatDate(arrival.time)}
                </div>
                <div className="text-sm text-slate-300 mt-1 font-medium truncate max-w-[140px] ml-auto" title={destName}>
                    {destName.split(' ')[0]}
                </div>
            </div>
        </div>
    );
}
