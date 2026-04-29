# Design System — Safahati

This document defines the design system for the Safahati platform. It covers two distinct surfaces: (1) the **admin dashboard/editor** UI (built with Tailwind CSS 4 + shadcn/ui), and (2) the **published client sites** (which use a separate CSS custom property theming system via `themeToCSS()`). These two surfaces share fonts but use different token structures.

---

## 1. Design System Architecture

### Two Parallel Token Systems

```
ADMIN UI (dashboard, editor)          CLIENT SITES (published)
─────────────────────────────         ──────────────────────────────
globals.css :root variables           themeToCSS() → CSS custom props
Tailwind CSS 4 theme tokens           --theme-primary, --theme-bg, etc.
shadcn/ui components                  Block template components
```

The admin UI uses Tailwind's design tokens (`bg-blue-600`, `text-gray-900`, etc.) and shadcn/ui's component system. Published client sites use a dynamic theming system where CSS custom properties are injected from the site's database-stored `SiteTheme` object.

This document covers the admin UI design system primarily, with a section on the client-site theming variables.

---

## 2. Color Palette — Admin UI

### Primary Palette

Used for actions, links, selected states, and brand elements in the dashboard and editor.

| Token | Value | Hex | Usage |
|---|---|---|---|
| `blue-600` | Primary action | `#2563EB` | Buttons, active tabs, save state, links |
| `blue-700` | Primary hover | `#1D4ED8` | Button hover |
| `blue-50` | Primary light | `#EFF6FF` | Selected card bg, active tab bg |
| `blue-100` | Primary subtle | `#DBEAFE` | Avatar bg, badge bg |
| `violet-600` | Brand gradient end | `#7C3AED` | Logo gradient (`from-blue-600 to-violet-600`) |

### Neutral Palette

The admin dashboard is built almost entirely on these neutrals.

| Token | Hex | Usage |
|---|---|---|
| `gray-900` | `#111827` | Page titles, primary text, headings |
| `gray-700` | `#374151` | Body text, labels |
| `gray-500` | `#6B7280` | Secondary text, descriptions |
| `gray-400` | `#9CA3AF` | Timestamps, placeholder hints, muted icons |
| `gray-300` | `#D1D5DB` | Disabled text, grip icons |
| `gray-200` | `#E5E7EB` | Input borders, dividers |
| `gray-100` | `#F3F4F6` | Card borders, inactive badges |
| `gray-50` | `#F9FAFB` | Page background, section backgrounds |
| `white` | `#FFFFFF` | Card surfaces, panel backgrounds, inputs |

### Semantic Colors

| Meaning | Token | Hex | Usage |
|---|---|---|---|
| Success / Published | `green-600` | `#16A34A` | Published status dot |
| Success light | `green-100` | `#DCFCE7` | Published badge bg |
| Success text | `green-700` | `#15803D` | Published badge text |
| Warning / Draft | `amber-600` | `#D97706` | Draft status dot |
| Warning light | `amber-100` | `#FEF3C7` | Draft badge bg |
| Warning text | `amber-700` | `#B45309` | Draft badge text |
| Destructive | `red-600` | `#DC2626` | Delete button hover, error text |
| Destructive light | `red-50` | `#FEF2F2` | Delete button hover bg |

### WCAG Contrast Check

Key color combinations that must pass WCAG AA (4.5:1 for normal text, 3:1 for large text):

| Text | Background | Ratio | Pass? |
|---|---|---|---|
| `gray-900` on `white` | 16.8:1 | AA + AAA |
| `gray-700` on `white` | 9.5:1 | AA + AAA |
| `gray-500` on `white` | 4.6:1 | AA |
| `gray-400` on `white` | 2.8:1 | **FAIL** — do not use for body text |
| `blue-600` on `white` | 4.5:1 | AA (borderline) |
| `blue-600` on `blue-50` | 3.0:1 | **Fails AA for normal text** — use for icons only |
| `green-700` on `green-100` | 6.1:1 | AA |
| `amber-700` on `amber-100` | 5.2:1 | AA |

