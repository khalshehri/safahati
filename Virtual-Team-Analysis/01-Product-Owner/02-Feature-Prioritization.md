# Feature Prioritization — MoSCoW Matrix
## Document Owner: Product Owner
## Version: 1.0 | April 2026

---

## Framework

We use the **MoSCoW method** to prioritize features across the Safahati platform. Prioritization is evaluated against three criteria:

1. **Revenue impact** — Does this feature block or enable paying customers?
2. **Core reliability** — Does the absence of this feature make the platform unusable or embarrassing?
3. **Competitive parity** — Is the absence of this feature a reason prospects choose a competitor?

Features are scoped against the current state of the platform (April 2026) and the 6-month window through Q3 2026.

---

## MoSCoW Definitions

| Category | Meaning |
|---|---|
| **Must Have** | Without this, the product cannot launch or generate revenue. Non-negotiable for Q2 2026. |
| **Should Have** | High value; should ship in Q2–Q3 2026. Absence weakens the product materially. |
| **Could Have** | Nice-to-have in 2026; ships if capacity exists without delaying Must/Should items. |
| **Won't Have** | Deliberately out of scope for 2026. Revisit in 2027 or when revenue justifies it. |

---

## Must Have (Launch Blockers)

### 1. Subdomain Routing

**Status:** Not yet deployed  
**Description:** Route `client.safahati.com` to the correct tenant config and render their site. This is the core of the multi-tenant architecture and is architecturally complete but not operationally deployed.

**Acceptance Criteria:**
- Nginx wildcard SSL terminates `*.safahati.com` successfully
- Cloudflare DNS wildcard A record routes all subdomains to VPS
- Next.js middleware reads `Host` header, resolves slug, fetches config from DB
- Non-existent subdomains return a styled 404 page (not an error)
- Response time: first contentful paint under 2 seconds from Riyadh on mobile 4G

**Dependencies:** Hetzner VPS, Cloudflare wildcard DNS, PostgreSQL production DB  
**Estimated effort:** 3 days (infra) + 2 days (routing middleware testing)  
**Risk:** Middleware.ts renamed to proxy.ts in Next.js 16 — must account for this breaking change

---

### 2. Core Reliability: Stale JWT / Session Bug Fix

**Status:** Identified, partially fixed  
**Description:** Stale JWT sessions cause HTTP 500 on site creation. This is a P0 defect — any customer who signs in, leaves, and returns encounters this error when trying to create a site.

**Acceptance Criteria:**
- Creating a site with any combination of fresh/expired token always succeeds or returns a clear, recoverable error
- Session refresh logic runs silently in the background without re-prompting login
- Error rate on `/api/sites` endpoint: 0 session-related 500s in production for 7 consecutive days

**Dependencies:** NextAuth.js v5 JWT configuration  
**Estimated effort:** 1–2 days

---

### 3. Site Creation & Publishing Flow

**Status:** Partially working  
**Description:** End-to-end flow: user signs up → selects industry → selects template → fills basic content → site publishes at subdomain. This is the core activation loop.

**Acceptance Criteria:**
- New user can complete full site creation in under 15 minutes with no support
- Site is accessible at `{slug}.safahati.com` within 60 seconds of publishing
- Admin dashboard shows live/draft status clearly
- Basic site config (name, industry, template, primary color, logo, contact info) is editable post-publish

**Dependencies:** Subdomain routing (above), bilingual content model  
**Estimated effort:** 1 week (depends on routing readiness)

---

### 4. Bilingual Content Model (AR + EN)

**Status:** Architecturally planned, not fully implemented  
**Description:** Every user-facing text field in every section config must support `{ ar: "...", en: "..." }` with language toggle on the rendered site. This is not a localization layer — it is a structural requirement.

**Acceptance Criteria:**
- All 31 component type configs support `LocalizedString` type (e.g., `{ ar: string, en: string }`)
- Admin dashboard renders Arabic fields with RTL text input
- Rendered site detects browser locale or user language preference and defaults accordingly
- Language switcher is available on every published site
- All 13 industry template default content files contain both Arabic and English copy

