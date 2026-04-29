# Process Flow Diagrams
## Safahati Platform — Core User and System Flows
### Version 1.0 | April 2026

---

## Document Purpose

This document defines the end-to-end process flows for the Safahati platform's key operations. Flows are described in structured text with decision trees, actor labels, and system actions. Each flow covers the "happy path" and the key alternative/error paths.

**Actor Legend:**
- **USER** — authenticated platform user (site owner)
- **BROWSER** — user's browser/client-side
- **APP** — Next.js application server
- **DB** — PostgreSQL database (via Drizzle ORM)
- **CACHE** — Redis cache
- **EMAIL** — Resend email service
- **STRIPE** — Stripe payment service
- **AI** — Claude API (Anthropic)
- **STORAGE** — MinIO object storage

---

## Flow 1: New User Registration and First Site Creation

### Scope
Covers the full journey from a new visitor arriving on the registration page to their first published (or at least created) site, including all validation, error, and success paths.

---

### Step-by-Step Flow

```
[REGISTRATION]
──────────────────────────────────────────────────────────

1. USER visits app.safahati.com/register

2. BROWSER renders registration form:
   Fields: name, email, password, confirm password

3. USER submits form

4. BROWSER validates client-side:
   ├── All fields present? → No → Show inline validation errors → END (re-try)
   ├── Email format valid? → No → Show "Invalid email format" → END (re-try)
   ├── Password ≥ 8 chars? → No → Show password requirement → END (re-try)
   └── Passwords match? → No → Show "Passwords do not match" → END (re-try)
   → All valid → Submit to APP

5. APP receives POST /api/auth/register
   ├── Rate limit check (10 attempts per IP per hour)
   │   └── Exceeded? → Return 429 Too Many Requests → END
   ├── DB: Check if email already exists in users table
   │   └── Exists? → Return "Email already registered" error → END (user tries login)
   ├── Hash password with bcrypt (cost factor 12)
   ├── DB: INSERT into users (name, email, password_hash, created_at)
   ├── Create NextAuth session (JWT with user.id, user.email, user.name)
   └── EMAIL: Enqueue welcome email (async, non-blocking)

6. APP returns 201 Created + session cookie

7. BROWSER redirects to /dashboard

[DASHBOARD — FIRST VISIT]
──────────────────────────────────────────────────────────

8. APP renders dashboard
   ├── DB: Fetch sites WHERE user_id = current_user (returns empty array)
   └── Render empty-state UI with "Create Your First Site" CTA

9. USER clicks "Create New Site"

10. BROWSER navigates to /dashboard/new (Step 1)

[SITE CREATION — STEP 1]
──────────────────────────────────────────────────────────

11. USER fills in:
    ├── Site name (e.g., "Layla Designs")
    └── Primary language (Arabic / English)

12. BROWSER auto-generates slug from site name:
    "Layla Designs" → "layla-designs"

13. BROWSER debounces slug input → sends GET /api/sites/check-slug?slug=layla-designs
    ├── APP: DB query: SELECT COUNT(*) FROM sites WHERE slug = 'layla-designs'
    ├── Slug taken? → Return conflict → BROWSER shows "Already taken, try: layla-designs-2"
    └── Slug available? → BROWSER shows green checkmark

14. USER clicks "Next" → Step 1 data stored in component state (not DB yet)

[SITE CREATION — STEP 2]
──────────────────────────────────────────────────────────

15. BROWSER renders industry picker
    13 industries displayed as cards (icon + bilingual name + description)

16. USER selects an industry (e.g., "Freelancer")

17. USER clicks "Create Site"

18. BROWSER sends POST /api/sites
    Body: { name, slug, language, industry }

19. APP validates:
    ├── User is authenticated? → No → 401 Unauthorized → redirect to /login
    ├── Plan allows creating another site? (Starter = max 1 site)
    │   └── Limit reached? → Return plan upgrade prompt → END
    ├── Re-validate slug uniqueness
    └── Slug conflict? → Return error → BROWSER shows conflict message

20. APP executes DB transaction:
    ├── INSERT into sites (user_id, name, slug, industry, language, status='draft', theme={default})
    ├── Fetch default section config for selected industry from industry-templates.ts
    └── INSERT into sections (site_id, block_type, template_id, config, sort_order, is_visible=true)
        for each default section in the industry template

21. DB returns new site_id

22. APP returns 201 Created { siteId }

23. BROWSER redirects to /dashboard/sites/[siteId]/edit

[EDITOR — FIRST LOAD]
──────────────────────────────────────────────────────────

24. APP fetches site + all sections from DB
    ├── Verify site belongs to current user (ownership check)
    └── Returns site config + ordered sections list

25. BROWSER renders editor:
    ├── Left panel: section list (in sort_order)
    ├── Center: preview iframe or component preview
    └── Top: site name, language badge, "Publish" button (disabled until content added)

26. [ONBOARDING TOOLTIPS — if first site]
    BROWSER checks: user.first_site_created = false?
    └── Show contextual tooltip sequence highlighting: section list, visibility toggle, template picker, publish button

27. Flow continues into content editing (see Edit → Publish flows)
```

