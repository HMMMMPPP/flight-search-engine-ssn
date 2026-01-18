# Monitoring & Observability

This section covers error tracking, uptime monitoring, and observability strategies for SkySpeed Neo.

## 📁 Documentation

### [Observability Overview](./overview.md)
Complete guide to implementing free observability features.
- API usage logging
- Error tracking strategy
- Performance monitoring
- Analytics integration

### [Sentry Setup](./sentry-setup.md)
Configure Sentry for error tracking and performance monitoring.
- Account creation and project setup
- SDK installation and configuration
- Error boundary implementation
- Source map upload

### [Sentry Testing](./sentry-testing.md)
Validate Sentry integration is working correctly.
- Manual error triggering
- Testing error boundaries
- Verifying error reporting
- Performance transaction testing

### [Uptime Monitoring](./uptime-monitoring.md)
Set up UptimeRobot for application availability monitoring.
- Free tier setup (50 monitors)
- Monitor configuration
- Alert notification setup
- Status page creation

## 🎯 Monitoring Strategy

### Error Tracking (Sentry)
**What to Monitor**:
- JavaScript runtime errors
- API failures and timeouts
- React component errors
- Performance bottlenecks

**Alert Thresholds**:
- Error rate > 1% of sessions
- Response time > 2 seconds
- API failure rate > 5%

### Uptime Monitoring (UptimeRobot)
**Monitored Endpoints**:
- Landing page (`/`)
- Search page (`/search`)
- API health endpoints (`/api/health`)

**Check Intervals**:
- Production: Every 5 minutes
- Staging: Every 15 minutes

### Performance Monitoring
**Key Metrics**:
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1
- Time to First Byte (TTFB) < 600ms

## 🆓 Free Tier Limits

### Sentry
- **Events**: 5,000/month
- **Team Members**: 5
- **Projects**: Unlimited
- **Data Retention**: 30 days

### UptimeRobot
- **Monitors**: 50
- **Check Interval**: 5 minutes
- **Notification Channels**: Unlimited
- **Data Retention**: 6 months (logs), 2 years (monitoring data)

## 🚨 Alert Configuration

### Critical Alerts (Immediate Action)
- Application down (uptime < 99%)
- API completely unavailable
- Error rate spike (>10% of users affected)

### Warning Alerts (Review Within 24h)
- Performance degradation (>2x normal response time)
- Elevated error rate (1-10% of users)
- API quota approaching limit (>80%)

### Info Alerts (Weekly Review)
- Unusual traffic patterns
- New error types discovered
- Performance trends

## 📊 Dashboards

### Sentry Dashboard
- Error frequency and trends
- Affected user count
- Stack traces and context
- Performance metrics

### UptimeRobot Dashboard
- Uptime percentage
- Response time history
- Incident timeline
- Public status page

## 🔗 Integration

### Slack/Discord Notifications
Configure webhook alerts for:
- Downtime incidents
- Error spikes
- Performance degradation

### Email Alerts
Set up email notifications for:
- Daily summary reports
- Weekly performance digests
- Critical incidents

## 🔗 Related Documentation

- [Observability Overview](./overview.md)
- [Sentry Setup](./sentry-setup.md)
- [Sentry Testing](./sentry-testing.md)
- [Uptime Monitoring](./uptime-monitoring.md)
- [Deployment Guides](../deployment/)
