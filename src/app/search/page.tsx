import { orchestrateSearch } from '@/features/orchestrator/swarm-engine';
import Link from 'next/link';
import { SearchResultsLayout } from '@/components/search/layout/SearchResultsLayout';
import { SearchFormWrapper } from '@/components/search/form/SearchFormWrapper';
import { SearchPageHeader } from '@/components/search/layout/SearchPageHeader';


export const dynamic = 'force-dynamic';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams;
    const origin = resolvedParams.origin as string;
    const destination = resolvedParams.destination as string;
    const date = resolvedParams.date as string;
    const returnDate = resolvedParams.returnDate as string;
    const pax = resolvedParams.pax as string;
    const cabinClass = resolvedParams.cabinClass as string;
    const currency = resolvedParams.currency as string;

    // Execute Search Server-Side
    const formData = new FormData();
    if (origin) formData.append('origin', origin);
    if (destination) formData.append('destination', destination);
    if (date) formData.append('date', date);
    if (returnDate) formData.append('returnDate', returnDate);
    if (pax) formData.append('pax', pax);
    if (cabinClass) formData.append('cabinClass', cabinClass);
    if (currency) formData.append('currency', currency);

    // Use orchestrateSearch directly (server-to-server)
    const { flights, priceHistory, dictionaries } = await orchestrateSearch(formData);

    return (
        <main className="min-h-screen relative text-slate-200 font-sans selection:bg-sky-500/30 bg-[#0a0a12]">

            {/* Client Header Handling Responsiveness */}
            <SearchPageHeader>
                <SearchFormWrapper
                    initialValues={{
                        origin,
                        destination,
                        date,
                        returnDate,
                        pax,
                        cabinClass
                    }}
                />
            </SearchPageHeader>

            {/* 3-Column Layout */}
            <SearchResultsLayout
                initialFlights={flights}
                priceHistory={priceHistory}
                dictionaries={dictionaries}
                selectedDate={date}
                returnDate={returnDate}
            />

        </main>
    );
}
