import { Duffel } from '@duffel/api';
import { Flight, UserIntent } from '@/types';
import { logAPICall } from '../utils/apiLogger';

// Initialize Duffel Client
const duffel = new Duffel({
    token: process.env.DUFFEL_API_TOKEN || ''
});

export const duffelService = {
    searchFlights: async (intent: UserIntent) => {
        const startTime = Date.now();
        try {
            console.log(`[Duffel] Searching for: ${intent.origin} -> ${intent.destination}`);

            // 1. Construct Offer Request
            const slices: any[] = [{
                origin: intent.origin,
                destination: intent.destination,
                departure_date: intent.dateStr
            }];

            if (intent.returnDateStr) {
                slices.push({
                    origin: intent.destination,
                    destination: intent.origin,
                    departure_date: intent.returnDateStr
                });
            }

            // Create Offer Request
            const offerRequest = await duffel.offerRequests.create({
                slices: slices,
                passengers: Array(intent.adults || 1).fill({ type: 'adult' }), // Simple adult mapping for now
                cabin_class: (intent.cabinClass?.toLowerCase() as any) || 'economy',
                return_offers: true
            });

            const offers = offerRequest.data.offers;
            console.log(`[Duffel] Found ${offers.length} offers`);

            // 2. Map Offers to Flight Schema
            const flights: Flight[] = offers.map((offer: any) => mapDuffelOfferToFlight(offer));

            // Extract Dictionaries (Airlines, Locations)
            // Duffel creates a self-contained offer, but we can build a dictionary from unique values
            const dictionaries = extractDictionaries(flights);

            await logAPICall('duffel', 'searchFlights', 'success', Date.now() - startTime);
            return { flights, dictionaries };

        } catch (error: any) {
            console.error('Duffel Search Error:', error);
            await logAPICall('duffel', 'searchFlights', 'error', Date.now() - startTime);

            // Log full error details for debugging
            if (error.errors) {
                console.error('Duffel API Errors:', JSON.stringify(error.errors, null, 2));
            }

            return { flights: [] };
        }
    }
};

// Helper: Map Duffel Offer to Flight
function mapDuffelOfferToFlight(offer: any): Flight {
    const outboundSlice = offer.slices[0];
    const returnSlice = offer.slices.length > 1 ? offer.slices[1] : undefined;

    // Segments for Outbound
    const mapSegments = (slice: any) => slice.segments.map((seg: any) => ({
        departure: {
            iataCode: seg.origin.iata_code,
            at: seg.departing_at,
            terminal: seg.origin_terminal
        },
        arrival: {
            iataCode: seg.destination.iata_code,
            at: seg.arriving_at,
            terminal: seg.destination_terminal
        },
        carrierCode: seg.operating_carrier.iata_code,
        number: seg.operating_carrier_flight_number,
        aircraft: seg.aircraft?.iata_code,
        duration: seg.duration ? seg.duration.replace('PT', '').toLowerCase() : '00h00m' // ISO format usually
    }));

    const outboundSegments = mapSegments(outboundSlice);
    const firstSeg = outboundSegments[0];
    const lastSeg = outboundSegments[outboundSegments.length - 1];

    // Calculate Layovers
    const calculateLayovers = (segments: any[]) => {
        const layovers = [];
        for (let i = 0; i < segments.length - 1; i++) {
            const arr = new Date(segments[i].arrival.at);
            const dep = new Date(segments[i + 1].departure.at);
            const diffMins = (dep.getTime() - arr.getTime()) / (1000 * 60);
            layovers.push({
                airport: segments[i].arrival.iataCode,
                duration: Math.floor(diffMins)
            });
        }
        return layovers;
    };

    const flight: Flight = {
        id: offer.id,
        airline: offer.owner.iata_code,
        flightNumber: `${firstSeg.carrierCode}${firstSeg.number}`,
        departure: {
            city: firstSeg.departure.iataCode,
            code: firstSeg.departure.iataCode,
            time: firstSeg.departure.at
        },
        arrival: {
            city: lastSeg.arrival.iataCode,
            code: lastSeg.arrival.iataCode,
            time: lastSeg.arrival.at
        },
        duration: outboundSlice.duration ? outboundSlice.duration.replace('PT', '').toLowerCase() : '00h00m', // ISO8601 duration
        stops: outboundSegments.length - 1,
        price: parseFloat(offer.total_amount),
        class: (offer.cabin_class || 'economy').toUpperCase(),
        segments: outboundSegments,
        layovers: calculateLayovers(outboundSegments),
        baggage: {
            // Duffel specific mapping needed if we want baggage details
            // For now leaving undefined or basic defaults
        }
    };

    // Return Flight
    if (returnSlice) {
        const retSegments = mapSegments(returnSlice);
        const retFirst = retSegments[0];
        const retLast = retSegments[retSegments.length - 1];

        flight.returnFlight = {
            departure: {
                city: retFirst.departure.iataCode,
                code: retFirst.departure.iataCode,
                time: retFirst.departure.at
            },
            arrival: {
                city: retLast.arrival.iataCode,
                code: retLast.arrival.iataCode,
                time: retLast.arrival.at
            },
            duration: returnSlice.duration ? returnSlice.duration.replace('PT', '').toLowerCase() : '00h00m',
            stops: retSegments.length - 1,
            segments: retSegments,
            layovers: calculateLayovers(retSegments)
        };
    }

    return flight;
}

function extractDictionaries(flights: Flight[]) {
    // Basic extraction
    const airlines: Record<string, string> = {};
    const locations: Record<string, string> = {};

    flights.forEach(f => {
        airlines[f.airline] = f.airline; // Duffel usually gives IATA codes, we might need a lookup map later
        locations[f.departure.code] = f.departure.city;
        locations[f.arrival.code] = f.arrival.city;
        // Also walk segments
        f.segments.forEach(s => {
            airlines[s.carrierCode] = s.carrierCode;
            locations[s.departure.iataCode] = s.departure.iataCode;
            locations[s.arrival.iataCode] = s.arrival.iataCode;
        });
    });

    return { airlines, locations };
}
