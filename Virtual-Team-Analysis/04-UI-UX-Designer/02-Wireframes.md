# Wireframe Descriptions — Safahati Key Flows

These are text-based wireframe descriptions specifying layout, component placement, content, interaction behavior, and responsive behavior for each screen. They serve as specifications for Figma designs and frontend implementation.

Notation: `[Element]` = interactive component, `{text}` = content placeholder, `//` = annotation.

---

## Wireframe 1: Improved Onboarding Flow

### Screen 1A: Post-Registration Welcome

**Route:** `/dashboard` (first visit, `sites.length === 0`)  
**Trigger:** User arrives after registering for the first time

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (h-14, white, border-b)                             │
│  [Logo: Safahati gradient]          [Avatar] [Sign out]     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  WELCOME BANNER (bg-gradient from blue-50 to violet-50,    │
│  rounded-2xl, border border-blue-100, p-8, mb-8)           │
│                                                             │
│  ✨  أهلاً بك في صفحاتي / Welcome to Safahati              │
│      {userName}                                             │
│                                                             │
│  "You're set up. Let's build your first website.           │
│   It takes about 2 minutes."                                │
│                                                             │
│  [→ Create My First Site]  (primary button, large)         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

  HOW IT WORKS  (3-column grid, mb-8)
  ┌──────────┐   ┌──────────┐   ┌──────────┐
  │  Step 1  │   │  Step 2  │   │  Step 3  │
  │  ①       │   │  ②       │   │  ③       │
  │ Name     │   │ Pick     │   │ Edit &   │
  │ your     │   │ industry │   │ Publish  │
  │ site     │   │ template │   │          │
  └──────────┘   └──────────┘   └──────────┘
  // Cards use gray-50 bg, rounded-xl, subtle border
  // Step numbers in blue circles
```

**Behavior:**
- The welcome banner only appears when `sites.length === 0` AND the user's account was created within the last 24 hours (use `createdAt` field).
- The "Create My First Site" button links to `/dashboard/new`.
- After the first site is created, the banner never appears again.

---

### Screen 1B: Site Creation Wizard — Step 1 with Progress Indicator

**Route:** `/dashboard/new`

```
┌─────────────────────────────────────────────────────────────┐
│  [← Back]  Create New Site                                  │
│                                                             │
│  ●────────○   // step indicator: step 1 of 2               │
│  STEP 1 OF 2: Site Details                                  │
│                                                             │
│  ┌────────────────────────────────────┐                     │
│  │  Site Name                         │                     │
│  │  [_______________________]         │                     │
│  │   e.g. "Al-Nour Clinic"            │                     │
│  │                                    │                     │
│  │  Site Language                     │                     │
│  │  [  English  ] [  العربية  ]       │                     │
│  │   // toggle buttons, blue active   │                     │
│  │                                    │                     │
│  │  [Continue →]  (full width)        │                     │
│  └────────────────────────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Press Enter in the name input advances to step 2.
- Language selection updates UI label direction immediately as a preview.
- "Continue" is disabled (grayed) until name is non-empty.

---

### Screen 1C: Site Creation Wizard — Step 2 with Back

**Route:** `/dashboard/new` (step 2)

```
┌─────────────────────────────────────────────────────────────┐
│  [← Back]  Create New Site                                  │
│                                                             │
│  ○────────●   // step 2 of 2 active                        │
│  STEP 2 OF 2: Choose Industry Template                      │
│  "{siteName}" · {language}                                  │
│  // shows what they entered in step 1                       │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │ 🏢       │ │ 🎨       │ │ 👤       │                    │
│  │ Company  │ │ Agency   │ │Freelancer│                    │
│  │ شركة    │ │ وكالة   │ │ مستقل   │                    │
│  │ {desc}   │ │ {desc}   │ │ {desc}   │                    │
│  │          │ │          │ │          │                    │
│  │ ◼ Hero   │ │ ◼ Hero   │ │ ◼ Hero   │                    │
│  │ ◼ About  │ │ ◼ Work   │ │ ◼ Skills │                    │
│  │ ◼ ...    │ │ ◼ ...    │ │ ◼ ...    │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
│  // 3-col grid, cards show section list instead of count   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Changes from current:**
- Back button sets `setStep(1)` — does NOT navigate away.
- Section list in cards (not just count).
- Description uses `descriptionAr` when language is Arabic.
- Cards have a hover preview area (small colored block with dominant template color).

---

### Screen 1D: Editor First-Launch Tour Overlay

**Route:** `/dashboard/[siteId]/editor` (first time opening editor)

```
// A semi-transparent overlay with highlighted regions and tooltip bubbles

