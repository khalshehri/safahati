# Safahati Virtual Team Analysis
## Non-Technical User Features — Complete Product Specification

**Branch:** `ai-agent`  
**Date:** April 2026  
**Status:** Ready for Sprint 1 Development

---

## 📋 What This Is

A **complete, production-ready specification** for 14 non-technical user features on the Safahati website platform. Created by a virtual team of 8 roles (PO, BD, BA, UX/UI, SA, FE, BE, QA) analyzing the Safahati idea through a **non-technical user lens**.

Every feature is specified in:
- **User stories** with acceptance criteria
- **Wireframes** with RTL variants
- **Architecture decisions** (ADRs) with implementation rationale
- **API contracts** with Zod schemas
- **Component architecture** with TypeScript interfaces
- **Test cases** covering happy paths and edge cases
- **Sprint 1 task breakdown** with dependencies and estimates

---

## 🎯 14 Non-Technical User Features

| # | Feature | Category | Priority |
|---|---|---|---|
| 1 | "Build My Site in 5 Minutes" Wizard | Onboarding | Must Have |
| 2 | WhatsApp-First Contact Integration | MENA-Specific | Must Have |
| 3 | Smart Content Suggestions (AI) | Content | Should Have |
| 4 | "Help Me Write This" (Per-Field AI) | Content | Should Have |
| 5 | Opening Hours Component | Component | Should Have |
| 6 | Live Preview in Editor | Editor | Must Have |
| 7 | Auto-Save + Undo | Editor | Must Have |
| 8 | Plain Language Admin Labels | UX | Must Have |
| 9 | Template Switching Without Data Loss | Editor | Should Have |
| 10 | Duplicate & Translate (AI) | Content | Should Have |
| 11 | "Launch Your Site" Celebration Screen | Retention | Must Have |
| 12 | "What's Missing" Completeness Meter | Retention | Should Have |
| 13 | Mobile PWA Admin | Access | Should Have |
| 14 | "Done for You" Upgrade Path | Monetization | Could Have |

---

## 📁 Document Structure

```
Virtual-Team-Analysis/
├── 01-Product-Owner/
│   ├── skills.md
│   ├── 01-Product-Strategy.md
│   ├── 02-Feature-Prioritization.md
│   └── 03-Product-Roadmap.md
├── 02-Business-Development/
│   ├── skills.md
│   ├── 01-Market-Analysis.md
│   ├── 02-Growth-Strategy.md
│   └── 03-Partnership-Opportunities.md
├── 03-Business-Analyst/
│   ├── skills.md
│   ├── 01-Requirements-Document.md
│   ├── 02-User-Journey-Maps.md
│   ├── 03-Process-Flows.md
│   ├── 04-KPIs-and-Metrics.md
│   └── 05-NonTechnical-User-Stories.md (29 stories, 136 story points)
├── 04-UI-UX-Designer/
│   ├── skills.md
│   ├── 01-UX-Audit.md
│   ├── 02-Wireframes.md
│   ├── 03-Design-System.md
│   ├── 04-Prototypes.md
│   └── 05-NonTechnical-UX-Design.md (10 feature wireframes)
├── 05-Frontend-Engineer/
│   ├── skills.md
│   ├── 01-Technical-Assessment.md
│   ├── 02-Architecture-Recommendations.md
│   ├── 03-Implementation-Plan.md
│   ├── 04-Code-Standards.md
│   └── 05-FE-Implementation-NonTechnical-Features.md (121 FE hours)
├── 06-Backend-Engineer/
│   ├── skills.md
│   ├── 01-Backend-Analysis.md
│   ├── 02-Database-Optimization.md
│   ├── 03-API-Specifications.md
│   ├── 04-Scalability-Plan.md
│   ├── 05-SA-Architecture-NonTechnical-Features.md (9 ADRs)
│   ├── 06-BE-Implementation-Part1.md (schema + 5 core API routes)
│   └── 07-BE-Implementation-Part2.md (AI + 5 remaining routes)
├── 07-QA-Engineer/
│   ├── skills.md
│   ├── 01-Quality-Assessment.md
│   ├── 02-Test-Strategy.md
│   ├── 03-Bug-Registry.md
│   ├── 04-Quality-Standards.md
│   └── 05-NonTechnical-Test-Cases.md (36 test cases)
├── 08-Application-Support/
│   ├── skills.md
│   ├── 01-Support-Analysis.md
│   ├── 02-Knowledge-Base-Structure.md
│   └── 03-Training-Materials.md
├── TEAM-COLLABORATION/
│   ├── Executive-Summary.md
│   ├── Integrated-Recommendations.md
│   ├── Feature-Matrix.md
│   ├── Implementation-Timeline.md
│   ├── Risk-Assessment.md
│   └── Sprint-1-Task-Breakdown.md (26 tasks, 60h estimate)
├── PROJECT-DETAILS.md
├── README.md (this file)
└── START_HERE.md
```

---

## 🚀 Quick Start for Developers

**→ Read [START_HERE.md](./START_HERE.md) first** — it has the full navigation and one-page summary.

### For Developers Starting Sprint 1:
1. Read `TEAM-COLLABORATION/Sprint-1-Task-Breakdown.md` — your task list
2. Read the relevant user story (e.g., `03-Business-Analyst/05-NonTechnical-User-Stories.md` US-01)
3. Check the wireframe in `04-UI-UX-Designer/05-NonTechnical-UX-Design.md`
4. Check the backend API contract in `06-Backend-Engineer/06-BE-Implementation-Part1.md` or `07`
5. Read the test cases in `07-QA-Engineer/05-NonTechnical-Test-Cases.md`
6. Start coding using the skeleton code provided in the BE/FE implementation docs

