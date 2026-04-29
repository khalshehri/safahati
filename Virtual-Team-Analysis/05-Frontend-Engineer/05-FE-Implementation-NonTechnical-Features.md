# Frontend Implementation Plan — Non-Technical User Features
## Safahati Platform

**Prepared by:** Frontend Engineer (Virtual Team)
**Date:** April 2026
**Audience:** Frontend developers implementing these features
**Scope:** 14 non-technical user epics, 29 user stories (US-01 through US-29)
**Depends on:**
- `06-Backend-Engineer/05-SA-Architecture-NonTechnical-Features.md` — API contracts, ADRs
- `04-UI-UX-Designer/05-NonTechnical-UX-Design.md` — wireframes, UX specs
- `03-Business-Analyst/05-NonTechnical-User-Stories.md` — acceptance criteria

> **How to use this document:** A developer assigned to Sprint 1 should read Section A (features in Sprint 1), Section B (Zustand stores), Section D.1 (wizard skeleton code), and Section F (RTL checklist). They can start coding the same day.

---

## Table of Contents

- [A. Component Architecture (Per Feature)](#a-component-architecture-per-feature)
- [B. Zustand Store Design](#b-zustand-store-design)
- [C. Sprint-by-Sprint Implementation Plan](#c-sprint-by-sprint-implementation-plan)
- [D. Key Implementation Details](#d-key-implementation-details)
- [E. Reusable UI Primitives](#e-reusable-ui-primitives)
- [F. RTL Implementation Checklist](#f-rtl-implementation-checklist)

---

## A. Component Architecture (Per Feature)

### Feature 1 — "Build in 5 Minutes" Wizard

**Route:** `/dashboard/new` (replaces the existing 2-step `page.tsx`)
**Trigger:** First-time site creation button on dashboard
**US Coverage:** US-01, US-02, US-03

#### Component Tree

```
src/components/wizard/
├── WizardShell.tsx              # Layout shell: progress dots, back/skip/next controls
├── WizardStep.tsx               # Generic step wrapper: icon, step label, headline, hint
├── WizardProgressDots.tsx       # 8-dot indicator, filled/current/upcoming states
├── steps/
│   ├── Step1BusinessType.tsx    # Single-select card grid (13 industry options)
│   ├── Step2BusinessName.tsx    # Text input with live preview chip
│   ├── Step3Location.tsx        # Searchable city dropdown + optional neighborhood
│   ├── Step4Contact.tsx         # Phone input (country prefix) + WhatsApp toggle
│   ├── Step5Logo.tsx            # File upload with drag-drop, skip-able
│   ├── Step6Color.tsx           # Color list + mini preview strip
│   ├── Step7Description.tsx     # Textarea + AI suggest link + char counter
│   └── Step8Language.tsx        # Radio list + "Build My Site" CTA
├── WizardComplete.tsx           # "Your Site Is Ready" final screen with confetti
├── WizardLoadingScreen.tsx      # "Building your site..." animated progress message
└── hooks/
    ├── useWizardSync.ts         # Hybrid server+localStorage draft sync (ADR-001)
    └── useWizardNavigation.ts   # Step transitions, validation gate, keyboard nav
```

#### Props Interfaces

```typescript
// WizardShell.tsx
interface WizardShellProps {
  currentStep: number;        // 1–8
  totalSteps: number;         // 8
  canGoBack: boolean;
  canSkip: boolean;           // only steps 5 and 7
  onBack: () => void;
  onSkip: () => void;
  children: React.ReactNode;
}

// WizardStep.tsx
interface WizardStepProps {
  icon: React.ComponentType<{ className?: string }>;
  stepNumber: number;
  totalSteps: number;
  headline: string;           // bilingual — caller passes locale-correct string
  hint?: string;
  children: React.ReactNode;
  onContinue: () => void;
  continueDisabled?: boolean;
  continueLoading?: boolean;
  continueLabel?: string;     // defaults to "Continue →" / "التالي ←"
}

// Step1BusinessType.tsx
interface Step1Props {
  selected: WizardIndustry | null;
  onChange: (industry: WizardIndustry) => void;
}

// Step2BusinessName.tsx
interface Step2Props {
  value: string;
  onChange: (name: string) => void;
  error?: string;
}

// Step3Location.tsx
interface Step3Props {
  city: string;
  neighborhood?: string;
  onCityChange: (city: string) => void;
  onNeighborhoodChange: (n: string) => void;
}

// Step4Contact.tsx
interface Step4Props {
  phone: string;
  countryCode: string;         // e.g. "+966"
  whatsappEnabled: boolean;
  onPhoneChange: (phone: string) => void;
  onCountryCodeChange: (code: string) => void;
  onWhatsappToggle: (enabled: boolean) => void;
}

// Step5Logo.tsx
interface Step5Props {
  logoUrl: string | null;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  uploading: boolean;
}

// Step6Color.tsx
interface Step6Props {
  selectedColor: string;       // hex
  selectedColorName: string;
  businessName: string;        // for mini preview
  onChange: (hex: string, name: string) => void;
}

// Step7Description.tsx
interface Step7Props {
  value: string;
  onChange: (text: string) => void;
  onAISuggest: () => Promise<void>;
  aiLoading: boolean;
  maxLength: number;           // 120
}

// Step8Language.tsx
interface Step8Props {
  selected: WizardLanguagePreference;
  onChange: (pref: WizardLanguagePreference) => void;
  onBuild: () => Promise<void>;
  building: boolean;
}

// WizardComplete.tsx
interface WizardCompleteProps {
  siteName: string;
  siteSlug: string;
  siteUrl: string;
}
```

#### State Management

| State | Location | Reason |
|-------|----------|--------|
| `currentStep` | `useWizardStore` (Zustand) | Shared across shell + steps |
| `answers` (all 8 fields) | `useWizardStore` (Zustand) | Single source of truth |
| `isBuilding` | `useWizardStore` | Controls loading screen |
| `draftId` / `draftSyncedAt` | `useWizardStore` | ADR-001 hybrid sync |
| Step validation error (inline) | `useState` inside each step | Local, ephemeral |
| Logo upload progress | `useState` in Step5Logo | Local upload state |
| AI suggestion for step 7 | `useAIStore` | Shared with editor AI |
| `createdSite` (post-build) | `useWizardStore` | Used by WizardComplete |

**Persistence config:** `useWizardStore` is NOT persisted to localStorage directly. The `useWizardSync` hook handles the hybrid sync described in ADR-001.

#### Route Structure

The existing `/dashboard/new/page.tsx` (currently 2-step) is replaced entirely. The wizard runs as a **full-page experience** — no dashboard sidebar visible during the wizard flow.

```
src/app/(dashboard)/dashboard/new/
├── page.tsx              # Entry point: checks for existing draft → starts wizard
└── layout.tsx            # Minimal layout: no sidebar, just wizard chrome
```

---

### Feature 2 — Launch Celebration Screen

**Route:** Triggered from `/dashboard/[siteId]/editor` after publish action
**US Coverage:** US-20, US-21

#### Component Tree

```
src/components/publish/
├── LaunchCelebration.tsx        # Full-screen overlay controller
├── ConfettiLayer.tsx            # canvas-confetti wrapper (absolute, pointer-events-none)
├── CelebrationModal.tsx         # Slide-up modal with URL + share buttons
├── SharePanel.tsx               # WhatsApp, Instagram, Copy Link buttons
└── hooks/
    └── useCelebrationGate.ts    # Checks localStorage to prevent re-showing
```

#### Props Interfaces

```typescript
// LaunchCelebration.tsx
interface LaunchCelebrationProps {
  siteId: string;
  siteSlug: string;
  siteUrl: string;             // e.g. "https://my-shop.safahati.com"
  siteName: string;
  locale: "ar" | "en";
  onDismiss: () => void;
}

// CelebrationModal.tsx
interface CelebrationModalProps {
  siteUrl: string;
  siteName: string;
  locale: "ar" | "en";
  onDismiss: () => void;
}

// SharePanel.tsx
interface SharePanelProps {
  siteUrl: string;
  locale: "ar" | "en";
  compact?: boolean;           // true = dashboard persistent share, false = celebration
}
```

#### State Management

| State | Location |
|-------|----------|
| `isVisible` | `useState` in `LaunchCelebration` |
| `copied` (copy link button state) | `useState` in `SharePanel` |
| `celebrationShown_[siteId]` | `localStorage` (checked by `useCelebrationGate`) |

#### Where It Lives

- The `<LaunchCelebration>` component is mounted in the editor page `src/app/(dashboard)/dashboard/[siteId]/editor/page.tsx`.
- It renders conditionally when the publish API returns `isFirstPublish: true`.
- The `useCelebrationGate` hook immediately marks it as shown in localStorage so it never re-fires.

---

### Feature 3 — Completeness Meter Card

**Route:** `/dashboard` (main dashboard home)
**US Coverage:** US-14, US-15

#### Component Tree

```
src/components/dashboard/
├── CompletenessMeterCard.tsx    # Full card with ring + checklist
├── CompletionRing.tsx           # SVG progress ring (see Section E)
├── CompletenessChecklistItem.tsx # Single row: icon + label + action link
└── hooks/
    └── useCompleteness.ts       # Fetches GET /api/sites/[siteId]/completeness
```

#### Props Interfaces

```typescript
// CompletenessMeterCard.tsx
interface CompletenessMeterCardProps {
  siteId: string;
  locale: "ar" | "en";
  compact?: boolean;            // true = mobile progress bar variant
}

// CompletionRing.tsx — see Section E for full spec

// CompletenessChecklistItem.tsx
interface CompletenessChecklistItemProps {
  id: string;
  labelAr: string;
  labelEn: string;
  priority: "critical" | "important" | "optional";
  editPath: string;
  visibleToVisitors: boolean;
  completed: boolean;
  locale: "ar" | "en";
  siteId: string;
  onNavigate: (path: string) => void;
}
```

#### State Management

All server state via TanStack Query:

```typescript
// src/components/dashboard/hooks/useCompleteness.ts
import { useQuery } from "@tanstack/react-query";

export function useCompleteness(siteId: string) {
  return useQuery({
    queryKey: ["completeness", siteId],
    queryFn: () =>
      fetch(`/api/sites/${siteId}/completeness`).then((r) => r.json()),
    staleTime: 1000 * 60 * 5,   // 5 min — matches Redis TTL
    refetchOnWindowFocus: true,
  });
}
```

#### Where It Lives

Rendered in `src/app/(dashboard)/dashboard/page.tsx`, after the site header card and before the analytics section.

---

### Feature 4 — Live Preview Split-Screen Editor

**Route:** `/dashboard/[siteId]/editor`
**US Coverage:** US-22, US-23

#### Component Tree

```
src/components/editor/
├── EditorShell.tsx              # Top bar + responsive layout orchestrator
├── EditorTopBar.tsx             # Back link, site name, autosave indicator, publish button
├── EditorSidebar.tsx            # Section navigation + form fields panel (left/right)
├── SectionNavList.tsx           # Vertical list of sections (clickable, highlights active)
├── SectionChips.tsx             # Mobile horizontal scroll chips
├── SplitPreview.tsx             # Preview panel with device toggle (see Section E)
├── PreviewIframe.tsx            # The iframe element + loading overlay
├── DeviceToggle.tsx             # Desktop/Tablet/Mobile icon buttons
└── MobileEditorTabs.tsx         # Edit | Preview tab bar for <768px
```

#### Props Interfaces

```typescript
// EditorShell.tsx
interface EditorShellProps {
  siteId: string;
  locale: "ar" | "en";
}

// SplitPreview.tsx — see Section E

// PreviewIframe.tsx
interface PreviewIframeProps {
  siteId: string;
  previewToken: string;
  deviceWidth: 390 | 768 | null;  // null = full panel width
  isLoading: boolean;
  onLoad: () => void;
}

// DeviceToggle.tsx
interface DeviceToggleProps {
  current: "mobile" | "tablet" | "desktop";
  onChange: (device: "mobile" | "tablet" | "desktop") => void;
}
```

#### State Management

```typescript
// All editor-level state lives in useEditorStore (see Section B)
// Preview-specific local state:
const [previewDevice, setPreviewDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");
const [isPreviewLoading, setPreviewLoading] = useState(false);
const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit"); // mobile only
```

#### Where It Lives

The entire feature lives in:
```
src/app/(dashboard)/dashboard/[siteId]/editor/
├── page.tsx            # Mounts EditorShell
└── [sectionId]/
    └── page.tsx        # Deep-links to a specific section (for completeness meter)
```

---

### Feature 5 — Auto-Save + Undo Indicator

**Route:** Editor (same as Feature 4)
**US Coverage:** US-24, US-25

#### Component Tree

```
src/components/editor/
├── AutoSaveIndicator.tsx        # 4-state badge in top bar (see Section E)
└── UndoToast.tsx                # Dismissable toast with countdown (see Section E)
```

#### Props Interfaces

```typescript
// AutoSaveIndicator.tsx — see Section E

// UndoToast.tsx — see Section E
```

#### State Management

All lives in `useEditorStore`:
- `autoSaveStatus: "idle" | "saving" | "saved" | "error"`
- `lastSavedAt: Date | null`
- `undoStack: EditorSnapshot[]`
- `redoStack: EditorSnapshot[]`

See Section B for the full store design.

---

### Feature 6 — Template Switching

**Route:** `/dashboard/[siteId]/editor/templates`
**US Coverage:** US-16, US-17

#### Component Tree

```
src/components/editor/
├── TemplateSwitcher.tsx         # Gallery overlay triggered from editor
├── TemplateCard.tsx             # Card with thumbnail, name, "Current" badge
├── TemplatePreviewModal.tsx     # Full-screen preview with device toggle + nav arrows
└── TemplateSwitchConfirm.tsx    # Confirmation dialog before applying
```

#### Props Interfaces

```typescript
// TemplateSwitcher.tsx
interface TemplateSwitcherProps {
  siteId: string;
  currentTemplateId: string;
  industry: string;
  locale: "ar" | "en";
  onClose: () => void;
  onApplied: () => void;
}

// TemplateCard.tsx
interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    nameAr: string;
    thumbnailUrl: string;
    industry: string;
  };
  isCurrent: boolean;
  onPreview: () => void;
  onSelect: () => void;
}

// TemplatePreviewModal.tsx
interface TemplatePreviewModalProps {
  siteId: string;
  templateId: string;
  templateName: string;
  locale: "ar" | "en";
  onApply: () => void;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}
```

#### State Management

```typescript
// Local state only for the switcher UI:
const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
const [confirmOpen, setConfirmOpen] = useState(false);
const [applying, setApplying] = useState(false);
```

The actual template switch is a `PUT /api/sites/[siteId]/template` API call that handles data migration server-side.

---

### Feature 7 — Plain Language Renaming

**No new components.** This is a label map file and a translation key discipline. The implementation is a single source-of-truth file:

```
src/lib/plain-language.ts        # Label map: technical key → plain AR + EN
```

```typescript
// src/lib/plain-language.ts

export const PLAIN_LABELS = {
  // Section navigation
  "hero":          { ar: "أعلى الصفحة",       en: "Top of Page" },
  "about":         { ar: "من نحن",             en: "About Us" },
  "services":      { ar: "خدماتنا",            en: "Our Services" },
  "gallery":       { ar: "معرض الصور",         en: "Photo Gallery" },
  "contact":       { ar: "تواصل معنا",         en: "Contact Us" },
  "opening-hours": { ar: "مواعيد العمل",       en: "Opening Hours" },
  "team":          { ar: "فريق العمل",         en: "Our Team" },
  "testimonials":  { ar: "آراء العملاء",       en: "Customer Reviews" },
  "faq":           { ar: "الأسئلة الشائعة",    en: "FAQ" },
  "navbar":        { ar: "شريط التنقل",        en: "Navigation" },
  "footer":        { ar: "أسفل الصفحة",        en: "Footer" },

  // Settings & config fields
  "slug":          { ar: "رابط موقعك",         en: "Your website address" },
  "template":      { ar: "تصميم الموقع",       en: "Website style" },
  "theme":         { ar: "المظهر",             en: "Appearance" },
  "config":        { ar: "الإعدادات",          en: "Settings" },
  "status_draft":  { ar: "مسودة",             en: "Draft" },
  "status_published": { ar: "منشور",          en: "Live" },
  "cta":           { ar: "زر التواصل",         en: "Action button" },
  "meta_description": { ar: "وصف محركات البحث", en: "Search engine description" },
  "seo":           { ar: "كيف يجدك الناس على قوقل", en: "How people find you on Google" },
  "analytics":     { ar: "إحصائيات الزوار",   en: "Visitor statistics" },

  // Actions
  "deploy":        { ar: "انشر موقعي",         en: "Publish my site" },
  "publish":       { ar: "انشر",               en: "Publish" },
  "autosave":      { ar: "تم الحفظ تلقائياً",  en: "Auto-saved" },
} as const;

export type PlainLabelKey = keyof typeof PLAIN_LABELS;

export function getLabel(key: PlainLabelKey, locale: "ar" | "en"): string {
  return PLAIN_LABELS[key][locale];
}

// Tooltip explanations for fields that need clarification
export const TOOLTIPS: Record<string, { ar: string; en: string }> = {
  "slug": {
    ar: "هذا هو الجزء من رابطك الذي يسبق \".safahati.com\". مثال: إذا كتبت \"my-shop\"، يصبح رابطك: my-shop.safahati.com",
    en: "This is the part of your link before \".safahati.com\". Example: type \"my-shop\" and your link becomes my-shop.safahati.com",
  },
  "meta_description": {
    ar: "هذا النص يظهر تحت اسم موقعك في نتائج جوجل. اجعله وصفاً مختصراً في جملة أو جملتين.",
    en: "This text appears under your site name in Google results. Keep it to one or two sentences.",
  },
};
```

**Enforcement rule:** All editor sidebar labels, section names, button text, and error messages must reference `PLAIN_LABELS` or the i18n locale file. No hardcoded strings like "hero-template-01", "component", "block", "config", "slug", "deploy" anywhere in user-facing JSX.

---

### Feature 8 — Smart Content Suggestions / "Help Me Write This"

**Route:** Editor (embedded per-field)
**US Coverage:** US-06, US-07, US-10, US-11

#### Component Tree

```
src/components/editor/ai/
├── AISuggestionBox.tsx          # Suggestion display with 3 action buttons (see Section E)
├── AIHelpMeWriteButton.tsx      # "✨ ساعدني في الكتابة" trigger button
├── AIToneSelector.tsx           # 4 tone chips: Professional/Friendly/Creative/Simple
├── AILoadingShimmer.tsx         # Skeleton lines during generation
└── hooks/
    └── useFieldSuggestion.ts   # Per-field streaming suggestion hook
```

#### Props Interfaces

```typescript
// AIHelpMeWriteButton.tsx
interface AIHelpMeWriteButtonProps {
  fieldType: AISuggestFieldType;
  siteId: string;
  hasExistingContent: boolean;   // changes label to "Improve this text"
  locale: "ar" | "en";
  onTrigger: () => void;
  loading: boolean;
}

// AISuggestionBox.tsx — see Section E

// AIToneSelector.tsx
interface AIToneSelectorProps {
  selected: AITone;
  onChange: (tone: AITone) => void;
  locale: "ar" | "en";
}

type AITone = "professional" | "friendly" | "creative" | "simple";
```

#### State Management

Lives in `useAIStore` (see Section B). Key design: suggestions are cached per `fieldType + siteId + seed` so "Try Another" increments seed rather than sending duplicate requests.

---

### Feature 9 — Duplicate & Translate

**Route:** `/dashboard/[siteId]/editor/settings/language`
**US Coverage:** US-18, US-19

#### Component Tree

```
src/components/editor/ai/
├── TranslateAllButton.tsx       # "ترجم إلى الإنجليزية" CTA with confirm dialog
├── TranslationProgressBar.tsx   # Per-section progress during translation job
├── TranslationReviewMode.tsx    # Side-by-side AR/EN comparison UI
├── TranslationFieldRow.tsx      # Single field: AR original | EN editable + Approve badge
└── hooks/
    └── useTranslationJob.ts    # Polls GET /api/ai/translate/[jobId]
```

#### Props Interfaces

```typescript
// TranslationProgressBar.tsx
interface TranslationProgressBarProps {
  sectionsTotal: number;
  sectionsCompleted: number;
  currentSection: string;
  estimatedSeconds: number;
}

// TranslationReviewMode.tsx
interface TranslationReviewModeProps {
  siteId: string;
  locale: "ar" | "en";
  onConfirm: () => void;
  onCancel: () => void;
}

// TranslationFieldRow.tsx
interface TranslationFieldRowProps {
  fieldKey: string;
  originalText: string;         // Arabic source
  translatedText: string;       // AI-generated English
  status: "pending" | "approved" | "edited";
  onApprove: () => void;
  onEdit: (newText: string) => void;
}
```

#### State Management

```typescript
// useTranslationJob.ts — polling with TanStack Query
export function useTranslationJob(jobId: string | null) {
  return useQuery({
    queryKey: ["translation-job", jobId],
    queryFn: () =>
      fetch(`/api/ai/translate/${jobId}`).then((r) => r.json()),
    enabled: !!jobId,
    refetchInterval: (data) =>
      data?.status === "in_progress" ? 2000 : false,
  });
}
```

---

### Feature 10 — WhatsApp Floating Button (Published Site)

**Route:** Published site renderer `src/app/(site)/sites/[slug]/page.tsx`
**US Coverage:** US-04, US-05

#### Component Tree

```
src/components/blocks/whatsapp-button/
├── WhatsAppFloatingButton.tsx   # Client component, fixed positioning
└── whatsapp-button-template.tsx # Block template registered in registry
```

#### Props Interfaces

```typescript
// WhatsAppFloatingButton.tsx
interface WhatsAppFloatingButtonProps {
  phone: string;               // E.164 format: "+966501234567"
  labelAr: string;             // "راسلنا على واتساب"
  labelEn: string;             // "Message us on WhatsApp"
  locale: "ar" | "en";
  position: "bottom-right" | "bottom-left";
  prefilledMessage?: string;
}
```

#### Implementation Notes

- This is a **`"use client"`** component — it cannot be server-rendered because it depends on scroll position and animation timing.
- It is injected into every published site page when `site.whatsapp` is non-null and `config.whatsapp.enabled === true`.
- The button appears after a 2-second delay (CSS animation-delay or `useEffect` + `setTimeout`).
- On desktop: pill shape (`rounded-full px-4 h-12`) with icon + text. On mobile: circle only (`w-14 h-14 rounded-full`).
- The `href` is built as: `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`.

---

### Feature 11 — Opening Hours Component

**Route:** Editor section + published site renderer
**US Coverage:** US-12, US-13

#### Component Tree

```
src/components/blocks/opening-hours/
├── OpeningHoursEditor.tsx       # Admin editor: day toggles + time pickers
├── DayRow.tsx                   # Single day row: toggle + day name + time pickers
├── TimeRangePicker.tsx          # Opens/Closes pair (see Section E)
├── SameHoursShortcut.tsx        # "Apply same hours every day" toggle + single range
├── OpeningHoursDisplay.tsx      # Published site renderer
└── OpenNowBadge.tsx             # Client-side "Open Now" / "Closed" indicator
```

#### Props Interfaces

```typescript
// OpeningHoursEditor.tsx
interface OpeningHoursEditorProps {
  siteId: string;
  locale: "ar" | "en";
  initialSchedule?: OpeningHoursConfig;
  timezone: string;
  onSave: (config: OpeningHoursConfig) => Promise<void>;
}

// DayRow.tsx
interface DayRowProps {
  day: WeekDay;            // "sunday" | "monday" | ... | "saturday"
  isOpen: boolean;
  openTime: string;        // "08:00" (24h HH:MM)
  closeTime: string;
  pastMidnight: boolean;
  locale: "ar" | "en";
  onToggle: (isOpen: boolean) => void;
  onTimeChange: (type: "open" | "close", time: string) => void;
  onPastMidnightToggle: (v: boolean) => void;
}

// OpeningHoursDisplay.tsx (published site)
interface OpeningHoursDisplayProps {
  schedule: OpeningHoursConfig;
  timezone: string;
  locale: "ar" | "en";
}

// OpenNowBadge.tsx
interface OpenNowBadgeProps {
  schedule: OpeningHoursConfig;
  timezone: string;
  locale: "ar" | "en";
}
```

#### State Management

```typescript
// Local state in OpeningHoursEditor — no Zustand needed for this component
const [schedule, setSchedule] = useState<OpeningHoursConfig>(initialSchedule ?? DEFAULT_SCHEDULE_SA);
const [sameHoursMode, setSameHoursMode] = useState(false);
const [saving, setSaving] = useState(false);

// DEFAULT_SCHEDULE_SA: Sun–Thu open 08:00–22:00, Fri–Sat closed
```

---

### Feature 12 — Mobile PWA Admin

**US Coverage:** US-08, US-09

#### Files to Create

```
public/
├── manifest.json                # PWA manifest (see Section D.5)
└── icons/
    ├── icon-192.png
    └── icon-512.png

src/
├── app/
│   └── layout.tsx               # Add <link rel="manifest">, serviceWorker registration
└── components/
    └── pwa/
        ├── InstallBanner.tsx    # "Add to Home Screen" in-app banner
        ├── OfflineBanner.tsx    # Top banner: "لا يوجد اتصال"
        ├── BottomNavBar.tsx     # 4-tab mobile navigation
        └── MobileDashboard.tsx  # Mobile-optimized dashboard home layout
```

#### Props Interfaces

```typescript
// InstallBanner.tsx
interface InstallBannerProps {
  locale: "ar" | "en";
  onDismiss: () => void;
  onInstall: () => void;
}

// OfflineBanner.tsx
interface OfflineBannerProps {
  locale: "ar" | "en";
}

// BottomNavBar.tsx
interface BottomNavBarProps {
  activeTab: "home" | "edit" | "stats" | "account";
  siteId?: string;
  locale: "ar" | "en";
}
```

#### State Management

```typescript
// src/hooks/usePWAInstall.ts
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setCanInstall(false);
  };

  return { canInstall, install };
}
```

---

### Feature 13 — Done for You Upgrade Card

**Route:** `/dashboard` (conditional card) + `/dashboard/done-for-you` (dedicated page)
**US Coverage:** US-28, US-29

#### Component Tree

```
src/components/dashboard/
├── DoneForYouCard.tsx           # Dashboard nudge card (conditional)
├── DoneForYouBanner.tsx         # Editor slide-in banner (15-min inactivity trigger)
└── done-for-you/
    ├── DoneForYouPage.tsx       # Full page: pricing + features + booking form
    ├── DoneForYouForm.tsx       # 4-field submission form
    └── DoneForYouStatus.tsx     # Status card for users with active requests
```

#### Props Interfaces

```typescript
// DoneForYouCard.tsx
interface DoneForYouCardProps {
  completenessScore: number;
  daysSinceCreation: number;
  locale: "ar" | "en";
  onDismiss: () => void;
}

// DoneForYouBanner.tsx (editor)
interface DoneForYouBannerProps {
  minutesOnSection: number;      // triggers show at 15
  locale: "ar" | "en";
  onDismiss: () => void;
}

// DoneForYouForm.tsx
interface DoneForYouFormProps {
  prefillName?: string;
  prefillPhone?: string;
  prefillWhatsapp?: string;
  siteId?: string;
  locale: "ar" | "en";
  onSuccess: () => void;
}
```

#### Nudge Visibility Logic

```typescript
// src/hooks/useDoneForYouNudge.ts
export function useDoneForYouNudge(completenessScore: number) {
  const DISMISSED_KEY = "dfy_dismissed_until";
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissedUntil = localStorage.getItem(DISMISSED_KEY);
    const isExpired = !dismissedUntil || new Date(dismissedUntil) < new Date();
    const shouldShow = completenessScore < 50 && isExpired;
    setShow(shouldShow);
  }, [completenessScore]);

  const dismiss = () => {
    const until = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72h
    localStorage.setItem(DISMISSED_KEY, until.toISOString());
    setShow(false);
  };

  return { show, dismiss };
}
```

---

## B. Zustand Store Design

### `useWizardStore`

```typescript
// src/stores/wizardStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { WizardAnswers, WizardIndustry, WizardLanguagePreference } from "@/types/wizard";

interface WizardState {
  // Navigation
  currentStep: number;           // 1–8, or 9 for "complete" screen
  isBuilding: boolean;           // true while POST /api/wizard/complete is in-flight
  buildError: string | null;

  // Draft sync (ADR-001)
  draftId: string | null;
  draftSyncedAt: Date | null;
  isSyncing: boolean;

  // Answers
  answers: WizardAnswers;

  // Generated site (after build)
  createdSite: {
    id: string;
    slug: string;
    url: string;
    name: string;
  } | null;
}

interface WizardActions {
  setStep: (step: number) => void;
  goBack: () => void;
  goNext: () => void;
  setAnswer: <K extends keyof WizardAnswers>(key: K, value: WizardAnswers[K]) => void;
  setAnswers: (answers: Partial<WizardAnswers>) => void;
  setDraft: (draftId: string, step: number, answers: WizardAnswers) => void;
  setBuilding: (v: boolean) => void;
  setBuildError: (error: string | null) => void;
  setCreatedSite: (site: WizardState["createdSite"]) => void;
  reset: () => void;
}

// Step validation rules
export const STEP_REQUIRED: Record<number, (keyof WizardAnswers)[]> = {
  1: ["industry"],
  2: ["businessName"],
  3: ["city"],
  4: ["phone"],
  5: [],                 // logo is optional
  6: ["primaryColor"],
  7: [],                 // tagline is optional
  8: ["languagePreference"],
};

export const SKIPPABLE_STEPS = new Set([5, 7]);

const initialState: WizardState = {
  currentStep: 1,
  isBuilding: false,
  buildError: null,
  draftId: null,
  draftSyncedAt: null,
  isSyncing: false,
  answers: {},
  createdSite: null,
};

export const useWizardStore = create<WizardState & WizardActions>()(
  immer((set, get) => ({
    ...initialState,

    setStep: (step) => set((s) => { s.currentStep = step; }),
    goBack: () => set((s) => { if (s.currentStep > 1) s.currentStep -= 1; }),
    goNext: () => set((s) => { if (s.currentStep < 8) s.currentStep += 1; }),

    setAnswer: (key, value) =>
      set((s) => { s.answers[key] = value as never; }),

    setAnswers: (answers) =>
      set((s) => { Object.assign(s.answers, answers); }),

    setDraft: (draftId, step, answers) =>
      set((s) => {
        s.draftId = draftId;
        s.draftSyncedAt = new Date();
        s.currentStep = step;
        s.answers = answers;
      }),

    setBuilding: (v) => set((s) => { s.isBuilding = v; }),
    setBuildError: (error) => set((s) => { s.buildError = error; }),
    setCreatedSite: (site) => set((s) => { s.createdSite = site; }),

    reset: () => set(() => initialState),
  }))
);

// Selectors
export const selectIsStepValid = (step: number) => (state: WizardState) => {
  const required = STEP_REQUIRED[step] ?? [];
  return required.every((key) => {
    const val = state.answers[key];
    return val !== undefined && val !== null && val !== "";
  });
};
```

---

### `useEditorStore`

```typescript
// src/stores/editorStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enablePatches, Patch, applyPatches, produceWithPatches } from "immer";

enablePatches();

export type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

export interface EditorSnapshot {
  patches: Patch[];
  inversePatches: Patch[];
  timestamp: number;
  description: string;         // e.g., "Headline updated"
}

interface EditorState {
  siteId: string | null;

  // Live draft config (mirrors DB, updated optimistically)
  draftConfig: Record<string, unknown>;

  // Auto-save
  autoSaveStatus: AutoSaveStatus;
  lastSavedAt: Date | null;
  hasUnsavedChanges: boolean;
  pendingChanges: Record<string, unknown>;  // diff to send

  // Undo/Redo (immer patches)
  undoStack: EditorSnapshot[];   // max 20 entries
  redoStack: EditorSnapshot[];

  // Active section
  activeSectionId: string | null;

  // Preview
  previewToken: string | null;
  previewTokenExpiresAt: Date | null;
  previewRefreshKey: number;     // incremented to force iframe reload
}

interface EditorActions {
  initEditor: (siteId: string, config: Record<string, unknown>) => void;

  // Config mutations — all record to undo stack
  updateField: (sectionId: string, fieldKey: string, value: unknown, description: string) => void;
  updateSection: (sectionId: string, changes: Record<string, unknown>, description: string) => void;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  clearUndoHistory: () => void;

  // Auto-save
  setAutoSaveStatus: (status: AutoSaveStatus) => void;
  markSaved: (at: Date) => void;
  markUnsaved: () => void;

  // Preview
  setPreviewToken: (token: string, expiresAt: Date) => void;
  refreshPreview: () => void;

  // Section
  setActiveSection: (sectionId: string | null) => void;
}

const MAX_UNDO_STACK = 20;

export const useEditorStore = create<EditorState & EditorActions>()(
  immer((set, get) => ({
    siteId: null,
    draftConfig: {},
    autoSaveStatus: "idle",
    lastSavedAt: null,
    hasUnsavedChanges: false,
    pendingChanges: {},
    undoStack: [],
    redoStack: [],
    activeSectionId: null,
    previewToken: null,
    previewTokenExpiresAt: null,
    previewRefreshKey: 0,

    initEditor: (siteId, config) =>
      set((s) => {
        s.siteId = siteId;
        s.draftConfig = config;
        s.undoStack = [];
        s.redoStack = [];
      }),

    updateField: (sectionId, fieldKey, value, description) => {
      const prev = get().draftConfig;
      const [next, patches, inversePatches] = produceWithPatches(prev, (draft: Record<string, unknown>) => {
        const section = draft[sectionId] as Record<string, unknown> | undefined;
        if (section) section[fieldKey] = value;
      });

      set((s) => {
        s.draftConfig = next;
        s.hasUnsavedChanges = true;
        // Push undo snapshot
        s.undoStack.push({ patches, inversePatches, timestamp: Date.now(), description });
        if (s.undoStack.length > MAX_UNDO_STACK) s.undoStack.shift();
        s.redoStack = [];  // new change clears redo
      });
    },

    updateSection: (sectionId, changes, description) => {
      const prev = get().draftConfig;
      const [next, patches, inversePatches] = produceWithPatches(prev, (draft: Record<string, unknown>) => {
        const section = draft[sectionId] as Record<string, unknown> | undefined;
        if (section) Object.assign(section, changes);
      });

      set((s) => {
        s.draftConfig = next;
        s.hasUnsavedChanges = true;
        s.undoStack.push({ patches, inversePatches, timestamp: Date.now(), description });
        if (s.undoStack.length > MAX_UNDO_STACK) s.undoStack.shift();
        s.redoStack = [];
      });
    },

    undo: () => {
      const { undoStack, draftConfig } = get();
      if (undoStack.length === 0) return;
      const snapshot = undoStack[undoStack.length - 1];
      const reverted = applyPatches(draftConfig, snapshot.inversePatches);

      set((s) => {
        s.draftConfig = reverted as Record<string, unknown>;
        s.undoStack.pop();
        s.redoStack.push(snapshot);
        s.hasUnsavedChanges = true;
      });
    },

    redo: () => {
      const { redoStack, draftConfig } = get();
      if (redoStack.length === 0) return;
      const snapshot = redoStack[redoStack.length - 1];
      const reapplied = applyPatches(draftConfig, snapshot.patches);

      set((s) => {
        s.draftConfig = reapplied as Record<string, unknown>;
        s.redoStack.pop();
        s.undoStack.push(snapshot);
        s.hasUnsavedChanges = true;
      });
    },

    clearUndoHistory: () => set((s) => { s.undoStack = []; s.redoStack = []; }),

    setAutoSaveStatus: (status) => set((s) => { s.autoSaveStatus = status; }),
    markSaved: (at) => set((s) => {
      s.autoSaveStatus = "saved";
      s.lastSavedAt = at;
      s.hasUnsavedChanges = false;
    }),
    markUnsaved: () => set((s) => { s.hasUnsavedChanges = true; }),

    setPreviewToken: (token, expiresAt) =>
      set((s) => { s.previewToken = token; s.previewTokenExpiresAt = expiresAt; }),

    refreshPreview: () => set((s) => { s.previewRefreshKey += 1; }),

    setActiveSection: (id) => set((s) => { s.activeSectionId = id; }),
  }))
);
```

---

### `useAIStore`

```typescript
// src/stores/aiStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type SuggestionCacheKey = string;  // `${siteId}:${fieldType}:${seed}`

interface SuggestionCacheEntry {
  content: string;
  generatedAt: number;
  seed: number;
}

interface AIState {
  // Per-field streaming state
  streamingField: string | null;       // fieldType that is currently streaming
  streamingContent: string;            // accumulated streamed text

  // Suggestion cache (per session — not persisted)
  suggestionCache: Record<SuggestionCacheKey, SuggestionCacheEntry>;

  // Active suggestion per field (currently shown)
  activeSuggestion: Record<string, SuggestionCacheEntry | null>;

  // Seed counter per field (for "Try Another")
  seedCounters: Record<string, number>;

  // Tone preference (session-persisted)
  selectedTone: "professional" | "friendly" | "creative" | "simple";

  // Translation job
  translationJobId: string | null;
  translationStatus: "idle" | "queued" | "in_progress" | "completed" | "failed";
  translationProgress: {
    sectionsTotal: number;
    sectionsCompleted: number;
    currentSection: string;
  } | null;

  // Error state
  errorByField: Record<string, string | null>;
  quotaExhausted: boolean;
  quotaResetAt: Date | null;
}

interface AIActions {
  startStreaming: (fieldType: string) => void;
  appendStreamChunk: (chunk: string) => void;
  finishStreaming: (fieldType: string, fullContent: string, seed: number) => void;
  clearStreaming: () => void;
  setError: (fieldType: string, error: string | null) => void;
  dismissSuggestion: (fieldType: string) => void;
  incrementSeed: (fieldType: string) => number;
  setTone: (tone: AIState["selectedTone"]) => void;
  setTranslationJob: (jobId: string) => void;
  setTranslationStatus: (status: AIState["translationStatus"], progress?: AIState["translationProgress"]) => void;
  setQuotaExhausted: (resetAt: Date) => void;
}

export const useAIStore = create<AIState & AIActions>()(
  immer((set, get) => ({
    streamingField: null,
    streamingContent: "",
    suggestionCache: {},
    activeSuggestion: {},
    seedCounters: {},
    selectedTone: "professional",
    translationJobId: null,
    translationStatus: "idle",
    translationProgress: null,
    errorByField: {},
    quotaExhausted: false,
    quotaResetAt: null,

    startStreaming: (fieldType) =>
      set((s) => { s.streamingField = fieldType; s.streamingContent = ""; }),

    appendStreamChunk: (chunk) =>
      set((s) => { s.streamingContent += chunk; }),

    finishStreaming: (fieldType, fullContent, seed) => {
      const cacheKey: SuggestionCacheKey = `${fieldType}:${seed}`;
      const entry: SuggestionCacheEntry = { content: fullContent, generatedAt: Date.now(), seed };
      set((s) => {
        s.streamingField = null;
        s.streamingContent = "";
        s.suggestionCache[cacheKey] = entry;
        s.activeSuggestion[fieldType] = entry;
      });
    },

    clearStreaming: () => set((s) => { s.streamingField = null; s.streamingContent = ""; }),
    setError: (fieldType, error) => set((s) => { s.errorByField[fieldType] = error; }),
    dismissSuggestion: (fieldType) => set((s) => { s.activeSuggestion[fieldType] = null; }),

    incrementSeed: (fieldType) => {
      const current = get().seedCounters[fieldType] ?? 0;
      const next = current + 1;
      set((s) => { s.seedCounters[fieldType] = next; });
      return next;
    },

    setTone: (tone) => set((s) => { s.selectedTone = tone; }),
    setTranslationJob: (jobId) => set((s) => { s.translationJobId = jobId; s.translationStatus = "queued"; }),
    setTranslationStatus: (status, progress) =>
      set((s) => { s.translationStatus = status; if (progress) s.translationProgress = progress; }),
    setQuotaExhausted: (resetAt) =>
      set((s) => { s.quotaExhausted = true; s.quotaResetAt = resetAt; }),
  }))
);
```

---

## C. Sprint-by-Sprint Implementation Plan

> Sprint length: 2 weeks. Estimates are in hours of frontend work.
> "BE dependency" = this task cannot start until the BE endpoint is deployed.

---

### Sprint 1 — Foundation (Must Haves) — Weeks 1–2

**Goal:** Core wizard flow works end-to-end, auto-save is live, WhatsApp button renders on published sites, plain language is enforced.

| Task | US | Components | API Consumed | Estimate | Acceptance Criteria |
|---|---|---|---|---|---|
| **1.1 Wizard Store + useWizardSync hook** | US-01 | `useWizardStore`, `useWizardSync` | `GET /api/wizard`, `POST /api/wizard` | 4h | Draft persists across browser close; resumes from correct step on re-login |
| **1.2 WizardShell + WizardProgressDots** | US-01, US-02 | `WizardShell`, `WizardProgressDots` | None | 3h | Progress dots show filled/current/upcoming; Back/Skip/Next controls render; keyboard Enter triggers Next |
| **1.3 Steps 1–4** | US-01, US-02, US-03 | `Step1BusinessType` through `Step4Contact` | `POST /api/wizard` (on each Continue) | 8h | Each step validates before advancing; back nav preserves answers; Step 1 selection adapts industry label on subsequent steps |
| **1.4 Steps 5–8** | US-01 | `Step5Logo` through `Step8Language` | `POST /api/wizard`, logo upload to MinIO | 6h | Step 5 uploads via drag-drop; Step 6 mini preview updates on color select; Step 7 char counter turns amber at 100; Step 8 defaults to "Arabic + English" |
| **1.5 Wizard build + WizardComplete screen** | US-01 | `WizardLoadingScreen`, `WizardComplete`, `ConfettiLayer` | `POST /api/wizard/complete` | 5h | "Building…" message shown during async; complete screen shows live URL + mini iframe preview; "Go to Dashboard" routes to `/dashboard` |
| **1.6 Plain language label map** | US-26, US-27 | `src/lib/plain-language.ts`, `TooltipHint.tsx` | None | 3h | All editor sidebar section names use plain labels; "slug" field labeled "رابط موقعك"; tooltip renders on hover/tap of "?" icon |
| **1.7 WhatsApp floating button (published site)** | US-04 | `WhatsAppFloatingButton` | `GET /api/sites/[siteId]/opening-hours` (for config) | 4h | Button appears bottom-right (LTR) / bottom-left (RTL) after 2s delay; opens `wa.me` link with pre-filled message; hidden when `whatsapp` field is null |
| **1.8 Opening hours editor** | US-12 | `OpeningHoursEditor`, `DayRow`, `TimeRangePicker` | `PUT /api/sites/[siteId]/opening-hours` | 6h | All 7 days shown; Fri/Sat default closed; "same hours" shortcut works; time validation rejects close < open; past-midnight toggle |
| **1.9 Auto-save hook + AutoSaveIndicator** | US-24 | `AutoSaveIndicator`, `useAutoSave` hook | `POST /api/sites/[siteId]/autosave` | 5h | 2s debounce after last keystroke triggers save; indicator shows 4 states; "Are you sure?" on tab close with unsaved changes |

**Sprint 1 BE Dependencies:**
- `POST /api/wizard` and `GET /api/wizard` must be live by day 3 (needed for 1.1)
- `POST /api/wizard/complete` must be live by day 8 (needed for 1.5)
- `PUT /api/sites/[siteId]/opening-hours` must be live by day 10 (needed for 1.8)
- `POST /api/sites/[siteId]/autosave` must be live by day 8 (needed for 1.9)

**Sprint 1 Total Estimate:** ~44h

---

### Sprint 2 — Editor Experience — Weeks 3–4

**Goal:** Editor is usable and delightful: live preview, undo, completeness meter, launch celebration, template switching.

| Task | US | Components | API Consumed | Estimate | Acceptance Criteria |
|---|---|---|---|---|---|
| **2.1 EditorShell + SplitPreview layout** | US-22 | `EditorShell`, `SplitPreview`, `EditorSidebar` | None (layout only) | 4h | Left 420px panel + right flex-1; responsive: mobile shows tabs instead |
| **2.2 PreviewIframe + DeviceToggle** | US-22, US-23 | `PreviewIframe`, `DeviceToggle` | `GET /api/sites/[siteId]/preview-token` | 5h | Token fetched on mount; iframe refreshes with `?t=timestamp` on `previewRefreshKey` change; loading overlay shows after 100ms; device toggle controls iframe width |
| **2.3 300ms debounce preview refresh** | US-22 | `useEditorDebounce` hook | `POST /api/sites/[siteId]/autosave` | 3h | Typing triggers debounce; preview updates on fire; loading overlay disappears on `onLoad`; cancels on unmount |
| **2.4 Undo stack + UndoToast** | US-25 | `UndoToast`, `useEditorStore.undo/redo` | `POST /api/sites/[siteId]/autosave` | 5h | Cmd+Z / Ctrl+Z triggers undo; toast shows 8s countdown progress bar; "Undo" button in toast; max 20 steps; section delete toast uses 30s window |
| **2.5 CompletenessMeterCard** | US-14, US-15 | `CompletenessMeterCard`, `CompletionRing`, `CompletenessChecklistItem` | `GET /api/sites/[siteId]/completeness` | 5h | Ring color: red/amber/green by score; checklist items show priority badges; action links navigate to correct editor path; 100% triggers sparkle animation |
| **2.6 LaunchCelebration screen** | US-20, US-21 | `LaunchCelebration`, `ConfettiLayer`, `CelebrationModal`, `SharePanel` | `POST /api/sites/[siteId]/publish` | 5h | Shown only on `isFirstPublish: true`; `localStorage` gate prevents re-show; confetti fires on mount; WhatsApp share opens `wa.me` with pre-filled message; "Copied ✓" state on copy link |
| **2.7 Template switcher gallery** | US-16 | `TemplateSwitcher`, `TemplateCard` | `GET /api/sites/[siteId]/templates` | 5h | Current template has "Current" badge; hovering card shows preview; confirmation dialog before apply; undo available for 60s |
| **2.8 TemplatePreviewModal** | US-17 | `TemplatePreviewModal` | `GET /api/sites/[siteId]/preview?template=[id]` | 4h | Full-page scroll preview; device toggle works in preview; Apply button inside modal; left/right nav arrows cycle templates |
| **2.9 Opening hours display + OpenNowBadge** | US-13 | `OpeningHoursDisplay`, `OpenNowBadge` | `GET /api/sites/[siteId]/opening-hours` | 3h | "Open Now" badge uses business timezone (not visitor's); shows "Closes in X hours"; shows next open time when closed; runs client-side |

**Sprint 2 BE Dependencies:**
- `GET /api/sites/[siteId]/preview-token` must be live by day 1 of sprint (needed for 2.2)
- `POST /api/sites/[siteId]/publish` must return `isFirstPublish` by day 6 (needed for 2.6)
- `GET /api/sites/[siteId]/completeness` must be live by day 3 (needed for 2.5)

**Sprint 2 Total Estimate:** ~39h

---

### Sprint 3 — AI + Mobile — Weeks 5–6

**Goal:** AI field suggestions work, translation flow is complete, PWA is installable, Done for You upsell is live.

| Task | US | Components | API Consumed | Estimate | Acceptance Criteria |
|---|---|---|---|---|---|
| **3.1 useFieldSuggestion hook** | US-06, US-07 | `useFieldSuggestion` | `POST /api/ai/suggest` (SSE stream) | 5h | SSE stream consumed via `useCompletion`; chunks appended to `aiStore.streamingContent`; no duplicate requests; cache hit returns cached entry |
| **3.2 AISuggestionBox + AILoadingShimmer** | US-06, US-07 | `AISuggestionBox`, `AILoadingShimmer` | (uses hook from 3.1) | 4h | Box slides down on suggestion arrival; "Use this" fills field + dismisses box; "Edit it" fills + focuses; "Try Another" increments seed; fades on manual typing after 500ms |
| **3.3 AIHelpMeWriteButton + AIToneSelector** | US-10, US-11 | `AIHelpMeWriteButton`, `AIToneSelector` | `POST /api/ai/suggest` | 4h | Streaming text appears character-by-character in field; tone selection persists across fields in session; quota error shown with reset time; debounced — rapid clicks send one request |
| **3.4 TranslateAll flow** | US-18 | `TranslateAllButton`, `TranslationProgressBar` | `POST /api/ai/translate`, `GET /api/ai/translate/[jobId]` | 5h | Confirmation dialog before start; progress polls every 2s; completed → enters review mode; failed → no changes committed; atomic |
| **3.5 TranslationReviewMode** | US-19 | `TranslationReviewMode`, `TranslationFieldRow` | None (uses cached job result) | 5h | Side-by-side AR/EN; Approve checkmark; manual edits flagged as "Manual Override"; "Confirm All" saves; resumable if browser closed mid-review |
| **3.6 PWA manifest + service worker** | US-08 | `public/manifest.json`, `sw.ts` | None | 4h | Lighthouse PWA score ≥ 90; offline shows dashboard cache; Workbox NetworkFirst for API, CacheFirst for assets; install banner shows after 2nd visit |
| **3.7 BottomNavBar + MobileDashboard** | US-09 | `BottomNavBar`, `MobileDashboard`, `InstallBanner`, `OfflineBanner` | None | 4h | 4-tab bottom nav; safe-area-inset-bottom respected; "غير متصل" banner when offline; keyboard-above sticky Save button in mobile edit flow |
| **3.8 DoneForYouCard + DoneForYouPage** | US-28 | `DoneForYouCard`, `DoneForYouPage`, `DoneForYouForm`, `DoneForYouStatus` | `POST /api/managed-service`, `GET /api/managed-service/status` | 5h | Card shown when completeness < 50% and > 3 days since creation; form auto-fills name/phone; submission shows "سيتواصل معك فريقنا خلال ساعتين"; status card replaces nudges post-submission |
| **3.9 DoneForYouBanner (editor inactivity)** | US-29 | `DoneForYouBanner` | None | 2h | Banner slides in after 15 minutes on same section without saving; dismiss hides for 72h; suppressed when completeness ≥ 80% |

**Sprint 3 BE Dependencies:**
- `POST /api/ai/suggest` (SSE) must be live by day 1 (needed for 3.1)
- `POST /api/ai/translate` + polling endpoint must be live by day 5 (needed for 3.4)
- `POST /api/managed-service` must be live by day 8 (needed for 3.8)

**Sprint 3 Total Estimate:** ~38h

**Overall Total: ~121h FE across 6 weeks**

---

## D. Key Implementation Details

### D.1 Wizard Component Skeleton

#### WizardShell.tsx

```tsx
// src/components/wizard/WizardShell.tsx
"use client";
import { useEffect } from "react";
import { useLocale } from "@/hooks/useLocale";
import { WizardProgressDots } from "./WizardProgressDots";
import { SKIPPABLE_STEPS } from "@/stores/wizardStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function WizardShell({
  currentStep, totalSteps, canGoBack, canSkip, onBack, onSkip, children,
}: WizardShellProps) {
  const { locale, isRTL } = useLocale();

  // Keyboard: Enter = next (delegated to form), Escape = back
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && canGoBack) onBack();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [canGoBack, onBack]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Sticky header */}
      <header className="h-14 border-b border-gray-200 sticky top-0 z-30 bg-white flex items-center px-4">
        <button
          onClick={onBack}
          className={`text-sm text-gray-500 flex items-center gap-1 transition-opacity ${
            !canGoBack ? "opacity-0 pointer-events-none" : ""
          }`}
          aria-label={locale === "ar" ? "رجوع" : "Back"}
        >
          {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {locale === "ar" ? "رجوع" : "Back"}
        </button>

        <div className="flex-1 flex justify-center">
          <WizardProgressDots
            total={totalSteps}
            current={currentStep}
            locale={locale}
          />
        </div>

        {canSkip ? (
          <button
            onClick={onSkip}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            {locale === "ar" ? "تخطى ←" : "Skip →"}
          </button>
        ) : (
          <div className="w-16" /> // spacer to keep dots centered
        )}
      </header>

      {/* Step content */}
      <main className="flex-1 overflow-y-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
```

#### WizardStep.tsx

```tsx
// src/components/wizard/WizardStep.tsx
"use client";
import { Loader2 } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { Button } from "@/components/ui/button";

export function WizardStep({
  icon: Icon, stepNumber, totalSteps, headline, hint,
  children, onContinue, continueDisabled, continueLoading, continueLabel,
}: WizardStepProps) {
  const { locale, isRTL } = useLocale();
  const defaultLabel = locale === "ar" ? "التالي" : "Continue";

  return (
    <div className="max-w-lg mx-auto flex flex-col items-center text-center">
      {/* Illustration */}
      <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-blue-600" />
      </div>

      {/* Step label */}
      <p className="text-sm text-gray-400">
        {locale === "ar"
          ? `الخطوة ${stepNumber} من ${totalSteps}`
          : `Step ${stepNumber} of ${totalSteps}`}
      </p>

      {/* Headline */}
      <h1 className="text-2xl font-bold text-gray-900 mt-2">{headline}</h1>

      {/* Hint */}
      {hint && (
        <p className="text-sm text-gray-500 mt-1 max-w-xs">{hint}</p>
      )}

      {/* Input area */}
      <div className="w-full mt-6">{children}</div>

      {/* Continue button */}
      <Button
        onClick={onContinue}
        disabled={continueDisabled || continueLoading}
        className="w-full h-12 mt-8 gap-2"
        size="lg"
      >
        {continueLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {continueLabel ?? defaultLabel}
            {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </>
        )}
      </Button>
    </div>
  );
}
```

#### Wizard State Machine — Step Flow

```typescript
// src/components/wizard/hooks/useWizardNavigation.ts
"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore, selectIsStepValid, SKIPPABLE_STEPS } from "@/stores/wizardStore";
import { useWizardSync } from "./useWizardSync";

export function useWizardNavigation() {
  const {
    currentStep, goNext, goBack, answers,
    setBuilding, setBuildError, setCreatedSite,
  } = useWizardStore();
  const { syncStep } = useWizardSync();
  const router = useRouter();

  const isCurrentStepValid = useWizardStore(selectIsStepValid(currentStep));

  const handleNext = useCallback(async () => {
    if (!isCurrentStepValid) return;
    // Sync current step to server before advancing
    await syncStep(currentStep, answers);
    goNext();
  }, [isCurrentStepValid, syncStep, currentStep, answers, goNext]);

  const handleSkip = useCallback(() => {
    if (!SKIPPABLE_STEPS.has(currentStep)) return;
    goNext();
  }, [currentStep, goNext]);

  const handleBuild = useCallback(async () => {
    setBuilding(true);
    setBuildError(null);
    try {
      const res = await fetch("/api/wizard/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generateWithAI: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBuildError(data.error ?? "Build failed");
        return;
      }
      setCreatedSite({
        id: data.site.id,
        slug: data.site.slug,
        url: `https://${data.site.slug}.safahati.com`,
        name: data.site.name,
      });
      // Advance to step 9 = WizardComplete screen
      useWizardStore.getState().setStep(9);
    } finally {
      setBuilding(false);
    }
  }, [setBuilding, setBuildError, setCreatedSite]);

  return {
    currentStep,
    canGoBack: currentStep > 1,
    canSkip: SKIPPABLE_STEPS.has(currentStep),
    isCurrentStepValid,
    handleNext,
    handleBack: goBack,
    handleSkip,
    handleBuild,
  };
}
```

#### How wizard answers map to site config on completion

The mapping happens server-side in `POST /api/wizard/complete` (which calls `/api/ai/wizard-generate`). From the FE perspective, the mapping contract is:

| Wizard Answer | Site Config Field |
|---|---|
| `industry` | `sites.industry` + selects base industry template |
| `businessName` | `sites.name` + `hero.config.heading` |
| `city` | `sites.city` + appended to hero subheadline |
| `phone` | `contact.config.phone` + `sites.whatsapp` (if `whatsappEnabled`) |
| `logoUrl` | `sites.theme.logoUrl` |
| `primaryColor` | `sites.theme.primaryColor` |
| `tagline` | `hero.config.subheading` |
| `languagePreference` | `sites.language` (`"ar"` | `"en"` | `"both"`) |

---

### D.2 Live Preview

#### Preview URL Structure

```
https://[slug].safahati.com?preview_token=[JWT]
```

The preview token is fetched from `GET /api/sites/[siteId]/preview-token`, valid for 5 minutes.

#### usePreviewRefresh hook

```typescript
// src/components/editor/hooks/usePreviewRefresh.ts
"use client";
import { useCallback, useEffect, useRef } from "react";
import { useEditorStore } from "@/stores/editorStore";

const DEBOUNCE_MS = 300;
const PREVIEW_TOKEN_REFRESH_MS = 4 * 60 * 1000; // 4 min (before 5-min expiry)

export function usePreviewRefresh(siteId: string) {
  const { refreshPreview, setPreviewToken, draftConfig } = useEditorStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tokenTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch initial preview token
  const fetchToken = useCallback(async () => {
    const res = await fetch(`/api/sites/${siteId}/preview-token`);
    const data = await res.json();
    if (data.token) {
      setPreviewToken(data.token, new Date(data.expiresAt));
    }
  }, [siteId, setPreviewToken]);

  useEffect(() => {
    fetchToken();
    tokenTimerRef.current = setInterval(fetchToken, PREVIEW_TOKEN_REFRESH_MS);
    return () => {
      if (tokenTimerRef.current) clearInterval(tokenTimerRef.current);
    };
  }, [fetchToken]);

  // Debounce preview refresh on config changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      refreshPreview();
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [draftConfig, refreshPreview]);
}
```

#### PreviewIframe.tsx — Loading overlay

```tsx
// src/components/editor/PreviewIframe.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { Loader2 } from "lucide-react";