┌─────────────────────────────────────────────────────────────┐
│ [TOP BAR — highlighted with blue ring]                      │
│  "Save and publish your site here →"                        │
│  [tooltip bubble, arrow pointing right]                     │
│                                                             │
├──────────────┬──────────────────────────────────────────────┤
│ [SIDEBAR     │                                              │
│  — highlight]│  [PREVIEW CANVAS]                           │
│  "Click any  │                                              │
│   section to │  [dimmed]                                    │
│   edit it →" │                                              │
│  [tooltip]   │                                              │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘

  [Skip Tour]  [Next →]
  // persistent bottom bar, not inside overlay
```

**Behavior:**
- 3-step tour: (1) Sidebar sections, (2) Preview click-to-select, (3) Top bar save/publish.
- Stored in localStorage: `safahati_editor_tour_completed = true`.
- "Skip Tour" immediately dismisses and marks as complete.

---

## Wireframe 2: Dashboard with Analytics Preview

**Route:** `/dashboard` (with sites)

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
│  [Safahati]  [New Site +]  [Avatar: K]  [Sign out]         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  My Sites (3)                      [+ Create New Site]      │
│                                    [Sort: Recent ▾]         │
└─────────────────────────────────────────────────────────────┘

SITE CARDS — 3-column grid on lg, 2-col on sm, 1-col on mobile

┌─────────────────────┐  ┌─────────────────────┐
│ THUMBNAIL AREA      │  │ THUMBNAIL AREA      │
│ [Color block with   │  │ [Template preview   │
│  industry icon]     │  │  image/screenshot]  │
│ h-32, rounded-t-xl  │  │                     │
├─────────────────────┤  ├─────────────────────┤
│ [● Published]       │  │ [○ Draft]           │
│ Al-Nour Clinic      │  │ My Portfolio        │
│ al-nour.safahati.com│  │ khalid.safahati.com │
│                     │  │                     │
│ Clinic  AR          │  │ Freelancer  EN      │
│                     │  │                     │
│ 142 visits this wk  │  │ — (not published)   │
│ Updated 2 days ago  │  │ Updated today       │
│                     │  │                     │
│ [Edit] [View ↗] [⋮] │  │ [Edit] [Preview] [⋮]│
│ // ⋮ = kebab menu   │  │ // kebab: Rename,   │
│    for more actions │  │    Duplicate, Delete│
└─────────────────────┘  └─────────────────────┘

// kebab menu items: Rename / Duplicate / Delete
// Delete opens confirmation Dialog (not window.confirm)
// Published badge: bg-green-100 text-green-700 dot
// Draft badge: bg-amber-100 text-amber-700 circle
```

**Analytics stub:**
- "142 visits this wk" — stub data initially, connects to analytics API later.
- Only shows for published sites.
- Clicking the visit number opens a future analytics page.

**Sort options:**
- Recent (updated at, default)
- Alphabetical
- Published first
- Draft first

---

## Wireframe 3: Editor with Live Preview Panel

**Route:** `/dashboard/[siteId]/editor`

### Desktop Layout (≥ 1024px)

