/**
 * API Call Logger
 * 
 * Tracks API usage across Amadeus, Gemini, and Groq to monitor costs and performance.
 * Logs are searchable in Netlify Functions logs using [API_CALL] prefix.
 */

export type APIProvider = 'amadeus' | 'gemini' | 'groq';
export type APIStatus = 'success' | 'error';

interface APICallLog {
    provider: APIProvider;
    endpoint: string;
    status: APIStatus;
    responseTime: number;
    timestamp: string;
    environment: string;
}

/**
 * Log an API call for monitoring and cost tracking
 * 
 * @param provider - API provider (amadeus, gemini, groq)
 * @param endpoint - Specific endpoint called
 * @param status - success or error
 * @param responseTime - Time taken in milliseconds
 */
export const logAPICall = async (
    provider: APIProvider,
    endpoint: string,
    status: APIStatus,
    responseTime: number
): Promise<void> => {
    const logData: APICallLog = {
        provider,
        endpoint,
        status,
        responseTime,
        timestamp: new Date().toISOString(),
        environment: process.env.AMADEUS_HOSTNAME || 'test'
    };

    // Log to console - searchable in Netlify Functions logs
    console.log('[API_CALL]', JSON.stringify(logData));

    // Optional: Send to external analytics service
    if (process.env.ANALYTICS_WEBHOOK) {
        try {
            await fetch(process.env.ANALYTICS_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logData)
            });
        } catch (error) {
            // Fail silently - don't break app if webhook fails
            console.warn('[API_CALL] Webhook failed:', error);
        }
    }
};

/**
 * Wrapper to time and log API calls
 * 
 * @example
 * const result = await withAPILogging(
 *   'amadeus',
 *   'searchFlights',
 *   () => amadeus.shopping.flightOffersSearch.get(params)
 * );
 */
export const withAPILogging = async <T>(
    provider: APIProvider,
    endpoint: string,
    apiCall: () => Promise<T>
): Promise<T> => {
    const startTime = Date.now();

    try {
        const result = await apiCall();
        await logAPICall(provider, endpoint, 'success', Date.now() - startTime);
        return result;
    } catch (error) {
        await logAPICall(provider, endpoint, 'error', Date.now() - startTime);
        throw error;
    }
};
