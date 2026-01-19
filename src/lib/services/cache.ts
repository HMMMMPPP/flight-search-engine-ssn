export interface CacheEntry<T> {
    value: T;
    expiry: number;
}

export class CacheService {
    private cache: Map<string, CacheEntry<any>>;
    private defaultTTL: number;

    constructor(defaultTTLSeconds: number = 3600) {
        this.cache = new Map();
        this.defaultTTL = defaultTTLSeconds * 1000;
    }

    set<T>(key: string, value: T, ttlSeconds?: number): void {
        const ttl = ttlSeconds ? ttlSeconds * 1000 : this.defaultTTL;
        const expiry = Date.now() + ttl;
        this.cache.set(key, { value, expiry });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }

        return entry.value as T;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }
}

export const cacheService = new CacheService();
