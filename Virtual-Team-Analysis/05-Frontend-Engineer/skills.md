# Frontend Engineer — Skills Profile for Safahati

This document defines the specific frontend engineering skills required to contribute effectively to Safahati. Every skill maps to a real technical requirement or existing code pattern in this codebase.

---

## 1. Next.js 15/16 App Router

The project uses Next.js 16 with the App Router. All routes use the `(group)` convention, server components by default, and client components marked with `"use client"` at the file top.

**Required competencies:**

- **Route groups and layout nesting.** The project has five route groups: `(auth)`, `(dashboard)`, `(demo)`, `(site)`, and `(test)`. Each has its own layout. Understanding how layouts compose without adding to the URL structure is essential.
- **Server vs. client component boundary.** The editor page (`editor/page.tsx`) is a server component that reads from the SQLite database using Drizzle ORM, then passes `initialSections` and `initialTheme` as props to a client component (`EditorClient`). This is the correct pattern — engineers must understand when to cross this boundary and what costs it carries (no server-side data access in client components, no useState/useEffect in server components).
- **`params` as a Promise.** In Next.js 15+, `params` in page components are `Promise<{ siteId: string }>` and must be `await`-ed. This is already handled correctly in `editor/page.tsx` but is a common source of bugs.
- **Middleware.** The current middleware (`src/middleware.ts`) is minimal — it wraps NextAuth for route protection on `/dashboard`. Subdomain routing (client1.safahati.com → serve the right site) will require significant middleware expansion.
- **Static vs. dynamic rendering.** Understanding when to use `generateStaticParams`, when to force dynamic, and how to use `unstable_cache` / `cache()` for the multi-tenant site renderer.

---

## 2. TypeScript 5 — Strict Mode

The project has TypeScript configured and uses strict inference throughout. The codebase has several `// eslint-disable @typescript-eslint/no-explicit-any` comments, indicating areas of technical debt.

**Required competencies:**

- **Zod schema inference.** Block configs are typed via Zod schemas, and the `schema-introspect.ts` module walks Zod's internal `_zod.def` structure. This requires deep understanding of Zod v4 internals (the `_zod` bag pattern used here is non-public API).
- **Generic component typing.** `BlockProps`, `TemplateEntry`, and `SectionData` are the core types. Engineers must be comfortable with `Record<string, any>` narrowing and discriminated unions.
- **Avoiding `eslint-disable` suppression.** Current suppressions in `editor-store.ts`, `schema-introspect.ts`, and `blocks.ts` should be replaced with proper typed alternatives (`Record<string, unknown>` + runtime narrowing, or specific union types for config).
- **React 19 types.** The project uses React 19 (`react: "19.2.3"`). This includes changes to `forwardRef`, `use()`, and Server Actions types. Engineers must be aware of these API changes.

---

## 3. Tailwind CSS 4

This project uses the latest Tailwind CSS 4 with PostCSS integration. Tailwind 4 is a significant rewrite with a new CSS-first configuration system.

**Required competencies:**

- **CSS-first config.** Tailwind 4 removes `tailwind.config.js` in favor of configuring via `@theme` blocks inside CSS. The `globals.css` file defines the theme using `@theme inline { ... }`. Engineers must know how to add custom tokens here.
- **CSS custom properties bridge.** The `themeToCSS()` function in `types/theme.ts` generates inline CSS custom properties (`--theme-primary`, etc.) that client-site templates use via `var(--theme-primary)`. This is separate from Tailwind's token system and operates alongside it.
- **`@custom-variant`.** The `globals.css` uses `@custom-variant dark (&:is(.dark *))` — this is Tailwind 4's way of defining the dark mode variant.
- **`tw-animate-css`.** The project imports `tw-animate-css` for CSS-based animations (replace-in/out patterns). Engineers must understand this library vs. Framer Motion and when to use each.
- **No `tailwind.config.js` → no `theme.extend`.** Custom values must go in `globals.css @theme` blocks. Engineers used to Tailwind 3 will need to unlearn the config file approach.

---

## 4. shadcn/ui Component Integration

shadcn/ui is used for the component library. Unlike most UI libraries, shadcn copies source code into the project rather than installing as a package.

**Required competencies:**

- **Component source ownership.** The components in `src/components/ui/` are owned by the project, not external packages. They can (and should) be modified directly.
- **Variant pattern (CVA).** shadcn/ui uses `class-variance-authority` (CVA) for component variants. Adding a new variant to `Button`, `Badge`, etc. requires adding to the CVA config, not creating a wrapper.
- **Radix UI primitives.** shadcn/ui is built on `radix-ui`. Understanding Radix's accessibility patterns (ARIA, keyboard navigation, focus trap for modals) is required for adding new complex components like Dialog, Sheet, and Select.
- **Adding new components.** Run `npx shadcn add [component-name]` to scaffold new components. Currently missing: `Dialog` (for confirmations), `Sheet` (for mobile bottom panels), `Tooltip` (for icon-only buttons).

---

## 5. Zustand 5 State Management

The editor state is managed by a single Zustand store (`src/lib/editor-store.ts`). Zustand 5 has a different internal API than v4.

**Required competencies:**

- **`create<State>((set, get) => ...)` pattern.** The store uses only `set` currently. `get` is needed for actions that read current state before updating (e.g., undo/redo).
- **Immer integration.** The `updateSectionConfig` action uses `structuredClone` + manual path traversal (`setNestedValue`). Immer would simplify this significantly for deep mutations.
- **History stack for undo/redo.** Adding undo/redo requires either: (a) a past/present/future state pattern using an array of snapshots, or (b) a command pattern where each action is a reversible operation. The snapshot approach is simpler to implement.
- **Selector performance.** The store uses individual selectors (`useEditorStore((s) => s.sections)`) which is correct — avoids unnecessary re-renders. Engineers should not use `useEditorStore()` without a selector.
- **Outside-component access.** `useEditorStore.getState()` and `useEditorStore.setState()` are used for imperative updates outside of React render cycles. This pattern is used in `section-list.tsx` and must be used carefully.

