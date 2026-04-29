# Non-Technical User UX Design — Safahati Platform

**Document type:** UX Specifications + ASCII Wireframes  
**Audience:** Frontend engineers implementing these features  
**Design system:** Tailwind CSS 4 + shadcn/ui (admin UI), as defined in `03-Design-System.md`  
**Language note:** All UI copy is bilingual — Arabic (primary, RTL) and English (secondary, LTR). Wireframes show both variants side by side or in separate blocks labelled `[AR]` and `[EN]`.

---

## Design Principles Enforced Throughout

1. **Non-technical first** — No developer jargon. "Sections" not "components". "Look" not "template ID". "Address" not "slug".
2. **Arabic-first, RTL default** — Layout direction flips. Margins, chevrons, progress, and reading order all reverse.
3. **Mobile-first** — Every layout starts at 375px wide. Tablet/desktop are progressive enhancements.
4. **Warm and trustworthy** — blue-600/violet-600 primary, amber for warnings, green for success. Never cold grays on white alone.
5. **Saudi cultural context** — WhatsApp over email/phone, Hijri calendar awareness in date fields, privacy-respecting defaults (photos off by default).
6. **Confidence-building micro-copy** — Every error has a fix. Every empty state has a next step. Every save is confirmed.

---

## Notation Legend

```
[Button]          = Clickable button element
[Input: label]    = Text input with label
[Toggle]          = On/off switch
[Dropdown]        = Select dropdown
{copy}            = Actual UI text / copy
→                 = Navigation / transition
//                = Implementation annotation
⬤                 = Filled circle / dot indicator
○                 = Empty circle
◐                 = Half-filled (partial)
```

---

## Feature 1: "Build My Site in 5 Minutes" Wizard

### Overview

An 8-step conversational setup wizard triggered when a user creates their first site. The user answers one focused question per screen. The system builds a fully configured site automatically from the answers. No technical knowledge required.

**Route:** `/dashboard/new` (wizard mode)  
**Trigger:** First-time site creation  
**Completion target:** Under 5 minutes  
**Exit behavior:** Answers are auto-saved; user can resume from last step

---

### Global Wizard Shell (all 8 steps share this shell)

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER (h-14, white, border-b border-gray-200, sticky)         │
│                                                                  │
│  [← Back]  (text-sm text-gray-500, hidden on step 1)            │
│                                                                  │
│                  ●  ●  ●  ●  ●  ●  ●  ●                         │
│            Step dots (8 total, filled = completed,               │
│            blue-600 = current, gray-200 = upcoming)              │
│                                                                  │
│                              [Skip →]  (text-sm, gray-400)      │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  STEP CONTENT AREA (flex-col, items-center, px-4, py-8)         │
│  max-w-lg mx-auto                                                │
│                                                                  │
│  {Step illustration — 80×80px SVG icon, color: blue-100 bg,     │
│   rounded-2xl, icon stroke blue-600}                             │
│                                                                  │
│  {Step number label}                                             │
│  e.g. "Step 2 of 8" — text-sm text-gray-400 mt-4               │
│                                                                  │
│  {Question headline}                                             │
│  text-2xl font-bold text-gray-900 mt-2 text-center              │
│                                                                  │
│  {Context hint / sub-label}                                      │
│  text-sm text-gray-500 mt-1 text-center max-w-xs mx-auto        │
│                                                                  │
│  ─────── INPUT AREA ───────                                      │
│  (varies per step — see individual step specs below)             │
│                                                                  │
│  [Continue →]                                                    │
│  (primary button, w-full, h-12, mt-8, disabled if                │
│   required field is empty, shows spinner on async steps)         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Back/Skip/Next behavior:**
- **Back:** Returns to previous step. Entered data is preserved. Animated slide-right (300ms, ease-out).
- **Skip:** Skips optional steps only (steps 5, 7). Marks that field as null in config. Greyed-out "Skip" label top-right.
- **Continue:** Validates current step. If valid, advances. Animated slide-left (300ms, ease-out).
- **Keyboard:** Enter key triggers Continue. Escape key triggers Back.

---

### Step 1 — Business Type

```
[EN]
┌──────────────────────────────────────┐
│  [Icon: Building/Store SVG]          │
│                                      │
│  Step 1 of 8                         │
│                                      │
│  What kind of business               │
│  do you have?                        │
│                                      │
│  Pick the one that's closest to you  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 🏪  Shop or Store              │  │
│  ├────────────────────────────────┤  │
│  │ 🍽️  Restaurant or Café         │  │
│  ├────────────────────────────────┤  │
│  │ 🏥  Clinic or Medical Center   │  │
│  ├────────────────────────────────┤  │
│  │ 💼  Freelancer or Consultant   │  │
│  ├────────────────────────────────┤  │
│  │ 🏢  Company or Agency         │  │
│  ├────────────────────────────────┤  │
│  │ 🏠  Real Estate                │  │
│  ├────────────────────────────────┤  │
│  │ 📸  Photography or Creative    │  │
│  ├────────────────────────────────┤  │
│  │ 🎪  Event or Venue             │  │
│  ├────────────────────────────────┤  │
│  │ 🏋️  Gym or Fitness Center      │  │
│  ├────────────────────────────────┤  │
│  │ ⚖️  Law Firm                   │  │
│  └────────────────────────────────┘  │
│                                      │
│  [Continue →]  (enabled after tap)   │
└──────────────────────────────────────┘
```

**Input type:** Single-select list (tappable rows).  
**Selected state:** Row gets blue-50 bg, left border-2 border-blue-600, checkmark icon on right.  
**Note:** Icons are Lucide SVGs, not emoji. Arabic version uses the same icons. RTL flips the checkmark to the left side.

```
[AR] — RTL variant
┌──────────────────────────────────────┐
│  [أيقونة: مبنى]                      │
│                                      │
│  الخطوة ١ من ٨                       │
│                                      │
│       ما نوع عملك؟                   │
│                                      │
│   اختر الأقرب إلى طبيعة نشاطك        │
│                                      │
│  ┌────────────────────────────────┐  │
│  │           متجر أو بوتيك  🏪   │  │
│  ├────────────────────────────────┤  │
│  │        مطعم أو كافيه  🍽️      │  │
│  ├────────────────────────────────┤  │
│  │      عيادة أو مركز طبي  🏥    │  │
│  ├────────────────────────────────┤  │
│  │       مستقل أو استشاري  💼    │  │
│  ├────────────────────────────────┤  │
│  │        شركة أو وكالة  🏢      │  │
│  └────────────────────────────────┘  │
│  [المزيد...]                         │
│                                      │
│             [التالي ←]               │
└──────────────────────────────────────┘
```

// In RTL: chevron in button points LEFT (←), progress dots read right-to-left, the selected checkmark sits on the LEFT side of the row.

---

### Step 2 — Business Name

```
[EN]
┌──────────────────────────────────────┐
│  [Icon: Tag/Label SVG]               │
│                                      │
│  Step 2 of 8                         │
│                                      │
│  What's the name of                  │
│  your business?                      │
│                                      │
│  This will appear at the top of      │
│  your website                        │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  Business name               │    │
│  │  [                        ]  │    │
│  └──────────────────────────────┘    │
│                                      │
│  e.g. "Rose Garden Clinic"           │
│  (text-xs text-gray-400 mt-1)        │
│                                      │
│  [Continue →]                        │
└──────────────────────────────────────┘
```

**Input type:** Single text input, `maxLength={60}`, `autocomplete="organization"`.  
**Validation:** Non-empty. Trim whitespace. Min 2 chars.  
**Context hint:** Updates live in a small preview chip below the input: "Your site will say: **Rose Garden Clinic**"

```
[AR]
┌──────────────────────────────────────┐
│  الخطوة ٢ من ٨                       │
│                                      │
│       ما اسم نشاطك التجاري؟          │
│                                      │
│  سيظهر هذا في أعلى موقعك الإلكتروني │
│                                      │
│  ┌──────────────────────────────┐    │
│  │         اسم النشاط التجاري  │    │
│  │  [                        ]  │    │
│  └──────────────────────────────┘    │
│                                      │
│        مثال: "عيادة الورد"           │
│                                      │
│             [التالي ←]               │
└──────────────────────────────────────┘
```

