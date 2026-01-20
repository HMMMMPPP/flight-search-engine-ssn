# Caching Strategy

## Overview

To optimize performance and reduce API costs, we have implemented a **Dual-Layer In-Memory Caching Strategy** for the Flight Search Engine. This strategy checks for flexible data (like "Cheapest Dates") and full search results in local caches to provide instant feedback and save quotas.

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

### The Search Cache (`src/lib/utils/cache.ts`)

We use a specialized `SearchCache` for the Orchestrator Engine. This caches the **final enriched output** of the agent swarm.

-   **Storage**: `Map<search_hash, SearchResult>`
-   **Purpose**: Enables **Instant Pagination** and **Instant Filtering**.
-   **Logic**:
    1.  User searches (NYC -> LON).
    2.  Engine runs full swarm (Aggregator -> Enricher -> Strategist).
    3.  Result is cached.
    4.  User clicks "Page 2" or "Filter by Price".
    5.  Engine detects same search parameters (excluding page/filter), hits cache, applies filters/slicing in memory (< 10ms), and returns new view.

### Micro-Caching (`src/lib/utils/flightFilters.ts`)

We use lightweight memoization for high-frequency utility functions:
-   **Duration Parsing**: `Map<string, number>` caches parsed ISO durations (e.g., "PT2H30M") to avoid repetitive regex/loop operations on thousands of flight segments.


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
