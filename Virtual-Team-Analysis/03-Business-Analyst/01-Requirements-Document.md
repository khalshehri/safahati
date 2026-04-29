# Functional Requirements Document
## Safahati Platform — Version 1.0
### Status: Living Document | Last Updated: April 2026

---

## Document Purpose

This document captures all functional and non-functional requirements for the Safahati platform. Requirements are drawn from the current working codebase, known gaps, stakeholder expectations, and MENA market context. Each requirement has a unique ID, description, priority classification (MoSCoW), and testable acceptance criteria.

**Requirement ID Format:** `[Category]-[Number]`
- `AUTH` — Authentication & Authorization
- `SITE` — Site Management
- `EDIT` — Site Editor & Content
- `PUB` — Publishing & Subdomain Routing
- `SUB` — Subscriptions & Billing
- `AI` — AI Content Generation
- `NOTIF` — Notifications
- `SUPPORT` — Support System
- `NFR` — Non-Functional Requirements

**Priority Legend:**
- **M** — Must Have (launch blocker)
- **S** — Should Have (important, not blocking)
- **C** — Could Have (nice to have)
- **W** — Won't Have (out of scope for v1)

---

## Part 1: Current Working Features

### AUTH — Authentication & Authorization

---

**AUTH-01: User Registration with Email**
- **Priority:** M
- **Description:** A new user can register on Safahati using their email address and a password.
- **Current Status:** Implemented
- **Acceptance Criteria:**
  - User submits name, email, and password on the registration form
  - Password is hashed using bcrypt before storage (never stored in plaintext)
  - A unique user record is created in the `users` table
  - User receives a success response and is redirected to the dashboard
  - Duplicate email registration returns a clear error message in both Arabic and English
  - Minimum password length is 8 characters; validation error shown inline

---

**AUTH-02: User Login with Email/Password**
- **Priority:** M
- **Description:** A registered user can log in with their email and password to access the dashboard.
- **Current Status:** Implemented
- **Acceptance Criteria:**
  - User submits email and password on the login form
  - Invalid credentials return a generic error (do not specify which field is wrong)
  - Successful login creates a JWT session via NextAuth.js v5
  - User is redirected to the dashboard after login
  - Session persists across page refreshes without re-authentication
  - JWT contains: user ID, email, and name

---

**AUTH-03: JWT Session Integrity**
- **Priority:** M
- **Description:** The JWT session must always reflect the current state of the user record in the database.
- **Current Status:** Fixed (stale session bug resolved)
- **Acceptance Criteria:**
  - After a password reset or user record change, the old JWT is invalidated or refreshed on next request
  - User ID in the JWT must match an existing record in the `users` table
  - If the user record is deleted, the session is immediately invalidated
  - No user can access another user's sites via a stale session

---

**AUTH-04: Protected Dashboard Routes**
- **Priority:** M
- **Description:** All dashboard routes require an authenticated session.
- **Current Status:** Implemented
- **Acceptance Criteria:**
  - Unauthenticated users accessing `/dashboard/*` are redirected to `/login`
  - Authenticated users accessing `/login` or `/register` are redirected to `/dashboard`
  - Session checks occur server-side (not client-side only) to prevent flash of unauthorized content

---

### SITE — Site Management

---

**SITE-01: Create New Site — Step 1 (Name + Language)**
- **Priority:** M
- **Description:** An authenticated user can initiate site creation by entering a site name and selecting a primary language.
- **Current Status:** Implemented
- **Acceptance Criteria:**
  - Form fields: site name (text), primary language (Arabic / English radio or select)
  - Site name is required; minimum 2 characters, maximum 60 characters
  - Site name is used to suggest a URL slug (auto-generated, URL-safe, lowercase)
  - Slug uniqueness is validated in real time (debounced API check)
  - Duplicate slug suggestion is auto-incremented (e.g., `layla-design-2`)
  - Selected language is stored in the `sites.language` column and propagates to default template language
  - User cannot proceed to step 2 without completing step 1

---

