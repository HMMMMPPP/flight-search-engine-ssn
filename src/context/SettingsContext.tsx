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
    const [theme, setThemeState] = useState<Theme>('system');

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

        if (storedTheme) {
            if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
                setThemeState(storedTheme as Theme);
            }
        }
    }, []);

    // Theme Effect
    useEffect(() => {
        const root = window.document.documentElement;

        const removeOldTheme = () => {
            root.classList.remove('dark');
            root.classList.remove('light');
        };

        const applyTheme = (t: Theme) => {
            removeOldTheme();
            if (t === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                root.classList.add(systemTheme);
            } else {
                root.classList.add(t);
            }
        };

        applyTheme(theme);

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme('system');
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }

    }, [theme]);

    const setCurrency = (c: Currency) => {
        setCurrencyState(c);
        localStorage.setItem('skyspeed_currency', JSON.stringify(c));
    };

    const setLanguage = (l: Language) => {
        setLanguageState(l);
        localStorage.setItem('skyspeed_language', JSON.stringify(l));
    };

    const setTheme = (t: Theme) => {
        setThemeState(t);
        localStorage.setItem('skyspeed_theme', t);
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