**Dependencies:** Zod schema updates, admin form updates, i18n rendering layer  
**Estimated effort:** 2 weeks (high scope; must be done once, correctly)

---

### 5. Mobile-Responsive Templates

**Status:** Tailwind CSS used but mobile QA not systematic  
**Description:** All published templates must be tested and verified on mobile viewport (360px, 390px, 428px) in both RTL and LTR modes. Given 85%+ MENA mobile traffic, this is a launch requirement, not a nice-to-have.

**Acceptance Criteria:**
- All 3 priority templates (Company, Freelancer, Clinic) pass mobile QA checklist in Chrome DevTools
- No horizontal overflow on any template on any screen width ≥ 360px
- CTA buttons are thumb-reachable (min 44px tap target)
- Navigation collapses into hamburger on mobile with functional open/close behavior
- Arabic RTL layout is validated separately from LTR on all breakpoints

**Dependencies:** Template build quality  
**Estimated effort:** 3 days per 3 templates = ~1 week

---

### 6. User Authentication (Email + Password)

**Status:** NextAuth.js v5 integrated  
**Description:** Secure sign-up, sign-in, sign-out, and password reset flows.

**Acceptance Criteria:**
- Email/password registration with email verification (OTP via Resend)
- Password reset flow functional
- Session persists correctly (JWT, not stale)
- Rate limiting on auth endpoints (no brute force risk)
- Auth forms fully bilingual (Arabic labels, RTL layout option)

**Dependencies:** Resend email integration  
**Estimated effort:** Already largely done; 1–2 days cleanup

---

## Should Have (Q2–Q3 2026)

### 7. Stripe Payment Integration (International)

**Priority:** Should Have (blocks revenue collection)  
**Description:** Accept credit/debit card payments for monthly subscriptions. Stripe is the fastest path to international payments; Mada/local will follow.

**Acceptance Criteria:**
- Users can subscribe to a paid plan (Starter, Professional, Agency) via Stripe Checkout
- Subscription status syncs to Safahati user record in DB
- Failed payments trigger email notification and grace period (7 days)
- Subscription cancellation disables premium features (not site visibility) gracefully
- Webhooks handle: payment succeeded, payment failed, subscription cancelled, trial ended

**Dependencies:** Stripe account, plan pricing finalized  
**Estimated effort:** 1 week

---

### 8. Custom Domain Support

**Priority:** Should Have  
**Description:** Allow clients to point their own domain (e.g., `www.myclinic.sa`) to their Safahati site. Required for most professional clients who already own a domain.

**Acceptance Criteria:**
- Admin dashboard provides clear DNS instructions (A record / CNAME)
- System provisions SSL certificate via Let's Encrypt for custom domains automatically
- Nginx config updates dynamically (or via a cert provisioning service like Caddy)
- Custom domain takes precedence over the default `.safahati.com` subdomain
- CNAME verification check before activation

**Dependencies:** Infra automation, SSL provisioning  
**Estimated effort:** 1–2 weeks

---

### 9. AI Copy Generation (Arabic + English)

**Priority:** Should Have (major differentiator)  
**Description:** During site creation and in the admin dashboard, users can generate section copy in Arabic and/or English by answering 3–5 questions about their business. Powered by Vercel AI SDK + Claude API.

**Acceptance Criteria:**
- Available in onboarding wizard (after template selection) and in section editor
- Prompts are industry-aware (clinic prompts differ from law firm prompts)
- Output quality in Arabic is reviewed and graded: must score ≥ 4/5 in native Arabic speaker review
- User can regenerate, edit, or reject AI output — it is never auto-published
- Usage metered by plan tier (e.g., 10 generations/month on Starter, unlimited on Pro)
- Integrated with Vercel AI SDK streaming for responsive UX

