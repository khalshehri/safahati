# Integrated Recommendations — Cross-Team Consensus

Each recommendation below is supported by multiple roles. Priority is based on combined impact × effort scoring.

---

## P0 — Must Fix Before Launch (Blockers)

### R-01: Fix Drizzle Schema Drift
**Raised by:** BE, QA
**Problem:** 9 DB columns (phone, country, phone_verified, business_type, description, whatsapp, city, keyword_tags, theme_id, ai_generated) exist in SQLite but not in the Drizzle schema. Any query or insert touching these columns outside raw SQL will silently ignore them or fail.
**Fix:** Update `src/lib/db/schema.ts` to match actual DB. Add Drizzle migration tooling (`drizzle-kit`) to prevent future drift.
**Effort:** 1 day | **Owner:** BE

### R-02: Implement Subdomain Routing
**Raised by:** PO, BA, BE, BD
**Problem:** The core value proposition of Safahati is that clients get `client.safahati.com`. This does not work yet. No client website is actually accessible.
**Fix:** Rename `middleware.ts` → `proxy.ts`, implement subdomain extraction logic, configure Nginx wildcard (`*.safahati.com`), wildcard SSL via Let's Encrypt DNS challenge.
**Effort:** 3 days | **Owner:** BE + DevOps

### R-03: Migrate SQLite → PostgreSQL
**Raised by:** BE, SA
**Problem:** SQLite blocks the Node.js event loop on writes, does not support concurrent multi-tenant writes safely, and is unsuitable for a production SaaS.
**Fix:** Full migration plan documented in `06-Backend-Engineer/02-Database-Optimization.md`. Includes TypeScript data migration script.
**Effort:** 3 days | **Owner:** BE

### R-04: Add Zod Validation to All API Routes
**Raised by:** BE, QA, BA
**Problem:** Zero input validation exists on any API endpoint. Malformed or missing fields are passed directly to the DB, causing unhandled exceptions.
**Fix:** Add Zod schemas to all POST/PUT/PATCH handlers. Full specs in `06-Backend-Engineer/03-API-Specifications.md`.
**Effort:** 2 days | **Owner:** BE

### R-05: Fix tsParticles TypeScript Errors
**Raised by:** FE, QA
**Problem:** 25+ hero template demo files have TypeScript errors due to tsParticles v2 → v3 API changes (`init` prop removed, `IParticlesProps` type changed). Build warnings will become errors.
**Fix:** Migrate to `@tsparticles/react` v3 API using `initParticlesEngine` hook.
**Effort:** 1 day | **Owner:** FE

---

## P1 — Required for Commercial Viability

### R-06: Stripe Subscription Integration
**Raised by:** PO, BD, BA, BE
**Problem:** No payment collection exists. The platform cannot generate revenue.
**Fix:** Stripe Checkout sessions, webhook handler (`/api/webhooks/stripe`), subscription status stored in DB, plan-based feature gating.
**Effort:** 5 days | **Owner:** BE + FE

### R-07: Moyasar Payment Integration (MENA-local)
**Raised by:** BD, BA
**Problem:** Saudi users strongly prefer Mada and STC Pay over international cards. Competitors without local payment options see significantly lower conversion.
**Fix:** Integrate Moyasar as secondary payment provider alongside Stripe. Moyasar supports Mada, STC Pay, Visa, Mastercard.
**Effort:** 3 days | **Owner:** BE

### R-08: Site Publishing Flow (Draft → Live)
**Raised by:** PO, BA, FE, BE
**Problem:** Sites can be created and edited but cannot be published to a live subdomain. The `status` field exists in the DB but publishing does nothing.
**Fix:** Implement `/api/sites/[siteId]/publish` endpoint, published site renderer at subdomain routes, cache invalidation on publish.
**Effort:** 2 days | **Owner:** FE + BE

### R-09: Arabic RTL Dashboard
**Raised by:** BA, UX/UI, PO
**Problem:** The admin dashboard is English-only. The primary target market is Arabic-speaking Saudi users. This creates friction for the core user segment.
**Fix:** Add language toggle to dashboard layout, translate all static strings, implement RTL CSS logical properties for dashboard layout.
**Effort:** 4 days | **Owner:** FE + UX/UI

### R-10: Error Tracking (Sentry)
**Raised by:** QA, App Support, BE
**Problem:** No visibility into production errors. The stale session bug (BUG-001) was only discovered through manual testing. Production failures could go undetected for hours.
**Fix:** Add Sentry SDK, configure source maps, set up Slack alerts for P1/P2 errors.
**Effort:** 0.5 days | **Owner:** DevOps

---

## P2 — Growth Features (Post-Launch)

### R-11: AI Copy Generation (Claude API)
**Raised by:** PO, BD, BA, FE, BE
**Problem:** The biggest user friction point is "I don't know what to write." AI copy generation removes this blocker, especially in Arabic where quality content is scarce.
**Fix:** Integrate Vercel AI SDK + Claude API. User provides: business name, industry, language preference. AI generates: headline, description, CTA text, service descriptions — in Arabic and English simultaneously.
**Effort:** 5 days | **Owner:** FE + BE

### R-12: Custom Domain Support
**Raised by:** PO, BA
**Problem:** Professional businesses need their own domain (mybusiness.com), not a subdomain. Custom domains are a table-stakes feature for any website platform.
**Fix:** CNAME verification flow, Nginx dynamic vhost or Cloudflare Workers routing, SSL provisioning via Let's Encrypt.
**Effort:** 5 days | **Owner:** BE + DevOps

### R-13: User Onboarding Flow
**Raised by:** UX/UI, BA, PO
**Problem:** After creating a first site, users land in the editor with no guidance. No empty states, no guided tour, no contextual help. First-time users are confused.
**Fix:** Post-creation welcome modal, 5-step guided editor tour (Shepherd.js), contextual tooltips on first visit, empty state illustrations.
**Effort:** 3 days | **Owner:** FE + UX/UI

### R-14: Basic Site Analytics
**Raised by:** PO, BA, BD
**Problem:** Site owners cannot see how their website is performing (visits, unique visitors, top pages). This is a core feature of every competing platform.
**Fix:** Lightweight analytics using Plausible (self-hosted) or Umami. Embed tracking script in published sites, show aggregated stats in dashboard.
**Effort:** 3 days | **Owner:** BE + FE

### R-15: Automated Test Suite (Foundation)
**Raised by:** QA, FE, BE
**Problem:** Zero automated tests. Every deploy is a manual regression test. The QA team rates this as the highest technical risk in the project.
**Fix:** Set up Vitest for unit tests, Playwright for E2E. Start with auth flow and site creation flow as critical path coverage. Target 60% coverage on API routes within 4 sprints.
**Effort:** 5 days initial | **Owner:** QA + FE + BE

---

## P3 — Differentiation Features (6-Month Horizon)

| # | Feature | Raised By | Effort |
|---|---|---|---|
| R-16 | White-label / Agency plan | BD, PO | 8 days |
| R-17 | Live preview in editor | UX/UI, FE | 4 days |
| R-18 | Drag-and-drop section reorder | UX/UI, FE | 3 days |
| R-19 | SEO meta fields per page | BA, FE | 2 days |
| R-20 | WhatsApp contact integration | BA, BD | 1 day |
| R-21 | Image upload (MinIO) | BE, FE | 3 days |
| R-22 | Rate limiting on API routes | BE, QA | 1 day |
| R-23 | Redis caching layer | BE | 3 days |
| R-24 | Mobile-responsive dashboard | UX/UI, FE | 3 days |
| R-25 | Post-mortem process | App Support, QA | 0.5 days |
