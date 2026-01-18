'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Globe, Moon, User } from 'lucide-react';
import { LanguageCurrencySelector } from '@/components/ui/LanguageCurrencySelector';
import { SearchFormWrapper } from '@/components/search/form/SearchFormWrapper';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchPageHeaderProps {
    children: React.ReactNode;
}

export function SearchPageHeader({ children }: SearchPageHeaderProps) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <header className="border-b border-white/5 bg-[#0a0a12]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center gap-6">

                {/* Logo & Mobile Settings Trigger */}
                <div className="flex items-center gap-2 shrink-0 relative">
                    <Link href="/" className="font-black text-xl tracking-tighter text-white shrink-0">
                        {/* Desktop: SkySpeed, Mobile: SSN */}
                        <span className="hidden min-[1300px]:inline">SkySpeed</span>
                        <span className="inline min-[1300px]:hidden font-black italic tracking-tighter text-2xl">SSN</span>
                    </Link>

                    {/* Mobile (< 1300px) Settings Dropdown Trigger */}
                    <div className="relative min-[1300px]:hidden">
                        <button
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className="p-1 text-slate-400 hover:text-white transition-colors"
                        >
                            <ChevronDown size={16} className={`transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {isSettingsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full left-0 mt-2 p-3 bg-[#0a0a12] border border-white/10 rounded-xl shadow-xl flex flex-col gap-3 min-w-[140px]"
                                >
                                    <div className="flex items-center gap-3 text-sm text-slate-400">
                                        <div className="scale-90 origin-left">
                                            <ThemeToggle />
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/10" />
                                    <div className="origin-left">
                                        <LanguageCurrencySelector
                                            align="left"
                                            mobileView={true}
                                            onClose={() => setIsSettingsOpen(false)}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Search Form - Fluid */}
                <div className="flex-1">
                    {children}
                </div>

                {/* Desktop (>= 1300px) Settings */}
                <div className="hidden min-[1300px]:flex items-center gap-3 shrink-0">
                    <LanguageCurrencySelector />
                    <ThemeToggle />

                    {/* Account Placeholder (Disabled) */}
                    <button
                        disabled
                        title="This feature is currently in development"
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-white/10 flex items-center justify-center text-slate-400 opacity-40 cursor-not-allowed transition-all"
                    >
                        <User size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}
