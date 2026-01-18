'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingDown, TrendingUp, Zap, Coffee, Wallet } from 'lucide-react';
import { Flight, FlightAnalysis } from '@/lib/types';
import { analyzeBatch, generateFlightAnalysis } from '@/lib/agents/strategist';

import { AICommandBar } from './AICommandBar';
import { FilterCriteria } from '@/lib/types';


interface AIStrategistPanelProps {
    flights: Flight[];
    currentFilters?: FilterCriteria;
    onCommand?: (action: any) => void;
    selectedFlight?: Flight | null;
    priceHistory?: any[];
    preCalculatedAnalysis?: FlightAnalysis | null;
}

export function AIStrategistPanel({ flights, currentFilters, onCommand, selectedFlight, priceHistory, preCalculatedAnalysis }: AIStrategistPanelProps) {
    // 1. Context Analysis (Batch Stats)
    const context = useMemo(() => {
        if (preCalculatedAnalysis) return preCalculatedAnalysis;
        if (!flights || flights.length === 0) return null;
        return analyzeBatch(flights, priceHistory);
    }, [flights, priceHistory, preCalculatedAnalysis]);

    // 2. Focused Analysis (Selected Flight)
    const activeAnalysis = useMemo(() => {
        if (!selectedFlight || !context) return null;
        return generateFlightAnalysis(selectedFlight, context);
    }, [selectedFlight, context]);

    // 3. Loading State (Skeleton) - Prevents LCP Layout Shift / Late Paint
    if (!context) {
        return (
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 animate-pulse">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-white/10"></div>
                        <div className="h-4 w-32 bg-white/10 rounded"></div>
                    </div>
                    <div className="h-5 w-24 bg-white/5 rounded-full"></div>
                </div>

                {/* Content Skeleton */}
                <div className="relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-4 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-white/10"></div>
                        <div className="h-3 w-40 bg-white/10 rounded"></div>
                    </div>
                    <div className="h-10 w-full bg-white/5 rounded"></div>
                    <div className="h-3 w-2/3 bg-white/5 rounded mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-sky-400 animate-pulse" />
                    <h3 className="text-sm font-semibold text-white">SkySpeed Strategist</h3>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold bg-white/5 px-2 py-1 rounded-full">
                    {selectedFlight ? 'Flight Monitor' : 'Live Analysis'}
                </span>
            </div>

            {/* AI Command Bar */}
            {onCommand && currentFilters && (
                <AICommandBar onAction={onCommand} currentFilters={currentFilters} />
            )}

            <AnimatePresence mode="popLayout">
                {selectedFlight && activeAnalysis ? (
                    <motion.div
                        key="active-analysis"
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, filter: 'blur(4px)', transition: { duration: 0.15 } }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="space-y-4"
                        layout
                    >
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">AI Verdict</span>
                                <span className="text-xs text-slate-400 font-mono">{selectedFlight.airline}</span>
                            </div>
                            <p className="text-lg font-bold text-white leading-tight">
                                {activeAnalysis.prediction}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex gap-3 items-start">
                                <div className="mt-1"><Wallet size={16} className="text-emerald-400" /></div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Price Insight</p>
                                    <p className="text-sm text-slate-200">{activeAnalysis.priceInsight}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 items-start">
                                <div className="mt-1"><TrendingUp size={16} className="text-amber-400" /></div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Efficiency</p>
                                    <p className="text-sm text-slate-200">{activeAnalysis.timeInsight}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* DEFAULT VIEW (Live Monitor) */
                    <motion.div
                        key="default-monitor"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, filter: 'blur(4px)', transition: { duration: 0.15 } }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-4"
                        layout
                    >
                        {/* Scanning Animation Background */}
                        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_340deg,rgba(56,189,248,0.3)_360deg)] opacity-30"
                            />
                        </div>

                        <div className="relative z-10 space-y-5">
                            {/* Live Status Header */}
                            <div className="flex items-center gap-3 mb-2">
                                <div className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </div>
                                <span className="text-xs font-mono font-medium text-emerald-400 tracking-widest uppercase">
                                    System Active • Monitoring
                                </span>
                            </div>


                            {/* Strategy Insight */}
                            <div className="pt-2 border-t border-white/5">
                                <div className="flex items-start gap-2">
                                    <Sparkles size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                    <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                                        Strategy: <span className="text-slate-200">
                                            {context.opportunity ? "Arbitrage detected. Monitoring price gap." : "Baseline established. Awaiting flight selection for comparative analysis."}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Instruction Footer */}
                            <div className="text-center pt-2 border-t border-white/5">
                                <p className="text-[10px] text-slate-500 font-mono animate-pulse">
                                    [ SELECT FLIGHT TO ENGAGE ]
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

