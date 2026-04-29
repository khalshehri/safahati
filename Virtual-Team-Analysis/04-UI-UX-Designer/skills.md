# UI/UX Designer — Skills Profile for Safahati

This document defines the specific UX and design skills required to contribute effectively to Safahati. It is not a generic job description — every skill listed here maps to a real design challenge present in this codebase today.

---

## 1. Bilingual and RTL Design Expertise

Safahati serves the MENA/Saudi market with equal weight on Arabic RTL and English LTR. This is not cosmetic localization — the entire rendering pipeline must handle both directions.

**Required competencies:**

- **Mirror-aware layout design.** In RTL, icon positions, reading order, button placement, padding direction, and chevron directions all flip. A designer must produce layouts that are correct in both directions, not just LTR with a `dir="rtl"` attribute thrown on.
- **Arabic typography principles.** Arabic is a connected script with ligatures, contextual letter forms, and variable stroke weight. Line heights, letter spacing, and font pairing rules differ fundamentally from Latin typography. `letter-spacing` must never be applied to Arabic text. Minimum font size for Arabic body text is 15–16px (higher than Latin equivalents) to maintain readability.
- **Font pairing across scripts.** The project uses 11 fonts including Cairo, Tajawal, Almarai, Rubik, Readex Pro, Noto Sans Arabic, IBM Plex Arabic, El Messiri, Amiri, and Changa. A designer must know which pairs work well together (e.g., a strong Arabic heading font with a neutral Latin body), when to use the same font for both scripts (Rubik, Readex Pro, Cairo all include both Latin and Arabic glyphs), and which fonts are Arabic-only (Almarai).
- **Contextual number handling.** Arabic UI often mixes Eastern Arabic numerals (٠١٢٣٤٥٦٧٨٩) and Western Arabic numerals. A UX decision must be made for dashboard analytics vs. website-facing content.
- **Bidi text edge cases.** Mixed direction strings (e.g., Arabic sentence containing an English URL or brand name) require correct Unicode directional marks. UI text fields must handle this.

---

## 2. SaaS Dashboard UX Patterns

The admin dashboard at `app.safahati.com` is a SaaS product used by small business owners and freelancers in Saudi Arabia, many of whom are not technical.

**Required competencies:**

- **Progressive disclosure.** Reveal complexity only when needed. The current 2-step site creation wizard (name/language → industry picker) follows this well, but the editor sidebar collapses too much information behind undiscoverable interactions.
- **Empty state design.** The dashboard currently shows a minimal empty state with one CTA button. Effective SaaS empty states communicate value, guide action, and set expectations for what the user will achieve.
- **Onboarding flow design.** First-time users arriving after registration have no guided path. Onboarding UX requires mapping the FTUE (First Time User Experience) — typically: register → create first site → editor tour → publish.
- **Card-based dashboard design.** Site cards must communicate status, recency, and available actions without overwhelming the grid. Thumbnail previews, status badges, and quick-action menus are standard patterns.
- **Sidebar editor UX.** The editor sidebar pattern (used by Webflow, Framer, Squarespace) has well-established conventions: section list + property panel + tab switching. The current implementation lacks visual hierarchy between these zones.
- **Status feedback patterns.** Save states, publish states, and loading states need consistent visual language. Currently the save button cycles through "Save" / "Saving..." / "Saved" — this works but lacks a persistent unsaved changes indicator (e.g., a dot in the tab title or a top banner).

---

## 3. Config-Driven Product Design

Safahati is not a drag-and-drop builder — it is a form-based, config-driven system. This distinction changes UX design entirely.

**Required competencies:**

- **Form-based content editing UX.** The schema-driven form in `content-editor-panel.tsx` auto-generates fields from Zod schemas. The UX challenge is making auto-generated forms feel intentional and guided, not like raw JSON editors.
- **Template picker design.** Users select from multiple visual templates per block type. This requires thumbnail or live preview mechanisms — currently the template picker is text-only buttons in a 2-column grid.
- **Bilingual content field UX.** Each text field has an EN/AR pair. The bilingual field wrapper uses a tab pattern. The designer must consider whether inline side-by-side (for wide panels) or tab-based (for narrow panels) is better in each context.