**Dependencies:** Claude API key, Vercel AI SDK, Arabic prompt engineering  
**Estimated effort:** 2 weeks

---

### 10. Mada / STC Pay Integration (Saudi Local Payments)

**Priority:** Should Have (critical for Saudi market)  
**Description:** Accept Mada debit cards and STC Pay via Moyasar or HyperPay payment gateway (both support Saudi acquiring). This unlocks the majority of Saudi SME customers who do not have international credit cards.

**Acceptance Criteria:**
- Moyasar (or HyperPay) integrated as payment gateway alongside Stripe
- SAR-denominated checkout flow
- ZATCA-compliant VAT invoice generated and emailed on every payment
- Mada and STC Pay clearly shown as payment options in checkout UI
- Test mode passes all Saudi test card numbers

**Dependencies:** Moyasar/HyperPay merchant account (requires Saudi CR for some gateways), ZATCA API access  
**Estimated effort:** 2 weeks

---

### 11. Analytics Dashboard (Basic)

**Priority:** Should Have  
**Description:** Site owners need to see visitor stats: page views, unique visitors, traffic sources, top pages, device breakdown. This is a retention feature — sites without analytics feel "dead."

**Acceptance Criteria:**
- Lightweight, privacy-respecting analytics (Plausible or PostHog CE deployed on VPS)
- Analytics dashboard accessible from admin UI
- Data shown per site (not global)
- 30-day rolling window by default
- Arabic UI labels in dashboard

**Dependencies:** Plausible/PostHog self-hosted instance on Hetzner VPS  
**Estimated effort:** 1 week (integration) + infrastructure setup

---

### 12. 5 Priority Industry Templates (Fully Bilingual)

**Priority:** Should Have  
**Description:** Company, Freelancer, Clinic, Restaurant, Real Estate — each with multiple section templates, full bilingual default content, and mobile-verified layouts.

