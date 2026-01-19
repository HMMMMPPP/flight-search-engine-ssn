'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterCriteria } from '@/types';
import { X, Mic, Send, Sparkles, Loader2, ArrowRight } from 'lucide-react';

interface AICommandBarProps {
    onAction: (action: any) => void;
    currentFilters: FilterCriteria;
}

export function AICommandBar({ onAction, currentFilters }: AICommandBarProps) {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lastAction, setLastAction] = useState<string | null>(null);

    // Auto-dismiss notification
    useEffect(() => {
        if (lastAction) {
            const timer = setTimeout(() => {
                setLastAction(null);
            }, 2500); // 2.5s visibility for readability
            return () => clearTimeout(timer);
        }
    }, [lastAction]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setLastAction(null);

        try {
            const response = await fetch('/api/ai-command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query,
                    context: {
                        // Pass minimal context to avoid token bloat
                        currentFilterCount: Object.keys(currentFilters).length
                    }
                })
            });

            const action = await response.json();

            // Execute Action (Simulated execution via callback)
            if (action && !action.error) {
                onAction(action);
                setLastAction(`Executed: ${action.type}`);
                setQuery('');
            } else {
                setLastAction('Error: Could not understand command.');
            }

        } catch (error) {
            console.error(error);
            setLastAction('Error: Network failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Sparkles size={16} className={`text-sky-400 ${isLoading ? 'animate-spin' : ''}`} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={isLoading ? "Analyzing..." : "Ask AI (e.g., 'Find cheap direct flights')"}
                    className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 focus:bg-white/10 transition-all font-medium"
                    disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                    <button
                        type="submit"
                        disabled={!query || isLoading}
                        className="p-1.5 rounded-lg bg-sky-500 text-white opacity-0 group-focus-within:opacity-100 disabled:opacity-0 transition-all scale-90 hover:scale-100"
                    >
                        <ArrowRight size={14} />
                    </button>
                </div>
            </form>

            <AnimatePresence>
                {lastAction && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 5 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-full left-0 right-0 mt-1"
                    >
                        <div className={`text-xs px-3 py-1.5 rounded-lg inline-block ${lastAction.startsWith('Error') ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                            {lastAction}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
