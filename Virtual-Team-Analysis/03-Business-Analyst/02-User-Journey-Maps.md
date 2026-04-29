# User Journey Maps
## Safahati Platform — Three Core Personas
### Version 1.0 | April 2026

---

## About This Document

This document maps the end-to-end journeys of three representative Safahati users. Each journey covers the full lifecycle from awareness through active use, including the emotional highs and lows, key touchpoints, pain points, and opportunities for the platform to improve the experience. These maps are grounded in MENA/Saudi market context and the current state of the platform.

---

## Persona 1: Layla — Freelance Graphic Designer

### Profile

| Attribute | Detail |
|---|---|
| Name | Layla Al-Qahtani |
| Age | 28 |
| Location | Riyadh, Saudi Arabia |
| Occupation | Freelance graphic designer (3 years experience) |
| Tech Comfort | High — uses Figma, Adobe CC, Instagram, and has basic HTML knowledge |
| Language Preference | Arabic primary, comfortable reading English |
| Platform Use | Needs a personal portfolio site to attract clients and appear professional |
| Device | MacBook Pro (primary), iPhone 15 (browsing/social) |
| Social Presence | Active on Instagram (@layla.designs), LinkedIn |
| Income | Variable (SAR 8,000–15,000/month) |
| Goal | A beautiful Arabic-first portfolio that showcases her work and generates inbound leads |

### Motivations
- She has been sending clients to her Instagram profile — it looks unprofessional to corporate clients
- She was quoted SAR 5,000+ by a web agency for a custom site
- She wants something she can update herself without asking a developer
- Her competitor just launched a site on Squarespace and it looks polished

### Frustrations Before Safahati
- Squarespace and Wix are English-first and clunky in Arabic
- WordPress is too complex to set up and maintain
- She is not a developer and doesn't want to learn one

---

### Journey Map — Layla

#### Stage 1: Awareness
**Touchpoints:** Instagram ad, Twitter/X post from a Saudi tech community, word-of-mouth from a designer friend

**Layla's Actions:**
1. Sees an Instagram Reel showing an Arabic portfolio site being set up in minutes on Safahati
2. Clicks through to `safahati.com` on her iPhone
3. Browses the landing page and watches the demo video
4. Reads the pricing page — notes the free plan exists

**Emotions:** Curious → Cautiously optimistic
**Internal Monologue:** "This looks cleaner than what I've seen before. And it's in Arabic. But is it too good to be true? I'll try the free version first."

**Pain Points:**
- Landing page is not yet live (gap) — she bounces if the homepage isn't compelling
- No social proof (testimonials from Saudi designers) yet
- She wants to see exactly what a freelancer portfolio looks like before registering

**Opportunities:**
- Show a live demo site of a freelancer portfolio on the landing page (interactive preview)
- Add 2-3 testimonials from Saudi freelancers with photos
- "Preview before registering" feature reduces friction

---

#### Stage 2: Registration
**Touchpoints:** Registration form at `app.safahati.com/register`

**Layla's Actions:**
1. Taps "ابدأ مجانًا" (Start for Free) — she prefers the Arabic CTA
2. Fills in her name, email, and password on the registration form
3. Clicks "إنشاء حساب" (Create Account)
4. Lands on the dashboard for the first time

**Emotions:** Motivated → Slight confusion on first dashboard load
**Internal Monologue:** "OK it's fast. But now what? I see a big empty screen. I'm not sure what to do next."

**Pain Points:**
- No welcome email received (gap — email not implemented)
- Dashboard is empty with no guidance — she sees just a "New Site" button
- No onboarding flow (gap) — she feels dropped in without context

**Opportunities:**
- Welcome email in Arabic with 3 action steps
- Onboarding tooltip sequence on first dashboard visit
- Prominent "Create Your First Site" card with expected time estimate ("Ready in 5 minutes")

---

#### Stage 3: First Site Creation
**Touchpoints:** Site creation wizard (`/dashboard/new`)

