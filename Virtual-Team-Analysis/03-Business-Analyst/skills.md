# Business Analyst — Skills Profile
## Safahati Platform | Role-Specific Competencies

---

## Overview

The Business Analyst (BA) role on the Safahati project bridges product strategy and technical execution. This document defines the specific skills required for a BA working on a multi-tenant, config-driven SaaS platform targeting the MENA/Saudi market. These are not generic BA skills — they are calibrated to the exact challenges of building and growing Safahati.

---

## 1. SaaS Product Requirements

### 1.1 Multi-Tenant Architecture Understanding
The BA must understand how multi-tenancy affects every requirement. A feature request from one client cannot be shipped in a way that breaks another. Requirements must always be framed in terms of tenant isolation, shared infrastructure, and config-driven customization.

- Ability to distinguish between platform-level features (affect all tenants) and tenant-level features (scoped to one client's config)
- Understanding of JSONB-based configuration schemas and what "configurable" means vs. what must be hardcoded
- Familiarity with subdomain routing patterns and how slug-based routing maps to DB records
- Awareness of shared resource concerns: CDN caching, rate limiting, database connection pooling

### 1.2 Subscription and Pricing Model Requirements
Safahati operates on a monthly SaaS subscription model. The BA must be able to write requirements for the full subscription lifecycle.

- Freemium vs. paid tier gating logic (e.g., maximum number of sites per plan, template access restrictions)
- Stripe integration requirements: checkout sessions, webhooks, subscription state management
- Grace period and dunning requirements (what happens when payment fails)
- Plan upgrade/downgrade flows and how they affect existing site configurations
- Invoice and billing history requirements

### 1.3 Platform Lifecycle Requirements
- Site creation wizard requirements (step-based flows with validation)
- Onboarding and activation funnel requirements (first-value delivery)
- Site publishing requirements: draft → review → published state machine
- Admin dashboard feature requirements without scope creep toward a visual drag-and-drop editor

### 1.4 AI-Assisted Features
- Requirements for AI content generation within a constrained config schema
- Prompt engineering constraints (output must fit Zod-validated config fields)
- User expectation management: AI generates a draft, user edits — not a one-click solution
- Cost-per-generation budgeting requirements (Claude API token usage)

---

## 2. Bilingual UX Requirements

### 2.1 Arabic RTL + English LTR
Bilingual support is not an afterthought on Safahati — it is a core feature. The BA must write requirements that account for both languages at every level.

- Every user-facing string must have an Arabic and English version in the config schema
- UI layout requirements must specify RTL behavior for Arabic and LTR for English (flexbox direction, text alignment, icon mirroring)
- Form validation messages, error states, and tooltips must all be bilingual
- Date formatting: Gregorian calendar for English; Hijri/Gregorian hybrid for Arabic where contextually relevant
- Number formatting: Arabic-Indic numerals (`١٢٣`) for some Arabic contexts; standard numerals in data-heavy interfaces
- Requirements must specify which language is the "primary" display for each industry (e.g., a restaurant in Jeddah defaults to Arabic; a tech startup in Riyadh may default to English)

### 2.2 Content Management Requirements
- Site owners must be able to enter content in both languages independently
- Fields with missing translations must fall back gracefully (e.g., show English if Arabic is missing, with a visual indicator in the admin)
- Language toggle on the published site must be a first-class requirement, not an afterthought
- Language selection during site creation must propagate to default template language

### 2.3 Typography and Font Requirements
- Arabic fonts (Noto Sans Arabic, Tajawal, Cairo) must be specified in requirements alongside Latin fonts
- Line height, letter spacing, and font size requirements differ for Arabic text — the BA must flag these in UX requirements
- Right-to-left navigation menus, breadcrumbs, and pagination must be explicitly specified

---

## 3. Multi-Tenant Systems Knowledge

### 3.1 Data Isolation Requirements
- Requirements must specify tenant data isolation: no user should ever see or access another tenant's data
- Row-level security (RLS) at the database layer must be a non-functional requirement on every data-access story
- Audit logging requirements for admin actions that cross tenant boundaries

### 3.2 Configuration-Driven Feature Requirements
- The BA must be able to write requirements in terms of config changes, not code changes
- Understanding of the block registry pattern: block type + template ID + config JSONB
- Requirements for adding new component types must include the config schema definition
- Template inheritance and override requirements (platform default vs. tenant customization)

### 3.3 Subdomain and Domain Requirements
- Requirements for subdomain provisioning at site creation (slug → client.safahati.com)
- Custom domain support requirements: DNS CNAME verification, SSL provisioning via Let's Encrypt
- Redirect and canonical URL requirements for SEO

### 3.4 Performance at Scale Requirements
- Requirements must account for cold-start costs of serving many tenants from one deployment
- Redis caching requirements: which config objects are cached, TTL values, cache invalidation triggers
- Image optimization requirements: MinIO storage, CDN delivery, responsive image srcsets

---

## 4. MENA Market Knowledge

### 4.1 Saudi/Gulf Business Context
- Target users are SMEs, freelancers, clinics, restaurants, and agencies in Saudi Arabia and the wider GCC
- Many clients are non-technical; requirements must assume low digital literacy in the admin UI
- WhatsApp is the dominant business communication channel in Saudi Arabia — requirements for WhatsApp CTAs, click-to-chat links, and WhatsApp Business integration are high priority
- Google Maps embed and address fields must support Arabic place names
- Saudi-specific industries: real estate (عقارات), clinics (عيادات), law firms (محامون), gyms (نوادي رياضية)

### 4.2 Payment and Financial Requirements
- Stripe is available in Saudi Arabia (SAR currency supported)
- Some clients prefer Moyasar or HyperPay (local Saudi payment gateways) — the BA must capture these as future requirements
- VAT (15% in Saudi Arabia) must be factored into subscription pricing and invoicing requirements
- Requirements for Saudi CR (Commercial Registration) number collection during onboarding

### 4.3 Regulatory and Compliance Requirements
- PDPL (Personal Data Protection Law, Saudi Arabia) equivalent to GDPR — data residency, consent, and deletion rights
- Data must be stored in-region where possible (Hetzner Nuremberg is acceptable early-stage; Saudi/UAE region preferred at scale)
- Cookie consent requirements: less strict than EU GDPR, but still a requirement for any analytics tracking
- Terms of Service and Privacy Policy requirements in both Arabic and English

### 4.4 Cultural and Contextual Requirements
- Islamic calendar awareness: Ramadan, Eid — sites may need to display seasonal content blocks
- Prayer time sensitivity: push notifications or time-sensitive campaigns must respect Saudi prayer times
- Gender-separated content contexts (e.g., some clinics, gyms) — requirements must allow site owners to control this
- Trust signals for Saudi users: physical address, phone number, and social media links are expected on every site — these must be surfaced as high-priority config fields

---

## 5. Core BA Competencies Applied to Safahati

| Competency | Safahati-Specific Application |
|---|---|
| Requirements elicitation | Interviews with target users (freelancers, restaurant owners, agency managers) |
| User story writing | Stories must include bilingual AC and tenant-isolation notes |
| Gap analysis | Mapping current working features against the 13 industry templates |
| Process mapping | Site creation, publishing, subscription, and support flows |
| KPI definition | Activation, retention, and MRR metrics for a B2SME SaaS |
| Stakeholder management | Platform owner (khalshehri), future sales team, end clients |
| Data modeling literacy | Understanding Drizzle ORM schema, JSONB config fields, section sort order |
| Acceptance criteria writing | Bilingual, accessible, RTL-correct, and performant — all as testable criteria |
| Prioritization (MoSCoW) | Must/Should/Could/Won't applied across the 31 component types |
| Risk assessment | Tenant data leakage, payment failure, Arabic font rendering, mobile responsiveness |