**SITE-02: Create New Site — Step 2 (Industry Picker)**
- **Priority:** M
- **Description:** After entering name and language, the user selects an industry template from the 13 available templates.
- **Current Status:** Implemented
- **Acceptance Criteria:**
  - 13 industry options displayed with icon, name (bilingual), and brief description
  - Industries: Company, Agency, Freelancer, Resume, Restaurant, Clinic, Real Estate, SaaS, E-commerce, Event, Photography, Law Firm, Gym
  - Selecting an industry creates a site record and pre-populates sections with the default blocks for that industry
  - Site is created with `status = 'draft'`
  - User is redirected to the site editor upon successful creation
  - Industry choice is stored in `sites.industry` column

---

**SITE-03: Dashboard Site List**
- **Priority:** M
- **Description:** The dashboard shows a list of all sites belonging to the authenticated user.
- **Current Status:** Implemented
- **Acceptance Criteria:**
  - Each site card shows: site name, slug (URL preview), industry, status badge (draft/published), and last updated date
  - Empty state shown with a CTA to create a new site when no sites exist
  - Sites sorted by `updated_at` descending (most recently modified first)
  - Site cards link to the editor for draft sites and include a "View Live" link for published sites

---

**SITE-04: Site Status Management**
- **Priority:** M
- **Description:** Each site has a status of `draft` or `published`. Only the owner can change this.
- **Current Status:** Implemented (basic)
- **Acceptance Criteria:**
  - Site is created as `draft` by default
  - Owner can toggle site status from the editor or dashboard
  - Published sites are accessible at `[slug].safahati.com`
  - Draft sites return 404 or a "coming soon" page when accessed via subdomain
  - Status change is recorded with a timestamp in `sites.updated_at`

---

### EDIT — Site Editor & Content

---

**EDIT-01: Section List View**
- **Priority:** M
- **Description:** The editor shows a list of all sections in the site, in order, with the ability to navigate to each section's config.
- **Current Status:** Implemented (basic)
- **Acceptance Criteria:**
  - Sections listed in `sort_order` sequence
  - Each section shows: block type label, template ID, and visibility toggle
  - Sections can be reordered via drag-and-drop or up/down arrows
  - Sort order changes are saved immediately or via an explicit "Save" action

---

**EDIT-02: Section Visibility Toggle**
- **Priority:** M
- **Description:** Each section can be shown or hidden on the published site without deleting it.
- **Current Status:** Implemented
- **Acceptance Criteria:**
  - Toggle switch on each section in the editor
  - Hidden sections (`is_visible = false`) are not rendered on the published site
  - Hidden sections remain fully editable in the admin
  - Visibility state is reflected immediately in the editor UI

---

**EDIT-03: Template Selection Per Section**
- **Priority:** M
- **Description:** For each section, the user can switch between available templates for that block type.
- **Current Status:** Implemented (basic)
- **Acceptance Criteria:**
  - Template picker shows all templates registered for the current block type
  - Templates are shown with a visual preview thumbnail where available
  - Switching templates preserves compatible config fields; incompatible fields are reset to defaults
  - Template change is confirmed before saving to prevent accidental data loss

---

**EDIT-04: Config Form — Bilingual Fields**
- **Priority:** M
- **Description:** Every text content field in a section config has separate inputs for Arabic and English.
- **Current Status:** Implemented (partially — some fields missing Arabic)
- **Acceptance Criteria:**
  - Text fields that appear on the published site always have a paired Arabic/English input
  - Arabic input uses an RTL-aware text field (text-align: right, dir="rtl")
  - English input uses a standard LTR text field
  - Fields are clearly labeled (e.g., "Title (Arabic)" / "Title (English)")
  - Neither field is mandatory for saving, but a warning is shown if a field is left empty in one language

---

---

## Part 2: Missing Features (Gaps)

### PUB — Publishing & Subdomain Routing

---

