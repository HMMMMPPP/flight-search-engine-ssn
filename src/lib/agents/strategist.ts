import { Flight, FlightAnalysis } from '@/types';
import { parseDuration } from '../utils/flightFilters';
import { calculateMergedHistory, calculateMarketAverage } from '../utils/priceAnalysis';

/**
 * SkySpeed Strategist Agent
 * Analyzes the flight set to generate "Persona Scores" and "Opportunity Insights".
 */
export const strategistAgent = async (flights: Flight[]): Promise<Flight[]> => {
    if (!flights || flights.length === 0) return [];

    // 1. Analyze the Context (Stats across the whole batch)
    // Note: StrategistAgent usually runs largely on backend, might not have priceHistory passed to it easily yet.
    // For the UI component (AIStrategistPanel), we call analyzeBatch directly.
    const analysis = analyzeBatch(flights);

    // 2. Score Each Flight
    return flights.map(f => {
        const scores = scoreFlight(f, analysis);

        // Generate Tags based on analysis
        const tags: string[] = [];
        if (f.id === analysis.cheapest) tags.push('Cheapest');
        if (f.id === analysis.fastest) tags.push('Fastest');
        if (f.id === analysis.bestVibe) tags.push('Best Vibe');
        if (analysis.opportunity && f.id === analysis.cheapest && analysis.opportunity.type === 'savings') {
            tags.push('Smart Deal');
        }

        return {
            ...f,
            analysis: {
                personaScores: scores,
                tags
            },
            // Legacy Prediction Placeholder (Optional: Keep for type safety or remove if unused)
            prediction: {
                trajectory: 'stable',
                recommendation: 'buy',
                confidence: 85,
                details: ' AI Analysis Complete'
            }
        };
    });
};

export function analyzeBatch(flights: Flight[], priceHistory?: any[]): FlightAnalysis {
    if (!flights || flights.length === 0) {
        return {
            meanPrice: 0,
            standardDeviation: 0,
            cheapest: '',
            fastest: '',
            bestVibe: '',
        };
    }

    let minPrice = Infinity;
    let sumPrice = 0;
    let cheapestId = '';

    let minDuration = Infinity;
    let fastestId = '';

    let maxVibeScore = -1;
    let bestVibeId = '';

    const prices: number[] = []; // Keep for StdDev (needed 2nd pass or Welford's algorithm)

    // Single Pass Loop
    for (const f of flights) {
        // Price Stats
        const p = f.price;
        prices.push(p);
        sumPrice += p;

        if (p < minPrice) {
            minPrice = p;
            cheapestId = f.id;
        }

        // Duration Stats
        const d = parseDuration(f.duration);
        if (d < minDuration) {
            minDuration = d;
            fastestId = f.id;
        }

        // Vibe Stats
        const v = f.vibe?.score || 5;
        if (v > maxVibeScore) {
            maxVibeScore = v;
            bestVibeId = f.id;
        }
    }

    // Mean Price Calculation
    let meanPrice = sumPrice / flights.length;

    // IMPACT FIX: Use Market History for Mean Price if available
    if (priceHistory && priceHistory.length > 0) {
        const historyPrices = priceHistory.map(p => p.price);
        const historyMean = historyPrices.reduce((a: number, b: number) => a + b, 0) / historyPrices.length;
        meanPrice = historyMean;
    }

    // StdDev Calculation (2nd tiny pass on primitives is fast)
    // Variance = Sum((x - mean)^2) / N
    let sqDiffSum = 0;
    for (const p of prices) {
        sqDiffSum += (p - meanPrice) ** 2; // Math.pow is slower than **
    }
    const variance = sqDiffSum / prices.length;
    const stdDev = Math.sqrt(variance);

    // Opportunity Detection
    let opportunity: FlightAnalysis['opportunity'] = undefined;

    if (meanPrice - minPrice > stdDev) {
        opportunity = {
            type: 'savings',
            message: `Save $${(meanPrice - minPrice).toFixed(2)} by choosing our Smart Deal today.`
        };
    } else if (minPrice > 1000) {
        opportunity = {
            type: 'scarcity',
            message: 'Prices are high likely due to demand. Book soon.'
        };
    }

    return {
        meanPrice,
        standardDeviation: stdDev,
        cheapest: cheapestId,
        fastest: fastestId,
        bestVibe: bestVibeId,
        opportunity
    };
}


/**
 * Generates a detailed analysis for a specific flight compared to the batch.
 * This powers the "Virtual Monitor" in the UI.
 */
export function generateFlightAnalysis(flight: Flight, context: FlightAnalysis) {
    const duration = parseDuration(flight.duration);
    const avgPrice = context.meanPrice;
    const isCheaper = flight.price < avgPrice;
    const priceDiff = Math.abs(flight.price - avgPrice);

    // 1. Price Analysis
    let priceInsight = "";
    if (isCheaper) {
        priceInsight = `This flight is $${priceDiff.toFixed(2)} cheaper than the average market price of $${avgPrice.toFixed(2)}.`;
    } else {
        priceInsight = `This flight is $${priceDiff.toFixed(2)} above the average, reflecting its premium convenience or carrier.`;
    }

    // 2. Duration Analysis
    // Rough estimate: comparison against context.fastest (we don't have exact duration of fastest here easily unless we look it up, 
    // but we can infer from batch stats if we had them. accepted limitation for now: basic checking).
    // Let's just comment on directness.
    let timeInsight = "";
    if (flight.stops === 0) {
        timeInsight = "It is a non-stop flight, offering the most efficient travel time.";
    } else {
        timeInsight = `This route includes ${flight.stops} stop(s).`;
    }

    // 3. Why Wait or Buy Now?
    let prediction = "";

    // Simple heuristic: If it's cheap (lower than mean - stdDev), BUY NOW.
    // If it's expensive, maybe wait (but we can't guarantee prices drop).
    // Safer to lean on "Buy Now" if it's below average.
    if (flight.price < avgPrice - (context.standardDeviation / 2)) {
        prediction = "STRONG BUY: The price is significantly lower than similar flights found today.";
    } else if (flight.price > avgPrice + context.standardDeviation) {
        prediction = "MONITOR: Prices are trending high. Unless you need this specific schedule, you might find better value by adjusting dates.";
    } else {
        prediction = "FAIR VALUE: This price aligns with current market rates for this route.";
    }

    return {
        priceInsight,
        timeInsight,
        prediction
    };
}

function scoreFlight(flight: Flight, context: FlightAnalysis): { roadWarrior: number, vibeScout: number, budgetMaster: number } {
    // Legacy scoring - keeping return shape to avoid breaking typescript immediately if other files use it, 
    // but values are dummy now as we are removing the persona cards.
    // Ideally we remove this function entirely, but let's see if we can just remove usages first.
    return { roadWarrior: 0, vibeScout: 0, budgetMaster: 0 };
}


export type RecommendationType = 'buy' | 'monitor' | 'fair';

export function getFlightRecommendationType(flight: Flight, context: FlightAnalysis): RecommendationType {
    const avgPrice = context.meanPrice;

    // Logic matching generateFlightAnalysis
    if (flight.price < avgPrice - (context.standardDeviation / 2)) {
        return 'buy';
    } else if (flight.price > avgPrice + context.standardDeviation) {
        return 'monitor';
    } else {
        return 'fair';
    }
}
