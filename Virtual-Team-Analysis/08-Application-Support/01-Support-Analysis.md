# Support Infrastructure Analysis
## Safahati — Current State and Required Support System
**Date:** 2026-04-25

---

## Executive Summary

Safahati currently has **no support infrastructure** of any kind. There is no error tracking, no monitoring, no user feedback channel, no knowledge base, no defined SLAs, and no incident response process. The platform is built and running code, but there is no systematic way to know when it breaks, how long it stays broken, or what users are struggling with.

This document identifies every gap and proposes a phased support system that is practical for an early-stage MENA SaaS with a lean team and VPS-hosted infrastructure.

---

## 1. Current State Audit

### 1.1 What Exists Today

| Support Capability | Status | Notes |
|---|---|---|
| Error tracking (Sentry/equivalent) | None | Errors only visible if someone checks server logs |
| Uptime monitoring | None | No alerts if the service goes down |
| Response time monitoring | None | No visibility into slow API calls |
| Application logging | Partial | `console.error` in some API routes; not centralized |
| User feedback channel | None | No in-app feedback, no support email configured |
| Knowledge base | None | No user documentation exists |
| Support ticket system | None | No way to receive or track user issues |
| Incident response process | None | No runbooks, no escalation path defined |
| On-call schedule | None | Nobody is formally responsible for uptime |
| SLA definition | None | No commitments made to users |
| Status page | None | Users have no way to check if outages are known |
| Database backup monitoring | None | No alerts if backups fail |

### 1.2 Consequences of No Support Infrastructure

- **Silent failures:** The stale-JWT bug (BUG-001) produced a 500 error with only a `console.error` in the route handler. Without error tracking, this could have silently failed for dozens of users before being noticed.
- **Unknown downtime:** If the VPS crashes at 2am, the team finds out when a user complains — hours later.
- **No feedback loop:** No way to know which features confuse users, which templates are popular, or why users churn.
- **Unscalable debugging:** When something breaks, the support process is "SSH into the server and read logs" — not sustainable for a SaaS.
- **No SLA accountability:** There are no defined response time commitments, so users have no expectation and the team has no target.

---

## 2. Required Support Infrastructure

### 2.1 Error Tracking

**Gap:** JavaScript/TypeScript errors in Next.js API routes and client components are not captured.

**Recommendation:** Deploy **Sentry** (self-hosted via Docker on the same Hetzner VPS, or use Sentry.io free tier).

**Implementation:**
```bash
# Install Sentry SDK
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Configure in `sentry.server.config.ts` and `sentry.client.config.ts`.

**What to capture:**
- All unhandled API route errors (wrap with Sentry.captureException)
- Client-side React component errors (ErrorBoundary integration)
- Next.js build-time errors
- Performance transactions for API routes

**Priority alerts:**
- P1: 5xx error rate > 1% over 5 minutes → immediate Telegram/email alert
- P2: New error type first occurrence → notify within 1 hour
- P3: Error rate increased 50% vs prior hour → notify within 4 hours

### 2.2 Uptime and Health Monitoring

**Gap:** No way to detect when the application or VPS goes down.

**Recommendation:** Use **UptimeRobot** (free tier, checks every 5 minutes) plus a custom `/api/health` endpoint.

**Health Endpoint to Build (`src/app/api/health/route.ts`):**
```typescript
export async function GET() {
  try {
    // Check DB connectivity
    db.select().from(schema.users).limit(1).all();
    return NextResponse.json({ status: 'ok', db: 'ok', ts: Date.now() });
  } catch {
    return NextResponse.json({ status: 'error', db: 'unreachable' }, { status: 503 });
  }
}
```

**UptimeRobot monitors to configure:**
- `https://app.safahati.com/api/health` — every 5 minutes
- `https://app.safahati.com` — every 5 minutes (homepage load)
- `https://demo.safahati.com` — every 15 minutes (demo site)

**Alert channels:** Email + Telegram bot for P1 downtime.

### 2.3 Application Performance Monitoring

**Gap:** No visibility into slow API routes or DB queries.

**Recommendation:** Sentry Performance Monitoring (included with Sentry setup) + Grafana + Loki for log aggregation.

**Grafana Dashboard KPIs:**
- API response time P50/P95/P99 by route
- Error rate by route
- Active sessions count
- SQLite DB file size over time
- VPS CPU and memory usage
- Nginx request rate

### 2.4 User Feedback Channel

**Gap:** No mechanism for users to report issues or request features.

**Recommendation:** Phased approach:

**Phase 1 (immediate):** Add a support email `support@safahati.com` (Resend-backed) with auto-reply acknowledgment. Add link in dashboard footer.

**Phase 2 (1 month):** Add in-app feedback widget (Canny.io free tier, or simple form that emails the team). Display in the dashboard sidebar.

**Phase 3 (3 months):** Self-hosted support ticket system (Zammad or Chatwoot) for structured ticket management.

### 2.5 Status Page

**Gap:** Users cannot check if known outages exist before contacting support.

**Recommendation:** Use **Statuspage.io** (free for 3 metrics) or self-host **Upptime** on GitHub Pages.

**Status components to track:**
- Dashboard (app.safahati.com)
- Published Sites (*.safahati.com)
- API (api.safahati.com or app.safahati.com/api)
- Authentication Service
- File Uploads (MinIO)

