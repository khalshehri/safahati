# Partnership Opportunities
## Document Owner: Business Development
## Version: 1.0 | April 2026

---

## Overview

Strategic partnerships are essential to Safahati's growth in a market where trust, local credibility, and ecosystem integration determine adoption. This document identifies and evaluates specific partnership opportunities across payment providers, infrastructure, SEO tools, Arabic content platforms, and Saudi government digital initiatives — with concrete recommendations on priority, approach, and expected value.

---

## Partnership Framework

Each partnership is evaluated on:

- **Strategic fit:** How well the partner's audience/capabilities align with Safahati's needs
- **Priority:** Critical / High / Medium / Low
- **Type:** Technology integration / Co-marketing / Reseller / Referral / Institutional
- **Estimated timeline to activate:** Weeks to first productive outcome
- **Effort required:** Engineering + BD time investment

---

## Category 1: Payment Providers

### 1.1 Moyasar — RECOMMENDED PRIORITY #1

**Type:** Technology integration (primary Saudi payment gateway)  
**Priority:** Critical  
**Timeline to activate:** 4–6 weeks (pending merchant account approval)

**About Moyasar:**
Moyasar is a Saudi-based payment gateway supporting Mada (the national debit network), Visa, Mastercard, Apple Pay, and STC Pay. It is widely used by Saudi SaaS companies and has a clean REST API. Unlike Stripe, Moyasar can acquire Mada transactions natively, which is essential for reaching the majority of Saudi customers who lack international credit cards.

**What Safahati Gets:**
- Mada debit card acceptance (95%+ penetration in Saudi Arabia)
- STC Pay acceptance (25M+ STC Pay users in Saudi Arabia)
- Apple Pay integration (Saudi iPhone penetration: 65%+)
- SAR-denominated billing natively
- Recurring subscription billing API
- ZATCA-compatible transaction data

**Integration Path:**
1. Register Moyasar merchant account (requires Saudi CR or letter from Saudi registered entity)
2. Complete KYB (Know Your Business) documentation
3. Integrate Moyasar Checkout or JS SDK alongside existing Stripe integration
4. Build subscription management webhooks for Moyasar (parallel to Stripe)
5. Ensure VAT invoice generation is triggered on Moyasar payment events

**Partnership ask (beyond technical integration):**
- Co-marketing: "Powered by Moyasar" badge + joint press release at launch
- Priority API support SLA
- Inclusion in Moyasar's partner directory and blog content

**Required:** Saudi Commercial Registration (CR). If Safahati does not yet have a Saudi CR, explore using a registered local partner's CR as a co-applicant, or accelerate the Saudi entity registration process.

---

### 1.2 HyperPay — Alternative/Backup to Moyasar

**Type:** Technology integration  
**Priority:** High (backup if Moyasar onboarding is delayed)  
**Timeline to activate:** 3–4 weeks

**About HyperPay:**
HyperPay is a UAE-headquartered payment gateway (acquired by Network International) with strong Saudi operations. Supports Mada, STC Pay, Visa, Mastercard. Slightly more complex API than Moyasar but faster merchant account approval for non-Saudi registered companies.

**Use case for Safahati:**
If Moyasar onboarding is delayed due to CR requirements, HyperPay can serve as the primary Saudi payments solution with a faster approval timeline.

**Note:** Do not integrate both Moyasar and HyperPay simultaneously — they serve the same function. Choose one and build a clean integration.

---

### 1.3 Tabby — BNPL Integration

**Type:** Technology integration  
**Priority:** Medium  
**Timeline to activate:** 6–8 weeks

**About Tabby:**
Tabby is the leading BNPL (Buy Now, Pay Later) provider in Saudi Arabia and UAE. Allows customers to split payments into 4 installments with no interest. Significant penetration among Saudi consumers aged 18–35.

**Application to Safahati:**
Tabby can be offered at checkout for annual plan purchases, effectively reducing the upfront payment for price-sensitive freelancers and SMEs. Annual plan price example:
- Annual Professional Plan: SAR 1,788/year
- With Tabby: 4 × SAR 447 (or 4 × SAR 357 if at a discount)

**Value:** Increases annual plan conversion from price-sensitive segments; reduces payment friction for large upfront amounts.

