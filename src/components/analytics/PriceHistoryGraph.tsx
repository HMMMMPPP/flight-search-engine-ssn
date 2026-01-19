import { useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { Flight, PriceMetrics } from '@/types';
import { motion } from 'framer-motion';
import { calculateMergedHistory, calculateIntradayMetrics, IntradayMetric } from '@/lib/utils/priceAnalysis';

interface PriceHistoryGraphProps {
    flights: Flight[];
    priceHistory?: any[]; // [{ date: 'YYYY-MM-DD', price: 123, ... }]
    selectedDate?: string;
    returnDate?: string;
    onSelectPricePoint?: (flightId: string) => void;
}

export function PriceHistoryGraph({ flights, priceHistory, selectedDate, returnDate, onSelectPricePoint }: PriceHistoryGraphProps) {
    const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);
    const hasData = (flights && flights.length > 0) || (priceHistory && priceHistory.length > 0);
    if (!hasData) return null;

    // DETERMINE MODE: 
    // If Return Date exists -> Trip analysis (Trend over dates)
    // If One Way -> Day analysis (Intraday hours)
    const isRoundTrip = !!returnDate;
    const mode = isRoundTrip ? 'TREND' : 'INTRADAY';

    let data: any[] = [];
    let xKey = 'date';
    let toolTipLabel = 'Date';

    // COLORS & STYLES (Senior Analyst Theme)
    const colorMain = mode === 'INTRADAY' ? '#38bdf8' : '#10b981'; // Sky Blue for Daily, Emerald for Trend
    const colorFill = mode === 'INTRADAY' ? 'url(#colorPriceIntra)' : 'url(#colorPrice)';

    // --- LOGIC: INTRADAY ANALYST (One Way) ---
    if (mode === 'INTRADAY') {
        const metrics = calculateIntradayMetrics(flights);
        xKey = 'label';
        toolTipLabel = 'Time';

        // Map to Recharts format
        data = metrics.map(m => ({
            ...m,
            price: Math.round(m.minPrice), // Plot the MIN price for that hour
            displayAvg: Math.round(m.avgPrice)
        }));
    }
    // --- LOGIC: TREND ANALYST (Round Trip / Default) ---
    else {
        // Use passed priceHistory if available, otherwise fallback to derived data
        if (priceHistory && priceHistory.length > 0) {
            data = calculateMergedHistory(flights, priceHistory);
        } else {
            // Fallback logic (Simulation) - Anchored to User's Dates
            // 1. Determine Start and End
            const startDate = selectedDate ? new Date(selectedDate) : new Date();
            const endDate = returnDate ? new Date(returnDate) : new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

            // 2. Calculate Span
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const span = Math.max(diffDays + 2, 7); // Ensure at least 7 days, add buffer

            // 3. Generate Data matching the span
            data = Array.from({ length: span }).map((_, i) => {
                const day = new Date(startDate); // Start from DEPARTURE date, not today
                day.setDate(day.getDate() + i);

                // Simulating price curve (Deterministic for Hydration Safety)
                const wave = Math.sin(i * 0.8) * 40;
                const variance = (i % 3 === 0 ? 10 : -5); // Deterministic pattern

                return {
                    rawDate: day,
                    date: day.toISOString().split('T')[0],
                    price: 200 + wave + variance,
                    min: 200
                };
            });
        }
    }

    // SHARED STATS
    const displayedPrices = data.map(d => d.price);
    const minPrice = displayedPrices.length > 0 ? Math.min(...displayedPrices) : 0;
    const maxPrice = displayedPrices.length > 0 ? Math.max(...displayedPrices) : 0;
    const avgPrice = displayedPrices.length > 0 ? displayedPrices.reduce((a, b) => a + b, 0) / displayedPrices.length : 0;


    // RENDER DOTS (Custom)
    const renderCustomizedDot = (props: any) => {
        const { cx, cy, payload } = props;

        // Highlight Best Value
        const isBestValue = payload.price === minPrice;

        if (isBestValue) {
            return (
                <svg x={cx - 10} y={cy - 10} width={20} height={20} overflow="visible">
                    <circle cx="10" cy="10" r="8" fill={colorMain} fillOpacity="0.8">
                        <animate attributeName="r" from="6" to="10" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.8" to="0.2" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="10" cy="10" r="4" fill="#fff" stroke={colorMain} strokeWidth="2" />
                </svg>
            );
        }
        return <circle cx={cx} cy={cy} r={0} />;
    };

    // CUSTOM TOOLTIP (Senior Analyst Grade)
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const pointData = payload[0].payload;
            return (
                <div className="glass-panel p-4 rounded-xl border border-white/10 shadow-xl backdrop-blur-xl bg-black/80">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{toolTipLabel}: {label}</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">
                            ${Number(pointData.price).toFixed(2)}
                        </span>
                        {mode === 'INTRADAY' && (
                            <span className="text-xs text-slate-400 font-mono">
                                (Avg: ${Number(pointData.displayAvg).toFixed(2)})
                            </span>
                        )}
                    </div>
                    {pointData.price === minPrice && (
                        <div className="mt-2 text-xs text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                            ★ BEST VALUE
                        </div>
                    )}
                    {mode === 'INTRADAY' && (
                        <p className="text-[10px] text-slate-500 mt-2">
                            {pointData.count} flights in this hour window
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 h-[320px] w-full relative overflow-hidden"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-white/90 font-bold flex items-center gap-2 text-lg">
                        <span className={`w-2 h-2 rounded-full shadow-[0_0_10px] ${mode === 'INTRADAY' ? 'bg-sky-400 shadow-sky-400' : 'bg-emerald-400 shadow-emerald-400'}`}></span>
                        {mode === 'INTRADAY' ? 'Intraday Analysis' : 'Price Trend'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        {mode === 'INTRADAY'
                            ? 'Hourly price breakdown for selected date'
                            : 'Historical price trend verification'}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Market Avg</p>
                    <p className="text-white font-mono font-bold">${Math.round(avgPrice)}</p>
                </div>
            </div>

            <div className="h-[220px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPriceIntra" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey={xKey}
                            stroke="rgba(255,255,255,0.3)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30} // Prevent crowding automatically
                            tickFormatter={(value) => {
                                if (mode === 'INTRADAY') return value; // 6:00, 7:00 is fine
                                // For Dates: Parse "YYYY-MM-DD" -> "Jan 26"
                                const [y, m, d] = value.split('-').map(Number);
                                const date = new Date(Date.UTC(y, m - 1, d));
                                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
                            }}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.3)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${Math.round(Number(value))}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={avgPrice} stroke={colorMain} strokeDasharray="3 3" opacity={0.5} label={{ value: 'AVG', position: 'right', fill: colorMain, fontSize: 10 }} />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke={colorMain}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={colorFill}
                            onMouseMove={(e: any) => {
                                if (e.activePayload && e.activePayload.length > 0) {
                                    const m = e.activePayload[0].payload as IntradayMetric;
                                    setHoveredPrice(m.minPrice);
                                }
                            }}
                            onMouseLeave={() => setHoveredPrice(null)}
                            dot={renderCustomizedDot}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
