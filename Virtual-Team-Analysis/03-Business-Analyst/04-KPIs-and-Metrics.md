# KPI Framework and Metrics
## Safahati Platform — Business and Product Intelligence
### Version 1.0 | April 2026

---

## Framework Overview

This document defines the KPI framework for the Safahati platform across five measurement domains: **Acquisition**, **Activation**, **Retention**, **Revenue**, and **Support**. The framework follows the AARRR (Pirate Metrics) model, extended with support metrics relevant to a B2SME SaaS targeting the MENA market.

Each KPI entry includes:
- **Definition** — what exactly is being measured
- **Current Baseline** — where the platform stands today (where known)
- **Target** — the goal to reach within 6-12 months
- **Measurement Method** — how to collect and report the data
- **Why It Matters** — the business justification

---

## Domain 1: Acquisition Metrics

Acquisition metrics track how well the platform attracts new users. For Safahati in the MENA/Saudi market, acquisition channels are expected to be primarily organic (word-of-mouth, Arabic social media, community groups) and paid (Instagram/Snapchat/TikTok ads targeting Saudi SMEs).

---

### ACQ-01: Monthly New Registrations

| Attribute | Value |
|---|---|
| Definition | Number of new user accounts created in a calendar month |
| Current Baseline | Not tracked (platform not yet widely live) |
| Target (Month 3) | 100 registrations/month |
| Target (Month 6) | 400 registrations/month |
| Target (Month 12) | 1,500 registrations/month |
| Measurement | COUNT(users) WHERE created_at BETWEEN [start of month] AND [end of month] |
| Reporting Cadence | Weekly (rolling 7-day) + monthly |
| Segmentation | By acquisition channel, by industry selected, by language (AR/EN) |

**Why It Matters:** The top-of-funnel driver for all other metrics. If registration growth stalls, the entire growth model breaks. Arabic-language acquisition is the highest leverage opportunity.

---

### ACQ-02: Visitor-to-Registration Conversion Rate

| Attribute | Value |
|---|---|
| Definition | % of unique visitors to safahati.com or app.safahati.com who complete registration |
| Current Baseline | Unknown (analytics not implemented) |
| Target | 8–12% (B2SME SaaS benchmark: 5–15%) |
| Measurement | (New registrations ÷ Unique visitors) × 100 |
| Data Sources | Cloudflare Web Analytics or Plausible (privacy-first), DB registrations |

**Why It Matters:** Indicates how compelling the landing page and registration flow are. Arabic-first copy on the landing page is expected to significantly improve this rate for the Saudi target audience.

---

### ACQ-03: Traffic by Source

| Attribute | Value |
|---|---|
| Definition | Distribution of website traffic by acquisition channel |
| Channels | Organic search (Google/Bing), Instagram, WhatsApp referrals, direct, paid ads, referral (agency partners) |
| Current Baseline | Not tracked |
| Target | ≥ 40% organic within 12 months; ≤ 30% paid ads |
| Measurement | UTM parameters in landing page links, Plausible Analytics source tracking |
| Key Insight to Track | WhatsApp is a primary share channel in Saudi Arabia — must have UTM-tagged short links for WhatsApp sharing |

**Why It Matters:** High paid-ad dependency is expensive and unsustainable early. Building organic through Arabic SEO and community presence (Saudi entrepreneur groups, Twitter/X Arabic tech communities) is more cost-effective.

---

### ACQ-04: Arabic vs. English Registrations

| Attribute | Value |
|---|---|
| Definition | Split of new registrations by preferred language (Arabic vs. English) |
| Current Baseline | Unknown |
| Target | ≥ 70% Arabic primary (reflects Saudi/MENA market composition) |
| Measurement | COUNT(users) GROUP BY preferred_language or first site language |

**Why It Matters:** Validates that Arabic-first positioning is resonating. If the ratio skews heavily English, the platform is attracting the wrong segment or the Arabic UX is not yet good enough.

---

### ACQ-05: Registration Abandonment Rate

| Attribute | Value |
|---|---|
| Definition | % of users who start the registration form but do not complete it |
| Current Baseline | Unknown |
| Target | < 30% abandonment |
| Measurement | Track form_start event (BROWSER) vs. registration_complete event. Requires basic event tracking. |