**PUB-01: Live Subdomain Routing**
- **Priority:** M
- **Description:** When a site is published, it must be accessible at `[slug].safahati.com` via wildcard subdomain routing.
- **Current Status:** NOT IMPLEMENTED
- **Gap Impact:** Sites cannot go live. Platform cannot be used by real clients.
- **Acceptance Criteria:**
  - Nginx wildcard SSL certificate covers `*.safahati.com`
  - Next.js middleware reads the subdomain from the request host header
  - Middleware looks up the site by slug in the database
  - If a published site matches, it renders the site renderer at `/(site)/[slug]`
  - If no site matches, a branded 404 page is served
  - Subdomain routing works for both Arabic and English language sites
  - Response includes correct `lang` and `dir` HTML attributes based on site language

---

**PUB-02: Site Renderer — Config-to-UI**
- **Priority:** M
- **Description:** The published site renderer reads the site's sections from the database and renders the correct templates with the correct config.
- **Current Status:** Partially implemented (renderer exists, not connected to live routing)
- **Acceptance Criteria:**
  - Renderer fetches site config by slug, including all visible sections in sort order
  - For each section, the registry resolves the block type and template ID to a React component
  - Config JSONB is passed as props to the component
  - Renderer uses the site's `language` setting to pass the correct language-variant props
  - Site renders with correct RTL/LTR layout based on language
  - Page `<title>` and `<meta>` tags are populated from site config
  - Renderer is a React Server Component for optimal performance (no client-side fetch for initial render)

---

**PUB-03: Custom Domain Support**
- **Priority:** S
- **Description:** Site owners can point a custom domain (e.g., `www.layladesign.com`) to their Safahati site.
- **Current Status:** NOT IMPLEMENTED
- **Acceptance Criteria:**
  - Owner enters a custom domain in site settings
  - System generates DNS instructions (CNAME to `safahati.com`, or A record to server IP)
  - System verifies DNS propagation via a background job
  - Once verified, Nginx is updated (or Cloudflare API is called) to route the custom domain to the correct site
  - SSL certificate is provisioned for the custom domain via Let's Encrypt or Cloudflare
  - Custom domain status is shown in the dashboard (pending / verified / error)

---

**PUB-04: SEO Metadata Per Site**
- **Priority:** S
- **Description:** Each published site has configurable SEO metadata: page title, meta description, and OG image.
- **Current Status:** NOT IMPLEMENTED
- **Acceptance Criteria:**
  - Site config includes `seo.title`, `seo.description`, `seo.og_image` fields (bilingual)
  - These are rendered in `<head>` on all pages of the published site
  - OG image can be uploaded via MinIO storage
  - Meta description max 160 characters; warning shown if exceeded
  - Canonical URL is set to the primary domain (custom domain if set, otherwise subdomain)

---

### SUB — Subscriptions & Billing

---

**SUB-01: Subscription Plans**
- **Priority:** M
- **Description:** Safahati offers tiered subscription plans that gate platform features.
- **Current Status:** NOT IMPLEMENTED
- **Proposed Plans:**
  - **Starter (Free):** 1 site, 3 sections max, no custom domain, Safahati branding visible
  - **Pro (SAR 99/month):** 3 sites, all sections, custom domain, branding removed
  - **Business (SAR 249/month):** 10 sites, all features, priority support, AI content generation
- **Acceptance Criteria:**
  - Plans are defined in the database and in Stripe products
  - A user's current plan is readable from their session/profile
  - Feature gates check the user's plan before allowing actions (e.g., "Add Site" is disabled on Starter if 1 site exists)
  - Gate violations show a clear upgrade prompt in both Arabic and English

---

**SUB-02: Stripe Checkout Integration**
- **Priority:** M
- **Description:** Users can upgrade their plan via a Stripe-hosted checkout session.
- **Current Status:** NOT IMPLEMENTED
- **Acceptance Criteria:**
  - "Upgrade" button creates a Stripe checkout session via the server API
  - Checkout session is pre-filled with the user's email
  - SAR (Saudi Riyal) is the default currency
  - On successful payment, a Stripe webhook updates the user's subscription in the database
  - User is redirected to the dashboard with a success notification
  - Subscription start date and next billing date are stored

---

