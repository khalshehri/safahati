# Product Owner — Skills & Capabilities Profile
## Role: Product Owner, Safahati Platform

---

## Overview

The Product Owner on Safahati occupies a uniquely demanding position: this is not a simple SaaS tool. It is a multi-tenant, multi-industry, bilingual platform targeting a market (MENA/Saudi Arabia) where digital expectations, cultural norms, regulatory frameworks, and competitive dynamics differ substantially from Western SaaS defaults. The PO must hold both technical depth and commercial acuity simultaneously.

---

## Core Competency Areas

### 1. SaaS Product Management

| Skill | Relevance to Safahati |
|---|---|
| Subscription lifecycle management | Monthly recurring revenue model; trial → paid → retained → upsell |
| Churn analysis and intervention | SME clients have high churn risk if onboarding is poor |
| Activation metrics design | Define "activated" = site published within 7 days of signup |
| Pricing strategy | Tiered plans; need Arabic-language pricing communication |
| Feature gating | Distinguish free/starter/pro/agency plan capabilities |
| Usage-based metering | AI copy generation tokens, storage, bandwidth |

### 2. Multi-Tenant Platform Architecture Understanding

The PO must understand (without necessarily coding) how Safahati's config-driven, subdomain-routed architecture shapes what is possible and what is costly:

- **Config-driven rendering:** Every client website is a JSON blob. The PO must understand what fields exist, what is configurable, and what requires a new template.
- **Template versioning:** When a template is updated, does it break existing sites? PO owns the migration policy.
- **Subdomain routing:** Understanding Nginx wildcard SSL + Cloudflare DNS means the PO can accurately assess feasibility timelines for custom domain support.
- **Registry pattern:** Adding a new component type is non-trivial. Prioritization decisions must account for the full build cost (schema + template + Zod validation + admin form + bilingual content model).

### 3. Bilingual Product Design (Arabic + English)

This is a first-class skill requirement, not an afterthought:

- **RTL/LTR layout expertise:** Understands that a two-column layout that looks correct in English can be visually broken in Arabic. Must review designs in both directions.
- **Content architecture:** All config JSON must support `{ ar: "...", en: "..." }` structures. PO must enforce this on every new feature spec.
- **Cultural adaptation:** Font choices, color associations, iconography, and even CTA phrasing must be reviewed for Arabic cultural fit.
- **Translation workflow:** Not just machine translation — the PO should define a quality bar for Arabic copy across all 13 industry templates (169 content touchpoints minimum).
- **Locale-specific formatting:** Hijri/Gregorian calendar, currency (SAR), phone number formats (+966), right-to-left number sequences.

### 4. MENA Market Domain Knowledge

- Understanding of Saudi Vision 2030's impact on SME digitization demand
- Familiarity with Saudi e-commerce regulations (ZATCA, VAT 15%)
- Knowledge of dominant local payment methods: Mada, STC Pay, Apple Pay, Tabby (BNPL)
- Awareness of data residency preferences and Saudi PDPL (Personal Data Protection Law)
- Understanding of target verticals: clinics, law firms, real estate brokers, restaurants — all regulated industries in Saudi Arabia
- Sensitivity to Ramadan traffic patterns, Eid campaign timing

### 5. Technical Product Ownership

| Capability | Detail |
|---|---|
| Backlog authoring | Writes precise user stories with Zod-schema-level acceptance criteria |
| API contract review | Can read/write OpenAPI-style specs for dashboard ↔ renderer contracts |
| Database schema intuition | Understands Drizzle ORM schema impacts when adding new section types |
| Performance budgeting | Sets Core Web Vitals targets per industry template (LCP < 2.5s on mobile 3G) |
| Error classification | Distinguishes 500 errors caused by stale JWT vs. config schema mismatches |
| CI/CD pipeline awareness | Understands Docker Compose deployment; knows when a config change requires a redeploy |

### 6. Stakeholder & Team Management

- Translates business goals into engineering-ready specs with no ambiguity
- Prioritizes ruthlessly in a lean team environment (no room for gold-plating)
- Manages a 13-industry template roadmap without losing coherence
- Communicates tradeoffs between speed-to-market and technical debt clearly
- Coordinates between design (bilingual UI), engineering (Next.js 15), and commercial (MENA sales)

### 7. Analytics & Data Literacy

- Defines KPIs at product level: MRR, NPS, site publish rate, template adoption, feature utilization per plan tier
- Instructs engineering on instrumentation requirements (PostHog, Mixpanel, or custom)
- Reads funnel data to identify where MENA users drop off during onboarding
- Tracks which of 13 industry templates drives highest LTV customers

### 8. Competitive Intelligence

Maintains active awareness of:
- **Wix / Squarespace**: global leaders but poor Arabic UX, no MENA payment integration
- **Zid / Salla**: Saudi e-commerce-first; not general website builders
- **Webflow**: too technical for the SME segment
- **Bezel / GoDaddy**: present in region but not localized
- **Local agencies**: direct competition for one-time build clients (Safahati's acquisition opportunity)

---

## Skills Matrix

| Domain | Depth Required | Priority |
|---|---|---|
| SaaS product metrics | Deep | Critical |
| Bilingual UX (AR+EN) | Deep | Critical |
| MENA market knowledge | Deep | Critical |
| Multi-tenant architecture | Medium | High |
| Technical spec writing | Deep | High |
| Pricing & packaging | Medium | High |
| Data analytics | Medium | High |
| Regulatory awareness (ZATCA, PDPL) | Medium | Medium |
| Mobile-first design judgment | Medium | High |
| AI feature product design | Entry | Growing |

---

## Anti-Patterns to Avoid

1. **Defaulting to Western SaaS UX patterns** — Arabic users navigate differently, expect local payment options, and trust brands that signal local presence
2. **Treating bilingual as "just translation"** — content length differences between Arabic and English break layouts; must be designed in from day one
3. **Over-specifying templates before validating** — 13 industries is already ambitious; do not add a 14th until the first 3 are generating revenue
4. **Ignoring mobile** — 85%+ of MENA web traffic is mobile; any PO decision that deprioritizes mobile is a strategic error
5. **Building features before fixing core reliability** — stale JWT 500 errors on site creation must be resolved before any growth feature ships