**Why It Matters:** High abandonment may indicate form complexity, trust issues, or poor mobile experience. Arabic-language form validation messages are critical for Arabic-speaking users who find English error messages confusing.

---

## Domain 2: Activation Metrics

Activation tracks whether new users experience the platform's core value — a live, professional website — within their first sessions. The "aha moment" for Safahati is when a user publishes their first site and sees it live.

---

### ACT-01: Time to First Site Created

| Attribute | Value |
|---|---|
| Definition | Median time from registration to first site creation (wizard completed) |
| Current Baseline | Not measured |
| Target | < 5 minutes (median) |
| Target (Stretch) | < 3 minutes with AI-assisted content generation |
| Measurement | DATEDIFF(sites.created_at, users.created_at) where site.user_id = user.id ORDER BY 1 LIMIT 1 |

**Why It Matters:** The site creation wizard is a multi-step flow. If it takes more than 10 minutes for a median user, the flow is too complex or the language barrier is creating friction. For Ahmad (low-tech Arabic user), this is especially critical.

---

### ACT-02: Activation Rate (First Site Published)

| Attribute | Value |
|---|---|
| Definition | % of registered users who publish at least one site within 14 days of registration |
| Current Baseline | Not measured (publishing not live) |
| Target | 35% within 7 days; 50% within 14 days |
| Industry Benchmark | SaaS activation rates: 20–40% within 14 days is typical for SME-targeted tools |
| Measurement | COUNT(users who have ≥1 site with status='published') ÷ COUNT(users registered ≥14 days ago) |

**Why It Matters:** This is the single most important activation metric. A user who publishes a site has experienced the platform's core value. Users who never publish almost never convert to paid plans.

---

### ACT-03: Sections Populated Per Site (Content Completeness)

| Attribute | Value |
|---|---|
| Definition | Average number of sections with non-placeholder content at time of first publish |
| Current Baseline | Not measured |
| Target | ≥ 4 sections populated (out of typically 5-7 per industry template) |
| Measurement | At publish time: COUNT(sections WHERE config JSONB has non-default values) per site |

**Why It Matters:** A site with only 1-2 filled sections is unlikely to generate leads for the owner, which means they won't see value and will churn. AI content generation is expected to increase this metric significantly.

---

### ACT-04: Time to First Site Published

| Attribute | Value |
|---|---|
| Definition | Median time from registration to first published site |
| Current Baseline | Not measured |
| Target | < 60 minutes (same-session first publish) |
| Measurement | DATEDIFF(sites.published_at, users.created_at) — requires `published_at` column |

**Why It Matters:** Safahati's competitive advantage is speed. If users can go from zero to live site in under an hour, the platform has a powerful "show, don't tell" marketing story. "Built my restaurant site in 45 minutes" is a compelling testimonial.

---

### ACT-05: Template Usage Distribution

| Attribute | Value |
|---|---|
| Definition | % of sites created per industry template |
| Current Baseline | Unknown |
| Measurement | COUNT(sites) GROUP BY industry |
| Expected Distribution | Restaurant, Freelancer, Clinic expected to be top 3 in Saudi market |

**Why It Matters:** Template popularity informs where to invest template quality improvements. If 40% of sites are Restaurant but the restaurant template is mediocre, that's a high-impact improvement opportunity.

---

## Domain 3: Retention Metrics

Retention tracks whether users continue to engage with the platform over time. For Safahati, retention has two dimensions: (1) site owners returning to update their sites, and (2) subscribers renewing their monthly plan.

---

### RET-01: Monthly Active Users (MAU)

| Attribute | Value |
|---|---|
| Definition | Number of unique users who log in or make at least one site edit in a given month |
| Current Baseline | Not measured |
| Target (Month 6) | 300 MAU |
| Target (Month 12) | 1,200 MAU |
| Measurement | COUNT(DISTINCT user_id) in session_events or site_edits WHERE month = [current month] |

**Why It Matters:** MAU is the health metric for the platform. A user base that grows in registrations but shrinks in MAU is a platform failing to retain. For SME site owners, monthly returns are driven by site updates (new menu items, new portfolio pieces, seasonal content).

---

### RET-02: Day-7 and Day-30 Retention

