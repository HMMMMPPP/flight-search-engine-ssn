# Changelog

All notable changes to SkySpeed Neo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Documentation reorganization into categorized structure

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
