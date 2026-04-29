# Test Strategy
## Safahati — Comprehensive Test Plan
**Version:** 1.0
**Date:** 2026-04-25

---

## 1. Testing Philosophy

Safahati follows a **Testing Pyramid** approach adapted for a Next.js multi-tenant SaaS:

```
         /\
        /E2E\          ~15% — Full user journeys (Playwright)
       /------\
      / Integ  \       ~25% — API routes, DB operations, auth flow
     /----------\
    /    Unit    \     ~60% — Utils, components, store actions, validators
   /--------------\
```

**Guiding principles:**
1. Test behavior, not implementation — tests should reflect user intent
2. RTL is not an afterthought — every test has an Arabic language variant
3. Multi-tenant isolation is tested as a first-class security concern
4. Tests must run in CI in under 5 minutes total
5. A failing test blocks merge; warnings do not

---

## 2. Test Infrastructure Setup

### 2.1 Install Test Dependencies

```bash
# Unit + component tests
npm install --save-dev vitest @vitest/coverage-v8 @vitest/ui
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev happy-dom

# E2E tests
npm install --save-dev @playwright/test

# API mocking
npm install --save-dev msw

# Accessibility
npm install --save-dev axe-playwright @axe-core/playwright
```

### 2.2 Vitest Configuration (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
      exclude: [
        'src/components/ui/**',     // shadcn/ui primitives
        'src/app/(demo)/**',        // demo-only pages
        '**/*.d.ts',
        '**/node_modules/**',
      ],
    },
  },
});
```

### 2.3 Playwright Configuration (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 2.4 Test Setup File (`src/test/setup.ts`)

```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));
```

### 2.5 MSW Handlers (`src/test/msw/handlers.ts`)

```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/sites', () => HttpResponse.json({ sites: [] })),
  http.post('/api/sites', () => HttpResponse.json({ site: { id: 'test-id', slug: 'test-site' } })),
  http.get('/api/sites/:siteId', ({ params }) =>
    HttpResponse.json({ site: mockSite(params.siteId as string), sections: [] })
  ),
];
```

---

## 3. Unit Tests

### 3.1 Utility Functions

**File:** `src/test/unit/utils.test.ts`

| Test | Function | Scenario |
|---|---|---|
| Slugify English text | `slugify()` in sites/route.ts | "My Awesome Site" → "my-awesome-site" |
| Slugify Arabic text | `slugify()` | Arabic input degrades to "site" fallback |
| Slugify with special chars | `slugify()` | "Site & Co!" → "site-co" |
| Slugify empty string | `slugify()` | "" → "site" (fallback) |
| setNestedValue shallow | `setNestedValue()` | `["title"]` sets top-level key |
| setNestedValue deep | `setNestedValue()` | `["links", "0", "label"]` sets nested array item |
| setNestedValue auto-creates | `setNestedValue()` | Missing intermediate keys are created |

### 3.2 Zustand Editor Store

**File:** `src/test/unit/editor-store.test.ts`

| Test Group | Tests |
|---|---|
| Initialization | `initializeStore` populates sections and theme; `isDirty` is false after init |
| addSection | New section added to end; `isDirty` becomes true; invalid templateId is ignored |
| removeSection | Section removed; selectedSectionId cleared if it was the removed section |
| moveSection | Section moves up; Section moves down; boundaries respected (can't move first up) |
| updateSectionConfig | Shallow path update; deep nested path update; immutability (original not mutated) |
| changeTemplate | Template changed, config merged; invalid templateId ignored |
| toggleVisibility | `isVisible` flips; `isDirty` set true |
| updateThemeColor | Primary color updated; other colors unchanged |
| updateThemeFont | Heading font updated; other fonts unchanged |
| applyThemePreset | All theme values replaced; `direction` preserved from original |
| setLanguage | Language toggles between "en" and "ar" |

### 3.3 Block Registry

**File:** `src/test/unit/block-registry.test.ts`

| Test | Assertion |
|---|---|
| `getBlock("hero")` returns block definition | block.templates is non-empty array |
| `getBlock("navbar")` returns correct type | blockType === "navbar" |
| `getBlock("invalid")` throws meaningful error | Error message includes block type name |
| All 31 block types are registered | Loop over BLOCK_TYPES constant |
| Each block has at least 1 template | `block.templates.length >= 1` |
| Each template has a `defaultConfig` | `template.defaultConfig` is defined object |

### 3.4 Industry Templates

**File:** `src/test/unit/industry-templates.test.ts`

| Test | Assertion |
|---|---|
| 13 industry templates exist | `industryTemplates.length === 13` |
| Each template has English and Arabic name | `name` and `nameAr` both non-empty |
| Each template has `defaultTheme` | Colors: primary, secondary, accent, background, text |
| Each template has at least 5 sections | `template.sections.length >= 5` |
| Each section has valid blockType | blockType exists in block registry |
| Each section has valid templateId | templateId exists in block's templates |
| Arabic templates set direction rtl | `defaultTheme` does not include direction (added at creation time) |
| `getIndustryTemplate("company")` returns Company | `id === "company"` |
| `getIndustryTemplate("invalid")` returns undefined | Function does not throw |

### 3.5 Zod Schema Validation

**File:** `src/test/unit/schema-validation.test.ts`

| Test | Assertion |
|---|---|
| Valid hero config passes schema | No validation errors |
| Missing required field fails schema | Returns error with field path |
| Extra fields are stripped (not rejected) | Zod `.strip()` behavior |
| RTL config fields accept Arabic strings | `titleAr`, `descriptionAr` accept Arabic Unicode |
| Empty string for required field fails | `title: ""` rejected |

---

## 4. API Route Tests (Integration)

### 4.1 Auth — Register (`POST /api/auth/register`)

**File:** `src/test/api/register.test.ts`

```typescript
import { POST } from '@/app/api/auth/register/route';

