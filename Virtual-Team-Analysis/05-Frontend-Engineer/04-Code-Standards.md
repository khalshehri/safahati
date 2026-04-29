# Code Standards — Safahati Frontend

This document defines the coding standards for the Safahati frontend codebase. All new code must follow these standards. Existing code should be migrated incrementally.

---

## 1. File and Directory Naming

### Rules

| Type | Convention | Example |
|---|---|---|
| React components | `kebab-case.tsx` | `hero-template-01.tsx` |
| Hooks | `use-kebab-case.ts` | `use-debounced-callback.ts` |
| Utilities / lib | `kebab-case.ts` | `schema-introspect.ts` |
| Config files | `kebab-case.ts` | `block-registry.ts` |
| Types files | `kebab-case.ts` | `blocks.ts`, `theme.ts` |
| API routes | `route.ts` (Next.js convention) | `src/app/api/sites/route.ts` |
| Page files | `page.tsx` (Next.js convention) | |
| Layout files | `layout.tsx` (Next.js convention) | |
| Block index files | `index.ts` | `src/components/blocks/hero/index.ts` |
| Block type files | `types.ts` | `src/components/blocks/hero/types.ts` |

### Directory Structure

```
src/
├── app/                          # Next.js App Router routes
│   ├── (auth)/                   # Route group: login, register
│   ├── (dashboard)/              # Route group: admin panel
│   ├── (site)/                   # Route group: published site renderer
│   ├── (demo)/                   # Route group: component demos
│   ├── api/                      # API routes
│   ├── layout.tsx                # Root layout (fonts, global CSS)
│   ├── page.tsx                  # Landing page (app.safahati.com root)
│   └── globals.css               # Global styles + Tailwind config
│
├── components/
│   ├── blocks/                   # Block templates (one subdir per block type)
│   │   ├── hero/
│   │   │   ├── index.ts          # registerBlock() call + all template imports
│   │   │   ├── types.ts          # HeroConfig interface
│   │   │   ├── hero-template-01.tsx
│   │   │   └── hero-template-XX.tsx
│   │   └── [other block types]/
│   ├── dashboard/                # Dashboard-specific components
│   ├── editor/                   # Editor-specific components
│   │   ├── fields/               # Schema form field renderers
│   │   └── [editor components]
│   ├── site/                     # Site renderer components
│   └── ui/                       # shadcn/ui components (owned by project)
│
├── config/
│   ├── block-registry.ts         # Imports all blocks to trigger registration
│   ├── industry-templates-meta.ts # Lightweight metadata (client-safe)
│   ├── industry-templates.server.ts # Full configs (server-only)
│   └── theme-presets.ts          # Color/font theme presets
│
├── hooks/                        # Custom React hooks
├── lib/
│   ├── db/                       # Drizzle DB setup + schema
│   ├── registry.ts               # Block registry (Map + CRUD)
│   ├── editor-store.ts           # Zustand editor state
│   ├── schema-introspect.ts      # Zod → FieldDescriptor introspection
│   └── utils.ts                  # cn() and other shared utilities
│
└── types/
    ├── blocks.ts                 # BlockType, SectionData, etc.
    ├── theme.ts                  # SiteTheme, themeToCSS()
    └── index.ts                  # Re-exports
```

---

## 2. Component Structure

### Standard Component File Layout

```tsx
// 1. "use client" directive (if needed) — MUST be first line
"use client";

// 2. React imports
import { useState, useCallback, useMemo } from "react";

// 3. Next.js imports
import Link from "next/link";

// 4. Third-party library imports (alphabetical within group)
import { motion } from "framer-motion";
import { Globe, Plus } from "lucide-react";

// 5. Internal imports — absolute paths, grouped by type
// 5a. Types
import type { SectionData } from "@/types/blocks";
import type { SiteTheme } from "@/types/theme";

// 5b. UI components (shadcn/ui)
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// 5c. Domain components
import { BlockRenderer } from "@/components/blocks/renderer";

// 5d. Utilities
import { cn } from "@/lib/utils";

// 6. Local types / interfaces
interface MyComponentProps {
  title: string;
  language: "en" | "ar";
  onAction?: () => void;
}

// 7. Component (default export for pages, named export for components)
export function MyComponent({ title, language, onAction }: MyComponentProps) {
  // 7a. Hooks first
  const [isOpen, setIsOpen] = useState(false);
  
  // 7b. Derived values with useMemo
  const isRtl = useMemo(() => language === "ar", [language]);
  
  // 7c. Event handlers with useCallback
  const handleClick = useCallback(() => {
    setIsOpen(true);
    onAction?.();
  }, [onAction]);
  
  // 7d. Render
  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      {/* ... */}
    </div>
  );
}
```