**Layla's Actions:**
1. Clicks "New Site" — a 2-step wizard appears
2. Step 1: Enters "Layla Designs" as her site name — the slug auto-generates as `layla-designs`
3. Selects Arabic as her primary language
4. Step 2: Sees the 13 industry tiles — selects "Freelancer"
5. Site is created, she's redirected to the editor

**Emotions:** Excited → Impressed ("wow, that was fast") → Eager to customize
**Internal Monologue:** "It already has a hero section, a portfolio section, a services section. I just need to fill in my content."

**Pain Points:**
- She doesn't immediately understand the difference between section types
- The default template images are placeholder images (Lorem Picsum) which look generic
- She wants to see what the site looks like right now but can't find a preview button

**Opportunities:**
- "Preview Site" button available from step 1 of the editor
- Industry-specific welcome message ("You're setting up a Freelancer portfolio. Here are the 5 most important sections to fill in.")
- Replace Lorem Picsum with curated, on-brand placeholder images per industry

---

#### Stage 4: Content Editing
**Touchpoints:** Section editor, config forms, image upload

**Layla's Actions:**
1. Opens the Hero section — sees bilingual fields for headline and subheadline
2. Fills in Arabic headline: "مصممة جرافيك إبداعية في الرياض"
3. Fills in English headline: "Creative Graphic Designer in Riyadh"
4. Tries to upload her portrait photo — encounters the image upload flow (MinIO)
5. Edits the portfolio section — wants to add 6 portfolio pieces with descriptions
6. Edits the contact section — adds her WhatsApp number and email
7. Spends ~45 minutes total on first-pass content

**Emotions:** Engrossed (high focus) → Occasional frustration → Satisfaction
**Internal Monologue:** "The bilingual fields are great — I can write my real Arabic copy, not a translation of English. The image upload is a bit slow but it works."

