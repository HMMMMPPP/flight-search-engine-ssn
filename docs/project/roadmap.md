# Feature Roadmap

This document outlines the future development roadmap for SkySpeed Neo.

## Overview

SkySpeed Neo follows a phased approach to feature development, prioritizing core functionality first, then expanding to support global usage and conversion optimization.

## Completed Phases

### ✅ Phase 1: Structure Reorganization
**Status**: Completed  
**Goal**: Establish scalable codebase organization

- [x] Create domain-driven directory structure
- [x] Move components to feature-based folders
- [x] Update import paths across application
- [x] Verify no breaking changes

### ✅ Phase 2: Code Cleanup
**Status**: Completed  
**Goal**: Improve code quality and maintainability

- [x] Add JSDoc documentation to key components
- [x] Extract business logic from UI components
- [x] Create reusable utility functions
- [x] Implement strict TypeScript typing

### ✅ Phase 3: MVP Implementation
**Status**: Completed  
**Goal**: Deliver production-ready flight search engine

**Core Features**:
- [x] Natural language search interface
- [x] Real-time flight data from Amadeus API
- [x] Advanced filtering (price, stops, airlines, time)
- [x] Price history analytics with dynamic graphs
- [x] AI-powered flight recommendations
- [x] Premium glassmorphism UI with dark mode
- [x] Fully responsive mobile design

## Current Phase

## Current Phase

### 🔄 Phase 3.5: Production API Migration & Optimization
**Status**: In Progress  
**Priority**: High  
**Goal**: Transition from Amadeus Test API to Production API and Optimize Performance

**Tasks**:
- [ ] Obtain Amadeus Production credentials
- [ ] Update environment variables and configuration
- [ ] Implement production-specific error handling
- [ ] Adjust rate limiting for production quotas
- [x] Add optional caching layer for cost optimization (Dual-Layer implemented)
- [x] Implement Server-Side Orchestration for global filtering/sorting
- [x] Optimize Analysis Latency (O(N) algorithms & Memoization)
- [ ] Perform extensive testing and validation
- [ ] Set up monitoring and alerts
- [ ] Deploy with feature flag for gradual rollout

**Reference**: See [Production API Migration](../deployment/production-api-migration.md)

## Future Phases

### 📋 Phase 4: Global Expansion Features
**Status**: Planned  
**Timeline**: Q2 2026  
**Goal**: Support global user base with localization

#### 4.1: Language & Currency Integration
**Rationale**: Enable users worldwide to search and view prices in their preferred language and currency.

**Features**:
- [ ] Multi-language support (i18n)
  - English (default)
  - Spanish
  - French
  - German
  - Japanese
  - Chinese
- [ ] Currency conversion
  - Real-time exchange rates API integration
  - Display prices in user's selected currency
  - Currency selector in UI
- [ ] Locale-specific date/time formatting
- [ ] Region-specific airport prioritization

**Technical Approach**:
- Use Next.js i18n routing
- Implement `react-intl` or `next-i18next`
- Integrate currency API (e.g., exchangerate-api.com)
- Store user preferences in localStorage

**Estimated Effort**: 3-4 weeks

---

#### 4.2: Profile Management & Settings
**Rationale**: Personalize user experience and save travel preferences.

**Features**:
- [ ] User authentication
  - Email/password signup
  - Social login (Google, Apple)
  - JWT token-based auth
- [ ] User profiles
  - Personal information
  - Saved travelers (family members)
  - Passport details
  - TSA PreCheck / Known Traveler numbers
- [ ] Preferences
  - Preferred airlines
  - Preferred airports
  - Seat preferences
  - Meal preferences
  - Accessibility needs
- [ ] Travel history
  - Past searches
  - Booked flights
  - Favorite routes
- [ ] Theme persistence
  - Dark/light mode preference
  - Custom color schemes

**Technical Approach**:
- Use NextAuth.js for authentication
- Implement user database (Supabase or Firebase)
- Create profile management UI
- Secure API routes with authentication middleware

**Estimated Effort**: 4-6 weeks

---

#### 4.3: Booking Page Implementation
**Rationale**: Complete the user journey from search to conversion.

**Features**:
- [ ] Secure checkout flow
  - Passenger details form (auto-fill from profile)
  - Contact information
  - Emergency contact
