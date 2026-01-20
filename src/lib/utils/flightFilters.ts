import { Flight, FilterCriteria, FilterOptions } from '@/types';

/**
 * Extracts available filter options from a list of flights.
 * @param flights List of flights
 * @returns FilterOptions (min/max price, available airlines, etc.)
 */
export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
    minPrice: 0,
    maxPrice: 1000,
    airlines: [],
    minDuration: 0,
    maxDuration: 0,
    layoverMin: 0,
    layoverMax: 0,
    connectingAirports: [],
    departureHistogram: new Array(24).fill(0),
    arrivalHistogram: new Array(24).fill(0)
};

/**
 * Extracts available filter options from a list of flights.
 * @param flights List of flights
 * @returns FilterOptions (min/max price, available airlines, etc.)
 */
export function extractFilters(flights: Flight[]): FilterOptions {
    if (flights.length === 0) {
        return DEFAULT_FILTER_OPTIONS;
    }

    const prices = flights.map(f => f.price);
    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));

    const airlines = Array.from(new Set(flights.map(f => f.airline))).sort();

    const durations = flights.map(f => parseDuration(f.duration));
    const minDuration = Math.floor(Math.min(...durations)) || 0;
    const maxDuration = Math.ceil(Math.max(...durations)) || 0;

    // Advanced Stats
    const allLayovers = flights.flatMap(f => f.layovers?.map(l => l.duration) || []);
    const layoverMin = allLayovers.length > 0 ? Math.min(...allLayovers) : 0;
    const layoverMax = allLayovers.length > 0 ? Math.max(...allLayovers) : 0;

    const allConnecting = flights.flatMap(f => f.layovers?.map(l => l.airport) || []);
    const connectingAirports = Array.from(new Set(allConnecting)).sort();

    // Calculate Price Histograms (0-23 hours)
    const departureHistogram = new Array(24).fill(0);
    const arrivalHistogram = new Array(24).fill(0);
    const depCounts = new Array(24).fill(0);

    flights.forEach(f => {
        const depHour = new Date(f.departure.time).getHours();
        const arrHour = new Date(f.arrival.time).getHours();

        // We track MIN price for that hour
        if (departureHistogram[depHour] === 0 || f.price < departureHistogram[depHour]) {
            departureHistogram[depHour] = f.price;
        }

        if (arrivalHistogram[arrHour] === 0 || f.price < arrivalHistogram[arrHour]) {
            arrivalHistogram[arrHour] = f.price;
        }
    });

    return {
        minPrice,
        maxPrice,
        airlines,
        minDuration,
        maxDuration,
        layoverMin,
        layoverMax,
        connectingAirports,
        departureHistogram,
        arrivalHistogram
    };
}

/**
 * Filters flights based on criteria.
 * @param flights List of flights
 * @param criteria Selected filters
 * @returns Filtered list of flights
 */
export function filterFlights(flights: Flight[], criteria: FilterCriteria): Flight[] {
    return flights.filter(flight => {
        // 1. Price
        if (flight.price > criteria.maxPrice) return false;

        // 2. Airlines
        if (criteria.airlines.length > 0 && !criteria.airlines.includes(flight.airline)) {
            return false;
        }

        // 3. Stops
        if (criteria.stops.length > 0) {
            const isMatch = criteria.stops.includes(flight.stops);
            if (!isMatch) return false;
        }

        // 4. Duration
        if (criteria.maxDuration) {
            const flightMinutes = parseDuration(flight.duration);
            if (flightMinutes > criteria.maxDuration) return false;
        }

        // 5. Departure Time Window
        if (criteria.departureWindow) {
            const [min, max] = criteria.departureWindow;
            const minutes = getMinutesFromDate(flight.departure.time);
            if (minutes < min || minutes > max) return false;
        }

        // 6. Arrival Time Window
        if (criteria.arrivalWindow) {
            const [min, max] = criteria.arrivalWindow;
            const minutes = getMinutesFromDate(flight.arrival.time);
            if (minutes < min || minutes > max) return false;
        }

        // 6. Baggage (New)
        if (criteria.hasBaggage) {
            // If filter strictly requires baggage
            if (!flight.baggage || (flight.baggage.quantity || 0) < 1) return false;
        }

        // 7. Layover Duration (New)
        if (criteria.maxLayoverDuration) {
            if (flight.layovers && flight.layovers.length > 0) {
                // If ANY layover exceeds the max, exclude it? Or total? Usually max single layover.
                const hasLongLayover = flight.layovers.some(l => l.duration > (criteria.maxLayoverDuration || 9999));
                if (hasLongLayover) return false;
            }
        }

        // 8. Connecting Airports (New)
        if (criteria.connectingAirports && criteria.connectingAirports.length > 0) {
            // If user selected airports, show flights that connect there.
            // Logic: Must pass through AT LEAST ONE of selected? Or ONLY selected?
            // Usually "Show flights connecting in..."
            const flightAirports = flight.layovers?.map(l => l.airport) || [];
            if (flight.stops > 0) {
                const hasSelectedConnection = flightAirports.some(code => criteria.connectingAirports?.includes(code));
                if (!hasSelectedConnection) return false;
            }
        }

        return true;
    });
}

const durationCache = new Map<string, number>();

export function parseDuration(durationArgs: string): number {
    if (!durationArgs) return 0;

    // Check Cache
    if (durationCache.has(durationArgs)) {
        return durationCache.get(durationArgs)!;
    }

    const input = durationArgs.toUpperCase().replace('PT', '');
    let totalMinutes = 0;

    // Optimization: Single Pass Parsing
    // Format usually 2H30M, 45M, 1H
    let currentVal = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (char >= '0' && char <= '9') {
            currentVal = currentVal * 10 + (char.charCodeAt(0) - 48);
        } else if (char === 'H') {
            totalMinutes += currentVal * 60;
            currentVal = 0;
        } else if (char === 'M') {
            totalMinutes += currentVal;
            currentVal = 0;
        }
    }

    // Cache result (Duration strings are highly repetitive)
    if (durationCache.size > 1000) durationCache.clear(); // Prevent memory leak
    durationCache.set(durationArgs, totalMinutes);

    return totalMinutes;
}

function getMinutesFromDate(isoString: string): number {
    // Fix: Parse "Wall Clock Time" correctly regardless of browser timezone
    // Format: "YYYY-MM-DDTHH:mm:ss"
    if (!isoString) return 0;

    try {
        const timePart = isoString.split('T')[1]; // "HH:mm:ss..."
        if (!timePart) return 0;

        const [hoursStr, minutesStr] = timePart.split(':');
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);

        return (hours * 60) + minutes;
    } catch (e) {
        // Fallback to Date object if string format fails (shouldn't happen with Amadeus)
        const date = new Date(isoString);
        return date.getHours() * 60 + date.getMinutes();
    }
}

export type SortOption = 'best' | 'duration_asc' | 'departure_asc' | 'departure_desc';

export function sortFlights(flights: Flight[], sort: SortOption): Flight[] {
    const sorted = [...flights];
    switch (sort) {
        case 'best':
        default: // Default: Best Match = Cheapest (Price Ascending)
            return sorted.sort((a, b) => a.price - b.price);
        case 'duration_asc':
            return sorted.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
        case 'departure_asc':
            return sorted.sort((a, b) => new Date(a.departure.time).getTime() - new Date(b.departure.time).getTime());
        case 'departure_desc':
            return sorted.sort((a, b) => new Date(b.departure.time).getTime() - new Date(a.departure.time).getTime());
    }
}
