
import { NextResponse } from 'next/server';
import { amadeusService } from '@/lib/services/amadeus';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');

    if (!keyword || keyword.length < 2) {
        return NextResponse.json({ data: [] });
    }

    try {
        const locations = await amadeusService.searchLocations(keyword);

        // Deduplicate by IATA Code to prevent React key errors
        // (Amadeus sometimes returns City and Airport with same code, or multiple entries)
        const uniqueLocations = locations.filter((loc: any, index: number, self: any[]) =>
            index === self.findIndex((l) => l.iataCode === loc.iataCode)
        );

        return NextResponse.json({ data: uniqueLocations });
    } catch (error) {
        console.error('Location API Error:', error);
        return NextResponse.json({ data: [] }, { status: 500 });
    }
}
