# Component Architecture

This document tracks the organization and responsibility of key React components in the SkySpeed Neo application.

## ✈️ Search Module (`src/components/search`)

### Filters (`/filters`)
Responsible for managing and rendering search criteria refinements.
- **`FilterSidebar.tsx`**: The main container for all filter widgets. Manages local UI state for collapsibles and delegates value updates to `setFilters`.
- **`FilterShared.tsx`**: Reusable sub-components for the filter sidebar (`SmoothSlider`, `CountryGroup`, `DetailRow`).

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