---

### Step 3 — City / Location

```
[EN]
┌──────────────────────────────────────┐
│  [Icon: Map Pin SVG]                 │
│                                      │
│  Step 3 of 8                         │
│                                      │
│  Which city are you in?              │
│                                      │
│  Helps customers know where          │
│  to find you                         │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  City                        │    │
│  │  [Riyadh              ▼   ]  │    │
│  └──────────────────────────────┘    │
│                                      │
│  + Add neighborhood (optional)       │
│  (text link, expands a second input) │
│                                      │
│  [Continue →]                        │
└──────────────────────────────────────┘
```

**Input type:** Searchable dropdown. Pre-populated with 50 major Saudi cities, then "Other" with free-text fallback.  
**Saudi cities shown first:** Riyadh, Jeddah, Mecca, Medina, Dammam, Khobar, Taif, Abha, Tabuk, Qassim, Hail, Jizan, Najran.  
**Optional neighborhood:** Plain text input that appears when "+ Add neighborhood" is tapped. `placeholder="e.g., Al-Olaya, Tahlia Street"`.

---

### Step 4 — Contact Phone

```
[EN]
┌──────────────────────────────────────┐
│  [Icon: Phone SVG]                   │
│                                      │
│  Step 4 of 8                         │
│                                      │
│  What's your phone number?           │
│                                      │
│  Customers will use this to          │
│  call or message you on WhatsApp     │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ [🇸🇦 +966] [5x xxx xxxx    ] │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ [Toggle] Show WhatsApp button│    │
│  │          on my site          │    │
│  └──────────────────────────────┘    │
│  (Toggle defaults to ON)             │
│                                      │
│  [Continue →]                        │
└──────────────────────────────────────┘
```

**Input type:** Phone input with country prefix selector. Default: Saudi Arabia (+966). `type="tel"`, `inputMode="numeric"`.  
**Country prefix:** Flag + code. Supports switching to other GCC countries.  
**WhatsApp toggle:** Inline, enabled by default. If toggled off, no floating WhatsApp button on published site.

---

### Step 5 — Logo Upload (Optional)

```
[EN]
┌──────────────────────────────────────┐
│  [Icon: Image SVG]                   │
│                                      │
│  Step 5 of 8                         │
│                                      │
│  Do you have a logo?                 │
│                                      │
│  You can always add it later         │
│                                      │
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │   [ Upload image ]             │  │
│  │                                │  │
│  │   or drag and drop here        │  │
│  │   PNG, JPG, SVG — max 5MB      │  │
│  │                                │  │
│  └────────────────────────────────┘  │
│                                      │
│  Preview:                            │
│  ┌──────────┐                        │
│  │ [logo]   │  Logo looks good!      │
│  │ 120×40px │  (shown after upload)  │
│  └──────────┘                        │
│                                      │
│  [Continue →]          [Skip →]      │
└──────────────────────────────────────┘
```

**Input type:** File upload with drag-and-drop. On mobile: tap opens system media picker.  
**Post-upload behavior:** Thumbnail preview appears immediately. "Remove" link next to it.  
**Skip:** Prominently available. System uses business name as text logo with gradient until logo is added.

---

### Step 6 — Primary Color / Style

```
[EN]
┌──────────────────────────────────────┐
│  [Icon: Palette SVG]                 │
│                                      │
│  Step 6 of 8                         │
│                                      │
│  Pick a color that fits              │
│  your brand                          │
│                                      │
│  You can change this anytime         │
│                                      │
│  ┌───────────────────────────────┐   │
│  │  ⬤ Blue (Modern & Trust)     │   │ ← selected
│  │  ⬤ Teal (Fresh & Health)     │   │
│  │  ⬤ Green (Natural & Calm)    │   │
│  │  ⬤ Gold (Premium & Elegant)  │   │
│  │  ⬤ Rose (Warm & Welcoming)   │   │
│  │  ⬤ Slate (Clean & Minimal)   │   │
│  │  ⬤ Purple (Creative & Bold)  │   │
│  │  + More colors                │   │
│  └───────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  MINI PREVIEW                │    │
│  │  [Business Name]             │    │
│  │  [──────── hero band ──────] │    │
│  │  in selected color           │    │
│  └──────────────────────────────┘    │
│                                      │
│  [Continue →]                        │
└──────────────────────────────────────┘
```

**Input type:** Single-select color list. Each row = color swatch circle + name + short descriptor.  
**Mini preview:** 60px tall strip in the selected color showing business name in white. Updates instantly on selection.  
**"More colors":** Expands a hex color picker (for users who have a specific brand color).

---

### Step 7 — Short Description (Optional)

```
[EN]
┌──────────────────────────────────────┐
│  [Icon: Type/Text SVG]               │
│                                      │
│  Step 7 of 8                         │
│                                      │
│  Describe your business              │
│  in one sentence                     │
│                                      │
│  This will appear under your name    │
│  on the homepage                     │
│                                      │
│  ┌──────────────────────────────┐    │
│  │                              │    │
│  │  [                        ]  │    │
│  │                              │    │
│  └──────────────────────────────┘    │
│  0 / 120 characters                  │
│  (text-xs text-gray-400, right-align)│
│                                      │
│  ✨ Generate a suggestion            │
│  (text link — calls AI, shows        │
│  spinner then fills field)           │
│                                      │
│  [Continue →]          [Skip →]      │
└──────────────────────────────────────┘
```

**Input type:** `<textarea>` rows=3, `maxLength={120}`.  
**AI suggestion trigger:** "Generate a suggestion" link. Calls `/api/ai/suggest-tagline` with `{businessType, businessName, city}`. Fills textarea. User can edit or regenerate.  
**Character counter:** Updates on each keystroke. Turns amber when > 100 chars, red when at 120.

---

### Step 8 — Language Preference

```
[EN]
┌──────────────────────────────────────┐
│  [Icon: Globe SVG]                   │
│                                      │
│  Step 8 of 8                         │
│                                      │
│  What language should your           │
│  website use?                        │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ ○  Arabic only               │    │
│  │    موقع بالعربية فقط         │    │
│  ├──────────────────────────────┤    │
│  │ ●  Arabic + English          │    │
│  │    موقع ثنائي اللغة   ← best │    │
│  ├──────────────────────────────┤    │
│  │ ○  English only              │    │
│  │    Website in English only   │    │
│  └──────────────────────────────┘    │
│                                      │
│  "Arabic + English" shows a          │
│  language switcher on your site      │
│  (text-xs text-gray-500)             │
│                                      │
│  [Build My Site →]                   │
│  (Primary, full-width, large,        │
│   bg-blue-600, shows spinner         │
│   during build — ~2 seconds)         │
└──────────────────────────────────────┘
```

**Input type:** Radio list (single-select).  
**Default:** "Arabic + English" pre-selected.  
**"Build My Site" button behavior:** Triggers `POST /api/sites/create` with all wizard answers. Shows inline loading: "Building your site..." with animated dots. On success: transition to "Your site is ready" screen.

---

### Final Screen — "Your Site Is Ready"

```
[EN]
┌──────────────────────────────────────┐
│                                      │
│     🎉  (Confetti animation —        │
│          see Feature 4 for specs)    │
│                                      │
│   Your website is ready!             │
│   text-3xl font-bold text-gray-900   │
│   text-center                        │
│                                      │
│   Here's your link:                  │
│   text-sm text-gray-500              │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ 🔗 your-business.safahati.com│    │
│  │ [Copy Link]  [Open Site →]   │    │
│  └──────────────────────────────┘    │
│  (rounded-xl, border border-blue-200,│
│   bg-blue-50, p-4)                   │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ MINI LIVE PREVIEW            │    │
│  │ (iframe, h-48, rounded-xl,   │    │
│  │  overflow-hidden, pointer-   │    │
│  │  events-none — view only)    │    │
│  └──────────────────────────────┘    │
│                                      │
│  [Go to My Dashboard →]              │
│  (secondary button, w-full)          │
│                                      │
│  [Edit My Site]                      │
│  (text link, text-blue-600)          │
│                                      │
└──────────────────────────────────────┘
```

