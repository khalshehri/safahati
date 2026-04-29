# Quality Standards and Gates
## Safahati — Definition of Done, Code Review, Coverage, and Compliance
**Version:** 1.0
**Date:** 2026-04-25

---

## 1. Definition of Done

A task or user story is considered **Done** only when ALL of the following are true:

### 1.1 Code Complete Checklist

- [ ] Code is written and committed to a feature branch
- [ ] TypeScript compiles with zero errors (`tsc --noEmit` passes)
- [ ] ESLint passes with zero errors (warnings are acceptable for now, but must be reviewed)
- [ ] No new `// eslint-disable` or `/* eslint-disable */` comments added without team approval
- [ ] No new `any` types introduced without documented justification
- [ ] All new functions and components have explicit return type annotations

### 1.2 Testing Complete Checklist

- [ ] Unit tests written for all new utility functions (100% coverage on new utils)
- [ ] Unit tests written for all new Zustand store actions
- [ ] API route tests written for all new route handlers (happy path + key error paths)
- [ ] Component tests written for new interactive components
- [ ] E2E test written if a new user-facing flow was added
- [ ] RTL test variant written if component has bilingual content
- [ ] All existing tests continue to pass

### 1.3 Quality Gates (Automated)

- [ ] `npm run type-check` — exits with code 0
- [ ] `npm run lint` — exits with code 0
- [ ] `npm run test:unit` — all tests pass
- [ ] Coverage thresholds met (see Section 3)
- [ ] `npm run build` — production build succeeds

### 1.4 Review Complete

- [ ] Pull request approved by at least 1 reviewer
- [ ] All review comments addressed or explicitly resolved with explanation
- [ ] No "TODO" comments left in newly written code without a linked issue

### 1.5 Bilingual / RTL Complete (for UI features)

- [ ] English content provided for all user-visible strings
- [ ] Arabic content provided for all user-visible strings (or TODO ticket created)
- [ ] Component tested in RTL mode if it has directional layout
- [ ] No hardcoded `left`/`right` CSS without RTL counterpart

---

## 2. Code Review Checklist

Use this checklist when reviewing every pull request on Safahati.

### 2.1 Security Review

- [ ] New API routes check `session?.user?.id` before any DB operation
- [ ] All DB writes include ownership verification (user can only modify their own resources)
- [ ] No raw SQL strings — all DB operations use Drizzle ORM parameterized queries
- [ ] User input is not reflected directly in error messages (no info leak)
- [ ] File upload routes validate file type and size
- [ ] No secrets, API keys, or `AUTH_SECRET` committed in code

### 2.2 Multi-Tenant Isolation Review

- [ ] Every site/section lookup includes `WHERE userId = session.user.id` (or equivalent)
- [ ] No query returns data from multiple tenants
- [ ] Error responses for unauthorized access return 404 (not 403) to prevent resource enumeration
- [ ] New tables added with `userId` or `siteId` FK to enforce tenant scope

### 2.3 API Design Review

- [ ] Route returns correct HTTP status codes (200, 201, 400, 401, 404, 500)
- [ ] All DB operations are wrapped in try/catch
- [ ] Input validation present before DB operations (required fields, type checks)
- [ ] Response shape is consistent with existing API (no ad hoc property naming)
- [ ] Stale session check included where user ID is used as FK

### 2.4 TypeScript Review

- [ ] No use of `any` in new code
- [ ] New types defined in appropriate `types/` files
- [ ] Zod schemas defined for new block config types
- [ ] Generic types preferred over type assertions (`as`) where possible

### 2.5 Component / UI Review

- [ ] Component accepts and uses `language` prop for bilingual rendering
- [ ] Arabic content fields (`titleAr`, `descriptionAr`, etc.) present in config type
- [ ] RTL layout handled with CSS logical properties or Tailwind RTL classes
- [ ] No hardcoded pixel values for directional spacing (use Tailwind spacing)
- [ ] Component handles empty/undefined content gracefully (no crashes on missing fields)
- [ ] Loading and error states implemented for async operations