**Pain Points:**
- Image upload progress indicator is missing (she doesn't know if the upload worked)
- Portfolio section only allows 3 items in the default template — she wants 6 (template limitation)
- She has to scroll a lot to see all sections in the editor — no sticky navigation
- Arabic text in the preview looks off because she doesn't have the right font selected yet

**Opportunities:**
- Image upload progress bar with success confirmation
- Config field for max portfolio items (configurable, not hardcoded)
- Sticky "sections panel" in the editor with jump-to-section links
- Font selector with Arabic font preview in the site appearance settings

---

#### Stage 5: Publishing
**Touchpoints:** Publish button, published site at `layla-designs.safahati.com`

**Layla's Actions:**
1. Finds the "Publish" button (top right of editor)
2. Confirms publish — site goes live at `layla-designs.safahati.com`
3. Opens the URL in a new tab — site loads, looks like her edits
4. Shares the URL on WhatsApp with a friend: "شوفي موقعي الجديد!" (Look at my new site!)
5. Shares on Instagram Stories with a "swipe up" link

**Emotions:** PEAK POSITIVE — pride, excitement, accomplishment
**Internal Monologue:** "This is my site. It has my name, my work, my face. And it's in Arabic. My clients will love this."

**Pain Points:**
- Subdomain routing not yet live (critical gap) — this moment fails completely if PUB-01 isn't implemented
- The `.safahati.com` subdomain feels less professional than `www.layladesign.com`
- No OG image set — when shared on WhatsApp, the link preview looks blank

**Opportunities:**
- This is the highest-emotion moment in the entire journey — celebrate it: confetti animation, "Your site is live!" modal with share buttons
- Prompt immediate upgrade to Pro for custom domain ("Add www.layladesign.com for SAR 99/month")
- Auto-generate an OG image from the hero section so link previews look great immediately

---

#### Stage 6: Ongoing Use and Upgrade
**Touchpoints:** Dashboard, editor, billing page (future)

**Layla's Actions (weeks 2-8):**
1. Returns to the editor to update portfolio pieces when she completes new projects
2. Shares her site URL in her Instagram bio
3. Receives her first client inquiry via the contact form
4. Decides she wants a custom domain — clicks "Upgrade to Pro"
5. Completes Stripe checkout in SAR — receives payment confirmation email

**Emotions:** Habitual satisfaction → Delight on first inquiry → Committed customer
**Internal Monologue:** "Someone actually found me through my site. The SAR 99/month is worth it for the custom domain alone."

**Pain Points:**
- No notification when the contact form receives a submission (gap)
- She wants analytics — how many people are visiting her site? (gap)
- Upgrading plan flow is not implemented yet (gap)

**Opportunities:**
- Email notification for every contact form submission (instant gratification loop)
- Simple visitor count on the dashboard ("142 people visited your site this month")
- Upgrade prompt triggered contextually (e.g., when she tries to add a 2nd site on Starter)

---

### Layla's Emotional Arc

```
Awareness    Registration    Creation    Editing    Publishing    Ongoing
    |              |             |            |           |           |
    5              3             8            6           10          8
    |              |             |            |           |           |
  Curious       Confused     Excited     Focused     PEAK JOY    Habitual
```
*(Scale 1–10 sentiment, 10 = highest positive emotion)*

### Key Moments of Truth
1. **First preview of her site** (Creation stage) — must look real and professional immediately
2. **First time the site goes live** (Publishing stage) — the highest-stakes moment; routing must work
3. **First client inquiry through the site** (Ongoing) — the ultimate proof of value

---
---

## Persona 2: Ahmad — Restaurant Owner

### Profile

| Attribute | Detail |
|---|---|
| Name | Ahmad Al-Zahrani |
| Age | 45 |
| Location | Jeddah, Saudi Arabia |
| Occupation | Owner of a traditional Saudi restaurant (Al-Madfa Restaurant, 18 tables, 8 staff) |
| Tech Comfort | Low-medium — uses WhatsApp daily, has a Facebook page, struggles with complex software |
| Language Preference | Arabic almost exclusively; reads English but finds it uncomfortable |
| Platform Use | Needs an Arabic-first restaurant website with a menu, location, and reservation contact |
| Device | Samsung Galaxy (Android), occasionally his son's laptop |
| Goal | A professional-looking Arabic website he can show to customers and add to Google Maps |
| Decision Maker | Yes — but his 22-year-old son, Faris, will likely do the technical setup |

### Motivations
- His restaurant is on Google Maps but has no website — he looks less credible than newer restaurants
- A competitor restaurant launched a site and is getting reservations from it
- He receives 10–15 "do you have a website?" questions per week from customers
- His son Faris suggested trying Safahati after seeing it mentioned in a Saudi entrepreneurs WhatsApp group

### Frustrations Before Safahati
- Ahmad tried to use a web agency but was quoted SAR 8,000 upfront
- His son tried WordPress 6 months ago and gave up after the hosting setup
- He doesn't understand English UI labels at all

---

### Journey Map — Ahmad

#### Stage 1: Awareness
**Touchpoints:** WhatsApp group (Saudi entrepreneurs), son Faris telling him about it, Google search

**Ahmad and Faris's Actions:**
1. Faris sees Safahati mentioned in a WhatsApp group as "أفضل منصة لبناء مواقع المطاعم في السعودية"
2. Faris visits the site, shows Ahmad the demo on his phone
3. Ahmad says: "إذا تقدر تسوّيه أنت، أنا موافق" (If you can do it yourself, I agree)
4. Faris registers on Ahmad's behalf, using Ahmad's business email

**Emotions (Ahmad):** Skeptical → Willing to try (trusts Faris)
**Emotions (Faris):** Eager, confident
**Internal Monologue (Faris):** "This looks way simpler than WordPress. The Arabic is actually good. Let me try it."

**Pain Points:**
- Awareness depends on word-of-mouth; the platform isn't yet widely known in Jeddah restaurant circles
- Ahmad can't evaluate it himself — it's Faris who makes the technical judgment
- If Faris finds any step confusing, the whole thing stops

**Opportunities:**
- Target restaurant WhatsApp groups and food/entrepreneur communities in Saudi Arabia
- Create a "Restaurant" specific landing page with menu screenshots in Arabic
- Make registration so simple that Ahmad could theoretically do it himself

---

#### Stage 2: Site Creation
**Touchpoints:** Wizard, industry picker, section editor

**Faris's Actions (on behalf of Ahmad):**
1. Logs in, creates new site "مطعم المدفع" (Al-Madfa Restaurant)
2. Selects Arabic as primary language
3. Selects "Restaurant" industry template
4. Editor loads with: Hero, Menu, About, Gallery, Contact sections pre-populated

**Emotions:** Faris is pleased with the speed; Ahmad watches and nods approval when the layout looks like a real restaurant site
**Internal Monologue (Faris):** "The restaurant template already looks like a real menu. We just need to add our actual dishes."

**Pain Points:**
- The restaurant template in English defaults need to be translated — Faris has to replace all placeholder text
- No "import menu from PDF/image" option — Ahmad has a printed menu; entering 40+ dishes manually will take a long time
- The gallery section requires uploading photos one by one — they have 30+ food photos

**Opportunities:**
- **High Impact:** AI menu generation — user enters dish names, AI writes Arabic/English descriptions
- Bulk image upload for gallery sections
- Import menu from a structured template (CSV or simple text format)
- The restaurant template should default to Arabic placeholder text, not English

---

#### Stage 3: Content Entry — Menu
**Touchpoints:** Menu section config, image uploads

**Faris's Actions:**
1. Opens the Menu section config
2. Adds categories: مقبلات (Starters), مشويات (Grills), مشروبات (Beverages)
3. Adds dishes one by one — each with Arabic name, English name, description, price, and photo
4. Uploads photos taken by Ahmad's son on his phone camera
5. Takes approximately 2.5 hours total

**Emotions:** Faris is patient but gets fatigued; Ahmad occasionally checks in and is happy with the results
**Internal Monologue (Faris):** "This is taking longer than I expected but it's looking really good. The menu photos are coming out well."

**Pain Points:**
- There is no maximum price per dish field vs. minimum — just a single price field (some dishes have price ranges)
- No Halal certification badge/label option (important for Saudi restaurant trust signals)
- No allergen/dietary flag system (e.g., spicy, nut-free, vegan)
- Image upload takes ~8 seconds per photo on a mobile connection

**Opportunities:**
- Add price range field (min/max) as an optional second price
- Add a "dietary tags" multi-select per dish (halal, spicy, vegetarian, etc.)
- Compress images client-side before upload (reduce upload time on mobile)

---

#### Stage 4: Contact & Location Setup
**Touchpoints:** Contact section config, Google Maps embed

**Faris's Actions:**
1. Opens Contact section
2. Adds phone number, WhatsApp number, and email
3. Adds Google Maps embed code (copies from Google Maps share)
4. Adds the Arabic street address: "شارع التحلية، جدة، المملكة العربية السعودية"
5. Sets opening hours: Saturday–Thursday 12pm–12am, Friday 1pm–12am

**Emotions:** Straightforward and satisfying
**Internal Monologue (Faris):** "This part is easy. WhatsApp is the most important thing — customers always use WhatsApp to book."

**Pain Points:**
- Opening hours field is a free-text field — no structured time picker for days/hours
- Google Maps embed requires pasting raw HTML iframe — Faris has to find this from Google Maps (not intuitive for Ahmad)
- No reservation form built into the contact section — just a contact form

**Opportunities:**
- Structured opening hours picker (day-of-week + open/close time) with display formatting
- Google Maps integration: enter an address and the embed is auto-generated
- Optional reservation request form (date, time, party size, WhatsApp number)

---

#### Stage 5: Publishing and Sharing
**Touchpoints:** Publish button, published site, WhatsApp share

**Faris and Ahmad's Actions:**
1. Faris clicks Publish
2. Site goes live at `al-madfa.safahati.com`
3. Faris and Ahmad open it on their phones and scroll through together
4. Ahmad is visibly delighted: "هذا أحسن من المطعم اللي بجنبنا!" (This is better than the restaurant next to us!)
5. Ahmad immediately sends the link to all his contacts on WhatsApp

**Emotions:** Ahmad — PEAK JOY. Pride. Excitement. He shows everyone immediately.
**Internal Monologue (Ahmad):** "This is MY restaurant on a real website. In Arabic. I can show this to anyone."

**Pain Points:**
- Ahmad wants to add the website URL to his Google Maps listing but doesn't know how (not a Safahati problem, but an onboarding opportunity)
- He wants to print the URL on his takeaway bags — but `al-madfa.safahati.com` is long
- The site looks slightly different on his Android Chrome vs. Safari on iPad (minor rendering issues)

**Opportunities:**
- Add a "Next Steps" checklist after publishing: "Add your site to Google Maps," "Add to Instagram bio," "Share on WhatsApp"
- Upgrade prompt: "Get www.almadfarestaurant.com for SAR 99/month" — makes the URL printable
- Android/Safari cross-browser testing of all templates must be a QA requirement

---

#### Stage 6: Ongoing Management
**Touchpoints:** Dashboard, editor (monthly updates)

**Ahmad's Ongoing Actions (with Faris's help):**
1. Every 2 weeks, Ahmad updates the menu when a new dish is added or a price changes
2. During Ramadan, he adds a special "Iftar Menu" section
3. He checks the contact form weekly for reservation requests
4. After 3 months, decides to upgrade to Pro for a custom domain

