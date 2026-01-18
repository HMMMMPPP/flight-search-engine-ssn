# Coding Standards

This document outlines the coding standards and best practices for SkySpeed Neo development.

## TypeScript Standards

### Strict Type Safety
```typescript
// ✅ Good: Explicit typing
interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  passengers: number;
}

function searchFlights(params: SearchParams): Promise<Flight[]> {
  // Implementation
}

// ❌ Bad: Using any
function searchFlights(params: any): any {
  // Don't do this
}
```

### Type Definitions
- Define interfaces for all component props
- Use `type` for unions and intersections
- Use `interface` for object shapes
- Export types from dedicated `types.ts` files when shared

```typescript
// ✅ Good: Well-typed component
interface FlightCardProps {
  flight: Flight;
  onSelect: (flightId: string) => void;
  isSelected?: boolean;
}

export function FlightCard({ flight, onSelect, isSelected = false }: FlightCardProps) {
  // Implementation
}
```

### Avoid `any`
```typescript
// ❌ Bad
const data: any = fetchData();

// ✅ Good
interface ApiResponse {
  flights: Flight[];
  meta: Metadata;
}
const data: ApiResponse = await fetchData();
```

## Component Standards

### Functional Components Only
```typescript
// ✅ Good: Functional component
export function SearchForm() {
  return <form>...</form>;
}

// ❌ Bad: Class component (avoid)
export class SearchForm extends React.Component {
  render() {
    return <form>...</form>;
  }
}
```

### Component Structure
Order component internals consistently:
1. Props interface
2. Component function
3. Hooks (useState, useEffect, etc.)
4. Event handlers
5. Render logic
6. Return statement

```typescript
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  // 1. State hooks
  const [isOpen, setIsOpen] = useState(false);
  
  // 2. Effect hooks
  useEffect(() => {
    // Side effects
  }, []);
  
  // 3. Event handlers
  const handleClick = () => {
    setIsOpen(true);
    onAction();
  };
  
  // 4. Render logic
  const content = isOpen ? <div>{title}</div> : null;
  
  // 5. Return
  return (
    <div onClick={handleClick}>
      {content}
    </div>
  );
}
```

### Props Destructuring
```typescript
// ✅ Good: Destructure in function signature
export function FlightCard({ flight, onSelect }: FlightCardProps) {
  return <div onClick={() => onSelect(flight.id)}>{flight.airline}</div>;
}

// ❌ Bad: Access via props object
export function FlightCard(props: FlightCardProps) {
  return <div onClick={() => props.onSelect(props.flight.id)}>{props.flight.airline}</div>;
}
```

## File Organization

### Naming Conventions
- **Components**: PascalCase (`SearchForm.tsx`)
- **Utilities**: camelCase (`priceAnalysis.ts`)
- **Types**: PascalCase (`FlightTypes.ts`)
- **Hooks**: camelCase (`useFlightSearch.ts`)
- **Constants**: SCREAMING_SNAKE_CASE in `constants.ts`

### Directory Structure
```
src/
├── app/                    # Next.js pages and routes
├── components/
│   ├── search/            # Search-related components
│   │   ├── filters/
│   │   ├── form/
│   │   └── layout/
│   ├── analytics/         # Analytics components
│   └── ai-assistant/      # AI features
├── lib/
│   ├── agents/            # Business logic
│   ├── services/          # API clients
│   └── utils/             # Utility functions
└── types/                 # Shared TypeScript definitions
```

### File Size Guidelines
- Components: < 300 lines (extract if larger)
- Utilities: < 200 lines (split into modules)
- Types: < 100 lines (split by domain)

## Styling Standards

### Tailwind CSS Preferred
```typescript
// ✅ Good: Tailwind classes
<div className="flex items-center gap-4 p-6 bg-slate-900 rounded-lg">
  <span className="text-white font-semibold">Flight Details</span>
</div>

// ❌ Bad: Inline styles
<div style={{ display: 'flex', padding: '24px', backgroundColor: '#0f172a' }}>
  <span style={{ color: 'white', fontWeight: 600 }}>Flight Details</span>
</div>
```

### Dark Mode Support
Always include dark mode classes:
```typescript
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
  Content
</div>
```

### Responsive Design
Use mobile-first approach:
```typescript
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Mobile: full width, Tablet: half, Desktop: third */}
</div>
```

## State Management

### Local State
Use `useState` for component-specific state:
```typescript
const [isOpen, setIsOpen] = useState(false);
```

### Shared State
Use Context API for cross-component state:
```typescript
const FilterContext = createContext<FilterState | undefined>(undefined);

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) throw new Error('useFilters must be used within FilterProvider');
  return context;
}
```

### Complex State
Use `useReducer` for complex state logic:
```typescript
type FilterAction = 
  | { type: 'SET_PRICE_RANGE'; min: number; max: number }
  | { type: 'TOGGLE_AIRLINE'; airline: string }
  | { type: 'RESET' };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_PRICE_RANGE':
      return { ...state, priceRange: { min: action.min, max: action.max } };
    // ... other cases
  }
}
```

## API and Data Fetching

### Error Handling
Always handle errors explicitly:
```typescript
// ✅ Good
try {
  const flights = await searchFlights(params);
  return flights;
} catch (error) {
  console.error('Flight search failed:', error);
  throw new Error('Failed to fetch flights');
}

// ❌ Bad
const flights = await searchFlights(params);
return flights;
```

### Type API Responses
```typescript
interface AmadeusFlightResponse {
  data: FlightOffer[];
  meta: {
    count: number;
  };
}

async function fetchFlights(): Promise<Flight[]> {
  const response = await fetch('/api/search');
  const data: AmadeusFlightResponse = await response.json();
  return data.data.map(transformFlightOffer);
}
```

## Performance Best Practices

### Memoization
Use `useMemo` for expensive calculations:
```typescript
const sortedFlights = useMemo(() => {
  return flights.sort((a, b) => a.price - b.price);
}, [flights]);
```

### Callbacks
Use `useCallback` for event handlers passed as props:
```typescript
const handleSelect = useCallback((flightId: string) => {
  setSelectedFlight(flightId);
}, []);
```

### Dynamic Imports
Code-split large components:
```typescript
const PriceHistoryGraph = dynamic(() => import('./PriceHistoryGraph'), {
  loading: () => <Skeleton />,
});
```

## Comments and Documentation

### JSDoc for Public APIs
```typescript
/**
 * Searches for flights based on the provided criteria.
 * 
 * @param params - The search parameters
 * @param params.origin - Origin airport code (IATA)
 * @param params.destination - Destination airport code (IATA)
 * @returns Promise resolving to array of flight offers
 * @throws {Error} When API request fails
 */
export async function searchFlights(params: SearchParams): Promise<Flight[]> {
  // Implementation
}
```

### Inline Comments
Only when logic is non-obvious:
```typescript
// Calculate layover duration accounting for timezone differences
const layoverMinutes = differenceInMinutes(arrivalTime, departureTime) - timezoneOffset;
```

## Git Commit Standards

### Conventional Commits
```bash
# Format: <type>(<scope>): <subject>

feat(search): add multi-city search support
fix(filters): resolve price range slider bug
docs(readme): update installation instructions
refactor(analytics): extract chart logic to utility
style(header): adjust mobile responsive padding
perf(api): implement request caching
test(utils): add price calculation tests
chore(deps): update dependencies
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `refactor`: Code restructuring
- `style`: Code style/formatting
- `perf`: Performance improvement
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

## Related Documentation

- [Contributing Guide](./contributing.md)
- [Testing Guidelines](./testing.md)
- [Architecture](../architecture/)
