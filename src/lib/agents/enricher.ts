import { Flight } from '@/types';
import { AIRCRAFT_DB, DEFAULT_AIRCRAFT } from '../data/aircraft';

export const enricherAgent = async (flights: Flight[]): Promise<Flight[]> => {
    // Note: We don't need artificial delay in production if we are just parsing local data.
    // However, if we were calling an external API (like SeatGuru), we would await there.
    // For now, these lookups are instant.

    return flights.map(f => {
        // 1. Get Aircraft Info (Deterministic)
        // We look at the first segment's aircraft for the "Main" vibe, 
        // or average them if multi-leg. For simplicity, let's take the longest leg or just the first.
        const mainSegment = f.segments[0];
        const aircraftCode = mainSegment.aircraft || '';
        const aircraftData = AIRCRAFT_DB[aircraftCode] || AIRCRAFT_DB[aircraftCode.substring(0, 3)] || DEFAULT_AIRCRAFT;

        // 2. Baggage Logic (Real Data)
        // Amadeus returns bag info in the price.fees or travelerPricings
        // But our mapped 'Flight' object might need to ensure it carries this info from the transformer.
        // Assuming 'baggage' field is populated from the aggregator if available.
        // If not, we use Heuristics based on Carrier.

        let baggageFee = 0;
        const bagQty = f.baggage?.quantity ?? 0;

        if (bagQty === 0) {
            // No free bags? Estimate fee based on Airline type.
            // Low Cost Carriers (FR, U2, NK, F9) usually charge ~45-60
            const lccCodes = ['FR', 'U2', 'NK', 'F9', 'W6'];
            if (lccCodes.includes(f.airline)) {
                baggageFee = 55;
            } else {
                // Legacy carriers usually charge ~30-35 for basic economy
                baggageFee = 35;
            }
        }

        // 3. Seat Selection (Heuristic)
        // We don't have real seat maps without paying $.
        let seatFee = 0;
        if (f.class === 'ECONOMY' || f.class === 'economy') {
            seatFee = 25; // Average generic seat fee
        }

        return {
            ...f,
            trueCost: {
                baseFare: f.price,
                baggageFee: baggageFee,
                seatSelectionFee: seatFee,
                total: f.price + baggageFee + seatFee
            },
            vibe: {
                score: aircraftData.vibe,
                aircraft: aircraftData.name,
                description: aircraftData.tags.join(' • ') || 'Standard Configuration'
            }
        };
    });
};
