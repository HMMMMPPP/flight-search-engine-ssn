# Flight Search Engine MVP Implementation Plan

This document outlines the systematic approach taken to build the "SkySpeed Neo" Flight Search Engine MVP. It details the architectural decisions, feature implementations, and verification steps that defined the path to the current production-ready state.

## 🎯 Goal
Build a high-performance, agentic flight search engine that leverages **Amadeus Intelligence** for real-time flight data and **Google Gemini** for natural language processing and strategic insights. The application must feature a premium, dark-themed "glassmorphism" UI and offer "Senior Data Analyst" grade analytics.

## 🏗️ Architecture & Setup

### Tech Stack
*   **Framework**: Next.js 16 (App Router) for server-side rendering and routing.
*   **Language**: TypeScript for strict type safety.
*   **Styling**: Tailwind CSS 4 with custom raw CSS for glassmorphism effects; Framer Motion for animations.
*   **State Management**: React Hooks (Context + Local State) for filter and search management.
*   **Data Visualization**: Recharts for price history analytics.
*   **AI/LLM**: Google Generative AI (Gemini) for natural language search and strategic advice.
*   **Flight Data**: Amadeus Self-Service API.

### Directory Structure Refactor
Established a domain-driven structure to ensure scalability:
*   `src/app`: Page routes (`/`, `/search`).
*   `src/components/search`: specialized sub-directories:
    *   `filters/`: `FilterSidebar`, `FilterShared` (UI logic for stops, airlines, etc.)
    *   `form/`: `SearchForm`, `SearchFormWrapper` (Input handling).
    *   `layout/`: `SearchResultsLayout`, `BentoFlightCard`.
*   `src/components/analytics`: `PriceHistoryGraph`.
*   `src/components/ai-assistant`: `AIStrategistPanel`.
*   `src/lib/agents`: Specialized logic for search, filters, and strategy (`searchAgent.ts`, `filterAgent.ts`).

## 💻 Core Feature Implementation

### 1. Search Interface
**Objective**: Create a seamless, intuitive entry point.
*   **Landing Page**: Hero section with a central `SearchForm`.
*   **Search Form**:
    *   One-way/Round-trip support.
    *   Date pickers, Passenger selectors, Class selectors.
    *   **Natural Language Input**: "Flights to Paris next weekend under $600".
    *   Seamless transition to `/search` results page with query parameters.

### 2. Flight Results & Integration
**Objective**: Display real flight data with clear, actionable details.
*   **Integration**: Connect to Amadeus API via `src/app/api/search/route.ts`.
*   **BentoFlightCard**:
    *   Clear display of Airline, Departure/Arrival times, Duration.
    *   **Smart Stops**: Explicit visualization of stops (e.g., "1 Stop (IST)") and layovers.
    *   **Price**: Prominent, distinct pricing display.
    *   **Actions**: "Select" button for booking flow.

### 3. Advanced Filtering
**Objective**: Empower users to refine results instantly.
*   **FilterSidebar**:
    *   **Independent Scrolling**: Sticky sidebar implementation for easy access.
    *   **Stops**: Multi-select (Direct, 1 Stop, 2+ Stops).
    *   **Airlines**: Dynamic list extraction from available results.
    *   **Price Range**: Dual-slider for precise budget control.
    *   **Time & Duration**: Granular control over specific flight times.
*   **Logic**: Real-time frontend filtering for immediate feedback loop.

### 4. Analytics & AI Intelligence
**Objective**: Provide decision-support tools beyond simple lists.
*   **Price History Graph**:
    *   "Senior Data Analyst" grade visualization.
    *   **Intraday Analysis**: Hourly price points for specific dates.
    *   **Trend Analysis**: Date-range trends for flexible searches.
    *   **Dynamic Tooltips**: Detailed hover states with formatted currency.
*   **AI Strategist Panel**:
    *   **Context Aware**: Analyzes current search results vs. historical data.
    *   **Verdict**: "BUY NOW" vs "WAIT" recommendations.
    *   **Reasoning**: Natural language explanation of the recommendation to build user trust.

### 5. UI/UX Polish
**Objective**: "Wow" the user with a premium feel.
*   **Theme**: Deep dark mode with white/transparent glass layers.
*   **Interactions**: Smooth hover effects, `framer-motion` transitions on filter changes.
*   **Responsiveness**: Mobile-optimized layouts (collapsible filters, stackable cards).

## 🔍 Verification Plan

### Automated Testing
*   **Unit Tests**:
    *   `src/lib/utils/priceAnalysis.ts`: Validate inputs (flight data) produce correct stats and recommendations.
    *   `src/lib/agents`: Verify LLM prompt construction and response parsing mechanics.

### Manual Verification
1.  **Search Flow**:
    *   Enter "NYC" to "LON", select dates.
    *   Verify redirection to `/search` and distinct flight results loading.
2.  **Filter Logic**:
    *   Set max price -> Verify expensive flights disappear.
    *   Uncheck "1 Stop" -> Verify only Direct flights remain.
3.  **Visualization**:
    *   Hover over Price Graph points -> Verify tooltip values match Y-axis.
    *   Check "Recommendation" badge (Green/Yellow/Red) aligns with price trends.
4.  **Responsiveness**:
    *   Resize to mobile -> Verify Sidebar becomes a drawer/modal or stacks correctly.

## 🚀 Deployment & Handoff
*   Review `docs/progress/checklist.md` to ensure all refactoring items are checked.
*   Final build verification: `npm run build`.
