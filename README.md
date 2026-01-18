# ✈️ SkySpeed Neo - AI-Powered Flight Search Engine

> **An intelligent flight search platform that combines real-time Amadeus data with AI-driven insights to help travelers make smarter booking decisions.**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Key Features

- **🤖 AI-Powered Search** - Natural language queries parsed by Google Gemini AI
- **📊 Smart Price Analytics** - Real-time trend analysis with "Buy Now" vs "Wait" recommendations
- **🎯 Advanced Filtering** - Comprehensive filters for stops, airlines, baggage, departure times, and more
- **📈 Price History Graphs** - Visual trend analysis with intraday and multi-day views
- **🎨 Premium UI/UX** - Glassmorphism-inspired dark theme with smooth Framer Motion animations
- **⚡ Lightning Fast** - Next.js 16 App Router with React Server Components
- **🌍 Global Coverage** - Powered by Amadeus API with worldwide flight data

---

## ⚡ Quick Start (30-Second Setup)

### Prerequisites
- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/flight-search-engine.git
cd flight-search-engine

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
```

### Environment Configuration

Edit `.env.local` and add your API keys:

```env
# Required: Amadeus Flight API (Free tier available)
AMADEUS_API_KEY=your_amadeus_api_key
AMADEUS_API_SECRET=your_amadeus_api_secret

# Required: Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Optional: Groq AI (Alternative AI provider)
GROQ_API_KEY=your_groq_api_key

# Optional: Sentry Error Tracking (Production)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

**🔑 Where to Get API Keys:**
- **Amadeus**: [developers.amadeus.com](https://developers.amadeus.com/) (Free test tier)
- **Google Gemini**: [aistudio.google.com](https://aistudio.google.com/) (Free tier available)
- **Groq** (Optional): [console.groq.com](https://console.groq.com/)
- **Sentry** (Optional): [sentry.io](https://sentry.io/)

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🛠️ Tech Stack

### Core Framework
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[TypeScript 5](https://www.typescriptlang.org/)** - Strict type safety
- **[React 19](https://react.dev/)** - Latest React features

### Styling & UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Icon library

### Data & AI
- **[Amadeus API](https://developers.amadeus.com/)** - Real-time flight data
- **[Google Generative AI](https://ai.google.dev/)** - Gemini 1.5 Flash for NLP
- **[Groq SDK](https://groq.com/)** - Alternative AI inference
- **[Recharts](https://recharts.org/)** - Data visualization

### Monitoring (Production)
- **[Sentry](https://sentry.io/)** - Error tracking and performance monitoring
- **[Vercel Speed Insights](https://vercel.com/docs/speed-insights)** - Performance analytics

---

## 📂 Project Structure

```
flight-search-engine/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing page
│   │   ├── search/            # Search results page
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── search/           # Search functionality
│   │   ├── analytics/        # Price graphs & charts
│   │   ├── ai-assistant/     # AI strategist panel
│   │   └── ui/               # Shared UI components
│   └── lib/                  # Utilities, hooks, types
├── docs/                      # Comprehensive documentation
├── public/                    # Static assets
└── netlify.toml              # Netlify deployment config
```

---

## 📚 Documentation

For comprehensive documentation, visit the **[`docs/`](./docs/)** directory:

- **[Getting Started](./docs/getting-started/)** - Detailed setup and development workflow
- **[Architecture](./docs/architecture/)** - Tech stack and component design
- **[Deployment](./docs/deployment/)** - Production deployment guides
- **[Development](./docs/development/)** - Contribution guidelines and coding standards
- **[Monitoring](./docs/monitoring/)** - Observability and error tracking setup

---

## 🚀 Deployment

### Netlify (Recommended)

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Deploy:**
```bash
# Build and deploy
npm run build
netlify deploy --prod
```

3. **Set Environment Variables:**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add all required API keys from `.env.local`

**See full deployment guide:** [docs/deployment/netlify.md](./docs/deployment/netlify.md)

### Vercel (Alternative)

```bash
npm install -g vercel
vercel --prod
```

---

## 🧪 Available Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Create production build
npm start        # Run production build locally
npm run lint     # Run ESLint for code quality
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Read the full guide:** [docs/development/contributing.md](./docs/development/contributing.md)

---

## 📊 Project Status

- ✅ **MVP Completed** - Core flight search and AI features
- 🚧 **In Progress** - Advanced analytics and personalization
- 📋 **Roadmap** - See [docs/project/roadmap.md](./docs/project/roadmap.md)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Amadeus for Developers](https://developers.amadeus.com/)** - Flight data API
- **[Google AI Studio](https://aistudio.google.com/)** - Gemini AI platform
- **[Tailwind CSS](https://tailwindcss.com/)** - Design system foundation

---

## 📬 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/flight-search-engine/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/flight-search-engine/discussions)
- **Documentation**: [docs/](./docs/)

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and AI**

[⭐ Star this repo](https://github.com/HMMMMPPP/flight-search-engine-ssn) if you find it helpful!

</div>