```
[AR]
┌──────────────────────────────────────┐
│                                      │
│          موقعك جاهز الآن!           │
│                                      │
│      هذا هو رابط موقعك:             │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  your-business.safahati.com 🔗│   │
│  │ [نسخ الرابط]  [← فتح الموقع] │    │
│  └──────────────────────────────┘    │
│                                      │
│         [← الذهاب إلى لوحتي]        │
│           [تعديل موقعي]              │
│                                      │
└──────────────────────────────────────┘
```

---

## Feature 2: Live Preview Split-Screen Editor

### Overview

The site editor shows the admin form fields on one side and a live iframe preview of the published site on the other. The preview updates in real time (300ms debounce) as the user types. On mobile, the two panels switch via tabs.

**Route:** `/dashboard/sites/[siteId]/edit`

---

### Desktop Layout (≥1024px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TOPBAR (h-14, white, border-b, sticky, z-40)                               │
│                                                                              │
│  [← Sites]   [Site Name: Rose Garden Clinic ▼]                              │
│                        (dropdown to switch section/page)                     │
│                                                    [Save]  [Publish →]       │
│  // "Save" = ghost button, gray-600                                          │
│  // "Publish" = primary blue, shows badge "Live" if already published        │
└─────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────┬─────────────────────────────────────────────────┐
│  LEFT PANEL               │  RIGHT PANEL                                    │
│  (w-[420px], flex-none,   │  (flex-1, min-w-0, bg-gray-100)                │
│   overflow-y-auto,        │                                                  │
│   border-r, bg-white)     │  PREVIEW TOOLBAR (h-10, bg-white, border-b)    │
│                           │  [Mobile] [Tablet] [Desktop]  [⤢ Full Preview] │
│  SECTION NAVIGATION       │  // device toggles set iframe width              │
│  (p-4, border-b)          │  // Full Preview opens new tab                  │
│  ┌─────────────────────┐  │                                                  │
│  │  ● Hero             │  │  IFRAME WRAPPER (p-4, centered)                │
│  │  ○ About            │  │  ┌──────────────────────────────────────────┐  │
│  │  ○ Services         │  │  │                                          │  │
│  │  ○ Gallery          │  │  │  LIVE PREVIEW IFRAME                     │  │
│  │  ○ Contact          │  │  │  (border rounded-2xl shadow-lg)          │  │
│  └─────────────────────┘  │  │  src="/api/preview/[siteId]"             │  │
│  // Active section        │  │                                          │  │
│  // highlighted blue-50   │  │  Width controlled by device toggle:      │  │
│                           │  │  Mobile = 390px                          │  │
│  FORM FIELDS              │  │  Tablet = 768px                          │  │
│  (p-4, space-y-6)         │  │  Desktop = 100% of panel                 │  │
│                           │  │                                          │  │
│  ┌─────────────────────┐  │  │  // iframe has pointer-events: none     │  │
│  │ Headline            │  │  │  // click on preview = no action         │  │
│  │ [               ]   │  │  │                                          │  │
│  └─────────────────────┘  │  └──────────────────────────────────────────┘  │
│                           │                                                  │
│  ┌─────────────────────┐  │  LOADING OVERLAY (shown during preview update) │
│  │ Subheading          │  │  ┌──────────────────────────────────────────┐  │
│  │ [               ]   │  │  │                                          │  │
│  └─────────────────────┘  │  │  [spinner: border-t-blue-600 animate-    │  │
│                           │  │   spin w-6 h-6]                          │  │
│  ┌─────────────────────┐  │  │  Updating preview...                     │  │
│  │ Button text         │  │  │  (text-sm text-gray-400)                 │  │
│  │ [               ]   │  │  │                                          │  │
│  └─────────────────────┘  │  └──────────────────────────────────────────┘  │
│                           │  // Overlay uses absolute positioning with      │
│  ┌─────────────────────┐  │  // bg-white/60 backdrop-blur-sm               │
│  │ Background image    │  │  // Fades in after 300ms debounce fires        │
│  │ [Upload image]      │  │  // Fades out after new iframe load            │
│  └─────────────────────┘  │                                                  │
│                           │                                                  │
│  ─── NEXT SECTION ───     │                                                  │
│  [+ About section]        │                                                  │
│  (dashed border, rounded) │                                                  │
│                           │                                                  │
└───────────────────────────┴─────────────────────────────────────────────────┘
```

**Real-time update mechanism:**
1. User types into any form field.
2. `onChange` fires and updates local Zustand store.
3. A 300ms debounced function triggers `POST /api/preview/[siteId]` with the diff.
4. On response, `iframe.src` is refreshed with a cache-bust query param (`?t=timestamp`).
5. Loading overlay appears after 100ms if response hasn't returned yet.
6. Loading overlay fades out (150ms ease-out) when new iframe `onload` fires.

---

### Mobile Layout (<768px)

```
┌─────────────────────────────┐
│  TOPBAR (h-14, sticky)      │
│  [← Sites]    [Save] [Pub.] │
└─────────────────────────────┘

┌─────────────────────────────┐
│  TAB BAR (h-10, border-b)   │
│  ┌───────────┬────────────┐  │
│  │ ✏️ Edit   │ 👁 Preview │  │
│  │ (active)  │            │  │
│  └───────────┴────────────┘  │
│  // Underline indicator tab  │
│  // style — blue-600 border  │
└─────────────────────────────┘

EDIT TAB (active):
┌─────────────────────────────┐
│  SECTION CHIPS (horizontal  │
│  scroll, h-10, px-4)        │
│  [Hero] [About] [Services]  │
│  [Gallery] [Contact]        │
│  // pill shape, selected =  │
│  // blue-50 bg, blue border │
└─────────────────────────────┘
┌─────────────────────────────┐
│  FORM FIELDS (px-4, py-4)   │
│  (same fields as desktop)   │
└─────────────────────────────┘

PREVIEW TAB:
┌─────────────────────────────┐
│  PREVIEW FRAME              │
│  (w-full, h-[calc(100vh-    │
│   112px)], iframe)          │
│  // Full-width preview on   │
│  // mobile, no device switcher│
│                             │
│  [↻ Refresh Preview]        │
│  (floating button, bottom-  │
│  right, bg-white shadow,    │
│  rounded-full, p-3)         │
└─────────────────────────────┘
```

**Tab switching animation:** Slide left/right (250ms, ease-out). Edit panel slides out to left when switching to Preview, Preview slides in from right. Reverse on switching back.

**"Full Preview" button (desktop):** Opens `https://[slug].safahati.com?preview=true` in a new browser tab. The `preview=true` query param bypasses the publish requirement so user can see the real URL.

---

## Feature 3: "What's Missing" Completeness Dashboard Card

### Overview

A card on the main dashboard showing how complete the site is, with specific checklist items and direct links to fix each one. Motivates non-technical users to complete their profile.

**Location:** Dashboard home, prominently placed below the site URL card.  
**Updates:** Recalculated on each dashboard load.

---

### Card Design