### For Product Owners:
- `01-Product-Owner/01-Product-Strategy.md` — overall vision
- `01-Product-Owner/02-Feature-Prioritization.md` — what's Must/Should/Could/Won't
- `03-Business-Analyst/05-NonTechnical-User-Stories.md` — 29 stories with acceptance criteria
- `TEAM-COLLABORATION/Sprint-1-Task-Breakdown.md` — what's being built first

### For Architects/Technical Leads:
- `06-Backend-Engineer/05-SA-Architecture-NonTechnical-Features.md` — 9 architectural decisions (ADRs)
- `06-Backend-Engineer/06-BE-Implementation-Part1.md` and `07-BE-Implementation-Part2.md` — API contracts + DB schema
- `05-Frontend-Engineer/05-FE-Implementation-NonTechnical-Features.md` — component architecture + Zustand stores

### For QA:
- `07-QA-Engineer/05-NonTechnical-Test-Cases.md` — 36 test specifications, organized by epic
- `TEAM-COLLABORATION/Sprint-1-Task-Breakdown.md` — which tests are priorities for Sprint 1

---

## 📊 Key Statistics

| Metric | Value |
|---|---|
| Total user stories | 29 (136 story points) |
| Frontend estimated hours | 121 hours (3 sprints) |
| Backend estimated hours | 90 hours (3 sprints) |
| Sprint 1 scope | 26 tasks (60 hours total) |
| Test cases written | 36 (+ regression checklist) |
| Architectural decisions (ADRs) | 9 |
| New API endpoints | 10 |
| New database tables | 3 |
| UI primitives to build | 8 |
| Design system components | 14 |
| Industries supported (template-aware) | 13 |

---

## 🎨 Design Principles

All features are built around **one core principle:**

> **The product succeeds when a 50-year-old restaurant owner in Jeddah, with no technical background and working on an iPhone, can have a published, professional, bilingual website live within 20 minutes of first signing up — without reading a single instruction.**

---

## 🔑 Key Decisions Made

### Architecture (from 9 ADRs):
- **Wizard state:** Hybrid (Zustand + server DB + localStorage)
- **Live preview:** Same-origin iframe + 5-min JWT token
- **Auto-save:** 2-second debounce + 409 conflict detection
- **Undo:** Client-side immer patch stack (max 20)
- **AI models:** Haiku for field suggestions, Sonnet for full generation
- **Opening hours:** Dedicated DB table (not JSONB in sections config)
- **Rate limiting:** Redis-based per-user daily counters

### UX (from wireframes):
- Plain language everywhere (no technical jargon)
- Live preview split-screen editor
- Bilingual Arabic RTL + English LTR equally weighted
- Mobile-first (PWA installable dashboard)
- WhatsApp as primary contact channel (MENA market)

### Product (from PO analysis):
- 14 features prioritized by impact vs effort
- Must Have: wizard, WhatsApp, live preview, auto-save, plain language labels, launch celebration
- Should Have: AI suggestions, opening hours, completeness meter, template switching
- Won't Have in 2026: drag-and-drop editor, mobile apps, e-commerce

---

## 🔗 Cross-References

- **Business case:** `02-Business-Development/01-Market-Analysis.md`
- **User research:** `03-Business-Analyst/02-User-Journey-Maps.md` (3 detailed personas)
- **Competitive analysis:** `02-Business-Development/01-Market-Analysis.md`
- **Tech stack:** `PROJECT-DETAILS.md`
- **Dependencies:** `TEAM-COLLABORATION/Feature-Matrix.md`
- **Risk assessment:** `TEAM-COLLABORATION/Risk-Assessment.md`

---

## ✅ What's Ready

- [x] Product vision and strategy
- [x] User stories with acceptance criteria
- [x] Wireframes with RTL variants
- [x] Architecture decisions (ADRs)
- [x] API contracts with Zod schemas
- [x] Database schema + migrations
- [x] Component architecture + TypeScript interfaces
- [x] Zustand store designs
- [x] Test cases
- [x] Sprint 1 task breakdown (developer-ready)
- [x] Implementation skeleton code

**Not yet done (will be built by developers):**
- [ ] Actual React components
- [ ] API route implementations
- [ ] Database migrations execution
- [ ] Test code (Vitest/Playwright)
- [ ] Deployment configuration

---

## 🎬 Next Steps

**Week 1:**
1. Distribute Sprint 1 Task Breakdown to developers
2. Set up test infrastructure (Vitest, Playwright, MSW mocks)
3. Developers start on BE schema (BE-001) — highest priority, blocking FE
4. QA writes test code from test specifications

**Week 2+:**
- FE builds wizard (depends on BE-002)
- BE builds wizard completion endpoint (BE-003)
- Both iterate on live preview + auto-save
- QA continuously tests against test cases

---

## 📞 Questions?

Each document has implementation notes and rationale. Start with the feature's user story, then read the corresponding wireframe, architecture decision, API contract, and test cases.

**This analysis is intentionally comprehensive.** Every decision is documented. Every task is specific. Every acceptance criterion is testable.

The team is ready to code.

---

**Created by:** Virtual Development Team (PO, BD, BA, UX/UI, SA, FE, BE, QA)  
**Analysis branch:** `ai-agent`  
**Status:** ✅ Production-ready for Sprint 1 kickoff
