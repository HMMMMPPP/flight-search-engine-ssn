'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export function PaginationControls({ currentPage, totalPages, baseUrl }: PaginationControlsProps) {
    const searchParams = useSearchParams();

    // Helper to build URL with existing params + new page
    const getPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    // Generate page numbers to display (Google-style window)
    const getVisiblePages = () => {
        const delta = 2; // Number of pages to show on each side of current
        const range = [];
        const rangeWithDots = [];

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }

        let l;
        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 py-8">
            {/* Previous Button */}
            <Link
                href={getPageUrl(currentPage - 1)}
                className={clsx(
                    "p-2 rounded-lg border border-white/10 transition-all duration-200",
                    currentPage <= 1
                        ? "text-slate-600 cursor-not-allowed pointer-events-none"
                        : "text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/20"
                )}
                aria-disabled={currentPage <= 1}
            >
                <ChevronLeft size={20} />
            </Link>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {getVisiblePages().map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`dots-${index}`} className="px-2 text-slate-600">
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;

                    return (
                        <Link
                            key={pageNum}
                            href={getPageUrl(pageNum)}
                            className={clsx(
                                "min-w-[40px] h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 border",
                                isActive
                                    ? "bg-sky-500 text-white border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                                    : "bg-transparent text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200 hover:border-white/10"
                            )}
                        >
                            {pageNum}
                        </Link>
                    );
                })}
            </div>

            {/* Next Button */}
            <Link
                href={getPageUrl(currentPage + 1)}
                className={clsx(
                    "p-2 rounded-lg border border-white/10 transition-all duration-200",
                    currentPage >= totalPages
                        ? "text-slate-600 cursor-not-allowed pointer-events-none"
                        : "text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/20"
                )}
                aria-disabled={currentPage >= totalPages}
            >
                <ChevronRight size={20} />
            </Link>
        </div>
    );
}
