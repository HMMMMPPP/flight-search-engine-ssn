# Technology Stack

This document details the technology choices and architectural decisions for SkySpeed Neo.

## Core Framework

### Next.js 16 (App Router)
**Why Next.js?**
- Server-side rendering (SSR) for improved SEO and initial load performance
- API routes for serverless backend functionality
- File-based routing for intuitive page structure
- Built-in optimization for images, fonts, and scripts

**App Router Benefits**:
- React Server Components for reduced JavaScript bundle size
- Streaming and Suspense support for better loading states
- Improved data fetching patterns with `async`/`await`

## Language

### TypeScript
**Strict Type Safety**:
- `strict` mode enabled in `tsconfig.json`
- No `any` types allowed (enforced via ESLint)
- Comprehensive interface definitions for all data structures

**Benefits**:
- Catch errors at compile-time rather than runtime
- Better IDE autocomplete and IntelliSense
- Self-documenting code through type definitions

## Styling

### Tailwind CSS 4
**Utility-First Approach**:
- Rapid UI development with pre-built utility classes
- Consistent design system through configuration
- Minimal CSS bundle size through PurgeCSS

**Custom Extensions**:
- Glassmorphism effects via raw CSS
- Custom color palette for dark theme
- Extended spacing and typography scales

### Framer Motion
**Animation Library**:
- Smooth transitions and micro-interactions
- Gesture-based animations (drag, hover, tap)
- Layout animations for dynamic content changes

## State Management

### React Hooks + Context API
**Lightweight State Management**:
- `useState` for component-local state
- `useContext` for shared state (filters, search params)
- `useReducer` for complex state logic (filter combinations)

**Why Not Redux/Zustand?**
- App complexity doesn't justify external state library overhead
- Context API sufficient for current scope
- Easier to understand for contributors

## Data Visualization

### Recharts
**Chart Library**:
- React-native chart components
- Responsive and customizable
- Built-in tooltip and legend support

**Used For**:
- Price history graphs
- Trend analysis visualization
- Time-based analytics

## AI/LLM Integration

### Google Generative AI (Gemini)
**Primary AI Provider**:
- Natural language search parsing
- Strategic flight recommendation generation
- Context-aware analysis

**Model Used**: `gemini-1.5-flash` (fast responses, cost-effective)

### Groq (Optional)
**Alternative AI Provider**:
- Faster inference for certain queries
- Fallback option if Gemini quota exceeded

## Flight Data API

### Duffel API
**Flight Search Provider**:
- Modern Developer Experience (DX) and robust API
- Real-time flight offers and booking capabilities
- Standardized data models across airlines
- Excellent test environment stability

**API Capabilities Used**:
- Offer Requests (Flight Search)
- Offer Management
- Order Creation (Planned)

**Environment**:
- **Test API**: robust sandbox environment
- **Live API**: Production-ready booking system

## Development Tools

### ESLint + Prettier
**Code Quality**:
- Consistent code formatting
- Enforce TypeScript best practices
- Catch common errors and anti-patterns

### Git + GitHub
**Version Control**:
- Feature branch workflow
- Conventional commits for clear history
- Pull request reviews for code quality

## Deployment

### Netlify (Recommended)
**Hosting Platform**:
- Automatic deployments from Git
- Serverless function support for API routes
- Edge network for global CDN
- Free SSL certificates

**Alternative**: Vercel (also fully supported)

## Dependencies Summary

### Production Dependencies
```json
{
  "next": "^15.x",
  "react": "^19.x",
  "typescript": "^5.x",
  "tailwindcss": "^4.x",
  "framer-motion": "^11.x",
  "recharts": "^2.x",
  "@google/generative-ai": "^0.x",
  "groq-sdk": "^0.x"
}
```

### Development Dependencies
```json
{
  "eslint": "^8.x",
  "prettier": "^3.x",
  "@types/node": "^20.x",
  "@types/react": "^19.x"
}
```

## Architecture Decisions

### Why Serverless API Routes?
- No need to manage separate backend infrastructure
- Automatic scaling based on traffic
- Cost-effective (pay per request)
- Reduced operational complexity

### Why Dark Theme by Default?
- Premium, modern aesthetic
- Reduced eye strain for users
- Better contrast for data visualization
- Aligns with "glassmorphism" design trend

### Why Client-Side Filtering?
- Instant feedback (no network latency)
- Reduced API calls and costs
- Better user experience
- API returns all results; filtering locally is efficient

## Performance Considerations

### Bundle Optimization
- Code splitting via Next.js dynamic imports
- Tree-shaking for unused exports
- Image optimization with Next.js `<Image>` component

### API Optimization
- Rate limiting to prevent quota exhaustion
- Optional caching layer for repeated queries
- Efficient data structures to minimize processing time

## Security

### API Key Protection
- Environment variables for sensitive credentials
- `.gitignore` excludes `.env` files
- Server-side API calls only (keys never exposed to client)

### Input Validation
- Sanitize user inputs before API calls
- Type checking with TypeScript
- Rate limiting on API endpoints

## Related Documentation

- [Component Architecture](./components.md)
- [Directory Structure](./structure.md)
- [Getting Started](../getting-started/)