**Partnership ask:**
- Tabby merchant partnership (requires Saudi CR)
- Co-marketing via Tabby's merchant blog and social media
- "Pay with Tabby" badge on Safahati pricing page

---

### 1.4 Tamara — Secondary BNPL

**Type:** Technology integration  
**Priority:** Low  
**Timeline to activate:** 6–8 weeks

Tamara is Tabby's main competitor in Saudi BNPL. Similar product, slightly smaller user base. Integrate after Tabby is proven successful if there is demand for a second BNPL option.

---

### 1.5 STC Pay — Direct Integration

**Type:** Technology integration  
**Priority:** High  
**Timeline to activate:** 8–12 weeks

**About STC Pay:**
STC Pay is Saudi Arabia's leading digital wallet, operated by Saudi Telecom Company. 25M+ registered users. Supported by Moyasar and HyperPay as a payment method — so Safahati may already get STC Pay acceptance through Moyasar integration.

**Direct partnership value (beyond gateway):**
- STC Pay merchant partnership provides access to STC Pay's SME customer communications
- Co-marketing to STC Pay's 25M users (highly targeted Saudi SME audience)
- Potential for Safahati to be featured in STC Pay's merchant showcase

**Approach:** Begin with Moyasar's STC Pay integration. Pursue direct STC Pay merchant partnership separately for marketing benefits.

---

## Category 2: Infrastructure Partners

### 2.1 Hetzner — EXISTING PARTNER (Deepen Relationship)

**Type:** Infrastructure / Technology  
**Priority:** High  
**Timeline to activate:** Already active; deepen in 60 days

**Current relationship:** Safahati already runs on Hetzner VPS.

**Opportunity — Hetzner Cloud Object Storage:**
Safahati currently uses MinIO (self-hosted S3-compatible storage). As client storage needs grow, Hetzner's Object Storage (compatible with S3 API) could replace self-hosted MinIO:
- Cost: EUR 0.006/GB/month (significantly cheaper than AWS S3)
- S3-compatible API: drop-in replacement for MinIO
- EU-based with GDPR compliance (relevant for PDPL alignment)
- No egress fees to Hetzner network

**Partnership ask:**
- Hetzner startup program (up to EUR 500 credit)
- Technical blog partnership: "How Safahati Scales Multi-Tenant Websites on Hetzner"
- Referral arrangement: Safahati recommends Hetzner to agency clients for hosting

**Hetzner Startup Program:** Apply at hetzner.com/cloud/startup — they partner with tech startups and offer visibility in exchange for case studies.

---

### 2.2 Cloudflare — EXISTING PARTNER (Formalize)

**Type:** Infrastructure / Technology  
**Priority:** High  
**Timeline to activate:** 30 days to formalize

**Current relationship:** Cloudflare DNS and CDN are already in use for Safahati.

**Opportunity — Cloudflare for Startups:**
Cloudflare offers a startup program with up to USD 250,000 in credits plus access to advanced Cloudflare products:
- Cloudflare Workers (potential for edge-based multi-tenant routing)
- Cloudflare R2 (S3-compatible storage with zero egress fees — alternative to Hetzner Object Storage or MinIO)
- Cloudflare Images (automatic image optimization and WebP conversion — replaces the need for a custom image pipeline)
- DDoS protection for published client sites (important for high-traffic clients)
- Cloudflare Pages or Workers for edge rendering (performance optimization)

**Action:** Apply to Cloudflare for Startups at cloudflare.com/en-au/forstartups

**Note on Cloudflare R2:** If accepted into the startup program, Cloudflare R2 could replace MinIO entirely as the image and asset storage layer, eliminating self-hosted MinIO maintenance overhead.

---

### 2.3 Resend — EMAIL DELIVERY PARTNER

**Type:** Technology  
**Priority:** Medium (already planned in stack)  
**Timeline to activate:** Already integrated; formalize partnership

**Current status:** Resend is already in the Safahati tech stack for transactional email.

**Partnership ask:**
- Resend partner program: developer-focused partnership that provides visibility in Resend's documentation and social media
- Potential joint content: "How Safahati sends multilingual transactional email with Resend"
- Early access to new Resend features (email analytics, A/B testing)

---

### 2.4 STC Cloud (formerly Saudi Telecom Cloud) — FUTURE CONSIDERATION

