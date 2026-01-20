# Component Architecture

This document tracks the organization and responsibility of key React components in the SkySpeed Neo application.

## ✈️ Search Module (`src/components/search`)

### Filters (`/filters`)
Responsible for managing and rendering search criteria refinements.
- **`FilterSidebar.tsx`**: The main container for all filter widgets (Desktop). Manages localized state before applying changes.
- **`MobileFilterBar.tsx`**: The mobile-optimized bottom sheet for filters. Syncs state with the main search URL parameters.
- **`FilterShared.tsx`**: Utility functions and types (`SmoothSlider`, `toTitleCase`) shared between mobile and desktop views.
- **`shared/`**:
  - **`AirlineCheckbox.tsx`**: Renders airline options with dictionary lookup.
  - **`StopsCheckbox.tsx`**: Renders stop count toggles (Direct, 1 Stop, 2+).
  - **`AirportGroup.tsx`**: Collapsible group of airport checkboxes by country.

### Form (`/form`)
Responsible for capturing user search intent.
- **`SearchForm.tsx`**: The primary form component. Handles controlled inputs for Origin, Destination, Dates, and Class.
- **`SearchFormWrapper.tsx`**: A client-side wrapper ensuring the form plays nicely with Server Components (SSR) and Suspense boundaries.
- **`TravellersSelector.tsx`**: A complex dropdown for selecting passenger counts and cabin class.

## 📊 Analytics Module (`src/components/analytics`)

- **`PriceHistoryGraph.tsx`**: High-fidelity chart visualizing price trends over time. Adapts to "One-way" (hourly) vs "Round-trip" (daily) data modes.
- **`TrendStrategist.tsx`**: AI-driven widget providing market advice (e.g., "Buy Now").

## 🤖 AI Assistant (`src/components/ai-assistant`)

- **`AIStrategistPanel.tsx`**: The side panel showing deep dive analysis of the current flight search options.
- **`AICommandBar.tsx`**: Natural language input interface for detailed queries.

## 🧩 Shared UI (`src/components/ui`)

- **`DatePicker.tsx`**: Custom date range picker component.
- **`LocationSearchInput.tsx`**: Autocomplete input for airport/city selection.
- **`TimePriceSlider.tsx`**: Specialized slider with integrated histograms for departure/return time selection.
