# Changelog

All notable changes to SkySpeed Neo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.5] - 2026-01-21

### Fixed
- **Build System**: Fixed TypeScript error in Netlify build by handling optional `FilterOptions` in `SearchPage` with a default fallback.

## [1.1.4] - 2026-01-21

### Refactored
- **Filter Components**: Unified filtering logic by extracting shared components (`AirlineCheckbox`, `StopsCheckbox`, `AirportGroup`) to reducing code duplication.
- **Mobile & Desktop Sync**: Synchronized core logic between `FilterSidebar` and `MobileFilterBar` while strictly maintaining platform-specific interactions (Live vs Draft state).

### Fixed
- **Type Safety**: Removed `any` types from `swarm-engine` and hardened `FilterOptions` with strict dictionary definitions.
- **Dead Code**: Removed unused legacy components from `FilterShared.tsx`.
- **Console Warnings**:
  - Fixed Next.js `viewport` metadata deprecation warning in `/search/page.tsx`.
  - Resolved Recharts `width`/`height` invalid value warnings in `PriceHistoryGraph.tsx`.

## [1.1.3] - 2026-01-20

### Fixed
- **Mobile Search Form Visibility**: Fixed critical issue where `DatePicker` and `TravellersSelector` were not appearing on mobile devices.
  - Replaced `framer-motion` modals with `z-[9999]` fixed positioning to resolve stacking context conflicts.
  - Converted form triggers from `div` to `button` for improved accessibility and touch handling.
  - Resolved `ReferenceError` crashes in `TravellersSelector` caused by missing React imports.
- **Hydration Mismatches**: Fixed server/client hydration errors by adding `suppressHydrationWarning` to date-dependent text nodes.

## [1.1.2] - 2026-01-20

### Fixed
- **Mobile Search Form**: Fixed layout of departure and return date fields to be side-by-side on mobile devices, optimizing vertical space.
- **Travelers Selector**: Fixed mobile responsiveness of the travelers/class selector popover to prevent overflow on small screens.

## [1.1.1] - 2026-01-20

### Performance
- **Latency Optimization**: Optimized `parseDuration` with memoization and single-pass parsing, reducing overhead for 50k+ daily operations.
- **Fast Analysis**: Refactored `analyzeBatch` to O(N) complexity (merged 8 loops into 1), significantly speeding up searching.
- **Efficient Metrics**: Optimized `calculateIntradayMetrics` string parsing for faster graph generation.

### Fixed
- **Global Analysis Scope**: Fixed bug where `PriceHistory` and `AIStrategist` only saw the first 10 flights. They now correctly analyze the full dataset on the server.
- **Slider Glitching**: Fixed "ghosting" / visual glitches on Price, Duration, and Layover sliders by implementing a Drag Lock mechanism (`isDragging` state) to decouple user interaction from server prop updates.
- **Type Safety**: Fixed `SortOption` type mismatch in URL parsing.

## [1.1.0] - 2026-01-20

### Added
- **Server-Side Orchestration**: All filtering and sorting logic moved to the server (`swarm-engine`).
- **Global Sorting**: "Sort by" now sorts the entire dataset before pagination (e.g., sort by price affects all 100+ flights, not just the visible 10).
- **Global Filtering**: Filters (Price, Duration) apply to the full dataset on the server.
- **Dynamic Facets**: Filter options (e.g., available airlines, price range) are dynamically calculated based on the search context.
- **Server-Side Caching**: Implemented in-memory caching for instant pagination and filter updates.

### Changed
- **URL-Driven State**: Refactored `SearchResultsLayout` to be stateless; all state is now managed via URL parameters for deep-linking support.
- **Pagination Logic**: Moved from "Visual Pagination" to "True Server Pagination" with numbered pages.

## [1.0.5] - 2026-01-20

### Added
- Client-side pagination for search results (Load More functionality)
- Initial render limit of 10 flights for improved performance

## [1.0.4] - 2026-01-20

### Changed
- Replaced legacy `favicon.ico` with modern `icon.png` (Stylized 'S')
- Updated `layout.tsx` title and metadata for cleaner branding
- Relocated favicon to `public/` directory for better static file handling

## [1.0.3] - 2026-01-20