| Attribute | Value |
|---|---|
| Definition | % of users who return to the platform 7 days and 30 days after registration |
| Current Baseline | Not measured |
| Target (Day-7) | 45% |
| Target (Day-30) | 25% |
| Industry Benchmark | SaaS median: Day-7 ≈ 30–40%, Day-30 ≈ 15–25% |
| Measurement | Cohort analysis: take all users registered in week N; check who was active in week N+1 (Day 7) and week N+4 (Day 30) |

**Why It Matters:** Low Day-7 retention often indicates a gap between promise and delivery (e.g., subdomain routing not working, site looks broken). Low Day-30 retention indicates lack of recurring reasons to return.

---

### RET-03: Site Update Frequency

| Attribute | Value |
|---|---|
| Definition | Average number of section edits per active site per month |
| Current Baseline | Not measured |
| Target | ≥ 2 edits/month per active site |
| Measurement | COUNT(section_update_events) ÷ COUNT(active sites) per month |

**Why It Matters:** Sites that are never updated are at risk of abandonment. Owners who regularly update (adding portfolio pieces, changing the menu, running a Ramadan promotion) are deeply retained and very likely to keep their subscription.

---

### RET-04: Subscription Churn Rate

| Attribute | Value |
|---|---|
| Definition | % of paying subscribers who cancel or fail to renew in a given month |
| Current Baseline | N/A (billing not yet implemented) |
| Target | < 5% monthly churn (= < 46% annual churn) |
| Industry Benchmark | B2SME SaaS median: 3–8% monthly churn |
| Measurement | (Subscriptions lost in month ÷ Subscriptions at start of month) × 100 |

**Why It Matters:** Monthly churn of 5% means losing ~46% of subscribers per year. For a business plan user (Sara the agency owner) churning, the revenue loss is SAR 249/month. Reducing churn by even 2 percentage points significantly impacts LTV.

---

### RET-05: Net Revenue Retention (NRR)

| Attribute | Value |
|---|---|
| Definition | Revenue retained from existing customers month-over-month, including upgrades and downgrades |
| Formula | (Revenue from existing customers this month) ÷ (Revenue from those same customers last month) × 100 |
| Current Baseline | N/A |
| Target | ≥ 105% NRR (expansion revenue from upgrades exceeds churn loss) |

**Why It Matters:** NRR > 100% means the platform grows revenue from its existing user base even without new registrations. Sara upgrading from Pro to Business, or Ahmad adding a custom domain, drive expansion revenue that buffers against churn.

---

### RET-06: Published Site Longevity

| Attribute | Value |
|---|---|
| Definition | % of published sites that remain published after 90 days |
| Current Baseline | Not measured |
| Target | ≥ 80% of published sites remain published after 90 days |
| Measurement | COUNT(sites WHERE status='published' AND published_at ≤ 90 days ago) ÷ COUNT(all sites ever published) |

**Why It Matters:** If owners unpublish their sites within 90 days, the platform failed to deliver lasting value. This is an early warning sign of churn 1-2 months before subscription cancellation.

---

## Domain 4: Revenue Metrics

Revenue metrics track the platform's financial health and growth trajectory. Safahati is pre-revenue in terms of subscriptions but has a clear path to monetization.

---

### REV-01: Monthly Recurring Revenue (MRR)

| Attribute | Value |
|---|---|
| Definition | Total subscription revenue recognized in a given month |
| Formula | SUM(active subscriptions × monthly plan price) |
| Current Baseline | SAR 0 (billing not yet implemented) |
| Target (Month 3 after billing launch) | SAR 10,000/month |
| Target (Month 6) | SAR 40,000/month |
| Target (Month 12) | SAR 150,000/month |
| Currency | Saudi Riyal (SAR) |

**Why It Matters:** MRR is the primary financial health metric for a SaaS. SAR 150,000/month = SAR 1.8M ARR, which is a meaningful early-stage milestone for a Saudi-focused SaaS.

---

### REV-02: Average Revenue Per User (ARPU)

| Attribute | Value |
|---|---|
| Definition | Average monthly revenue per paying subscriber |
| Formula | MRR ÷ Number of paying subscribers |
| Current Baseline | N/A |
| Target | SAR 130/month (blend of Pro at SAR 99 and Business at SAR 249) |
| Measurement | Stripe dashboard + DB query |

**Why It Matters:** ARPU growth indicates successful upselling from Pro to Business, or successful agency plan adoption. Sara (Business plan) has 4x the ARPU of Layla (Pro plan).

