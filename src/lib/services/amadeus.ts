import Amadeus from 'amadeus';
import { amadeusRateLimiter } from '../utils/rateLimiter';
import { logAPICall } from '../utils/apiLogger';
import { cacheService } from './cache';

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET,
});

export const amadeusService = {
    searchFlights: async (params: any) => {
        const startTime = Date.now();
        try {
            const response = await amadeusRateLimiter.throttle<any>(() => amadeus.shopping.flightOffersSearch.get({
                originLocationCode: params.origin,
                destinationLocationCode: params.destination,
                departureDate: params.date,
                returnDate: params.returnDate,
                adults: params.adults || 1,
                children: params.children,
                infants: params.infants,
                travelClass: params.cabinClass ? params.cabinClass.toUpperCase() : 'ECONOMY',
                // currencyCode: params.currency, // Try removing currency to avoid System Error 141 in Test Env
                max: 50
            }));

            // Log successful API call
            await logAPICall('amadeus', 'searchFlights', 'success', Date.now() - startTime);

            return response; // Return full response object to access dictionaries
        } catch (error: any) {
            // Log failed API call
            await logAPICall('amadeus', 'searchFlights', 'error', Date.now() - startTime);

            // DETAILED ERROR LOGGING
            try {
                console.error('--- AMADEUS ERROR DEBUG START ---');
                console.error('Error keys:', Object.keys(error));
                if (error.response) console.error('Response keys:', Object.keys(error.response));

                console.error('Full Error JSON:', JSON.stringify(error, null, 2));

                // Explicitly log header access if possible, or body
                if (error.response) {
                    console.error('Response Status:', error.response.statusCode);
                    console.error('Response Body:', error.response.body);
                }
                console.error('--- AMADEUS ERROR DEBUG END ---');
            } catch (loggingError) {
                console.error('Failed to log error details:', loggingError);
                console.error('Original Error:', error);
            }

            return { data: [] }; // Return object with empty data
        }
    },


    // 1. Flight Inspiration (Landing Page)
    getFlightInspiration: async (origin: string) => {
        const startTime = Date.now();
        try {
            const response = await amadeusRateLimiter.throttle<any>(() => amadeus.shopping.flightDestinations.get({
                origin: origin
            }));
            await logAPICall('amadeus', 'getFlightInspiration', 'success', Date.now() - startTime);
            return response.data;
        } catch (error: any) {
            await logAPICall('amadeus', 'getFlightInspiration', 'error', Date.now() - startTime);
            if (error.response) {
                console.warn('Amadeus Inspiration API Error:', {
                    status: error.response.statusCode,
                    result: error.response.result
                });
            } else {
                console.warn('Amadeus Inspiration Unexpected Error:', error);
            }
            return [];
        }
    },

    // 2. Cheapest Date Search (Landing Page & Price Graph)
    getCheapestDates: async (origin: string, destination: string) => {
        const startTime = Date.now();
        try {
            // Cache Key Strategy: Cheapest dates are relatively stable approx 1 hour.
            const cacheKey = `cheapest_dates_${origin}_${destination}`;
            const cachedParams = await cacheService.get(cacheKey);

            if (cachedParams) {
                // Log Cache Hit (Optional: lightweight log or debug only)
                // console.log(`[Cache Hit] getCheapestDates for ${origin}-${destination}`);
                return cachedParams;
            }

            const response = await amadeusRateLimiter.throttle<any>(() => amadeus.shopping.flightDates.get({
                origin: origin,
                destination: destination
            }));

            // Cache result for 1 hour
            cacheService.set(cacheKey, response.data, 3600);

            await logAPICall('amadeus', 'getCheapestDates', 'success', Date.now() - startTime);
            return response.data;
        } catch (error: any) {
            await logAPICall('amadeus', 'getCheapestDates', 'error', Date.now() - startTime);
            if (error.response) {
                console.warn('Amadeus CheapestDates API Error:', {
                    status: error.response.statusCode,
                    result: error.response.result
                });
            } else {
                console.warn('Amadeus CheapestDates Unexpected Error:', error);
            }
            return [];
        }
    },

    // 3. Market Insights: Most Traveled (Landing Page)
    getMostTravelled: async (origin: string) => {
        try {
            const response = await amadeusRateLimiter.throttle<any>(() => amadeus.travel.analytics.airTraffic.traveled.get({
                originCityCode: origin,
                period: '2017-01' // Note: Free tier data is often old/limited, using a safe past date for structure
            }));
            return response.data;
        } catch (error) {
            console.warn('Amadeus Most Travelled Error:', error);
            return [];
        }
    },

    // 4. Market Insights: Busiest Period (Landing Page)
    getBusiestPeriod: async (cityCode: string) => {
        try {
            const response = await amadeusRateLimiter.throttle<any>(() => amadeus.travel.analytics.airTraffic.busiestPeriod.get({
                cityCode: cityCode,
                period: '2017', // Free tier often requires older years
                direction: 'ARRIVING'
            }));
            return response.data;
        } catch (error) {
            console.warn('Amadeus Busiest Period Error:', error);
            return [];
        }
    },

    getPriceAnalysis: async (params: any) => {
        try {
            // Note: Availability of this endpoint depends on the subscription
            // Using flightPriceAnalysis endpoint or similar if available in self-service
            // Fallback to searching historical data if direct endpoint isn't available in free tier
            // For now, we mock this if the specific analytics endpoint fails or isn't included
            const response = await amadeusRateLimiter.throttle<any>(() => amadeus.analytics.itineraryPriceMetrics.get({
                originIataCode: params.origin,
                destinationIataCode: params.destination,
                departureDate: params.date,
                currencyCode: 'USD'
            }));
            return response.data;
        } catch (error) {
            console.warn('Amadeus Analytics Error (likely tier limit):', error);
            return null;
        }
    },

    // 5. Locations Search (Autocomplete)
    searchLocations: async (keyword: string) => {
        const startTime = Date.now();
        try {
            const response = await amadeusRateLimiter.throttle<any>(() => amadeus.referenceData.locations.get({
                keyword,
                subType: Amadeus.location.any
            }));
            await logAPICall('amadeus', 'searchLocations', 'success', Date.now() - startTime);
            return response.data;
        } catch (error: any) {
            await logAPICall('amadeus', 'searchLocations', 'error', Date.now() - startTime);
            if (error.response) {
                console.warn('Amadeus Locations API Error:', {
                    status: error.response.statusCode,
                    result: error.response.result
                });
            } else {
                console.warn('Amadeus Locations Unexpected Error:', error);
            }
            return [];
        }
    }
};