---

## 4. Mobile-Responsive Dashboard Design

The current dashboard shell uses `hidden sm:inline` to hide elements on mobile, but the core grid and editor experience is desktop-first. A significant portion of Saudi business owners will access the dashboard on mobile.

**Required competencies:**

- **Mobile-first grid layouts.** Site cards already use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` — this is correct. But the editor is entirely desktop-only (a 320px sidebar + preview canvas cannot function on a 375px screen).
- **Bottom sheet and drawer patterns.** On mobile, editor panels should appear as bottom sheets (slide up from bottom). This is a common React Native / mobile web pattern.
- **Touch target sizing.** The editor's icon buttons (p-1.5, 14px icons) are too small for touch. Minimum 44×44px touch targets are required by iOS HIG and WCAG 2.5.5.
- **Responsive navigation.** The dashboard header collapses the user name but keeps the logo and action buttons. A hamburger/drawer menu may be needed for additional nav items as the product grows.

---

## 5. Interaction Design and Animation

The project uses Framer Motion for animations and the hero templates use GSAP + tsParticles.

**Required competencies:**

- **Purposeful animation.** Animations must serve a function: confirm state changes, guide attention, provide spatial orientation. Gratuitous animation hurts performance and accessibility.
- **Reduced motion support.** All animations must respect `prefers-reduced-motion`. This is an accessibility requirement, not a preference. Framer Motion has built-in `useReducedMotion()` support.
- **Transition choreography.** The editor's mode switching (preview ↔ editor) and sidebar panel transitions should feel smooth. Currently there is no transition between the sidebar tabs — panel content swaps abruptly.
- **Skeleton loading states.** The dashboard shows a centered spinner during site list fetch. Skeleton screens are significantly better UX for content-heavy lists.

---

## 6. Accessibility (WCAG 2.1 AA)

Building for the Saudi market does not reduce accessibility obligations — it expands them, because Arabic screen reader users exist and the product must serve them.

**Required competencies:**

- **Color contrast.** The current blue-on-white primary color (#2563EB on white) passes WCAG AA for normal text. All color combinations must be verified, especially muted text (gray-400 text on white backgrounds is often failing).
- **Keyboard navigation.** The editor sidebar, template picker, and language toggle must all be fully operable by keyboard.
- **Focus ring visibility.** The globals.css sets `outline-ring/50` — this may produce insufficient contrast for focus rings on certain backgrounds.
- **Semantic HTML.** Form fields must have `<label>` associations. The inline color picker in `theme-editor-panel.tsx` uses a `<label>` wrapping pattern that is correct.
- **ARIA labels for icon-only buttons.** The section list uses icon-only buttons (ArrowUp, ArrowDown, Eye, Trash2) without visible text or aria-label attributes — this is a current accessibility failure.

---

## 7. Design Tooling Relevant to This Stack

- **Figma** — component library, auto-layout, variants, prototype flows
- **Figma Variables** — manage the design token system that maps to the CSS custom properties in `globals.css` and `themeToCSS()`
- **Figma RTL plugins** — Figma does not natively mirror RTL layouts; plugins or manual mirroring workflows are needed
- **Storybook awareness** — understanding how design tokens flow into shadcn/ui components helps avoid spec-to-code drift
- **Tailwind CSS 4 awareness** — understanding the token system (`--color-primary`, `--radius-md`, etc.) is necessary to spec designs that are actually implementable

---

## Summary Skills Matrix

| Skill | Relevance to Safahati | Priority |
|---|---|---|
| Arabic RTL layout design | Editor, dashboard, all published sites | Critical |
| Arabic typography | Font pairing, size, spacing, readability | Critical |
| SaaS dashboard UX patterns | Dashboard, editor sidebar | High |
| Onboarding flow design | First-time user experience | High |
| Form-based editor UX | Schema-driven content panel | High |
| Mobile responsive design | Dashboard on phones | High |
| Accessibility (WCAG 2.1 AA) | Platform-wide | High |
| Animation / interaction design | Editor transitions, loading states | Medium |
| Design token systems | Figma ↔ Tailwind CSS 4 bridge | Medium |
| Template picker visual design | Block template selection UX | Medium |
