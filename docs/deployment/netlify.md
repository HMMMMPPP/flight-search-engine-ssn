# Netlify Deployment Guide

This guide provides step-by-step instructions for deploying SkySpeed Neo to Netlify.

## Prerequisites

Before deploying, ensure:
- [ ] `npm run build` completes successfully
- [ ] All environment variables documented
- [ ] `netlify.toml` configuration file exists
- [ ] `.gitignore` excludes sensitive files
- [ ] Code is pushed to Git repository (GitHub, GitLab, or Bitbucket)
- [ ] Production API keys ready (if using Amadeus Production)

## Required Environment Variables

You'll need to set these in the Netlify dashboard after connecting your repository:

```env
# AI Keys
GROQ_API_KEY=your_groq_production_key
GEMINI_API_KEY=your_gemini_production_key

# Amadeus (Test or Production)
AMADEUS_API_KEY=your_amadeus_key
AMADEUS_API_SECRET=your_amadeus_secret
AMADEUS_HOSTNAME=test  # or 'production' after migration

# Node Environment
NODE_ENV=production
```

## Step-by-Step Deployment

### Step 1: Push to Git Repository

Ensure all changes are committed and pushed:

```bash
# Stage all changes
git add .

# Commit with deployment message
git commit -m "feat: production deployment setup"

# Push to remote repository
git push origin main
```

### Step 2: Connect to Netlify

1. Go to [Netlify](https://app.netlify.com)
2. Sign in or create a free account
3. Click **"Add new site"** → **"Import existing project"**
4. Connect your Git provider:
   - GitHub
   - GitLab
   - Bitbucket
5. Authorize Netlify to access your repositories
6. Select the `flight-search-engine` repository

### Step 3: Configure Build Settings

Netlify should auto-detect settings from `netlify.toml`, but verify:

**Build Command**:
```
npm run build
```

**Publish Directory**:
```
.next
```

**Node Version** (set in netlify.toml):
```
20.x
```

If these aren't auto-detected, select **"Advanced build settings"** and set them manually.

### Step 4: Add Environment Variables

During setup or after deployment:

1. Click **"Show advanced"** (during setup) or go to **Site settings** → **Environment variables**
2. Add each environment variable:
   - Click **"Add a variable"**
   - Enter key (e.g., `AMADEUS_API_KEY`)
   - Enter value (your actual API key)
   - Click **"Add"**
3. Repeat for all required variables listed above

**Important**: Never commit API keys to your repository. Always use environment variables.

### Step 5: Deploy

1. Click **"Deploy site"**
2. Netlify will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Run build command (`npm run build`)
   - Deploy to CDN
3. Wait 2-5 minutes for deployment to complete

### Step 6: Monitor Build

Watch the build logs:
- Click on the deploying site
- View **"Deploying"** section
- Expand **"Build logs"** to see progress

**Common Issues**:
- **Build fails**: Check logs for TypeScript errors or missing dependencies
- **Timeout**: Increase build timeout in Site settings
- **Out of memory**: Use larger build image (Pro plan)

### Step 7: Verify Deployment

Once deployed, Netlify provides a URL like:
```
https://random-name-12345.netlify.app
```

Test the deployed site:
- [ ] Landing page loads correctly
- [ ] Search functionality works
- [ ] API routes respond (`/api/locations`, `/api/search`)
- [ ] Flight results display
- [ ] Filters apply correctly
- [ ] Price graph renders
- [ ] AI features function
- [ ] No console errors in browser DevTools

## Custom Domain Setup (Optional)

### Purchase Domain (if needed)
Options:
- Netlify Domains
- GoDaddy
- Namecheap
- Google Domains

### Add Custom Domain to Netlify

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `skyspeedneo.com`)
4. Click **"Verify"**

### Configure DNS

If domain is registered elsewhere:

**Option A: Use Netlify DNS** (Recommended)
1. In Netlify, go to **Domain settings**
2. Click **"Set up Netlify DNS"**
3. Copy the name servers (e.g., `dns1.p03.nsone.net`)
4. Update name servers in your domain registrar
5. Wait 24-48 hours for DNS propagation

**Option B: Use External DNS**
1. In your DNS provider, add an **A record**:
   - Type: `A`
   - Name: `@`
   - Value: (Netlify load balancer IP, found in Domain settings)
2. Add a **CNAME record** for `www`:
   - Type: `CNAME`
   - Name: `www`
   - Value: `random-name-12345.netlify.app`
