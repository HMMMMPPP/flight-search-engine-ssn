# Production Observability Guide

> **Purpose**: Monitor, debug, and optimize SkySpeed Neo in production  
> **Last Updated**: 2026-01-19

---

## 🎯 Observability Goals

1. **Detect issues before users report them**
2. **Track API usage and costs** (Amadeus, Gemini, Groq)
3. **Monitor performance and UX metrics**
4. **Debug production errors efficiently**
5. **Understand user behavior and conversion**

---

## 📊 Observability Stack

### Tier 1: Built-in Netlify Features (Free)

#### **1. Netlify Functions Logs**
**What**: Real-time logs for serverless API routes  
**Access**: Netlify Dashboard → Functions → Logs

**Key Metrics to Monitor**:
- Function execution time (should be < 10s for Netlify free tier)
- Error rates per endpoint
- Cold start frequency

**Action**: Review logs daily for first week post-deployment

---

#### **2. Netlify Analytics** (Paid, $9/mo)
**What**: Server-side analytics (no cookies, GDPR-compliant)  
**Metrics**:
- Page views
- Unique visitors
- Top pages
- Bandwidth usage

**Recommended**: Optional for MVP, consider after initial launch

---

### Tier 2: Error Tracking (RECOMMENDED)

#### **Sentry Integration** (Free tier: 5k errors/month)

**Why**: Catch and debug JavaScript errors, API failures, and React crashes

**Setup Steps**:

1. **Install Sentry**:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

