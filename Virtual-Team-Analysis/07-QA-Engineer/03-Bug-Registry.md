# Bug Registry
## Safahati — All Known Issues
**Last Updated:** 2026-04-25
**Format:** ID | Title | Severity | Status | Description | Reproduction | Expected | Actual | Affected Components | Fix Notes

---

## Severity Classification

| Level | Label | Definition |
|---|---|---|
| P1 | Critical | Data loss, security breach, complete feature failure, production 500 |
| P2 | High | Build failure, type errors blocking CI, major feature broken |
| P3 | Medium | Runtime warning, deprecation, schema inconsistency, degraded UX |
| P4 | Low | Missing UX enhancement, minor inconsistency, code quality issue |

---

## Bug Status Definitions

| Status | Meaning |
|---|---|
| Open | Not yet addressed |
| In Progress | Being worked on |
| Fixed | Resolved — fix verified |
| Won't Fix | Accepted as known limitation |
| Deferred | Pushed to future sprint |

---

## P1 — Critical

### BUG-001
**Title:** Stale JWT session causes HTTP 500 on site creation after DB reset
**Severity:** P1 — Critical
**Status:** Fixed
**Date Reported:** Pre-2026-04-25
**Date Fixed:** Pre-2026-04-25

**Description:**
When the database is reset (e.g., during development, after running `drizzle-kit push` on a fresh DB, or after a production DB migration that clears user data), existing browser sessions contain a JWT with a `user.id` that no longer exists in the `users` table. When such a session is used to call `POST /api/sites`, the subsequent `db.insert(schema.sites).values({ userId: session.user.id })` fails with a foreign key constraint violation because the referenced user row does not exist. This produces an unhandled error that results in a 500 response.

**Steps to Reproduce:**
1. Register and log in as user@example.com
2. Reset the database (e.g., `rm data/db.sqlite && drizzle-kit push`)
3. Without logging out, navigate to `/dashboard/new`
4. Enter a site name and click any industry template
5. Observe the error

**Expected:** User receives a clear "Session expired — please log out and log back in" message (HTTP 401)
**Actual (before fix):** HTTP 500 with "Failed to create site" error; FK constraint error logged server-side

**Affected Components:**
- `src/app/api/sites/route.ts` — `POST` handler

**Fix Applied:**
Added an explicit DB lookup for the user before any FK-dependent insert:
```typescript
const user = db.select().from(schema.users).where(eq(schema.users.id, session.user.id)).get();
if (!user) {
  return NextResponse.json(
    { error: "Session expired — please log out and log back in" },
    { status: 401 }
  );
}
```

**Regression Risk:** Medium — fix is correct but unverified by automated test. Could regress if this check is accidentally removed. A unit test for this path is required.

**Test Coverage Required:** Yes — `POST /api/sites` with stale session (user not in DB) should return 401, not 500.

---

## P2 — High

### BUG-002
**Title:** TypeScript errors in 25+ demo hero template files — tsParticles API breaking change
**Severity:** P2 — High
**Status:** Open
**Date Reported:** 2026-04-25

**Description:**
The demo hero templates under `src/app/(demo)/demo/*/hero/` use `react-particles` and `tsparticles-slim` with GSAP animations. The tsParticles library had a breaking API change in newer versions: the `init` prop was removed from `<Particles>` component, and `IParticlesProps` type was replaced. The affected files likely import `IParticlesProps` or pass `init` as a prop, causing TypeScript compilation errors.

This affects approximately 25+ files across company hero templates (hero-01 through hero-23) and freelancer hero templates (hero-01 through hero-25). While these are demo/showcase pages and may not block the core product, they bloat the TypeScript error output and may cause `tsc --noEmit` to fail in CI.

**Steps to Reproduce:**
1. Run `npm run build` or `npx tsc --noEmit`
2. Observe TypeScript errors in files under `src/app/(demo)/demo/*/hero/`
3. Errors reference `init` prop or `IParticlesProps` type

