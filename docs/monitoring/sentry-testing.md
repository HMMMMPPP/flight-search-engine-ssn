# Sentry Verification Test

## 🧪 Testing Sentry Integration

### Option 1: Production Build Test (RECOMMENDED)

Sentry only sends errors in **production mode** (to save your free quota).

**Steps:**

1. **Build the project:**
```bash
npm run build
```

2. **Start in production mode:**
```bash
npm run start
```

3. **Visit the test page:**
```
http://localhost:3000/sentry-test
```

4. **Wait 2 seconds** - A test error will be thrown automatically

5. **Check Sentry Dashboard:**
   - Open: https://sentry.io
   - Go to **Issues**
   - Look for: `🧪 Sentry Test Error - This is working!`
   - Should appear within 30-60 seconds

---

### Option 2: Manual Test Error

If you want to test in your existing code:

**Add this to any component** (e.g., `src/app/page.tsx`):

```typescript
'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Remove after testing
    if (process.env.NODE_ENV === 'production') {
      setTimeout(() => {
        throw new Error('Test Sentry Error');
      }, 2000);
    }
  }, []);
  
  return <div>Your content...</div>
}
```

**Then:**
1. Build: `npm run build`
2. Start: `npm run start`
3. Visit: `http://localhost:3000`
4. Check Sentry dashboard

---

### Option 3: Quick Dev Test (Forces Error)

For immediate testing in dev mode, temporarily modify `sentry.client.config.ts`:

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  
  // TEMPORARILY set to true for testing
  enabled: true, // Changed from: process.env.NODE_ENV === 'production'
  
  // ... rest of config
});
```

**Then:**
1. Restart dev server: `npm run dev`
2. Visit: `http://localhost:3000/sentry-test`
3. Check Sentry dashboard

**⚠️ IMPORTANT:** Change `enabled` back to `process.env.NODE_ENV === 'production'` after testing!

---

## ✅ What to Look For in Sentry

### In the Issues Tab:
- **Error Title**: `🧪 Sentry Test Error - This is working!`
- **Count**: 1 event
- **Environment**: `production` (or `development` if you forced it)

### Click on the Error to See:
- **Stack Trace**: Shows exact line in `sentry-test/page.tsx`
- **Breadcrumbs**: User actions before error
- **Device Info**: Browser, OS, screen resolution
- **Tags**: Environment, release version

### Session Replay (if enabled):
- Click **Replays** tab
- Watch the user session leading to the error

---

## 🐛 Troubleshooting

### Issue: No error appears in Sentry

**Check:**
1. DSN is correct in `.env.local`: 
   ```
   NEXT_PUBLIC_SENTRY_DSN=https://7f0b3804ccbac77758c049b4411764e6@o4510733660258304.ingest.us.sentry.io/4510733665370112
   ```

2. Running in production mode (`npm run build && npm run start`)

3. Browser console shows the error

4. Check Sentry project settings - is the DSN active?

### Issue: "Failed to fetch" in console

**Fix:** This is normal! Sentry requests may be blocked by:
- Ad blockers
- Browser privacy settings
- CORS policies

**Solution:** The tunnel route `/monitoring` in `next.config.ts` helps bypass this.

### Issue: Build fails with Sentry errors

**Fix:** 
1. Verify `NEXT_PUBLIC_SENTRY_DSN` is in `.env.local`
2. Check `next.config.ts` syntax

---

## 🗑️ After Testing

1. **Delete the test page:**
   ```bash
   rm src/app/sentry-test/page.tsx
   ```

2. **Mark test error as resolved** in Sentry dashboard

3. **Revert any temporary changes** (like `enabled: true` in dev)

---

## 📊 Expected Result

✅ You should see the error in Sentry within 60 seconds  
✅ Stack trace points to `sentry-test/page.tsx`  
✅ Environment shows `production`  
✅ You can resolve the issue in Sentry  

**Once you see the error in Sentry, the integration is working! 🎉**