2. **Configure** (`sentry.client.config.ts`):
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
  beforeSend(event) {
    // Filter out noisy errors
    if (event.exception?.values?.[0]?.value?.includes('ResizeObserver')) {
      return null;
    }
    return event;
  },
});
```

3. **Add to API Routes** (`src/app/api/*/route.ts`):
```typescript
import * as Sentry from '@sentry/nextjs';

export async function GET(request: Request) {
  try {
    // Your API logic
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        endpoint: 'search',
        amadeus_hostname: process.env.AMADEUS_HOSTNAME
      }
    });
    throw error;
  }
}
```

**Environment Variables** (add to Netlify):
```env
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
SENTRY_AUTH_TOKEN=your_auth_token
```

---

### Tier 3: Performance Monitoring

#### **Vercel Speed Insights** (Free for Netlify too!)
**What**: Real User Monitoring (RUM) for Core Web Vitals

**Setup**:
```bash
npm install @vercel/speed-insights
```

**Add to `layout.tsx`**:
```typescript
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

**Metrics Tracked**:
- Largest Contentful Paint (LCP) - Target: < 2.5s
- First Input Delay (FID) - Target: < 100ms
- Cumulative Layout Shift (CLS) - Target: < 0.1

---

### Tier 4: API Usage Monitoring (CRITICAL)

#### **Amadeus API Quota Tracking**

**Problem**: Amadeus charges per request - you need to track usage!

**Solution**: Custom logging + Netlify Functions

**Implementation**:

1. **Create Logger Utility** (`src/lib/utils/apiLogger.ts`):
```typescript
export const logAPICall = async (
  provider: 'amadeus' | 'gemini' | 'groq',
  endpoint: string,
  status: 'success' | 'error',
  responseTime: number
) => {
  const logData = {
    provider,
    endpoint,
    status,
    responseTime,
    timestamp: new Date().toISOString(),
    environment: process.env.AMADEUS_HOSTNAME || 'test'
  };

  // Log to console for Netlify Functions logs
  console.log('[API_CALL]', JSON.stringify(logData));

  // Optional: Send to analytics service
  if (process.env.ANALYTICS_WEBHOOK) {
    fetch(process.env.ANALYTICS_WEBHOOK, {
      method: 'POST',
      body: JSON.stringify(logData)
    }).catch(() => {}); // Fire and forget
  }
};
```

2. **Wrap API Calls** (`src/lib/services/amadeus.ts`):
```typescript
searchFlights: async (params: any) => {
    const startTime = Date.now();
    try {
        const response = await amadeusRateLimiter.throttle<any>(() => 
            amadeus.shopping.flightOffersSearch.get({...})
        );
        
        await logAPICall('amadeus', 'searchFlights', 'success', Date.now() - startTime);
        return response;
    } catch (error) {
        await logAPICall('amadeus', 'searchFlights', 'error', Date.now() - startTime);
        throw error;
    }
}
```

3. **Monitor Daily**:
- Search Netlify logs for `[API_CALL]`
- Parse JSON to count requests per provider
- Calculate estimated costs

---

### Tier 5: Uptime Monitoring

#### **UptimeRobot** (Free: 50 monitors)

**Setup**:
1. Go to [UptimeRobot.com](https://uptimerobot.com)
2. Create account
3. Add monitor:
   - Type: HTTP(s)
   - URL: `https://your-domain.netlify.app`
   - Interval: 5 minutes
4. Set up email/SMS alerts

**Alternative**: [BetterUptime](https://betteruptime.com) (Free tier available)

---

## 🚨 Alerting Strategy

### Critical Alerts (Immediate Action Required)

**1. Site Down**
- **Trigger**: UptimeRobot detects >5 min downtime
- **Channel**: Email + SMS
- **Action**: Check Netlify status, review logs

**2. API Quota Exceeded**
- **Trigger**: Amadeus returns 429 (rate limit)
- **Channel**: Email
- **Action**: Implement caching, review rate limiter

**3. High Error Rate**
- **Trigger**: Sentry reports >10 errors in 1 hour
- **Channel**: Sentry notifications
- **Action**: Check error details, deploy hotfix

### Warning Alerts (Review Within 24h)

**4. Slow API Response**
- **Trigger**: >5s average response time
- **Monitor**: Netlify function logs
- **Action**: Optimize queries, consider caching

**5. Amadeus Cost Spike**
- **Trigger**: >2x normal daily API calls
- **Monitor**: Manual log review (or custom dashboard)
- **Action**: Check for bot traffic, implement caching

---

## 📈 Custom Metrics Dashboard (Optional)

### **Simple Google Sheets Dashboard**

**Data Collection**:
1. Daily: Export Netlify function logs
2. Parse for `[API_CALL]` entries
3. Aggregate:
   - Total Amadeus calls
   - Total Gemini calls
   - Total Groq calls
   - Average response times
   - Error counts

**Metrics to Track**:
| Date | Amadeus Calls | Est. Cost | Errors | Avg Response Time |
|------|---------------|-----------|--------|-------------------|
| 2026-01-20 | 1,234 | $12.34 | 5 | 1.2s |

---

## 🔍 Debugging Production Issues

### **Step-by-Step Debug Process**

#### Issue: "User reports search not working"

1. **Check Netlify Functions Logs**:
   - Go to Netlify → Functions → `search`
   - Filter by timestamp of user report
   - Look for error stack traces

2. **Check Sentry**:
   - Search for user's session
   - Review breadcrumbs (user actions before error)
   - Check error details

3. **Reproduce Locally**:
   - Copy search parameters from logs
   - Test in local environment
   - Check if it's data-specific or code bug

4. **Fix & Deploy**:
   - Create hotfix
   - Deploy immediately (Netlify auto-deploys on push)
   - Monitor for recurrence

---

## ✅ Observability Checklist

### Pre-Launch
- [ ] Sentry installed and configured
- [ ] API logging implemented in all services
- [ ] Uptime monitoring set up (UptimeRobot)
- [ ] Alert emails configured

### Post-Launch (First Week)
- [ ] Review Netlify logs daily
- [ ] Check Sentry for new error patterns
- [ ] Monitor API usage and estimate costs
- [ ] Verify uptime monitoring alerts work

### Ongoing (Weekly)
- [ ] Review error trends in Sentry
- [ ] Analyze API usage patterns
- [ ] Check performance metrics (Speed Insights)
- [ ] Update alert thresholds as needed

---

## 💰 Cost Breakdown

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| **Netlify Functions Logs** | Free | $0 |
| **Sentry** | Hobby (5k errors) | $0 |
| **Vercel Speed Insights** | Free | $0 |
| **UptimeRobot** | Free (50 monitors) | $0 |
| **Netlify Analytics** | Optional | $9 |
| **Total (without analytics)** | - | **$0** |

---

## 🎯 Success Metrics

### Week 1 Targets
- ✅ Zero downtime
- ✅ <5 critical errors
- ✅ <2s average page load time
- ✅ API costs within budget

### Month 1 Targets
- ✅ >99.9% uptime
- ✅ Error rate <0.1%
- ✅ All Core Web Vitals in "Good" range
- ✅ Predictable API costs

---

## 🚀 Quick Start (Minimal Setup)

If you're deploying ASAP and want minimal observability:

1. **Set up alerts in Netlify** (5 min)
   - Enable email notifications for failed deploys

2. **Add console.log for API calls** (10 min)
   - Just add: `console.log('[API_CALL]', {provider, endpoint, status})`

3. **Set up UptimeRobot** (5 min)
   - Create free account, add your domain

**Total Time**: 20 minutes for basic observability!

---

## 📚 Further Reading

- [Netlify Functions Monitoring](https://docs.netlify.com/functions/logs/)
- [Sentry Next.js Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Core Web Vitals](https://web.dev/vitals/)

---

**Remember**: Start simple, iterate based on actual issues! Don't over-engineer observability before you have traffic.