**SUB-03: Subscription Webhook Handling**
- **Priority:** M
- **Description:** Stripe webhook events update the platform's subscription state reliably.
- **Current Status:** NOT IMPLEMENTED
- **Acceptance Criteria:**
  - `/api/stripe/webhook` endpoint validates Stripe signature before processing
  - Events handled: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
  - Failed payment triggers a grace period (7 days) before downgrading to Starter
  - Subscription deletion downgrades the user to Starter immediately
  - All webhook events are logged to a `billing_events` table for audit

---

**SUB-04: Billing Portal**
- **Priority:** S
- **Description:** Users can manage their subscription (upgrade, cancel, update payment method) from the dashboard.
- **Current Status:** NOT IMPLEMENTED
- **Acceptance Criteria:**
  - "Manage Billing" button redirects to a Stripe Customer Portal session
  - Billing page in the dashboard shows: current plan, next billing date, payment method last 4 digits, and invoice history
  - Cancellation takes effect at the end of the current billing period (not immediately)
  - Invoice PDFs are accessible via the Stripe Customer Portal

---

**SUB-05: VAT Compliance**
- **Priority:** S
- **Description:** Saudi VAT (15%) must be applied to all subscription payments and shown on invoices.
- **Current Status:** NOT IMPLEMENTED
- **Acceptance Criteria:**
  - Stripe Tax or manual tax rate applied to all SAR transactions
  - Invoice PDF shows: subtotal, VAT (15%), and total in SAR
  - User can enter their Saudi VAT number (رقم ضريبي) during checkout for B2B invoicing
  - All prices displayed in the UI show "VAT exclusive" and "VAT inclusive" amounts

---

### AI — AI Content Generation

---

**AI-01: Section Content Generation**
- **Priority:** S
- **Description:** Users can generate content for a section using AI (Claude API), based on their site's industry and language.
- **Current Status:** NOT IMPLEMENTED
- **Acceptance Criteria:**
  - "Generate with AI" button appears in each section's config form
  - User is prompted to enter a brief description of their business (1-3 sentences)
  - AI generates content for all text fields in the section (headline, subheadline, body, CTA label, etc.)
  - Generated content is returned in the correct language (Arabic or English, based on site language)
  - Content is shown in a preview state; user must explicitly click "Apply" to save it
  - Generation costs are tracked per user; monthly budget cap per plan tier
  - Business (plan tier) users only — not available on Starter or Pro

---

**AI-02: Full Site Content Generation**
- **Priority:** C
- **Description:** Users can generate content for all sections of a new site in one step, immediately after selecting an industry template.
- **Current Status:** NOT IMPLEMENTED
- **Acceptance Criteria:**
  - Offered as an optional step after industry selection during site creation
  - User enters: business name, a 2-3 sentence description, and optionally a tagline
  - AI populates all section configs for the site
  - User can review each section individually before publishing
  - Counts toward the user's monthly AI generation quota

---

### NOTIF — Notifications

---

**NOTIF-01: Transactional Email — Welcome**
- **Priority:** M
- **Description:** New users receive a welcome email after successful registration.
- **Current Status:** NOT IMPLEMENTED
- **Acceptance Criteria:**
  - Email sent via Resend within 60 seconds of registration
  - Email is in the user's preferred language (Arabic or English, defaulting to Arabic)
  - Email contains: personalized greeting, link to the dashboard, and a brief "how to get started" guide
  - Email uses the Safahati brand template (logo, colors)

---

**NOTIF-02: Transactional Email — Payment Confirmation**
- **Priority:** M
- **Description:** Users receive an email when a subscription payment is processed.
- **Current Status:** NOT IMPLEMENTED
- **Acceptance Criteria:**
  - Email sent within 5 minutes of a successful Stripe payment
  - Email contains: plan name, amount charged (SAR), billing period, and link to invoice PDF
  - Bilingual email with Arabic and English content side-by-side

---

