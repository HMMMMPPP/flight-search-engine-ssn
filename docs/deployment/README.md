# Deployment

This section contains guides and checklists for deploying SkySpeed Neo to production.

## 📁 Documentation

### [Readiness Checklist](./readiness-checklist.md)
Complete pre-deployment verification checklist.
- Build verification
- Security audit
- Performance checks
- Environment variable preparation

### [Netlify Deployment](./netlify.md)
Step-by-step guide for deploying to Netlify.
- Netlify configuration
- CI/CD setup
- Environment variables
- Custom domain configuration

### [Production API Migration](./production-api-migration.md)
Migrating from Amadeus Test API to Production API.
- Obtaining production credentials
- Code modifications required
- Testing and validation
- Cost estimation and monitoring

## 🚀 Deployment Platforms

### Netlify (Recommended)
- ✅ Free tier available
- ✅ Automatic deployments
- ✅ Serverless functions included
- ✅ Global CDN
- ✅ Easy environment variable management

### Vercel (Alternative)
- ✅ Built specifically for Next.js
- ✅ Excellent performance
- ✅ Generous free tier
- ✅ Edge functions support

## 📋 Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] `npm run build` completes successfully
- [ ] All environment variables documented
- [ ] `.gitignore` excludes sensitive files
- [ ] Production API keys obtained (if using Amadeus Production)
- [ ] `netlify.toml` or `vercel.json` configured
- [ ] SEO metadata complete (title, description, OG tags)
- [ ] `robots.txt` and `sitemap.xml` present
- [ ] Security headers configured
- [ ] Error tracking setup (Sentry)
- [ ] Monitoring configured (UptimeRobot)

## 🔐 Deployment Security

### Environment Variables
Never commit these to Git:
- `AMADEUS_API_KEY`
- `AMADEUS_API_SECRET`
- `GEMINI_API_KEY`
- `GROQ_API_KEY`

Set them in your deployment platform's dashboard.

### Security Headers
Configure in `netlify.toml`:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

## 📊 Post-Deployment

After deployment, verify:
1. Landing page loads correctly
2. Search functionality works
3. API routes respond properly
4. No console errors
5. Mobile responsiveness
6. Performance metrics (Lighthouse)

## 🔗 Related Documentation

- [Readiness Checklist](./readiness-checklist.md)
- [Netlify Guide](./netlify.md)
- [Production API Migration](./production-api-migration.md)
- [Monitoring Setup](../monitoring/)
