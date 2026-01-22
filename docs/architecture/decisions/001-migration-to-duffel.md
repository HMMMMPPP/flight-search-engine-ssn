# ADR 001: Migration from Amadeus to Duffel

**Date:** 2026-01-22
**Status:** Accepted

## Context
During the development of the Flight Search Engine, we encountered critical instability with the Amadeus Self-Service API (Test Environment).
Specifically, search requests (e.g., JFK -> MEX) began failing consistently with **HTTP 400** and the following body:

```json
{
  "errors": [
    {
      "status": 500,
      "code": 141,
      "title": "SYSTEM ERROR HAS OCCURRED"
    }
  ]
}
```

Investigation revealed:
-   The error persists regardless of valid parameters.
-   "System Error 141" indicates an internal failure within Amadeus's test systems, likely related to limited data availability or routing backend crashes in the sandbox tier.
-   The "Flight Cheapest Date Search" API was also found to be **decommissioned**, causing additional errors.

## Decision
We decided to **migrate the primary flight search provider from Amadeus to Duffel**.

### Alternatives Considered
1.  **Mock Data Fallback**: Rejected by the user. The preference was for a working real-world API.
2.  **API Simplification**: Attempted to disable specific parameters (like currency), but instability remained.
3.  **Duffel**: Selected for its superior developer experience, reliable sandbox environment, and easy-to-use Node.js SDK.

## implementation Strategy
1.  **Service Adapter Pattern**: A new `duffelService` (`src/lib/services/duffel.ts`) was created to wrap the Duffel SDK.
2.  **Schema Mapping**: A transformation layer (`mapDuffelOfferToFlight`) normalizes Duffel's response format (Slices/Segments) into our internal `Flight` entity, ensuring the frontend requires no changes.
3.  **Aggregator Update**: The `aggregator_v2.ts` agent was updated to switch its data source from `amadeusService` to `duffelService`.

## Consequences
### Positive
-   **Stability**: Search functionality is now operational in the test environment.
-   **Maintainability**: Duffel's SDK type definitions are robust, reducing potential runtime errors.
-   **Speed**: Faster response times observed in the sandbox.

### Negative
-   **Data Scope**: Duffel's sandbox return static/mocked data (e.g., British Airways, Duffel Airways) compared to Amadeus's potentially broader (but broken) historical cache.
-   **Refactoring Cost**: Amadeus-specific features (like `getCheapestDates` graph) are currently disabled until equivalent endpoints are integrated.
