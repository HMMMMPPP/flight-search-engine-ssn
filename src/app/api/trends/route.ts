import { NextRequest, NextResponse } from 'next/server';
import { amadeusService } from '@/lib/services/amadeus';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const origin = searchParams.get('origin') || 'LHR';

    try {
        // Fetch Real Trends from Amadeus
        // Note: The 'Flight Inspiration' endpoint returns destinations from an origin
        // filtered by price.
        const inspirationData = await amadeusService.getFlightInspiration(origin);

        if (!inspirationData || inspirationData.length === 0) {
            return NextResponse.json({ trends: [] });
        }

        // Transform Data for UI
        // Amadeus returns: { destination: "MAD", price: { total: "123.45" }, ... }
        const trends = inspirationData.slice(0, 3).map((item: any) => ({
            city: getNameFromCode(item.destination),
            code: item.destination,
            price: Math.floor(parseFloat(item.price.total)),
            tag: getTagForPrice(parseFloat(item.price.total)),
            growth: '+5%' // Placeholder as growth data isn't in this specific endpoint
        }));

        return NextResponse.json({ trends });

    } catch (error: any) {
        // Log concise error for Amadeus System Errors (500) to avoid console noise
        if (error?.response?.statusCode === 500) {
            console.warn(`[Amadeus API] Trends endpoint unavailable (500): ${error?.response?.body ? JSON.parse(error.response.body).errors?.[0]?.title : 'Unknown Error'}`);
        } else {
            console.error("Trends API Error:", error.message || error);
        }
        return NextResponse.json({ trends: [] }); // Fail gracefully
    }
}

// Helper to map codes to city names (Mock dictionary for now, or use dictionaires if available)
// In a real app complexity, we'd use the Dictionaries API.
function getNameFromCode(code: string): string {
    const map: Record<string, string> = {
        'MAD': 'Madrid', 'CDG': 'Paris', 'JFK': 'New York', 'DXB': 'Dubai',
        'AMS': 'Amsterdam', 'FRA': 'Frankfurt', 'BCN': 'Barcelona', 'FCO': 'Rome',
        'IST': 'Istanbul', 'SIN': 'Singapore', 'HND': 'Tokyo'
    };
    return map[code] || code;
}

function getTagForPrice(price: number): string {
    if (price < 200) return 'Super Deal';
    if (price < 500) return 'Value Pick';
    return 'Popular';
}
