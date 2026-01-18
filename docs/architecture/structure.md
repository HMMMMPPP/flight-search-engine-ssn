# Flight Search Engine - Code Structure

This document outlines the current structure of the Flight Search Engine MVP. Modules are categorized by their primary view context (Mobile vs. Laptop) and functionality to help you identify and track them easily.

## 📱 Mobile View Modules
*Components that are specifically designed for mobile interfaces or appear exclusively on smaller screens (< 1000px).*

- **[MobileFilterBar.tsx](src/components/search/MobileFilterBar.tsx)**
  - **Location**: `src/components/search`
  - **Purpose**: A compact sticky bar for mobile users to access filters without taking up screen space. Replaces `FilterSidebar` on screens < 1000px.
- **[CompactSearchSummary.tsx](src/components/search/CompactSearchSummary.tsx)**
  - **Location**: `src/components/search`
  - **Purpose**: A condensed summary of search criteria (e.g., "LHR - JFK • 26 Jan") shown on mobile results pages inside `SearchFormWrapper`. Tapping it opens the full edit modal.
- **[SearchFormWrapper.tsx](src/components/search/SearchFormWrapper.tsx)** (Mobile State)
  - **Location**: `src/components/search`
  - **Purpose**: Handles the mobile logic for showing the `CompactSearchSummary` and the modal portal for editing the search.

## 💻 Laptop/Desktop View Modules
*Components that are active primarily on larger screens (typically > 1000px or > 1300px).*

- **[FilterSidebar.tsx](src/components/search/FilterSidebar.tsx)**
  - **Location**: `src/components/search`
  - **Purpose**: The main sidebar containing detailed filters (Price, Airlines, Stops, etc.). Sticky positioned on the left column. Hidden on mobile.
- **[PriceHistoryGraph.tsx](src/components/visuals/PriceHistoryGraph.tsx)**
  - **Location**: `src/components/visuals`
  - **Purpose**: A large, detailed data visualization of price trends. Located in the right column. Hidden on screens < 1300px.
- **[AIStrategistPanel.tsx](src/components/dashboard/AIStrategistPanel.tsx)**
  - **Location**: `src/components/dashboard`
  - **Purpose**: The "AI Assistant" panel that offers insights (BUY/WAIT) and chat functionality. Located in the right column below the graph. Hidden on screens < 1300px.

## 🔄 Core & Shared Modules
*Responsive components used across all views or acting as orchestrators.*

- **[SearchResultsLayout.tsx](src/components/search/SearchResultsLayout.tsx)**
  - **Location**: `src/components/search`
  - **Purpose**: The main layout orchestrator. It manages state (filters, sorting, flight stack) and conditionally renders the Mobile or Desktop columns described above.
- **[BentoFlightCard.tsx](src/components/flight/BentoFlightCard.tsx)**
  - **Location**: `src/components/flight`
  - **Purpose**: The individual flight result card. Highly responsive; adapts its layout from a stacked mobile view to a wide desktop grid row.
- **[SearchForm.tsx](src/components/search/SearchForm.tsx)**
  - **Location**: `src/components/search`
  - **Purpose**: The core form for selecting origin, destination, and dates. Adaptable via `layout="horizontal" | "vertical"`.
- **[SearchPageHeader.tsx](src/components/search/SearchPageHeader.tsx)**
  - **Location**: `src/components/search`
  - **Purpose**: The top navigation bar containing the Logo, Theme Toggle, and Search Form (on desktop).
- **[TrendStrategist.tsx](src/components/home/TrendStrategist.tsx)**
  - **Location**: `src/components/home`
  - **Purpose**: The "Most Travelled" and "Trends" dashboard widget found on the Landing Page.

## 🛠 UI Components (Design System)
*Reusable UI atoms and molecules.*

- **[DatePicker.tsx](src/components/ui/DatePicker.tsx)**: Custom range/single date picker.
- **[DualRangeSlider.tsx](src/components/ui/DualRangeSlider.tsx)**: Used for Price and Duration filters.
- **[LanguageCurrencySelector.tsx](src/components/ui/LanguageCurrencySelector.tsx)**: Settings dropdown.
- **[LocationSearchInput.tsx](src/components/ui/LocationSearchInput.tsx)**: Autocomplete input for airports.
- **[ThemeToggle.tsx](src/components/ui/ThemeToggle.tsx)**: Light/Dark mode switcher.
- **[TimePriceSlider.tsx](src/components/ui/TimePriceSlider.tsx)**: Specialized slider for departure/return times.

## 📂 Core Logic & Data (Lib)

- **[src/lib/agents](src/lib/agents)**: AI Strategist logic (`strategist.ts`).
- **[src/lib/services](src/lib/services)**: Amadeus API integration (`amadeus.ts`).
- **[src/lib/utils/flightFilters.ts](src/lib/utils/flightFilters.ts)**: Filtering logic shared by Mobile and Desktop filters.
- **[src/lib/types.ts](src/lib/types.ts)**: TypeScript definitions for Flights, Filters, and State.
