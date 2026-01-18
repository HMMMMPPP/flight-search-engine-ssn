
import { amadeusService } from './lib/services/amadeus';
import * as fs from 'fs';
import * as path from 'path';

// Manual Env Loader
try {
    let envPath = path.resolve(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
        envPath = path.resolve(process.cwd(), '.env.local');
    }
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
    }
} catch (e) {
    console.error('Error loading .env', e);
}

async function check() {
    console.log('Querying Amadeus for routes from MNL...');
    // We need to re-initialize Amadeus if the service initialized before env vars were loaded
    // But in this script, it imports amadeus service which creates instance at top level.
    // The import happens AFTER this file runs? No. imports run first.
    // So the Amadeus instance in 'amadeus.ts' might be created with undefined keys if imported before Env load.

    // Attempt 2: Use direct Amadeus call here or ensure Env is loaded BEFORE import.
    // Dynamic import is better.
}

async function run() {
    // Load Env First
    let envPath = path.resolve(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
        envPath = path.resolve(process.cwd(), '.env.local');
    }
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
    }

    // Now Import Service
    const { amadeusService } = await import('./lib/services/amadeus');

    const routes = await amadeusService.getFlightInspiration('MNL');
    console.log('--------------------------------');
    if (routes && routes.length > 0) {
        console.log(`Found ${routes.length} routes from Manila (MNL):`);
        routes.slice(0, 10).forEach((r: any) => {
            console.log(`- To ${r.destination}: $${r.price.total} (${r.departureDate})`);
        });
        if (routes.length > 10) console.log(`...and ${routes.length - 10} more.`);
    } else {
        console.log('No specific "Inspiration" routes found directly. Trying Check Date search...');
        // Fallback: Check if we can just search MNL to SIN as a test
        const search = await amadeusService.getCheapestDates('MNL', 'SIN');
        console.log('MNL -> SIN Availability:', search ? 'Yes' : 'No');
    }
    console.log('--------------------------------');
}

run();
