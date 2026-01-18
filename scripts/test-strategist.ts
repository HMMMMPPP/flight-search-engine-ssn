import { strategistAgent } from '../src/lib/agents/strategist';
import { Flight } from '../src/lib/types';

// Mock Flight Data
const mockFlights: Flight[] = [
    {
        id: 'f1', price: 900, duration: 'PT10H', stops: 0, airline: 'BA', flightNumber: '117',
        departure: { time: '2023-10-10T10:00:00' } as any,
        arrival: { time: '2023-10-10T20:00:00' } as any,
        segments: [], class: 'economy',
        vibe: { score: 8, aircraft: '787', description: 'Great' }
    },
    {
        id: 'f2', price: 400, duration: 'PT14H', stops: 1, airline: 'FR', flightNumber: '442',
        departure: { time: '2023-10-10T06:00:00' } as any,
        arrival: { time: '2023-10-10T20:00:00' } as any,
        segments: [], class: 'economy',
        vibe: { score: 4, aircraft: '737', description: 'Basic' }
    },
    {
        id: 'f3', price: 1200, duration: 'PT9H', stops: 0, airline: 'VS', flightNumber: '009',
        departure: { time: '2023-10-10T12:00:00' } as any,
        arrival: { time: '2023-10-10T21:00:00' } as any,
        segments: [], class: 'economy',
        vibe: { score: 9.5, aircraft: 'A350', description: 'Luxury' }
    }
];

async function runTest() {
    console.log("🧪 Testing SkySpeed Strategist...");

    const results = await strategistAgent(mockFlights);

    // Check Analysis
    const budgetPick = results.find(f => f.analysis?.tags.includes('Cheapest'));
    const vibePick = results.find(f => f.analysis?.tags.includes('Best Vibe'));

    console.log("------------------------------------------------");
    console.log(`Budget Pick: ${budgetPick?.id} ($${budgetPick?.price})`);
    console.log(`Budget Score: ${budgetPick?.analysis?.personaScores?.budgetMaster}/100`);

    console.log(`Vibe Pick: ${vibePick?.id} (Vibe: ${vibePick?.vibe?.score})`);
    console.log(`Vibe Score: ${vibePick?.analysis?.personaScores?.vibeScout}/100`);

    // Assertions
    if (budgetPick?.id === 'f2') console.log("✅ Budget identification passed.");
    else console.error("❌ Budget identification failed.");

    if (vibePick?.id === 'f3') console.log("✅ Vibe identification passed.");
    else console.error("❌ Vibe identification failed.");

    console.log("------------------------------------------------");
}

runTest();
