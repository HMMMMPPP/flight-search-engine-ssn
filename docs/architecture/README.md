# Architecture

This section covers the technical architecture, design decisions, and system structure of SkySpeed Neo.

## 📁 Documentation

### [Tech Stack](./tech-stack.md)
Technology choices, frameworks, and libraries used in the project.
- Core frameworks (Next.js, TypeScript)
- UI libraries (Tailwind CSS, Framer Motion)
- AI/LLM integration (Google Gemini, Groq)
### [Decisions (ADR)](./decisions/001-migration-to-duffel.md)
Architectural decisions and provider migrations.
- [001: Migration to Duffel](./decisions/001-migration-to-duffel.md)

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
│  Duffel API      │  │  Google Gemini   │
│  (Flight Data)   │  │  (AI/NLP)        │
└──────────────────┘  └──────────────────┘
```

## 🔗 Related Documentation

- [Tech Stack Details](./tech-stack.md)
- [Component Breakdown](./components.md)
- [Directory Structure](./structure.md)
- [Getting Started](../getting-started/)