**Type:** Infrastructure / Data residency  
**Priority:** Medium (relevant when PDPL compliance becomes a customer requirement)  
**Timeline to activate:** Q3 2026

**About STC Cloud:**
STC Cloud is Saudi Arabia's largest public cloud provider (operated by Saudi Telecom Company). Provides IaaS services with data centers physically located in Saudi Arabia — which is highly relevant for PDPL (Saudi Data Protection Law) compliance.

**Why it matters:**
Some regulated industries (healthcare, legal, government) may require that their data not leave Saudi Arabia. Offering a "Saudi-hosted" option via STC Cloud would be a meaningful differentiator for the Clinic and Law Firm verticals.

**Approach:** Not an immediate infrastructure priority (Hetzner EU hosting is sufficient for launch). Evaluate in Q3 2026 when clinic and law firm customer volume justifies the compliance investment.

---

## Category 3: SEO and Digital Marketing Tools

### 3.1 Semrush / Ahrefs — Arabic Keyword Intelligence

**Type:** Tool partnership / Content co-creation  
**Priority:** Medium  
**Timeline to activate:** 60 days

**Opportunity:**
Both Semrush and Ahrefs have active partner programs and are hungry for Arabic-language market data case studies. Safahati, with visibility into Arabic keyword performance across 13 industries, has unique data that these tools would find valuable.

**Partnership structure:**
- Safahati writes guest posts on Semrush/Ahrefs blog: "Arabic SEO for SMEs in Saudi Arabia"
- In exchange: discounted or free tool access, co-marketing via their newsletter
- Potential: become a featured Semrush partner in the Arabic market segment

**Value to Safahati:** Free links (high-authority backlinks for SEO), tool access, audience exposure to Arabic-speaking marketers

---

### 3.2 Google — Google for Startups and Search Console Integration

**Type:** Institutional / Tool integration  
**Priority:** High  
**Timeline to activate:** 30 days

**Google for Startups:**
Apply to Google for Startups (cloud credits program). Provides USD 200,000 in Google Cloud credits plus access to Google's startup support programs.

**Google Search Console Integration:**
Offer direct Google Search Console setup for every published Safahati site:
- Auto-submit sitemap.xml to Google Search Console on site publish
- Potentially allow site owners to verify domain ownership via Safahati admin
- Create partnership with Google's Arabic market team (Google has a large Riyadh office)

**Arabic SEO Partnership:** Google actively wants to improve Arabic web quality. Safahati building quality bilingual Arabic sites aligns with this — approach Google's Saudi market team about co-marketing.

---

### 3.3 Plausible Analytics — Self-Hosted Partnership

**Type:** Technology / Open-source  
**Priority:** Already planned  
**Timeline to activate:** During Phase 2 implementation

**Opportunity:**
Plausible Community Edition is self-hosted on Safahati's Hetzner VPS. When Safahati grows:
- Consider Plausible Cloud for scale (reducing self-hosted maintenance overhead)
- Plausible has an active partner program for SaaS platforms that embed their analytics
- Potential for co-marketing: "Safahati + Plausible: Privacy-Friendly Analytics for Arabic Websites"

---

## Category 4: Arabic Content and Media Platforms

### 4.1 Gig Arabia / Freelance Arabia — COMMUNITY PARTNERSHIP

**Type:** Co-marketing / Referral  
**Priority:** High  
**Timeline to activate:** 30–45 days

**About:**
Gig Arabia and Freelance Arabia are Arabic-language communities and platforms for Saudi and GCC freelancers, with combined audiences of 500,000+ across social media channels.

**Partnership structure:**
- Safahati sponsors Gig Arabia weekly newsletter (Arabic, 50K+ subscribers)
- Freelance Arabia community: offer Safahati members a 20% discount on first 3 months
- Guest posts: "كيف تبني موقعك الشخصي كمستقل في 60 دقيقة" (How to build your freelancer site in 60 minutes)
- Joint webinar: recorded tutorial for Freelance Arabia community

**Expected value:** 200–400 qualified leads per quarter from freelancer segment; high trust because of community endorsement

---

### 4.2 Wamda — Arabic Tech Media Partnership

**Type:** PR / Co-marketing  
**Priority:** Medium  
**Timeline to activate:** 30 days

**About Wamda:**
Wamda is the leading English/Arabic media outlet for MENA tech entrepreneurs and startups. Highly respected in Saudi and UAE startup ecosystems.

