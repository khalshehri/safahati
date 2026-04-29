# QA Engineer — Skills Profile
## Safahati Multi-Tenant Website Platform

---

## Role Summary

The QA Engineer for Safahati is responsible for designing and executing a comprehensive quality assurance program across a Next.js 16 multi-tenant SaaS platform. The platform serves MENA/Saudi SMEs via subdomain routing, is bilingual (Arabic RTL + English LTR), and uses a config-driven block component system with 31 block types and 174 template files. The QA Engineer must cover client-side rendering, server-side API routes, authentication flows, multi-tenancy isolation, and RTL layout correctness.

---

## Core Technical Skills

### 1. Next.js Testing (App Router)

- **Server Component testing** — testing RSC (React Server Components) in App Router with `next/jest` or Vitest + happy-dom
- **Client Component testing** — testing `"use client"` components with React Testing Library
- **Route Handler testing** — unit testing `src/app/api/**` route handlers by directly invoking exported functions (`GET`, `POST`, `PUT`, `DELETE`) with mock `Request` objects
- **Middleware testing** — verifying `src/middleware.ts` route matchers and redirect logic, including the subdomain routing logic for multi-tenant sites
- **Page-level integration** — testing full page renders including data fetching, auth guards, and layout components

### 2. End-to-End Testing with Playwright

- Writing `@playwright/test` test suites for full user journeys
- Page Object Model (POM) design for dashboard, editor, auth, and published site flows
- Playwright fixture setup for authenticated sessions (using `storageState`)
- Cross-browser testing: Chromium, Firefox, WebKit
- Mobile viewport testing (Tailwind responsive breakpoints: sm/md/lg/xl)
- Screenshot and visual regression testing with Playwright snapshots
- Network interception with `page.route()` for mocking API responses and error states
- Trace recording and report generation for CI failure debugging

### 3. Unit Testing with Vitest

- Vitest configuration with `jsdom`/`happy-dom` environment for React components
- Testing pure utility functions: `slugify`, `setNestedValue`, Zod schema validators
- React Testing Library for component behavior (clicks, form inputs, conditional rendering)
- Mocking Drizzle ORM queries with `vi.mock()`
- Mocking `next-auth` `auth()` calls for authenticated route handler tests
- Mocking `better-sqlite3` for DB layer isolation
- Coverage reporting with `v8` provider targeting 80% threshold

### 4. API Testing

- Direct route handler invocation (no HTTP overhead) using Next.js `createMocks` pattern
- Contract testing: verifying request/response shape matches frontend expectations
- Authentication boundary testing: 401 for unauthenticated requests, 403 for wrong-owner access
- Input validation testing: missing fields, invalid industry IDs, malformed JSON
- Error scenario testing: DB failures, constraint violations (duplicate email, duplicate slug)
- Rate limiting and abuse testing for registration and auth endpoints

### 5. RTL and Bilingual Testing

- CSS logical properties verification (`margin-inline-start`, `padding-inline-end`) vs physical properties
- `dir="rtl"` attribute propagation testing on site renderer and editor preview
- Arabic text rendering verification: font loading, line height, character shaping
- Bidirectional text correctness in mixed Arabic/English content
- Form field alignment in RTL: labels, inputs, error messages
- Navigation and layout mirroring: icons, arrows, dropdowns, sidebars
- `language` field stored in `sites` table (`en`/`ar`) correctly applied to `SiteTheme.direction`
- Testing both language modes through the 2-step site creation wizard

### 6. Multi-Tenant Testing

- Tenant isolation verification: User A cannot access User B's sites or sections
- Session/JWT user ID validation against DB records (stale session detection)
- Slug uniqueness enforcement across all tenants
- Subdomain routing: correct site loading by slug from URL
- Cross-tenant data leakage tests: API responses must never include other users' data
- Auth guard testing: dashboard routes require session, site renderer is public

### 7. TypeScript Type Safety Testing

- Running `tsc --noEmit` as part of CI to catch type errors in 174+ template files
- Detecting `IParticlesProps` type mismatch issues in tsParticles-based demo hero templates
- Zod schema validation testing: block config schemas validate correctly against template configs
- Type narrowing verification in block registry pattern (`getBlock()`, `getTemplate()`)

### 8. Database and State Testing

- Testing SQLite (better-sqlite3) operations via Drizzle ORM: insert, select, update, delete
- Cascade delete verification: deleting a site removes all associated sections
- Schema drift detection: comparing Drizzle schema with actual DB structure
- Zustand store testing: `useEditorStore` actions (addSection, removeSection, moveSection, updateSectionConfig, changeTemplate)
- JSON serialization/deserialization of `config` (TEXT column) and `theme` (TEXT column) fields

### 9. Performance Testing

- Core Web Vitals measurement: LCP, FID/INP, CLS for published site pages
- Playwright performance timeline recording
- Bundle size analysis with `@next/bundle-analyzer`
- Image optimization and lazy loading verification
- SQLite query performance for site/section fetches

### 10. Accessibility Testing

- WCAG 2.1 AA compliance using `axe-playwright` or `@axe-core/react`
- Keyboard navigation testing: tab order, focus traps, ARIA roles
- Screen reader compatibility for both LTR and RTL content
- Color contrast ratio checks for all 13 industry template color schemes
- Focus management in the site editor (modal dialogs, section selection)

---

## Tools and Libraries

| Category | Primary Tool | Secondary / Alternative |
|---|---|---|
| Unit testing | Vitest 2.x | Jest 29 |
| Component testing | React Testing Library 16 | @testing-library/jest-dom |
| E2E testing | Playwright 1.x | Cypress |
| API mocking | MSW 2.x (Mock Service Worker) | nock |
| DB mocking | vi.mock() + in-memory SQLite | better-sqlite3 :memory: |
| Accessibility | axe-playwright | @axe-core/react |
| Type checking | tsc --noEmit | ts-check |
| Coverage | Vitest v8 coverage | Istanbul |
| Visual regression | Playwright screenshots | Percy |
| Performance | Playwright tracing + Lighthouse CI | WebPageTest |

---

## Domain Knowledge Requirements

- Understanding of Safahati's config-driven architecture: blocks, templates, sections, sites
- Familiarity with Drizzle ORM query builder and SQLite constraints
- Knowledge of NextAuth.js v5 JWT session lifecycle and the stale-session failure mode
- RTL/Arabic layout fundamentals (CSS direction, text-align, logical properties)
- MENA SaaS product context: Arabic content testing, bilingual form validation
- Multi-tenant SaaS security patterns: tenant isolation, IDOR prevention
