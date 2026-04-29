# Prototype Specifications — Safahati

This document defines the interactive prototypes needed to validate key UX decisions in Safahati before committing to full implementation. Each prototype spec includes: goal, scope, key screens, interactions, transitions, and what it validates/invalidates.

---

## Prototype 1: Onboarding Flow

### Goal
Validate that a first-time Arabic-speaking or English-speaking user can go from registration to first published site with minimal friction and no need for documentation.

### Scope
High-fidelity interactive prototype. Covers: registration → dashboard empty state → new site wizard → editor overview → publish.

### Key Screens

**Screen A: Registration**
- Name, email, password, confirm password
- Language selector (EN / العربية) prominently placed BEFORE the submit button
- Subtle value prop: "Build your website in 2 minutes"

**Screen B: Post-Registration Welcome (Dashboard)**
- Animated welcome banner: fades in over 300ms from y+8 to y=0
- "Welcome, {name}! Let's build your first site."
- Subtext: "You're 3 clicks away from having a website."
- Single primary CTA: "Create My First Site →"
- Below: 3-step "how it works" cards (Name → Template → Publish)

**Screen C: Site Name Step**
- Clean single-field form: site name input + language toggle
- Input auto-focused on mount
- Step indicator: "1 of 2" with a 2-dot progress bar
- Continue button becomes enabled/blue when name is non-empty

**Screen D: Industry Picker**
- "2 of 2" in progress bar
- Back button (← Back) returns to Screen C without clearing name
- 13 industry cards in a 3-col grid (2-col on mobile)
- Cards show: icon, name in both languages, brief description in the selected language, and a section list preview
- Hover state: blue border + subtle shadow + card lifts 2px
- Click triggers "Creating your site..." full-screen loading overlay

**Screen E: Editor (First Launch)**
- Sidebar visible on left
- Full-screen dim overlay with 3 step-by-step highlighted tooltips
- Tooltip 1: Points at sidebar with text "These are your site sections. Click one to edit it."
- Tooltip 2: Points at preview canvas with text "Your live preview updates as you type."
- Tooltip 3: Points at Publish button with text "When you're ready, hit Publish."
- "Skip Tour" + "Next →" buttons
- After step 3: overlay dismisses with fade-out over 200ms

### Transitions

| From | To | Transition |
|---|---|---|
| Registration → Welcome | Route push | Fade in (300ms) |
| Welcome → New Site | Route push | Slide left (300ms ease-out) |
| Step 1 → Step 2 | Component swap | Slide left (250ms) |
| Step 2 → Editor | Route push (after load) | Fade through white (500ms) |
| Tour overlay → Editor | Fade out overlay | 200ms opacity 0 |

### What This Prototype Validates
1. Does the language selection in step 1 correctly set expectations for the Arabic user?
2. Does the 3-step wizard feel fast or tedious? (Test with task timing: target < 90 seconds)
3. Do users understand what the editor is and where to click without the tour?
4. Does the tour help or feel patronizing? (Measure skip rate)
5. Does the empty state on the dashboard communicate enough value to convert to "create site" action?

### Test Scenarios
- **Scenario A:** Arabic-speaking user, chooses "العربية", picks "Clinic", dismisses tour, changes the hero text, publishes.
- **Scenario B:** English-speaking user, chooses "Freelancer", uses the tour, changes nothing, closes editor.
- **Scenario C:** User mistakenly picks wrong industry in step 2, tries to go back and change it.

---

## Prototype 2: Editor Live Preview and Template Picker

### Goal
Validate that non-technical users understand the relationship between editing form fields in the sidebar and seeing changes in the preview canvas. Also validates the template picker redesign (visual thumbnails vs. text buttons).

### Scope
High-fidelity interactive prototype. Covers: editor in edit mode, clicking a section, changing a field, watching the preview update, switching templates via the picker.

### Key Screens

**Screen A: Editor in Edit Mode (section not selected)**
- Sidebar shows section list: Navbar, Hero, Services, Testimonials, Contact, Footer
- Each section has a name, template label, and action icons (eye, up, down, trash)
- GripVertical icon is removed (pending drag-and-drop implementation)
- Preview canvas shows full rendered site with subtle blue hover rings on each section

**Screen B: Section Selected (Hero)**
- Clicking the Hero section in the canvas OR in the sidebar list triggers selection
- Sidebar transitions from section list to content editor panel (slide left, 200ms)
- Preview canvas keeps a persistent blue ring on the selected section
- Content editor shows:
  - Template picker (horizontal scroll row of thumbnail cards)
  - Bilingual heading fields (EN/AR tabs or side-by-side)
  - CTA fields
  - Badge field

