import { SearchFormWrapper } from '@/components/search/form/SearchFormWrapper';
import { TrendStrategist } from '@/components/analytics/TrendStrategist';

// Force dynamic if we want real-time random inspiration, or cache it
export const revalidate = 3600; // Cache for 1 hour

export default async function LandingPage() {
  // LANDING PAGE IS NOW CLEAN - No pre-fetched dashboard data

  return (
    <main className="min-h-screen relative overflow-hidden text-slate-200 font-sans selection:bg-sky-500/30">
      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none bg-[#0a0a12]">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-sky-900/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">

        {/* Header & Search */}
        <header className="space-y-8 flex flex-col items-center pt-20">
          <div className="text-center space-y-2">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter">
              SkySpeed Neo
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Agentic flight search powered by Amadeus Intelligence.
            </p>
          </div>

          {/* Search Form pushes to /search */}
          {/* Search Form pushes to /search */}
          <SearchFormWrapper isOnLandingPage={true} />

          {/* AI Trend Strategist (Mocked Demo) */}
          <TrendStrategist />
        </header>

        {/* Dashboard removed as per user request for clean state */}

      </div>
    </main>
  );
}