**Implication:** `text-gray-400` used for timestamps and meta text fails WCAG AA for normal-size text. This should be `text-gray-500` minimum for any content that conveys information.

---

## 3. Typography — Admin UI

### Font Stack

The admin dashboard uses **Geist Sans** (loaded via `next/font`) as the primary typeface. Geist is designed by Vercel for UI clarity, with excellent legibility at small sizes.

```css
--font-sans: var(--font-geist-sans);
--font-mono: var(--font-geist-mono);
```

Geist does not include Arabic glyphs. For dashboard UI elements that need to display Arabic text (template names, bilingual field labels), the system falls back to the OS Arabic font stack or any Arabic font variables that are loaded on the page.

**Recommendation:** Use Cairo or Readex Pro for any Arabic UI text in the dashboard. Both have high-quality Arabic glyphs that harmonize with modern Latin sans-serifs, and both are already loaded in `layout.tsx`.

### Type Scale

| Role | Size | Weight | Line Height | Token |
|---|---|---|---|---|
| Page title | 24px | 700 | 1.2 | `text-2xl font-bold` |
| Section heading | 18px | 600 | 1.3 | `text-lg font-semibold` |
| Card title | 16px | 600 | 1.4 | `text-base font-semibold` |
| Body / label | 14px | 400–500 | 1.5 | `text-sm` |
| Small / meta | 12px | 400 | 1.4 | `text-xs` |
| Micro / badge | 10px | 500 | 1.2 | `text-[10px] font-medium` |

**Arabic type scale notes:**
- Add 1–2px to every size when displaying Arabic: Arabic glyphs are optically larger than Latin at the same point size. `text-sm` (14px) for Arabic reads as approximately 12px visually.
- Never use `tracking-tight` or any `letter-spacing` with Arabic text — it breaks connected letter forms.
- `leading-relaxed` (1.625) is often needed for Arabic body text vs. `leading-normal` for Latin.

---

## 4. Typography — Client Site Fonts

The 11 fonts loaded in `layout.tsx` serve published client sites. Below is the design system documentation for each.

### Latin-Optimized Fonts

| Font | Best For | Notes |
|---|---|---|
| **Inter** | Tech, SaaS, clean modern | Excellent for English content, neutral |
| **Rubik** | Friendly brands, retail | Has Arabic subset but Arabic quality is basic |

### Arabic + Latin Bilingual Fonts

These fonts have high-quality glyphs in both scripts and should be the default recommendation for bilingual (EN+AR) sites:

| Font | Character | Best For |
|---|---|---|
| **Cairo** | Geometric, clean | Business, professional services |
| **Tajawal** | Rounded, modern | SME, hospitality, retail |
| **Readex Pro** | Variable, contemporary | Tech, creative, multi-purpose |
| **Rubik** | Slightly rounded | Approachable brands, wellness |
| **Noto Sans Arabic** | Neutral, universal | Any industry, highly readable |
| **IBM Plex Arabic** | Geometric, technical | Tech, SaaS, startups |
| **Changa** | Bold, display | Events, entertainment, bold headers |

### Arabic-Specific Fonts

| Font | Character | Best For |
|---|---|---|
| **Almarai** | Clean, geometric | Retail, food/beverage, Gulf branding |
| **El Messiri** | Semi-display, modern | Culture, education, government |
| **Amiri** | Classical, literary | Law, education, traditional business |

### Font Pairing Recommendations by Industry

| Industry | Heading | Body |
|---|---|---|
| Company / Corporate | IBM Plex Arabic | Cairo |
| Agency / Creative | El Messiri | Readex Pro |
| Freelancer | Cairo | Readex Pro |
| Clinic / Healthcare | Noto Sans Arabic | Tajawal |
| Restaurant | Changa | Tajawal |
| Law Firm | Amiri | Cairo |
| SaaS / Tech | IBM Plex Arabic | Inter (EN) / Readex Pro (AR) |
| E-commerce | Almarai | Cairo |

---

## 5. Spacing Scale

The project uses Tailwind's default 4px base unit. Key spacing values used in the dashboard:

| Value | Pixels | Common Usage |
|---|---|---|
| `gap-1` | 4px | Icon spacing within button |
| `gap-1.5` | 6px | Button icon + label gap |
| `gap-2` | 8px | Badge spacing, form rows |
| `gap-3` | 12px | Card metadata rows |
| `gap-4` | 16px | Grid gap, section spacing |
| `gap-6` | 24px | Panel section spacing |
| `p-3` | 12px | Compact panel padding |
| `p-4` | 16px | Default panel padding |
| `p-5` | 20px | Card padding |
| `p-6` | 24px | Form container padding |
| `p-8` | 32px | Auth card, modal padding |
| `mb-4` | 16px | Section title → content gap |
| `mb-8` | 32px | Page section vertical rhythm |
| `py-8` | 32px vertical | Main content area |
| `py-20` | 80px vertical | Empty state centering |

---

## 6. Component Library Guidelines

### Button Variants

The project uses shadcn/ui `<Button>` with these variant conventions:

| Variant | Usage | Appearance |
|---|---|---|
| `default` | Primary action (Create, Save, Continue) | Blue bg, white text |
| `outline` | Secondary actions (Preview, View) | White bg, gray border |
| `ghost` | Tertiary, icon buttons | Transparent, hover gray |
| `destructive` | Not used directly — styled manually | Red on red-50 bg |

**Anti-patterns to avoid:**
- Do not use `variant="default"` for destructive actions — use red manual styles.
- Do not stack multiple `default` buttons in the same action group.

### Size Usage

| Size | px equivalent | Usage |
|---|---|---|
| `sm` | h-8 (32px) | Card action buttons, sidebar buttons |
| `md` (default) | h-9 (36px) | Form submits, wizard navigation |
| `lg` | h-10 (40px) | Primary page CTAs (onboarding) |

### Badge Variants

shadcn/ui `<Badge>` used for status and metadata labels:

| Intent | Implementation |
|---|---|
| Published | `className="bg-green-100 text-green-700"` (custom) |
| Draft | `className="bg-amber-100 text-amber-700"` (custom) |
| Industry | `variant="outline"` |
| Language | `variant="outline"` with globe icon |

### Input / Form Fields

- All inputs: `rounded-lg` border, `focus:ring-2 focus:ring-blue-500`.
- Error state: red border + red error text below the field.
- Labels: `text-sm font-medium text-gray-700` immediately above the input.
- Placeholder: descriptive example, not just the field name.

### Card Pattern

Standard card used across dashboard, wizard, editor panels:

```
bg-white rounded-xl border border-gray-100 p-5
hover:shadow-md transition-shadow
```

Selected/active card:
```
border-blue-200 bg-blue-50/50 shadow-sm
```

### Dialog (replacing window.confirm)

All destructive confirmation dialogs use shadcn/ui `<Dialog>`:
- Title: "Delete {siteName}?"
- Description: "This action cannot be undone. The site and all its sections will be permanently deleted."
- Actions: `[Cancel]` (outline) + `[Delete]` (destructive red)

---

## 7. Dark Mode Plan

Dark mode is not implemented in the dashboard currently. `globals.css` defines a complete `.dark` class with CSS custom properties. The implementation plan:

### Phase 1: CSS Variables Ready (done)
The dark mode CSS variables are already defined in `globals.css`. The color values are complete for shadcn/ui components.

### Phase 2: Preference Toggle
Add a system-preference toggle to the dashboard header:
- A sun/moon icon button that adds/removes the `.dark` class from `<html>`.
- Persist preference in localStorage.
- Default to `prefers-color-scheme` system setting.

### Phase 3: Manual Overrides for Custom Components
Several components use hardcoded Tailwind color classes that bypass the shadcn CSS variable system:
- `bg-gray-50` → should become `bg-muted` or `dark:bg-gray-900`
- `text-gray-900` → should become `text-foreground`
- `border-gray-100` → should become `border-border`

Until these are migrated, dark mode will have partial coverage. A dark mode audit and class replacement pass is needed.