**NOTIF-03: Email — Failed Payment Warning**
- **Priority:** M
- **Description:** Users are notified when a payment fails, with clear instructions to update their payment method.
- **Current Status:** NOT IMPLEMENTED
- **Acceptance Criteria:**
  - Email sent immediately on first payment failure
  - Email includes: amount due, instructions to update payment method, and a direct link to the billing portal
  - Reminder emails sent on day 3 and day 6 of the grace period
  - Final warning email sent 24 hours before downgrade to Starter

---

### SUPPORT — Support System

---

**SUPPORT-01: In-App Support Ticket Submission**
- **Priority:** S
- **Description:** Users can submit support tickets from within the dashboard.
- **Current Status:** NOT IMPLEMENTED
- **Acceptance Criteria:**
  - "Help / Support" link visible in the dashboard navigation
  - Support form fields: subject, message, category (Technical / Billing / General), and optional screenshot attachment
  - Submitted tickets are emailed to the support inbox and stored in a `support_tickets` table
  - User receives an auto-acknowledgment email with a ticket ID
  - Ticket status (open / in progress / resolved) is viewable from the dashboard

---

**SUPPORT-02: FAQ / Knowledge Base**
- **Priority:** C
- **Description:** A searchable FAQ page covers common questions in both Arabic and English.
- **Current Status:** NOT IMPLEMENTED
- **Acceptance Criteria:**
  - FAQ accessible at `app.safahati.com/help`
  - Questions and answers stored in both Arabic and English
  - Search functionality filters questions by keyword
  - FAQ is publicly accessible (no login required)

---

### ONBOARDING — Guided Onboarding

---

**ONBOARD-01: Post-Registration Onboarding Flow**
- **Priority:** S
- **Description:** After registration, new users are guided through a lightweight onboarding sequence before reaching the dashboard.
- **Current Status:** NOT IMPLEMENTED
- **Acceptance Criteria:**
  - Onboarding consists of 3-4 steps: (1) language preference, (2) industry, (3) create first site
  - Progress bar shows current step
  - Users can skip onboarding and go directly to the dashboard
  - Onboarding completion is tracked in the user's profile (boolean flag)
  - Users who skip onboarding see a dismissable prompt on the dashboard for 7 days

---

**ONBOARD-02: Contextual Tooltips in Editor**
- **Priority:** C
- **Description:** First-time users see tooltips that explain the editor's key actions.
- **Current Status:** NOT IMPLEMENTED
- **Acceptance Criteria:**
  - Tooltips appear on first editor visit (not on subsequent visits)
  - Tooltips highlight: section list, visibility toggle, template switcher, publish button
  - Tooltips are dismissable individually or all at once
  - Tooltip content is bilingual

---

---

## Part 3: Non-Functional Requirements

---

**NFR-01: Performance — Time to First Byte (TTFB)**
- **Priority:** M
- **Description:** Published sites must load fast enough for SEO and user experience.
- **Target:** TTFB < 300ms for cached pages; < 800ms for uncached pages
- **Measurement:** Lighthouse, WebPageTest from Riyadh node
- **Acceptance Criteria:**
  - Redis caches rendered site configs with a TTL of 5 minutes
  - Cache invalidation triggered on section update or publish action
  - Static assets (images, fonts) served via CDN (Cloudflare)
  - Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms

---

**NFR-02: Security — Data Isolation Between Tenants**
- **Priority:** M
- **Description:** No user can read, write, or infer data belonging to another tenant.
- **Acceptance Criteria:**
  - Every database query for site or section data includes a `WHERE user_id = ?` clause
  - API routes validate ownership before returning or mutating data
  - No site slug enumeration is possible (published-only sites return 200; all others return 404 — not 403)
  - Drizzle ORM prepared statements used to prevent SQL injection
  - Environment variables: JWT secret, database URL, Stripe keys stored in `.env.local` and never committed

---

**NFR-03: Security — Authentication**
- **Priority:** M
- **Description:** Authentication must be resistant to common attacks.
- **Acceptance Criteria:**
  - Passwords hashed with bcrypt (cost factor ≥ 12)
  - Rate limiting on `/api/auth/login` (10 attempts per IP per 15 minutes)
  - CSRF protection enabled via NextAuth.js
  - `HttpOnly` and `Secure` flags on session cookies
  - No JWT tokens stored in `localStorage`

