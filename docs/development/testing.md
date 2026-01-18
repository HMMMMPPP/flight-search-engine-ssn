# Testing Guidelines

This document outlines the testing strategy and procedures for SkySpeed Neo.

## Testing Strategy

### Manual Testing (Current Approach)
Given the project's current scope, we rely on comprehensive manual testing rather than automated test suites. This approach is suitable for early-stage development and rapid iteration.

### Future Automated Testing
As the project scales, consider implementing:
- Unit tests with Jest
- Integration tests with React Testing Library
- E2E tests with Playwright or Cypress

## Manual Testing Checklist

### Pre-Commit Testing
Before committing code changes:

#### Build Verification
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] No TypeScript compilation errors
- [ ] No ESLint warnings

#### Type Checking
```bash
npx tsc --noEmit
```
- [ ] No type errors reported

### Feature Testing

#### Search Functionality
- [ ] **One-way search**:
  - Enter origin and destination
  - Select departure date
  - Verify results load
  - Check that flight cards display correctly
- [ ] **Round-trip search**:
  - Enter origin and destination
  - Select departure and return dates
  - Verify results load
  - Check that return flights display
- [ ] **Natural language input**:
  - Try "Paris next weekend"
  - Try "London under $500"
  - Verify AI parses intent correctly

#### Filtering
- [ ] **Price filter**:
  - Adjust price range slider
  - Verify expensive flights disappear immediately
  - Reset filter and verify all flights return
- [ ] **Stops filter**:
  - Select "Direct only"
  - Verify only non-stop flights shown
  - Select "1 Stop"
  - Verify 1-stop flights included
- [ ] **Airlines filter**:
  - Uncheck specific airline
  - Verify flights from that airline hidden
  - Re-check airline
  - Verify flights return
- [ ] **Time filter**:
  - Adjust departure time range
  - Verify flights outside range hidden
  - Repeat for return time (round-trip)

#### Analytics
- [ ] **Price History Graph**:
  - Verify graph displays data
  - Hover over data points
  - Check tooltip shows correct price
  - Verify dates on X-axis match search dates
- [ ] **AI Strategist Panel**:
  - Check for "BUY NOW" or "WAIT" recommendation
  - Verify reasoning is provided
  - Check recommendation aligns with price trends

#### UI/UX
- [ ] **Header**:
  - Verify logo is visible
  - Check search form is accessible
  - Test theme toggle (if implemented)
- [ ] **Loading states**:
  - Verify spinner/skeleton during data fetch
  - No layout shift when data loads
- [ ] **Empty states**:
  - Search with no results (e.g., "XXX to YYY")
  - Verify "No flights found" message
- [ ] **Error states**:
  - Disable network (DevTools → Network → Offline)
  - Verify error message displays
  - Re-enable network and verify recovery

### Browser Compatibility

Test in the following browsers:
- [ ] **Chrome/Edge** (Chromium) - Latest version
- [ ] **Firefox** - Latest version
- [ ] **Safari** (macOS only) - Latest version

### Responsive Testing

Test at the following viewport widths:

#### Mobile (375px - 767px)
- [ ] Landing page displays correctly
- [ ] Search form is usable
- [ ] Flight cards stack vertically
- [ ] Filters accessible (drawer/modal or collapsed)
- [ ] Price graph is readable
- [ ] No horizontal scroll

#### Tablet (768px - 1023px)
- [ ] Layout adapts appropriately
- [ ] Filters visible in sidebar or collapsible
- [ ] Flight cards use available space well
- [ ] Graph scales correctly

#### Desktop (1024px+)
- [ ] Full layout with sidebar filters
- [ ] Flight grid/list displays optimally
- [ ] Graph uses full width effectively
- [ ] No wasted whitespace

### Performance Testing

#### Lighthouse Audit
Run Lighthouse in Chrome DevTools:
```
DevTools → Lighthouse → Generate report
```

**Target Scores**:
- [ ] Performance: > 90
- [ ] Accessibility: > 95
- [ ] Best Practices: > 95
- [ ] SEO: > 90

**Key Metrics**:
- [ ] LCP (Largest Contentful Paint): < 2.5s
- [ ] FID (First Input Delay): < 100ms
- [ ] CLS (Cumulative Layout Shift): < 0.1

#### Network Throttling
Test with throttled connection:
```
DevTools → Network → Throttling → Fast 3G
```
- [ ] Page loads within 5 seconds
- [ ] API requests complete reasonably
- [ ] Loading states are smooth

### Accessibility Testing

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus indicators are visible
- [ ] Enter/Space activate buttons
- [ ] Esc closes modals/dropdowns

#### Screen Reader
Test with built-in screen readers:
- Windows: Narrator
- macOS: VoiceOver
- Linux: Orca

- [ ] Alt text on images
- [ ] Form labels are announced
- [ ] Button purposes are clear
- [ ] Heading hierarchy is logical

### Dark Mode Testing
- [ ] Toggle dark mode (if theme toggle exists)
- [ ] All text is readable (sufficient contrast)
- [ ] Glassmorphism effects work in dark theme
- [ ] No white flashes or jarring transitions

## Testing New Features

When adding a new feature:

1. **Plan test scenarios** before coding
2. **Test happy path** (expected user flow)
3. **Test edge cases**:
   - Empty data
   - Invalid inputs
   - Network failures
   - Large datasets
4. **Test error handling**:
   - API errors
   - Validation errors
   - Unexpected data formats
5. **Test cross-browser** compatibility
6. **Test mobile responsiveness**
7. **Document test results** in PR description

## Regression Testing

After significant changes:

### Full Smoke Test
- [ ] Landing page loads
- [ ] Search completes successfully
- [ ] Results display correctly
- [ ] Filters work as expected
- [ ] Analytics render properly
- [ ] No console errors
- [ ] No network request failures

### Component-Specific Tests
If you changed a specific component, focus testing on:
- The modified component itself
- Parent components that use it
- Child components it renders
- Related components in the same feature

## Debugging Tips

### React DevTools
Install React DevTools extension:
- Inspect component props and state
- Profile component renders
- Identify performance bottlenecks

### Network Tab
Monitor API requests:
- Check request/response payloads
- Verify correct endpoints are called
- Check for failed requests
- Monitor response times

### Console Errors
- Fix all console errors before committing
- Investigate warnings (especially React warnings)
- Use `console.log` sparingly (remove before commit)

### Breakpoints
Use browser debugger:
- Set breakpoints in source code
- Step through function execution
- Inspect variable values at runtime

## Test Data

### Valid Airport Codes
Use these for testing:
- **NYC** (New York JFK)
- **LAX** (Los Angeles)
- **LON** (London)
- **PAR** (Paris)
- **TYO** (Tokyo)
- **SYD** (Sydney)

### Invalid Inputs
Test error handling with:
- Empty strings
- Invalid airport codes (e.g., "XXX", "123")
- Past dates
- Return date before departure date
- 0 passengers

## Related Documentation

- [Contributing Guide](./contributing.md)
- [Coding Standards](./coding-standards.md)
- [Architecture](../architecture/)