**Expected:** TypeScript compilation succeeds with zero errors
**Actual:** Multiple TS errors in hero template demo files; build may warn or fail depending on tsconfig `strict` settings

**Affected Components:**
- All `*.tsx` files under `src/app/(demo)/demo/company/hero/`
- All `*.tsx` files under `src/app/(demo)/demo/freelancer/hero/`
- Approximately 48+ files total (23 company + 25 freelancer)

**Fix Required:**
1. Identify the correct tsParticles v2/v3 API
2. Replace `init` prop pattern with the new `particlesLoaded` callback pattern
3. Remove import of removed `IParticlesProps` type
4. Update to use `loadSlim` engine initialization pattern

**Example Fix:**
```typescript
// OLD (broken)
import Particles from "react-particles";
import type { IParticlesProps } from "react-particles";
<Particles init={customInit} options={particlesConfig} />

// NEW (correct for tsParticles v3+)
import { useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
// Initialize engine once in useEffect, pass loaded callback
```

**Regression Risk:** High — 48+ files to update; risk of introducing new errors during mass update.

---

## P3 — Medium

### BUG-003
**Title:** `middleware.ts` deprecation warning — Next.js 16 renamed middleware
**Severity:** P3 — Medium
**Status:** Open
**Date Reported:** 2026-04-25

**Description:**
Next.js 16 has deprecated/renamed the middleware file convention. The current file at `src/middleware.ts` may trigger deprecation warnings in the dev console and build output. In Next.js 16, the middleware convention may have changed to `proxy.ts` or requires specific export patterns. The current file exports `NextAuth(authConfig).auth` as the default export and a `config` matcher object.

**Current File (`src/middleware.ts`):**
```typescript
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
```

**Steps to Reproduce:**
1. Run `npm run dev`
2. Observe console output for deprecation warnings related to middleware

**Expected:** No deprecation warnings; middleware functions correctly
**Actual:** Deprecation warning about middleware file naming/convention in Next.js 16

**Affected Components:**
- `src/middleware.ts`

**Fix Required:**
Investigate Next.js 16 breaking changes for middleware. If renamed to `proxy.ts`, migrate and update the export pattern. Verify auth protection still works after migration.

**Impact:** Non-breaking currently; becomes breaking in a future Next.js version.

---

### BUG-004
**Title:** Schema drift — actual SQLite DB contains columns not defined in Drizzle schema
**Severity:** P3 — Medium
**Status:** Open
**Date Reported:** 2026-04-25

**Description:**
The Drizzle ORM schema in `src/lib/db/schema.ts` defines the `users` table with only 5 columns: `id`, `name`, `email`, `password_hash`, `created_at`. However, the actual SQLite database file (`data/db.sqlite`) may contain additional columns from previous iterations of the schema: `phone`, `country`, `phone_verified`, `business_type`, `ai_generated`, and possibly others.

When Drizzle performs `SELECT *` queries, it returns these extra columns in the result objects but TypeScript types do not include them, causing a disconnect between the actual data and the type system. More critically, when Drizzle performs `UPDATE` operations with `.set({})`, it only sets the columns in the schema definition, potentially leaving extra columns in an inconsistent state.

**Steps to Reproduce:**
1. Open the SQLite database: `sqlite3 data/db.sqlite`
2. Run `.schema users` and `.schema sites`
3. Compare output to `src/lib/db/schema.ts`
4. Observe columns present in DB but absent in schema

**Expected:** DB schema matches Drizzle schema exactly
**Actual:** Extra columns in DB not reflected in code; TypeScript types are incomplete

**Affected Components:**
- `src/lib/db/schema.ts`
- Any query that reads from `users` or `sites` tables