### Phase 4: Client Site Dark Mode
The client-site theming system already has a "Midnight" and "Charcoal" theme preset with dark backgrounds — these are not OS dark mode but manual theme choices. OS-level dark mode for published sites is a separate future consideration.

---

## 8. RTL Design Guidelines for the Admin Dashboard

The dashboard currently does not implement RTL. This section defines what RTL support would look like.

### Layout Mirroring Rules

| Element | LTR | RTL |
|---|---|---|
| Sidebar | Left side | Right side |
| Chevrons | Point right | Point left |
| Back arrows | `←` | `→` |
| Progress indicator | Left → Right | Right → Left |
| Card action buttons | Left-aligned | Right-aligned |
| Input field icon | Left padding | Right padding |

### Implementation Approach

Rather than maintaining two separate layouts, use Tailwind CSS's logical properties:

```css
/* Instead of */
pl-4 pr-2 text-left

/* Use logical properties */
ps-4 pe-2 text-start
```

Tailwind 4 supports `ps` (padding-start), `pe` (padding-end), `ms` (margin-start), `me` (margin-end) which automatically flip in RTL context.

The `<html>` tag should be `lang="ar" dir="rtl"` when the user's interface language is Arabic.

### Bidirectional Text Handling

For mixed content (Arabic labels with English code examples, URLs, numbers):
- Wrap known LTR strings (URLs, slugs, code) in `<span dir="ltr">`.
- Use `unicode-bidi: embed` or `dir="auto"` for user-entered text fields.

### Arabic Number Display

The editor currently shows section counts, timestamps, and UI counters in Western Arabic numerals (0–9). This is acceptable in a bilingual UI. Do not switch to Eastern Arabic numerals (٠–٩) in the admin interface — it reduces scannability for users comfortable with both systems.

---

## 9. Icon System

The project uses **Lucide React** throughout. This is the correct choice — Lucide is the official icon set for shadcn/ui, has excellent coverage for UI icons, and is fully tree-shakeable.

### Consistency Rules
- Icon size `14` for inline body text, badge icons, small UI elements.
- Icon size `16` for buttons with text labels.
- Icon size `18` for standalone action icons (header actions).
- Icon size `20` for card icons (industry picker).
- Icon size `24` for empty state illustrations.

### RTL Icon Considerations
Some icons imply direction and must be mirrored in RTL:
- `ArrowRight` → use `ArrowLeft` when direction is RTL
- `ArrowLeft` (back navigation) → use `ArrowRight` in RTL
- `ChevronRight` → `ChevronLeft` in RTL
- Non-directional icons (Trash2, Eye, Globe, Palette, etc.) should NOT be mirrored.

### Missing Icon Mappings
The `iconMap` in `section-list.tsx` and `content-editor-panel.tsx` only maps a few icons (`menu`, `monitor`, `layout-grid`, `panel-bottom`). Most block types fall through to `LayoutGrid` as a default. Each block type should have a semantically appropriate icon:

| Block Type | Recommended Icon |
|---|---|
| navbar | `Menu` |
| hero | `Star` or `Layers` |
| about | `Info` |
| services | `Briefcase` |
| features | `Zap` |
| testimonials | `MessageSquare` |
| clients | `Users` |
| stats | `BarChart2` |
| team | `Users2` |
| pricing | `Tag` |
| cta | `Megaphone` |
| faq | `HelpCircle` |
| contact | `Mail` |
| footer | `PanelBottom` |

---

## 10. Animation Tokens

### Duration
| Name | Value | Usage |
|---|---|---|
| `instant` | 0ms | State changes that need no animation |
| `fast` | 150ms | Hover states, micro-interactions |
| `normal` | 250ms | Panel transitions, modal open |
| `slow` | 400ms | Page transitions, overlay appear |

### Easing
| Name | CSS | Usage |
|---|---|---|
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering the screen |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving the screen |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Position changes |

### Reduced Motion
All animations must check `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

In Framer Motion components:
```tsx
const prefersReducedMotion = useReducedMotion();
const variants = prefersReducedMotion ? {} : animationVariants;
```
