'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';

// --- Data ---
const CURRENCIES = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'dh' },
    { code: 'GBP', name: 'Pound Sterling', symbol: '£' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
];

const LANGUAGES = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
];


interface LanguageCurrencySelectorProps {
    align?: 'left' | 'right';
}

const Portal = ({ children }: { children: React.ReactNode }) => {
    if (typeof window === 'undefined') return null;
    return createPortal(children, document.body);
};

export function LanguageCurrencySelector({ align = 'right', mobileView = false, onClose }: LanguageCurrencySelectorProps & { mobileView?: boolean, onClose?: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Use Global Context
    const { currency, setCurrency, language, setLanguage } = useSettings();

    // Close on click outside (only for non-mobile view)
    useEffect(() => {
        if (mobileView) return;

        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileView]);

    // Lock scroll when mobile modal is open
    useEffect(() => {
        if (mobileView && isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileView, isOpen]);

    const content = (
        <motion.div
            initial={mobileView ? { opacity: 0, scale: 0.9 } : { opacity: 0, y: 10, scale: 0.95 }}
            animate={mobileView ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={mobileView ? { opacity: 0, scale: 0.9 } : { opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={mobileView
                ? "fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-xl flex flex-col pt-12 p-4"
                : `absolute top-full mt-3 w-[85vw] sm:w-[600px] bg-slate-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100] flex flex-col sm:flex-row ${align === 'right' ? 'right-0' : 'left-0'}`
            }
        >
            {/* Mobile Header */}


            {/* Content Container - adjust layout based on view */}
            <div className={`flex ${mobileView ? 'flex-col gap-6 flex-1 overflow-hidden' : 'flex-col sm:flex-row flex-1'}`}>

                {/* Column 1: Currency */}
                <div className={`flex flex-col ${mobileView ? 'flex-1 overflow-hidden' : 'flex-1 border-b sm:border-b-0 sm:border-r border-white/5'}`}>
                    <div className={`${mobileView ? 'mb-2' : 'p-4 border-b border-white/5 bg-white/2'}`}>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Select Currency
                        </h3>
                    </div>
                    <div className={`flex-1 p-2 overflow-y-auto custom-scrollbar ${mobileView ? '' : 'max-h-[200px] sm:max-h-[320px]'}`}>
                        <div className="space-y-1">
                            {CURRENCIES.map((c) => (
                                <button
                                    key={c.code}
                                    onClick={() => setCurrency(c)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all group ${currency.code === c.code
                                        ? 'bg-sky-500/10 text-sky-400'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${currency.code === c.code
                                            ? 'bg-sky-500/20 border-sky-500/30 text-sky-300'
                                            : 'bg-white/5 border-white/10 text-slate-500 group-hover:border-white/20'
                                            }`}>
                                            {c.code}
                                        </span>
                                        <span className="font-medium">{c.name}</span>
                                    </div>
                                    {currency.code === c.code && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Column 2: Language */}
                <div className={`flex flex-col ${mobileView ? 'flex-1 overflow-hidden' : 'flex-1'}`}>
                    <div className={`${mobileView ? 'mb-2' : 'p-4 border-b border-white/5 bg-white/2'}`}>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Select Language
                        </h3>
                    </div>
                    <div className={`flex-1 p-2 overflow-y-auto custom-scrollbar ${mobileView ? '' : 'max-h-[200px] sm:max-h-[320px]'}`}>
                        <div className="space-y-1">
                            {LANGUAGES.map((l) => (
                                <button
                                    key={l.code}
                                    onClick={() => setLanguage(l)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${language.code === l.code
                                        ? 'bg-sky-500/10 text-sky-400'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg leading-none shadow-sm">{l.flag}</span>
                                        <span className="font-medium">{l.name}</span>
                                    </div>
                                    {language.code === l.code && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Done Button */}
            {mobileView && (
                <div className="mt-4 pt-4 border-t border-white/10">
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onClose?.();
                        }}
                        className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Done
                    </button>
                </div>
            )}
        </motion.div>
    );

    return (
        <div className="relative" ref={wrapperRef}>
            {/* Trigger (The Circle Space) */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all border ${isOpen
                    ? 'bg-sky-600/20 border-sky-500/50 text-sky-400 shadow-[0_0_15px_rgba(2,132,199,0.3)]'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                aria-label="Select Language and Currency"
            >
                <Globe size={20} strokeWidth={1.5} />
            </button>

            {/* Dropdown / Modal */}
            <AnimatePresence>
                {isOpen && (mobileView ? <Portal>{content}</Portal> : content)}
            </AnimatePresence>
        </div>
    );
}
