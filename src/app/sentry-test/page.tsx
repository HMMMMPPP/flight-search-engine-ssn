'use client';

import { useEffect } from 'react';

export default function SentryTestPage() {
    useEffect(() => {
        // Test error will trigger after 2 seconds
        const timer = setTimeout(() => {
            throw new Error('🧪 Sentry Test Error - This is working! You can delete this test page now.');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center p-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl border border-white/20">
                <h1 className="text-4xl font-bold text-white mb-4">🧪 Sentry Test Page</h1>
                <p className="text-white/80 mb-4">
                    This page will throw a test error in <strong>2 seconds</strong> to verify Sentry integration.
                </p>

                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-4">
                    <p className="text-yellow-200 text-sm">
                        ⚠️ <strong>What to expect:</strong>
                    </p>
                    <ul className="text-yellow-100 text-sm mt-2 space-y-1 ml-4">
                        <li>• Browser console will show an error</li>
                        <li>• Error will be captured by Sentry</li>
                        <li>• Check your Sentry dashboard in ~30 seconds</li>
                    </ul>
                </div>

                <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                    <p className="text-blue-200 text-sm">
                        📊 <strong>Where to check:</strong>
                    </p>
                    <ol className="text-blue-100 text-sm mt-2 space-y-1 ml-4">
                        <li>1. Open Sentry dashboard: <a href="https://sentry.io" className="underline" target="_blank">sentry.io</a></li>
                        <li>2. Go to <strong>Issues</strong></li>
                        <li>3. Look for: "Sentry Test Error - This is working!"</li>
                    </ol>
                </div>

                <p className="text-white/60 text-xs mt-4">
                    Note: In development mode, errors won't be sent to Sentry (to save your quota).
                    Build and run in production mode to test.
                </p>
            </div>
        </div>
    );
}