**Emotions:** Steady satisfaction; occasional frustration when he can't update something independently
**Internal Monologue (Ahmad):** "I need Faris to help me with the big changes. But for simple things like updating a price, I can almost do it myself."

**Pain Points:**
- Ahmad cannot do simple updates himself because the admin UI assumes some tech literacy
- No "simple mode" for non-technical users (just the essential fields: price, name, photo)
- No seasonal content scheduling (he wants to pre-schedule the Ramadan section to appear on the 1st of Ramadan)

**Opportunities:**
- A "Quick Edit" simplified view for restaurant sites (just show the fields restaurant owners change most)
- Scheduled section visibility (show section from date X to date Y)
- Arabic-first admin UI language (currently defaults to English in some areas)

---

### Ahmad's Emotional Arc

```
Awareness    Registration    Creation    Menu Entry    Publishing    Ongoing
    |              |             |            |             |            |
    4              5             7            5             10           6
    |              |             |            |             |            |
 Skeptical    Neutral       Pleased      Fatigued    PEAK JOY    Steady
```

### Key Moments of Truth
1. **The restaurant template loading** — must immediately look like a real restaurant site, not a generic page
2. **Ahmad seeing the site on his phone** — the Arabic layout, his restaurant name, his photos — the pride moment
3. **First customer using the site** — finding the phone number or placing an inquiry