```
[EN] — 80% complete example
┌───────────────────────────────────────────────────────┐
│  COMPLETENESS CARD                                    │
│  (bg-white, rounded-2xl, border, p-5, shadow-sm)     │
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │  LEFT: Progress ring    RIGHT: Summary text    │  │
│  │                                                │  │
│  │  ╭───────────────╮   Your site is 80% ready   │  │
│  │  │    ╭─────╮    │   text-sm font-medium       │  │
│  │  │  ╭─┤  80 ├─╮  │   text-gray-900             │  │
│  │  │  │ │  %  │ │  │                             │  │
│  │  │  ╰─┤     ├─╯  │   2 things left to finish  │  │
│  │  │    ╰─────╯    │   text-xs text-gray-500     │  │
│  │  ╰───────────────╯                             │  │
│  │  // SVG ring: stroke-width=8                   │  │
│  │  // Track color: gray-100                      │  │
│  │  // Fill color: green-500 (80%+)               │  │
│  │              amber-500 (40-79%)                │  │
│  │              red-500 (<40%)                    │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  CHECKLIST                                            │
│  ─────────────────────────────────────────────────── │
│                                                       │
│  ✅  Business name added          [Done]              │
│  ✅  Phone number added           [Done]              │
│  ✅  Color selected               [Done]              │
│  ✅  Homepage hero text added     [Done]              │
│  ⚠️  Logo not added yet          [Add Logo →]        │
│  🔴  No photos in gallery         [Add Photos →]     │
│  ✅  Contact section complete     [Done]              │
│  ✅  Language set                 [Done]              │
│                                                       │
│  // Each row: icon left + label + action right       │
│  // ✅ = green-600 icon + text-gray-500 + "Done" badge│
│  // ⚠️ = amber-600 icon + text-gray-700 + link      │
│  // 🔴 = red-500 icon + text-gray-700 + link        │
│                                                       │
│  [Complete My Site →]                                 │
│  (text link, text-blue-600, text-sm, mt-2)           │
└───────────────────────────────────────────────────────┘
```

**Color coding rules:**

| Score | Ring color | Label |
|-------|------------|-------|
| 0–39% | `red-500` | "Let's get started" |
| 40–79% | `amber-500` | "Almost there" |
| 80–99% | `green-500` | "Looking great!" |
| 100% | `green-600` + sparkle icon | "Your site is complete!" |

**Checklist items (8 total, scored equally at 12.5% each):**

| # | Item | Section to fix |
|---|------|----------------|
| 1 | Business name added | `/edit/hero` |
| 2 | Phone number added | `/edit/contact` |
| 3 | Color/theme selected | `/edit/theme` |
| 4 | Homepage headline written | `/edit/hero` |
| 5 | Logo uploaded | `/edit/branding` |
| 6 | At least 1 photo in gallery | `/edit/gallery` |
| 7 | Contact section complete | `/edit/contact` |
| 8 | Site published at least once | (publish button) |

**Click behavior for action links:**
- Clicking any `[Action →]` link navigates to the specific editor section for that item.
- The editor opens with that section's form pre-scrolled into view and auto-focused.

```
[AR]
┌───────────────────────────────────────────────────────┐
│  موقعك مكتمل بنسبة ٨٠٪                               │
│                                                       │
│  ╭───────────────╮   ٢ أشياء متبقية                   │
│  │      80%      │                                   │
│  ╰───────────────╯                                   │
│                                                       │
│  ✅  تمت إضافة الاسم التجاري        [تم]             │
│  ✅  تمت إضافة رقم الجوال           [تم]             │
│  ⚠️  لم تُضف الشعار بعد           [← أضف الشعار]    │
│  🔴  لا توجد صور في المعرض       [← أضف الصور]      │
│                                                       │
│                       [← أكمل موقعي]                  │
└───────────────────────────────────────────────────────┘
```

---

## Feature 4: "Launch Your Site" Celebration Screen

### Overview

First-time publish celebration. Shown once, when the user publishes their site for the first time. Full-screen overlay with confetti, live URL, and social sharing options.

**Trigger:** `site.publishedAt === null` before publish → `publishedAt !== null` after.  
**Dismissal:** "Start sharing" button, or tapping the backdrop after 3 seconds.  
**Repeat:** Never shown again for the same site (stored in `localStorage` and checked against `site.id`).

---

### Full-Screen Overlay Design

```
[EN]
┌──────────────────────────────────────────────────────────────────┐
│  CONFETTI LAYER (absolute, inset-0, z-50, pointer-events-none)  │
│  // canvas element using canvas-confetti library                 │
│  // Colors: blue-600, violet-600, amber-400, green-500, white    │
│  // Duration: 4 seconds, then fade out                           │
│  // Shape mix: circles 60%, squares 30%, stars 10%               │
│  // Gravity: 0.8, spread: 70, particleCount: 150                 │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  OVERLAY PANEL (fixed, inset-0, z-40, flex items-end)           │
│  (on mobile: sheet from bottom)                                  │
│  (on desktop: centered modal max-w-lg)                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  MODAL (bg-white, rounded-t-3xl or rounded-2xl, p-8)      │  │
│  │                                                            │  │
│  │              🎉                                            │  │
│  │  (64×64px SVG celebration icon, text-5xl, mb-4)           │  │
│  │                                                            │  │
│  │       Congratulations!                                     │  │
│  │  Your website is live!                                     │  │
│  │  (text-2xl font-bold text-gray-900 text-center)           │  │
│  │                                                            │  │
│  │  Share your new website with your customers               │  │
│  │  (text-sm text-gray-500 text-center mt-1 mb-6)            │  │
│  │                                                            │  │
│  │  YOUR LIVE URL                                             │  │
│  │  ┌──────────────────────────────────────────────────┐     │  │
│  │  │  🔗  your-business.safahati.com                  │     │  │
│  │  │                                    [Copy Link]   │     │  │
│  │  └──────────────────────────────────────────────────┘     │  │
│  │  (bg-gray-50 rounded-xl border p-3 flex justify-between)  │  │
│  │                                                            │  │
│  │  ── Share with your customers ──────────────────────      │  │
│  │  (text-xs text-gray-400 text-center my-4)                 │  │
│  │                                                            │  │
│  │  SHARE BUTTONS (flex gap-3 flex-col)                      │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────┐       │  │
│  │  │  [WhatsApp icon]  Share on WhatsApp            │       │  │
│  │  └────────────────────────────────────────────────┘       │  │
│  │  (bg-[#25D366] text-white rounded-xl h-12 w-full          │  │
│  │   font-medium)                                            │  │
│  │  Deep link: https://wa.me/?text=...                       │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────┐       │  │
│  │  │  [Instagram icon]  Copy link for Instagram     │       │  │
│  │  └────────────────────────────────────────────────┘       │  │
│  │  (bg-gradient from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]  │  │
│  │   text-white rounded-xl h-12 w-full font-medium)          │  │
│  │  Action: copies URL to clipboard + shows toast:            │  │
│  │  "Link copied — paste it in your Instagram bio"           │  │
│  │                                                            │  │
│  │  ── Tell a friend ──────────────────────────────          │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────┐       │  │
│  │  │  Enter their WhatsApp number                   │       │  │
│  │  │  [🇸🇦 +966] [5x xxx xxxx              ] [→]   │       │  │
│  │  └────────────────────────────────────────────────┘       │  │
│  │  // Input + send button. On tap: opens wa.me deep link    │  │
│  │  // with pre-filled message in the user's language        │  │
│  │                                                            │  │
│  │  [Start sharing →]                                         │  │
│  │  (ghost button, text-gray-500, text-sm, mt-6, w-full)     │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

**WhatsApp deep link format:**
```
https://wa.me/?text=زوروا موقعي الجديد: https://[slug].safahati.com
```
(Arabic version — URL-encoded before use in href)

```
https://wa.me/?text=Check out my new website: https://[slug].safahati.com
```
(English version)

**"Tell a friend" WhatsApp message (pre-filled):**
```
[AR]: مرحباً! أطلقت موقعي الجديد، تفضل زيارته: https://[slug].safahati.com
[EN]: Hi! I just launched my new website, check it out: https://[slug].safahati.com
```

**Copy Link behavior:**
- Copies to clipboard.
- Button text changes to "Copied ✓" for 2 seconds, then reverts.
- Text color: `green-600` during the "Copied ✓" state.

```
[AR] — RTL layout
┌──────────────────────────────────────────────────────────────────┐
│                   مبروك!                                         │
│              موقعك أصبح حياً الآن!                              │
│                                                                  │
│  شارك موقعك الجديد مع عملائك                                    │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  [نسخ الرابط]          your-business.safahati.com 🔗    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ─────────── شارك مع عملائك ───────────                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        شارك عبر واتساب            [WhatsApp icon]       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │       انسخ الرابط للإنستغرام      [Instagram icon]      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ─────────────── أخبر صديقاً ───────────────                   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  [←]  [         رقم واتساب الصديق    ] [966+ 🇸🇦]       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│                    [← ابدأ المشاركة]                            │
└──────────────────────────────────────────────────────────────────┘
```

**Animation sequence:**
1. Overlay fades in (200ms, ease-out).
2. Modal slides up from bottom (300ms, spring physics — `spring(1, 300, 0.3)`).
3. Confetti fires immediately on overlay appearance (canvas-confetti burst).
4. Confetti second burst at 500ms (smaller, different angle).
5. Celebration icon bounces: `scale(1) → scale(1.2) → scale(1)` over 400ms.
6. After 4 seconds, confetti canvas fades out (500ms).

---

## Feature 5: WhatsApp Integration UI

### 5A — WhatsApp Field in Setup Wizard

The WhatsApp number is collected in **Step 4** of the wizard (same field as the phone number). The toggle to enable the WhatsApp button appears immediately below:

```
┌──────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────┐    │
│  │ [🇸🇦 +966 ▼]  [5x xxx xxxx               ]  │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │                                              │    │
│  │  [Toggle: ON ●──────]  Show WhatsApp button  │    │
│  │                        on my website         │    │
│  │                                              │    │
│  │  Visitors can message you directly from      │    │
│  │  your site (recommended ✓)                  │    │
│  │  (text-xs text-gray-500)                    │    │
│  │                                              │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

