// Enhanced Airport Database for UI Display
export interface AirportDetail {
    name: string;
    city: string;
    country: string;
}

export const AIRPORT_DETAILS: Record<string, AirportDetail> = {
    // London
    'LON': { name: 'All Airports', city: 'London', country: 'United Kingdom' },
    'LHR': { name: 'Heathrow', city: 'London', country: 'United Kingdom' },
    'LGW': { name: 'Gatwick', city: 'London', country: 'United Kingdom' },
    'STN': { name: 'Stansted', city: 'London', country: 'United Kingdom' },
    'LTN': { name: 'Luton', city: 'London', country: 'United Kingdom' },
    'LCY': { name: 'City Airport', city: 'London', country: 'United Kingdom' },
    'SEN': { name: 'Southend', city: 'London', country: 'United Kingdom' },

    // New York
    'NYC': { name: 'All Airports', city: 'New York', country: 'USA' },
    'JFK': { name: 'John F. Kennedy Intl', city: 'New York', country: 'USA' },
    'EWR': { name: 'Newark Liberty', city: 'New York', country: 'USA' },
    'LGA': { name: 'LaGuardia', city: 'New York', country: 'USA' },

    // Paris
    'PAR': { name: 'All Airports', city: 'Paris', country: 'France' },
    'CDG': { name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
    'ORY': { name: 'Orly', city: 'Paris', country: 'France' },
    'BVA': { name: 'Beauvais', city: 'Paris', country: 'France' },

    // Tokyo
    'TYO': { name: 'All Airports', city: 'Tokyo', country: 'Japan' },
    'HND': { name: 'Haneda', city: 'Tokyo', country: 'Japan' },
    'NRT': { name: 'Narita', city: 'Tokyo', country: 'Japan' },

    // Others
    'DXB': { name: 'Dubai International', city: 'Dubai', country: 'UAE' },
    'SIN': { name: 'Changi', city: 'Singapore', country: 'Singapore' },
    'HKG': { name: 'Hong Kong Intl', city: 'Hong Kong', country: 'China' },
    'LAX': { name: 'Los Angeles Intl', city: 'Los Angeles', country: 'USA' },
    'SFO': { name: 'San Francisco Intl', city: 'San Francisco', country: 'USA' },
    'ORD': { name: 'O\'Hare', city: 'Chicago', country: 'USA' },
    'ATL': { name: 'Hartsfield-Jackson', city: 'Atlanta', country: 'USA' },
    'AMS': { name: 'Schiphol', city: 'Amsterdam', country: 'Netherlands' },
    'FRA': { name: 'Frankfurt Intl', city: 'Frankfurt', country: 'Germany' },
    'MUC': { name: 'Munich Intl', city: 'Munich', country: 'Germany' },
    'MAD': { name: 'Barajas', city: 'Madrid', country: 'Spain' },
    'BCN': { name: 'El Prat', city: 'Barcelona', country: 'Spain' },
    'IST': { name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
    'MEX': { name: 'Benito Juarez', city: 'Mexico City', country: 'Mexico' },
    'MNL': { name: 'Ninoy Aquino', city: 'Manila', country: 'Philippines' },
    'CUN': { name: 'Cancun International', city: 'Cancun', country: 'Mexico' },
    'YYZ': { name: 'Pearson', city: 'Toronto', country: 'Canada' },
    'YUL': { name: 'Trudeau', city: 'Montreal', country: 'Canada' },
    'YVR': { name: 'Vancouver Intl', city: 'Vancouver', country: 'Canada' },
    'SYD': { name: 'Kingsford Smith', city: 'Sydney', country: 'Australia' },
    'MEL': { name: 'Tullamarine', city: 'Melbourne', country: 'Australia' },
};

// Backwards compatibility for simpler lookups
export const AIRPORT_CODES: Record<string, string> = Object.fromEntries(
    Object.entries(AIRPORT_DETAILS).map(([code, details]) => [code, `${details.city} ${details.name}`])
);
