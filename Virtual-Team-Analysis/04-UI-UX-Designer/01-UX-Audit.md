# UX Audit — Safahati Dashboard, New Site Flow, and Editor

**Audit Date:** April 2026  
**Auditor Role:** UI/UX Designer  
**Method:** Code review of all dashboard, auth, and editor components; comparison against SaaS UX benchmarks

Rating scale: 1 (critical issues) → 5 (excellent)

---

## Section 1: Authentication Flow

### Files Reviewed
- `src/app/(auth)/layout.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`

### Rating: 3 / 5

### What Works
The auth layout is clean: centered card on a gradient background, Safahati brand name, a single-sentence value proposition ("Build your website in minutes"). The form structure is standard and correct — labels, inputs, submit button, error state, and a cross-link between login and register.

### Pain Points

**P1 — No Arabic UI option in auth pages.**
The language toggle (EN/AR) appears in the new-site step 1 and in the editor, but authentication pages are English-only. A user who prefers Arabic will encounter the product in English before they ever set their language preference. This is a significant MENA market issue.

**P2 — Registration success goes directly to dashboard with no onboarding signal.**
After `signIn()` succeeds, the user is pushed to `/dashboard`. There is no welcome message, no "you're all set" screen, no contextual prompt to create their first site. The empty state on the dashboard handles this with a CTA, but the transition is jarring — the user goes from a form to an empty list.

**P3 — No forgot password flow.**
The login page has no "Forgot password?" link. This is a standard omission in early-stage products but must be planned for before user growth, or support costs spike.

**P4 — Password strength indicator absent.**
The register form enforces a minimum length of 6 characters but provides no strength indicator. For a product targeting non-technical users, feedback during password entry reduces form abandonment.

**P5 — Error messages are generic.**
"Invalid email or password" is intentionally vague (security best practice), but the register form's `data.error || "Registration failed"` can surface raw API error strings to users.

### Quick Wins
- Add an Arabic language toggle to the auth layout (simple, high impact for MENA users)
- Add "Forgot password?" link (can be a placeholder route for now)
- Add a post-registration redirect to `/dashboard/new` instead of `/dashboard` to skip the empty state

---

## Section 2: Dashboard — Site List

