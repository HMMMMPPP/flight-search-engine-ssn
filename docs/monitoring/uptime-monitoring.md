# UptimeRobot Setup Guide

## 🚨 Free Uptime Monitoring (5 minutes setup)

UptimeRobot monitors your website 24/7 and alerts you if it goes down.

**Free Tier**: 50 monitors, 5-minute checks, unlimited alerts

---

## 📝 Setup Steps

### Step 1: Create Free Account

1. Go to [UptimeRobot.com](https://uptimerobot.com/)
2. Click **Sign Up for Free**
3. Enter email and create password
4. Verify email address

---

### Step 2: Add Your First Monitor

1. After login, dashboard opens automatically
2. Click **+ Add New Monitor**

**Monitor Configuration:**

| Field | Value |
|-------|-------|
| **Monitor Type** | HTTP(s) |
| **Friendly Name** | SkySpeed Neo Production |
| **URL** | `https://your-domain.netlify.app` (update after deployment) |
| **Monitoring Interval** | 5 minutes (free tier) |

3. Click **Create Monitor**

---

### Step 3: Configure Alert Contacts

**Email Alerts:**
1. Go to **My Settings** → **Alert Contacts**
2. Default email is already added ✅
3. Click **Get Verification Link** if needed

**Optional - SMS Alerts:**
1. Add new alert contact
2. Select **SMS**
3. Enter phone number
4. Verify code

**Optional - Slack/Discord Alerts:**
1. Add new alert contact
2. Select **Webhook**
3. Paste your Slack/Discord webhook URL

---

### Step 4: Test Alert

1. Go to **Monitors**
2. Find your monitor
3. Click **⋮** (three dots) → **Edit**
4. Temporarily change URL to `https://this-site-does-not-exist-test-12345.com`
5. Wait 5-10 minutes
6. Check email for "Monitor is DOWN" alert ✅
7. Change URL back to your real domain
8. Receive "Monitor is UP" alert ✅

---

## ✅ What You'll Get

### Instant Alerts When:
- ✅ Site is completely down (server error)
- ✅ Site returns 500 errors
- ✅ Site is slow (response time > threshold)
- ✅ SSL certificate expires

### Dashboard Shows:
- ✅ Uptime percentage (99.9% target)
- ✅ Response time trends
- ✅ Downtime history
- ✅ Incident timeline

---

## 🎯 Best Practices

### Monitor Multiple Pages
Don't just monitor homepage - add these too:

1. **API Health Check** (if you create one):
   - URL: `https://your-domain.netlify.app/api/health`
   - Type: HTTP(s)

2. **Search Page**:
   - URL: `https://your-domain.netlify.app/search`
   - Type: HTTP(s)

### Set Up Status Page (Optional)
1. Go to **Public Status Pages**
2. Click **Create Status Page**
3. Select monitors to display
4. Get shareable link: `https://stats.uptimerobot.com/xxxxx`
5. Share with users/investors

---

## 📊 Understanding the Dashboard

### Uptime Percentage
- **99.9%** = ~43 minutes downtime/month (GOOD)
- **99.5%** = ~3.5 hours downtime/month (OK)
- **99.0%** = ~7 hours downtime/month (NEEDS IMPROVEMENT)

### Response Time
- **< 1s** = Excellent
- **1-3s** = Good
- **> 3s** = Investigate caching/optimization

### Alert Types
- **Down**: Site completely unreachable
- **Seems down**: Site responded but with error (500, 404, etc.)
- **Timeout**: Site didn't respond within 30 seconds

---

## 🔧 Advanced Configuration (Optional)

### Keyword Monitoring
Monitor for specific text on page:
1. Edit monitor
2. Enable **Keyword Exists**
3. Add keyword: `SkySpeed Neo`
4. Alert if keyword NOT found = site broken

### Custom HTTP Headers
For testing authenticated endpoints:
1. Edit monitor
2. Add HTTP header: `Authorization: Bearer xxx`

### Maintenance Windows
Prevent false alerts during deployments:
1. **Monitors** → Select monitor
2. **Maintenance Windows** → **Add**
3. Set time range
4. Alerts paused during window

---

## 🆘 Troubleshooting

### Issue: Getting too many alerts

**Fix 1**: Increase alert threshold
- Edit monitor → Advanced Settings
- Set "Send alert when monitor is down for X minutes" to 10 minutes

**Fix 2**: Check if your site has intermittent issues
- Review Netlify deployment logs
- Check for API quota limits (Amadeus)

### Issue: Not receiving alerts

**Fix**: Check spam folder, verify email in UptimeRobot settings

### Issue: False "down" alerts

**Causes**:
- Netlify cold starts (first request after inactivity)
- Temporary network issues
- Rate limiting

**Fix**: Increase check interval to 10 minutes (paid tier) or accept occasional false positives

---

## 📱 Mobile App

**Download UptimeRobot app:**
- iOS: App Store → "UptimeRobot"
- Android: Play Store → "UptimeRobot"

**Features:**
- Real-time notifications
- View all monitors
- Quick status check
- Pause monitoring temporarily

---

## 💰 Cost Comparison

| Feature | Free | Pro ($7/mo) |
|---------|------|-------------|
| **Monitors** | 50 | Unlimited |
| **Check Interval** | 5 min | 1 min |
| **Alert Channels** | Unlimited | Unlimited |
| **Status Pages** | 1 public | Unlimited |
| **SMS Credits** | $0 | 500/month |

**Recommendation**: Free tier is perfect for MVP! Upgrade only if:
- You need 1-minute checks
- You want SMS alerts
- You need multiple status pages

---

## ✅ Post-Setup Checklist

After deployment:
- [ ] UptimeRobot account created
- [ ] Monitor added with production URL
- [ ] Email alert verified
- [ ] Test alert received (temporary wrong URL)
- [ ] Monitor set back to real URL
- [ ] Response time baseline established (<2s)
- [ ] Optional: Mobile app installed
- [ ] Optional: Slack/Discord webhook added
- [ ] Optional: Status page created

---

## 🎯 Success Criteria

**Week 1:**
- ✅ Zero downtime
- ✅ Average response time < 2s
- ✅ Email alerts working

**Month 1:**
- ✅ 99.9%+ uptime
- ✅ No critical incidents
- ✅ Response time stable

---

## 📚 Resources

- [UptimeRobot Documentation](https://uptimerobot.com/help/)
- [API Documentation](https://uptimerobot.com/api/) (for automation)
- [Status Page Examples](https://stats.uptimerobot.com/)

---

**You're all set!** 🎉 Once deployed, come back and add your Netlify URL to UptimeRobot.
