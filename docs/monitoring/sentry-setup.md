# Sentry Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create Sentry Account
1. Go to [sentry.io](https://sentry.io/signup/)
2. Sign up for free account (5,000 errors/month)
3. Create new project:
   - Platform: **Next.js**
   - Project name: **skyspeed-neo**
   - Alert frequency: **On every new issue**

### Step 2: Get Your DSN
1. After project creation, Sentry shows you the DSN
2. Copy the DSN (looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`)
3. Copy the Auth Token from Settings → Developer Settings → Auth Tokens

### Step 3: Add Environment Variables

**Local development** (`.env.local`):
```env
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn-here@o123.ingest.sentry.io/456
SENTRY_AUTH_TOKEN=your_auth_token_here
```

**Netlify deployment** (Dashboard → Environment Variables):
- `NEXT_PUBLIC_SENTRY_DSN`: Your Sentry DSN
- `SENTRY_AUTH_TOKEN`: Your auth token
- `NODE_ENV`: `production`

### Step 4: Update next.config.ts
Open `next.config.ts` and replace placeholders:
```typescript
org: "your-org-slug",      // Find in Sentry Settings → Organization
project: "skyspeed-neo",   // Your project name
```

### Step 5: Test Locally
```bash
# Build to verify Sentry integration
npm run build

# Start production server
npm run start

# Visit localhost:3000 and check console for "[Sentry]" messages
```

### Step 6: Test Error Tracking
Create a test error in `src/app/page.tsx`:
```typescript
export default function Home() {
  // Test error (remove after testing)
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      throw new Error('Sentry Test Error - DELETE ME');
    }, 2000);
  }
  
  return <div>...</div>
}
```

Visit your site, wait 2 seconds, check Sentry dashboard for the error.

---

## ✅ What's Already Configured

- ✅ Client-side error tracking (`sentry.client.config.ts`)
- ✅ Server-side error tracking (`sentry.server.config.ts`)
- ✅ Edge runtime support (`sentry.edge.config.ts`)
- ✅ Noise filtering (ResizeObserver, chrome-extension errors filtered)
- ✅ Session Replay (10% of sessions, 100% on errors)
- ✅ Production-only tracking (saves quota in dev)
- ✅ Next.js config with source maps

---

## 🎯 What You'll Get

### Error Dashboard
- Real-time error notifications
- Stack traces with source maps
- Affected users count
- Error frequency trends

### Session Replay
- Watch user sessions that encountered errors
- See exactly what the user clicked
- Replay network requests

### Performance Monitoring
- API route response times
- Page load metrics
- Database query times (if applicable)

---

## 📊 Free Tier Limits

- **5,000 errors/month**
- **10,000 performance units/month**
- **50 Session Replays/month**
- **30-day retention**

**Tip**: More than enough for MVP! Monitor usage in Sentry dashboard.

---

## 🚨 Common Issues

### Issue: "Sentry DSN not found"
**Fix**: Ensure `NEXT_PUBLIC_SENTRY_DSN` is in `.env.local` and restart dev server

### Issue: Source maps not uploading
**Fix**: Verify `SENTRY_AUTH_TOKEN` is set and has correct permissions

### Issue: Too many errors
**Fix**: Review `beforeSend` filters in config files to add more noise filtering

---

## 🔍 Using Sentry

### View Errors
1. Open Sentry dashboard
2. Click **Issues**
3. Click on any error to see:
   - Stack trace
   - User breadcrumbs (actions before error)
   - Device/browser info
   - Session replay (if available)

### Set Up Alerts
1. Go to **Alerts** → **Create Alert**
2. Set conditions (e.g., "More than 10 errors in 1 hour")
3. Choose notification method (email, Slack, etc.)

### Monitor Performance
1. Click **Performance**
2. View slowest transactions
3. Click any transaction to see breakdown

---

## ✅ Verification Checklist

After setup:
- [ ] Sentry account created
- [ ] Project created in Sentry
- [ ] DSN added to `.env.local`
- [ ] Auth token added to `.env.local`
- [ ] `org` and `project` updated in `next.config.ts`
- [ ] Build succeeds (`npm run build`)
- [ ] Test error appears in Sentry dashboard
- [ ] Environment variables added to Netlify

**You're ready for production error tracking!** 🎉
