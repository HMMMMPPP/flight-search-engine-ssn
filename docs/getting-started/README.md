# Getting Started with SkySpeed Neo

Welcome! This guide will help you set up and run SkySpeed Neo on your local machine.

## Prerequisites

Before you begin, ensure you have:
- **Node.js** 20.x or higher
- **npm** or **pnpm** package manager
- **Git** for version control
- API keys for:
  - Amadeus (Test or Production)
  - Google Gemini
  - Groq (optional, for AI features)

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd flight-search-engine
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:
```env
AMADEUS_API_KEY=your_amadeus_key
AMADEUS_API_SECRET=your_amadeus_secret
AMADEUS_HOSTNAME=test

GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Next Steps

- **Learn the architecture**: See [Architecture](../architecture/) docs
- **Understand the codebase**: Check [Component Architecture](../architecture/components.md)
- **Start contributing**: Read [Contributing Guide](../development/contributing.md)
- **Set up local development**: Follow [Local Development Setup](./local-development.md)

## Need Help?

- Check the [Architecture](../architecture/) section for system design details
- Review [Coding Standards](../development/coding-standards.md) before making changes
- See [Project Roadmap](../project/roadmap.md) for planned features
