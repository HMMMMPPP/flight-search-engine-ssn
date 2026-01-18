'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Currency {
    code: string;
    name: string;
    symbol: string;
}

export interface Language {
    code: string;
    name: string;
    flag: string;
}

export type Theme = 'light' | 'dark' | 'system';

interface SettingsContextType {
    currency: Currency;
    language: Language;
    theme: Theme;
    setCurrency: (c: Currency) => void;
    setLanguage: (l: Language) => void;
    setTheme: (t: Theme) => void;
}

const DEFAULT_CURRENCY: Currency = { code: 'USD', name: 'US Dollar', symbol: '$' };
const DEFAULT_LANGUAGE: Language = { code: 'en-US', name: 'English (United States)', flag: '🇺🇸' };

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    // Initialize with defaults, update from localStorage on mount
    const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);
    const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
    // THEME LOCKED: Force dark mode until UI is optimized for theme switching
    const [theme, setThemeState] = useState<Theme>('dark');

    useEffect(() => {
        const storedCurrency = localStorage.getItem('skyspeed_currency');
        const storedLanguage = localStorage.getItem('skyspeed_language');
        const storedTheme = localStorage.getItem('skyspeed_theme');

        if (storedCurrency) {
            try {
                setCurrencyState(JSON.parse(storedCurrency));
            } catch (e) {
                console.error('Failed to parse stored currency', e);
            }
        }

        if (storedLanguage) {
            try {
                setLanguageState(JSON.parse(storedLanguage));
            } catch (e) {
                console.error('Failed to parse stored language', e);
            }
        }

        // THEME LOCKED: Ignore stored theme preferences
        // if (storedTheme) {
        //     if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
        //         setThemeState(storedTheme as Theme);
        //     }
        // }
    }, []);

    // THEME LOCKED: Always apply dark mode regardless of settings
    useEffect(() => {
        const root = window.document.documentElement;
        // Remove any existing theme classes
        root.classList.remove('light', 'dark');
        // Force dark mode
        root.classList.add('dark');
    }, []); // Empty dependency array - only run once on mount

    const setCurrency = (c: Currency) => {
        setCurrencyState(c);
        localStorage.setItem('skyspeed_currency', JSON.stringify(c));
    };

    const setLanguage = (l: Language) => {
        setLanguageState(l);
        localStorage.setItem('skyspeed_language', JSON.stringify(l));
    };

    // THEME LOCKED: No-op function, theme changes are disabled
    const setTheme = (t: Theme) => {
        console.warn('Theme switching is currently disabled. App is locked to dark mode.');
        // setThemeState(t);
        // localStorage.setItem('skyspeed_theme', t);
    };

    return (
        <SettingsContext.Provider value={{ currency, language, theme, setCurrency, setLanguage, setTheme }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