### Error Paths Summary

| Step | Error Condition | System Response | User Action |
|---|---|---|---|
| 5 | Email already registered | "An account with this email exists. Login instead?" | Redirected to login |
| 5 | Rate limit exceeded | "Too many attempts. Try again in 15 minutes." | Wait |
| 13 | Slug conflict | Auto-suggest available slug | User accepts or modifies |
| 19 | Plan site limit | Show upgrade modal | Upgrade or cancel |
| 19 | Invalid input | Field-level validation error | Correct input |
| 20 | DB transaction failure | "Something went wrong. Please try again." | Retry |

---

## Flow 2: Site Publishing Flow

### Scope
Covers the process from a user clicking "Publish" to the site being live and accessible at its subdomain. Includes cache invalidation, DNS, and visibility checks.

---

```
[PRE-PUBLISH VALIDATION]
──────────────────────────────────────────────────────────

1. USER is in the site editor with at least 1 visible section
   └── "Publish" button is enabled

2. USER clicks "Publish"

3. BROWSER renders confirmation modal:
   "Your site will be live at layla-designs.safahati.com
   Make sure all your content is ready. Publish now?"
   [Cancel] [Publish]

4. USER confirms → BROWSER sends PATCH /api/sites/[siteId]
   Body: { status: 'published' }

[SERVER-SIDE PUBLISH LOGIC]
──────────────────────────────────────────────────────────

5. APP validates:
   ├── User is authenticated?  → No → 401
   ├── Site belongs to user?   → No → 403 Forbidden
   ├── Site has ≥ 1 visible section? → No → Return "Add at least one visible section"
   └── User's plan allows publishing? → No → Return upgrade prompt

6. APP: DB UPDATE sites SET status='published', updated_at=NOW() WHERE id=[siteId]

7. APP: CACHE invalidate all keys related to this site:
   ├── DELETE cache:site:[slug]
   └── DELETE cache:site:[siteId]:sections

8. APP returns 200 OK { status: 'published', url: 'https://layla-designs.safahati.com' }

[CLIENT FEEDBACK]
──────────────────────────────────────────────────────────

9. BROWSER shows success state:
   ├── Toast notification: "Your site is now live!"
   ├── "View Live Site" button opens layla-designs.safahati.com in new tab
   ├── Share buttons: WhatsApp, Instagram, Copy Link
   └── Optional: upgrade prompt for custom domain

[LIVE SITE REQUEST — HOW A VISITOR REACHES THE SITE]
──────────────────────────────────────────────────────────

10. A VISITOR navigates to layla-designs.safahati.com

11. Cloudflare CDN receives the request
    ├── Is this a cached static response? → Yes → Serve immediately
    └── No → Forward to Nginx on Hetzner VPS

12. Nginx wildcard SSL terminates TLS
    └── Forwards request to Next.js app (port 3000)

13. Next.js MIDDLEWARE runs:
    ├── Reads `host` header: "layla-designs.safahati.com"
    ├── Extracts subdomain: "layla-designs"
    ├── Is this a reserved subdomain? (www, app, api, status)
    │   └── Yes → Rewrite to appropriate app route → END
    └── No → Rewrite to /(site)/[slug] with slug="layla-designs"

14. APP: /(site)/[slug]/page.tsx runs:
    ├── CACHE: GET cache:site:layla-designs
    │   ├── Cache hit? → Use cached config → skip to step 16
    │   └── Cache miss → Continue to step 15
    ├── DB: SELECT * FROM sites WHERE slug='layla-designs' AND status='published'
    │   └── Not found? → Render 404 page with Safahati branding → END
    ├── DB: SELECT * FROM sections WHERE site_id=[id] AND is_visible=true ORDER BY sort_order
    ├── CACHE: SET cache:site:layla-designs { site, sections } TTL=300s
    └── Continue to step 15

15. [OPTIONAL] CACHE: SET cache:site:layla-designs { site, sections } TTL=300s

16. APP renders the page:
    ├── Sets <html dir="rtl" lang="ar"> (for Arabic) or <html dir="ltr" lang="en">
    ├── Sets <title> and <meta> from site.seo config
    ├── For each section in order:
    │   ├── Look up block type and template ID in registry
    │   ├── Resolve to React component
    │   ├── Extract language-appropriate config (Arabic or English fields)
    │   └── Render component with config as props
    └── Returns full HTML (React Server Component — no client fetch needed)

17. BROWSER renders the site for the visitor

[UNPUBLISH FLOW]
──────────────────────────────────────────────────────────

18. USER can unpublish from the editor or dashboard:
    └── PATCH /api/sites/[siteId] { status: 'draft' }
    → APP updates DB, invalidates cache
    → Subsequent visits to the subdomain return a 404 or "Coming Soon" page
```

