# Caching Strategy

## Overview

To optimize performance and reduce API costs, we have implemented an **In-Memory Caching Strategy** for the Flight Search Engine. This strategy checks for flexible data (like "Cheapest Dates") in a local cache before making expensive calls to external providers like Amadeus.

## Architecture

### The Cache Service (`src/lib/services/cache.ts`)

We use a singleton `CacheService` class that provides a simple key-value store with Time-To-Live (TTL) support.

- **Storage**: `Map<string, { value: T, expiry: number }>`
- **Scope**: Per server instance / Lambda execution context.
- **Persistence**: Non-persistent (cleared on restart/deploy).

### Usage

The cache is currently integrated into the `AmadeusService` for the `getCheapestDates` endpoint.

```typescript
// Example Implementation
const cacheKey = `cheapest_dates_${origin}_${destination}`;
const cachedParams = await cacheService.get(cacheKey);

if (cachedParams) {
    return cachedParams;
}

const response = await apiCall(...);
cacheService.set(cacheKey, response.data, 3600); // Cache for 1 hour
```

## Configuration

- **Default TTL**: 1 hour (3600 seconds).
- **Custom TTL**: Can be overridden per `set` call.

## Future Roadmap

As the application scales, we plan to migrate from In-Memory to a distributed cache:
1.  **Phase 1 (Current)**: In-Memory (Node.js Heap). Fast, zero-infra.
2.  **Phase 2**: Redis / Upstash. Shared state across serverless functions, persistent across deploys.

## Trade-offs

| Feature | In-Memory (Current) | Distributed (Future) |
| :--- | :--- | :--- |
| **Speed** | Fastest (nanoseconds) | Fast (milliseconds) |
| **Cost** | Free | Paid / Managed |
| **Consistency** | Per-instance (can drift) | Global consistency |
| **Complexity** | Low | Medium |
