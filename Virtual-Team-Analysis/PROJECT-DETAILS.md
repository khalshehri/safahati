# Safahati — Project Details

## What Is Safahati?

Safahati (صفحاتي — "My Pages") is a multi-tenant, config-driven website platform built for the MENA/Saudi market. One codebase, one deployment, serves all clients. Each client gets a subdomain (client.safahati.com) that renders a professional website assembled from pre-built block templates, driven entirely by a JSON config stored in the database.

It is **not** a drag-and-drop builder. The admin dashboard is form-based. The output is a production-quality website.

---

## Business Model

- SaaS monthly/annual subscriptions (SAR-denominated)
- Planned tiers: Starter (SAR 49/mo), Growth (SAR 149/mo), Pro (SAR 349/mo), Agency (custom)
- Target market: Saudi/MENA SMEs, freelancers, clinics, restaurants, law firms, gyms, agencies
- Strategic context: Saudi Vision 2030 SME digitization wave

---

## Technical Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4, shadcn/ui, tw-animate-css |
| Animations | Framer Motion 12, GSAP (hero templates), tsParticles |
| State | Zustand 5 |
| ORM | Drizzle ORM v0.45 |
| DB (dev) | SQLite via better-sqlite3 |
| DB (prod) | PostgreSQL 16 (planned) |
| Auth | NextAuth.js v5 beta (JWT, Credentials) |
| Storage | MinIO S3-compatible (planned) |
| Email | Resend (planned) |
| Payments | Stripe + Moyasar (planned) |
| AI | Vercel AI SDK + Claude API (planned) |
| Infra | Hetzner VPS, Docker Compose, Nginx, Cloudflare |

---

## Database Schema (Current)

```
users         — id, name, email, password_hash, created_at
              + phone, country, phone_verified (in DB, not in Drizzle schema)

sites         — id, user_id→users, name, slug(unique), industry,
                theme(JSON), language, status(draft|published),
                created_at, updated_at
              + business_type, description, whatsapp, city,
                keyword_tags, theme_id, ai_generated (in DB, schema drift)

sections      — id, site_id→sites(CASCADE), block_type, template_id,
                config(JSON), sort_order, is_visible
```

---

## Component System

- **31 block types:** navbar, hero, about, services, portfolio, testimonials, pricing, FAQ, contact, footer, and more
- **112 templates total** across all block types
- **13 industry templates:** Company, Agency, Freelancer, Resume, Restaurant, Clinic, Real Estate, SaaS, E-commerce, Event, Photography, Law Firm, Gym
- Each template is a standalone `.tsx` file
- Registry pattern: `registerBlock()` → `getBlock()` → `getTemplate()`

---

## Current Application Routes

| Route | Status | Description |
|---|---|---|
| `/login` | Working | Email/password login |
| `/register` | Working | New user registration |
| `/dashboard` | Working | Site list |
| `/dashboard/new` | Working | 2-step site creation wizard |
| `/dashboard/[siteId]/editor` | Partial | Site editor |
| `/demo/[industry]/[component]/[id]` | Working | Template demos |
| `[subdomain].safahati.com` | Not deployed | Published site renderer |

---

## Known Issues (as of April 2026)

| ID | Severity | Status | Description |
|---|---|---|---|
| BUG-001 | P1 | Fixed | Stale JWT session causes 500 on site creation |
| BUG-002 | P2 | Open | tsParticles `init` prop removed — TS errors in 25+ hero files |
| BUG-003 | P3 | Open | middleware.ts deprecated — should be proxy.ts in Next.js 16 |
| BUG-004 | P2 | Open | Schema drift — 9 DB columns missing from Drizzle schema |
| BUG-005 | P3 | Open | No error boundaries in any React component |
| BUG-006 | P3 | Open | No loading states in editor page |

---

## Repository

- **Remote:** https://github.com/khalshehri/safahati.git (private)
- **Main branch:** main
- **Analysis branch:** ai-agent
- **Current active branch:** ai-agent

---

## Virtual Team Analysis Structure

This repository contains a full virtual team analysis under `/Virtual-Team-Analysis/`. Each folder maps to a role and contains skills documentation plus full deliverable documents produced by AI agents analyzing the codebase.

```
Virtual-Team-Analysis/
├── 01-Product-Owner/          PO strategy, roadmap, prioritization
├── 02-Business-Development/   Market analysis, GTM, partnerships
├── 03-Business-Analyst/       Requirements, user journeys, KPIs
├── 04-UI-UX-Designer/         UX audit, wireframes, design system
├── 05-Frontend-Engineer/      Technical assessment, architecture, standards
├── 06-Backend-Engineer/       Backend analysis, DB plan, API specs
├── 07-QA-Engineer/            Quality assessment, test strategy, bug registry
├── 08-Application-Support/    Support analysis, knowledge base, training
└── TEAM-COLLABORATION/        Integrated cross-team deliverables
```
