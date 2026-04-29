# Risk Assessment & Mitigation

**Format:** Risk ID | Description | Probability (H/M/L) | Impact (H/M/L) | Exposure | Owner | Mitigation

---

## Technical Risks

### RT-01: PostgreSQL Migration Failure
- **Probability:** M | **Impact:** H | **Exposure:** HIGH
- **Description:** Data loss or corruption during SQLite → PostgreSQL migration, especially given schema drift (9 untracked columns).
- **Mitigation:** Full SQLite backup before migration. Dry-run migration in staging with production data copy. Schema sync must be completed and tested before migration. Keep SQLite as fallback for 1 week post-migration.
- **Owner:** BE

### RT-02: Subdomain Wildcard SSL Failure
- **Probability:** M | **Impact:** H | **Exposure:** HIGH
- **Description:** Let's Encrypt DNS challenge for `*.safahati.com` fails or SSL cert renewal fails, taking all client sites offline.
- **Mitigation:** Use Cloudflare SSL as primary (proxied). Let's Encrypt as backup. Set up cert expiry monitoring (UptimeRobot). Test renewal in staging before production.
- **Owner:** DevOps

### RT-03: NextAuth v5 Beta Breaking Changes
- **Probability:** H | **Impact:** M | **Exposure:** HIGH
- **Description:** NextAuth v5 is in beta (`^5.0.0-beta.30`). Breaking changes in minor versions could break auth. Currently using `better-sqlite3` adapter manually.
- **Mitigation:** Pin exact NextAuth version. Test upgrades in staging. Consider migrating to stable v4 if v5 stable is delayed past Q3 2026.
- **Owner:** FE + BE

### RT-04: tsParticles Performance on Low-End Devices
- **Probability:** H | **Impact:** M | **Exposure:** MEDIUM
- **Description:** 25 hero templates use tsParticles + GSAP. Saudi users on mid-range Android devices may experience poor performance, leading to bad first impression of client sites.
- **Mitigation:** `prefers-reduced-motion` already implemented. Add lazy loading for particle engine. Provide static fallback for devices with GPU issues. Cap particle count to 50 on mobile.
- **Owner:** FE

### RT-05: Schema-Driven Editor Complexity
- **Probability:** M | **Impact:** M | **Exposure:** MEDIUM
- **Description:** The config-driven architecture requires every template to have a Zod schema and form renderer. As the template library grows (112 → 200+), maintaining schema consistency becomes a bottleneck.
- **Mitigation:** Establish strict code standards for template schema files. Add automated schema validation tests. Consider a template scaffolding CLI tool.
- **Owner:** FE + BE

---

## Business Risks

### RB-01: Slow Market Adoption (Low Conversion)
- **Probability:** M | **Impact:** H | **Exposure:** HIGH
- **Description:** Saudi SME market is accustomed to free tools or one-time payments. Monthly SaaS subscription model may face cultural resistance.
- **Mitigation:** Offer 14-day free trial with no credit card. Annual plan with 2-month discount. First 100 customers at 50% discount. Community-based referral program. Consider one-time plan for simple use cases.
- **Owner:** BD + PO

### RB-02: Competition from Zid/Salla Expanding to Websites
- **Probability:** M | **Impact:** H | **Exposure:** HIGH
- **Description:** Zid and Salla dominate Saudi e-commerce. If they add website builder features for non-e-commerce businesses, Safahati's market narrows.
- **Mitigation:** Focus on verticals Zid/Salla don't serve (freelancers, clinics, law firms, photographers). Build deep Arabic AI copy capabilities — harder to replicate. Move fast on agency/white-label plan.
- **Owner:** BD

### RB-03: Moyasar/Stripe Integration Delays
- **Probability:** M | **Impact:** H | **Exposure:** HIGH
- **Description:** Payment provider integration (especially Moyasar, which requires Saudi business registration and compliance approval) could delay monetization by 4-8 weeks.
- **Mitigation:** Start Moyasar application process immediately (requires CRNO). Use Stripe as primary while Moyasar approval is pending. Offer bank transfer as fallback for early customers.
- **Owner:** BD + BE

