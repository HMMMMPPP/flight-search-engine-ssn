import { Flight } from '@/types';

interface CacheEntry {
    flights: Flight[];
    priceHistory: any[];
    dictionaries: any;
    timestamp: number;
}

class SearchCache {
    private cache: Map<string, CacheEntry>;
    private readonly TTL = 1000 * 60 * 60; // 1 Hour

    constructor() {
        this.cache = new Map();
    }

    private generateKey(formData: FormData): string {
        // Create a unique key based on search parameters (excluding pagination)
        const params = [
            formData.get('origin'),
            formData.get('destination'),
            formData.get('date'),
            formData.get('returnDate'),
            formData.get('pax'),
            formData.get('cabinClass'),
            formData.get('currency')
        ];
        return params.join('|');
    }

    get(formData: FormData): CacheEntry | null {
        const key = this.generateKey(formData);
        const entry = this.cache.get(key);

        if (!entry) return null;

        // Check Expiry
        if (Date.now() - entry.timestamp > this.TTL) {
            this.cache.delete(key);
            return null;
        }

        return entry;
    }

    set(formData: FormData, data: Omit<CacheEntry, 'timestamp'>): void {
        const key = this.generateKey(formData);

        // Simple memory management: Clear if too large
        if (this.cache.size > 100) {
            this.cache.clear();
        }

        this.cache.set(key, {
            ...data,
            timestamp: Date.now()
        });
    }
}

// Singleton Instance
export const searchCache = new SearchCache();