**Fix Required:**
1. Run `npx drizzle-kit introspect` to generate current DB schema
2. Decide: add missing columns to schema or run migration to remove them
3. If columns are needed for future features (phone verification, business type), add them with proper types and nullability
4. Generate and run migration: `npx drizzle-kit generate` + `npx drizzle-kit migrate`

**Impact:** Data correctness issue; potential for silent data loss during update operations.

---

## P4 — Low

### BUG-005
**Title:** No React error boundaries — component crash brings down entire site render
**Severity:** P4 — Low
**Status:** Open
**Date Reported:** 2026-04-25

**Description:**
The site renderer (`src/components/site/site-renderer.tsx`) and editor client (`src/components/editor/editor-client.tsx`) render block components dynamically based on config. If any single block component throws a runtime error (e.g., missing config key, unexpected null value), the entire page crashes with a white screen. There are no React error boundaries wrapping individual sections or the block renderer.

**Steps to Reproduce:**
1. Manually corrupt a section's config JSON in the DB (remove a required field)
2. Load the site or editor page
3. Observe entire page fails to render instead of just the broken section

**Expected:** The broken section shows a fallback "Section unavailable" placeholder; rest of page renders normally
**Actual:** Entire page crashes to React error boundary or blank screen

**Affected Components:**
- `src/components/site/site-renderer.tsx`
- `src/components/blocks/renderer.tsx`
- `src/components/editor/editor-client.tsx`

**Fix Required:**
Add `ErrorBoundary` wrapper around each section render:
```tsx
<ErrorBoundary fallback={<SectionErrorFallback />}>
  <BlockRenderer section={section} theme={theme} language={language} />
</ErrorBoundary>
```

**Impact:** Poor user experience on data corruption or component bugs; affects production reliability.

---

### BUG-006
**Title:** No loading states on editor page initial data fetch
**Severity:** P4 — Low
**Status:** Open
**Date Reported:** 2026-04-25

**Description:**
The editor page (`src/app/(dashboard)/dashboard/[siteId]/editor/page.tsx`) fetches site data and sections from the API before rendering the editor. During this fetch (which involves a DB lookup), the page renders a blank or unformatted state rather than a proper skeleton or loading indicator. On slow connections or under server load, users may see a blank editor for several seconds.

**Steps to Reproduce:**
1. Throttle network to "Slow 3G" in browser DevTools
2. Navigate to any site editor page
3. Observe loading state during data fetch

**Expected:** Skeleton loader showing editor layout with placeholder sections
**Actual:** Blank page or flash of unstyled content until data loads

**Affected Components:**
- `src/app/(dashboard)/dashboard/[siteId]/editor/page.tsx`
- `src/components/editor/editor-client.tsx`

**Fix Required:**
Add Next.js `loading.tsx` file alongside the editor page, or add `Suspense` with a skeleton fallback component.

---

### BUG-007
**Title:** `@typescript-eslint/no-explicit-any` disabled in editor-store.ts
**Severity:** P4 — Low
**Status:** Open
**Date Reported:** 2026-04-25

**Description:**
The first line of `src/lib/editor-store.ts` is `/* eslint-disable @typescript-eslint/no-explicit-any */`. This disables type safety for the entire file, which contains the core editor state management logic. The `setNestedValue` function uses `any` for the `obj` parameter and internal traversal. This means TypeScript will not catch type errors in the most complex, most frequently modified file in the codebase.

**Affected Components:**
- `src/lib/editor-store.ts` — lines 1, 62-76

**Fix Required:**
Replace the blanket `any` disable with proper generic typing:
```typescript
// Instead of Record<string, any>
function setNestedValue(
  obj: Record<string, unknown>,
  path: string[],
  value: unknown
): void {
  let current = obj as Record<string, unknown>;
  // ... type-safe traversal
}
```

Or use `unknown` with type narrowing and remove the eslint-disable comment.

---

### BUG-008
**Title:** Slug generation does not handle collisions with archived/deleted sites
**Severity:** P4 — Low
**Status:** Open
**Date Reported:** 2026-04-25

