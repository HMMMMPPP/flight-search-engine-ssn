# Amadeus Production API Migration - Execution Plan

## 📋 Overview
This document provides a **step-by-step execution plan** to migrate from Amadeus **Test API** to **Production API**. The migration requires new credentials, configuration changes, enhanced error handling, and rigorous testing to ensure production-grade stability.

---

## 🎯 Current State Analysis

### What You're Using Now (Test API)
- **Environment**: `test.api.amadeus.com` (default when no hostname specified)
- **Credentials**: Test API Key & Secret in `.env.example`
- **Data Quality**: Limited, mock-like data with inconsistent availability
- **Rate Limits**: Lower limits, suitable for development
- **Cost**: Free tier with restricted endpoints (e.g., `itineraryPriceMetrics` may fail)

### Current Implementation
```typescript
// src/lib/services/amadeus.ts
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET,
    // hostname: 'test.api.amadeus.com' ← IMPLICIT (not specified)
});
```

---

## 🚀 Migration Goals

1. **Switch to Production Environment**: Real-time, accurate flight data
2. **Enhanced Rate Limiting**: Production has higher throughput but stricter quotas
3. **Robust Error Handling**: Handle billing issues, quota exhaustion gracefully
4. **Cost Management**: Monitor API usage to avoid unexpected charges
5. **Zero Downtime**: Seamless transition with fallback mechanisms

---

## 📝 Step-by-Step Execution Plan

### **Phase 1: Obtain Production Credentials**