### RB-04: PDPL Compliance Risk
- **Probability:** L | **Impact:** H | **Exposure:** MEDIUM
- **Description:** Saudi Personal Data Protection Law (PDPL) requires data residency and specific consent flows. Non-compliance could result in fines.
- **Mitigation:** Data residency on Hetzner (Frankfurt initially, KSA region when available). Add explicit consent checkboxes to registration. Privacy policy reviewed by legal counsel before launch. Assess STC Cloud for KSA-resident data.
- **Owner:** BA + BD

### RB-05: Single Developer Bottleneck
- **Probability:** H | **Impact:** H | **Exposure:** HIGH
- **Description:** The critical path (schema fix, subdomain routing, PostgreSQL, Stripe, RTL dashboard) is ~15 working days of work. One developer means no parallel progress and high key-person risk.
- **Mitigation:** Prioritize ruthlessly — no scope creep during Phase 1. Document all architecture decisions (ADRs in BE analysis). Hire a second developer before Phase 2. Consider contractors for specific deliverables (Stripe integration, design).
- **Owner:** PO

---

## Operational Risks

### RO-01: No Monitoring — Silent Production Failures
- **Probability:** H | **Impact:** H | **Exposure:** CRITICAL
- **Description:** Currently zero production monitoring. A server crash, DB failure, or payment webhook error could go undetected for hours.
- **Mitigation:** Sentry for errors (Sprint 1). UptimeRobot for uptime. Health check endpoint `/api/health`. Grafana + Loki for logs. PagerDuty or Slack alerts for P1 incidents.
- **Owner:** App Support + DevOps

### RO-02: No Backup Strategy
- **Probability:** L | **Impact:** H | **Exposure:** HIGH
- **Description:** No automated DB backups documented. A corrupted or deleted SQLite/PostgreSQL DB would mean total data loss.
- **Mitigation:** Daily automated PostgreSQL dumps to MinIO/S3. Test restore procedure monthly. 30-day retention. Point-in-time recovery enabled on PostgreSQL.
- **Owner:** DevOps

### RO-03: Arabic Content Quality in AI Generation
- **Probability:** M | **Impact:** M | **Exposure:** MEDIUM
- **Description:** AI-generated Arabic copy may be grammatically correct but culturally inappropriate, use wrong dialect (Modern Standard vs Gulf), or miss cultural sensitivities.
- **Mitigation:** Human review of AI prompts by a native Arabic speaker. Add "tone" option (formal/informal). Allow users to regenerate. Never auto-populate — always show generated copy as a suggestion.
- **Owner:** BA + PO

---

## Risk Summary Matrix

| ID | Risk | Exposure | Status |
|---|---|---|---|
| RT-01 | PostgreSQL migration failure | HIGH | Plan in BE/02-Database-Optimization.md |
| RT-02 | SSL wildcard failure | HIGH | Cloudflare as primary SSL layer |
| RT-03 | NextAuth v5 beta | HIGH | Pin version, monitor changelog |
| RB-01 | Low conversion | HIGH | Free trial + referral program |
| RB-02 | Competition from Zid/Salla | HIGH | Vertical focus + AI differentiation |
| RB-03 | Moyasar delays | HIGH | Start application immediately |
| RB-05 | Single developer | HIGH | Hire second dev before Phase 2 |
| RO-01 | No monitoring | CRITICAL | Sentry in Sprint 1 — non-negotiable |
| RO-02 | No backups | HIGH | Automated daily backups before PostgreSQL |
| RT-04 | tsParticles performance | MEDIUM | Motion preference + mobile caps |
| RT-05 | Schema complexity growth | MEDIUM | Code standards + scaffolding CLI |
| RB-04 | PDPL compliance | MEDIUM | Legal review before public launch |
| RO-03 | Arabic AI quality | MEDIUM | Human review of prompts |
