'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MONTH_NAMES, DAYS_SHORT, getDaysInMonth, getFirstDayOfMonth, addMonths, isSameDay, isToday, formatDateISO, formatDate, isBeforeDate } from '@/lib/utils/date';

interface DatePickerProps {
    value?: string;
    onChange: (date: string) => void;
    placeholder?: string;
    minDate?: string;
    className?: string;
    mobileView?: boolean;
}


export function DatePicker({ value, onChange, placeholder = 'Select Date', minDate, className = '', mobileView = false }: DatePickerProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Parse value or default to today for calendar view
    const selectedDate = value ? new Date(value) : null;

    // Sync calendar view to selected val or minDate on open
    useEffect(() => {
        if (isOpen) {
            if (selectedDate) {
                setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth()));
            } else if (minDate) {
                // If minDate is set, ensure we show at least that month?
                // Actually if minDate is today, we want to show today's month.
                // Standard behavior: show current month unless value is selected.

                // Correction: If current view is in the past relative to minDate, jump to minDate
                const [y, m] = minDate.split('-').map(Number);
                const min = new Date(y, m - 1);
                if (currentMonth < min) {
                    setCurrentMonth(min);
                }
            }
        }
    }, [isOpen]);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // If in mobile view, the backdrop handles the click (see below)
            // But if we clicked the trigger, we toggle.
            // If we are in desktop view, we use ref check.
            if (!mobileView && wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileView]);

    const handlePrevMonth = () => setCurrentMonth(prev => addMonths(prev, -1));
    const handleNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));

    const handleDayClick = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

        // Use logic function to prevent unavailable dates
        if (isBeforeDate(date, minDate)) return;

        const iso = formatDateISO(date);
        onChange(iso);
        setIsOpen(false);
    };

    const generateDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(month, year);
        const firstDay = getFirstDayOfMonth(month, year); // 0 = Sunday

        const days = [];
        // Empty slots
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} />);
        }

        // Actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
            const isCurrentDay = isToday(date);
            const isDisabled = isBeforeDate(date, minDate);

            days.push(
                <button
                    key={day}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleDayClick(day)}
                    className={`
                        w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center transition-all relative
                        ${isDisabled ? 'text-slate-600 cursor-not-allowed opacity-50' : 'hover:bg-white/10 text-white cursor-pointer'}
                        ${isSelected ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 font-bold z-10' : ''}
                        ${!isSelected && isCurrentDay && !isDisabled ? 'text-sky-400 font-bold' : ''}
                    `}
                >
                    {day}
                    {!isSelected && isCurrentDay && !isDisabled && (
                        <div className="absolute -bottom-1 w-1 h-1 bg-sky-400 rounded-full" />
                    )}
                </button>
            );
        }
        return days;
    };

    // Calendar Content Component to avoid duplication
    const CalendarContent = () => (
        <div className={`
             bg-[#1a1a24] border border-white/10 rounded-2xl shadow-2xl p-4
             ${mobileView ? 'w-[300px]' : 'w-[280px]'}
        `}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-white font-bold text-sm pl-1">
                    {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <div className="flex gap-1">
                    <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition">
                        <ChevronLeft size={16} />
                    </button>
                    <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 mb-2">
                {DAYS_SHORT.map(d => (
                    <div key={d} className="text-center text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-y-1 justify-items-center">
                {generateDays()}
            </div>
        </div>
    );

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            {/* Display Input Trigger */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full h-[52px] bg-white/5 border rounded-xl flex items-center pl-10 pr-3 cursor-pointer transition-all group
                    ${isOpen ? 'border-sky-500/50 bg-white/10' : 'border-white/10 hover:border-white/20'}
                `}
            >
                <input type="hidden" value={value || ''} />
                <CalendarIcon
                    size={16}
                    className={`absolute left-3 transition-colors ${isOpen ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-300'}`}
                />

                <span className={`text-sm ${value ? 'text-white font-medium' : 'text-slate-500'}`}>
                    {value ? formatDate(value) : placeholder}
                </span>
            </div>

            {/* Popover */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {mobileView && mounted ? (
                            // Mobile Modal via Portal
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
                                        <CalendarContent />
                                    </motion.div>
                                </motion.div>,
                                document.body
                            )
                        ) : (
                            // Desktop Dropdown
                            !mobileView && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    className="absolute top-[calc(100%+8px)] left-0 z-50"
                                >
                                    <CalendarContent />
                                </motion.div>
                            )
                        )}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}


