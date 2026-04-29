# Executive Summary — Safahati Virtual Team Analysis

**Date:** April 2026
**Branch:** ai-agent
**Team:** 8 roles — PO, BD, BA, UX/UI, FE, BE, QA, App Support

---

## Project Health Overview

| Dimension | Rating | Signal |
|---|---|---|
| Product Vision | 8/10 | Clear, well-differentiated, strong market timing |
| Market Opportunity | 9/10 | Large underserved MENA SME market, Vision 2030 tailwind |
| Technical Foundation | 6/10 | Solid architecture, significant tech debt and gaps |
| UX/UI | 5/10 | Functional but unpolished, no onboarding, partial RTL |
| Code Quality | 3.5/10 | Zero automated tests, TS errors, schema drift |
| Backend Readiness | 4/10 | SQLite not production-ready, no validation, no auth hardening |
| Business Readiness | 3/10 | No payments, no subdomain routing live, no support infra |

**Overall: The idea and architecture are strong. The product is not yet shippable as a commercial SaaS.**

---

## Top 5 Findings Across All Roles

### 1. Core Infrastructure Is Incomplete
Subdomain routing — the core mechanic of the entire platform — is not live. No client can actually get a `client.safahati.com` website today. This is the single most critical gap before any commercial activity.

### 2. Zero Quality Infrastructure
No automated tests exist anywhere in the codebase. No CI/CD. No error tracking. No monitoring. A single bad deploy could go undetected. The QA team rates overall quality at 3.5/10.

### 3. Schema Drift Is a Time Bomb
The actual SQLite database has 9 columns that do not exist in the Drizzle ORM schema. These were added directly to the DB without updating the schema file. This will cause production failures during the PostgreSQL migration if not fixed immediately.

### 4. Arabic/RTL Is First-Class but Incomplete
The platform is designed bilingual from the ground up — industry templates have Arabic content, RTL layout support exists in templates. However, the admin dashboard itself (create, edit, manage sites) is English-only. Arabic-speaking users are the primary market.

### 5. Strong Foundation for AI Differentiation
The config-driven architecture, bilingual content model, and Claude API integration plan position Safahati uniquely: AI that generates Arabic + English copy simultaneously is a feature no major competitor (Wix, Squarespace, Webflow) offers natively.

---

## Critical Path to Launch

These must be completed before charging a single customer:

1. **Fix schema drift** — sync Drizzle schema with actual DB (1 day, BE)
2. **Implement subdomain routing** — proxy.ts + Nginx wildcard (3 days, BE + DevOps)
3. **Stripe integration** — subscription creation, webhook handling, billing portal (5 days, BE)
4. **Site publishing flow** — draft → published with live subdomain (2 days, FE + BE)
5. **Fix tsParticles TS errors** — migrate to v3 API (1 day, FE)
6. **Basic error tracking** — Sentry DSN in production (0.5 days, DevOps)
7. **PostgreSQL migration** — move off SQLite for production (3 days, BE)

**Estimated total: ~15 working days (3 weeks with 1 developer)**

---

## Revenue Potential

| Scenario | Sites | ARPU | Monthly MRR |
|---|---|---|---|
| Conservative (end Q2 2026) | 50 | SAR 99 | SAR 4,950 |
| Base (end Q3 2026) | 300 | SAR 120 | SAR 36,000 |
| Optimistic (end Q4 2026) | 1,000 | SAR 149 | SAR 149,000 |

Break-even estimated at ~200 paying sites (~SAR 25,000 MRR) covering infrastructure + 1 developer.

---

## North Star Metric

**Active published sites** — defined as: site status = `published` AND at least one section edited in the past 30 days.

All other metrics (activation rate, churn, NPS, revenue) are downstream of this.
