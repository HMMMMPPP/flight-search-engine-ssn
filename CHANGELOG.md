# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-01-22

### Changed
- **API Migration**: Switched flight search provider from Amadeus to **Duffel API**.
  - Replaced `@amadeus/amadeus-node` with `@duffel/api`.
  - Implemented new `duffelService` adapter.
  - Updated `aggregatorAgent` to use Duffel service.
  - Removed decommissioned `getCheapestDates` Amadeus call.
- **Branding**: Updated all UI references from "Amadeus Intelligence" to "Duffel API".
- **Documentation**:
  - Created ADR `001-migration-to-duffel.md`.
  - Updated `tech-stack.md` and architecture README.

### Fixed
- Resolved "System Error 141" occurring with Amadeus test environment.
- Fixed logging in `amadeusService` (legacy) to better capture error details before migration.