```
┌──────────────────────────────────────────────────────────────┐
│  TOP BAR (h-14)                                              │
│  [← ] [Safahati] [clinic-site]  [□ ▭ ▱] [Save][Publish][EN]│
│  // device toggles: desktop/tablet/mobile                    │
│  // save button: blue when dirty, gray when clean           │
│  // language toggle: EN | AR                                 │
│  // view mode: [👁 Preview] [⚙ Editor]  // toggle group    │
└──────────────────────────────────────────────────────────────┘

┌──────────────┬───────────────────────────────────────────────┐
│  SIDEBAR     │  PREVIEW CANVAS                               │
│  w-80        │                                               │
│              │  ┌─────────────────────────────────────────┐ │
│  [Content]   │  │                                         │ │
│  [Theme  ]   │  │  RENDERED SITE                          │ │
│              │  │  (BlockRenderer, each section)          │ │
│  ─────────   │  │                                         │ │
│  SECTION     │  │  Hover → blue ring outline              │ │
│  LIST:       │  │  Selected → solid blue ring             │ │
│              │  │                                         │ │
│  ≡ Navbar    │  │  // On desktop: full-width white canvas  │ │
│  ≡ Hero  ●   │  │  // On tablet: 768px centered card      │ │
│  ≡ Services  │  │  // On mobile: 375px centered card      │ │
│  ≡ Contact   │  │                                         │ │
│              │  └─────────────────────────────────────────┘ │
│  [+ Add]     │                                               │
│              │                                               │
│  // ● = selected section (blue dot indicator)               │
└──────────────┴───────────────────────────────────────────────┘
```

### Content Editor Sub-Panel (when section selected)

```
┌──────────────────────────┐
│ [← Back to sections]     │
│ ≡ Hero                   │
│   Hero Template 01       │
│                          │
│ TEMPLATE                 │
│ [Template 01 ✓] [Tmpl02] │  // shows template thumbnail or name
│ [Template 03  ] [Tmpl04] │
│                          │
│ CONTENT                  │
│                          │
│ Heading / العنوان       │
│  EN: [_________________] │
│  AR: [_________________] │
│                          │
│ Subheading               │
│  EN: [textarea________] │
│  AR: [textarea________] │
│                          │
│ CTA Button               │
│ ▶ [expand]               │
│   Text: [_____________]  │
│   URL:  [_____________]  │
└──────────────────────────┘
```

### Preview Mode (full-screen, no sidebar)

```
┌──────────────────────────────────────────────────────────────┐
│  TOP BAR                                                     │
│  [←][Safahati][site]  [□ ▭ ▱]  [Save][Publish][EN][⚙ Edit] │
└──────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│         FULL-WIDTH RENDERED SITE (no sidebar overlay)       │
│         (sections not click-selectable in preview mode)     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Wireframe 4: Mobile Dashboard (375px viewport)

### Dashboard Home — Mobile

```
┌─────────────────────┐
│ HEADER (h-14)       │
│ [Safahati] [Avatar] │
│         [+ New]     │
└─────────────────────┘

┌─────────────────────┐
│ My Sites (3)        │
└─────────────────────┘

// Single column card stack

┌─────────────────────┐
│ THUMBNAIL (h-28)    │
│ [Color + icon]      │
├─────────────────────┤
│ [● Published]       │
│ Al-Nour Clinic      │
│ Clinic · AR         │
│ Updated 2 days ago  │
│ [Edit] [View] [···] │
└─────────────────────┘

┌─────────────────────┐
│ [○ Draft]           │
│ My Portfolio        │
│ Freelancer · EN     │
│ Updated today       │
│ [Edit] [Preview]    │
└─────────────────────┘