### Key Decisions in This Flow

| Decision Point | Condition | Outcome |
|---|---|---|
| Middleware subdomain match | slug matches a published site | Render site |
| Middleware subdomain match | slug matches an unpublished site | 404 |
| Middleware subdomain match | subdomain is "app" | Route to admin dashboard |
| Cache hit | Valid cached config | Skip DB query |
| Cache miss | First request or post-publish | Query DB, populate cache |

---

## Flow 3: Subscription Upgrade Flow (Proposed)

### Scope
A user on the Starter (free) plan hits a feature gate and upgrades to the Pro plan via Stripe. Covers the full payment lifecycle including webhook confirmation.

---

```
[TRIGGER — FEATURE GATE HIT]
──────────────────────────────────────────────────────────

1. USER on Starter plan tries to create a 2nd site (or hits any gated feature)

2. APP: Checks user's current plan
   └── plan = 'starter' AND sites.count >= 1
   → Returns 402 Payment Required or plan_gate error

3. BROWSER renders upgrade modal:
   "This feature requires the Pro plan.
   Pro — SAR 99/month + VAT
   • 3 Sites
   • Custom Domain
   • No Safahati Branding
   [Cancel] [Upgrade to Pro →]"

[STRIPE CHECKOUT INITIATION]
──────────────────────────────────────────────────────────

4. USER clicks "Upgrade to Pro"

5. BROWSER sends POST /api/billing/create-checkout-session
   Body: { planId: 'pro', successUrl: '/dashboard?upgraded=true', cancelUrl: '/dashboard' }

6. APP:
   ├── Retrieve or create Stripe Customer for this user
   │   ├── user.stripe_customer_id exists? → Use it
   │   └── Does not exist? → Stripe API: customers.create({ email, name }) → save to DB
   └── Stripe API: checkout.sessions.create({
         customer: stripe_customer_id,
         line_items: [{ price: 'price_pro_monthly_sar', quantity: 1 }],
         mode: 'subscription',
         success_url,
         cancel_url,
         automatic_tax: { enabled: true },
         locale: 'ar'  // Arabic checkout UI
       })

7. APP returns { checkoutUrl: 'https://checkout.stripe.com/...' }

8. BROWSER redirects to Stripe-hosted checkout page

[STRIPE CHECKOUT — USER ACTION]
──────────────────────────────────────────────────────────

9. USER fills in payment details on Stripe's page:
   ├── Card number, expiry, CVV
   ├── (Optionally) Saudi VAT number for B2B invoice
   └── Clicks "Subscribe"

10. STRIPE processes payment:
    ├── Payment declined? → Show Stripe error → USER retries or cancels
    └── Payment succeeded? → Create subscription → Fire webhook → Redirect to successUrl

[WEBHOOK PROCESSING]
──────────────────────────────────────────────────────────

11. STRIPE sends POST /api/stripe/webhook
    Event: checkout.session.completed
    Payload includes: customer_id, subscription_id, plan metadata

12. APP /api/stripe/webhook:
    ├── Validate Stripe-Signature header (HMAC verification)
    │   └── Invalid? → Return 400, log security warning → END
    ├── Parse event type
    ├── For checkout.session.completed:
    │   ├── Retrieve subscription details from Stripe
    │   ├── DB: UPDATE users SET
    │   │       plan = 'pro',
    │   │       stripe_subscription_id = [sub_id],
    │   │       subscription_status = 'active',
    │   │       plan_expires_at = [next_billing_date]
    │   │     WHERE stripe_customer_id = [customer_id]
    │   ├── DB: INSERT into billing_events (user_id, event_type, amount, currency, stripe_event_id)
    │   └── EMAIL: Send payment confirmation email
    └── Return 200 OK to Stripe (important: must return 200 quickly)

[POST-PAYMENT USER EXPERIENCE]
──────────────────────────────────────────────────────────

13. BROWSER is redirected to /dashboard?upgraded=true

14. APP reads session + refreshed user plan from DB
    └── Renders dashboard with Pro badge and a success toast:
        "Welcome to Pro! You can now create up to 3 sites and connect a custom domain."

15. USER proceeds to create their 2nd site or add a custom domain

[FAILURE PATHS]
──────────────────────────────────────────────────────────

16. Payment declined:
    └── Stripe shows error on checkout page → USER tries different card or cancels
    → successUrl is never called → DB not updated → User remains on Starter

17. Webhook not received (network failure):
    ├── Stripe retries webhook for up to 72 hours
    └── APP must be idempotent: check if subscription_id already processed before updating

18. User cancels checkout:
    └── Stripe redirects to cancelUrl (/dashboard) → No DB change → User remains on Starter
```