**Screen C: Live Typing Update**
- User types in the "Heading (EN)" field
- Preview canvas updates in real-time as user types (debounced 150ms)
- The Hero section in the canvas highlights briefly (flash animation: blue ring pulse once) to indicate which part of the preview just changed
- This flash should NOT happen on every keystroke — only on blur or after a 500ms typing pause

**Screen D: Template Switcher**
- Template picker shows horizontal scroll row of thumbnail cards
- Each card: 80px × 64px color block thumbnail, template name below
- Active template: blue border ring
- Clicking a different template: preview canvas fades out (150ms) → new template renders → fades in (150ms)
- The fade prevents jarring snap between very different layouts

**Screen E: Back to Section List**
- "← Back to sections" button in the content editor header
- Sidebar slides right back to section list (200ms)
- Blue ring clears from the canvas after 300ms (delayed clear)

### Transitions

| Action | Animation |
|---|---|
| Select section | Sidebar slides left (200ms ease-out); canvas section gains ring (instant) |
| Deselect / back | Sidebar slides right (200ms ease-in); ring fades (300ms, delayed) |
| Switch template | Canvas fades out/in (150ms each) |
| Hover section in canvas | Blue outline ring appears (instant); no delay |
| Field update → canvas | Debounced re-render (150ms); updated section flashes ring once |

### Interaction States

| State | Visual |
|---|---|
| Section not selected | Section list visible; canvas shows hover rings |
| Section selected, content tab | Content form visible; canvas shows selected ring |
| Section selected, theme tab | Theme panel visible; no canvas section ring |
| Preview mode | Sidebar hidden; canvas full width; no hover rings |

### What This Prototype Validates
1. Do users understand that clicking a section in the sidebar opens its editor? (Many users may only try to click the canvas.)
2. Do users understand that the form fields map to the canvas preview? (Add a tooltip "Changes appear in the preview →" for first-time users.)
3. Does the template switcher thumbnail approach improve selection confidence vs. text-only buttons?
4. Is the back navigation (← Back to sections) obvious enough, or do users get "stuck" in the content editor?
5. Does the live typing update feel responsive or laggy at 150ms debounce?

### Test Tasks
1. "Change the hero heading text to your business name."
2. "Switch the hero to a different template style."
3. "Add a new section to the page."
4. "Change the primary color of the site."

---

## Prototype 3: Mobile Editor

### Goal
Validate a bottom-sheet based editor layout for mobile devices (375px viewport). Determine whether mobile editing is feasible for simple content changes, or whether mobile should be read-only (preview only).

### Scope
Mid-fidelity interactive prototype on mobile frame (iPhone 14 Pro size). Covers: dashboard on mobile, opening the editor, editing text, switching sections.

### Key Screens

**Screen A: Mobile Dashboard**
- Single-column card list
- Cards: thumbnail area (h-28), status badge, name, industry/language, actions
- Action buttons: "Edit" (full-width primary), then "View/Preview" + "···" (kebab) in a row below
- Header: Logo + Avatar only; "New Site" is a floating action button (FAB) in bottom right

**Screen B: Mobile Editor — Initial State**
- Full-screen preview canvas
- Minimal top bar: [← Back] [Save] [Publish] in a single row
- Bottom tab bar: [Sections] [Theme]
- No sidebar visible

**Screen C: Tapping a Section (Canvas)**
- User taps the Hero section in the canvas
- Bottom sheet slides up from bottom (400ms ease-out) to 60% viewport height
- Sheet contains:
  - Drag handle at top
  - Section name ("Hero") + template name
  - Template picker (horizontal scroll, same as desktop)
  - Bilingual fields (scrollable within the sheet)
- Backdrop: semi-transparent overlay (opacity 0.3, bg-black)

**Screen D: Bottom Sheet Interactions**
- Swipe up: sheet expands to 90% viewport height
- Swipe down: sheet collapses back to closed
- Tapping backdrop: sheet closes
- Sheet default height: 65% viewport
- Max height: 90% viewport
- Sheet has scroll for long content (overflow-y-auto in the content area)

**Screen E: Theme Panel on Mobile**
- Tapping the "Theme" bottom tab opens a full-screen modal (not a bottom sheet)
- Full-screen modal: back button, preset picker, color groups, font selector
- Color pickers: use a simplified 2-column grid (no color input swatch — that native color picker UX is difficult on mobile)

### Transitions

| Action | Animation |
|---|---|
| Open bottom sheet | Slides up from below (400ms cubic-bezier(0.32, 0.72, 0, 1)) |
| Close bottom sheet | Slides down (300ms ease-in) |
| Switch between sections | Sheet content cross-fades (150ms) |
| Open theme modal | Scale+fade from bottom-center (350ms) |