- [ ] Seat selection
  - Interactive seat map
  - Extra legroom options
  - Seat pricing
- [ ] Add-ons
  - Baggage selection
  - Travel insurance
  - Lounge access
  - Meal upgrades
- [ ] Payment integration
  - Credit/debit card processing
  - Digital wallets (Apple Pay, Google Pay)
  - Buy now, pay later (Affirm, Klarna)
- [ ] Booking confirmation
  - Email confirmation
  - PDF ticket generation
  - Add to calendar option
  - Trip management dashboard

**Technical Approach**:
- Integrate Stripe or Amadeus Booking API
- Implement PCI-compliant payment flow
- Create multi-step checkout form with validation
- Generate PDF tickets with QR codes
- Send transactional emails with SendGrid

**Estimated Effort**: 6-8 weeks

---

### 📋 Phase 5: Advanced Features
**Status**: Future Consideration  
**Timeline**: Q3-Q4 2026

#### 5.1: Multi-City Search
- [ ] Support for complex itineraries with multiple stops
- [ ] Visual route builder
- [ ] Price optimization for multi-city routes

#### 5.2: Price Alerts & Tracking
- [ ] Email/SMS notifications for price drops
- [ ] Track flights without booking
- [ ] Historical price predictions

#### 5.3: Travel Recommendations
- [ ] AI-powered destination suggestions
- [ ] Best time to fly analysis
- [ ] Seasonal pricing insights
- [ ] Hidden city ticketing detection

#### 5.4: Group Bookings
- [ ] Multi-passenger management
- [ ] Shared booking links
- [ ] Group discounts

#### 5.5: Loyalty Program Integration
- [ ] Connect frequent flyer accounts
- [ ] Earn miles/points calculation
- [ ] Redeem miles for flights

---

## Priority Matrix

| Feature | Priority | Impact | Effort | Status |
| :--- | :---: | :---: | :---: | :---: |
| Production API Migration | 🔴 High | High | Low | Pending |
| Language & Currency | 🟡 Medium | High | Medium | Planned |
| Profile Management | 🟢 Low | Medium | Medium | Planned |
| Booking Implementation | 🔴 High | Very High | High | Planned |
| Multi-City Search | 🟢 Low | Medium | Medium | Future |
| Price Alerts | 🟡 Medium | Medium | Low | Future |
| Travel Recommendations | 🟢 Low | Medium | Medium | Future |
| Group Bookings | 🟢 Low | Low | Medium | Future |

---

## Dependencies

### External Services Required for Phase 4
- **Currency API**: For real-time exchange rates
- **Authentication Provider**: NextAuth.js, Auth0, or Firebase Auth
- **Database**: Supabase, Firebase, or PostgreSQL
- **Payment Gateway**: Stripe or Amadeus Booking API
- **Email Service**: SendGrid or AWS SES
- **SMS Service** (optional): Twilio for price alerts

### Cost Estimates
- Currency API: Free tier available
- Database: Free tier (Supabase/Firebase)
- Authentication: Free tier (NextAuth.js self-hosted)
- Payment: 2.9% + $0.30 per transaction (Stripe)
- Email: Free tier (SendGrid: 100 emails/day)

---

## Versioning

### Current Version: v1.1.4 (Mobile & Polish)
- **Mobile Filter Sync**: Unified logic between desktop sidebar and mobile bottom sheet.
- **Console Cleanliness**: Resolved viewport metadata deprecations and Recharts warnings.
- **Type Safety**: Enforced strict typing across search engine core.
- **Core Search Engine**: v1.1.0 Feature set (Server-side orchestration)
- **Advanced Filtering**: Full parity between mobile/desktop.

### Planned Versions
- **v1.2**: Production API migration
- **v1.3**: Language & currency support
- **v2.0**: User profiles and authentication
- **v2.5**: Booking implementation
- **v3.0**: Advanced features (multi-city, alerts)

---

## How to Contribute to Roadmap

Have ideas for features? Follow these steps:
1. Open an issue on GitHub with `[Feature Request]` tag
2. Describe the feature and its value proposition
3. Estimate user demand and technical complexity
4. Community votes on feature priority

---

## Related Documentation

- [MVP Implementation](./mvp-implementation.md)
- [Architecture](../architecture/)
- [Deployment](../deployment/)
