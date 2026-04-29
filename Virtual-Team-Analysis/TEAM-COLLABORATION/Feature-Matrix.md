# Feature Matrix — Impact vs Effort

All features scored by combined team input. Impact (1-5): business value + user value. Effort (1-5): engineering complexity + time. Score = Impact ÷ Effort (higher = do first).

---

## Scoring Matrix

| # | Feature | Impact | Effort | Score | Priority | Owner Roles |
|---|---|---|---|---|---|---|
| F-01 | Fix schema drift | 5 | 1 | 5.0 | P0 | BE |
| F-02 | Subdomain routing | 5 | 2 | 2.5 | P0 | BE |
| F-03 | SQLite → PostgreSQL | 5 | 2 | 2.5 | P0 | BE |
| F-04 | Zod API validation | 4 | 1 | 4.0 | P0 | BE |
| F-05 | Fix tsParticles TS errors | 3 | 1 | 3.0 | P0 | FE |
| F-06 | Site publishing flow | 5 | 2 | 2.5 | P1 | FE + BE |
| F-07 | Stripe integration | 5 | 3 | 1.7 | P1 | BE |
| F-08 | Error tracking (Sentry) | 4 | 1 | 4.0 | P1 | DevOps |
| F-09 | Arabic RTL dashboard | 5 | 3 | 1.7 | P1 | FE |
| F-10 | Moyasar (Mada/STC Pay) | 4 | 2 | 2.0 | P1 | BE |
| F-11 | AI copy generation | 5 | 3 | 1.7 | P2 | FE + BE |
| F-12 | User onboarding flow | 4 | 2 | 2.0 | P2 | FE + UX/UI |
| F-13 | Custom domain support | 4 | 3 | 1.3 | P2 | BE + DevOps |
| F-14 | Basic analytics | 4 | 2 | 2.0 | P2 | FE + BE |
| F-15 | Automated test suite | 3 | 3 | 1.0 | P2 | QA |
| F-16 | Live editor preview | 4 | 3 | 1.3 | P2 | FE |
| F-17 | SEO meta fields | 3 | 1 | 3.0 | P2 | FE |
| F-18 | WhatsApp integration | 3 | 1 | 3.0 | P2 | FE |
| F-19 | Image upload (MinIO) | 4 | 2 | 2.0 | P2 | FE + BE |
| F-20 | Rate limiting | 3 | 1 | 3.0 | P2 | BE |
| F-21 | White-label / Agency plan | 4 | 4 | 1.0 | P3 | FE + BE |
| F-22 | Redis caching | 3 | 2 | 1.5 | P3 | BE |
| F-23 | Mobile dashboard | 3 | 2 | 1.5 | P3 | FE |
| F-24 | Drag-and-drop reorder | 3 | 2 | 1.5 | P3 | FE |
| F-25 | Mobile app | 2 | 5 | 0.4 | Won't | — |
| F-26 | Drag-and-drop editor | 1 | 5 | 0.2 | Won't | — |

---

## Quick Wins (High Impact, Low Effort — Do Immediately)

| Feature | Why Now |
|---|---|
| Fix schema drift | 1 day, prevents production failure |
| Zod validation on APIs | 1 day, closes major security gap |
| Error tracking (Sentry) | Half a day, immediate production visibility |
| Fix tsParticles TS errors | 1 day, cleans up 25+ warning files |
| SEO meta fields | 1 day, every paying customer needs this |
| WhatsApp integration | 1 day, critical for MENA market |
| Rate limiting | 1 day, basic security hygiene |

**Total: ~7 days for 7 high-value improvements.**

---

## Won't Build (Explicit Exclusions)

| Feature | Reason |
|---|---|
| Drag-and-drop visual editor | Architectural incompatibility with config-driven model. Adds 3-6 months of complexity for marginal differentiation. Wix does this better. |
| Native mobile app | Web-first market. Saudi SMEs use desktop for business tasks. Budget better spent on mobile-responsive web. |
| E-commerce / shopping cart | Out of scope for current positioning. Zid and Salla own this space in MENA. |
| Multi-language beyond AR/EN | Insufficient demand in target market to justify complexity. |
| Plugin/extension marketplace | Premature. Requires stable API and large developer community first. |

---

## Feature Dependencies Map

```
Subdomain routing ──────────────────→ Site publishing
                                      ↓
PostgreSQL migration ────────────────→ Redis caching
                                      ↓
Stripe integration ──────────────────→ White-label plan
       ↓
Moyasar integration

AI copy generation ──────────────────→ Requires Zod validation
                                      → Requires PostgreSQL (quota tracking)

Custom domains ──────────────────────→ Requires subdomain routing
                                      → Requires SSL automation

Analytics ───────────────────────────→ Requires site publishing live
```
