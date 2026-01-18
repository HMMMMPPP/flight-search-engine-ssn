'use client';

import { motion } from 'framer-motion';
import { Construction, ArrowLeft, Plane } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function BookingPage() {
    const searchParams = useSearchParams();
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const airline = searchParams.get('airline');
    const price = searchParams.get('price');

    return (
        <main className="min-h-screen bg-[#0a0a12] text-slate-200 font-sans selection:bg-sky-500/30 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full"
            >
                {/* Glass Card */}
                <div className="glass-card rounded-2xl p-8 sm:p-12 border border-white/10 relative overflow-hidden">

                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-sky-500 rounded-full blur-[128px] animate-pulse" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[128px] animate-pulse delay-1000" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="flex justify-center mb-6"
                        >
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                                <Construction size={40} className="text-sky-400" />
                            </div>
                        </motion.div>

                        {/* Heading */}
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl sm:text-4xl font-bold text-white text-center mb-4"
                        >
                            Booking System
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">
                                Coming Soon
                            </span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-slate-400 text-center mb-8 leading-relaxed"
                        >
                            We're building a seamless booking experience that will allow you to complete your flight purchase directly within SkySpeed.
                            Stay tuned for updates!
                        </motion.p>

                        {/* Flight Details (if available) */}
                        {(origin || destination) && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white/5 border border-white/10 rounded-lg p-4 mb-8"
                            >
                                <div className="flex items-center justify-center gap-3 text-sm">
                                    {origin && (
                                        <>
                                            <span className="font-mono font-bold text-sky-400">{origin}</span>
                                            <Plane size={16} className="text-slate-500" />
                                        </>
                                    )}
                                    {destination && (
                                        <span className="font-mono font-bold text-purple-400">{destination}</span>
                                    )}
                                </div>
                                {airline && (
                                    <p className="text-center text-xs text-slate-500 mt-2">
                                        {airline} {price && `• ${price}`}
                                    </p>
                                )}
                            </motion.div>
                        )}

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link
                                href="/search"
                                className="inline-flex items-center justify-center gap-2 bg-white text-black text-sm font-bold py-3 px-6 rounded-lg hover:bg-slate-200 transition-all shadow-lg shadow-white/10 hover:shadow-white/20"
                            >
                                <ArrowLeft size={16} />
                                Back to Search
                            </Link>

                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white text-sm font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-all border border-white/10"
                            >
                                Return Home
                            </Link>
                        </motion.div>

                        {/* Timeline Hint */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-xs text-slate-500 text-center mt-8 font-mono"
                        >
                            Expected Q2 2026 • Follow our development progress
                        </motion.p>
                    </div>
                </div>

                {/* Secondary Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 text-center"
                >
                    <p className="text-xs text-slate-600">
                        For now, you can continue searching for flights and comparing prices with our AI-powered insights.
                    </p>
                </motion.div>
            </motion.div>
        </main>
    );
}
