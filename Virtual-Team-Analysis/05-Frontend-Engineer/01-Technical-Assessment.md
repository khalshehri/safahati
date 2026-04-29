# Frontend Technical Assessment — Safahati

**Assessment Date:** April 2026  
**Reviewer Role:** Frontend Engineer  
**Method:** Full source code review of all files in `src/`

Rating scale: 1 (critical issues) → 5 (well-implemented)

---

## 1. Overall Architecture

### Rating: 4 / 5

The codebase has a clear, well-reasoned architecture for a multi-tenant website platform. The separation of concerns is good:

- Database schema (`src/lib/db/schema.ts`) is clean and minimal.
- The block registry pattern (`src/lib/registry.ts` + `src/config/block-registry.ts`) is a solid plugin architecture.
- Zustand store (`src/lib/editor-store.ts`) correctly separates data state from UI state.
- Zod schema introspection (`src/lib/schema-introspect.ts`) is a clever approach to auto-generating forms without a separate form config.
- Route groups (`(auth)`, `(dashboard)`, `(site)`, `(demo)`) cleanly separate concerns.

**Strength:** The config-driven architecture is well-suited for the product's goals. The `themeToCSS()` approach of injecting CSS custom properties onto a `[data-theme-preview]` container is elegant — it scopes the client theme without polluting the admin dashboard's styles.

**Concern:** The architecture scales the number of template files linearly. With 174 `.tsx` files today, and templates planned across 31 block types × 13 industries, the file count will grow significantly. The current flat file structure within each block type's folder will need organizing.

---

## 2. TypeScript Quality

### Rating: 3.5 / 5

### Issues Found

**Issue TS-1: Widespread `any` suppression**

Multiple files suppress TypeScript's `no-explicit-any` rule:

```ts
// src/lib/editor-store.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

// src/lib/schema-introspect.ts  
/* eslint-disable @typescript-eslint/no-explicit-any */

// src/types/blocks.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
config: Record<string, any>;
defaultConfig: Record<string, any>;
configSchema: z.ZodSchema<any>;
```

These suppressions exist because block configs are dynamically typed — each block type has a different config shape, and the editor must handle all of them generically. The current `Record<string, any>` approach is pragmatic but loses type safety at the config level.

**Recommended fix:** Use `z.infer<typeof configSchema>` at the template level, and `Record<string, unknown>` with runtime narrowing at the generic editor level.

**Issue TS-2: `_zod.def` internal API access**

`src/lib/schema-introspect.ts` accesses Zod's internal structure:
```ts
function getDef(schema: z.ZodType): ZodDef {
  return (schema as any)._zod.def;
}
function getBag(schema: z.ZodType): Record<string, any> {
  return (schema as any)._zod?.bag || {};
}
```

This works with Zod v4 today, but `_zod` is a private/internal API. A Zod patch or major version update could silently break the entire schema-driven form system. There is no test coverage on this module.

**Issue TS-3: Missing `.await()` on `params`**

This is correctly handled in `editor/page.tsx`:
```ts
const { siteId } = await params;
```
But it should be verified across all dynamic route pages. The pattern is easy to miss for new contributors.

**Issue TS-4: `BlockType` union is not exhaustive in all switch paths**

The `BlockType` type has 14 members. The `iconMap` in `section-list.tsx` only maps 4 of them, defaulting unknown types to `LayoutGrid`. This should at minimum generate a TypeScript warning (requires enabling `noImplicitReturns` and exhaustive check patterns).

---

## 3. Performance Analysis

### Rating: 3 / 5

### Issue P-1: All 174 Template Files Potentially Loaded Eagerly

`src/config/block-registry.ts` imports all 14 block index files at the top level:
```ts
import "@/components/blocks/navbar";
import "@/components/blocks/hero";
// ... 12 more
```

Each block index file (`src/components/blocks/hero/index.ts`) imports all 17 hero templates. This means **all 174 template components are included in the JavaScript bundle that loads for the editor**, even if the user's site only uses 4–5 templates.

For comparison, the hero block alone has 17 templates. Each template is a React component with its own Tailwind classes, animation libraries, and sometimes particle systems. Bundling all of them eagerly is a significant performance cost.

**Measurement target:** Run `next build` and check the editor route bundle size. With 174 templates eagerly bundled, this is likely 500KB+ gzipped from templates alone.