---

**NFR-04: Bilingual Support — RTL Rendering**
- **Priority:** M
- **Description:** All Arabic content on published sites and in the admin renders correctly in RTL layout.
- **Acceptance Criteria:**
  - `<html dir="rtl" lang="ar">` set for Arabic pages
  - `<html dir="ltr" lang="en">` set for English pages
  - Tailwind CSS RTL plugin (or logical properties) used for all margin/padding directionality
  - Navigation menus, breadcrumbs, and icon positions mirror correctly between RTL and LTR
  - Arabic text uses an appropriate web font (Tajawal or Cairo) loaded via `next/font`
  - No Arabic text renders as boxes (tofu) — all required Unicode ranges are loaded

---

**NFR-05: Accessibility — WCAG 2.1 AA**
- **Priority:** S
- **Description:** Published sites and the admin dashboard must meet WCAG 2.1 AA accessibility standards.
- **Acceptance Criteria:**
  - All images have descriptive `alt` text (or `alt=""` for decorative images)
  - Color contrast ratio ≥ 4.5:1 for normal text; ≥ 3:1 for large text
  - All form inputs have associated `<label>` elements
  - Keyboard navigation works for all interactive elements (tab order, focus visible)
  - Error messages are announced to screen readers (ARIA live regions)
  - Site passes axe-core automated scan with zero critical violations

---

**NFR-06: Uptime and Availability**
- **Priority:** M
- **Description:** The platform must maintain high availability for both the admin and published sites.
- **Target:** 99.5% monthly uptime (≤ 3.6 hours downtime/month)
- **Acceptance Criteria:**
  - Docker Compose with restart policies (`unless-stopped`) on all services
  - Database backups automated daily via pg_dump to MinIO
  - Health check endpoint at `/api/health` returns 200 within 1 second
  - Uptime monitoring via an external service (UptimeRobot or Betterstack) alerting on Slack/email within 2 minutes of downtime

---

**NFR-07: Mobile Responsiveness**
- **Priority:** M
- **Description:** All published site templates and the admin dashboard must be fully functional on mobile devices.
- **Acceptance Criteria:**
  - All 31 component types render correctly on viewports from 375px (iPhone SE) to 1440px (desktop)
  - Touch targets are at minimum 44×44px
  - No horizontal overflow on any screen size
  - Admin dashboard is fully usable on a tablet (≥ 768px)
  - Published sites pass Google's Mobile-Friendly Test

---

**NFR-08: Internationalization (i18n) Architecture**
- **Priority:** M
- **Description:** The platform's i18n system must support adding new languages in the future without major refactoring.
- **Acceptance Criteria:**
  - All UI strings are stored in locale files (e.g., `en.json`, `ar.json`) — no hardcoded English strings in components
  - next-intl or equivalent is used for locale routing in the admin
  - Adding a new language requires only adding a locale file and a DB enum value
  - Language detection: admin defaults to browser language; published site defaults to site config language

---

**NFR-09: Data Backup and Recovery**
- **Priority:** M
- **Description:** Platform data must be recoverable in the event of hardware failure or data corruption.
- **Acceptance Criteria:**
  - Automated daily pg_dump backup stored in MinIO, retained for 30 days
  - Backup restoration procedure documented and tested quarterly
  - MinIO data stored on a separate volume from the application
  - Point-in-time recovery (PITR) via PostgreSQL WAL archiving (future enhancement)

---

**NFR-10: PDPL Compliance (Saudi Data Protection)**
- **Priority:** S
- **Description:** Platform must comply with Saudi Arabia's Personal Data Protection Law.
- **Acceptance Criteria:**
  - Privacy Policy published in Arabic and English
  - Users can request export of their personal data (account + site configs)
  - Users can request account deletion, which removes all personal data and associated sites
  - Data collection is limited to what is necessary for the service
  - Third-party data processors (Stripe, Resend, Cloudflare) are listed in the Privacy Policy
