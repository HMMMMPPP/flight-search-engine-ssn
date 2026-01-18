import { Plane, Calendar, User } from 'lucide-react';
import { formatDate } from '@/lib/utils/date'; // Adjusted import path

interface CompactSearchSummaryProps {
    values: {
        origin?: string;
        destination?: string;
        date?: string;
        returnDate?: string;
        pax?: string;
        cabinClass?: string;
    };
    onClick: () => void;
}

export function CompactSearchSummary({ values, onClick }: CompactSearchSummaryProps) {
    const originCode = values.origin?.toUpperCase() || '???';
    const destCode = values.destination?.toUpperCase() || '???';

    // Format Date Range
    const formatDateShort = (d?: string) => {
        if (!d) return '';
        const dateObj = new Date(d);
        return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const dateRange = values.returnDate
        ? `${formatDateShort(values.date)} - ${formatDateShort(values.returnDate)}`
        : formatDateShort(values.date);

    return (
        <button
            onClick={onClick}
            className="w-full bg-[#13131f] border border-white/10 text-white rounded-2xl px-5 py-4 flex items-center gap-4 hover:bg-[#1c1c2e] transition-all text-left shadow-xl"
        >
            {/* Details */}
            <div className="flex flex-col leading-tight gap-1">
                <div className="font-bold text-lg flex items-center gap-2 text-white/90">
                    <span className="text-white">{originCode}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-white">{destCode}</span>
                </div>
                <div className="text-sm font-medium text-slate-400 flex items-center gap-3">
                    <span>{dateRange}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span className="flex items-center gap-1">
                        <User size={12} strokeWidth={2.5} />
                        {values.pax || 1}
                    </span>
                </div>
            </div>

            {/* Edit Icon */}
            <div className="ml-auto text-slate-500">
                <Calendar size={20} />
            </div>
        </button>
    );
}