describe('POST /api/auth/register', () => {
  it('returns 200 and creates user with valid input');
  it('returns 400 when name is missing');
  it('returns 400 when email is missing');
  it('returns 400 when password is missing');
  it('returns 400 when password is shorter than 6 characters');
  it('returns 409 when email is already registered');
  it('stores email in lowercase');
  it('stores bcrypt hash, not plaintext password');
  it('returns 500 when DB insert fails');
});
```

### 4.2 Sites — List and Create

**File:** `src/test/api/sites.test.ts`

```typescript
describe('GET /api/sites', () => {
  it('returns 401 for unauthenticated request');
  it('returns only the current user\'s sites');
  it('returns empty array when user has no sites');
  it('does not return other users\' sites (tenant isolation)');
});

describe('POST /api/sites', () => {
  it('returns 401 for unauthenticated request');
  it('returns 400 when name is missing');
  it('returns 400 when industry is missing');
  it('returns 400 for invalid industry ID');
  it('returns 401 when session user ID not found in DB (stale session)');
  it('creates site with correct slug from name');
  it('creates unique slug when slug already exists');
  it('seeds sections from industry template');
  it('sets theme direction to rtl for Arabic sites');
  it('sets theme direction to ltr for English sites');
  it('returns siteId and slug on success');
});
```

### 4.3 Site — Read, Update, Delete

**File:** `src/test/api/site-detail.test.ts`

```typescript
describe('GET /api/sites/[siteId]', () => {
  it('returns 401 for unauthenticated request');
  it('returns 404 for non-existent site');
  it('returns 404 when site belongs to different user');
  it('returns site with parsed theme JSON');
  it('returns sections sorted by sortOrder');
  it('returns sections with parsed config JSON');
});

describe('PUT /api/sites/[siteId]', () => {
  it('returns 401 for unauthenticated request');
  it('returns 404 for another user\'s site');
  it('updates site name');
  it('updates site status from draft to published');
  it('updates theme JSON correctly');
  it('sets updatedAt timestamp on update');
});

describe('DELETE /api/sites/[siteId]', () => {
  it('returns 401 for unauthenticated request');
  it('returns 404 for another user\'s site');
  it('deletes site and cascades to sections');
  it('returns 200 on successful delete');
});
```

### 4.4 Sections API

**File:** `src/test/api/sections.test.ts`

```typescript
describe('GET /api/sites/[siteId]/sections', () => {
  it('returns 401 for unauthenticated request');
  it('returns sections for owned site');
  it('returns 404 for another user\'s site sections');
});

