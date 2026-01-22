'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe, MapPin, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Trend {
    city: string;
    code: string;
    price: number;
    tag: string;
    growth: string;
}

export function TrendStrategist() {
    const [trends, setTrends] = useState<Trend[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTrends() {
            try {
                // In a real app, successful fetching depends on the Amadeus "Inspiration" endpoint
                // working for the specific origin (e.g., LHR).
                // We'll call an internal API that proxies to Amadeus.
                const res = await fetch('/api/trends?origin=LHR');
                const data = await res.json();
                if (data.trends) {
                    setTrends(data.trends);
                }
            } catch (e) {
                console.error("Failed to fetch trends", e);
            } finally {
                setLoading(false);
            }
        }
        fetchTrends();
    }, []);

    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto p-10 flex justify-center">
                <div className="flex items-center gap-2 text-sky-400">
                    <Sparkles className="animate-spin" size={20} />
                    <span className="text-sm">Analyzing Global Networks...</span>
                </div>
            </div>
        );
    }

    // Fallback if API returns no data (common in test environment)
    // We render nothing instead of mocks to strictly follow user instructions.
    if (trends.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full max-w-4xl mx-auto"
        >
            <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden">

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl -z-10" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                            <Globe size={20} className="text-sky-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Global Trend Strategist</h3>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Live Duffel Data
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {trends.map((trend) => (
                        <Link
                            href={`/search?origin=LHR&destination=${trend.code}`} // Quick Search Link
                            key={trend.code}
                            className="group relative p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-sky-500/30 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="px-2 py-1 bg-white/5 rounded-md text-[10px] font-medium text-sky-400 border border-white/10">
                                    {trend.tag}
                                </div>
                                <div className={`text-xs font-bold ${trend.growth.startsWith('+') ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {trend.growth}
                                </div>
                            </div>

                            <div className="flex items-end justify-between">
                                <div>
                                    <h4 className="text-xl font-bold text-white group-hover:text-sky-200 transition">
                                        {trend.city}
                                    </h4>
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <MapPin size={10} />
                                        <span>{trend.code}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">Est.</p>
                                    <p className="text-lg font-bold text-white">${trend.price}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
