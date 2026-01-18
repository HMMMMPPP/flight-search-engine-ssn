'use client';

import { Sun, Moon } from 'lucide-react';
import { useSettings, Theme } from '@/context/SettingsContext';

export function ThemeToggle() {
    // Theme is locked to dark mode - this component is disabled
    return (
        <button
            type="button"
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all border bg-white/5 border-white/5 text-slate-400 opacity-40 cursor-not-allowed"
            aria-label="Theme Toggle (Disabled - Dark Mode Only)"
            title="Theme switching is disabled. App is optimized for dark mode only."
            disabled
        >
            <Moon size={20} className="text-sky-400" />
        </button>
    );
}
