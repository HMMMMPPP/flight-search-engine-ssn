import { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Plane, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { LocationSearchInput } from '@/components/ui/LocationSearchInput';
import { TravellersSelector } from './TravellersSelector';
import { DatePicker } from '@/components/ui/DatePicker';
import { formatDateISO } from '@/lib/utils/date';


/**
 * Structure of the search form data expected by the parent
 */
export interface SearchFormData {
    origin: string;
    destination: string;
    date: string;
    returnDate?: string;
    pax: string;
    cabinClass: string;
}

interface SearchFormProps {
    /** Server action or handler to execute search */
    onSearch: (formData: FormData) => void;
    /** Loading state indicator */
    isPending: boolean;
    /** Optional initial values to populate the form (e.g. from URL params) */
    initialValues?: Partial<SearchFormData>;
    /** Layout orientation of the form */
    layout?: 'horizontal' | 'vertical';
}

/**
 * SearchForm Component
 * 
 * Main flight search interface.
 * - Supports Horizontal (Desktop/Nav) and Vertical (Mobile/Landing) layouts
 * - Managed inputs for Date / Return Date to ensure logic (Return > Departure)
 * - Controlled components for complex inputs (Location, DatePicker)
 * - Submits via native FormData for Server Actions
 */
export function SearchForm({ onSearch, isPending, initialValues, layout = 'horizontal' }: SearchFormProps) {
    const today = formatDateISO(new Date());

    const [date, setDate] = useState(initialValues?.date || '');
    const [returnDate, setReturnDate] = useState(initialValues?.returnDate || '');

    // Ensure Return Date is never before Departure Date
    useEffect(() => {
        if (date && returnDate && returnDate < date) {
            setReturnDate(date);
        }
    }, [date, returnDate]);

    // Sync with initialParams from URL
    useEffect(() => {
        if (initialValues) {
            if (initialValues.date) setDate(initialValues.date);
            if (initialValues.returnDate) setReturnDate(initialValues.returnDate);
        }
    }, [initialValues]);

    const isVertical = layout === 'vertical';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full relative z-10 flex items-center gap-3 ${isVertical ? 'flex-col' : ''}`}
        >
            <form
                action={onSearch} // Added action back to form
                className={`flex-1 flex flex-col items-stretch bg-[#0a0a12] border border-white/5 shadow-2xl rounded-3xl ${isVertical ? 'w-full gap-4 p-6' : 'p-2 lg:flex-row lg:items-center gap-2'
                    }`}
            >
                {/* 1. Origin Input */}
                <div className="flex-1 min-w-[160px] relative">
                    <LocationSearchInput
                        name="origin"
                        placeholder="From?"
                        defaultValue={initialValues?.origin}
                        icon="map"
                        required
                    />
                </div>

                {/* Swap Icon (Visual) */}
                <div className={`${isVertical ? 'hidden' : 'hidden lg:flex'} items-center justify-center text-slate-600 px-1`}>
                    <Plane className="rotate-90" size={16} />
                </div>

                {/* 2. Destination Input */}
                <div className="flex-1 min-w-[160px] relative">
                    <LocationSearchInput
                        name="destination"
                        placeholder="To?"
                        defaultValue={initialValues?.destination}
                        icon="plane"
                        required
                    />
                </div>

                {/* Vertical Divider */}
                <div className={`${isVertical ? 'hidden' : 'hidden lg:block'} w-px h-8 bg-white/10 mx-2`} />

                {/* 3. Dates Group */}
                <div className={`flex items-center gap-2 ${isVertical ? 'flex-col w-full' : ''}`}>
                    {/* Departure */}
                    <div className={`min-w-[120px] ${isVertical ? 'w-full' : ''}`}>
                        <DatePicker
                            value={date}
                            onChange={(d) => setDate(d)}
                            minDate={today}
                            placeholder="Departure"
                        />
                    </div>

                    {/* Return */}
                    <div className={`min-w-[120px] relative group ${isVertical ? 'w-full' : ''}`}>
                        <DatePicker
                            value={returnDate}
                            onChange={(d) => setReturnDate(d)}
                            minDate={date || today}
                            placeholder="Return"
                        />
                        {/* Clear Button (Visible when date is set) */}
                        {returnDate && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setReturnDate('');
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white bg-[#0a0a12]/50 hover:bg-[#0a0a12] rounded-full transition-all opacity-0 group-hover:opacity-100"
                                aria-label="Clear Return Date"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Hidden inputs to support server action FormData */}
                    <input type="hidden" name="date" value={date} />
                    <input type="hidden" name="returnDate" value={returnDate} />
                </div>

                {/* Vertical Divider */}
                <div className={`${isVertical ? 'hidden' : 'hidden lg:block'} w-px h-8 bg-white/10 mx-2`} />

                {/* 4. Travellers & Class Selector */}
                <div className={`h-[52px] min-w-[170px] ${isVertical ? 'w-full' : ''}`}>
                    <TravellersSelector
                        initialPax={initialValues?.pax}
                        initialClass={initialValues?.cabinClass}
                    />
                </div>

                {/* 5. Submit Button - Always on Right */}
                <div className={`flex-1 ${isVertical ? 'w-full flex-none' : 'lg:flex-none'}`}>
                    <button
                        disabled={isPending}
                        type="submit"
                        className="w-full h-[52px] px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        {isPending ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                        ) : (
                            <>
                                <Search size={20} />
                                {isVertical ? (
                                    <span>Find Flights</span>
                                ) : (
                                    <>
                                        <span className="hidden lg:inline">Search</span>
                                        <span className="lg:hidden">Find Flights</span>
                                    </>
                                )}
                            </>
                        )}
                    </button>
                </div>
            </form>

        </motion.div>
    );
}
