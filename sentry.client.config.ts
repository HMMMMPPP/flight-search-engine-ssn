import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Environment name for filtering in Sentry dashboard
    environment: process.env.NODE_ENV || 'development',

    // Sample rate for performance monitoring (10% of transactions)
    tracesSampleRate: 0.1,

    // Enable Session Replay (optional, but helpful for debugging)
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    // Filter out noisy errors
    beforeSend(event, hint) {
        // Ignore ResizeObserver errors (common browser noise)
        if (event.exception?.values?.[0]?.value?.includes('ResizeObserver')) {
            return null;
        }

        // Ignore network errors from extensions
        if (event.exception?.values?.[0]?.value?.includes('chrome-extension')) {
            return null;
        }

        return event;
    },

    // Don't send errors in development (save your quota)
    enabled: process.env.NODE_ENV === 'production',
});