---

### REV-03: Free-to-Paid Conversion Rate

| Attribute | Value |
|---|---|
| Definition | % of Starter (free) users who upgrade to a paid plan within 30 days |
| Current Baseline | N/A |
| Target | 15% within 30 days of publishing their first site |
| Industry Benchmark | Freemium SaaS: 2–5% of all free users; 10–20% of activated free users |
| Measurement | COUNT(users who upgraded) ÷ COUNT(users who published ≥1 site) |

**Why It Matters:** The free plan is a conversion funnel, not a permanent product. Users who publish a site and get traction (first client inquiry, first visitor) have a strong motivation to upgrade for a custom domain. The upgrade trigger must be at the right moment.

---

### REV-04: Customer Lifetime Value (LTV)

| Attribute | Value |
|---|---|
| Definition | Average total revenue generated by a customer over their lifetime |
| Formula | ARPU ÷ Monthly churn rate |
| Current Baseline | N/A |
| Target | SAR 2,000+ (ARPU SAR 130 ÷ 5% churn = SAR 2,600) |

**Why It Matters:** LTV determines how much can be spent on Customer Acquisition Cost (CAC) while remaining profitable. LTV:CAC ratio should be ≥ 3:1 for a healthy SaaS business.

---

### REV-05: Customer Acquisition Cost (CAC)

| Attribute | Value |
|---|---|
| Definition | Average cost to acquire one paying customer |
| Formula | Total sales & marketing spend ÷ New paying customers acquired |
| Current Baseline | Not tracked (no paid acquisition yet) |
| Target | < SAR 300 per paying customer (LTV:CAC ≥ 7:1) |
| Measurement | Marketing spend from receipts + Stripe new subscribers count |

**Why It Matters:** Saudi Instagram/Snapchat ads can be expensive. Knowing the CAC ensures the platform is growing efficiently. Organic (WhatsApp referrals, tech communities) has near-zero CAC and should be the primary growth engine early.

---

### REV-06: MRR Breakdown by Plan

| Attribute | Value |
|---|---|
| Definition | Distribution of MRR across plan tiers |
| Measurement | Stripe: GROUP BY price_id; calculate MRR contribution per tier |
| Target Mix (Month 12) | Starter (free): 60% of users; Pro: 30% of users; Business: 10% of users |
| Revenue Mix (Month 12) | Pro contributes ~35% of MRR; Business contributes ~60% of MRR |

**Why It Matters:** Business plan users (like Sara) drive disproportionate revenue. Tracking the mix helps identify if upsell efforts are working.

---

## Domain 5: Support Metrics

Support metrics track the health of the customer support function, which is critical for trust-building with Saudi SME users who have lower technical literacy and expect responsive, Arabic-language support.

---

### SUP-01: Ticket Volume by Category

| Attribute | Value |
|---|---|
| Definition | Number of support tickets received per month, segmented by category |
| Categories | Technical Issue, Billing, Feature Request, General |
| Current Baseline | 0 (no formal support system yet) |
| Target | < 5 tickets per 100 active users/month for Technical issues |
| Measurement | COUNT(tickets) GROUP BY category WHERE created_at IN [month] |

**Why It Matters:** High technical issue volume indicates product bugs or UX problems. High feature request volume indicates a gap between what users need and what exists. Billing issues indicate payment friction or confusion.

---

### SUP-02: First Response Time

| Attribute | Value |
|---|---|
| Definition | Median time from ticket submission to first agent response |
| Current Baseline | N/A |
| Target | < 4 hours (business hours, Riyadh timezone: GMT+3) |
| Target (Business plan) | < 1 hour |
| Measurement | MEDIAN(DATEDIFF(first_reply.created_at, ticket.created_at)) |

**Why It Matters:** Saudi business users expect responsive support. A 24-48 hour response time is acceptable for Western SaaS but creates churn risk in the MENA market where personal service is a key trust signal.

---

### SUP-03: Ticket Resolution Rate (within SLA)

| Attribute | Value |
|---|---|
| Definition | % of tickets resolved within the SLA window (24 hours for Normal, 4 hours for High) |
| Current Baseline | N/A |
| Target | ≥ 90% resolved within SLA |
| Measurement | COUNT(tickets resolved within SLA) ÷ COUNT(all tickets) × 100 |