### 2.6 Performance Review

- [ ] New images use `next/image` with explicit `width` and `height`
- [ ] Heavy libraries loaded lazily with `dynamic(() => import(...), { ssr: false })`
- [ ] No blocking synchronous operations in React render path
- [ ] DB queries do not fetch columns that aren't needed (avoid `SELECT *` on large tables)
- [ ] New pages added to performance budget tracking

### 2.7 Accessibility Review

- [ ] Interactive elements are keyboard accessible (focusable, correct tab order)
- [ ] Buttons have accessible labels (not just icons)
- [ ] Form fields have associated `<label>` elements
- [ ] ARIA roles used where native semantics are insufficient
- [ ] Color is not the only means of conveying information
- [ ] Focus indicator visible on all interactive elements

---

## 3. Test Coverage Targets

### 3.1 Coverage Thresholds (enforced in CI)

| Scope | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| Overall codebase | 80% | 75% | 80% | 80% |
| `src/lib/` (utilities, store, registry) | 90% | 85% | 90% | 90% |
| `src/app/api/` (route handlers) | 90% | 85% | 90% | 90% |
| `src/config/` (templates, registry) | 85% | 80% | 85% | 85% |
| `src/components/blocks/` (templates) | 70% | 65% | 70% | 70% |
| `src/components/ui/` (shadcn primitives) | Excluded | Excluded | Excluded | Excluded |
| `src/app/(demo)/` (demo pages) | Excluded | Excluded | Excluded | Excluded |

### 3.2 Coverage Exclusions (documented reasons)

| Path | Reason for Exclusion |
|---|---|
| `src/components/ui/**` | Third-party shadcn/ui components, not our business logic |
| `src/app/(demo)/**` | Showcase-only pages, not part of product functionality |
| `**/*.d.ts` | Type declaration files, not executable code |
| `drizzle/**` | Auto-generated migration files |
| `src/test/**` | Test files themselves |

### 3.3 Test Count Targets (Phase 1 MVP)

| Test Type | Target Count |
|---|---|
| Unit tests | 150+ |
| API route tests | 60+ |
| Component tests | 30+ |
| E2E tests | 25+ |
| **Total** | **265+** |

---

## 4. Performance Budgets

### 4.1 Core Web Vitals (Production)

Measured on published site pages (`/:slug`) under simulated 4G mobile:

| Metric | Good | Needs Improvement | Poor |
|---|---|---|---|
| LCP | < 2.5s | 2.5s – 4.0s | > 4.0s |
| INP | < 200ms | 200ms – 500ms | > 500ms |
| CLS | < 0.1 | 0.1 – 0.25 | > 0.25 |
| FCP | < 1.8s | 1.8s – 3.0s | > 3.0s |
| TTFB | < 800ms | 800ms – 1800ms | > 1800ms |

**Gate:** A PR that degrades LCP by more than 200ms requires performance review before merge.

### 4.2 JavaScript Bundle Budgets

| Bundle | Soft Limit | Hard Limit (CI fail) |
|---|---|---|
| First load JS — shared chunks | 200 kB gzipped | 350 kB gzipped |
| First load JS — `/dashboard` page | 80 kB gzipped | 150 kB gzipped |
| First load JS — editor page | 150 kB gzipped | 250 kB gzipped |
| First load JS — published site | 60 kB gzipped | 120 kB gzipped |

Measured with: `ANALYZE=true npm run build` using `@next/bundle-analyzer`

### 4.3 API Response Time Budgets

| Endpoint | Target P95 | Hard Limit |
|---|---|---|
| `GET /api/sites` | < 100ms | < 500ms |
| `POST /api/sites` | < 300ms | < 1000ms |
| `GET /api/sites/[siteId]` | < 100ms | < 500ms |
| `PUT /api/sites/[siteId]` | < 200ms | < 500ms |
| Page render (SSR) | < 200ms | < 1000ms |

