'use client';

import { Sun, Moon } from 'lucide-react';
import { useSettings, Theme } from '@/context/SettingsContext';

export function ThemeToggle() {
    const { theme, setTheme } = useSettings();

    const cycleTheme = () => {
        if (theme === 'dark') setTheme('light');
        else setTheme('dark');
    };

    const getIcon = () => {
        switch (theme) {
            case 'dark': return <Moon size={20} className="text-sky-400" />;
            case 'light':
            default: return <Sun size={20} className="text-amber-400" />;
        }
    };

    return (
        <button
            type="button"
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all border bg-white/5 border-white/5 text-slate-400 opacity-40 cursor-not-allowed"
            aria-label="Toggle Theme (In Development)"
            title="This feature is currently in development"
            disabled
        >
            {getIcon()}
        </button>
    );
}