### Issue P-2: 1449-Line `industry-templates.ts` — Client Bundle Inclusion

`src/config/industry-templates.ts` (1449 lines) is imported in `/dashboard/new/page.tsx` which is a client component:
```ts
"use client";
import { industryTemplates } from "@/config/industry-templates";
```

This means the entire 1449-line config (which includes the full default section configs for all 13 industry templates with all their text content) is included in the client JavaScript bundle.

A better approach is to keep this data on the server. The new-site page only needs the template metadata (id, name, icon, description, section count) — not the full section configs. The full configs should only be fetched server-side at site creation time.

### Issue P-3: 11 Fonts Loaded on Every Page

The root layout `src/app/layout.tsx` loads all 11 fonts via `next/font/google`:
- Inter, Cairo, Tajawal, Almarai, Rubik, Noto Sans Arabic, IBM Plex Arabic, Readex Pro, El Messiri, Amiri, Changa

Only 1–2 fonts are used at any given time (based on the active site's theme). Loading all 11 adds unnecessary download weight for every page in the application, including the auth pages and the dashboard (which only uses Geist Sans).

**Estimated impact:** ~400–800KB in font file downloads for fonts that are never used on a given page.

### Issue P-4: No Lazy Loading in Block Renderer

`src/components/blocks/renderer.tsx` renders blocks directly. With GSAP and tsParticles used in hero templates, these animation libraries get loaded even on pages that don't have a hero with particles.

### Issue P-5: No React.memo or Selective Re-rendering in Section List

The section list renders all sections on every Zustand state update. With `useEditorStore((s) => s.sections)`, any change to any section triggers a full re-render of the section list. This should use `useShallow` from Zustand 5 or `React.memo` on the individual section rows.

---

## 4. Code Quality Issues

### Rating: 3.5 / 5

### Issue CQ-1: `GripVertical` Icon Without Drag Functionality

In `src/components/editor/section-list.tsx`:
```tsx
<GripVertical size={14} className="text-gray-300 shrink-0" />
```

This icon visually implies drag-and-drop functionality but is not connected to any drag event handlers. This is a UX false affordance and a code quality issue — the icon is dead UI.

### Issue CQ-2: `window.confirm()` Used for Destructive Actions

In `src/app/(dashboard)/dashboard/page.tsx`:
```ts
if (!confirm("Are you sure you want to delete this site?")) return;
```

And in `src/components/editor/editor-client.tsx`:
```ts
if (!confirm("Unpublish this site? It will no longer be publicly accessible."))
```

`window.confirm()` is a browser-native blocking dialog that cannot be styled, does not work in some contexts (e.g., embedded iframes), and is generally considered poor UX. Should be replaced with shadcn `<Dialog>` confirmation.

### Issue CQ-3: `Date.now().toString()` as Section ID

In `editor-store.ts`:
```ts
id: Date.now().toString(),
```

Using the current timestamp as a unique ID is prone to collisions if two sections are added in the same millisecond (unlikely but possible). Should use `crypto.randomUUID()` instead, which is available in all modern browsers and Node.js.

### Issue CQ-4: No Error Boundary in Editor

If a `BlockRenderer` throws (e.g., a template has a bug with malformed config), the entire editor crashes with no recovery. A React Error Boundary wrapping each rendered section would prevent this.

### Issue CQ-5: `structuredClone` in Hot Path

In `editor-store.ts updateSectionConfig`:
```ts
const newConfig = structuredClone(sec.config);
```

`structuredClone` is correct for deep cloning but is called on every keystroke in text fields. For large configs (services with 10+ items, each with nested objects), this creates GC pressure. An Immer-based draft pattern would be more efficient.

### Issue CQ-6: Missing `aria-label` on Icon Buttons

Throughout `section-list.tsx`, editor buttons use icon-only rendering:
```tsx
<button onClick={() => moveSection(section.id, "up")}>
  <ArrowUp size={14} />
</button>
```

No `aria-label` is present. Screen readers will announce these as "button" with no description. All icon-only buttons must have `aria-label` attributes.

### Issue CQ-7: `setNestedValue` Mutates the Input Object

In `editor-store.ts`:
```ts
function setNestedValue(
  obj: Record<string, any>,
  path: string[],
  value: unknown
): void {
  let current = obj;
  // ... mutates current in place
}
```

While `structuredClone` is called before this, the mutation-in-place pattern is fragile — future refactors could accidentally skip the clone step. The function should be pure (return a new value) rather than mutating.

---

## 5. Architecture Concerns

### Rating: 3 / 5

### Concern A-1: SQLite in Production

The project uses `better-sqlite3` (SQLite) as the database. The schema imports suggest this may be intended as a development database with PostgreSQL planned for production (per the project memory: "PostgreSQL 16, Drizzle ORM"). However, the current implementation is fully SQLite-specific (`sqliteTable`, `integer` primary key patterns).

Migrating from SQLite to PostgreSQL with Drizzle requires changing the schema definition syntax (`pgTable` instead of `sqliteTable`), the driver (`drizzle-orm/pg-core`), and connection setup. This migration should be planned carefully.

### Concern A-2: No Authentication State in the Editor

The editor page does server-side auth (`const session = await auth()`), which is correct. But the `EditorClient` component has no knowledge of the authenticated user — it only receives `siteId`, `siteName`, etc. If session expires during editing, the save/publish API calls will return 401 errors with no user-visible feedback.

### Concern A-3: No Optimistic Updates

`handleSave` in the editor uses `await fetch(...)` with no optimistic update pattern. During save (which includes two API calls — one for theme, one for sections), the UI shows a spinner but the user cannot interact with the editor. For large configs, this could take 1–2 seconds.

### Concern A-4: No Error Handling on Save

```ts
} catch (err) {
  console.error("Save failed:", err);
}
```

Save failures are silently caught and logged to the console. Users receive no feedback that their save failed. A toast notification or error banner is needed.

### Concern A-5: Subdomain Routing Not Implemented

The project memory describes subdomain routing (client1.safahati.com → serve the right site). The current middleware only handles `/dashboard/:path*` protection. The published site renderer at `src/app/(site)/sites/[slug]/page.tsx` uses path-based routing (`/sites/[slug]`), not subdomain routing.

This is a known planned feature, but the middleware infrastructure for subdomain detection and routing is not yet in place.

---

## 6. Dependency Health

### Rating: 4 / 5

| Dependency | Version | Status | Notes |
|---|---|---|---|
| next | 16.1.6 | Current | Next.js 16 is latest |
| react | 19.2.3 | Current | React 19 is stable |
| typescript | ^5 | Current | |
| tailwindcss | ^4 | Current | TW4 is latest |
| drizzle-orm | ^0.45.1 | Current | |
| zustand | ^5.0.11 | Current | Zustand 5 has some API changes vs v4 |
| framer-motion | ^12.34.3 | Current | |
| next-auth | ^5.0.0-beta.30 | **Beta** | v5 is still beta — API may change |
| zod | ^4.3.6 | Current | Zod 4 is the latest major |
| better-sqlite3 | ^12.6.2 | Current | |
| lucide-react | ^0.575.0 | Current | |

**Risk: `next-auth` v5 beta.** NextAuth v5 is still in beta. The `auth.config.ts` and `auth.ts` patterns are v5-specific. Breaking changes in future beta releases are possible. Upgrading to stable v5 when released should be a planned task.

**Missing dependencies:**
- No GSAP or tsParticles in `package.json` — these must be used only in the hero template files where they are imported. If they are `import`-ed at runtime in template files, they need to be in dependencies or dynamically loaded.
- No drag-and-drop library installed (`@dnd-kit/core`, `react-beautiful-dnd`). The GripVertical icon implies this was planned but not implemented.
- No toast notification library (`sonner`, `react-hot-toast`). Editor save failures and success messages have no UI feedback.

---

## Summary Assessment

| Area | Rating | Key Issues |
|---|---|---|
| Architecture | 4/5 | SQLite in production, no subdomain routing yet |
| TypeScript quality | 3.5/5 | `any` suppressions, Zod internal API access |
| Performance | 3/5 | Eager template loading, large config in client bundle |
| Code quality | 3.5/5 | `window.confirm()`, no aria-labels, dead grip icon |
| Architecture concerns | 3/5 | No error handling on save, no error boundaries |
| Dependency health | 4/5 | NextAuth still in beta |