### 4.4 Image Standards

- All images use `next/image` component
- Hero images: WebP format, max 800 kB uncompressed
- Thumbnail images: max 100 kB uncompressed
- Icons: SVG or Lucide React (no raster images for icons)

---

## 5. Accessibility Standards (WCAG 2.1 AA)

### 5.1 Required Compliance Level

All pages and components in Safahati must meet **WCAG 2.1 Level AA**. This applies to:
- Dashboard pages (register, login, dashboard, new site wizard, editor)
- Published site pages (all 13 industry templates)
- Admin-facing UI components

### 5.2 Specific Requirements

#### Color and Contrast

| Element | Minimum Contrast Ratio |
|---|---|
| Normal text (< 18pt) | 4.5:1 |
| Large text (≥ 18pt bold or ≥ 24pt) | 3:1 |
| UI components (buttons, inputs, focus indicators) | 3:1 |
| Disabled elements | Exempt |

All 13 industry template default color schemes must be verified with the WCAG contrast checker.

#### Keyboard Navigation

- [ ] All interactive elements reachable via Tab key
- [ ] Tab order is logical (left-to-right in LTR, right-to-left in RTL)
- [ ] Focus indicator is visible on all focusable elements (minimum 3:1 contrast)
- [ ] No keyboard traps (user can always navigate away from any component)
- [ ] Modals and dialogs trap focus correctly and return focus on close
- [ ] Dropdown menus accessible via Arrow keys

#### ARIA and Semantics

- [ ] Landmark regions used: `<header>`, `<nav>`, `<main>`, `<footer>`
- [ ] Heading hierarchy is logical (h1 → h2 → h3, no skipping)
- [ ] Images have `alt` text (or `alt=""` for decorative images)
- [ ] Form fields have `<label>` elements or `aria-label`
- [ ] Error messages linked to form fields via `aria-describedby`
- [ ] Loading states announced via `aria-live="polite"`
- [ ] Buttons have descriptive text or `aria-label` (not just "Click here")

#### Screen Reader Support

- Arabic RTL content must read correctly in Arabic screen readers (VoiceOver on macOS with Arabic, NVDA with Arabic)
- Language attribute `lang="ar"` on the root element for Arabic sites
- Language attribute `lang="en"` on the root element for English sites

### 5.3 Automated Accessibility Testing

All pages run `axe-playwright` in CI. Zero violations at level AA are required. Incomplete items are reviewed manually. The following violation types auto-fail:

- `color-contrast`
- `label`
- `button-name`
- `image-alt`
- `heading-order`
- `html-has-lang`
- `landmark-one-main`

---

## 6. RTL/Arabic Compliance Standards

### 6.1 CSS Requirements

All components with directional layout must use:

- **CSS Logical Properties** for spacing: `margin-inline-start`, `padding-inline-end`, `border-inline-start`
- **Tailwind RTL utilities**: `rtl:flex-row-reverse`, `rtl:text-right`, `rtl:space-x-reverse`
- **No hardcoded `left`/`right`** in component styles without RTL counterpart

### 6.2 Typography Requirements

| Requirement | Standard |
|---|---|
| Arabic font | Must include Arabic Unicode range (U+0600–U+06FF) |
| Arabic font stack | Cairo, Noto Kufi Arabic, or system Arabic font as fallback |
| Line height for Arabic | Minimum 1.8 (Arabic text needs more vertical space) |
| Word spacing for Arabic | Use `word-spacing: normal` (Arabic connected script) |
| Letter spacing for Arabic | `letter-spacing: 0` (Arabic should not have letter-spacing) |
| Text direction | Controlled by `SiteTheme.direction` field (`ltr` or `rtl`) |

### 6.3 Bilingual Content Requirements

