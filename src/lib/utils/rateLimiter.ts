export class TokenBucket {
    private capacity: number;
    private tokens: number;
    private lastRefill: number;
    private refillRateMs: number;
    private queue: (() => void)[];
    private timer: NodeJS.Timeout | null = null;

    /**
     * @param capacity Maximum number of tokens in the bucket (burst limit).
     * @param refillRateMs Time in milliseconds to refill 1 token.
     */
    constructor(capacity: number = 10, refillRateMs: number = 10) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.refillRateMs = refillRateMs;
        this.lastRefill = Date.now();
        this.queue = [];
    }

    private refill() {
        const now = Date.now();
        const elapsed = now - this.lastRefill;

        if (elapsed >= this.refillRateMs) {
            const newTokens = Math.floor(elapsed / this.refillRateMs);
            if (newTokens > 0) {
                this.tokens = Math.min(this.capacity, this.tokens + newTokens);
                this.lastRefill = now;
                // Alternatively: this.lastRefill = this.lastRefill + newTokens * this.refillRateMs; 
                // But resetting to 'now' is safer against drift for simple usage.
            }
        }
    }

    private processQueue() {
        this.refill();

        if (this.queue.length === 0) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            return;
        }

        while (this.tokens >= 1 && this.queue.length > 0) {
            this.tokens -= 1;
            const next = this.queue.shift();
            if (next) next();
        }

        if (this.queue.length > 0) {
            this.scheduleNextRefill();
        }
    }

    private scheduleNextRefill() {
        if (this.timer) return;
        const now = Date.now();
        const timeSinceLastRefill = now - this.lastRefill;
        const timeToNextToken = Math.max(0, this.refillRateMs - timeSinceLastRefill);

        this.timer = setTimeout(() => {
            this.timer = null;
            this.processQueue();
        }, timeToNextToken);
    }

    async throttle<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const execute = async () => {
                try {
                    resolve(await fn());
                } catch (e) {
                    reject(e);
                }
            };

            this.refill();

            if (this.tokens >= 1) {
                this.tokens--;
                execute();
            } else {
                this.queue.push(execute);
                this.scheduleNextRefill();
            }
        });
    }
}

// 10 requests per 100ms means 1 request every 10ms on average.
// Capacity 10 allows a burst of 10.
export const amadeusRateLimiter = new TokenBucket(10, 10);