---
---

## Persona 3: Sara — Digital Agency Owner

### Profile

| Attribute | Detail |
|---|---|
| Name | Sara Al-Mutairi |
| Age | 34 |
| Location | Riyadh, Saudi Arabia (remote team across KSA/Egypt) |
| Occupation | Founder of a boutique digital agency (8 employees, 40+ active clients) |
| Tech Comfort | Very high — comfortable with APIs, project management tools, has deployed to Vercel before |
| Language Preference | Bilingual (Arabic and English equally); uses both in work contexts |
| Platform Use | Uses Safahati to build and manage websites for her SME clients |
| Device | MacBook Pro (main), iPad Pro (client meetings), iPhone 15 Pro |
| Goal | A scalable way to build and maintain 10–30 client sites without custom dev for each |
| Business Model | Monthly retainer per client (SAR 400–800/month) includes site hosting and maintenance |

### Motivations
- Custom-built sites for every client are not scalable — each takes 3–4 weeks and costs her team heavily
- Clients want bilingual sites, and existing tools handle Arabic poorly
- She wants to white-label or partially brand Safahati as her own offering
- Her clients trust her to manage their digital presence — she needs a reliable platform

### Frustrations Before Safahati
- WordPress multisite is too complex to manage at scale with a small team
- Webflow is English-first and pricing is per site
- She has been using a combination of custom templates and manual hosting — it's not sustainable