Every block component with text content must have:

- English fields: `title`, `description`, `buttonText`, etc.
- Arabic fields: `titleAr`, `descriptionAr`, `buttonTextAr`, etc.
- A `language` prop consumed by the component to select which field to render
- Graceful fallback: if Arabic content is empty, fall back to English (not crash)

### 6.4 RTL Layout Verification Checklist

- [ ] Navigation links order reverses in RTL (last item appears on left in RTL)
- [ ] Arrows and chevrons reverse direction in RTL
- [ ] Form field labels align to the right in RTL
- [ ] Input text aligns right in RTL
- [ ] Cards and grid items maintain correct visual balance in RTL
- [ ] Social media icons and logos: check for any that are directionally asymmetric
- [ ] Scroll direction and slider behavior are correct in RTL

---

## 7. CI/CD Quality Gates

### 7.1 Pull Request Requirements

All PRs to `main` must pass:

| Gate | Tool | Failure Action |
|---|---|---|
| Type check | `tsc --noEmit` | Block merge |
| Lint | ESLint 9 | Block merge |
| Unit tests | Vitest | Block merge |
| Coverage threshold | Vitest v8 | Block merge (when thresholds set) |
| Build success | `next build` | Block merge |
| E2E smoke tests | Playwright (subset) | Block merge |

### 7.2 Pre-Merge Checklist (Manual)

- [ ] PR description explains what changed and why
- [ ] Screenshots or screen recordings provided for UI changes
- [ ] Database migration included if schema changed
- [ ] Arabic content updated alongside English content
- [ ] Performance impact assessed for bundle-size-relevant changes
- [ ] Security review completed for any auth or permission changes

### 7.3 Deployment Quality Gates

Before any deployment to production:

- [ ] All CI checks green on the deployment commit
- [ ] DB migration tested on a copy of production data
- [ ] Rollback plan documented for breaking changes
- [ ] Monitoring alerts reviewed and thresholds updated if needed
- [ ] Smoke tests run against staging environment

### 7.4 Branch Strategy

| Branch | Purpose | Protection Rules |
|---|---|---|
| `main` | Production | Requires PR, requires CI pass, no force push |
| `dev` | Integration | Requires CI pass |
| `feature/*` | Feature work | CI runs on push |
| `fix/*` | Bug fixes | CI runs on push |
| `hotfix/*` | Production hotfixes | Requires expedited review |

---

## 8. Coding Standards Reference

### 8.1 File Naming

| Type | Convention | Example |
|---|---|---|
| React components | kebab-case `.tsx` | `site-renderer.tsx` |
| Route handlers | `route.ts` | `app/api/sites/route.ts` |
| Page components | `page.tsx` | `app/(dashboard)/dashboard/page.tsx` |
| Block templates | `{type}-template-{nn}.tsx` | `hero-template-01.tsx` |
| Test files | `{name}.test.ts(x)` | `editor-store.test.ts` |
| E2E specs | `{flow}.spec.ts` | `auth.spec.ts` |

### 8.2 Import Order (enforced by ESLint)

1. Node built-ins
2. External packages
3. Next.js modules
4. Internal path aliases (`@/`)
5. Relative imports

### 8.3 Error Handling Pattern (API Routes)

```typescript
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // ... business logic
  } catch (error) {
    console.error('[POST /api/route-name]', error);
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
}
```

### 8.4 Component Bilingual Pattern

```typescript
interface Props {
  config: { title: string; titleAr: string; description: string; descriptionAr: string };
  language: 'en' | 'ar';
}

export function MyBlock({ config, language }: Props) {
  const isAr = language === 'ar';
  const title = isAr && config.titleAr ? config.titleAr : config.title;
  const description = isAr && config.descriptionAr ? config.descriptionAr : config.description;
  return <div dir={isAr ? 'rtl' : 'ltr'}>...</div>;
}
```
