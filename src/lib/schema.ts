import { z } from 'zod';

export const UserIntentSchema = z.object({
    origin: z.string().optional(),
    destination: z.string().optional(),
    dateStr: z.string().optional(),
    returnDateStr: z.string().optional(),
    pax: z.number().default(1),
    adults: z.number().optional(),
    children: z.number().optional(),
    infants: z.number().optional(),
    cabinClass: z.enum(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST', 'economy', 'business', 'first']).default('ECONOMY').transform(val => val.toUpperCase()),
    persona: z.enum(['budget', 'luxury', 'business', 'family']).default('budget'),
    currency: z.string().optional(),
});

export const FlightSchema = z.object({
    id: z.string(),
    airline: z.string(),
    flightNumber: z.string(),
    departure: z.object({
        city: z.string(),
        code: z.string(),
        time: z.string(),
    }),
    arrival: z.object({
        city: z.string(),
        code: z.string(),
        time: z.string(),
    }),
    duration: z.string(),
    price: z.number(),
    class: z.enum(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST', 'economy', 'business', 'first']),
    trueCost: z.object({
        baseFare: z.number(),
        baggageFee: z.number(),
        seatSelectionFee: z.number(),
        total: z.number(),
    }).optional(),
    vibe: z.object({
        score: z.number(),
        aircraft: z.string(),
        description: z.string(),
    }).optional(),
    prediction: z.object({
        trajectory: z.enum(['rising', 'falling', 'stable']),
        recommendation: z.enum(['buy', 'wait']),
        confidence: z.number(),
        details: z.string(),
    }).optional(),
});