3. Wait 15 minutes to 24 hours for DNS propagation

### SSL Certificate

Netlify provides free SSL certificates via Let's Encrypt:
1. After DNS is configured, go to **Domain settings**
2. Scroll to **HTTPS**
3. Click **"Verify DNS configuration"**
4. Click **provision certificate**
5. Wait a few minutes for SSL activation
6. Enable **"Force HTTPS"** to redirect HTTP to HTTPS

## Continuous Deployment

### Automatic Deployments

By default, Netlify deploys automatically when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "fix: update search logic"
git push origin main

# Netlify automatically detects push and deploys
```

### Deploy Previews

Netlify creates preview deployments for pull requests:
1. Create a feature branch: `git checkout -b feature/new-feature`
2. Push branch: `git push origin feature/new-feature`
3. Create pull request on GitHub
4. Netlify builds a preview deployment
5. Preview URL appears in PR comments

### Deploy Contexts

Configure different settings for different branches in `netlify.toml`:

```toml
[context.production]
  environment = { NODE_ENV = "production" }

[context.deploy-preview]
  environment = { NODE_ENV = "staging" }

[context.branch-deploy]
  environment = { NODE_ENV = "development" }
```

## Netlify Functions (API Routes)

Next.js API routes are automatically converted to Netlify Functions.

**Verify Functions**:
1. Go to **Site settings** → **Functions**
2. Check that API routes are listed (e.g., `api-search`, `api-locations`)
3. View function logs for debugging

**Function Limits (Free Tier)**:
- 125,000 function invocations/month
- 100 hours runtime/month
- 10-second execution limit

## Performance Optimization

### Enable Caching

Already configured in `netlify.toml`:
```toml
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Asset Optimization

Netlify automatically optimizes:
- Image compression
- CSS/JS minification
- Brotli compression

### Speed Insights

Monitor performance:
1. Go to **Site overview**
2. Click **"Analytics"** (Pro plan) or use Google Lighthouse
3. Check Core Web Vitals

## Monitoring and Alerts

### Deploy Notifications

Configure notifications in **Site settings** → **Build & deploy** → **Notifications**:
- **Email**: Deploy success/failure
- **Slack**: Webhook integration
- **Discord**: Webhook integration

### Uptime Monitoring

Use external services:
- **UptimeRobot** (free): See [Uptime Monitoring Guide](../monitoring/uptime-monitoring.md)
- **Sentry**: See [Sentry Setup](../monitoring/sentry-setup.md)

### Build Notifications

Get notified about:
- Build started
- Build succeeded
- Build failed
- Deploy succeeded

## Rollback

If a deployment has issues:

1. Go to **Deploys**
2. Find a previous successful deploy
3. Click **⋯** (three dots)
4. Click **"Publish deploy"**
5. Confirm rollback

## Troubleshooting

### Build Fails

**TypeScript Errors**:
```bash
# Run locally to debug
npm run build
npx tsc --noEmit
```

**Missing Dependencies**:
```bash
# Verify package.json includes all dependencies
npm install
```

**Environment Variables Missing**:
- Check Site settings → Environment variables
- Ensure all required keys are set

### Site Loads but API Fails

**Check Function Logs**:
1. Go to **Functions** → Select function
2. View **Logs** tab
3. Look for errors

**Verify Environment Variables**:
- Ensure API keys are correct
- Check `AMADEUS_HOSTNAME` is set to `test` or `production`

### Slow Performance

**Run Lighthouse Audit**:
```
DevTools → Lighthouse → Generate report
```

**Enable Next.js Image Optimization**:
- Use `next/image` component
- Configure image domains in `next.config.js`

### 404 Errors

**Check Redirects**:
Ensure `netlify.toml` has:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Cost Estimation

### Free Tier Limits
- 100 GB bandwidth/month
- 125,000 function invocations/month
- 300 build minutes/month
- 1 concurrent build
- Unlimited sites

### When to Upgrade
Consider Pro plan ($19/month) if you exceed:
- Bandwidth limit
- Function invocations
- Need faster builds (5 concurrent builds)
- Need analytics dashboard

## Related Documentation

- [Readiness Checklist](./readiness-checklist.md)
- [Production API Migration](./production-api-migration.md)
- [Monitoring Setup](../monitoring/)
- [Deployment Overview](./README.md)