export function PreviewIframe({ siteId, deviceWidth, locale }: {
  siteId: string;
  deviceWidth: 390 | 768 | null;
  locale: "ar" | "en";
}) {
  const { previewToken, previewRefreshKey } = useEditorStore();
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slug = ""; // resolved from siteId in parent
  const src = previewToken
    ? `https://${slug}.safahati.com?preview_token=${previewToken}&_t=${previewRefreshKey}`
    : "";

  // Show loading overlay only if iframe hasn't loaded within 100ms
  useEffect(() => {
    overlayTimerRef.current = setTimeout(() => setShowOverlay(true), 100);
    return () => {
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    };
  }, [previewRefreshKey]);

  const handleLoad = () => {
    if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    setShowOverlay(false);
  };

  const iframeStyle: React.CSSProperties = {
    width: deviceWidth ? `${deviceWidth}px` : "100%",
    height: "100%",
    pointerEvents: "none",
    border: "none",
    borderRadius: "1rem",
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-100 p-4">
      <div
        className="relative bg-white rounded-2xl shadow-lg overflow-hidden"
        style={{ width: deviceWidth ? `${deviceWidth}px` : "100%", height: "100%" }}
      >
        <iframe src={src} style={iframeStyle} onLoad={handleLoad} title="Site preview" />

        {/* Loading overlay */}
        {showOverlay && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2 transition-opacity">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <p className="text-sm text-gray-400">
              {locale === "ar" ? "جاري تحديث المعاينة..." : "Updating preview..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### D.3 AI Streaming Integration

#### useFieldSuggestion hook

```typescript
// src/components/editor/ai/hooks/useFieldSuggestion.ts
"use client";
import { useCallback, useRef } from "react";
import { useAIStore } from "@/stores/aiStore";
import type { AISuggestFieldType } from "@/types/ai";

interface UseSuggestionOptions {
  siteId: string;
  fieldType: AISuggestFieldType;
  context: {
    businessName: string;
    industry: string;
    city?: string;
  };
  locale: "ar" | "en";
  maxLength?: number;
}

export function useFieldSuggestion({
  siteId, fieldType, context, locale, maxLength,
}: UseSuggestionOptions) {
  const {
    streamingField, streamingContent, activeSuggestion,
    selectedTone, startStreaming, appendStreamChunk,
    finishStreaming, clearStreaming, setError,
    incrementSeed, quotaExhausted,
  } = useAIStore();

  const abortRef = useRef<AbortController | null>(null);
  const isStreaming = streamingField === fieldType;
  const currentSuggestion = activeSuggestion[fieldType];

  const requestSuggestion = useCallback(async (seed?: number) => {
    if (isStreaming || quotaExhausted) return;

    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const effectiveSeed = seed ?? incrementSeed(fieldType);
    startStreaming(fieldType);

    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          siteId, fieldType, language: locale, tone: selectedTone,
          context, seed: effectiveSeed, maxLength,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 403) {
          useAIStore.getState().setQuotaExhausted(new Date(err.details.resetAt));
        }
        setError(fieldType, err.error ?? "Unknown error");
        clearStreaming();
        return;
      }

      // Consume SSE stream
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        const lines = text.split("\n").filter((l) => l.startsWith("data:"));
        for (const line of lines) {
          const json = JSON.parse(line.slice(5));
          if (json.type === "delta") {
            appendStreamChunk(json.content);
            fullContent += json.content;
          } else if (json.type === "done") {
            fullContent = json.fullContent ?? fullContent;
          }
        }
      }

      finishStreaming(fieldType, fullContent, effectiveSeed);
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError(fieldType, "Request failed");
        clearStreaming();
      }
    }
  }, [fieldType, isStreaming, quotaExhausted, locale, selectedTone, context, maxLength, siteId]);

  const tryAnother = useCallback(() => {
    const nextSeed = incrementSeed(fieldType);
    requestSuggestion(nextSeed);
  }, [fieldType, incrementSeed, requestSuggestion]);

  return {
    isStreaming,
    streamingContent: isStreaming ? streamingContent : "",
    suggestion: currentSuggestion?.content ?? null,
    requestSuggestion,
    tryAnother,
  };
}
```

---

### D.4 Undo Stack (immer)

The `useEditorStore` already implements the full undo/redo mechanism using immer patches (see Section B). The integration with the keyboard shortcut lives in the editor shell:

```typescript
// src/components/editor/hooks/useUndoKeyboard.ts
"use client";
import { useEffect } from "react";
import { useEditorStore } from "@/stores/editorStore";

export function useUndoKeyboard() {
  const { undo, redo, undoStack, redoStack } = useEditorStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
      if (!ctrlOrCmd) return;
      if (e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if (e.key === "z" && e.shiftKey) { e.preventDefault(); redo(); }
      if (e.key === "y") { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  return { canUndo: undoStack.length > 0, canRedo: redoStack.length > 0 };
}
```

The `UndoToast` is triggered by watching the undo stack in the `EditorShell`. Each time a new snapshot is pushed, a toast is shown:

```typescript
// Inside EditorShell.tsx
const lastSnapshot = undoStack[undoStack.length - 1];
useEffect(() => {
  if (!lastSnapshot) return;
  showUndoToast(lastSnapshot.description, lastSnapshot.timestamp < Date.now() - 100 ? 8 : 30);
}, [lastSnapshot?.timestamp]);
```

---

### D.5 PWA Setup

#### public/manifest.json

```json
{
  "name": "Safahati — ساعة الزيارة",
  "short_name": "Safahati",
  "description": "Manage your website from your phone",
  "start_url": "/dashboard",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#2563eb",
  "background_color": "#ffffff",
  "lang": "ar",
  "dir": "rtl",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "categories": ["business", "productivity"],
  "screenshots": []
}
```

#### Service Worker Registration (layout.tsx)

```tsx
// src/app/(dashboard)/layout.tsx
"use client";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(console.error);
    }
  }, []);

  return <>{children}</>;
}
```

#### public/sw.js — Workbox strategies (per ADR-008)

```javascript
// public/sw.js — generated by workbox-webpack-plugin or written manually
importScripts("https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js");

const { registerRoute } = workbox.routing;
const { NetworkFirst, CacheFirst, StaleWhileRevalidate } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;

// API routes — NetworkFirst (always try network, fall back to cache)
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 10,
    plugins: [new CacheableResponsePlugin({ statuses: [200] })],
  })
);

// Static assets — CacheFirst
registerRoute(
  ({ request }) => ["style", "script", "worker"].includes(request.destination),
  new CacheFirst({ cacheName: "static-assets" })
);

// Dashboard HTML pages — StaleWhileRevalidate (show cached, update in bg)
registerRoute(
  ({ url }) => url.pathname.startsWith("/dashboard"),
  new StaleWhileRevalidate({ cacheName: "dashboard-pages" })
);

// Images — CacheFirst with 30-day expiry
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({ cacheName: "images" })
);
```

---

## E. Reusable UI Primitives

### TimeRangePicker

A pair of time dropdowns (Opens / Closes) with 30-minute increments.

```typescript
// src/components/ui/time-range-picker.tsx
interface TimeRangePickerProps {
  openTime: string;      // "08:00" (24h)
  closeTime: string;     // "22:00"
  locale: "ar" | "en";
  disabled?: boolean;
  onChange: (type: "open" | "close", time: string) => void;
}
```

**Usage:**
```tsx
<TimeRangePicker
  openTime="08:00"
  closeTime="22:00"
  locale="ar"
  onChange={(type, time) => updateDay("sunday", type, time)}
/>
```

**Implementation notes:**
- Times generated as `["00:00", "00:30", "01:00", ...]` — 48 options.
- Arabic display: `"٨:٠٠ ص"` for 08:00, `"١٠:٠٠ م"` for 22:00. English: `"8:00 AM"`, `"10:00 PM"`.
- Uses shadcn `<Select>` component.
- `dir="ltr"` on the select trigger regardless of locale (times are always LTR numerals).

---

### AISuggestionBox

```typescript
// src/components/ui/ai-suggestion-box.tsx
interface AISuggestionBoxProps {
  suggestion: string | null;
  isLoading: boolean;
  locale: "ar" | "en";
  onUse: () => void;
  onEdit: () => void;
  onTryAnother: () => void;
  onDismiss: () => void;
}
```

**Usage:**
```tsx
<AISuggestionBox
  suggestion={suggestion}
  isLoading={isStreaming}
  locale="ar"
  onUse={() => setFieldValue(suggestion!)}
  onEdit={() => { setFieldValue(suggestion!); focusField(); }}
  onTryAnother={tryAnother}
  onDismiss={() => dismissSuggestion(fieldType)}
/>
```

**Implementation notes:**
- Container: `bg-blue-50 border border-blue-100 rounded-xl p-3` — slides down with `animate-in slide-in-from-top-2` (Tailwind v4).
- Loading: two shimmer lines (`bg-blue-100 animate-pulse h-4 rounded`) + `"Generating a suggestion..."` text.
- Buttons: flex row, `text-xs`. "Use this" = `text-blue-600 font-medium`, "Edit it" = `text-gray-600`, "Try another" = `text-gray-400`.
- In RTL: button order reverses (flex-row-reverse or logical start/end).

---

### StepIndicator (WizardProgressDots)

```typescript
// src/components/ui/step-indicator.tsx
interface StepIndicatorProps {
  total: number;
  current: number;       // 1-based
  locale: "ar" | "en";
}
```

**Usage:**
```tsx
<StepIndicator total={8} current={3} locale="ar" />
```

**Implementation notes:**
- Each dot is an `<span>` with `w-2 h-2 rounded-full`.
- Completed: `bg-blue-600`. Current: `bg-blue-600 ring-2 ring-blue-200`. Upcoming: `bg-gray-200`.
- In RTL: `flex-row-reverse` so dot 1 is on the right.
- Animation: completed dots transition from gray to blue (`transition-colors duration-300`).

---

### CompletionRing

```typescript
// src/components/ui/completion-ring.tsx
interface CompletionRingProps {
  score: number;         // 0–100
  size?: number;         // SVG width/height, default 80
  strokeWidth?: number;  // default 8
  locale: "ar" | "en";
}
```

**Usage:**
```tsx
<CompletionRing score={80} locale="ar" />
```

**Implementation:**
```tsx
export function CompletionRing({ score, size = 80, strokeWidth = 8, locale }: CompletionRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const isRTL = locale === "ar";

  const color =
    score >= 80 ? "#22c55e" :   // green-500
    score >= 40 ? "#f59e0b" :   // amber-500
    "#ef4444";                   // red-500

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={isRTL ? { transform: "scaleX(-1)" } : undefined}
      aria-label={`${score}%`}
    >
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth}
      />
      {/* Progress */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={`${progress} ${circumference}`}
        strokeLinecap="round"
        strokeDashoffset={circumference / 4}
        style={{ transition: "stroke-dasharray 0.5s ease-out, stroke 0.3s" }}
      />
      {/* Score text */}
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="central"
        className="text-sm font-bold" fill={color}
        style={{ fontSize: size * 0.2, fontWeight: 700 }}
      >
        {score}%
      </text>
    </svg>
  );
}
```

---

### ConfettiOverlay

```typescript
// src/components/ui/confetti-overlay.tsx
interface ConfettiOverlayProps {
  trigger: boolean;       // fires when changes from false → true
  duration?: number;      // ms, default 4000
}
```

**Usage:**
```tsx
<ConfettiOverlay trigger={isFirstPublish} duration={4000} />
```

**Implementation:**
```tsx
"use client";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export function ConfettiOverlay({ trigger, duration = 4000 }: ConfettiOverlayProps) {
  useEffect(() => {
    if (!trigger) return;

    // First burst
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#2563eb", "#7c3aed", "#f59e0b", "#22c55e", "#ffffff"],
      gravity: 0.8,
      shapes: ["circle", "square"],
    });

    // Second burst at 500ms
    const t2 = setTimeout(() => {
      confetti({ particleCount: 80, spread: 50, origin: { y: 0.5, x: 0.3 }, angle: 60 });
      confetti({ particleCount: 80, spread: 50, origin: { y: 0.5, x: 0.7 }, angle: 120 });
    }, 500);

    return () => clearTimeout(t2);
  }, [trigger]);

  return null;
}
```

---

### SplitPreview

```typescript
// src/components/ui/split-preview.tsx
interface SplitPreviewProps {
  left: React.ReactNode;       // editor panel
  right: React.ReactNode;      // preview panel
  leftWidth?: number;          // px, default 420
  isRTL?: boolean;             // swaps panel order
}
```

**Usage:**
```tsx
<SplitPreview
  left={<EditorSidebar siteId={siteId} />}
  right={<PreviewIframe siteId={siteId} deviceWidth={deviceWidth} />}
  isRTL={locale === "ar"}
/>
```

**Implementation notes:**
- Desktop (≥1024px): `flex` row. `left` has `w-[420px] flex-none overflow-y-auto border-e`. `right` has `flex-1 min-w-0`.
- Below 1024px: panels collapse to the tab-based mobile layout.
- In RTL: `flex-row-reverse` so the editing panel appears on the right.
- `border-e` (logical property) handles the divider correctly in both directions.

---

### AutoSaveIndicator

```typescript
// src/components/ui/auto-save-indicator.tsx
interface AutoSaveIndicatorProps {
  status: "idle" | "saving" | "saved" | "error";
  lastSavedAt: Date | null;
  locale: "ar" | "en";
  onRetry?: () => void;
}
```

**Usage:**
```tsx
<AutoSaveIndicator
  status={autoSaveStatus}
  lastSavedAt={lastSavedAt}
  locale="ar"
  onRetry={triggerManualSave}
/>
```

**States rendered:**
```
idle:    (nothing shown)
saving:  ● جاري الحفظ...     (amber-600, spinning dot, animate-pulse)
saved:   ✓ تم الحفظ الآن    (green-600, fades to gray after 5s)
         Saved · 2m ago      (gray-400, after 10s)
error:   ⚠ تعذّر الحفظ [أعد المحاولة]  (red-600, retry link)
```

**Relative time hook:**
```typescript
// src/hooks/useRelativeTime.ts
export function useRelativeTime(date: Date | null): string {
  // Re-calculates every 30 seconds
  // Returns "just now", "2m ago", "1h ago", etc. (bilingual)
}
```

---

### UndoToast

```typescript
// src/components/ui/undo-toast.tsx
interface UndoToastProps {
  message: string;           // e.g., "تم تحديث العنوان"
  duration: number;          // 8000 or 30000 ms
  locale: "ar" | "en";
  onUndo: () => void;
  onDismiss: () => void;
}
```

**Usage:**
```tsx
<UndoToast
  message={locale === "ar" ? "تم تحديث العنوان" : "Headline updated"}
  duration={8000}
  locale="ar"
  onUndo={undo}
  onDismiss={() => setToast(null)}
/>
```

**Implementation notes:**
- Fixed bottom-center (desktop: `fixed bottom-4 left-1/2 -translate-x-1/2`; mobile: `fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] inset-x-4`).
- `bg-gray-900 text-white rounded-xl px-4 py-3` with flex layout.
- Progress bar: `absolute bottom-0 inset-x-0 h-0.5 bg-blue-400 origin-left` — width animated from 100% to 0% over `duration` ms.
- Max 3 toasts stacked (`aria-live="polite"` container); 4th dismisses oldest.
- Slide-in: `animate-in slide-in-from-bottom-4` (200ms). Slide-out: `animate-out slide-out-to-bottom-4` (150ms).

---

## F. RTL Implementation Checklist

This checklist applies to every component in this document. Use it as a review gate before marking any task as "done".

### F.1 CSS Logical Properties

Replace all physical properties with logical equivalents:

| Physical (forbidden) | Logical (required) | Tailwind class |
|---|---|---|
| `margin-left` | `margin-inline-start` | `ms-` |
| `margin-right` | `margin-inline-end` | `me-` |
| `padding-left` | `padding-inline-start` | `ps-` |
| `padding-right` | `padding-inline-end` | `pe-` |
| `border-left` | `border-inline-start` | `border-s` |
| `border-right` | `border-inline-end` | `border-e` |
| `left: 0` (absolute) | `inset-inline-start: 0` | `start-0` |
| `right: 0` (absolute) | `inset-inline-end: 0` | `end-0` |
| `text-align: left` | `text-align: start` | `text-start` |
| `text-align: right` | `text-align: end` | `text-end` |
| `rounded-l-` | `rounded-s-` | `rounded-s-` |
| `rounded-r-` | `rounded-e-` | `rounded-e-` |

**Exception:** Explicit LTR elements (phone numbers, URLs, hexadecimal values) should keep physical properties or use `dir="ltr"` inline.

### F.2 Icon Flipping

Directional icons must flip in RTL. Add this helper:

```typescript
// src/lib/rtl.ts
export function rtlIcon(locale: "ar" | "en"): React.CSSProperties {
  return locale === "ar" ? { transform: "scaleX(-1)" } : {};
}
```

| Icon | LTR | RTL |
|---|---|---|
| `ChevronRight` ("Next") | Points right → forward | Use `ChevronLeft` pointing left ← |
| `ChevronLeft` ("Back") | Points left ← backward | Use `ChevronRight` pointing right → |
| `ArrowRight` | Points right → | Points left ← |
| `ArrowLeft` | Points left ← | Points right → |
| `ChevronDown` | No flip | No flip |
| `AlertCircle` | No flip | No flip |
| `Check` | No flip | No flip |

In the wizard `WizardStep` "Continue" button: use `isRTL ? <ChevronLeft /> : <ChevronRight />`.

### F.3 Arabic Font Stack

```css
/* Applied via tailwind.config.ts fontFamily or globals.css */
:root {
  --font-arabic: "IBM Plex Sans Arabic", "Noto Kufi Arabic", "Noto Sans Arabic", system-ui, sans-serif;
}

[lang="ar"], [dir="rtl"] {
  font-family: var(--font-arabic);
  line-height: 1.8;            /* Arabic needs more generous line height */
}
```

All font-size values remain the same between Arabic and English — do not reduce Arabic text size.

### F.4 Progress Indicators in RTL

**Wizard progress dots (WizardProgressDots):**
- Wrap in `flex` with `flex-row-reverse` when `locale === "ar"`.
- Step 1 dot appears on the right in RTL, step 8 on the left.

**CompletionRing SVG:**
- Apply `style={{ transform: "scaleX(-1)" }}` to the SVG element when `isRTL`.
- This makes the progress fill clockwise from the left in RTL (reading direction).

**Progress bars (linear):**
- Use `direction: rtl` on the container, or `transform: scaleX(-1)` on the bar.
- The Tailwind `w-[XX%]` fill expands from right in RTL without extra code if the parent has `dir="rtl"`.

**Slide-in animations (wizard steps):**
- Forward navigation (Continue): LTR slides left (`-translate-x-full`), RTL slides right (`translate-x-full`).
- Back navigation: reverse of above.
- Implement via Framer Motion variants keyed to `isRTL`:

```typescript
const slideVariants = (isRTL: boolean) => ({
  enter: (direction: number) => ({
    x: isRTL ? -direction * 100 + "%" : direction * 100 + "%",
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: isRTL ? direction * 100 + "%" : -direction * 100 + "%",
    opacity: 0,
  }),
});
```

### F.5 Form Field Direction

All text inputs and textareas must use `dir="auto"`:

```tsx
<input
  dir="auto"
  placeholder={locale === "ar" ? "اسم النشاط التجاري" : "Business name"}
  className="w-full rounded-lg border px-3 py-2 text-start"
/>
```

`dir="auto"` detects whether the user's input is Arabic (RTL) or Latin (LTR) and sets the direction accordingly. This is critical for bilingual sites where a user might type an English business name while the UI is in Arabic.

Phone number inputs are always `dir="ltr"` regardless of locale.

### F.6 Number Display

| Context | Format | Example |
|---|---|---|
| Time fields (opening hours) | Eastern Arabic numerals in Arabic locale | `٨:٠٠ ص` |
| Statistics, percentages, scores | Western Arabic numerals always | `80%` / `243` |
| Prices, character counters | Western Arabic numerals always | `120/120` |
| Step indicator | Eastern Arabic numerals in Arabic | `الخطوة ١ من ٨` |

Use this helper:

```typescript
// src/lib/format.ts
export function formatNumber(n: number, locale: "ar" | "en", style: "eastern" | "western" = "western"): string {
  if (locale === "ar" && style === "eastern") {
    return n.toLocaleString("ar-SA-u-nu-arab");
  }
  return n.toString();
}
```

### F.7 Toast and Modal Positioning

| Element | LTR default | RTL override |
|---|---|---|
| WhatsApp button | `bottom-right` | `bottom-left` (auto-defaulted for RTL sites) |
| UndoToast (desktop) | `bottom-center` | `bottom-center` (no change) |
| UndoToast (mobile) | `bottom-center above nav` | same |
| Tooltips | Appear above trigger, positioned left-of-trigger | Appear above trigger, positioned right-of-trigger |
| AISuggestionBox | Slides down from field | Slides down from field (no change) |
| CelebrationModal | Slides up from bottom | Slides up from bottom (no change) |

Use `popoverPlacement="start"` (logical) in Radix/shadcn tooltip/popover for automatic RTL-aware positioning.

### F.8 Component-by-Component RTL Checklist

| Component | RTL Changes |
|---|---|
| `WizardShell` | Back button on left in LTR, right in RTL. Skip button on right in LTR, left in RTL. Dots in `flex-row-reverse`. |
| `WizardStep` | Continue button chevron flips. Headline `text-center` (no change). Hint `text-center` (no change). |
| `Step1BusinessType` | Selected checkmark on `start-3` (logical). Row text `text-start`. |
| `Step4Contact` | Country code prefix on `start` side of input. Phone input is always `dir="ltr"`. |
| `SplitPreview` | `flex-row-reverse` in RTL (editor panel on right). |
| `EditorTopBar` | Back link on `start`. Save/Publish buttons on `end`. AutoSaveIndicator between them. |
| `SectionNavList` | Active indicator border on `start-0` (logical). |
| `AISuggestionBox` | `✨ اقتراح` label on `end`. Buttons in RTL natural order. |
| `CompletionRing` | `scaleX(-1)` on SVG. |
| `WizardProgressDots` | `flex-row-reverse`. |
| `OpeningHoursEditor` | Day names aligned `text-start`. Toggle on `start`. Time pickers always `dir="ltr"`. |
| `UndoToast` | Text `text-start`. `[Undo]` button on `end`. |
| `WhatsAppFloatingButton` | Default position `bottom-left` for RTL sites; configurable. |
| `CelebrationModal` | URL box: copy link button on `start` in RTL (URL on right, button on left). |
| `BottomNavBar` | Tab order same L-to-R visually (navigation order is layout-agnostic). Arabic labels under icons. |

---

*Document version: 1.0 — April 2026*
*Author: Frontend Engineer (virtual team role)*
*Cross-reference: `06-Backend-Engineer/05-SA-Architecture-NonTechnical-Features.md` for API contracts and ADRs*
*Next step: Begin Sprint 1 with tasks 1.1 (Wizard Store) and 1.9 (Auto-save) in parallel — neither has BE dependencies on day 1*