### Rules

- **Named exports for components**, default exports for pages (Next.js requirement).
- **No anonymous function components** (`export default function() {}`). Always name the function.
- **Props interface named `[ComponentName]Props`**, defined directly above the component.
- **Keep components under 200 lines.** Extract sub-components or custom hooks when this is exceeded.
- **One component per file** (exceptions: small helper components used only within that file).

---

## 3. TypeScript Conventions

### Strict Mode Requirements

The project should run with these `tsconfig.json` options enabled:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": false
  }
}
```

### Type Definitions

**Do:**
```ts
// Use specific types
const blockType: BlockType = "hero";

// Use type inference for local variables
const sections = useEditorStore((s) => s.sections); // inferred as SectionData[]

// Use unknown + type narrowing instead of any
function processConfig(config: Record<string, unknown>) {
  if (typeof config.heading === "string") {
    return config.heading;
  }
  return "";
}

// Use z.infer for Zod-typed values
type HeroConfig = z.infer<typeof heroConfigSchema>;
```

**Don't:**
```ts
// Never use any — use unknown + narrowing
const config: Record<string, any> = {}; // BAD

// Never cast to any to bypass type errors
const result = (schema as any)._zod.def; // BAD — use proper typing or a utility function

// Never ignore TypeScript errors with @ts-ignore
// @ts-ignore  // BAD
```

**Acceptable exceptions to strict typing:**
- Zod schema introspection in `schema-introspect.ts` — accessing `_zod.def` requires casting. This is acceptable ONLY in this specific file, and must be documented with a comment explaining why.
- Third-party library types that are incomplete — use `as unknown as CorrectType` not `as any`.

### Type vs. Interface

- Use `interface` for object shapes that may be extended (`BlockDefinition`, `TemplateEntry`, `SectionData`).
- Use `type` for unions, primitives, tuples, and mapped types (`BlockType`, `FieldKind`, `ViewMode`).
- Never mix `interface` and `type` for the same conceptual item.

---

## 4. Tailwind CSS Patterns

### Class Organization

Follow this order for Tailwind class groups:

```
1. Layout: flex, grid, block, relative, absolute, fixed
2. Box model: w-*, h-*, max-w-*, p-*, m-*
3. Positioning: top-*, left-*, inset-*, z-*
4. Typography: text-*, font-*, leading-*, tracking-*
5. Colors: bg-*, text-*, border-*, ring-*
6. Borders: border, rounded-*
7. Effects: shadow-*, opacity-*, blur-*
8. Transitions: transition-*, duration-*, ease-*
9. State modifiers: hover:, focus:, active:, disabled:, dark:
```

Example:
```tsx
className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
```

### RTL-Safe Classes

Always use logical properties for direction-sensitive layout:

```tsx
// WRONG — breaks in RTL
<div className="pl-4 pr-2 text-left ml-auto">

// CORRECT — works in both LTR and RTL
<div className="ps-4 pe-2 text-start ms-auto">
```

| Avoid | Use Instead |
|---|---|
| `pl-*` | `ps-*` (padding-inline-start) |
| `pr-*` | `pe-*` (padding-inline-end) |
| `ml-*` | `ms-*` (margin-inline-start) |
| `mr-*` | `me-*` (margin-inline-end) |
| `left-*` | `start-*` |
| `right-*` | `end-*` |
| `text-left` | `text-start` |
| `text-right` | `text-end` |
| `border-l-*` | `border-s-*` |
| `border-r-*` | `border-e-*` |
| `rounded-l-*` | `rounded-s-*` |
| `rounded-r-*` | `rounded-e-*` |

**Exception:** When an element intentionally should NOT mirror in RTL (e.g., a timeline that reads left-to-right in both languages), document this with a comment:
```tsx
// NOTE: Timeline reads left-to-right in both EN and AR (chronological, not reading direction)
<div className="pl-4 border-l-2 border-blue-200">
```

### Using `cn()` for Conditional Classes

The project uses `cn()` (a `clsx` + `tailwind-merge` wrapper) from `@/lib/utils`:

```tsx
// CORRECT
<button
  className={cn(
    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
    isDirty
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-gray-100 text-gray-400 cursor-not-allowed"
  )}