---

### Journey Map — Sara

#### Stage 1: Discovery and Evaluation
**Touchpoints:** LinkedIn post, product demo call, free trial

**Sara's Actions:**
1. Sees a LinkedIn post from Safahati about "multi-tenant Arabic website platform"
2. Visits the platform, reads the documentation (checks if there's an API)
3. Registers for a free trial and immediately creates a test site to evaluate quality
4. Evaluates: RTL rendering quality, template variety, page load speed, admin usability

**Emotions:** Analytical → Cautiously interested → Impressed by RTL quality
**Internal Monologue:** "The RTL rendering is actually good — better than anything I've seen. If this is stable, it could replace my current setup for all new clients."

**Pain Points:**
- No API documentation available (she wants to know if she can create sites programmatically)
- No team access or sub-user management (she needs her team to manage client sites)
- No white-labeling or agency branding option
- Pricing is per user, not per agency client — not suited to her business model yet

**Opportunities:**
- Agency/Reseller plan specifically for Sara's use case (bulk site management, team access, white-label)
- API documentation (even basic CRUD for site/section management)
- "Managed by [Agency Name]" branding in the admin footer

---

#### Stage 2: Onboarding Multiple Clients
**Touchpoints:** Dashboard (multi-site view), site creation wizard (repeated), team management (future)

**Sara's Actions:**
1. Creates sites for her first 5 clients on the Business plan
2. For each client: names site, selects industry, enters basic content
3. Shares the editor link with each client so they can fill in their own content
4. Reviews each site before publishing

**Emotions:** Productive → Increasingly frustrated at repetitive steps → Wants bulk tooling
**Internal Monologue:** "Creating a new site still requires too many manual steps. I'm doing the same 10 actions for every new client. I need a template-of-templates or some kind of duplication."

**Pain Points:**
- No site duplication feature — she creates similar sites from scratch each time
- No ability to give clients limited access to only their own site
- No bulk actions — she can't publish all 5 sites at once
- No way to see all clients' sites in one dashboard view

**Opportunities:**
- **High Priority for Sara:** "Duplicate Site" feature — clone an existing site as a starting point
- Client access management — invite a client by email, they can only access their own site
- Agency dashboard — a separate view showing all managed sites with client names and statuses
- Bulk publish / bulk status change

---

#### Stage 3: Managing Client Content Updates
**Touchpoints:** Editor (daily), client communication (WhatsApp/email)

**Sara's Actions:**
1. Client from Jeddah calls: "I need to update my contact number on the site"
2. Sara logs in, navigates to the client's site, finds the contact section, updates the number, saves
3. Publishes the update
4. Confirms with client via WhatsApp

**Emotions:** Routine → Slightly inefficient → Wishes clients could do simple updates themselves
**Internal Monologue:** "I'm spending 15 minutes doing a 30-second task because I'm the only one with access. I need to give clients a safe way to edit just their own content."

**Pain Points:**
- No change history / version history — if she makes a mistake, there's no undo
- No client-facing simplified editor with limited permissions
- No audit log ("who changed what, when")
- Time-consuming to navigate between client sites

**Opportunities:**
- Version history / undo for section config changes
- Audit log per site (all changes with timestamp and user)
- Client-tier access: client can edit content but cannot change templates, delete sections, or publish without approval
- Quick-switch between client sites from a global nav dropdown

---

#### Stage 4: Billing and Business Model
**Touchpoints:** Billing page, pricing page, Stripe portal

**Sara's Actions:**
1. Sara is on Business plan (SAR 249/month) — manages 12 client sites
2. Realizes she's at the 10-site limit — needs to expand
3. Looks for an agency/enterprise plan — doesn't find one
4. Contacts support to ask about volume pricing

**Emotions:** Frustrated (limit hit) → Hopes for a custom deal
**Internal Monologue:** "I'm growing this platform's user base by bringing my clients here. I should be getting volume pricing, not a hard cap."

**Pain Points:**
- No agency/reseller plan with volume site management
- Current plan tiers not designed for her use case
- No annual billing option (she prefers to pay yearly for stable expenses)

**Opportunities:**
- Agency plan: unlimited client sites, team member access, white-label branding, priority support — SAR 699/month or SAR 7,499/year
- Reseller margin: Sara charges her clients SAR 600/month; Safahati charges her SAR 250 — she keeps the margin
- Annual billing discount (2 months free — SAR 2,988 billed annually)

---

#### Stage 5: Long-Term Platform Dependency
**Touchpoints:** Client portfolio growth, platform reliability, API integrations

**Sara's Actions (month 6+):**
1. Manages 22 client sites on Safahati
2. Recommends Safahati to other agencies in her network
3. Starts requesting features: API access, webhook for form submissions, custom code injection
4. Considers Safahati as her primary infrastructure — deep platform dependency

**Emotions:** Invested → Occasional concern about platform stability → Active advocate
**Internal Monologue:** "My business depends on this platform. I need to know it's not going anywhere. I also need an API so I can automate some of this."

**Pain Points:**
- No API for programmatic site management (critical gap for Sara)
- No uptime SLA or status page
- Feature requests have no visible roadmap
- If Safahati goes down, all 22 of her client sites go down

**Opportunities:**
- Public status page (status.safahati.com)
- Public roadmap (Canny or Notion-based)
- REST or GraphQL API for site/section CRUD (Agency plan only)
- Dedicated Slack or WhatsApp channel for agency plan customers

---

### Sara's Emotional Arc

```
Discovery    Onboarding    Daily Mgmt    Billing    Scale
    |              |             |            |         |
    7              6             5            3         7
    |              |             |            |         |
 Interested    Productive    Routine      Frustrated  Invested
```

### Key Moments of Truth
1. **RTL rendering quality evaluation** — if Arabic looks bad, Sara rejects the platform immediately
2. **Site limit hit** — a hard cap without an agency plan is a deal-breaker at this stage
3. **First client asking Sara about their site performance** — Sara needs analytics to answer

---

## Cross-Persona Insights

### Pain Points Shared Across All 3 Personas

| Pain Point | Layla | Ahmad | Sara |
|---|---|---|---|
| No live subdomain routing | Critical blocker | Critical blocker | Critical blocker |
| No email notifications | Missed delight | Missed trust | Operational gap |
| No contact form submission notifications | Lost leads | Lost reservations | Client complaints |
| Limited template customization | Workaround needed | Workaround needed | Workflow blocker |
| No analytics/visitor data | Wants it | Wants it | Client demand |

### Highest-Value Opportunities by Impact/Effort

| Opportunity | Personas Affected | Impact | Effort |
|---|---|---|---|
| Live subdomain routing | All | Very High | High |
| Contact form → email notification | Layla, Ahmad | Very High | Low |
| Site duplication | Sara | High | Medium |
| Client access management | Sara | High | High |
| Seasonal/scheduled section visibility | Ahmad | Medium | Medium |
| Visitor analytics (simple) | All | High | Medium |
| AI menu generation | Ahmad | High | Medium |
| OG image auto-generation | Layla | Medium | Medium |