**Partnership structure:**
- Safahati launch story: submit a press release for editorial coverage at launch
- Guest post series: "The State of Digital Presence for Saudi SMEs in 2026"
- Wamda Events: potential speaking opportunity at Wamda Gatherings
- Long-term: Safahati data report (aggregate, anonymized) on MENA SME website adoption — publishable research that creates brand authority

---

### 4.3 Argaam — Financial / Business Media

**Type:** PR / Content  
**Priority:** Medium  
**Timeline to activate:** 45 days

**About Argaam:**
Argaam is Saudi Arabia's leading Arabic-language financial news platform (1M+ monthly readers). Reaches the exact SME owner and investor audience Safahati targets.

**Partnership opportunity:**
- Sponsored content: Arabic article "المنصات الرقمية التي يحتاجها صاحب العمل السعودي"
- Data contribution: Safahati publishes quarterly "Saudi SME Digital Presence Index" — a data-backed report on how many Saudi SMEs have websites by industry, which Argaam would cover
- Advertising: Argaam's business owner audience is a high-quality match for Safahati's target segment

---

### 4.4 Arabic Google Fonts / Typography Providers

**Type:** Technology  
**Priority:** Medium  
**Timeline to activate:** Ongoing

Arabic typography is a critical quality signal for the platform. Poor Arabic fonts undermine credibility.

**Actions:**
- Curate a set of 5–8 high-quality Arabic/Latin font pairings for Safahati templates (from Google Fonts, which has excellent Arabic fonts: Tajawal, Cairo, IBM Plex Arabic, Almarai)
- Document font pairing guidelines for template designers
- Consider partnership with Monotype or a premium Arabic type foundry for exclusive font access (differentiator for Pro/Agency plans)

---

## Category 5: Saudi Government Digital Initiatives

### 5.1 Monsha'at (SME General Authority) — PRIORITY GOVERNMENT PARTNER

**Type:** Institutional  
**Priority:** Critical  
**Timeline to activate:** 60–90 days (government partnership processes are slow; start immediately)

**About Monsha'at:**
Monsha'at is the Saudi government authority responsible for SME development. It maintains a platform (msmesupport.sa) listing recommended digital services, has 1.3M+ registered SMEs, and runs training programs, accelerators, and digital services initiatives.

**Partnership opportunity:**
1. **Monsha'at Service Directory listing:** Apply to be listed as a recommended "digital presence" service. Being listed gives Safahati access to government-endorsed recommendation to 1.3M+ SMEs.
2. **Training partnership:** Offer Safahati as the practical tool in Monsha'at's digital skills training workshops
3. **Co-marketing:** Monsha'at newsletter reaches Saudi business owners who are actively seeking digital tools
4. **National Entrepreneurship Program (Riyadah):** Safahati as a recommended tool for program graduates

**Approach:**
- Attend Monsha'at events and meet program managers
- Submit formal partnership application via Monsha'at's SME ecosystem portal
- Offer 6 months free for Monsha'at-referred signups (Monsha'at's endorsement is worth this cost)

---

### 5.2 HRDF — Human Resources Development Fund (Freelance Program)

**Type:** Institutional / Co-marketing  
**Priority:** High  
**Timeline to activate:** 60–90 days

**About HRDF Freelance Program:**
HRDF manages Saudi Arabia's Freelance Work Program, which has registered 2M+ Saudi freelancers. The program provides training, certification, and access to digital tools for freelancers.

**Partnership opportunity:**
- List Safahati as a recommended portfolio platform for HRDF-certified freelancers
- HRDF training courses include "how to build your digital presence" — Safahati as the recommended tool
- Co-marketing to HRDF's freelancer email database (2M+ recipients)

**Value:** Direct access to the largest pool of potential freelancer customers. Even a 0.1% conversion rate from HRDF's database = 2,000 new customers.

---

### 5.3 SDAIA — Saudi Data and AI Authority

**Type:** Institutional / Regulatory  
**Priority:** Medium  
**Timeline to activate:** 90+ days

**About SDAIA:**
SDAIA is responsible for Saudi Arabia's data strategy, AI national program (National Strategy for Data and AI — NSDAI), and PDPL enforcement.

