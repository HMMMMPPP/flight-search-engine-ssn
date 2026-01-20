import { Flight } from "@/types";

export interface MergedPricePoint {
    date: string; // YYYY-MM-DD
    rawDate: Date;
    price: number;
    min: number;
    max: number;
    source: 'history' | 'live';
}

/**
 * Merges historical price data with actual live flight results.
 * If a live flight exists on a specific date, its lowest price overrides the historical average.
 * This ensures the Price Graph and AI Strategist always show consistent data.
 */
export function calculateMergedHistory(flights: Flight[], priceHistory: any[]): MergedPricePoint[] {
    if (!priceHistory || priceHistory.length === 0) return [];

    return priceHistory.map(item => {
        // Normalize Date from History (Amadeus usually returns YYYY-MM-DD)
        // We use string comparison to avoid Timezone offset issues with getDate()
        const historyDateStr = item.date;
        const historyDateObj = new Date(item.date);

        // Find matches in live flights
        const matches = flights.filter(f => {
            // Flight Time is ISO (e.g. 2025-10-01T15:30:00)
            const flightDateStr = f.departure.time.split('T')[0];
            return flightDateStr === historyDateStr;
        });

        if (matches.length > 0) {
            // Found live flights for this date
            const realLowest = Math.min(...matches.map(f => f.price));
            return {
                date: historyDateStr,
                rawDate: historyDateObj,
                price: realLowest,
                min: realLowest,
                max: realLowest, // For a single point, min/max collapse to the point unless we want range
                source: 'live'
            };
        }

        // Fallback to history
        return {
            date: historyDateStr,
            rawDate: historyDateObj,
            price: item.price,
            min: item.min,
            max: item.max,
            source: 'history'
        };
    });
}

/**
 * Calculates the average price from the merged history.
 */
export function calculateMarketAverage(mergedHistory: MergedPricePoint[]): number {
    if (!mergedHistory || mergedHistory.length === 0) return 0;
    const sum = mergedHistory.reduce((acc, curr) => acc + curr.price, 0);
    return sum / mergedHistory.length;
}

export interface IntradayMetric {
    hour: number;
    label: string;
    minPrice: number;
    avgPrice: number;
    count: number;
}

/**
 * Aggregates flights into hourly buckets for "Intraday Analyst" view.
 * Helps users find the cheapest time of day to fly.
 */
export function calculateIntradayMetrics(flights: Flight[]): IntradayMetric[] {
    if (!flights || flights.length === 0) return [];

    // Initialize 24-hour buckets
    const buckets: { [key: number]: number[] } = {};
    for (let i = 0; i < 24; i++) buckets[i] = [];

    // Populate buckets
    flights.forEach(f => {
        try {
            // Optimization: Fast String Slicing
            // ISO Format: 2023-10-05T14:30:00
            // Index of T is usually 10. Hour is at 11,12.
            let hour = 0;
            const tIndex = f.departure.time.indexOf('T');
            if (tIndex > -1) {
                // Parse "14" from "...T14:..."
                // Character code math is faster than parseInt
                const h1 = f.departure.time.charCodeAt(tIndex + 1) - 48;
                const h2 = f.departure.time.charCodeAt(tIndex + 2) - 48;
                hour = (h1 * 10) + h2;
            } else {
                // Fallback
                const date = new Date(f.departure.time);
                hour = date.getHours();
            }

            if (hour >= 0 && hour <= 23) {
                buckets[hour].push(f.price);
            }
        } catch (e) {
            // Fallback safe parse
            const date = new Date(f.departure.time);
            if (!isNaN(date.getTime())) {
                buckets[date.getHours()].push(f.price);
            }
        }
    });

    // Transform to Metrics
    const metrics: IntradayMetric[] = [];
    for (let i = 0; i < 24; i++) {
        const prices = buckets[i];
        if (prices.length > 0) {
            metrics.push({
                hour: i,
                label: `${i}:00`,
                minPrice: Math.min(...prices),
                avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
                count: prices.length
            });
        } else {
            // Optional: Gap filling or just omit? Omit for now to show density.
            // Or fill with previous ? No, standard Area chart handles gaps or we can zero it.
            // Let's return nulls or just skip, Recharts handles gaps well if separate data points.
            // Actually, for a continuous "Analyst" line, maybe we interpolate?
            // Let's just push existing points.
        }
    }

    return metrics.sort((a, b) => a.hour - b.hour);
}
