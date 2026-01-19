
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { amadeusService } from '../src/lib/services/amadeus';

async function verifyCache() {
    const origin = 'LON';
    const destination = 'PAR';

    console.log(`\nStarting Cache Verification for route: ${origin} -> ${destination}`);

    // First Call - Should hit API (Miss)
    console.log('\n[1] Making first call (Expected: Cache Miss, Slower)...');
    const start1 = performance.now();
    const result1 = await amadeusService.getCheapestDates(origin, destination);
    const time1 = performance.now() - start1;
    console.log(`[1] Completed in ${time1.toFixed(2)}ms`);
    console.log(`[1] Result count: ${result1?.length || 0}`);

    // Second Call - Should hit Cache (Hit)
    console.log('\n[2] Making second call (Expected: Cache Hit, Faster)...');
    const start2 = performance.now();
    const result2 = await amadeusService.getCheapestDates(origin, destination);
    const time2 = performance.now() - start2;
    console.log(`[2] Completed in ${time2.toFixed(2)}ms`);
    console.log(`[2] Result count: ${result2?.length || 0}`);

    // Verification Logic
    if (time2 < time1 && time2 < 50) { // Assuming cache hit is very fast < 50ms
        console.log('\n✅ PASS: Cache is working. Second call was significantly faster.');
    } else if (time2 >= time1) {
        console.log('\n❌ FAIL: Second call was not faster. Cache might not be working.');
    } else {
        console.log('\n⚠️  WARN: Second call was faster but slower than expected for in-memory cache.');
    }
}

// Run verification
verifyCache().catch(console.error);
