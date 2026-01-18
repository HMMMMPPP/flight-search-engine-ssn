# Architecture

This section covers the technical architecture, design decisions, and system structure of SkySpeed Neo.

## 📁 Documentation

### [Tech Stack](./tech-stack.md)
Technology choices, frameworks, and libraries used in the project.
- Core frameworks (Next.js, TypeScript)
- UI libraries (Tailwind CSS, Framer Motion)
- AI/LLM integration (Google Gemini, Groq)
- Flight data APIs (Amadeus)

### [Component Architecture](./components.md)
Detailed breakdown of React components and their responsibilities.
- Search module components
- Analytics and visualization components
- AI assistant components
- Shared UI components

### [Directory Structure](./structure.md)
File organization and module boundaries.
- Source code organization
- Component directory structure
- Library and utility modules

## 🎯 Design Principles

### Domain-Driven Structure
Components are organized by feature domain rather than technical type:
- `search/` - All search-related features
- `analytics/` - Data visualization and insights
- `ai-assistant/` - AI-powered features

### Separation of Concerns
- **UI Components**: Pure presentation logic
- **Business Logic**: Extracted to `src/lib/agents/`
- **API Routes**: Server-side data fetching in `src/app/api/`

### Type Safety
- Strict TypeScript mode enabled
- No `any` types allowed
- Comprehensive interface definitions

## 🏗️ System Overview

```
┌─────────────────────────────────────────────┐
│           User Interface (Next.js)          │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐ │
│  │ Search  │  │ Results  │  │ Analytics  │ │
│  └─────────┘  └──────────┘  └────────────┘ │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│            API Routes (Serverless)          │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐ │
│  │ /search │  │ /trends  │  │ /ai-cmd    │ │
│  └─────────┘  └──────────┘  └────────────┘ │
└─────────────────────────────────────────────┘
         ↓                  ↓
┌──────────────────┐  ┌──────────────────┐
│  Amadeus API     │  │  Google Gemini   │
│  (Flight Data)   │  │  (AI/NLP)        │
└──────────────────┘  └──────────────────┘
```

## 🔗 Related Documentation

- [Tech Stack Details](./tech-stack.md)
- [Component Breakdown](./components.md)
- [Directory Structure](./structure.md)
- [Getting Started](../getting-started/)