// Cards in single column
// Action buttons wrap to row: Edit full-width, then View + ···
// ··· opens a bottom sheet action menu
```

### Mobile Bottom Sheet Action Menu

```
┌─────────────────────┐
│                     │  // bottom sheet slides up from bottom
│ ─── (drag handle)   │
│                     │
│ Al-Nour Clinic      │  // site name header
│ ─────────────────── │
│ ✏ Edit Site         │
│ 👁 Preview          │
│ ✏ Rename            │
│ 🗑 Delete...        │  // opens confirm Dialog
│ ─────────────────── │
│ [Cancel]            │
└─────────────────────┘
```

### Mobile New Site — Step 1

```
┌─────────────────────┐
│ [← Dashboard]       │
│ Create New Site     │
│ ●──○  1 of 2        │
│                     │
│ Site Name           │
│ [_______________]   │
│                     │
│ Language            │
│ [English] [العربية] │
│                     │
│ [Continue →]        │
│ (full width)        │
└─────────────────────┘
```

### Mobile New Site — Step 2

```
┌─────────────────────┐
│ [← Back]            │
│ ○──●  2 of 2        │
│ Choose Template     │
│                     │
│ ┌────────┐ ┌───────┐│
│ │🏢      │ │🎨     ││
│ │Company │ │Agency ││
│ │شركة   │ │وكالة ││
│ └────────┘ └───────┘│
│ ┌────────┐ ┌───────┐│
│ │👤      │ │📄     ││
│ │Freelnc │ │Resume ││
│ └────────┘ └───────┘│
│ // 2-column grid    │
│ // scrollable       │
└─────────────────────┘
```

### Mobile Editor — Not a Sidebar Layout

On mobile, the editor uses a bottom tab bar and bottom sheet panel instead of a fixed sidebar:

```
┌─────────────────────┐
│ [←] Al-Nour  [Save] │  // simplified top bar
│         [EN] [Pub.] │
├─────────────────────┤
│                     │
│  PREVIEW CANVAS     │
│  (full screen)      │
│                     │
│  // sections are    │
│  // click-selectable│
│                     │
│                     │
├─────────────────────┤
│ [Sections] [Theme]  │  // bottom tab bar
└─────────────────────┘
```

Tapping a section OR tapping "Sections" tab opens a bottom sheet:

```
┌─────────────────────┐
│ ── (drag to close)  │
│ Hero (selected)     │
│ ─────────────────── │
│ Template: [01] [02] │  // 3-col template buttons
│ [03] [04] [05]...   │
│ ─────────────────── │
│ Heading             │
│ EN: [____________]  │
│ AR: [____________]  │
│                     │
│ Subheading          │
│ EN: [____________]  │
│ AR: [____________]  │
│ (scrollable)        │
└─────────────────────┘
// max-height: 70vh, scrollable
// handles: swipe down to close
```

---

## Wireframe 5: Template Picker Redesign

### Current Problem
The template picker in the content editor panel is a 2-column grid of small text buttons labeled "Template 01", "Template 02", etc.

### Improved Design

```
┌──────────────────────────┐
│ TEMPLATE                 │
│                          │
│ ┌────────────────────┐   │
│ │  [scroll row →]    │   │
│ │                    │   │
│ │ ┌──────┐ ┌──────┐  │   │
│ │ │ ████ │ │ ████ │  │   │
│ │ │ ▓▓▓▓ │ │ ░░░░ │  │   │  // thumbnail previews
│ │ │ ▓▓▓▓ │ │ ░░░░ │  │   │  // 80px wide, 64px tall
│ │ │──────│ │──────│  │   │
│ │ │Tmpl01│ │Tmpl02│  │   │
│ │ │  ✓   │ │      │  │   │  // checkmark on active
│ │ └──────┘ └──────┘  │   │
│ └────────────────────┘   │
│   // horizontal scroll   │
│   // current: blue ring  │
│                          │
└──────────────────────────┘
```

**Thumbnail generation strategy:**
- Phase 1: Color swatches using the template's background and primary color (no screenshot needed).
- Phase 2: Static thumbnail PNGs per template, committed to the repo.
- Phase 3: Dynamic screenshots via Puppeteer or Vercel OG image generation.

---

## Notes on Wireframe Implementation

All wireframes above use these design tokens already defined in the project:
- Primary: `#2563EB` (blue-600)
- Border: `border-gray-100` / `border-gray-200`
- Background: `bg-gray-50`
- Card: `bg-white rounded-xl`
- Muted text: `text-gray-400` / `text-gray-500`
- Selected state: `border-blue-300 bg-blue-50`

Spacing follows Tailwind's default 4px scale (`p-4` = 16px, `p-6` = 24px, `p-8` = 32px).

Typography:
- Page title: `text-2xl font-bold text-gray-900`
- Section label: `text-sm font-semibold text-gray-700`
- Meta / timestamps: `text-xs text-gray-400`
- Form labels: `text-sm font-medium text-gray-700`
