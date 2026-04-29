# Frontend Implementation Plan — Safahati

This is a sprint-by-sprint plan for frontend improvements. Sprints are 2 weeks each. Tasks are ordered by dependency and business impact.

**Assumptions:**
- 1 frontend engineer, 1 UI/UX designer
- Sprints are 2 weeks
- Each task has a story point estimate (1 pt = 1 day of focused engineering work)

---

## Sprint 1: Critical Fixes and Foundations (Weeks 1–2)

**Goal:** Fix all critical bugs and UX regressions. No new features — only quality.

---

### Task 1.1 — Fix tsParticles Deprecated API

**Files:** All hero template files using tsParticles  
**Points:** 2  
**Description:** Update tsParticles usage from the deprecated `init` prop to the `initParticlesEngine` pattern required by `@tsparticles/react` v3. Install `@tsparticles/react` and `@tsparticles/slim`, remove the old `tsparticles` package if present.

**Acceptance Criteria:**
- `npm run build` produces zero TypeScript errors related to tsParticles
- All hero templates with particle effects render correctly in the browser
- `initParticlesEngine` is called in a `useEffect` with proper engine setup

**Steps:**
1. `npm install @tsparticles/react @tsparticles/slim`
2. Identify all hero template files using particles (grep for `tsparticles` or `Particles`)
3. Replace deprecated init pattern in each file
4. Test each affected template in the browser
5. Run `npm run build` to verify zero TS errors

---

### Task 1.2 — Replace `window.confirm()` with Dialog

**Files:** `src/app/(dashboard)/dashboard/page.tsx`, `src/components/editor/editor-client.tsx`  
**Points:** 2  
**Description:** Add `ConfirmDialog` component using shadcn/ui `<Dialog>`. Replace both uses of `window.confirm()`.

**Acceptance Criteria:**
- Deleting a site shows a styled dialog with the site name in the title
- Unpublishing shows a styled dialog
- Both dialogs have "Cancel" and action buttons
- Pressing Escape key or clicking outside dismisses the dialog
- `window.confirm()` no longer appears anywhere in the codebase

**Steps:**
1. Run `npx shadcn add dialog` if Dialog is not already in `src/components/ui/`
2. Create `src/components/ui/confirm-dialog.tsx`
3. Replace delete confirm in `dashboard/page.tsx`
4. Replace unpublish confirm in `editor-client.tsx`
5. Test keyboard accessibility (Escape to close, Tab between buttons)

---

### Task 1.3 — Use `crypto.randomUUID()` for Section IDs

**Files:** `src/lib/editor-store.ts`  
**Points:** 0.5  
**Description:** Replace `Date.now().toString()` with `crypto.randomUUID()`.