### Files Reviewed
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/components/dashboard/dashboard-shell.tsx`

### Rating: 3.5 / 5

### What Works
The dashboard page is well-structured. The header has the brand, a "New Site" action, and the user avatar with signout. Site cards show name, slug, industry badge, language badge, status badge, last-updated date, and three actions (Edit, Preview/View, Delete). The empty state includes an icon, heading, description, and a CTA button. The 3-column responsive grid is correct.

### Pain Points

**P1 — No site thumbnail / visual preview in cards.**
Every card looks identical. With 5+ sites, users must read card titles to find the one they want. A thumbnail — even a low-fidelity color block showing the primary color and industry icon — would dramatically improve scanability.

**P2 — Delete is one click away with a browser `confirm()` dialog.**
`window.confirm("Are you sure?")` is a poor UX pattern: it cannot be styled, it blocks the browser thread, and it is visually out of place. A proper confirmation dialog (shadcn/ui `<Dialog>`) with the site name in the message would be safer and more polished.

**P3 — No sort or filter on the site list.**
As users accumulate sites, there is no way to sort by status, by date, or to search by name. The grid always renders all sites in creation order.

**P4 — "Updated [date]" is the only temporal information.**
There is no indication of when the site was created, or how long since it was last published. The `createdAt` field is available in the schema but unused in the UI.

**P5 — Status badge coloring is inconsistent with semantic meaning.**
`variant="default"` for "published" renders a dark badge; `variant="secondary"` for "draft" renders a gray badge. This is visually inverted — published (active, positive) should be green, draft should be yellow/amber. The current shadcn default variants carry no semantic color meaning.

**P6 — Dashboard shell has no secondary navigation.**
As the product grows (billing, account settings, team members, analytics), the single-bar header with no sidebar will become inadequate. The current shell has no affordance for additional navigation items.

**P7 — No analytics or insight on the dashboard.**
Published sites have no visitor count, no page views, nothing. Even stub numbers ("0 visitors this week") would signal that analytics is coming and set expectations.

### Quick Wins
- Change Delete to use a shadcn Dialog instead of `window.confirm()`
- Change published badge to `bg-green-100 text-green-700` and draft to `bg-amber-100 text-amber-700`
- Add creation date to card metadata

### Major Improvements
- Add site thumbnail generation (screenshot or template color preview)
- Add sort/filter controls above the grid
- Plan sidebar navigation for dashboard shell

---

## Section 3: New Site Creation Flow

### Files Reviewed
- `src/app/(dashboard)/dashboard/new/page.tsx`

### Rating: 4 / 5

### What Works
The 2-step wizard is conceptually sound: step 1 collects minimal required data (name + language), step 2 presents the industry picker. The industry cards show the template icon in the brand color, name in both EN and AR, a short description, and a section count badge. The hover state (shadow + blue border) gives clear affordance. The full-screen loading overlay ("Creating your site...") prevents double-submission.

### Pain Points

**P1 — No step indicator.**
The wizard has steps 1 and 2, but there is no visual progress indicator. Users do not know how many steps there are before they begin. A simple "1 of 2" or a two-dot progress bar would reduce uncertainty.

**P2 — Back navigation on step 2 is absent.**
From the industry picker (step 2), there is no "Back" button to return to step 1. The only option is clicking the breadcrumb link at the top which goes all the way back to the main dashboard. If a user wants to change the site name or language, they must start over.

**P3 — Industry descriptions are English-only.**
`template.description` is rendered, but `template.descriptionAr` is not used — even when the user selected Arabic in step 1. This is a bug in the bilingual experience.

**P4 — No template preview.**
Clicking an industry card immediately creates the site and redirects. There is no opportunity to see what sections will be included or what the site will look like. A hover preview or an expandable detail panel would improve confidence before committing.

**P5 — Section count badge adds noise, not signal.**
"7 sections" as a selection criterion is not meaningful to an SME user. It could be replaced with a feature list: "Includes: Hero, Services, Testimonials, Contact."

**P6 — Industry picker grid has no search or category filter.**
With 13 industry templates, discovery is manageable. At 20+, a search input or category tabs (Business / Creative / Health / Retail) would be needed.

### Quick Wins
- Add a "Back" button on step 2 that sets `setStep(1)`
- Render `template.descriptionAr` when `language === 'ar'`
- Replace the "N sections" badge with a features list

### Major Improvements
- Add a step indicator (progress bar or step dots)
- Add a template preview mechanism before creation

---

## Section 4: Editor

### Files Reviewed
- `src/app/(dashboard)/dashboard/[siteId]/editor/page.tsx`
- `src/components/editor/editor-client.tsx`
- `src/components/editor/section-list.tsx`
- `src/components/editor/content-editor-panel.tsx`
- `src/components/editor/theme-editor-panel.tsx`

### Rating: 3.5 / 5

### What Works
The editor has a well-structured three-zone layout: top bar (device toggles, save, publish, language, preview/editor mode), sidebar (section list + content editor + theme editor), and preview canvas. Device mode simulation (desktop/tablet/mobile widths) is implemented. The preview canvas applies `dir="rtl"` and CSS custom properties for the theme correctly. The language toggle switches the preview in real-time. The save button correctly shows unsaved state (blue) vs. saved state (gray). The publish flow auto-saves before publishing.

### Pain Points

**P1 — Editor is not usable on mobile at all.**
The sidebar is `w-80 shrink-0` — a fixed 320px column. On a 375px mobile screen, there is no room for the preview canvas. The editor is effectively desktop-only, which is a significant constraint for the target market.

**P2 — No drag-and-drop section reordering.**
Section reordering uses up/down arrow buttons. This is functional but slow. The `GripVertical` icon is displayed in the section list but does nothing — it is a visual affordance with no corresponding behavior. This creates a false expectation.

**P3 — Template picker is a text button grid with no visual preview.**
In `content-editor-panel.tsx`, the template picker is a 2-column grid of text labels like "Template 01", "Template 02". There is no thumbnail, no preview, and the template names are generic. A user cannot tell what "Hero Template 03" looks like without selecting it and watching the preview canvas update.

**P4 — Add component UX is poor.**
The "Add" button opens a collapsible panel within the sidebar. This panel lists all block types with sub-lists of their templates. With 14 block types and many templates each, this panel becomes a very long scrollable list inside an already narrow sidebar. A modal or a right-panel approach would be significantly better.

**P5 — No undo/redo.**
The Zustand store has no history stack. Any accidental deletion, config change, or template switch cannot be reverted without manually re-entering data. This is the single most-requested feature in any content editor.

**P6 — Sidebar content/theme tab transition is abrupt.**
Switching between Content and Theme tabs causes an immediate content swap with no transition. Combined with the significant visual difference between the two panels, this creates a disorienting snap.

**P7 — Language toggle in the top bar is ambiguous.**
The button shows "EN" or "AR" in a small rounded rectangle. It is not clear that clicking it toggles the preview language vs. the editor interface language vs. the actual site language setting. The three concepts overlap confusingly.

**P8 — Publish/Unpublish flow uses `window.confirm()` for unpublish.**
Same issue as the Delete on the dashboard — a browser confirm dialog for a destructive action.

**P9 — The preview canvas has no frame or visual container on desktop.**
On desktop mode, the preview canvas is a flush white area that takes up the full remaining width. The transition to tablet mode (which shows a 768px framed device with shadow and rounded corners) is jarring because desktop mode has no equivalent affordance. Desktop mode should also show some kind of frame/background to give context.

**P10 — No visual indication that GripVertical is not interactive.**
The grip icon (`GripVertical` in section cards) implies draggability. Since drag-and-drop is not implemented, it should be removed or replaced with a non-interactive indicator.

### Quick Wins
- Remove or disable the `GripVertical` icon until drag-and-drop is implemented
- Replace `window.confirm()` for unpublish with a shadcn Dialog
- Add transitions to sidebar tab switching (CSS transition on opacity/transform)
- Rename template picker buttons from "Template 01" to the actual template name/description

### Major Improvements
- Implement drag-and-drop reordering (using `@dnd-kit/core`)
- Add undo/redo (history stack in Zustand)
- Redesign the "Add Component" flow as a modal with visual template thumbnails
- Make the editor mobile-accessible (bottom sheet sidebar pattern)

---

## Section 5: RTL/Bilingual Audit

### Dashboard Shell
- The dashboard shell (`dashboard-shell.tsx`) has no `dir` attribute on its wrapper. The shell is English-only. No RTL consideration.
- Navigation items, button labels, and section titles ("My Sites", "Create New Site", "Manage and edit your websites") are hardcoded English strings with no translation.

**Issue:** The dashboard UI language is fixed to English regardless of the user's preferred language. For a product targeting Arabic-speaking users, the admin interface itself must be bilingual.

### Editor
- The preview canvas correctly applies `dir={language === "ar" ? "rtl" : "ltr"}` to the rendered site.
- The editor sidebar (section list, content panel, theme panel) is entirely English with no RTL adaptation.
- The language toggle button correctly reflects the current language state.
- The theme panel shows font names in Arabic (`{font.labelAr}`) with `dir="rtl"` — this is correct.

**Issue:** The editor sidebar is an English UI even when the user is working on an Arabic site. Bilingual field labels in the form are English-only.

### Content Fields
- `schema-introspect.ts` auto-generates labels via `humanize()` which capitalizes and splits camelCase. This produces labels like "Heading Ar", "Subheading Ar" — these are implementation artifacts, not user-facing labels.
- Bilingual field wrapper in `bilingual-field-wrapper.tsx` shows EN/AR tabs — this is good.

**Issue:** Field labels like "Heading Ar" are not acceptable in the final product. Labels should read "Heading (Arabic)" or simply display in context.

### Site Creation
- Step 1: Language toggle buttons are "English" and "العربية" — correct bilingual pattern.
- Step 2: Industry template descriptions are English-only despite having `descriptionAr` defined in the config.

### Overall RTL Audit Rating: 2 / 5
The published site correctly handles RTL. The dashboard/editor admin interface has minimal RTL support and is English-only throughout.

---

## Audit Summary Table

| Area | Rating | Top Issues |
|---|---|---|
| Authentication flow | 3/5 | No Arabic UI, no onboarding redirect, no forgot password |
| Dashboard site list | 3.5/5 | No thumbnails, `window.confirm()` delete, no analytics |
| New site creation | 4/5 | No back button on step 2, English-only descriptions |
| Editor UX | 3.5/5 | No drag-drop, no undo, text-only template picker |
| RTL/Bilingual coverage | 2/5 | Admin UI is English-only, field labels are technical |

---

## Priority Action List

### Immediate (no design required — fix in code)
1. Fix industry descriptions to use `descriptionAr` when language is AR
2. Remove non-functional `GripVertical` icon
3. Replace all `window.confirm()` dialogs with shadcn `<Dialog>`
4. Add back button on step 2 of new site flow
5. Fix status badge colors (green for published, amber for draft)

### Short-Term (requires design)
6. Redesign empty state with illustrated onboarding prompt
7. Add step indicator to site creation wizard
8. Redesign template picker with visual thumbnails
9. Add post-registration onboarding redirect flow
10. Add Arabic language toggle to auth pages

### Medium-Term (significant design + engineering)
11. Undo/redo system in editor
12. Drag-and-drop section reordering
13. Site card thumbnail generation
14. Mobile editor (bottom sheet sidebar)
15. Dashboard navigation shell with sidebar