**Acceptance Criteria:**
- Each industry has ≥ 3 complete section combinations (home + about + contact minimum)
- Default content in both Arabic and English, culturally appropriate
- All templates pass mobile QA (see #5)
- Hero section, about section, services section, contact section for each industry
- SEO metadata (title, description) pre-populated in Arabic and English

**Estimated effort:** 2–3 days per industry template = 2 weeks total

---

## Could Have (Q3 2026 if capacity allows)

### 13. White-Label / Agency Mode

**Description:** Agency clients can remove Safahati branding, use their own logo in the admin, and present sites to their own clients under their agency brand.

**Rationale:** High-value feature for agency reseller plan (SAR 999–1,499/month), but adds UI complexity and needs a solid reseller pricing model first.  
**Estimated effort:** 1–2 weeks

---

### 14. Google OAuth Login

**Description:** Allow sign-in via Google account in addition to email/password.

**Rationale:** Reduces signup friction; NextAuth.js v5 already supports it. Low effort, medium uplift.  
**Estimated effort:** 2–3 days

---

### 15. Basic SEO Tools

**Description:** Editable meta title, meta description, OG image, sitemap generation, robots.txt customization per site.

**Rationale:** SEO is a conversion argument for SMEs ("your site will be findable on Google"). Not complex to build but must be bilingual.  
**Estimated effort:** 1 week

---

### 16. Image Optimization & CDN Delivery

**Description:** Client-uploaded images served via MinIO + Cloudflare CDN with automatic WebP conversion and responsive srcset generation.

**Rationale:** Directly impacts Core Web Vitals (LCP). Should be standard but requires MinIO + image pipeline setup.  
**Estimated effort:** 1 week

---

### 17. Blogging / News Section Component

**Description:** A CMS-lite blog section where site owners can publish posts. Supports Arabic-first authoring with rich text editor.

**Rationale:** High request from SME segment (restaurants, clinics want news/announcements). Adds sticky engagement to admin product.  
**Estimated effort:** 2 weeks

---

### 18. Social Media Integration

**Description:** Auto-display Instagram feed, Twitter/X feed, or Snapchat profile link on published sites.

**Rationale:** Social proof is important in Saudi market; Instagram embeds are visually compelling for restaurants and photographers.  
**Estimated effort:** 1 week

---

### 19. Contact Form with Email Notifications

**Description:** Embedded contact form on published site that emails leads to the site owner via Resend.

**Rationale:** Critical for lead generation clients (clinics, law firms, consultants). Resend is already in the stack.  
**Estimated effort:** 3 days

---

### 20. Site Performance Score / Audit View

**Description:** In-admin Lighthouse-style score showing LCP, FID, CLS for the client's site, with suggestions.

**Rationale:** Differentiator and retention tool. Clients who see their score want to improve it (drives upsell to Pro plan).  
**Estimated effort:** 2 weeks

---

## Won't Have (2026 — Revisit 2027)

### 21. Drag-and-Drop Visual Editor

**Rationale:** Fundamentally incompatible with the config-driven architecture. Building a visual editor would require 6+ months of engineering and would make the codebase significantly more complex. This is a deliberate architectural choice, not an oversight. Form-based admin is the product.

---

### 22. E-commerce / Cart / Checkout

**Rationale:** Safahati is a website presence platform, not a commerce platform. Zid and Salla already own Saudi e-commerce. We integrate with them (link to store), not compete.

---

### 23. Native Mobile App (iOS / Android) for Site Admin

**Rationale:** PWA-quality mobile admin is sufficient for 2026. Native apps require separate development capacity.

---

### 24. API Access for External Integrations

**Rationale:** B2B API access is relevant only after a significant agency/developer segment forms around the platform. Premature for 2026; risks support burden with no revenue return.

---

### 25. Multi-User / Team Access per Site

**Rationale:** Single-owner model is sufficient for the SME segment in 2026. Team access adds permission complexity to the admin. Revisit when agency clients request collaborative editing.

---

### 26. Version History / Site Rollback

**Rationale:** Config JSONB could support versioning, but operational complexity of rollback UX is high. Not a pain point until clients start making breaking changes.

---

## Prioritization Summary Table

| Feature | MoSCoW | Estimated Effort | Target Quarter |
|---|---|---|---|
| Subdomain routing | Must | 5 days | Q2 2026 |
| JWT/session bug fix | Must | 2 days | Q2 2026 |
| Site creation & publishing flow | Must | 1 week | Q2 2026 |
| Bilingual content model (AR+EN) | Must | 2 weeks | Q2 2026 |
| Mobile-responsive templates | Must | 1 week | Q2 2026 |
| User authentication (email) | Must | 2 days | Q2 2026 |
| Stripe payment integration | Should | 1 week | Q2 2026 |
| Custom domain support | Should | 2 weeks | Q3 2026 |
| AI copy generation (AR+EN) | Should | 2 weeks | Q3 2026 |
| Mada / STC Pay integration | Should | 2 weeks | Q3 2026 |
| Analytics dashboard | Should | 1 week | Q3 2026 |
| 5 priority industry templates | Should | 2 weeks | Q2–Q3 2026 |
| White-label agency mode | Could | 2 weeks | Q3 2026 |
| Google OAuth | Could | 3 days | Q3 2026 |
| Basic SEO tools | Could | 1 week | Q3 2026 |
| Image optimization / CDN | Could | 1 week | Q3 2026 |
| Blog / news section | Could | 2 weeks | Q3 2026 |
| Social media integration | Could | 1 week | Q3 2026 |
| Contact form + email | Could | 3 days | Q2 2026 |
| Site performance audit | Could | 2 weeks | Q4 2026 |
| Drag-and-drop editor | Won't | N/A | Out of scope |
| E-commerce / cart | Won't | N/A | Out of scope |
| Native mobile app | Won't | N/A | 2027+ |
| API access | Won't | N/A | 2027+ |
| Multi-user / team access | Won't | N/A | 2027+ |
| Version history / rollback | Won't | N/A | 2027+ |