describe('POST /api/sites/[siteId]/sections', () => {
  it('creates new section with valid blockType and templateId');
  it('returns 400 for invalid blockType');
  it('sets sortOrder to end of list');
});
```

---

## 5. Component Tests

### 5.1 Authentication Forms

**File:** `src/test/components/register-form.test.tsx`

- Renders all form fields (name, email, password)
- Shows validation error when password is too short
- Shows "Email already registered" on 409 response
- Redirects to dashboard on successful registration
- Submit button is disabled while loading

### 5.2 New Site Wizard

**File:** `src/test/components/new-site-wizard.test.tsx`

- Step 1 renders name input and language toggle
- "Continue" validates that name is not empty
- Language toggle switches between "en" and "ar"
- Step 2 renders all 13 industry template cards
- Industry card click triggers site creation API call
- Loading overlay shown during API call
- Error message displayed on API failure
- Successful creation redirects to editor

### 5.3 Editor Store Integration

**File:** `src/test/components/editor-client.test.tsx`

- Editor renders sections from store
- Section list reflects store state
- Selecting a section opens content editor panel
- Theme editor panel shows current theme colors
- Save button appears when `isDirty` is true
- Device mode buttons change preview width

---

## 6. End-to-End Tests (Playwright)

### 6.1 Authentication Flows

**File:** `e2e/auth.spec.ts`

```typescript
test('user can register and is redirected to dashboard');
test('user cannot register with duplicate email');
test('user can log in with correct credentials');
test('user cannot log in with wrong password');
test('user is redirected to login when accessing /dashboard unauthenticated');
test('user can log out and session is cleared');
test('session persists across page reload');
```

### 6.2 Site Creation — English

**File:** `e2e/site-creation-en.spec.ts`

```typescript
test('user can create a Company site in English');
test('user can create a Restaurant site in English');
test('user is redirected to editor after creation');
test('created site appears in dashboard list');
```

### 6.3 Site Creation — Arabic RTL

**File:** `e2e/site-creation-ar.spec.ts`

```typescript
test('user can create a Company site in Arabic');
test('Arabic site has dir=rtl in preview');
test('Arabic site theme has direction: rtl');
test('editor preview mirrors layout for RTL');
```

### 6.4 Site Editor Flow

**File:** `e2e/editor.spec.ts`

```typescript
test('editor loads all sections from site template');
test('user can click a section to select it');
test('user can edit section content and preview updates');
test('user can change a section template');
test('user can move a section up');
test('user can move a section down');
test('user can toggle section visibility');
test('user can add a new section');
test('user can delete a section');
test('save button appears after making changes');
test('user can save changes and they persist after page reload');
test('user can publish site by changing status to published');
```

### 6.5 Multi-Tenant Isolation

**File:** `e2e/tenant-isolation.spec.ts`

```typescript
test('user A cannot view user B\'s site in editor');
test('user A cannot access user B\'s site via API');
test('user A\'s sites do not appear in user B\'s dashboard');
```

### 6.6 Accessibility Checks

**File:** `e2e/accessibility.spec.ts`

```typescript
test('register page passes axe WCAG 2.1 AA');
test('login page passes axe WCAG 2.1 AA');
test('dashboard page passes axe WCAG 2.1 AA');
test('new site wizard (step 1) passes axe WCAG 2.1 AA');
test('new site wizard (step 2) passes axe WCAG 2.1 AA');
test('editor page passes axe WCAG 2.1 AA');
```

### 6.7 Page Object Models

**File:** `e2e/pages/auth.page.ts`

```typescript
export class AuthPage {
  constructor(private page: Page) {}
  async register(name: string, email: string, password: string) { ... }
  async login(email: string, password: string) { ... }
  async logout() { ... }
}
```

**File:** `e2e/pages/new-site.page.ts`

```typescript
export class NewSitePage {
  async fillStep1(name: string, language: 'en' | 'ar') { ... }
  async selectIndustry(industryId: string) { ... }
  async waitForEditorRedirect() { ... }
}
```

---

## 7. RTL and Bilingual Testing

### 7.1 RTL Layout Tests

**File:** `src/test/rtl/rtl-layout.test.tsx`

For every block component with RTL support:

- Render component with `language="ar"` and `dir="rtl"` wrapper
- Verify text content uses `titleAr`/`descriptionAr` fields when `language="ar"`
- Verify `dir="rtl"` is applied to container element
- Verify Tailwind RTL classes are applied (`rtl:flex-row-reverse`, `rtl:text-right`)

### 7.2 Playwright RTL Snapshots

```typescript
test('Company hero template renders correctly in Arabic RTL', async ({ page }) => {
  await page.goto('/demo/company/hero/hero-01?lang=ar');
  await expect(page).toHaveScreenshot('company-hero-01-ar.png', { threshold: 0.1 });
});
```

### 7.3 Direction Logic in Site Creation

```typescript
it('Arabic site gets rtl direction', async () => {
  const res = await POST(mockRequest({ name: 'موقعي', industry: 'company', language: 'ar' }));
  const site = db.select().from(schema.sites).get();
  const theme = JSON.parse(site.theme);
  expect(theme.direction).toBe('rtl');
});