**Toggle state:** ON by default. Stored as `config.whatsapp.enabled = true`.

### 5B — WhatsApp Field in Editor

In the editor's Contact section form:

```
┌──────────────────────────────────────────────────────┐
│  CONTACT SECTION FIELDS                              │
│                                                      │
│  Phone / WhatsApp number                             │
│  ┌──────────────────────────────────────────────┐    │
│  │ [🇸🇦 +966 ▼] [5x xxx xxxx               ]   │    │
│  └──────────────────────────────────────────────┘    │
│  This number is used for calls AND the               │
│  WhatsApp button (text-xs text-gray-400)             │
│                                                      │
│  ────────────────────────────────────────────        │
│  WhatsApp floating button                            │
│  [Toggle ●──────]  Show on my site                  │
│                                                      │
│  Button label (Arabic)                               │
│  ┌──────────────────────────────────────────────┐    │
│  │ [راسلنا على واتساب               ]           │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  Button label (English)                              │
│  ┌──────────────────────────────────────────────┐    │
│  │ [Message us on WhatsApp           ]          │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

### 5C — Floating Button on Published Site (Mobile)

```
Published site — mobile (375px):
┌──────────────────────────────────┐
│                                  │
│  [Site content...]               │
│                                  │
│                                  │
│                                  │
│                                  │
│                                  │
│                   ┌────────────┐ │ ← fixed, bottom-right
│                   │ [WA icon]  │ │   z-50, mb-safe+16px
│                   │            │ │   w-14 h-14 rounded-full
│                   └────────────┘ │   bg-[#25D366]
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   shadow-lg
│  (bottom navigation bar / safe) │   animate: subtle pulse
└──────────────────────────────────┘   every 4s (scale 1→1.05)
```

**On first appearance:** Button slides in from right (300ms, ease-out). Delay: 2 seconds after page load (non-intrusive).  
**On tap:** Opens `https://wa.me/966XXXXXXXXX?text=[pre-filled message in site language]`.  
**Pre-filled message (Arabic):** `مرحباً، رأيت موقعكم وأريد الاستفسار...`  
**Pre-filled message (English):** `Hello, I visited your website and I'd like to inquire...`

### 5D — Floating Button on Published Site (Desktop)

```
Desktop (1280px+):
┌─────────────────────────────────────────────────────────┐
│  [Site content...]                                      │
│                                                         │
│                                                         │
│                                              ┌────────┐ │
│                                              │  [WA]  │ │ ← fixed
│                                              │ Contact│ │   bottom-right
│                                              │   us   │ │   pill shape
│                                              └────────┘ │   w-auto px-4 h-12
│                                                         │   rounded-full
└─────────────────────────────────────────────────────────┘   bg-[#25D366]
```

Desktop shows an expanded pill with icon + text label. Mobile shows icon-only circle. Both maintain `min-touch-target: 44×44px`.

---

## Feature 6: Opening Hours Component

### 6A — Input UI (Admin Editor)

```
[EN]
┌────────────────────────────────────────────────────────────┐
│  OPENING HOURS — editor section                            │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │ [Toggle ●──────]  Apply same hours every day       │   │
│  │                   (shortcut toggle)                │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  When "same hours" is ON → shows a single time range:      │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Opens at    Closes at                             │   │
│  │  [08:00 ▼]   [22:00 ▼]  (applied to all open days)│   │
│  └────────────────────────────────────────────────────┘   │
│  + [Choose which days are open]                            │
│    (expands day toggles below)                             │
│                                                            │
│  When "same hours" is OFF → per-day schedule:              │
│                                                            │
│  DAY ROWS:                                                 │
│  ┌────────────────────────────────────────────────────┐   │
│  │  [Toggle]  Sunday     السبت    Opens  Closes        │   │
│  │                                [08:00▼] [22:00▼]   │   │
│  ├────────────────────────────────────────────────────┤   │
│  │  [Toggle]  Monday     الاثنين  Opens  Closes        │   │
│  │                                [08:00▼] [22:00▼]   │   │
│  ├────────────────────────────────────────────────────┤   │
│  │  [Toggle]  Tuesday    الثلاثاء Opens  Closes        │   │
│  │                                [08:00▼] [22:00▼]   │   │
│  ├────────────────────────────────────────────────────┤   │
│  │  [Toggle]  Wednesday  الأربعاء Opens  Closes        │   │
│  │                                [08:00▼] [22:00▼]   │   │
│  ├────────────────────────────────────────────────────┤   │
│  │  [Toggle]  Thursday   الخميس   Opens  Closes        │   │
│  │                                [08:00▼] [22:00▼]   │   │
│  ├────────────────────────────────────────────────────┤   │
│  │  [Toggle: OFF]  Friday  الجمعة CLOSED               │   │
│  │  // Closed row: reduced opacity, no time pickers   │   │
│  ├────────────────────────────────────────────────────┤   │
│  │  [Toggle: OFF]  Saturday  السبت  CLOSED             │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  // Toggle ON = blue-600, shows time pickers               │
│  // Toggle OFF = gray-200, time pickers hidden,            │
│  //   row shows "Closed" badge (gray-100 bg)               │
│                                                            │
│  Friday/Weekend note (shown for Saudi businesses):         │
│  ℹ️ Friday is a day off for most Saudi businesses.         │
│     Adjust if your business stays open.                    │
│  (text-xs text-amber-600 mt-2)                             │
└────────────────────────────────────────────────────────────┘
```

**Time pickers:** Custom dropdown showing times in 30-minute increments. Format: `08:00 AM` (English) / `٨:٠٠ ص` (Arabic). Values stored as 24-hour `HH:MM` strings.

**Arabic day names:**

| Day | Arabic |
|-----|--------|
| Sunday | الأحد |
| Monday | الاثنين |
| Tuesday | الثلاثاء |
| Wednesday | الأربعاء |
| Thursday | الخميس |
| Friday | الجمعة |
| Saturday | السبت |

**Default state for Saudi businesses:** Sunday–Thursday open (08:00–22:00), Friday–Saturday closed.

**"Same hours" shortcut behavior:**
- When toggled ON: all day rows collapse except the day toggles. A single "Opens/Closes" pair appears.
- Changes to those times propagate to all enabled days.
- Turning OFF the shortcut restores per-day editing with the previously set values.

### 6B — Rendered Output on Published Site

```
[EN] — published site opening hours block
┌──────────────────────────────────────────────┐
│  Opening Hours                               │
│                                              │
│  Sun – Thu    8:00 AM – 10:00 PM             │
│  Fri          Closed                         │
│  Sat          Closed                         │
│                                              │
│  We're open now  ⬤  (green dot + pulse)      │
│  Closes in 3 hours                           │
│  (text-xs text-green-600)                    │
└──────────────────────────────────────────────┘
```

```
[AR] — RTL published site
┌──────────────────────────────────────────────┐
│                          ساعات العمل         │
│                                              │
│      صباحاً ٨:٠٠ – مساءً ١٠:٠٠   الأحد – الخميس │
│                     مغلق          الجمعة    │
│                     مغلق          السبت     │
│                                              │
│         ⬤  نحن مفتوحون الآن                  │
│            نغلق بعد ٣ ساعات                  │
└──────────────────────────────────────────────┘
```

**"Open now" indicator logic:**
- Compare current local time against today's hours.
- `green-500` pulsing dot = currently open.
- `red-500` static dot = currently closed.
- Text shows time until next open/close.
- Runs on the client (JavaScript Date API), not server-rendered.

---

## Feature 7: Smart Content Suggestions (AI Field Hints)

### Overview

For text fields that benefit from AI assistance (headline, tagline, about text, service descriptions), an AI suggestion appears inline. The suggestion can be accepted, edited, or regenerated.

**Trigger:** User focuses on an eligible text field AND the field is empty (or near-empty, < 20 chars).  
**Eligible fields:** Hero headline, tagline, about section, service names, service descriptions, meta description.

---

### Inline Suggestion Design

```
[EN] — field with AI suggestion visible
┌─────────────────────────────────────────────────────────┐
│  Homepage headline                                      │
│  ┌───────────────────────────────────────────────────┐ │
│  │                                                   │ │
│  │  [Cursor blinking here]                           │ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ✨ Suggestion                                          │
│  ┌───────────────────────────────────────────────────┐ │
│  │  (bg-blue-50, border border-blue-100,             │ │
│  │   rounded-xl, p-3, mt-1)                          │ │
│  │                                                   │ │
│  │  "Professional care you can trust —               │ │
│  │   Rose Garden Clinic, Riyadh"                     │ │
│  │  (text-sm text-gray-700 italic)                   │ │
│  │                                                   │ │
│  │  [Use this]  [Edit it]  [Try another]             │ │
│  │  (text-xs buttons, flex gap-2 mt-2)               │ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Loading state (while AI generates):**

```
┌───────────────────────────────────────────────────────┐
│  ✨ Suggestion                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  (bg-blue-50, border border-blue-100, p-3)   │    │
│  │                                              │    │
│  │  ████████████ ██████████████████             │    │
│  │  ████████████████████████                    │    │
│  │  (shimmer skeleton lines — animate-pulse)    │    │
│  │                                              │    │
│  │  Generating a suggestion...                  │    │
│  │  (text-xs text-gray-400)                     │    │
│  │                                              │    │
│  └──────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────┘
```

**Button actions:**

| Button | Action |
|--------|--------|
| `[Use this]` | Copies suggestion text into the field. Suggestion box disappears. Field updates immediately. |
| `[Edit it]` | Copies suggestion text into the field AND focuses the field (cursor at end). User can edit from there. |
| `[Try another]` | Fires a new API call with `seed++` to get a different suggestion. Shows loading state. |

**Button styling:**
- All three are text-weight buttons (no border, no bg).
- `[Use this]` = `text-blue-600 font-medium`.
- `[Edit it]` = `text-gray-600`.
- `[Try another]` = `text-gray-400`.

**When suggestion appears:**
- Suggestion box slides down from the field (200ms, ease-out) on first API response.
- If user starts typing into the field manually, the suggestion box fades out (150ms) after 500ms of inactivity. It does NOT re-appear unless the field is cleared.

**API call:**
```
POST /api/ai/suggest-content
{
  "field": "hero_headline",
  "businessType": "clinic",
  "businessName": "Rose Garden Clinic",
  "city": "Riyadh",
  "language": "ar" | "en",
  "seed": 0
}
```

```
[AR] — RTL layout
┌─────────────────────────────────────────────────────────┐
│                              العنوان الرئيسي للصفحة    │
│  ┌───────────────────────────────────────────────────┐ │
│  │                           [مؤشر الكتابة]         │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│                                   ✨ اقتراح            │
│  ┌───────────────────────────────────────────────────┐ │
│  │                                                   │ │
│  │  "رعاية احترافية يمكنك الوثوق بها —               │ │
│  │   عيادة الورد، الرياض"                            │ │
│  │                                                   │ │
│  │  [استخدمه]  [عدّله]  [اقتراح آخر]                │ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Feature 8: Mobile PWA Admin

### Overview

The admin dashboard must be fully functional on mobile as a PWA. This means a mobile-optimized dashboard home, quick actions, simplified edit flows, and a bottom navigation bar. The PWA is installable from the browser (shows "Add to Home Screen" prompt after 2 visits).

---

### 8A — Mobile Dashboard Home Screen (Site List)

```
┌─────────────────────────────────┐
│  STATUS BAR (system, iOS/Android)│
├─────────────────────────────────┤
│  HEADER (h-14, bg-white,        │
│          border-b, px-4)        │
│                                 │
│  [≡ Menu]   Safahati   [+ New]  │
│  // Hamburger opens drawer      │
│  // "+ New" = icon button only  │
│  //   on mobile (saves space)   │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  GREETING BANNER (px-4, py-3,   │
│  bg-gradient blue-50 to white)  │
│                                 │
│  Good morning, Ahmed 👋          │
│  (text-sm text-gray-600)        │
│  You have 1 site · 243 visitors │
│  this month                     │
│  (text-xs text-gray-400)        │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  SITE CARD (mx-4, mt-3,         │
│  bg-white rounded-2xl border    │
│  shadow-sm p-4)                 │
│                                 │
│  ┌───────────────────────────┐  │
│  │ [favicon 32px]            │  │
│  │ Rose Garden Clinic  ● Live│  │
│  │ rosegarden.safahati.com   │  │
│  │ (text-xs text-gray-400)   │  │
│  └───────────────────────────┘  │
│                                 │
│  QUICK STATS (3-col grid)       │
│  ┌─────┐  ┌──────┐  ┌───────┐  │
│  │ 243 │  │  12  │  │  4.8  │  │
│  │views│  │clicks│  │rating │  │
│  └─────┘  └──────┘  └───────┘  │
│  (text-lg font-bold gray-900,   │
│   text-xs label gray-400 below) │
│                                 │
│  QUICK ACTIONS (2-col grid)     │
│  ┌────────────────┐┌──────────┐ │
│  │  ✏️ Edit Site  ││ 👁 View  │ │
│  └────────────────┘└──────────┘ │
│  ┌────────────────┐┌──────────┐ │
│  │  📷 Add Photo  ││ 📞 Edit  │ │
│  │                ││ Contact  │ │
│  └────────────────┘└──────────┘ │
│                                 │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  COMPLETENESS CARD (mx-4 mt-3)  │
│  (compact version — see Feat 3) │
│  ⬤───────────────────── 80%    │
│  (progress bar, not ring on mob)│
│  "2 things left" [Complete →]   │
└─────────────────────────────────┘

BOTTOM NAVIGATION BAR:
┌─────────────────────────────────┐
│ (fixed bottom, h-16, bg-white,  │
│  border-t, safe-area-inset-     │
│  bottom)                        │
│                                 │
│  [🏠]     [✏️]     [📊]   [👤] │
│  Home    Edit    Stats  Account │
│  (active blue-600, rest gray-400│
│   text-xs label under each icon)│
└─────────────────────────────────┘
```

**Bottom nav items (max 4):**

| Tab | Icon | Route |
|-----|------|-------|
| Home | Home icon | `/dashboard` |
| Edit | Pencil icon | `/dashboard/sites/[id]/edit` |
| Stats | BarChart icon | `/dashboard/sites/[id]/analytics` |
| Account | User icon | `/dashboard/account` |

---

### 8B — Quick Actions from Mobile

Available quick actions (reachable in ≤2 taps from dashboard home):

| Action | Tap flow |
|--------|----------|
| Edit hero headline | Dashboard → Edit quick action → Hero section auto-scrolled |
| Edit phone number | Dashboard → Edit Contact quick action → Phone field focused |
| Upload photo | Dashboard → Add Photo quick action → System media picker opens |
| View live site | Dashboard → View quick action → Opens site in new tab |
| Share site | Dashboard → site URL → native share sheet (navigator.share API) |

---

### 8C — Edit Contact Info Flow (Mobile)

```
Step 1: Tap "Edit Contact" quick action
┌─────────────────────────────────┐
│  ← Contact Info                 │
├─────────────────────────────────┤
│                                 │
│  Phone / WhatsApp               │
│  ┌───────────────────────────┐  │
│  │ [🇸🇦 +966 ▼] [5xxxxxxxx] │  │
│  └───────────────────────────┘  │
│                                 │
│  Address                        │
│  ┌───────────────────────────┐  │
│  │ [123 Tahlia St, Riyadh  ] │  │
│  └───────────────────────────┘  │
│                                 │
│  Email (optional)               │
│  ┌───────────────────────────┐  │
│  │ [info@rosegarden.com    ] │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │       [Save Changes]      │  │
│  └───────────────────────────┘  │
│  (primary button, h-12, w-full, │
│   sticky at bottom)             │
│                                 │
│  Last saved: 2 minutes ago      │
│  (text-xs text-gray-400 center) │
└─────────────────────────────────┘
```

**Keyboard behavior:** When keyboard appears, sticky "Save" button stays above the keyboard (via `fixed bottom-0` + CSS env(safe-area-inset-bottom) + `paddingBottom` matching keyboard height via `visualViewport` API).

---

### 8D — Upload Photo Flow (Mobile)

```
Step 1: Tap "Add Photo" quick action
→ Triggers system action sheet (native iOS/Android sheet):

┌─────────────────────────────────┐
│  Add Photos to Your Gallery     │
│  (sheet from bottom)            │
├─────────────────────────────────┤
│                                 │
│  [📷 Take a Photo]              │
│  (camera)                       │
├─────────────────────────────────┤
│  [🖼 Choose from Library]       │
│  (photo library, multi-select)  │
├─────────────────────────────────┤
│  [Cancel]                       │
│                                 │
└─────────────────────────────────┘

Step 2: After selection, upload progress:
┌─────────────────────────────────┐
│  ← Add Photos                  │
├─────────────────────────────────┤
│                                 │
│  SELECTED PHOTOS GRID (2-col)   │
│  ┌─────────┐  ┌─────────┐       │
│  │ [thumb] │  │ [thumb] │       │
│  │ ████░░  │  │ ✓ Done  │       │
│  │ 60%...  │  │         │       │
│  └─────────┘  └─────────┘       │
│                                 │
│  2 of 3 photos uploaded         │
│  (text-sm text-gray-500)        │
│                                 │
│  [+ Add More Photos]            │
│                                 │
│  [Done →]  (primary, disabled   │
│             until all uploaded) │
└─────────────────────────────────┘
```

**Upload progress indicator:** Per-photo progress bar below each thumbnail. Circular progress overlay on thumbnail (SVG stroke animation). On completion: green checkmark overlay.

---

## Feature 9: Plain Language Renaming — Admin UI

### Overview

Technical terms visible to non-technical users are renamed to plain language equivalents. Tooltips provide additional context when needed. This table defines the before/after and where each label appears.

---

### Before / After Comparison Table

| Technical Term (Before) | Plain Language (EN) | Plain Language (AR) | Location |
|--------------------------|---------------------|---------------------|----------|
| Template ID | Website style | نمط الموقع | Site creation |
| Component | Section | قسم | Editor sidebar |
| Block | Section | قسم | Editor nav |
| Slug | Website address | عنوان الموقع | Settings |
| Domain | Website address | عنوان الموقع | Settings |
| Subdomain | Your link | رابطك | Dashboard |
| Config / Configuration | Settings | الإعدادات | Dashboard |
| Deploy / Publish | Publish my site | نشر موقعي | Editor button |
| Environment variables | (hidden entirely) | (hidden) | N/A |
| API key | (hidden entirely) | (hidden) | N/A |
| Webhook | (hidden entirely) | (hidden) | N/A |
| Hero section | Top of page | أعلى الصفحة | Editor nav |
| CTA button | Action button | زر التواصل | Field label |
| Meta description | Search engine description | وصف لمحركات البحث | SEO section |
| SEO | How people find you on Google | كيف يجدك الناس على قوقل | Section title |
| Analytics | Visitor statistics | إحصائيات الزوار | Dashboard |
| Template | Style / Design | التصميم | Site creation |
| Schema | (hidden entirely) | (hidden) | N/A |
| JSON | (hidden entirely) | (hidden) | N/A |
| JSONB | (hidden entirely) | (hidden) | N/A |

---

### Labels in Context

```
[EN] — Editor sidebar: Before (technical)
┌──────────────────────────┐
│ COMPONENTS               │
│ ─────────────────────    │
│ ○ hero-template-01       │
│ ● about-block            │
│ ○ service-list-component │
│ ○ contact-form-v2        │
└──────────────────────────┘

[EN] — Editor sidebar: After (plain language)
┌──────────────────────────┐
│ SECTIONS                 │
│ ─────────────────────    │
│ ○ Top of Page            │
│ ● About Us               │
│ ○ Our Services           │
│ ○ Contact Us             │
└──────────────────────────┘
```

```
[EN] — Settings page: Before
┌──────────────────────────────────────┐
│  Subdomain / Slug                    │
│  [rose-garden-clinic         ]       │
│  Your site will be available at:     │
│  rose-garden-clinic.safahati.com     │
└──────────────────────────────────────┘

[EN] — Settings page: After
┌──────────────────────────────────────┐
│  Your website address                │
│  [rose-garden-clinic         ]       │
│  Visitors will reach you at:         │
│  rose-garden-clinic.safahati.com     │
│                                      │
│  [?] What's this?                    │
│  // Tooltip trigger                  │
└──────────────────────────────────────┘
```

---

### Tooltip Pattern

Used when a concept needs brief explanation without overwhelming the main UI.

```
[Trigger — inline "?" icon]
┌───────────────────────────────────────────┐
│  Your website address  [?]                │
└───────────────────────────────────────────┘

[Tooltip — appears on hover/tap of "?"]
┌───────────────────────────────────────────┐
│  ┌─────────────────────────────────────┐  │
│  │  This is the part of your link       │  │
│  │  that comes before ".safahati.com"   │  │
│  │                                      │  │
│  │  Example: if you type "my-shop",     │  │
│  │  your link becomes:                  │  │
│  │  my-shop.safahati.com               │  │
│  │                                      │  │
│  │  Use only letters, numbers,          │  │
│  │  and hyphens (-)                     │  │
│  └─────────────────────────────────────┘  │
│  // bg-gray-900 text-white text-xs        │
│  // rounded-lg p-3 max-w-xs              │
│  // arrow pointing to "?" icon           │
└───────────────────────────────────────────┘
```

**Tooltip behavior:**
- On desktop: appears on hover (200ms delay) and on focus of the `?` button. Disappears on mouse-leave or blur.
- On mobile: appears on tap. Disappears on tap outside.
- Max-width: 280px. Positioned above the trigger, centered if space allows. Falls back to below if near top of screen.
- `role="tooltip"` with `aria-describedby` on the trigger field.
- `z-index: 100`.

```
[AR] — RTL tooltip
┌───────────────────────────────────────────┐
│                    [?] عنوان موقعك الإلكتروني │
└───────────────────────────────────────────┘

[Tooltip — RTL]
┌───────────────────────────────────────────┐
│  ┌─────────────────────────────────────┐  │
│  │  هذا هو الجزء من رابطك الذي يسبق    │  │
│  │  ".safahati.com"                     │  │
│  │                                      │  │
│  │  مثال: إذا كتبت "my-shop"، يصبح      │  │
│  │  رابطك: my-shop.safahati.com         │  │
│  │                                      │  │
│  │  استخدم الحروف والأرقام والشرطة (-)  │  │
│  └─────────────────────────────────────┘  │
└───────────────────────────────────────────┘
```

---

## Feature 10: Auto-Save + Undo Indicator

### Overview

The editor auto-saves every field change after a 2-second debounce. An "Last saved" indicator appears in the top bar. A brief undo window (8 seconds) is available for text field changes. Destructive undo (delete section) has a longer 30-second window.

---

### 10A — "Last Saved" Indicator in Top Bar

```
[EN] — top bar, right side
┌──────────────────────────────────────────────────────────────────┐
│  [← Sites]   Rose Garden Clinic                                  │
│                                      Saved · 2s ago    [Publish] │
│                                      (text-xs text-gray-400)     │
└──────────────────────────────────────────────────────────────────┘
```

**States of the indicator:**

```
State 1 — Typing / unsaved changes:
   ● Saving...
   (text-xs text-amber-600, spinning dot)

State 2 — Just saved (within 10s):
   ✓ Saved just now
   (text-xs text-green-600, checkmark, fades to state 3 after 5s)

State 3 — Saved (>10s ago):
   Saved · 2m ago
   (text-xs text-gray-400)

State 4 — Save failed:
   ⚠ Could not save
   [Retry]
   (text-xs text-red-600, retry link)
```

**Implementation:**
- Indicator lives inside the top bar, positioned `right-[calc(theme-button-width+1rem)]`.
- Updates are reactive to Zustand store's `lastSavedAt` and `isSaving` state.
- Uses `useRelativeTime()` hook to format "2m ago", "just now", etc. Recalculates every 30s.

---

### 10B — Undo Button Placement and Behavior

The Undo button does NOT live in the top bar. It appears as a **toast notification** immediately after a significant change.

```
[EN] — undo toast (text change)
┌──────────────────────────────────────────────────────────────┐
│  TOAST (fixed, bottom-center on desktop, bottom-full on mob) │
│  z-50, mb-4 (above bottom nav on mobile)                     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐      │
│  │  ✓  Headline updated                    [Undo]  ✕ │      │
│  │  (bg-gray-900 text-white rounded-xl px-4 py-3)    │      │
│  │  (flex justify-between items-center min-w-[320px])│      │
│  └────────────────────────────────────────────────────┘      │
│  // Toast auto-dismisses after 8 seconds                     │
│  // Progress bar at bottom of toast depletes over 8s         │
│  // [Undo] = text-blue-400 font-medium                      │
│  // ✕ = dismiss immediately                                  │
└──────────────────────────────────────────────────────────────┘
```

**Toast for section delete (longer undo window):**

```
┌──────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────┐      │
│  │  🗑  "Our Services" section removed    [Undo]  ✕  │      │
│  │  (bg-gray-900, 30-second progress bar at bottom)  │      │
│  └────────────────────────────────────────────────────┘      │
│  // After 30s: section is permanently removed from config    │
│  // Tapping [Undo]: restores section, toast disappears       │
└──────────────────────────────────────────────────────────────┘
```

**Undo behavior by action type:**

| Action | Undo window | Undo result |
|--------|-------------|-------------|
| Text field changed | 8 seconds | Restores previous text value |
| Image replaced | 8 seconds | Restores previous image URL |
| Section reordered | 8 seconds | Reverts section order |
| Section deleted | 30 seconds | Restores section + content |
| Theme color changed | 8 seconds | Reverts color to previous |
| Site published | Not undoable | (no undo — show confirmation dialog instead) |

---

### 10C — Auto-Save Toast Notification

A brief success toast appears once per editing session (not on every save — that would be annoying).

```
[EN] — auto-save toast (first time only per session)
┌──────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────┐      │
│  │  ✓  Your changes are saved automatically  [Got it]│      │
│  └────────────────────────────────────────────────────┘      │
│  // bg-gray-900 text-white                                   │
│  // Auto-dismisses after 5s OR when [Got it] tapped          │
│  // Only shown on the first edit of the first session.       │
│  // Stored in localStorage: "safahati_autosave_intro_shown"  │
└──────────────────────────────────────────────────────────────┘
```

```
[AR]
┌──────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────┐      │
│  │  [حسناً]  تُحفظ تغييراتك تلقائياً  ✓             │      │
│  └────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

---

### 10D — Toast Stacking Behavior

When multiple toasts appear (e.g., undo toast + a new auto-save confirmation), they stack vertically:

```
Bottom of screen:
┌────────────────────────────────────────────────┐
│  ✓  Headline updated                [Undo] ✕  │  ← most recent (top of stack)
└────────────────────────────────────────────────┘
┌────────────────────────────────────────────────┐
│  🗑  Services section removed       [Undo] ✕  │  ← older (below)
└────────────────────────────────────────────────┘
```

- Maximum 3 toasts stacked.
- 4th toast dismisses the oldest automatically.
- Stack grows upward from `bottom-4`.
- Each toast slides in from bottom (200ms, ease-out), slides out downward on dismiss (150ms, ease-in).
- `aria-live="polite"` container wraps the stack for screen reader announcements.

---

## RTL Implementation Notes (applies to all 10 features)

The following CSS and implementation rules apply globally to all RTL (Arabic) layouts:

### CSS Direction

```css
[dir="rtl"] {
  /* Flip logical properties */
  /* Use margin-inline-start/end instead of margin-left/right */
  /* Use padding-inline-start/end */
  /* Use inset-inline-start/end for absolute positioning */
}
```

### Chevron / Arrow Icons

| Direction | LTR value | RTL value |
|-----------|-----------|-----------|
| "Next" / forward | → (ChevronRight) | ← (ChevronLeft) |
| "Back" / previous | ← (ChevronLeft) | → (ChevronRight) |
| Dropdown open | ↓ (ChevronDown) | ↓ (same) |
| Expand / collapse | ↓ / ↑ | ↓ / ↑ (same) |

### Progress Indicators

- RTL step dots fill from **right to left**.
- Progress bars fill from **right to left**.
- Circular progress rings rotate counterclockwise (transform: scaleX(-1) on the SVG).

### Font

- Arabic text uses `Noto Sans Arabic` or `IBM Plex Sans Arabic` (already in Design System).
- Line height for Arabic: 1.8 (more generous than English 1.5, due to diacritics).
- Font size for Arabic: Match English sizes — do not reduce.

### Number Display

- Numbers in Arabic context are displayed in **Eastern Arabic numerals** for time fields (٩:٠٠ ص) and **Western Arabic numerals** for statistics/prices (243 زيارة).
- Use CSS `font-variant-numeric: tabular-nums` on all number displays.

### Form Field Alignment

- Labels: `text-align: start` (respects both LTR and RTL automatically).
- Input text direction: `dir="auto"` on all text inputs (allows mixed content like phone numbers).
- Placeholder: matches input direction.

---

## Interaction State Summary

All interactive elements across these 10 features follow these states:

| State | Visual treatment |
|-------|-----------------|
| Default | As designed |
| Hover (desktop) | `bg-gray-50` on rows; `bg-blue-700` on blue buttons |
| Focus (keyboard) | `ring-2 ring-blue-600 ring-offset-2` |
| Active / Pressed | `scale-[0.97]` transform (100ms), `bg-blue-800` on buttons |
| Disabled | `opacity-50`, `cursor-not-allowed`, `pointer-events: none` |
| Loading | Button shows spinner replacing icon/text; field shows shimmer |
| Error | `border-red-500`, error text below field (`text-sm text-red-600`) |
| Success | Brief `border-green-500` flash (500ms) on field, then reverts |

---

## Responsive Breakpoint Summary

| Breakpoint | Width | Notes |
|------------|-------|-------|
| Mobile S | 375px | Primary design target |
| Mobile L | 430px | iPhone Pro Max — check for extra whitespace |
| Tablet | 768px | Editor switches to 2-panel mode here |
| Desktop | 1024px | Full split-screen editor |
| Desktop L | 1280px | Max-width container enforced at this point |

All wireframes in this document default to 375px. Desktop and tablet variants are described as progressive enhancements.

---

*Document version: 1.0 — April 2026*  
*Author: UI/UX Designer (virtual team role)*  
*For questions: cross-reference with `03-Design-System.md` (tokens) and `02-Wireframes.md` (existing flows)*
