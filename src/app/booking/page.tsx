import { Suspense } from 'react';
import BookingClient from './BookingClient';

export default function BookingPage() {
    return (
        <main className="min-h-screen bg-[#0a0a12] text-slate-200 font-sans selection:bg-sky-500/30 flex items-center justify-center p-4">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="w-8 h-8 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
                </div>
            }>
                <BookingClient />
            </Suspense>
        </main>
    );
}
