export interface Flight {
    id: string;
    airline: string;
    flightNumber: string;
    // Unified Flight Leg Structure
    departure: {
        city: string;
        code: string;
        time: string; // ISO string
    };
    arrival: {
        city: string;
        code: string;
        time: string; // ISO string
    };
    duration: string;
    stops: number;

    // Round Trip Optional
    // Round Trip Optional
    returnFlight?: {
        departure: {
            city: string; // IATA Code
            code: string;
            time: string;
        };
        arrival: {
            city: string;
            code: string;
            time: string;
        };
        duration: string;
        stops: number;
        segments: {
            departure: { iataCode: string; at: string; terminal?: string };
            arrival: { iataCode: string; at: string; terminal?: string };
            carrierCode: string;
            number: string;
            aircraft?: string;
            duration: string;
        }[];
        layovers?: {
            airport: string;
            duration: number; // minutes
        }[];
    };

    price: number;
    class: 'economy' | 'business' | 'first' | 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';

    // Rich Filter Data
    baggage?: {
        quantity?: number; // e.g., 1 piece
        weight?: number; // e.g., 23 kg
        unit?: 'KG' | 'LB';
    };

    // Detailed Segment Info for Advanced Filtering
    segments: {
        departure: { iataCode: string; at: string; terminal?: string };
        arrival: { iataCode: string; at: string; terminal?: string };
        carrierCode: string;
        number: string;
        aircraft?: string;
        duration: string;
    }[];

    layovers?: {
        airport: string;
        duration: number; // minutes
    }[];

    // Enriched Data
    trueCost?: {
        baseFare: number;
        baggageFee: number;
        seatSelectionFee: number;
        total: number;
    };
    vibe?: {
        score: number; // 0-10
        aircraft: string;
        description: string; // "Premium Air Quality", "Legroom King"
    };

    // Strategist Data (Refactored for SkySpeed Strategist)
    analysis?: {
        personaScores: {
            roadWarrior: number; // 0-100 (Efficiency)
            vibeScout: number; // 0-100 (Comfort)
            budgetMaster: number; // 0-100 (Value)
        };
        tags: string[]; // "Cheapest", "Fastest", "Best Vibe"
    };

    // Legacy Prediction (To be Deprecated or Integrated)
    prediction?: {
        trajectory: 'rising' | 'falling' | 'stable';
        recommendation: 'buy' | 'wait' | 'monitor';
        confidence: number; // 0-100
        details: string;
    };
}

export interface FlightAnalysis {
    meanPrice: number;
    standardDeviation: number;
    cheapest: string; // flight ID
    fastest: string; // flight ID
    bestVibe: string; // flight ID
    opportunity?: {
        type: 'savings' | 'scarcity' | 'upgrade';
        message: string;
    };
}

export interface SearchParams {
    query: string; // "Flight from JFK to LHR next friday for 2"
}

export interface UserIntent {
    origin?: string;
    destination?: string;
    dateStr?: string;
    returnDateStr?: string;
    pax?: number;
    adults?: number;
    children?: number;
    infants?: number;
    cabinClass?: 'economy' | 'business' | 'first' | 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
    persona: 'budget' | 'luxury' | 'business' | 'family';
    currency?: string;
}

export interface AgentResponse<T> {
    agentId: string;
    status: 'success' | 'failure';
    data?: T;
    latency: number;
    error?: string;
}
export interface PriceMetrics {
    min: number;
    avg: number;
    max: number;
    quartiles?: {
        min: number;
        first: number;
        median: number;
        third: number;
        max: number;
    };
}

export interface FilterCriteria {
    maxPrice: number;
    airlines: string[];
    stops: number[];
    maxDuration?: number;
    // Time Windows (Minutes from midnight, e.g., 600 = 10:00 AM)
    departureWindow?: [number, number];
    arrivalWindow?: [number, number];
    // New Advanced Filters
    hasBaggage?: boolean;
    maxLayoverDuration?: number;
    connectingAirports?: string[];
}

export interface FilterOptions {
    minPrice: number;
    maxPrice: number;
    airlines: string[];
    minDuration: number;
    maxDuration: number;
    // New Options
    layoverMin?: number;
    layoverMax?: number;
    connectingAirports?: string[];
    // Histograms (Index 0-23 = Hour, Value = Min Price)
    departureHistogram?: number[];
    arrivalHistogram?: number[];
    dictionaries?: {
        // Amadeus sometimes uses 'carriers', sometimes 'airlines'. We support both in the type
        airlines?: Record<string, string>;
        carriers?: Record<string, string>;
        locations: Record<string, string>;
        aircraft?: Record<string, string>;
        currencies?: Record<string, string>;
    };
}

export interface SearchResult {
    flights: Flight[];
    priceMetrics?: PriceMetrics;
    dictionaries?: {
        airlines: Record<string, string>;
        locations: Record<string, string>;
    };
}