**Why It Matters:** Meeting SLA commitments builds trust. Missing SLA creates frustration, especially for site owners whose live site is broken — every hour of downtime is a lost customer impression.

---

### SUP-04: Customer Satisfaction Score (CSAT)

| Attribute | Value |
|---|---|
| Definition | % of users who rate their support experience positively after ticket resolution |
| Method | Post-resolution email with single question: "Was this helpful? Yes / No" |
| Current Baseline | N/A |
| Target | ≥ 85% positive responses |
| Measurement | COUNT(positive responses) ÷ COUNT(all responses) × 100 |

**Why It Matters:** CSAT directly correlates with retention for SME users. A bad support experience is often the trigger for cancellation.

---

### SUP-05: Self-Service Deflection Rate

| Attribute | Value |
|---|---|
| Definition | % of users who visit the Help/FAQ page and do NOT subsequently submit a support ticket |
| Current Baseline | N/A (FAQ not yet built) |
| Target | ≥ 60% deflection (i.e., 60% of FAQ visitors resolve their issue without creating a ticket) |
| Measurement | Users who visited /help and did NOT create a ticket within 30 minutes ÷ total FAQ visitors |

**Why It Matters:** Every deflected ticket saves ~20-30 minutes of support agent time. A good Arabic-language FAQ can handle common questions about publishing, domain setup, and billing without human intervention.

---

### SUP-06: Support Load Per 100 Active Users

| Attribute | Value |
|---|---|
| Definition | Total tickets created in a month per 100 monthly active users |
| Current Baseline | N/A |
| Target | < 8 tickets per 100 MAU |
| Measurement | (Monthly ticket count ÷ MAU) × 100 |

**Why It Matters:** This normalizes support load as the platform scales. If this ratio increases over time, the product has increasing UX problems or bugs. If it decreases, the FAQ and product improvements are working.

---

## Reporting Dashboard Structure

The following dashboards should be built to track these KPIs. Initially, these can be simple SQL queries run weekly. As the platform grows, a lightweight BI tool (Metabase, self-hosted) is recommended.

### Weekly Report (Internal)

| Metric | Data Source | Owner |
|---|---|---|
| New registrations (7-day) | DB: users | Product |
| New sites created | DB: sites | Product |
| New sites published | DB: sites | Product |
| MRR (once billing is live) | Stripe | Finance |
| Support tickets opened | DB: support_tickets | Support |
| Support tickets resolved | DB: support_tickets | Support |

### Monthly Report (Business Review)

| Metric | Data Source |
|---|---|
| MAU (total + by plan) | DB: sessions or site_edits |
| Day-7 and Day-30 retention cohort | DB: users + edit events |
| Activation rate (% published within 14 days) | DB: users + sites |
| Free-to-paid conversion | DB: users + Stripe |
| MRR, ARPU, Churn | Stripe |
| CSAT score | Support ticket responses |
| Top 5 support categories | DB: support_tickets |
| Template usage distribution | DB: sites GROUP BY industry |

---

## Metric Maturity Roadmap

| Phase | What to Track | When |
|---|---|---|
| Now (Phase 0) | Registrations, sites created, sites published | From day 1 — add `updated_at` and `published_at` columns now |
| Phase 1 (Post-routing launch) | Activation rate, site longevity, template distribution | When subdomain routing is live |
| Phase 2 (Post-billing launch) | MRR, churn, ARPU, conversion rate, LTV | When Stripe integration is live |
| Phase 3 (Scale) | CAC, NRR, cohort retention, CSAT, self-service deflection | When MAU > 500 and support tickets > 50/month |

---

## North Star Metric

**Safahati's North Star Metric: "Number of active published sites"**

A site is "active" if it has been published and has had at least one content edit in the past 30 days.

**Why this metric:**
- It captures acquisition (site created), activation (site published), and retention (site actively maintained)
- It is a proxy for customer success — an actively maintained published site means the owner is getting value
- It is a leading indicator of revenue (active sites = happy owners = retained subscribers)
- It is immune to vanity inflation (a published-but-abandoned site doesn't count)

**Current:** 0 (platform not yet live with routing)
**Target Month 6:** 200 active published sites
**Target Month 12:** 800 active published sites
