import { Flight, UserIntent } from '@/types';
import { amadeusService } from '../services/amadeus';

export const aggregatorAgent = async (intent: UserIntent): Promise<{ flights: Flight[], dictionaries?: any }> => {
    // 1. Try Real Amadeus API
    if (process.env.AMADEUS_API_KEY) {
        try {
            const response = await amadeusService.searchFlights({
                origin: intent.origin?.toUpperCase(), // Ensure uppercase
                destination: intent.destination?.toUpperCase(),
                date: intent.dateStr, // YYYY-MM-DD
                returnDate: intent.returnDateStr,
                cabinClass: intent.cabinClass,
                adults: intent.adults || intent.pax,
                children: intent.children,
                infants: intent.infants,
                currency: intent.currency
            });
            const rawOffers = response.data;

            if (!rawOffers || rawOffers.length === 0) {
                console.log('Amadeus returned 0 results.');
                return { flights: [] };
            }

            // Map Amadeus Response to our Flight Schema
            const flights = rawOffers.map((offer: any) => {
                const outboundItinerary = offer.itineraries[0];
                const segments = outboundItinerary.segments;
                const firstSeg = segments[0];
                const lastSeg = segments[segments.length - 1];

                // Extract Baggage (usually in travelerPricings)
                let baggage = undefined;
                try {
                    const baggageData = offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags;
                    if (baggageData) {
                        baggage = {
                            quantity: baggageData.quantity,
                            weight: baggageData.weight,
                            unit: baggageData.weightUnit
                        };
                    }
                } catch (e) { /* ignore missing baggage info */ }

                // Helper to map segments
                const mapSegments = (segs: any[]) => segs.map((seg: any) => ({
                    departure: { iataCode: seg.departure.iataCode, at: seg.departure.at, terminal: seg.departure.terminal },
                    arrival: { iataCode: seg.arrival.iataCode, at: seg.arrival.at, terminal: seg.arrival.terminal },
                    carrierCode: seg.carrierCode,
                    number: seg.number,
                    aircraft: seg.aircraft?.code,
                    duration: seg.duration.replace('PT', '').toLowerCase()
                }));

                const calculateLayovers = (segs: any[]) => {
                    const lays = [];
                    for (let i = 0; i < segs.length - 1; i++) {
                        const arrival = new Date(segs[i].arrival.at);
                        const departure = new Date(segs[i + 1].departure.at);
                        const durationMins = (departure.getTime() - arrival.getTime()) / (1000 * 60);
                        lays.push({
                            airport: segs[i].arrival.iataCode,
                            duration: Math.floor(durationMins)
                        });
                    }
                    return lays;
                };

                // Map Outbound
                const mappedSegments = mapSegments(segments);
                const layovers = calculateLayovers(segments);

                // Map Return (if exists)
                let returnFlight = undefined;
                if (offer.itineraries.length > 1) {
                    const returnItinerary = offer.itineraries[1];
                    const retSegments = returnItinerary.segments;
                    const retFirst = retSegments[0];
                    const retLast = retSegments[retSegments.length - 1];

                    returnFlight = {
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
                        duration: returnItinerary.duration.replace('PT', '').toLowerCase(),
                        stops: retSegments.length - 1,
                        segments: mapSegments(retSegments),
                        layovers: calculateLayovers(retSegments)
                    };
                }

                return {
                    id: offer.id,
                    airline: firstSeg.carrierCode,
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
                    duration: outboundItinerary.duration.replace('PT', '').toLowerCase(),
                    stops: segments.length - 1,
                    price: parseFloat(offer.price.total),
                    class: intent.cabinClass || 'economy',

                    // Rich Fields
                    baggage,
                    segments: mappedSegments,
                    layovers,
                    returnFlight // Add the return flight data
                };
            });

            // Apply Deduplication & Strict Airline Check
            const uniqueFlights = deduplicateFlights(flights).filter(f => {
                // User Requirement: "Departure and return must be in the same airline"
                if (f.returnFlight && f.returnFlight.segments.length > 0) {
                    const outboundCarrier = f.airline;
                    const returnCarrier = f.returnFlight.segments[0].carrierCode;
                    return outboundCarrier === returnCarrier;
                }
                return true;
            });

            return { flights: uniqueFlights, dictionaries: response.result?.dictionaries || response.dictionaries || {} };

        } catch (error) {
            console.error('Amadeus Aggregation Error:', error);
            // Return empty array on error, DO NOT FALLBACK TO MOCK if we intend to use real data
            return { flights: [] };
        }
    }


    // 2. No Mock Fallback - Strict Amadeus Mode
    console.warn('No Amadeus Keys found or API failed. Returning empty results (Strict Mode).');
    return { flights: [] };
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