### What This Prototype Validates
1. Is the bottom sheet comfortable to interact with (touch targets, scroll behavior)?
2. Can a user successfully change hero text and save on mobile within 3 minutes?
3. Does the "Sections" tab label communicate that it opens section list AND editing?
4. Is the preview canvas useful without a sidebar, or do users feel "blind" about what they can edit?
5. Is the FAB (floating action button) for "New Site" discoverable on mobile?

### Decision Gate
If users complete the text editing task on mobile with ≥ 70% success rate, proceed to implement the mobile editor. If success rate is below 70%, consider making the mobile editor read-only (preview + publish/unpublish only) with a "Full editing requires a desktop" message.

---

## Prototype 4: Template Browser (Add Component Flow)

### Goal
Validate a redesigned "Add Component" experience that replaces the current text-only dropdown-within-sidebar with a proper modal that shows visual template previews.

### Scope
Mid-fidelity prototype covering the "Add" button → modal → template selection → section appears in editor.

### Key Screens

**Screen A: Trigger Point**
- The "+ Add" button in the section list sidebar
- Clicking opens the Add Component modal (not an inline panel)

**Screen B: Add Component Modal**
- Full modal (not full-screen), max-width 960px, centered
- Header: "Add a Section" + [X] close button
- Left column (200px): Category list
  - Navigation
  - Header & Hero
  - Content
  - Social Proof
  - Conversion
  - Informational
- Right column: Template grid (2 columns on md, 3 on lg)
- Each template card: 200px wide, thumbnail (aspect-video), name, description
- Active category: highlighted blue in left column
- Hovering a template card: scale 1.02, blue ring
- Clicking a template: card shows checkmark → modal shows [Confirm: Add Hero 03 →] CTA

**Screen C: Template Thumbnails**
- Phase 1 implementation: static color blocks (primary color fill + block type icon)
- Phase 2: actual screenshots of each template rendered at 1280×800, scaled to thumbnail

**Screen D: Template Detail on Hover**
- Hovering a template card shows a tooltip with:
  - Larger preview (300px wide)
  - Template name and description
  - List of configurable fields

### Transitions

| Action | Animation |
|---|---|
| Modal open | Scale from 0.95 to 1.0 + fade in (250ms) |
| Modal close | Scale to 0.95 + fade out (150ms) |
| Category switch | Grid cross-fades (100ms) |
| Template confirm | Card scales up 1.05, brief pulse; modal closes (200ms) |
| Section appears in list | Slides down into section list with highlight flash (300ms) |

### What This Prototype Validates
1. Do users find the category navigation useful or do they scan the full grid?
2. Is the two-column (category + templates) modal pattern learnable for non-technical users?
3. Do template thumbnails significantly improve selection confidence vs. text buttons?
4. Is "Confirm: Add [Template Name]" clearer than directly adding on click?

---

## Prototype Testing Protocol

### Target Users
- 5–8 participants per prototype
- Mix of: 2 Arabic speakers, 2 English speakers, 1–2 bilingual
- Business type: 1 clinic owner, 1 freelancer, 1 SME retailer, 1 agency PM
- Device: Desktop (Chrome) + Mobile (iPhone) depending on prototype

### Metrics per Prototype

| Metric | Measurement Method |
|---|---|
| Task completion rate | % of users who complete the task successfully |
| Task time | Stopwatch from task start to first correct completion |
| Error rate | Number of wrong clicks or backtracking per task |
| Satisfaction (SUS) | System Usability Scale (10-question post-test survey) |
| RTL accuracy | Specifically observe Arabic users — does RTL layout match expectations? |

### Minimum Success Thresholds
- Task completion rate ≥ 80% before shipping any feature to production
- Time on "create first site" task ≤ 3 minutes
- SUS score ≥ 70 (above "OK", approaching "Good")

---

## Figma File Structure

The prototypes should be organized in Figma as follows:

```
Safahati Design System
├── 🎨 Foundations
│   ├── Colors (admin + client site tokens)
│   ├── Typography (scale + Arabic notes)
│   ├── Spacing + Radius
│   └── Icons (Lucide set)
│
├── 🧩 Components
│   ├── Buttons (all variants + states)
│   ├── Badges (status, outline, custom)
│   ├── Cards (site card, industry card, feature card)
│   ├── Forms (input, textarea, label, error state)
│   ├── Modal / Dialog
│   └── Bottom Sheet
│
├── 📱 Prototypes
│   ├── P1 — Onboarding Flow (Desktop + Mobile)
│   ├── P2 — Editor Live Preview (Desktop)
│   ├── P3 — Mobile Editor
│   └── P4 — Template Browser Modal
│
└── 🌐 RTL Variants
    ├── Dashboard (Arabic)
    ├── New Site Wizard (Arabic)
    └── Editor (Arabic preview)
```

Each component should have states defined as Figma variants: Default / Hover / Active / Disabled / Focus / Error.