**Description:**
The slug uniqueness check in `POST /api/sites` queries the `sites` table using a while loop:
```typescript
while (db.select().from(schema.sites).where(eq(schema.sites.slug, slug)).get()) {
  slug = `${baseSlug}-${counter}`;
  counter++;
}
```
If sites can be deleted and their slugs should be permanently reserved (to prevent URL takeover if a site was published and indexed), this logic would allow slug reuse after deletion. A site that was once published at `my-company.safahati.com` could be claimed by a different user after the original is deleted.

**Affected Components:**
- `src/app/api/sites/route.ts` — slug generation loop

**Fix Required:**
Consider a separate `reserved_slugs` table, or add a `deleted_at` soft-delete column to sites, or document that slug reuse after deletion is intentional and acceptable.

---

### BUG-009
**Title:** `addSection` in editor store uses `Date.now()` as section ID
**Severity:** P4 — Low
**Status:** Open
**Date Reported:** 2026-04-25

**Description:**
In `src/lib/editor-store.ts`, new sections are assigned `id: Date.now().toString()`. This creates a timing-dependent ID that could theoretically collide if two sections are added in the same millisecond (unlikely in UI interaction, but possible in tests). Additionally, this ID format differs from the UUID format used for sections created via the API (`crypto.randomUUID()`), creating inconsistency between newly-added (not-yet-saved) sections and persisted sections.

**Affected Components:**
- `src/lib/editor-store.ts` — `addSection` action

**Fix Required:**
Use `crypto.randomUUID()` instead of `Date.now().toString()`:
```typescript
id: crypto.randomUUID(),
```

---

### BUG-010
**Title:** `GET /api/sites` uses `.all()` outside try/catch — unhandled DB errors
**Severity:** P4 — Low
**Status:** Open
**Date Reported:** 2026-04-25

**Description:**
The `GET /api/sites` handler does not have a try/catch block:
```typescript
const sites = db.select().from(schema.sites).where(...).all();
return NextResponse.json({ sites });
```
If the SQLite DB file is locked, corrupted, or unavailable, this will throw an unhandled exception, causing Next.js to return a 500 with a default error page rather than a clean JSON error response.

**Affected Components:**
- `src/app/api/sites/route.ts` — `GET` handler

**Fix Required:**
Wrap in try/catch and return `{ error: "Failed to load sites" }` with status 500.

---

## Bug Summary Table

| ID | Title | Severity | Status |
|---|---|---|---|
| BUG-001 | Stale JWT causes 500 on site creation | P1 | Fixed |
| BUG-002 | tsParticles `init` prop / `IParticlesProps` type errors in 25+ hero templates | P2 | Open |
| BUG-003 | middleware.ts deprecation warning in Next.js 16 | P3 | Open |
| BUG-004 | Schema drift — extra DB columns not in Drizzle schema | P3 | Open |
| BUG-005 | No React error boundaries on site/editor render | P4 | Open |
| BUG-006 | No loading states on editor page data fetch | P4 | Open |
| BUG-007 | `no-explicit-any` disabled in editor-store.ts | P4 | Open |
| BUG-008 | Slug reuse possible after site deletion | P4 | Open |
| BUG-009 | Section IDs use `Date.now()` instead of UUID | P4 | Open |
| BUG-010 | `GET /api/sites` has no try/catch around DB query | P4 | Open |

---

## Bug Entry Template (for future bugs)

```markdown
### BUG-XXX
**Title:**
**Severity:** P1 / P2 / P3 / P4
**Status:** Open / In Progress / Fixed
**Date Reported:**
**Reporter:**

**Description:**

**Steps to Reproduce:**
1.
2.
3.

**Expected:**
**Actual:**

**Affected Components:**
-

**Fix Required:**

**Fix Applied (if Fixed):**

**Test Coverage Required:** Yes / No
```