---

## 3. Support Tier Structure

### Tier Definitions

| Tier | Name | Channels | Response Target | Users |
|---|---|---|---|---|
| Tier 0 | Self-Service | Knowledge base, FAQ, status page | No response needed | All users |
| Tier 1 | Standard Support | Email, in-app feedback | 24 hours (business days) | Free/Starter plans |
| Tier 2 | Priority Support | Email + live chat | 4 hours (business hours) | Pro plan |
| Tier 3 | Dedicated Support | Email + phone + dedicated contact | 1 hour (extended hours) | Enterprise plan |

### Escalation Path

```
User reports issue
       ↓
Tier 0: User consults knowledge base → resolved? Done
       ↓ (not resolved)
Tier 1: Support agent reviews ticket
       ↓ Bug confirmed → create bug ticket → QA / Backend Engineer
       ↓ User error → knowledge base article updated
       ↓ Data issue → Backend Engineer + DBA
       ↓ Infra issue → DevOps / Admin
       ↓
Tier 2: Technical escalation for complex issues
       ↓
Tier 3: Account-level escalation (refunds, data recovery, custom config)
```

---

## 4. SLA Definitions

### 4.1 Incident Severity and Response SLAs

| Severity | Definition | Response Time | Resolution Target |
|---|---|---|---|
| P1 — Critical | Platform down, data loss, security breach | 15 minutes | 2 hours |
| P2 — High | Major feature broken (site creation, login, publishing) | 1 hour | 8 hours |
| P3 — Medium | Feature degraded, non-critical error, performance issue | 4 hours | 48 hours |
| P4 — Low | Minor UX issue, cosmetic bug, enhancement request | 2 business days | Next sprint |

### 4.2 Support Ticket SLAs (by plan tier)

| Priority | Free Plan | Starter Plan | Pro Plan | Enterprise |
|---|---|---|---|---|
| Urgent (feature broken) | 24h response | 12h response | 4h response | 1h response |
| High (major issue) | 48h response | 24h response | 8h response | 4h response |
| Normal (question) | 72h response | 48h response | 24h response | 8h response |
| Low (enhancement) | Best effort | Best effort | 1 week | 48h response |

### 4.3 Platform Uptime SLA (by plan)

| Plan | Uptime Commitment | Measurement |
|---|---|---|
| Free | No SLA | — |
| Starter | 99.5% monthly | Excluding planned maintenance |
| Pro | 99.9% monthly | Excluding planned maintenance with 48h notice |
| Enterprise | 99.95% monthly | With compensated downtime credits |

---

## 5. Incident Response Process

### 5.1 P1 Incident Workflow

1. **Detect:** UptimeRobot / Sentry alert fires → on-call receives notification
2. **Acknowledge:** Within 15 minutes — post in #incidents channel, acknowledge alert
3. **Assess:** SSH to server; check `docker compose ps`; check Nginx logs; check app logs
4. **Communicate:** Post initial status to status page ("We are investigating an issue…")
5. **Remediate:** Execute runbook for the specific failure type (see 08-Application-Support runbooks)
6. **Verify:** Confirm resolution by hitting health check endpoint and testing core flows
7. **Update status page:** Mark incident as resolved with timeline
8. **Post-mortem:** Within 48 hours, write blameless post-mortem in `/incidents/` folder
9. **Update runbook:** If the issue revealed a gap in runbooks, update them

### 5.2 Communication Templates

**Status page — incident acknowledged:**
> We are currently investigating reports of [brief description]. Our team is working to resolve this. We will provide an update in 30 minutes.
> نحن ندرس حاليًا تقارير تتعلق بـ [وصف موجز]. يعمل فريقنا على حل المشكلة. سنقدم تحديثًا خلال 30 دقيقة.

**Status page — incident resolved:**
> This incident has been resolved. Service is now fully operational. We apologize for any inconvenience.
> تم حل هذا الحادث. الخدمة تعمل الآن بشكل طبيعي. نعتذر عن أي إزعاج.

---

## 6. Required Infrastructure Setup (Prioritized)

| Priority | Item | Effort | Cost |
|---|---|---|---|
| P1 | Sentry error tracking (self-hosted) | 1 day | $0 (server cost only) |
| P1 | UptimeRobot monitoring (5 monitors) | 2 hours | $0 (free tier) |
| P1 | `/api/health` endpoint | 2 hours | $0 |
| P1 | Support email (support@safahati.com via Resend) | 1 day | ~$5/mo |
| P2 | Status page (Upptime on GitHub Pages) | 1 day | $0 |
| P2 | Grafana + Loki log aggregation | 2 days | $0 (server cost only) |
| P2 | In-app feedback widget | 1 day | $0 (Canny free tier) |
| P3 | Telegram/Discord alert bot | 4 hours | $0 |
| P3 | Automated DB backup to MinIO | 1 day | $0 |
| P3 | Knowledge base (GitBook or Notion) | 1 week | $0–$8/mo |
| P4 | Support ticket system (Chatwoot) | 2 days | $0 (self-hosted) |

**Total estimated setup time:** 3–4 weeks (parallel to product development)
**Total ongoing cost:** ~$5–15/month added to existing infrastructure