---

## Flow 4: AI Content Generation Flow (Proposed)

### Scope
A Business plan user generates AI-written content for a section using the Claude API. Covers user input, prompt construction, API call, and content application.

---

```
[TRIGGER — USER INITIATES AI GENERATION]
──────────────────────────────────────────────────────────

1. USER is editing a section in the editor (e.g., Hero section)

2. USER clicks "Generate with AI" button
   (Only visible to Business plan users)

3. BROWSER renders AI generation drawer/modal:
   ├── Field: "Describe your business in 2-3 sentences"
   │   (Pre-filled if user has previously described their business)
   ├── Field: "Tone" (Professional / Friendly / Bold / Minimal)
   ├── Language: matches site language (Arabic or English, pre-selected)
   └── [Generate Content] button

4. USER enters business description:
   "أنا مصممة جرافيك متخصصة في هوية العلامات التجارية والتصميم الرقمي.
   أعمل مع الشركات الصغيرة في المملكة العربية السعودية."
   (Translation: "I'm a graphic designer specializing in brand identity and digital design.
   I work with small businesses in Saudi Arabia.")

5. USER clicks "Generate Content"

[QUOTA CHECK]
──────────────────────────────────────────────────────────

6. BROWSER sends POST /api/sites/[siteId]/sections/[sectionId]/generate
   Body: { businessDescription, tone, language }

7. APP checks AI generation quota:
   ├── DB: SELECT ai_generations_this_month FROM users WHERE id = current_user
   ├── Business plan quota = 50 generations/month
   └── Quota exceeded? → Return 429 with "Generation limit reached. Resets on [date]." → END

[PROMPT CONSTRUCTION]
──────────────────────────────────────────────────────────

8. APP builds the Claude API prompt:
   ├── Fetch the Zod schema for the section's config type
   │   (e.g., HeroConfig: { headline_ar, headline_en, subheadline_ar, subheadline_en, cta_label_ar, cta_label_en })
   ├── Construct system prompt:
   │   "You are a professional Arabic/English bilingual copywriter specializing in MENA market SME websites.
   │   Generate content for the following section config fields. Output valid JSON only.
   │   Follow the exact field names in the schema. Arabic text must be natural Gulf Arabic.
   │   Max 10 words for headlines. Max 25 words for subheadlines."
   ├── Construct user prompt:
   │   "Business description: [user input]
   │   Tone: [selected tone]
   │   Section type: Hero
   │   Generate content for these fields: [JSON schema fields]"
   └── Set max_tokens = 500, temperature = 0.7

[API CALL TO CLAUDE]
──────────────────────────────────────────────────────────

9. APP sends request to Anthropic Claude API:
   Model: claude-sonnet-4-6
   Messages: [system prompt, user prompt]

10. Claude API responds:
    ├── Success: Returns JSON string with generated content
    └── Error (rate limit, timeout): APP returns 503 "AI service temporarily unavailable"

[RESPONSE VALIDATION]
──────────────────────────────────────────────────────────

11. APP parses Claude's response:
    ├── Parse JSON from response text
    ├── Validate against the section's Zod schema
    │   └── Validation fails? → Log error + return 500 with "Generation failed, please try again"
    └── Validation passes → Continue

12. APP:
    ├── DB: UPDATE users SET ai_generations_this_month = ai_generations_this_month + 1
    ├── DB: INSERT into ai_generation_log (user_id, site_id, section_id, tokens_used, cost_usd)
    └── Return 200 { generatedConfig: { headline_ar: "...", headline_en: "...", ... } }

[USER REVIEW AND APPLY]
──────────────────────────────────────────────────────────

13. BROWSER displays generated content in a preview state:
    ├── Shows each generated field next to the current field value
    ├── User can edit any generated field inline
    └── Two action buttons: [Discard] and [Apply to Section]

14a. USER clicks "Discard":
     └── Generated content is discarded, original values remain

14b. USER clicks "Apply to Section":
     ├── Generated values replace current field values in the form state
     ├── Toast: "AI content applied. Review and save when ready."
     └── User is returned to the normal section editor with pre-filled AI content
         (Content is NOT auto-saved — user must explicitly click "Save Section")

15. USER reviews, optionally edits, then clicks "Save Section"
    └── Proceeds through normal section save flow
```