---

## 6. Framer Motion

Framer Motion 12 is installed as a dependency but is currently underused in the dashboard/editor. Published site templates use it for scroll animations and entry effects.

**Required competencies:**

- **`motion` components.** Wrapping any standard HTML element with `motion.div` enables animation via `initial`, `animate`, and `exit` props.
- **`AnimatePresence`.** Required for exit animations (e.g., sidebar panel unmounting with a slide-out). Without `AnimatePresence`, `exit` props have no effect.
- **`useReducedMotion`.** Must be used to disable or minimize animations for users with `prefers-reduced-motion: reduce`.
- **Layout animations.** `layout` prop enables automatic FLIP animations when elements change position — useful for section reordering in the editor.
- **Performance.** Framer Motion should not be used for CSS-trivially-achievable animations (hover, focus). Reserve it for mount/unmount transitions and complex sequence animations.

---

## 7. RTL Support in Code

RTL is the primary design language for the MENA market. Implementation in code requires more than adding `dir="rtl"`.

**Required competencies:**

- **Logical CSS properties.** Use `ps`/`pe` (padding-start/end), `ms`/`me` (margin-start/end), `text-start`/`text-end`, `start-0`/`end-0` in Tailwind instead of directional equivalents. These properties flip automatically in RTL contexts.
- **`dir` attribute propagation.** The preview canvas sets `dir={language === "ar" ? "rtl" : "ltr"}` — this correctly propagates to all descendant elements. The dashboard shell has no `dir` attribute — this must be addressed for Arabic dashboard UI.
- **Flex direction in RTL.** `flex-row` reverses in RTL without any code change if the parent has `dir="rtl"`. This is usually correct for navigation and button groups, but must be verified for layouts that intentionally should NOT reverse.
- **Icon mirroring.** Directional icons (arrows, chevrons) need manual mirroring. Use conditional classes: `className={isRtl ? "rotate-180" : ""}` or use `-rtl:rotate-180` class if custom Tailwind variant is set up.
- **`unicode-bidi: isolate`.** Text fields containing mixed LTR/RTL content need `style={{ unicodeBidi: 'isolate' }}` or the `isolate` Tailwind utility to prevent bidi algorithm leakage.

---

## 8. Performance Optimization

**Required competencies:**

- **Dynamic imports / `React.lazy`.** The 174 block template files should not all load eagerly. Lazy loading block components (only loading the template that is actually rendered) is a significant bundle size optimization.
- **Code splitting at route boundaries.** Next.js App Router automatically splits at route boundaries. No manual effort needed here beyond avoiding large shared imports in root layouts.
- **`next/font/google`.** All 11 fonts are loaded in the root layout using `next/font/google` with `display: swap` — this is correct. However, loading all fonts on every page (including pages that only use 1–2 fonts) adds unnecessary download weight.
- **Bundle analysis.** Understanding how to run `@next/bundle-analyzer` and interpret the output. The `industry-templates.ts` file at 1449 lines is likely a significant bundle contributor.
- **Image optimization.** `next/image` must be used for any images in published site templates. Currently, templates use plain `<img>` tags in some cases.
- **React Server Components.** Shifting data fetching to the server (RSC) removes the need for `useEffect` + `fetch` patterns on the client dashboard page.

---

## 9. Database Integration (Drizzle ORM + SQLite)

**Required competencies:**

- **Drizzle sync (`.get()`, `.all()`).** The project uses `better-sqlite3` which operates synchronously. `db.select().from(table).get()` returns a single row; `.all()` returns an array. The `await` keyword must NOT be used with these calls in server components.
- **Drizzle schema.** The schema in `src/lib/db/schema.ts` defines `users`, `sites`, and `sections` tables. Engineers must understand how to add migrations using `drizzle-kit generate` and `drizzle-kit push`.
- **JSON string storage.** Both `theme` and `config` are stored as JSON strings in SQLite. `JSON.parse()` and `JSON.stringify()` must be used when reading/writing. Type-safe wrappers should be added to prevent data corruption.

---

## 10. Testing Standards

The project currently has no test files. A frontend engineer should be capable of adding:

- **Unit tests** for pure utility functions (`schema-introspect.ts`, `themeToCSS()`, `setNestedValue`).
- **Component tests** using React Testing Library for critical UI interactions (form submission, section selection, language toggle).
- **E2E tests** using Playwright for critical user flows (registration, create site, publish site).

Required tools: Vitest (unit/component), Playwright (e2e), `@testing-library/react`.

---

## Skills Matrix

| Skill | Relevance | Priority |
|---|---|---|
| Next.js 16 App Router | Core architecture | Critical |
| TypeScript strict mode | All new code | Critical |
| Tailwind CSS 4 | All UI styling | Critical |
| shadcn/ui | Dashboard/editor components | High |
| Zustand 5 | Editor state | High |
| RTL/logical CSS | MENA market requirement | High |
| Drizzle ORM + SQLite | Data layer | High |
| React 19 patterns | Performance, new APIs | High |
| Framer Motion 12 | UI animation | Medium |
| Performance optimization | Bundle size, loading | Medium |
| Testing (Vitest + Playwright) | Quality assurance | Medium |
| GSAP / tsParticles | Hero template animations | Low (demo only) |
