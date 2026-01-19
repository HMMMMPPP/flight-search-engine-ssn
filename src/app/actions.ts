'use server';

import { orchestrateSearch } from '@/features/orchestrator/swarm-engine';
import { Flight } from '@/types';

export async function searchFlights(formData: FormData): Promise<{ flights: Flight[], priceMetrics?: any }> {
    return await orchestrateSearch(formData);
}