>

// WRONG — string concatenation can produce invalid class combinations
<button className={`base-classes ${isDirty ? "active" : "inactive"}`}>
```

### No Arbitrary Values Without Comment

```tsx
// WRONG — magic number with no explanation
<div className="h-[583px]">

// CORRECT — if arbitrary value is truly needed
<div className="h-[583px]"> {/* Matches the hero template's fixed-height design */}

// BETTER — use a semantic token if possible
<div className="h-screen">
```

---

## 5. Block Template Standards

All block templates in `src/components/blocks/[type]/[type]-template-XX.tsx` must follow these standards:

### Required Structure

```tsx
"use client";

import type { BlockProps } from "@/types/blocks";
import type { HeroConfig } from "./types";  // Block-specific config type

export function HeroTemplate01({ config, language }: BlockProps) {
  const c = config as HeroConfig;    // Cast to specific type
  const isAr = language === "ar";

  return (
    <section
      className="..."
      // The <section> wraps the block and provides the semantic HTML landmark
      aria-label={isAr ? c.headingAr : c.heading}
    >
      {/* Content */}
    </section>
  );
}
```

### Rules for Block Templates

1. **Always use `<section>` as the root element** with an `aria-label`.
2. **Never hardcode text** — all text comes from `config`.
3. **Always implement bilingual** — every text field has `isAr ? c.fieldAr : c.field`.
4. **Use CSS custom properties for theme colors** — `var(--theme-primary)`, not hardcoded hex values.
5. **Use `style={{ ... }}` for dynamic theme values**, Tailwind for structural/layout classes.
6. **Never use `window`, `document`, or browser APIs at module level** — only inside `useEffect` or event handlers (SSR safety).
7. **Animations must respect `prefers-reduced-motion`.**
8. **Images must be `next/image`** for optimization. Exception: external URLs from user config — use `<img>` with manual sizing.

### Config Type Convention

Each block type has a `types.ts` file defining its config interface:

```ts
// src/components/blocks/hero/types.ts
export interface HeroConfig {
  heading: string;
  headingAr: string;
  subheading: string;
  subheadingAr: string;
  badge?: {
    text: string;
    textAr: string;
  };
  ctaPrimary: {
    text: string;
    textAr: string;
    url: string;
  };
  ctaSecondary?: {
    text: string;
    textAr: string;
    url: string;
  };
  backgroundImage?: string;
}
```

---

## 6. Zustand Store Standards

### Selector Pattern (Required)

```tsx
// CORRECT — subscribes only to the specific slice
const sections = useEditorStore((s) => s.sections);
const isDirty = useEditorStore((s) => s.isDirty);

// WRONG — subscribes to entire store, re-renders on any state change
const store = useEditorStore(); // BAD
```

### Action Naming

- Actions that set a value: `setX(value)` — e.g., `setLanguage`, `setViewMode`
- Actions that toggle: `toggleX(id?)` — e.g., `toggleVisibility`
- Actions that mutate a collection: `addX`, `removeX`, `moveX`, `updateX`
- Actions that apply presets: `applyX` — e.g., `applyThemePreset`
- Initialization: `initializeX` — e.g., `initializeStore`

### Immutability

All state updates must return new object references. Never mutate state directly:

```ts
// CORRECT
updateThemeColor: (colorKey, value) =>
  set((s) => ({
    theme: {
      ...s.theme,
      colors: { ...s.theme.colors, [colorKey]: value },
    },
    isDirty: true,
  })),

// WRONG — mutates existing state
updateThemeColor: (colorKey, value) =>
  set((s) => {
    s.theme.colors[colorKey] = value; // BAD: mutates!
    return { isDirty: true };
  }),
```

---

## 7. RTL Handling Standards

### Dashboard/Editor Components

```tsx
// 1. Accept language as a prop or read from store
const { language } = useEditorStore();
const isRtl = language === "ar";

// 2. Apply dir attribute to the root element
<div dir={isRtl ? "rtl" : "ltr"}>

// 3. Use logical CSS properties (see Tailwind section above)

// 4. Mirror directional icons
<ArrowLeft
  size={14}
  className={cn(isRtl && "rotate-180")}
/>

// 5. Apply Arabic font for Arabic text
<p style={{ fontFamily: isRtl ? "var(--font-cairo)" : undefined }}>
  {isRtl ? arabicText : englishText}