it('English site gets ltr direction', async () => {
  // language: 'en' → direction: 'ltr'
});
```

---

## 8. Performance Testing

### 8.1 Core Web Vitals Budget

| Metric | Target | Threshold |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | < 4.0s |
| INP (Interaction to Next Paint) | < 200ms | < 500ms |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.25 |
| FCP (First Contentful Paint) | < 1.8s | < 3.0s |
| TTFB (Time to First Byte) | < 800ms | < 1800ms |

### 8.2 Playwright Performance Test

**File:** `e2e/performance.spec.ts`

```typescript
test('published site page meets Core Web Vitals', async ({ page }) => {
  const metrics = await page.evaluate(() =>
    JSON.stringify(performance.getEntriesByType('navigation'))
  );
  // Assert TTFB, FCP from navigation timing
});
```

### 8.3 Bundle Size Budget

| Bundle | Target |
|---|---|
| First Load JS (page) | < 100 kB gzipped |
| First Load JS (shared) | < 300 kB gzipped |
| Editor page JS | < 200 kB gzipped |

Run: `ANALYZE=true npm run build` with `@next/bundle-analyzer`

---

## 9. Security Testing

### 9.1 IDOR (Insecure Direct Object Reference) Tests

- Unauthenticated: all `/api/sites/**` return 401
- Cross-tenant: user B's token + user A's siteId returns 404 (not 403, to prevent enumeration)
- Section CRUD: sections inherit parent site's ownership check

### 9.2 Input Validation Tests

- SQL injection in site `name` field: verified safe by parameterized Drizzle queries
- XSS in site `name` (used in slug generation): special characters stripped by `slugify()`
- XSS in section `config` JSON: stored as JSON string, rendered via React (XSS-safe by default)
- Oversized payloads: body > 1 MB rejected (Next.js default body limit)

### 9.3 Authentication Tests

- Password stored as bcrypt hash (cost factor 12) — verify hash format
- JWT secret is set via `AUTH_SECRET` env var — fail if not set
- Session expiry: NextAuth default 30 days — verify expiry is honored

---

## 10. CI/CD Integration

### 10.1 GitHub Actions Workflow (`.github/workflows/ci.yml`)

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run type-check      # tsc --noEmit
      - run: npm run lint            # eslint
      - run: npm run test:unit       # vitest run
      - run: npm run test:coverage   # vitest run --coverage
      - run: npx playwright install --with-deps
      - run: npm run test:e2e        # playwright test
```

### 10.2 npm Scripts to Add to `package.json`

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run type-check && npm run test:unit && npm run test:e2e"
  }
}
```

---

## 11. Test Priority and Rollout Plan

### Phase 1 — Foundations (Week 1-2)
- [ ] Set up Vitest + Playwright infrastructure
- [ ] Write editor store unit tests (highest business value, most complex logic)
- [ ] Write `POST /api/sites` and `POST /api/auth/register` API tests
- [ ] Write E2E: login, register, create site flows

### Phase 2 — Coverage Expansion (Week 3-4)
- [ ] Write all remaining API route tests
- [ ] Write block registry and industry template tests
- [ ] Write RTL direction logic tests
- [ ] Write multi-tenant isolation E2E tests

### Phase 3 — Quality Hardening (Week 5-6)
- [ ] Add axe-playwright accessibility tests to all pages
- [ ] Add performance budget tests
- [ ] Add visual regression snapshots for RTL layouts
- [ ] Set coverage thresholds in CI (fail below 80%)

### Phase 4 — Maintenance (Ongoing)
- [ ] New test required for every new API route
- [ ] New E2E test for every new user-facing feature
- [ ] Bug fix = test that reproduces the bug first
