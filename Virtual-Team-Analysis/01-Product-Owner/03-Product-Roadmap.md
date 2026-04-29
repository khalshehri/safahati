# Product Roadmap — Q2–Q3 2026 (6-Month Plan)
## Document Owner: Product Owner
## Version: 1.0 | April 2026

---

## Roadmap Overview

This is a 6-month phased roadmap covering April through September 2026. The roadmap is organized into three phases aligned with Safahati's maturity progression: **reliable foundation → customer growth → AI-powered monetization**.

Each phase has discrete goals, specific features, acceptance criteria, and measurable success metrics. The team is lean (2–3 engineers, 1 designer, 1 product owner), so estimates assume realistic throughput with no gold-plating.

---

## Phase 1: Core Launch (April – May 2026)

### Goal

Achieve a fully functional, publicly launchable platform that can acquire the first 50 paying customers reliably — zero critical bugs, bilingual, mobile-ready, with a clean site creation → publish flow.

**Theme: "Make it work, make it real, make it Arabic."**

---

### Features & Deliverables

#### 1.1 Critical Bug Fixes

| Item | Description | Effort |
|---|---|---|
| JWT stale session fix | Eliminate 500 errors on site creation for returning sessions | 2 days |
| Next.js 16 proxy.ts migration | Rename middleware.ts to proxy.ts; resolve deprecation warnings | 1 day |
| TypeScript tsParticles errors | Fix TypeScript errors in demo/hero template files | 1 day |

---

#### 1.2 Subdomain Routing (Production)

Full deployment of the multi-tenant subdomain routing infrastructure:

- Cloudflare: Wildcard A record `*.safahati.com` → Hetzner VPS IP
- Nginx: Wildcard SSL (Let's Encrypt) for `*.safahati.com`
- Next.js proxy.ts: Read `Host` header → extract slug → fetch site config from PostgreSQL → render site
- 404 handling: non-existent subdomains return a styled "This site doesn't exist yet" page
- Performance target: < 2s first paint on mobile 4G from Riyadh

**Deliverable:** `client.safahati.com` works in production for any client slug.

---

#### 1.3 Bilingual Content Model

Structural implementation of `LocalizedString` across all section configs:

- Define `LocalizedString = { ar: string; en: string }` type in Zod schemas
- Update all 31 component type configs to use `LocalizedString` for all user-facing text fields
- Admin dashboard: Arabic text inputs render with `dir="rtl"`, English with `dir="ltr"`
- Language switcher component on all published sites
- Locale detection: browser `Accept-Language` header as default; user can override and preference is stored in localStorage

**Deliverable:** Any published site is readable and correctly formatted in both Arabic (RTL) and English (LTR).

---

#### 1.4 Three Priority Industry Templates (Bilingual + Mobile)

Fully QA-verified templates for Company, Freelancer, and Clinic:

Each template includes:
- Hero section with 3+ template variants
- About/Services section
- Contact section with embedded form
- Footer with social links
- Arabic default content reviewed by a native speaker
- Mobile-verified at 360px, 390px, 428px widths in both RTL and LTR

**Deliverable:** 3 complete, bilingual, mobile-ready site templates available for selection at onboarding.

---

#### 1.5 Contact Form + Email Notifications

- Contact form component available on all templates
- Form submissions routed to site owner's email via Resend API
- Arabic-language notification email template
- Spam protection (honeypot field + rate limiting)

**Deliverable:** Leads captured on client sites are delivered to the site owner's inbox automatically.

---

#### 1.6 Admin Dashboard Polish

- Site list page: shows all user's sites, draft/live status, last updated
- Site settings page: name, subdomain, theme color, logo upload, contact info
- Section editor: add/reorder/edit/delete sections with live preview link
- Onboarding wizard: 5-step flow (industry → template → content → domain → publish)
- Fully bilingual admin UI (Arabic and English UI strings)

**Deliverable:** A non-technical user can create and publish a site in under 15 minutes with no support.

---

### Phase 1 Success Metrics

| Metric | Target |
|---|---|
| Site creation → publish success rate | ≥ 95% (no errors) |
| Time to publish (new user) | < 15 minutes |
| Mobile Lighthouse score (all 3 templates) | ≥ 80/100 |
| Arabic content quality score (internal review) | ≥ 4/5 |
| JWT-related 500 errors in production | 0 |
| Beta users onboarded | 20 |
| Beta users who successfully published | ≥ 15 |

---

## Phase 2: Growth Features (June – July 2026)

### Goal

Unlock revenue collection, acquire the first 200 paying customers, and add the features that convert trial users to paid subscribers and reduce churn.

**Theme: "Make it pay. Make it sticky."**

---

### Features & Deliverables

#### 2.1 Stripe Subscription Billing

Three-tier pricing model with Stripe Checkout:

| Plan | Price (SAR/mo) | Features |
|---|---|---|
| Starter | 79 | 1 site, 3 sections, Safahati branding, 2GB storage |
| Professional | 179 | 3 sites, all sections, no branding, custom domain, 10GB |
| Agency | 699 | 10 sites, white-label admin, priority support, 50GB |

Implementation:
- Stripe Checkout Sessions for subscription creation
- Stripe Customer Portal for self-service plan changes and cancellation
- Webhooks: `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`
- Grace period: 7 days after failed payment before downgrade
- Plan limits enforced at API level (not just UI)

**Deliverable:** Users can subscribe, upgrade, downgrade, and cancel via self-service Stripe flow.

---

#### 2.2 Custom Domain Support

Allow Professional and Agency plan users to connect their own domain:

- Admin UI provides step-by-step DNS instructions (CNAME or A record)
- Backend polls for DNS propagation (Cloudflare API or custom DNS lookup)
- Once verified, provisions Let's Encrypt certificate via Certbot/ACME client
- Nginx config updated dynamically (via script triggered by API)
- Custom domain takes priority over `.safahati.com` subdomain
- Domain verification status visible in admin

**Deliverable:** A client's site serves from `www.mybusiness.sa` with full HTTPS.

---

#### 2.3 Five Additional Industry Templates

Restaurant, Real Estate, Agency, SaaS, and Law Firm templates:

Each follows the same quality bar as Phase 1 (bilingual, mobile-verified, native Arabic content). Specific additions:
- **Restaurant:** Menu section with categories, prices, item descriptions (AR+EN); map embed; hours of operation
- **Real Estate:** Property listings grid (manual entry); contact broker CTA; neighborhood highlights
- **Agency:** Portfolio/case studies section; client logos carousel; team grid
- **SaaS:** Feature comparison table; pricing section; integration logos; sign-up CTA
- **Law Firm:** Practice areas; attorney profiles; consultation request form; ZATCA-compliant disclaimer

**Deliverable:** 8 total fully validated industry templates available to customers.

---

#### 2.4 Basic Analytics (Plausible Self-Hosted)

- Deploy Plausible Community Edition on Hetzner VPS
- Inject Plausible tracking script into all published sites automatically
- Analytics dashboard embedded in admin UI (per-site view only)
- Metrics shown: unique visitors, page views, top pages, device type, referrer sources, country
- 30-day rolling window; no personal data collected (GDPR/PDPL compliant)
- Arabic labels in dashboard

**Deliverable:** Every site owner can see how many people visited their site, from where, and on what device.

---

#### 2.5 Basic SEO Tools

- Editable meta title and meta description per site (Arabic + English separately)
- OG image upload per site
- Auto-generated sitemap.xml (updated on every publish)
- robots.txt with default sensible configuration
- Canonical URL tag correctly pointing to custom domain (if set) or subdomain
- Schema.org JSON-LD for business type (LocalBusiness, MedicalClinic, LegalService, etc.) per industry

**Deliverable:** Every published site is properly indexed by Google in both Arabic and English.

---

#### 2.6 Image Upload & Optimization

- Client can upload images via admin dashboard; stored in MinIO (S3-compatible)
- Automatic WebP conversion on upload
- Responsive srcset attributes generated for hero images
- Image delivery via Cloudflare CDN (cached at edge)
- Max upload size: 10MB per image; 2GB total per Starter account
- Progress indicator and error handling for uploads

**Deliverable:** Images load fast on mobile without manual optimization by the client.

---

### Phase 2 Success Metrics

| Metric | Target |
|---|---|
| Paying customers (cumulative) | 200 |
| MRR | SAR 50,000 |
| Monthly churn rate | < 6% |
| Custom domain activation rate (Pro+ users) | ≥ 50% |
| Site analytics dashboard views/week per user | ≥ 2 |
| Time to publish (new user, measured) | < 10 minutes |
| Industry templates available | 8 |
| NPS | ≥ 40 |

---

## Phase 3: AI + Monetization (August – September 2026)

### Goal

Differentiate through AI-powered Arabic copy generation, launch Mada/STC Pay for the Saudi market, enable the agency reseller model, and push toward SAR 250,000 MRR by end of Q4 2026.

**Theme: "Make it intelligent. Make it local. Make it scale."**

---

### Features & Deliverables

#### 3.1 AI Copy Generation (Claude API, Bilingual)

The headline differentiator: AI writes your website copy in Arabic and English, for your specific industry.

Architecture:
- Vercel AI SDK + Claude claude-sonnet-4-6 (or latest available)
- Integrated at two touch points: (a) onboarding wizard, (b) section editor "Generate with AI" button
- Industry-aware prompt templates: each of the 13 industries has a custom system prompt
- User inputs: business name, city, 3–5 bullet points about the business
- Output: complete section content (headline, subheadline, body copy, CTA text) in both languages
- Streaming response UI (character-by-character output, not wait-then-show)
- User can regenerate (with a counter per session), edit output, or reject and write manually
- Usage limits: Starter = 5 AI generations/month; Professional = 50/month; Agency = unlimited

**Quality bar:** Output must score ≥ 4/5 in native Arabic speaker quality review before launch. This requires prompt engineering iteration with Arabic-speaking reviewers.

**Deliverable:** Any user, regardless of writing ability, can generate a complete, professional website in both languages in under 20 minutes.

---

#### 3.2 Mada + STC Pay (via Moyasar)

Saudi-native payment acceptance for subscription billing:

- Moyasar integrated as payment provider (supports Mada, Visa, Mastercard, Apple Pay, STC Pay)
- SAR-denominated checkout (no currency conversion friction)
- ZATCA e-invoice generated and emailed on every successful payment (required for Saudi VAT compliance)
- Mada card UX: Safahati checkout explicitly shows Mada logo and "بطاقة مدى" label
- STC Pay: deep-link redirect flow (standard for STC Pay merchant integration)
- Subscription management: upgrade/downgrade/cancel mirrored for Moyasar subscriptions as well as Stripe
- Payment method stored securely (Moyasar tokenization)

**Deliverable:** Saudi customers can pay for Safahati subscriptions using their local bank cards and STC Pay — no international card required.

---

#### 3.3 Agency / White-Label Plan

Enable digital agencies to resell Safahati under their own brand:

- White-label admin: agency's logo and brand colors replace Safahati branding
- "Powered by Safahati" footer badge removed (optional per plan)
- Agency can create client sub-accounts and manage their sites from an agency dashboard
- Agency sees aggregated billing (pays one invoice; manages client billing separately)
- Client accounts have restricted access (cannot see billing, cannot change plan)
- Agency plan: SAR 699/month for up to 10 active sites; SAR 1,299/month for up to 25 sites

**Deliverable:** A Saudi digital agency can deliver client websites on Safahati infrastructure under their own brand, improving their margin and reducing their delivery time.

---

#### 3.4 Remaining 5 Industry Templates

Complete the full set of 13 industry templates: Photography, Gym, E-commerce (brand site), Event, and Resume.

Each follows the established quality bar. Specific notes:
- **Photography:** Portfolio gallery with masonry layout; before/after comparison slider; booking inquiry form
- **Gym:** Class schedule table; instructor profiles; membership pricing cards; Google Maps embed
- **E-commerce (brand site):** Product showcase (no cart); links to Salla/Zid store; brand story section
- **Event:** Countdown timer; speaker lineup; schedule/agenda; ticket CTA (link to external ticketing)
- **Resume:** Personal bio; experience timeline; skills grid; education; download CV button (PDF)

**Deliverable:** All 13 industry templates available and validated in production.

---

#### 3.5 Referral Program

Launch a referral program to drive organic growth in the Saudi SME community:

- Every active subscriber gets a personal referral link
- Referrer earns: 1 free month for every paying customer referred
- Referred new user gets: 30-day free trial (instead of default 14 days)
- Tracking: custom referral codes embedded in signup URL, attributed in DB
- Dashboard widget: "You've referred 3 people → earned 3 free months"
- Email cadence: referral invitation email, referral success notification

**Deliverable:** Word-of-mouth referral loop instrumented and incentivized.

---

### Phase 3 Success Metrics

| Metric | Target |
|---|---|
| Paying customers (cumulative) | 400 |
| MRR | SAR 150,000 |
| AI copy generation adoption | ≥ 60% of new signups use AI at least once |
| Arabic AI copy quality score (user rating) | ≥ 4/5 average |
| Mada/STC Pay as % of new Saudi subscriptions | ≥ 40% |
| Agency plan subscribers | ≥ 20 agencies |
| Referral-driven signups as % of total | ≥ 25% |
| All 13 industry templates live | 100% |
| Monthly churn rate | < 5% |
| NPS | ≥ 50 |

---

## Cross-Phase Dependencies & Risks

### Critical Path

```
Phase 1: JWT fix → Subdomain routing → Bilingual model → Site publishing flow
                                                          ↓
Phase 2:                               Stripe billing → Custom domains → Analytics
                                                          ↓
Phase 3:                                          AI copy → Mada/STC Pay → Agency plan
```

### Key Risks

| Risk | Phase | Mitigation |
|---|---|---|
| Subdomain routing DNS propagation delays | 1 | Pre-configure Cloudflare 2 weeks before launch date |
| Arabic AI copy quality below bar | 3 | Start prompt engineering in Phase 2 with internal test group |
| Moyasar merchant account approval (2–4 weeks) | 3 | Begin application in Phase 1 |
| Next.js 16 proxy.ts migration breaks other middleware | 1 | Dedicated spike in week 1 |
| Template volume (13 templates) strains design capacity | 2–3 | Prioritize 5 revenue-generating templates; delay niche ones |
| Let's Encrypt rate limits for custom domains | 2 | Implement wildcard cert per domain; cache cert aggressively |

---

## Milestones Summary

| Milestone | Target Date |
|---|---|
| Phase 1 bug fixes complete | May 2, 2026 |
| Subdomain routing live in production | May 9, 2026 |
| Bilingual model fully implemented | May 16, 2026 |
| 3 industry templates QA-verified | May 23, 2026 |
| Public beta launch | June 1, 2026 |
| Stripe billing live | June 14, 2026 |
| Custom domain support live | June 28, 2026 |
| 8 industry templates live | July 15, 2026 |
| Analytics dashboard live | July 15, 2026 |
| AI copy generation beta | August 15, 2026 |
| Mada / STC Pay live | August 31, 2026 |
| Agency white-label plan live | September 15, 2026 |
| All 13 industry templates live | September 30, 2026 |
