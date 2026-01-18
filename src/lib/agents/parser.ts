import { UserIntent } from '../types';

export const parserAgent = async (query: string): Promise<UserIntent> => {
    // Simulate LLM Processing time
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock Logic: Extract simple keywords or default
    const isLondon = query.toLowerCase().includes('london');
    const isJapan = query.toLowerCase().includes('japan') || query.toLowerCase().includes('tokyo');
    const isLuxury = query.toLowerCase().includes('first') || query.toLowerCase().includes('business');

    return {
        origin: 'JFK',
        destination: isLondon ? 'LHR' : (isJapan ? 'HND' : 'LAX'),
        dateStr: '2026-05-15',
        pax: 1,
        cabinClass: isLuxury ? 'business' : 'economy',
        persona: isLuxury ? 'luxury' : 'budget',
    };
};
