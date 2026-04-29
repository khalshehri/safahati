# Implementation Timeline — Q2–Q4 2026

Assumes 1 full-stack developer + 1 part-time designer. Sprints are 2 weeks.

---

## Phase 1 — Foundation & Launch Readiness (May–June 2026)

**Goal:** Make the platform shippable. No new features until this phase is complete.

### Sprint 1 (May 1–14): Critical Bug Fixes
| Task | Owner | Days | Refs |
|---|---|---|---|
| Fix schema drift — sync Drizzle schema with DB | BE | 1 | BUG-004, R-01 |
| Migrate middleware.ts → proxy.ts | BE | 0.5 | BUG-003 |
| Fix tsParticles v3 API across all demo files | FE | 1 | BUG-002 |
| Add Zod validation to all API routes | BE | 2 | R-04 |
| Add error boundaries to all page routes | FE | 1 | BUG-005 |
| Add loading states to editor page | FE | 0.5 | BUG-006 |
| Set up Sentry error tracking | DevOps | 0.5 | R-10 |

**Sprint 1 Gate:** Zero open P1/P2 bugs. TypeScript compiles clean. Sentry receiving events.

### Sprint 2 (May 15–28): Core Infrastructure
| Task | Owner | Days | Refs |
|---|---|---|---|
| SQLite → PostgreSQL migration | BE | 3 | R-03 |
| Subdomain routing (proxy.ts + Nginx wildcard) | BE | 3 | R-02 |
| Wildcard SSL (Let's Encrypt DNS challenge) | DevOps | 1 | R-02 |
| Site publishing flow (draft → live subdomain) | FE + BE | 2 | R-08 |
| Rate limiting middleware | BE | 1 | R-22 |

**Sprint 2 Gate:** A test site is accessible at `test.safahati.com`. PostgreSQL is the active DB.

### Sprint 3 (June 1–14): Monetization
| Task | Owner | Days | Refs |
|---|---|---|---|
| Stripe Checkout + subscription plans | BE | 3 | R-06 |
| Stripe webhook handler | BE | 1 | R-06 |
| Plan-based feature gating | FE + BE | 1 | R-06 |
| Moyasar integration (Mada, STC Pay) | BE | 3 | R-07 |
| Billing portal page in dashboard | FE | 1 | R-06 |

**Sprint 3 Gate:** First payment can be collected end-to-end. Mada card works.

### Sprint 4 (June 15–28): Arabic Dashboard
| Task | Owner | Days | Refs |
|---|---|---|---|
| Language toggle in dashboard layout | FE | 0.5 | R-09 |
| Translate all dashboard static strings (AR) | FE | 1.5 | R-09 |
| RTL logical CSS properties in dashboard | FE | 1 | R-09 |
| RTL testing across all dashboard pages | QA | 1 | R-09 |
| Mobile-responsive dashboard (basic) | FE | 2 | R-24 |

**Sprint 4 Gate:** Arabic speaker can complete full flow (register → create site → publish) entirely in Arabic.

**Phase 1 Exit Criteria:**
- [ ] First paying customer is possible
- [ ] Live site accessible at client.safahati.com
- [ ] Arabic and English dashboard fully functional
- [ ] Zero P1 bugs open
- [ ] PostgreSQL live in production
- [ ] Sentry monitoring active

---

## Phase 2 — Growth Features (July–August 2026)

**Goal:** Increase activation and retention. Reach 300 paying sites.

### Sprint 5 (July 1–14): User Experience
| Task | Owner | Days | Refs |
|---|---|---|---|
| Post-creation onboarding flow | FE + UX/UI | 3 | R-13 |
| Guided editor tour (Shepherd.js) | FE | 1 | R-13 |
| Image upload via MinIO | FE + BE | 3 | R-19 |
| SEO meta fields per site | FE + BE | 2 | R-17 |

### Sprint 6 (July 15–28): Analytics & SEO
| Task | Owner | Days | Refs |
|---|---|---|---|
| Self-hosted analytics (Plausible/Umami) | BE | 2 | R-14 |
| Analytics dashboard in admin | FE | 2 | R-14 |
| WhatsApp click-to-chat integration | FE | 1 | R-18 |
| Sitemap + robots.txt for published sites | BE | 1 | — |
| Custom domain CNAME flow | BE + DevOps | 3 | R-12 |

### Sprint 7 (Aug 1–14): Quality Foundation
| Task | Owner | Days | Refs |
|---|---|---|---|
| Vitest setup + auth route unit tests | QA + BE | 2 | R-15 |
| Playwright E2E: registration + site creation | QA + FE | 2 | R-15 |
| CI/CD pipeline (GitHub Actions) | DevOps | 1 | — |
| Live preview panel in editor | FE + UX/UI | 4 | R-16 |

### Sprint 8 (Aug 15–28): Content Tools
| Task | Owner | Days | Refs |
|---|---|---|---|
| Drag-and-drop section reorder | FE | 2 | R-24 |
| Duplicate section | FE | 0.5 | — |
| Theme color picker in dashboard | FE | 1 | — |
| Font picker per site | FE | 1 | — |
| Additional 3 industry templates | FE | 3 | — |

**Phase 2 Exit Criteria:**
- [ ] 300 active sites
- [ ] Custom domains working
- [ ] Image uploads working
- [ ] Analytics visible to site owners
- [ ] 40% E2E test coverage on critical paths

---

## Phase 3 — AI & Scale (September–October 2026)

**Goal:** Differentiate on AI. Reach 1,000 paying sites.

### Sprint 9 (Sep 1–14): AI Copy Generation
| Task | Owner | Days | Refs |
|---|---|---|---|
| Claude API integration via Vercel AI SDK | BE | 2 | R-11 |
| AI copy generation endpoint | BE | 2 | R-11 |
| AI generation UI in editor | FE | 2 | R-11 |
| Per-plan generation quota tracking | BE | 1 | R-11 |
| Arabic copy quality evaluation | BA + UX/UI | 1 | R-11 |

### Sprint 10 (Sep 15–28): Agency & White-Label
| Task | Owner | Days | Refs |
|---|---|---|---|
| Agency plan — manage multiple client sites | FE + BE | 3 | R-16 |
| White-label — remove Safahati branding | FE | 1 | R-16 |
| Client seat invitations | FE + BE | 2 | R-16 |
| Agency billing (per-site pricing) | BE | 2 | R-16 |

### Sprint 11–12 (Oct): Scale & Stability
| Task | Owner | Days |
|---|---|---|
| Redis caching layer (site config, sessions) | BE | 3 |
| PostgreSQL read replica | DevOps | 1 |
| Performance audit + Core Web Vitals fixes | FE | 3 |
| Full regression test suite | QA | 4 |
| UAE/Egypt market research | BD | 3 |

---

## Milestone Summary

| Date | Milestone |
|---|---|
| May 14, 2026 | Zero P1/P2 bugs, clean TypeScript build |
| May 28, 2026 | First live site on client.safahati.com |
| June 14, 2026 | First payment collected |
| June 28, 2026 | Arabic dashboard fully functional |
| July 28, 2026 | Custom domains working, analytics live |
| August 28, 2026 | 300 active sites target |
| September 28, 2026 | AI copy generation live (Arabic + English) |
| October 31, 2026 | 1,000 active sites target |