</p>
```

### Published Site Templates

Templates receive `language: "en" | "ar"` via `BlockProps`. All text selection is `isAr ? c.fieldAr : c.field`. The `dir` attribute is applied by the parent container in `editor-client.tsx`:

```tsx
<div
  data-theme-preview
  dir={language === "ar" ? "rtl" : "ltr"}
  style={themeToCSS(theme)}
>
  {/* All block templates render inside this container */}
</div>
```

Templates do not need to set `dir` themselves — they inherit from this container.

---

## 8. API Route Standards

### Structure

```ts
// src/app/api/[resource]/route.ts
import { auth } from "@/auth";
import { db, schema } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

// Input validation schema
const CreateSiteSchema = z.object({
  name: z.string().min(1).max(100),
  industry: z.string(),
  language: z.enum(["en", "ar"]),
});

export async function POST(request: Request) {
  // 1. Auth check first
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse + validate input
  const body = await request.json().catch(() => null);
  const parsed = CreateSiteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { name, industry, language } = parsed.data;

  // 3. Business logic
  try {
    // DB operations
    return NextResponse.json({ site }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/sites]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

### Rules

1. **Auth check before anything else.**
2. **Always validate input with Zod.** Never trust `request.json()` directly.
3. **Return typed error objects** `{ error: string }`, not raw strings.
4. **Log errors** with route context prefix: `console.error("[POST /api/sites]", error)`.
5. **Use correct HTTP status codes:** 200 (OK), 201 (created), 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error).
6. **Never expose stack traces or DB errors to the client** — log them server-side and return a generic 500 message.

---

## 9. Testing Standards

### Unit Tests (Vitest)

Test pure functions in `src/lib/`:

```ts
// src/lib/__tests__/utils.test.ts
import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn()", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("deduplicates conflicting Tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "skip", "include")).toBe("base include");
  });
});
```

### Component Tests (React Testing Library)

```tsx
// src/components/editor/__tests__/section-list.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { SectionList } from "../section-list";
// ... setup Zustand mock

it("renders section names", () => {
  // setup mock store with sections
  render(<SectionList />);
  expect(screen.getByText("Hero")).toBeInTheDocument();
});
```

### E2E Tests (Playwright)

```ts
// tests/e2e/create-site.spec.ts
import { test, expect } from "@playwright/test";

test("creates a site and opens editor", async ({ page }) => {
  await page.goto("/dashboard/new");
  await page.fill('[id="siteName"]', "Test Site");
  await page.click("text=Continue");
  await page.click("text=Freelancer");
  await expect(page).toHaveURL(/\/editor$/);
});
```

### Coverage Targets

| Area | Target |
|---|---|
| `src/lib/` utilities | 80% line coverage |
| Critical user flows (E2E) | 100% (create site, publish, delete) |
| Editor store actions | 70% |
| Block template rendering | Smoke test (renders without error) |

---

## 10. Git Commit Standards

### Commit Message Format

```
type(scope): short description

Optional longer description.

Co-Authored-By: ...
```

**Types:**
| Type | When to use |
|---|---|
| `feat` | New feature (new template, new editor capability) |
| `fix` | Bug fix |
| `refactor` | Code improvement with no behavior change |
| `perf` | Performance improvement |
| `style` | CSS/UI-only changes |
| `test` | Adding or updating tests |
| `docs` | Documentation updates |
| `chore` | Dependency updates, config changes |

**Scopes:**
- `editor` — editor components and store
- `dashboard` — dashboard shell, site list
- `blocks` — block template files
- `registry` — block registry + config
- `auth` — authentication pages and API
- `api` — API routes
- `db` — database schema and queries
- `rtl` — RTL/bilingual changes
- `perf` — performance improvements

**Examples:**
```
feat(editor): add undo/redo with 20-step history stack
fix(dashboard): replace window.confirm with Dialog for site deletion
refactor(blocks): lazy-load hero templates with React.lazy
perf(config): move industry templates to server-only import
fix(rtl): use logical CSS properties in dashboard shell
```

### Branch Naming

```
feature/[scope]-[short-description]     # feature/editor-undo-redo
fix/[scope]-[short-description]         # fix/dashboard-confirm-dialog
refactor/[scope]-[short-description]    # refactor/blocks-lazy-loading
```

### Pre-Commit Checks

All code must pass:
1. `npm run lint` — ESLint with Next.js config
2. `npm run build` — TypeScript must compile with zero errors
3. No `console.log` left in committed code (use `console.warn` or `console.error` only where appropriate)
