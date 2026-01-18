export interface AircraftDetails {
    name: string;
    vibe: number; // 0-10 Quality Score
    tags: string[];
    bodyType: 'wide' | 'narrow' | 'regional';
}

export const AIRCRAFT_DB: Record<string, AircraftDetails> = {
    // --- BOEING ---
    '787': { name: 'Boeing 787 Dreamliner', vibe: 9.2, tags: ['Mood Lighting', 'Quiet Cabin', 'Large Windows'], bodyType: 'wide' },
    '788': { name: 'Boeing 787-8 Dreamliner', vibe: 9.0, tags: ['Mood Lighting', 'Quiet Cabin'], bodyType: 'wide' },
    '789': { name: 'Boeing 787-9 Dreamliner', vibe: 9.4, tags: ['Mood Lighting', 'Quiet Cabin'], bodyType: 'wide' },
    '777': { name: 'Boeing 777', vibe: 8.5, tags: ['Spacious', 'Reliable'], bodyType: 'wide' },
    '77W': { name: 'Boeing 777-300ER', vibe: 8.8, tags: ['Spacious', 'Smooth Ride'], bodyType: 'wide' },
    '737': { name: 'Boeing 737', vibe: 6.0, tags: ['Standard'], bodyType: 'narrow' },
    '738': { name: 'Boeing 737-800', vibe: 6.5, tags: ['Standard'], bodyType: 'narrow' },
    '73H': { name: 'Boeing 737-800 (Winglets)', vibe: 6.8, tags: ['Modern Interior'], bodyType: 'narrow' },
    '7M8': { name: 'Boeing 737 MAX 8', vibe: 7.5, tags: ['Modern', 'Sky Interior'], bodyType: 'narrow' },

    // --- AIRBUS ---
    '380': { name: 'Airbus A380', vibe: 9.8, tags: ['Super Jumbo', 'Silent', 'Bar/Lounge Potential'], bodyType: 'wide' },
    '350': { name: 'Airbus A350', vibe: 9.6, tags: ['Extra Wide', 'Quiet', 'Fresh Air'], bodyType: 'wide' },
    '359': { name: 'Airbus A350-900', vibe: 9.6, tags: ['Extra Wide', 'Quiet'], bodyType: 'wide' },
    '351': { name: 'Airbus A350-1000', vibe: 9.7, tags: ['Flagship', 'Quiet'], bodyType: 'wide' },
    '330': { name: 'Airbus A330', vibe: 7.8, tags: ['2-4-2 Layout'], bodyType: 'wide' },
    '339': { name: 'Airbus A330-900neo', vibe: 8.9, tags: ['Airspace Cabin', 'Quiet'], bodyType: 'wide' },
    '320': { name: 'Airbus A320', vibe: 6.5, tags: ['Standard'], bodyType: 'narrow' },
    '32N': { name: 'Airbus A320neo', vibe: 7.8, tags: ['Modern', 'Quiet Engines'], bodyType: 'narrow' },
    '321': { name: 'Airbus A321', vibe: 6.5, tags: ['Standard'], bodyType: 'narrow' },
    '32Q': { name: 'Airbus A321neo', vibe: 7.8, tags: ['Modern'], bodyType: 'narrow' },
    '220': { name: 'Airbus A220', vibe: 9.0, tags: ['Huge Windows', '2-3 Layout', 'Spacious'], bodyType: 'narrow' },
    '223': { name: 'Airbus A220-300', vibe: 9.0, tags: ['Huge Windows', 'Spacious'], bodyType: 'narrow' },

    // --- EMBRAER / BOMBARDIER (Regional) ---
    'E90': { name: 'Embraer E190', vibe: 7.5, tags: ['No Middle Seat', '2-2 Layout'], bodyType: 'regional' },
    'E95': { name: 'Embraer E195', vibe: 7.5, tags: ['No Middle Seat'], bodyType: 'regional' },
    'E75': { name: 'Embraer E175', vibe: 7.2, tags: ['No Middle Seat', 'Quick Boarding'], bodyType: 'regional' },
    'CR9': { name: 'CRJ-900', vibe: 5.5, tags: ['Tight', 'Fast'], bodyType: 'regional' },
    'CRK': { name: 'CRJ-1000', vibe: 5.8, tags: ['Regional'], bodyType: 'regional' },

    // --- GENERIC FALLBACKS ---
    'BUS': { name: 'Bus / Train', vibe: 4.0, tags: ['Ground Transport'], bodyType: 'regional' },
    'TRN': { name: 'Train', vibe: 5.0, tags: ['Rail Service'], bodyType: 'regional' }
};

export const DEFAULT_AIRCRAFT: AircraftDetails = {
    name: 'Standard Aircraft',
    vibe: 6.0,
    tags: [],
    bodyType: 'narrow'
};