**Relevance to Safahati:**
- PDPL compliance: as Safahati handles personal data of Saudi SMEs and their website visitors, building a relationship with SDAIA ensures Safahati is informed of compliance requirements early
- NSDAI AI recognition: if Safahati's AI copy generation for Arabic is notable, it may qualify for SDAIA's AI national program recognition (prestige + government visibility)

**Approach:** Engage SDAIA's SME liaison program; ensure Safahati's data practices are documented and compliant before any government outreach.

---

### 5.4 CITC — Communications and Information Technology Commission

**Type:** Regulatory  
**Priority:** Medium  
**Timeline to activate:** Ongoing

**About CITC:**
CITC regulates internet services, domain registrations, and technology providers in Saudi Arabia.

**Relevance:**
- .sa domain registration: Safahati could partner with a CITC-accredited .sa domain registrar to offer Saudi domain registration within the platform (domain purchase during site setup)
- Regulatory clarity: understanding CITC's framework for platform-as-a-service businesses operating in Saudi Arabia

**Action:** Monitor CITC regulations; consult a Saudi tech lawyer before launching the Agency plan (to ensure Safahati's business model does not require a CITC platform license).

---

### 5.5 Endeavor Saudi Arabia

**Type:** Institutional / Network  
**Priority:** Medium  
**Timeline to activate:** 60 days

**About Endeavor:**
Endeavor is a global high-impact entrepreneurship organization with a strong Saudi chapter. Endeavor Saudi Arabia has deep relationships with Saudi corporates, investors, and government officials.

**Partnership opportunity:**
- Apply for Endeavor's ScaleUp program or mentorship network
- Access to Endeavor's corporate partners (potential enterprise clients)
- Visibility in the Saudi startup and SME ecosystem
- Potential for Endeavor to feature Safahati in their portfolio showcase

---

## Partnership Priority Summary

| Partner | Type | Priority | Key Action | Timeline |
|---|---|---|---|---|
| Moyasar | Payment gateway | Critical | Register merchant account, begin integration | Immediate |
| Monsha'at | Government/institutional | Critical | Submit partnership application, attend events | 60–90 days |
| Hetzner | Infrastructure | High | Apply to startup program, deepen relationship | 30 days |
| Cloudflare | Infrastructure | High | Apply to for Startups program | 30 days |
| HRDF Freelance Program | Government/co-marketing | High | Contact program manager, submit listing application | 60 days |
| Tabby | BNPL | Medium | Register merchant account, integrate into annual plan checkout | 6–8 weeks |
| STC Pay (direct) | Payment/co-marketing | High | Apply to STC Pay merchant partner program | 8 weeks |
| Gig Arabia / Freelance Arabia | Community/co-marketing | High | Reach out for newsletter sponsorship and affiliate deal | 30–45 days |
| HyperPay | Payment gateway (backup) | High | Pre-qualify merchant account as Moyasar backup | 4 weeks |
| Wamda | PR/media | Medium | Submit launch press release; pitch guest post | 30 days |
| Google for Startups | Infrastructure credits | High | Submit application | 30 days |
| Argaam | PR/media | Medium | Sponsored content; quarterly data report pitch | 45 days |
| SDAIA | Regulatory/institutional | Medium | Document PDPL compliance; register for NSDAI recognition | 90 days |
| Endeavor Saudi | Network/institutional | Medium | Apply to ScaleUp program | 60 days |
| STC Cloud | Infrastructure (future) | Medium | Evaluate for PDPL-sensitive industry clients | Q3 2026 |
| CITC | Regulatory | Medium | Consult lawyer; monitor regulations | Ongoing |

---

## Partnership Activation Tracker (Template)

| Partner | Contact Person | Status | Next Action | Due Date |
|---|---|---|---|---|
| Moyasar | BD contact | Not started | Register merchant account | May 10, 2026 |
| Monsha'at | Program manager | Not started | Attend Riyadh Monsha'at event | May 20, 2026 |
| Hetzner | startup@hetzner.com | Not started | Submit startup program application | May 5, 2026 |
| Cloudflare | Startup program form | Not started | Submit application | May 5, 2026 |
| Gig Arabia | Community manager | Not started | Direct message on Twitter/X | May 7, 2026 |
| HRDF | partnerships@hrdf.org.sa | Not started | Send formal partnership proposal | May 15, 2026 |