### Changed
- Refactored shared types to `src/types/index.ts`
- Refactored schemas to `src/types/schemas.ts`
- Moved utility scripts to `scripts/` directory
- Updated import paths across the codebase to use new type locations

### Performance
- Removed simulated latency (300ms) from `swarm-engine` for faster production searches
- Optimized agent orchestration flow
- Implemented 1-hour caching layer for `getCheapestDates` API calls to reduce Amadeus quota usage

### Removed
- Unused Sentry example files and routes
- Legacy `check_routes.ts` file (moved to scripts)

### Documentation
- Added documentation for `instrumentation.ts` and `instrumentation-client.ts` in `structure.md`
- Updated `sentry-setup.md` with instrumentation details

## [1.0.2] - 2026-01-19

### Fixed
- Build failure for `/booking` page caused by SSG/SSR conflict
- Booking page navigation state loss ("Back to Search" now preserves context)
- "Return Home" from booking page not re-populating search form

### Changed
- Refactored `BookingPage` into Server Component with Suspense
- Updated `SearchFormWrapper` to accept initial values from URL parameters
- Improved `BentoFlightCard` to forward flight and search details to booking

## [1.0.1] - 2026-01-19

### Added
- Booking page placeholder with development status message

### Fixed
- Theme system locked to dark mode to prevent UI issues until theme optimization is complete

## [1.0.0] - 2026-01-19

### Added
- **Core Search Engine**
  - One-way and round-trip flight search
  - Natural language search input with AI parsing
  - Real-time flight data from Amadeus API
  - Location autocomplete with airport/city lookup

- **Advanced Filtering**
  - Price range slider with dual handles
  - Stops filter (Direct, 1 Stop, 2+ Stops)
  - Airlines multi-select filter
  - Departure and return time filters
  - Flight duration filter
  - Independent scrolling filter sidebar

- **Analytics & Insights**
  - Price history graph with dynamic date ranges
  - Intraday analysis mode (hourly price points)
  - Price trend mode (date-range trends)
  - Interactive tooltips with formatted prices
  - AI-powered flight recommendations ("Buy Now" vs "Wait")
  - Strategic reasoning and market analysis

- **AI Features**
  - Google Gemini integration for natural language processing
  - AI Strategist Panel with context-aware advice
  - Natural language command bar
  - Groq AI fallback option

- **UI/UX**
  - Premium glassmorphism design
  - Deep dark mode theme
  - Fully responsive mobile layout
  - Smooth animations with Framer Motion
  - Sticky header and sidebar
  - Loading states and skeletons
  - Error boundaries and fallbacks

- **Developer Experience**
  - Strict TypeScript configuration
  - ESLint and Prettier setup
  - Component-based architecture
  - Domain-driven folder structure

### Changed
- Migrated from create-react-app to Next.js 16
- Refactored components into feature-based directories
- Extracted business logic into separate utility modules

### Infrastructure
- Created `.gitignore` for sensitive files
- Added `netlify.toml` for deployment configuration
- Implemented SEO metadata with OpenGraph tags
- Created `robots.txt` and `sitemap.ts`
- Set up security headers

## [0.3.0] - 2026-01-18

### Added
- Light/dark theme toggle
- Theme persistence with localStorage
- Mobile filter drawer implementation
- Sticky positioning for header and panels

### Fixed
- Header z-index overlap issues on mobile
- Slider flickering during interaction
- Max layover filter mismatch
- Price graph label crowding for long date ranges
- LCP performance optimization

## [0.2.0] - 2026-01-17

### Added
- Filter sidebar with real-time filtering
- Component naming refactor (search → searches)
- AI command filter integration
- Flight recommendation logic unification

### Fixed
- Duplicate flight results issue
- AI command filter type errors
- Inconsistent recommendation display

## [0.1.0] - 2026-01-16

### Added
- Initial MVP implementation
- Basic search functionality
- Flight results display with BentoFlightCard
- Amadeus API integration
- Basic filtering capabilities

---

## Version Numbering

- **Major version** (x.0.0): Breaking changes or significant feature additions
- **Minor version** (0.x.0): New features, backwards compatible
- **Patch version** (0.0.x): Bug fixes and minor improvements

---

## Related Documentation

- [MVP Implementation](./mvp-implementation.md)
- [Roadmap](./roadmap.md)
- [Architecture](../architecture/)
