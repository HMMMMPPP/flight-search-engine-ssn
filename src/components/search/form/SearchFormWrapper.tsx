'use client';

import { useRouter } from 'next/navigation';
import { SearchForm } from './SearchForm';
import { useTransition, useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { CompactSearchSummary } from './CompactSearchSummary';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface SearchFormWrapperProps {
    initialValues?: {
        origin?: string;
        destination?: string;
        date?: string;
        returnDate?: string;
        pax?: string;
        cabinClass?: string;
    };
    isOnLandingPage?: boolean;
}

export function SearchFormWrapper({ initialValues, isOnLandingPage = false }: SearchFormWrapperProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { currency, language } = useSettings();

    const handleSearch = (formData: FormData) => {
        startTransition(() => {
            const params = new URLSearchParams();
            params.set('origin', formData.get('origin') as string);
            params.set('destination', formData.get('destination') as string);
            params.set('date', formData.get('date') as string);
            params.set('returnDate', formData.get('returnDate') as string);
            params.set('pax', formData.get('pax') as string || '1');
            params.set('cabinClass', formData.get('cabinClass') as string || 'ECONOMY');

            // Inject Global Settings
            params.set('currency', currency.code);
            params.set('language', language.code);

            router.push(`/search?${params.toString()}`);
            setIsModalOpen(false); // Close modal on search
        });
    };

    return (
        <>
            {/* Desktop View (>= 1300px) */}
            <div className="hidden min-[1300px]:block">
                <SearchForm onSearch={handleSearch} isPending={isPending} initialValues={initialValues} />
            </div>

            {/* Mobile/Tablet View (< 1300px) */}
            <div className="block min-[1300px]:hidden">
                {isOnLandingPage ? (
                    <div className="w-full max-w-md mx-auto">
                        <SearchForm
                            onSearch={handleSearch}
                            isPending={isPending}
                            initialValues={initialValues}
                            layout="vertical"
                        />
                    </div>
                ) : (
                    <CompactSearchSummary
                        values={initialValues || {}}
                        onClick={() => setIsModalOpen(true)}
                    />
                )}
            </div>

            {/* Edit Modal - Rendered via Portal to escape Header Stacking Context */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
                            onClick={(e) => {
                                if (e.target === e.currentTarget) setIsModalOpen(false);
                            }}
                        >
                            <motion.div
                                initial={{ y: "-100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "-100%" }}
                                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                className="absolute top-0 left-0 right-0 sm:static bg-[#0a0a12] w-full sm:max-w-2xl rounded-b-3xl sm:rounded-3xl border-b border-x sm:border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                                drag="y"
                                dragConstraints={{ top: 0, bottom: 0 }}
                                dragElastic={{ top: 0.2, bottom: 0 }}
                                onDragEnd={(e, { offset, velocity }) => {
                                    // Swipe UP to close (drag value is negative)
                                    if (offset.y < -100 || velocity.y < -500) {
                                        setIsModalOpen(false);
                                    }
                                }}
                            >
                                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
                                    <h3 className="text-xl font-bold text-white">Edit Search</h3>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="p-6 overflow-y-auto overscroll-contain pb-safe">
                                    <SearchForm
                                        onSearch={handleSearch}
                                        isPending={isPending}
                                        initialValues={initialValues}
                                        layout="vertical"
                                    />
                                </div>

                                {/* Drag Handle (Visual - Now at Bottom) */}
                                <div className="w-full h-1.5 flex items-center justify-center mt-1 mb-3 sm:hidden shrink-0">
                                    <div className="w-12 h-1.5 rounded-full bg-white/20" />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
