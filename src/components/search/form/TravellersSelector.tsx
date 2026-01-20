'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Users, ChevronDown, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TravellersSelectorProps {
    initialPax?: string;
    initialClass?: string;
    mobileView?: boolean;
}


type PassengerType = 'Adults' | 'Students' | 'Youths' | 'Children' | 'Toddlers' | 'Infants';

const PASSENGER_TYPES: { type: PassengerType; label: string; subLabel: string; minAge?: number }[] = [
    { type: 'Adults', label: 'Adults', subLabel: '18+' },
    { type: 'Students', label: 'Students', subLabel: 'over 18' },
    { type: 'Youths', label: 'Youths', subLabel: '12-17' },
    { type: 'Children', label: 'Children', subLabel: '2-11' },
    { type: 'Toddlers', label: 'Toddlers', subLabel: 'in own seat' },
    { type: 'Infants', label: 'Infants', subLabel: 'on lap' },
];

const CABIN_CLASSES = [
    { value: 'ECONOMY', label: 'Economy' },
    { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'FIRST', label: 'First' },
];

export function TravellersSelector({ initialPax = "1", initialClass = "ECONOMY", mobileView = false }: TravellersSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // State for separate counts
    const [counts, setCounts] = useState<Record<PassengerType, number>>({
        Adults: parseInt(initialPax) || 1,
        Students: 0,
        Youths: 0,
        Children: 0,
        Toddlers: 0,
        Infants: 0
    });

    const [selectedClass, setSelectedClass] = useState(initialClass);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!mobileView && wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileView]);

    // ... (updateCount logic same)
    const updateCount = (type: PassengerType, delta: number) => {
        setCounts(prev => {
            const newVal = Math.max(0, prev[type] + delta);
            return { ...prev, [type]: newVal };
        });
    };

    const totalPax = Object.values(counts).reduce((a, b) => a + b, 0);
    useEffect(() => {
        if (totalPax === 0) {
            setCounts(prev => ({ ...prev, Adults: 1 }));
        }
    }, [totalPax]);

    const displayClass = CABIN_CLASSES.find(c => c.value === selectedClass)?.label || selectedClass;

    const SelectorContent = () => (
        <div className={`bg-[#1a1a24] border border-white/10 rounded-2xl shadow-2xl p-4 overflow-hidden 
            ${mobileView ? 'w-[320px] max-w-[90vw]' : 'w-[320px]'}
        `}>
            {/* Review: Travelers Header */}
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Travelers</div>

            <div className="space-y-1 mb-6 max-h-[240px] overflow-y-auto custom-scrollbar pr-2">
                {PASSENGER_TYPES.map((item) => (
                    <div key={item.type} className="flex items-center justify-between py-2">
                        <div>
                            <div className="text-sm text-white font-medium">{item.label}</div>
                            <div className="text-xs text-slate-500">{item.subLabel}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => updateCount(item.type, -1)}
                                disabled={counts[item.type] === 0 || (totalPax === 1 && counts[item.type] === 1)}
                                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <Minus size={14} />
                            </button>
                            <span className="w-4 text-center text-sm text-white font-medium">{counts[item.type]}</span>
                            <button
                                type="button"
                                onClick={() => updateCount(item.type, 1)}
                                disabled={totalPax >= 9}
                                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 -mx-4 mb-4" />

            {/* Review: Cabin Class Header */}
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Cabin Class</div>

            <div className="grid grid-cols-2 gap-2">
                {CABIN_CLASSES.map((cabin) => (
                    <button
                        key={cabin.value}
                        type="button"
                        onClick={() => setSelectedClass(cabin.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${selectedClass === cabin.value
                            ? 'bg-sky-600/20 border-sky-500/50 text-sky-400'
                            : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'
                            }`}
                    >
                        {cabin.label}
                    </button>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-sm text-sky-400 hover:text-sky-300 font-semibold"
                >
                    Done
                </button>
            </div>
        </div>
    );

    return (
        <div className="relative h-full" ref={wrapperRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`h-full flex items-center gap-2 px-3 bg-white/5 border ${isOpen ? 'border-sky-500/50' : 'border-white/10'} hover:border-white/20 rounded-xl transition-all outline-none min-w-[160px] justify-between`}
            >
                <div className="flex items-center gap-2 text-white">
                    <Users size={16} className="text-slate-400" />
                    <span className="text-sm font-medium">
                        {totalPax} Traveler{totalPax !== 1 ? 's' : ''}, {displayClass === 'Premium Economy' ? 'Prem. Eco' : displayClass}
                    </span>
                </div>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Hidden Inputs for Form Submission */}
            <input type="hidden" name="pax" value={totalPax} />
            <input type="hidden" name="adults" value={counts.Adults + counts.Students + counts.Youths} />
            <input type="hidden" name="children" value={counts.Children + counts.Toddlers} />
            <input type="hidden" name="infants" value={counts.Infants} />
            <input type="hidden" name="cabinClass" value={selectedClass} />

            {/* Popover */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {mobileView && mounted ? (
                            createPortal(
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, y: 20 }}
                                        animate={{ scale: 1, y: 0 }}
                                        exit={{ scale: 0.9, y: 20 }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <SelectorContent />
                                    </motion.div>
                                </motion.div>,
                                document.body
                            )
                        ) : (
                            !mobileView && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute top-[calc(100%+8px)] right-0 z-50"
                                >
                                    <SelectorContent />
                                </motion.div>
                            )
                        )}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}