#### Step 1.1: Create Production App
1. **Navigate to**: [Amadeus Developer Portal](https://developers.amadeus.com/)
2. **Log In** to your account
3. **Go to**: "My Self-Service Workspace" → "My Apps"
4. **Create New App**:
   - Name: `SkySpeed Neo Production`
   - Description: `Production flight search engine`
   - **Select**: "Production" environment
5. **Add Required APIs**:
   - ✅ Flight Offers Search
   - ✅ Flight Cheapest Date Search
   - ✅ Flight Inspiration Search
   - ✅ Airport & City Search
   - ✅ Flight Price Analysis (if available in your tier)
   - ✅ Air Traffic Analytics (optional, tier-dependent)

#### Step 1.2: Retrieve Production Credentials
1. **Copy** the Production API Key
2. **Copy** the Production API Secret
3. **Important**: Keep these secure - they are billable credentials

> ⚠️ **CRITICAL**: Never commit production credentials to version control. Update `.gitignore` to exclude `.env` files.

---

### **Phase 2: Environment Configuration**

#### Step 2.1: Update `.env` File
Create a **new** `.env` file (not `.env.example`) with production credentials:

```env
# AI Agent Keys (unchanged)
GROQ_API_KEY=your_groq_key_here
GEMINI_API_KEY=your_gemini_key_here

# Amadeus Production API
AMADEUS_API_KEY=YOUR_PRODUCTION_API_KEY
AMADEUS_API_SECRET=YOUR_PRODUCTION_API_SECRET
AMADEUS_HOSTNAME=production  # THIS IS CRITICAL

# Optional: Feature Flags
USE_AMADEUS_PRODUCTION=true
```

**Why `AMADEUS_HOSTNAME=production`?**
- The Amadeus SDK accepts `hostname: 'production'` to route to `api.amadeus.com` (production)
- Without this, it defaults to `test.api.amadeus.com`

#### Step 2.2: Verify `.gitignore`
Ensure `.gitignore` includes:
```gitignore
.env
.env.local
.env.production
```

---

### **Phase 3: Code Modifications**

#### Step 3.1: Update `src/lib/services/amadeus.ts`

**Current Code:**
```typescript
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET,
});
```

**Updated Production Code:**
```typescript
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET,
    hostname: process.env.AMADEUS_HOSTNAME || 'test',  // 'production' or 'test'
    ssl: true,  // Enforce HTTPS
    logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug'
});

// Log environment on startup (remove in production)
if (process.env.NODE_ENV !== 'production') {
    console.log(`🌍 Amadeus Environment: ${process.env.AMADEUS_HOSTNAME || 'test'}`);
}
```

**Why These Changes?**
- `hostname`: Explicitly sets production/test environment
- `ssl: true`: Enforces secure connections
- `logLevel`: Reduces noise in production logs

#### Step 3.2: Enhanced Error Handling for Production

**Problem**: Production API returns different error codes for billing, quota issues.

**Solution**: Wrap API calls with production-specific error handling.

**Example Enhancement in `searchFlights`:**

```typescript
searchFlights: async (params: any) => {
    try {
        const response = await amadeusRateLimiter.throttle<any>(() => amadeus.shopping.flightOffersSearch.get({
            originLocationCode: params.origin,
            destinationLocationCode: params.destination,
            departureDate: params.date,
            returnDate: params.returnDate,
            adults: params.adults || 1,
            children: params.children,
            infants: params.infants,
            travelClass: params.cabinClass ? params.cabinClass.toUpperCase() : 'ECONOMY',
            currencyCode: params.currency,
            max: 50
        }));
        return response;
    } catch (error: any) {
        // Production-specific error handling
        if (error.response?.statusCode === 429) {
            console.error('⚠️ Rate limit exceeded. Backing off...');
            // Implement exponential backoff or queue
        } else if (error.response?.statusCode === 401) {
            console.error('❌ Authentication failed. Check production credentials.');
        } else if (error.response?.statusCode === 403) {
            console.error('🚫 Forbidden. Endpoint may not be available in your subscription.');
        } else if (error.response?.statusCode === 500) {
            console.error('💥 Amadeus server error. Try again later.');
        }
        
        console.error('Amadeus Search Error:', error.response?.data || error.message);
        return { data: [] };
    }
}
```

**Apply Similar Pattern** to all methods in `amadeusService`.

#### Step 3.3: Rate Limiting Adjustments

**Current**: `TokenBucket(10, 10)` - 10 requests/sec

**Production Considerations**:
- Production tier typically allows **40-100 requests/sec** (varies by subscription)
- Check your specific quota in Amadeus portal

**Update `src/lib/utils/rateLimiter.ts`:**
```typescript
// Production-grade rate limiter
export const amadeusRateLimiter = new TokenBucket(
    process.env.AMADEUS_HOSTNAME === 'production' ? 40 : 10,  // capacity
    process.env.AMADEUS_HOSTNAME === 'production' ? 40 : 10   // refill rate
);
```

---

### **Phase 4: Testing & Validation**

#### Step 4.1: Local Testing with Production API

1. **Update `.env`** with production credentials
2. **Restart Dev Server**:
   ```bash
   npm run dev
   ```
3. **Verify Logs**: Check console for `🌍 Amadeus Environment: production`

#### Step 4.2: Smoke Tests

**Test Suite:**

| Test Case | Action | Expected Result |
|-----------|--------|----------------|
| **Search Flow** | Search NYC → LON, next week | Returns real flight offers |
| **Price Ranges** | Check if prices are realistic | Production prices (not mock $100) |
| **Airlines** | Verify airline codes | Real carriers (AA, DL, BA, etc.) |
| **Stops Logic** | Check layover airports | Real connection hubs (IST, DXB, etc.) |
| **Error Handling** | Invalid IATA code (e.g., "ZZZ") | Graceful error, no crash |
| **Rate Limiting** | Rapid successive searches | Throttling works, no 429 errors |

#### Step 4.3: Production-Specific Tests

**A. Quota Monitoring**
- Monitor Amadeus Dashboard for API usage
- Set up alerts for 80% quota usage

**B. Response Time**
- Production API may be **slower** than test (more data processing)
- Verify acceptable latency (<2s for flight search)

**C. Cost Validation**
- After 24 hours, check billing dashboard
- Estimate monthly costs based on usage

---

### **Phase 5: Deployment**

#### Step 5.1: Gradual Rollout

**Option A: Feature Flag (Recommended)**
```typescript
// src/lib/services/amadeus.ts
const useProduction = process.env.USE_AMADEUS_PRODUCTION === 'true';

const amadeus = new Amadeus({
    clientId: useProduction ? process.env.AMADEUS_PROD_KEY : process.env.AMADEUS_TEST_KEY,
    clientSecret: useProduction ? process.env.AMADEUS_PROD_SECRET : process.env.AMADEUS_TEST_SECRET,
    hostname: useProduction ? 'production' : 'test'
});
```

**Benefits**:
- Instant rollback by toggling env var
- A/B testing capability

**Option B: Environment-Based**
```typescript
const isProduction = process.env.NODE_ENV === 'production';
```

#### Step 5.2: Deploy to Vercel/Netlify

1. **Add Environment Variables** in hosting platform:
   - `AMADEUS_API_KEY` = Production Key
   - `AMADEUS_API_SECRET` = Production Secret
   - `AMADEUS_HOSTNAME` = `production`

2. **Deploy**:
   ```bash
   npm run build
   vercel --prod  # or your deployment command
   ```

3. **Monitor Logs** for first 24 hours

---

### **Phase 6: Post-Migration Monitoring**

#### Step 6.1: Set Up Alerts

**Amadeus Dashboard**:
- Enable email alerts for quota thresholds
- Monitor error rates

**Application Monitoring**:
- Use Sentry/LogRocket for production error tracking
- Track API latency metrics

#### Step 6.2: Cost Optimization

**Strategies**:
1. **Cache Flight Results**: Cache searches for 5-10 minutes
2. **Debounce Autocomplete**: Limit location searches
3. **Reduce `max` Results**: Lower from 50 to 25 if acceptable

**Example Caching (Simple)**:
```typescript
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

searchFlights: async (params: any) => {
    const cacheKey = JSON.stringify(params);
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }
    
    const response = await amadeus.shopping.flightOffersSearch.get({...});
    cache.set(cacheKey, { data: response, timestamp: Date.now() });
    return response;
}
```

---

## ✅ Final Checklist

Before going live with Production API:

- [ ] Production credentials obtained from Amadeus portal
- [ ] `.env` file updated with `AMADEUS_HOSTNAME=production`
- [ ] `amadeus.ts` updated with hostname configuration
- [ ] Enhanced error handling implemented
- [ ] Rate limiting adjusted for production tier
- [ ] Local testing completed successfully
- [ ] `.gitignore` updated to exclude `.env`
- [ ] Production environment variables set in hosting platform
- [ ] Monitoring/alerts configured
- [ ] Cost estimation reviewed and approved
- [ ] Rollback plan documented

---

## 🆘 Troubleshooting

### Issue: "401 Unauthorized" in Production
**Cause**: Invalid credentials or wrong environment  
**Fix**: Verify `AMADEUS_API_KEY` and `AMADEUS_API_SECRET` in portal

### Issue: "403 Forbidden" for certain endpoints
**Cause**: Endpoint not included in production app  
**Fix**: Add missing APIs in Amadeus developer portal → "My Apps" → Edit

### Issue: Higher latency than test
**Cause**: Production processes real-time data  
**Fix**: Implement caching, consider loading states in UI

### Issue: Unexpected costs
**Cause**: High request volume  
**Fix**: Implement aggressive caching, review rate limiting

---

## 📊 Expected Impact

| Metric | Test API | Production API |
|--------|----------|----------------|
| **Data Quality** | Mock/Limited | Real-time, accurate |
| **Availability** | Inconsistent | 99.9% uptime |
| **Price Accuracy** | Generic | Actual carrier prices |
| **Airlines** | Limited set | All major carriers |
| **Response Time** | <500ms | 500ms - 2s |
| **Cost** | Free | Pay-per-use |

---

## 🎯 Summary

This migration transforms SkySpeed Neo from a development prototype to a **production-grade flight search engine**. The key is **gradual rollout** with robust monitoring to catch issues early. Follow the phases sequentially, and you'll have a smooth transition to real-time flight data.
