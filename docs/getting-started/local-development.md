# Local Development Setup

This guide covers detailed setup instructions and common development workflows for SkySpeed Neo.

## Environment Setup

### System Requirements
- **OS**: Windows, macOS, or Linux
- **Node.js**: 20.x or higher (LTS recommended)
- **RAM**: Minimum 8GB (16GB recommended for optimal performance)
- **Disk Space**: At least 2GB free space

### Package Manager
We recommend using npm, but pnpm and yarn are also supported:
```bash
# Using npm (recommended)
npm install

# Using pnpm
pnpm install

# Using yarn
yarn install
```

## Environment Variables

### Required Variables
Create a `.env.local` file in the project root:

```env
# Amadeus Flight API
AMADEUS_API_KEY=your_key_here
AMADEUS_API_SECRET=your_secret_here
AMADEUS_HOSTNAME=test  # Use 'production' for production API

# Google Gemini AI
GEMINI_API_KEY=your_gemini_key_here

# Groq AI (optional)
GROQ_API_KEY=your_groq_key_here

# Node Environment
NODE_ENV=development
```

### Getting API Keys

**Amadeus API**:
1. Visit [Amadeus for Developers](https://developers.amadeus.com/)
2. Create a free account
3. Go to "My Apps" → "Create New App"
4. Copy the API Key and API Secret

**Google Gemini**:
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key for your project

**Groq** (Optional):
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for an account
3. Generate an API key

## Development Workflow

### Running the Development Server
```bash
npm run dev
```
- Server runs on `http://localhost:3000`
- Hot reload enabled for instant updates
- API routes available at `/api/*`

### Building for Production
Test production builds locally:
```bash
npm run build
npm start
```

### Type Checking
Run TypeScript compiler without emitting files:
```bash
npx tsc --noEmit
```

### Linting
Check code quality:
```bash
npm run lint
```

Fix auto-fixable issues:
```bash
npm run lint -- --fix
```

## Common Development Tasks

### Adding a New Component
1. Create component in appropriate directory:
   - Search features: `src/components/search/`
   - Analytics: `src/components/analytics/`
   - AI features: `src/components/ai-assistant/`
2. Use TypeScript with strict typing
3. Follow naming convention: PascalCase for components

### Adding a New API Route
1. Create route in `src/app/api/[route]/route.ts`
2. Export `GET`, `POST`, or other HTTP method handlers
3. Add rate limiting and input validation
4. Return proper error responses

### Modifying Styles
- Use Tailwind CSS classes when possible
- Custom styles go in component-specific CSS modules
- Global styles in `src/app/globals.css`

## Testing Your Changes

### Manual Testing Checklist
- [ ] Search functionality works (one-way and round-trip)
- [ ] Filters apply correctly
- [ ] Price graph displays data
- [ ] AI features respond properly
- [ ] Mobile responsive (test at 375px, 768px, 1024px widths)
- [ ] Dark mode works correctly
- [ ] No console errors

### Browser Testing
Test in:
- Chrome/Edge (Chromium)
- Firefox
- Safari (if on macOS)

## Troubleshooting

### Port Already in Use
If port 3000 is occupied:
```bash
# Kill the process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

### API Errors
- Verify `.env.local` has correct API keys
- Check API key quotas haven't been exceeded
- Ensure `AMADEUS_HOSTNAME` is set to `test` for development

### Build Errors
1. Clear `.next` folder: `rm -rf .next`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Clear npm cache: `npm cache clean --force`

## Next Steps

- Review [Architecture](../architecture/) to understand the codebase
- Read [Contributing Guidelines](../development/contributing.md)
- Check [Coding Standards](../development/coding-standards.md)
