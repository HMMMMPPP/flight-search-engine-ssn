import { Flight, UserIntent } from '@/types';
import { duffelService } from '../services/duffel';

export const aggregatorAgent = async (intent: UserIntent): Promise<{ flights: Flight[], dictionaries?: any }> => {
    // 1. Duffel API
    try {
        console.log('[Aggregator] Using Duffel API');
        const { flights, dictionaries } = await duffelService.searchFlights({
            ...intent,
            origin: intent.origin?.toUpperCase(),
            destination: intent.destination?.toUpperCase()
        });

        if (!flights || flights.length === 0) {
            console.log('Duffel returned 0 results.');
            return { flights: [] };
        }

        // Apply any post-processing if needed (e.g. strict airline check specific to user rules)
        // For now, return direct results
        return { flights, dictionaries };

    } catch (error) {
        console.error('Aggregator Error (Duffel):', error);
        return { flights: [] };
    }
};

// Helper to deduplicate flights based on unique signature
function deduplicateFlights(flights: Flight[]): Flight[] {
    const seen = new Set<string>();
    return flights.filter(flight => {
        const signature = `${flight.airline}-${flight.flightNumber}-${flight.departure.time}`;
        if (seen.has(signature)) {
            return false;
        }
        seen.add(signature);
        return true;
    });
}