**Acceptance Criteria:**
- `addSection` uses `crypto.randomUUID()` for the new section `id`
- IDs are unique UUIDs (format: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`)

---

### Task 1.4 — Fix Industry Template Descriptions for Arabic

**Files:** `src/app/(dashboard)/dashboard/new/page.tsx`  
**Points:** 0.5  
**Description:** The industry picker on step 2 shows `template.description` for all languages. Should show `template.descriptionAr` when `language === 'ar'`.

**Acceptance Criteria:**
- When a user selects Arabic in step 1, step 2 shows Arabic descriptions under each industry card
- English users continue to see English descriptions

**Steps:**
1. In `new/page.tsx`, change `{template.description}` to `{language === 'ar' ? template.descriptionAr : template.description}`

---

### Task 1.5 — Add Back Button on Step 2 of New Site Wizard

**Files:** `src/app/(dashboard)/dashboard/new/page.tsx`  
**Points:** 0.5  
**Description:** The industry picker (step 2) has no way to go back to step 1 without navigating to `/dashboard`. Add a back button that calls `setStep(1)`.

**Acceptance Criteria:**
- A "← Back" button appears above or below the step heading on step 2
- Clicking it returns to step 1 WITHOUT clearing the site name or language selection
- The site name and language entered in step 1 persist through the back navigation

---

### Task 1.6 — Add Step Indicator to New Site Wizard

**Files:** `src/app/(dashboard)/dashboard/new/page.tsx`  
**Points:** 1  
**Description:** Add a visual step indicator (progress dots or "1 of 2" label) to both steps of the wizard.

**Acceptance Criteria:**
- Both steps show "Step 1 of 2" / "Step 2 of 2" in a consistent position
- The indicator visually distinguishes the active step from the completed step
- Works correctly in both LTR and RTL layouts (dots should reflect reading direction)

---

### Task 1.7 — Fix Status Badge Colors

**Files:** `src/app/(dashboard)/dashboard/page.tsx`  
**Points:** 0.5  
**Description:** Published badge should be green, draft badge should be amber/yellow. Currently both use shadcn default variants that have no semantic color meaning.

**Acceptance Criteria:**
- Published sites show a green badge: `bg-green-100 text-green-700`
- Draft sites show an amber badge: `bg-amber-100 text-amber-700`
- Both have appropriate icon (green circle dot for published, empty circle for draft)

---

### Task 1.8 — Remove Non-Functional GripVertical Icon

**Files:** `src/components/editor/section-list.tsx`  
**Points:** 0.5  
**Description:** Remove or hide the `GripVertical` icon from section cards until drag-and-drop is actually implemented. It currently creates a false affordance.

**Acceptance Criteria:**
- No `GripVertical` icon appears in the section list
- The space previously occupied by the icon is absorbed into the card padding

---

### Sprint 1 Total: 7.5 points (achievable in 2 weeks for 1 engineer)

---

## Sprint 2: Performance and Error Handling (Weeks 3–4)

**Goal:** Improve editor stability, add user feedback on errors, and reduce initial bundle size.

---

### Task 2.1 — Add Toast Notifications

**Files:** `src/app/layout.tsx`, `src/components/editor/editor-client.tsx`  
**Points:** 1  
**Description:** Install `sonner` and add toast notifications for editor save failures, publish errors, and any other silent error paths.

**Acceptance Criteria:**
- Save failure shows a red toast: "Save failed. Please check your connection and try again."
- Publish failure shows a red toast
- Success actions do NOT show toasts (button state change is sufficient)
- Toaster is positioned at bottom-right, does not overlap editor UI

**Steps:**
1. `npm install sonner`
2. Add `<Toaster />` to root layout
3. Replace `console.error("Save failed:", err)` with `toast.error(...)`
4. Replace `console.error("Publish failed:", err)` with `toast.error(...)`

---

### Task 2.2 — Add Error Boundaries to Editor

**Files:** `src/components/blocks/section-error-boundary.tsx` (new), `src/components/editor/editor-client.tsx`  
**Points:** 2  
**Description:** Wrap each rendered section in the editor canvas with a React Error Boundary. If a template throws, show a recovery UI for that section only without crashing the entire editor.

**Acceptance Criteria:**
- A template rendering error shows an inline error card with the error message and a "Retry" button
- Other sections continue to render normally when one section errors
- Retry button resets the error boundary and attempts to re-render
- Error is logged to console with section context

---

### Task 2.3 — Move Industry Templates Config to Server-Only

**Files:** `src/config/industry-templates.ts` (refactor), `src/config/industry-templates-meta.ts` (new), `src/app/(dashboard)/dashboard/new/page.tsx`  
**Points:** 3  
**Description:** Split `industry-templates.ts` into a lightweight metadata file (client-safe, small) and a full-config file (server-only). Update the new-site page to import only the metadata.

**Acceptance Criteria:**
- `industry-templates-meta.ts` contains only: id, name, nameAr, icon, description, descriptionAr, section count, defaultColors
- `industry-templates-meta.ts` is under 5KB
- `industry-templates.server.ts` (or keep same name) contains full configs and is only imported in API routes
- `dashboard/new/page.tsx` imports only the metadata file
- Site creation still works correctly (API uses full config)
- `npm run build` bundle analyzer shows reduced new-site page bundle size

---

### Task 2.4 — Add `aria-label` to All Icon Buttons

**Files:** `src/components/editor/section-list.tsx`, `src/components/editor/editor-client.tsx`, `src/components/editor/content-editor-panel.tsx`, `src/app/(dashboard)/dashboard/page.tsx`  
**Points:** 1  
**Description:** Add `aria-label` attributes to all icon-only buttons throughout the dashboard and editor.

**Acceptance Criteria:**
- Every `<button>` that contains only an icon has a descriptive `aria-label`
- Labels are bilingual where the UI supports it (e.g., `aria-label="Move up"` or rendered via i18n)
- Screen reader can navigate and operate all editor controls

**Complete list of buttons needing labels:**
- Section list: ArrowUp, ArrowDown, Eye/EyeOff, Trash2
- Editor top bar: ArrowLeft (back), Language toggle, Device mode buttons
- Dashboard: Trash2 (delete site)
- Content editor: ArrowLeft (back to sections)

---

### Task 2.5 — Lazy-Load Block Templates (Phase 1)

**Files:** `src/components/blocks/hero/index.ts`, `src/lib/registry.ts`, `src/components/blocks/renderer.tsx`  
**Points:** 5  
**Description:** Implement dynamic import with `React.lazy` for the hero block templates as a pilot. Measure bundle size improvement, then roll out to remaining 13 block types.

**Acceptance Criteria (Phase 1 — Hero only):**
- Hero templates use `React.lazy(() => import('./hero-template-XX'))`
- `BlockRenderer` is wrapped with `Suspense` + `BlockSkeleton` fallback
- `npm run build` shows hero templates are in separate JS chunks, not the main bundle
- Editor loads and renders hero templates correctly (with skeleton during first load)

**Note:** Phase 2 (all block types) is planned for Sprint 4 after validating the approach.

---

### Sprint 2 Total: 12 points (2 weeks, may need to defer 2.5 to Sprint 3)

---

## Sprint 3: Editor UX Improvements (Weeks 5–6)

**Goal:** Improve editor usability — template picker, add component flow, transitions.

---

### Task 3.1 — Redesign Template Picker with Visual Thumbnails (Phase 1)

**Files:** `src/components/editor/content-editor-panel.tsx`, new `src/components/editor/template-picker.tsx`  
**Points:** 4  
**Description:** Replace the 2-column text button grid with a horizontally scrollable row of thumbnail cards. Phase 1: use color swatches (dominant color per template) instead of screenshots.

**Acceptance Criteria:**
- Template picker renders as a horizontal scroll row, not a grid
- Each template card shows: primary color swatch (60×48px), template name below
- Active template has a blue ring border
- Clicking a template updates the preview with a 150ms fade transition
- Accessible: arrow key navigation through templates, Enter to select

---

### Task 3.2 — Add Sidebar Panel Transitions

**Files:** `src/components/editor/editor-client.tsx`, `src/components/editor/section-list.tsx`, `src/components/editor/content-editor-panel.tsx`  
**Points:** 2  
**Description:** Add Framer Motion transitions when switching between sidebar panels (section list → content editor → theme editor).

**Acceptance Criteria:**
- Switching from section list to content editor: slides left (250ms ease-out)
- Back navigation: slides right (200ms ease-in)
- Tab switching (Content/Theme): crossfade (150ms)
- No layout shift during transitions
- Respects `prefers-reduced-motion` (transitions disabled or instant when preference is set)

---

### Task 3.3 — Redesign Add Component Flow

**Files:** `src/components/editor/section-list.tsx`, new `src/components/editor/add-section-modal.tsx`  
**Points:** 5  
**Description:** Replace the inline "Add Component" panel (inside the sidebar) with a modal dialog. The modal has a left category list and a right template grid.

**Acceptance Criteria:**
- Clicking "+ Add" opens a modal (not an inline panel)
- Modal has left-column category nav and right-column template grid
- Template cards show a color swatch and name (Phase 1 thumbnails)
- Clicking a template card and clicking "Add" (or double-clicking) adds the section
- Modal closes with the new section highlighted/selected in the section list
- Keyboard accessible (Escape to close, arrow keys to navigate templates)
- RTL-compatible layout (left/right columns swap in RTL)

---

### Task 3.4 — Add Undo/Redo Foundation

**Files:** `src/lib/editor-store.ts`  
**Points:** 3  
**Description:** Add undo/redo state to the Zustand store using a snapshot-based history stack. Limit to 20 history entries.

**Acceptance Criteria:**
- Ctrl+Z / Cmd+Z undoes the last content change (section add, delete, config update, template change)
- Ctrl+Shift+Z / Cmd+Shift+Z redoes the last undone action
- History stack is capped at 20 entries (oldest entries are evicted)
- Undo/redo buttons appear in the top bar (disabled when no history is available)
- Theme changes are included in the history (not just content changes)

**Implementation approach:**
```ts
// Add to EditorState
history: Array<{ sections: SectionData[]; theme: SiteTheme }>;
historyIndex: number;
undo: () => void;
redo: () => void;
```

Each mutating action (addSection, removeSection, updateSectionConfig, changeTemplate, updateThemeColor, etc.) pushes a snapshot of the current `{ sections, theme }` state onto the history array BEFORE the mutation.

---

### Sprint 3 Total: 14 points (stretch sprint — may defer 3.4 to Sprint 4)

---

## Sprint 4: Bilingual Dashboard + Mobile (Weeks 7–8)

**Goal:** Arabic dashboard UI and basic mobile dashboard responsiveness.

---

### Task 4.1 — Add UI Language Preference to User Profile

**Files:** `src/lib/db/schema.ts`, `src/app/api/auth/register/route.ts`, `src/auth.ts`, `src/types/index.ts`  
**Points:** 2  
**Description:** Add `uiLanguage` field to the `users` table. Include it in the session JWT. Default to "en".

**Acceptance Criteria:**
- `users` table has a `ui_language` TEXT column (default "en")
- Registration sets `ui_language` based on user's browser `Accept-Language` header (if Arabic, default to "ar")
- Session token includes `uiLanguage`
- No migration errors

---

### Task 4.2 — RTL Dashboard Shell

**Files:** `src/components/dashboard/dashboard-shell.tsx`, `src/app/(dashboard)/layout.tsx`  
**Points:** 4  
**Description:** Make the dashboard shell RTL-aware using logical CSS properties. Add a language toggle button in the header.

**Acceptance Criteria:**
- When `uiLanguage === 'ar'`, the dashboard HTML has `dir="rtl" lang="ar"`
- Header layout mirrors correctly (logo on right, actions on left in RTL)
- All padding/margin/text-align classes use logical properties (ps/pe, ms/me, text-start)
- Language toggle button in header allows switching between EN and AR
- Language preference is saved to the server (API call on toggle)
- Arabic text in the shell uses Cairo font
- Arabic label text: "لوحة التحكم", "موقع جديد", "تسجيل الخروج"

---

### Task 4.3 — Lazy-Load All Remaining Block Types

**Files:** All `src/components/blocks/*/index.ts`  
**Points:** 4  
**Description:** Roll out the `React.lazy` pattern from Sprint 2 Task 2.5 to all remaining 13 block types.

**Acceptance Criteria:**
- All 14 block types use `React.lazy` for all their templates
- `BlockRenderer` handles all lazy-loaded templates with Suspense
- `npm run build` shows each template in its own chunk
- No regression in editor behavior

---

### Task 4.4 — Mobile Dashboard Responsiveness

**Files:** `src/app/(dashboard)/dashboard/page.tsx`, `src/components/dashboard/dashboard-shell.tsx`  
**Points:** 3  
**Description:** Improve dashboard experience on mobile (375–768px).

**Acceptance Criteria:**
- Site cards stack in a single column on mobile (grid-cols-1) — already done
- Card action buttons: Edit button is full-width on mobile; View and Delete are in a row below
- Header on mobile: show only logo and avatar (hide "New Site" text, show + icon only)
- Bottom safe area padding applied for iPhone notch/home bar
- No horizontal scroll on any screen < 375px wide
- "New Site" button visible (icon only on mobile, text on desktop)

---

### Sprint 4 Total: 13 points

---

## Sprint 5: Onboarding, Analytics Stubs, and Performance (Weeks 9–10)

**Goal:** Complete the onboarding flow and add performance monitoring.

---

### Task 5.1 — Post-Registration Onboarding Welcome State

**Files:** `src/app/(dashboard)/dashboard/page.tsx`  
**Points:** 3  
**Description:** Show a welcome banner with onboarding prompts for users who have zero sites and registered within the last 24 hours.

**Acceptance Criteria:**
- Banner shows: greeting, 3-step "how it works" illustration, primary CTA
- Banner only shows when `sites.length === 0` AND account age < 24 hours
- Banner is dismissible (user can X it away and it won't reappear in localStorage)
- Banner is bilingual (EN/AR based on user's `uiLanguage`)

---

### Task 5.2 — Editor First-Launch Tour

**Files:** `src/components/editor/editor-client.tsx`, new `src/components/editor/editor-tour.tsx`  
**Points:** 3  
**Description:** Add a 3-step onboarding overlay to the editor on first launch.

**Acceptance Criteria:**
- Tour shows on first editor open for a given user (stored in localStorage)
- 3 steps: sidebar, preview canvas, top bar (save/publish)
- "Skip Tour" and "Next →" buttons
- Overlay dims everything except the highlighted area
- Tour is accessible (keyboard navigable, focus trapped)

---

### Task 5.3 — Bundle Size Monitoring

**Files:** `package.json`, `next.config.ts`  
**Points:** 1  
**Description:** Add `@next/bundle-analyzer` and configure it. Create a script for running bundle analysis. Document the current bundle sizes as a baseline.

**Acceptance Criteria:**
- `npm run analyze` runs the build with bundle analyzer
- Bundle stats for key routes are documented in `docs/bundle-stats.md`
- A size budget is defined: editor route < 300KB gzipped JS

---

### Task 5.4 — Analytics Visit Count Stubs in Dashboard

**Files:** `src/app/(dashboard)/dashboard/page.tsx`, `src/app/api/sites/route.ts`  
**Points:** 2  
**Description:** Add stub visit counts to site cards. Initially return 0 from the API. The data model and API shape should be designed to support real analytics data later.

**Acceptance Criteria:**
- Published site cards show "0 visitors this week" with a chart icon
- API returns a `visitCount` field per site (default 0)
- Draft sites show "—" instead of a count
- The UI component is designed to handle real numbers (e.g., "1,247")

---

### Sprint 5 Total: 9 points

---

## Sprint 6: Advanced Editor Features (Weeks 11–12)

**Goal:** Drag-and-drop section reordering and template screenshot thumbnails.

---

### Task 6.1 — Drag-and-Drop Section Reordering

**Files:** `src/components/editor/section-list.tsx`, `src/lib/editor-store.ts`  
**Points:** 5  
**Description:** Implement drag-and-drop for section reordering using `@dnd-kit/core` and `@dnd-kit/sortable`.

**Acceptance Criteria:**
- Dragging a section item in the list reorders it
- The GripVertical icon is re-added and is now a drag handle
- Visual feedback during drag: dragged item has opacity 0.5, drop zone shows a blue line
- Reorder action is undoable (integrates with undo/redo from Sprint 3)
- Section order persists correctly on save
- Keyboard accessible: up/down arrow keys when drag handle is focused

**Steps:**
1. `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
2. Wrap section list in `<DndContext>` and `<SortableContext>`
3. Make each section item a `useSortable` item
4. Update the Zustand store's `moveSection` to handle drag-drop order

---

### Task 6.2 — Template Screenshot Thumbnails

**Files:** New `scripts/generate-thumbnails.ts`, `src/components/editor/template-picker.tsx`  
**Points:** 4  
**Description:** Generate static PNG thumbnails for each template using Playwright headless browser. Store thumbnails as static assets.

**Acceptance Criteria:**
- Each template has a 400×300px PNG thumbnail at `public/thumbnails/[blockType]/[templateId].png`
- The template picker uses `<img>` (or `next/image`) to show the thumbnail
- Thumbnails are generated by a script (`npm run generate-thumbnails`) that opens each template in a headless browser and screenshots it
- Templates that don't have a thumbnail fall back to the color swatch

---

### Sprint 6 Total: 9 points

---

## Summary Roadmap

| Sprint | Weeks | Focus | Key Deliverables |
|---|---|---|---|
| 1 | 1–2 | Critical Fixes | TS errors fixed, confirm dialogs, wizard improvements |
| 2 | 3–4 | Performance + Stability | Toast notifications, error boundaries, lazy loading pilot |
| 3 | 5–6 | Editor UX | Template picker, transitions, add component modal, undo/redo |
| 4 | 7–8 | Bilingual + Mobile | Arabic dashboard, RTL shell, mobile responsiveness |
| 5 | 9–10 | Onboarding + Analytics | Welcome flow, editor tour, bundle analysis |
| 6 | 11–12 | Advanced Editor | Drag-and-drop, template thumbnails |

**Total estimated effort:** ~65 story points across 12 weeks (1 engineer).

**Dependencies:**
- Sprint 3 (undo/redo) must complete before Sprint 6 (drag-and-drop integrates with undo)
- Sprint 4 (RTL foundation) should inform Sprint 5 (bilingual onboarding)
- Sprint 2 (lazy loading pilot) must be validated before Sprint 4 rolls out to all block types