---

## Flow 5: Support Ticket Flow (Proposed)

### Scope
A user encounters a problem and submits a support ticket. Covers submission, routing, triage, and resolution, including communication back to the user.

---

```
[TRIGGER — USER ENCOUNTERS AN ISSUE]
──────────────────────────────────────────────────────────

1. USER is in the dashboard and encounters a problem
   (e.g., "My site isn't loading", "I was charged twice", "Template is broken")

2. USER clicks "Help" or "Support" in the dashboard navigation

3. BROWSER navigates to /dashboard/support

[TICKET SUBMISSION]
──────────────────────────────────────────────────────────

4. APP renders support form with user's name and email pre-filled
   Form fields:
   ├── Category: [Technical Issue] [Billing Question] [Feature Request] [General]
   ├── Subject: (text, required, max 100 chars)
   ├── Message: (textarea, required, min 20 chars, max 2000 chars)
   ├── Affected site: (dropdown of user's sites, optional)
   └── Screenshot: (file upload, optional, max 5MB, PNG/JPG/GIF)

5. USER fills in the form and submits

6. BROWSER validates client-side → sends POST /api/support/tickets
   Body: { category, subject, message, site_id?, screenshot? }

7. APP:
   ├── Authenticate + authorize user
   ├── If screenshot: Upload to STORAGE (MinIO) → get screenshot_url
   ├── Generate unique ticket ID (format: YYYY-MMDD-XXXXX, e.g., 2026-0425-84291)
   ├── DB: INSERT into support_tickets (user_id, ticket_id, category, subject, message,
   │       site_id, screenshot_url, status='open', created_at)
   └── EMAIL:
       ├── Send acknowledgment to user (ticket_id, expected response time)
       └── Send notification to support inbox (kh.m.alshehri@gmail.com)

8. APP returns 201 Created { ticketId }

9. BROWSER shows confirmation:
   "Your ticket #2026-0425-84291 has been submitted.
   We'll respond within 24 hours. Check your email for updates."

[SUPPORT TEAM TRIAGE]
──────────────────────────────────────────────────────────

10. SUPPORT AGENT receives email notification
    ├── Reviews ticket details: category, message, screenshot
    ├── Checks if issue is a known bug or platform outage
    └── Assigns priority: Critical (≤2h) / High (≤8h) / Normal (≤24h) / Low (≤72h)

11. SUPPORT AGENT categorizes:
    ├── Technical bug → Escalate to engineering team
    ├── Billing dispute → Access Stripe dashboard to verify
    ├── Feature request → Log in product backlog
    └── General question → Respond directly

[SUPPORT AGENT RESPONSE]
──────────────────────────────────────────────────────────

12. SUPPORT AGENT clicks "Reply" in ticket management view (or replies via email)

13. APP: POST /api/support/tickets/[ticketId]/reply
    Body: { message, status: 'in_progress' | 'resolved' }

14. DB: UPDATE support_tickets SET status='in_progress', updated_at=NOW()
        INSERT into ticket_replies (ticket_id, author='support', message, created_at)

15. EMAIL: Send reply to user:
    "Re: Your ticket #2026-0425-84291
    Hi Layla, thanks for reaching out. Here's what we found: [agent message]
    Reply to this email or visit your support history at [link]."

[USER RESPONSE AND RESOLUTION]
──────────────────────────────────────────────────────────

16. USER receives email, reads the response
    ├── Issue resolved? → No further action needed
    └── Still unresolved? → User replies to email or submits follow-up in dashboard

17. If USER replies via email:
    EMAIL service (Resend inbound webhook) → POST /api/support/tickets/[ticketId]/reply
    → Appends reply to ticket thread in DB

18. SUPPORT AGENT marks ticket as resolved:
    DB: UPDATE support_tickets SET status='resolved', resolved_at=NOW()

19. EMAIL: Send resolution confirmation to user:
    "Your ticket #2026-0425-84291 has been resolved.
    Was this helpful? [Yes, thanks] [No, I need more help]"

20a. USER clicks "Yes, thanks" → Ticket closed; satisfaction recorded
20b. USER clicks "No, I need more help" → Ticket re-opened; support agent notified

[TICKET HISTORY VIEW]
──────────────────────────────────────────────────────────

21. USER can view all their tickets at /dashboard/support/tickets
    ├── List view: ticket ID, subject, status badge, date
    └── Detail view: full message thread, timestamps, resolution status
```

---

## Cross-Flow Dependencies

| Flow | Depends On | Critical Path |
|---|---|---|
| Flow 1 (Registration) | DB (users table), Email service | DB is blocking; email is async |
| Flow 2 (Publishing) | Subdomain routing (PUB-01), Redis cache | Routing must be live first |
| Flow 3 (Subscription) | Stripe integration, Webhook endpoint, DB | Webhook must be idempotent |
| Flow 4 (AI Generation) | Claude API, Zod schemas, plan gating | Schema must be complete before AI |
| Flow 5 (Support) | Email service, DB (tickets table), MinIO | Email is blocking for user acknowledgment |

## Implementation Priority Order

```
Phase 1 (Launch blockers):
  Flow 1 — Registration + Site Creation    [IMPLEMENTED, minor gaps]
  Flow 2 — Publishing                      [NOT IMPLEMENTED — PUB-01 critical]

Phase 2 (Growth features):
  Flow 3 — Subscription Upgrade            [NOT IMPLEMENTED]
  Flow 5 — Support Tickets                 [NOT IMPLEMENTED]

Phase 3 (Retention features):
  Flow 4 — AI Content Generation           [NOT IMPLEMENTED]
```
