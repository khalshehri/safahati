# Architecture Recommendations — Safahati Frontend

This document provides concrete recommendations for improving the frontend architecture. Each recommendation includes: the problem, the proposed solution with code examples, estimated effort, and expected impact.

---

## Recommendation 1: Lazy-Load Block Templates

### Problem
`src/config/block-registry.ts` eagerly imports all 14 block modules, which in turn import all 174 template components. Every template gets bundled into the editor's JavaScript — including GSAP, tsParticles, Framer Motion variants, and large template markup — even if the site being edited uses none of those templates.

### Solution: Dynamic Import with `React.lazy`

**Step 1: Change block registration to accept `() => Promise<Component>` instead of `Component`**

```ts
// src/types/blocks.ts — updated TemplateEntry
export interface TemplateEntry {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  // Changed: accept lazy-loadable component
  component: React.ComponentType<BlockProps> | React.LazyExoticComponent<React.ComponentType<BlockProps>>;
  defaultConfig: Record<string, unknown>;
}
```

**Step 2: Register templates with `React.lazy`**

```ts
// src/components/blocks/hero/index.ts
import { registerBlock } from "@/lib/registry";
import React from "react";
import type { BlockProps } from "@/types/blocks";

registerBlock({
  type: "hero",
  label: "Hero",
  labelAr: "البانر الرئيسي",
  category: "header",
  icon: "star",
  configSchema: heroConfigSchema,
  templates: [
    {
      id: "hero-template-01",
      name: "Clean Center",
      nameAr: "نظيف مركزي",
      description: "Centered headline with gradient orbs",
      component: React.lazy(() => 
        import("./hero-template-01").then(m => ({ default: m.HeroTemplate01 }))
      ),
      defaultConfig: heroTemplate01DefaultConfig,
    },
    // ... etc
  ],
});
```

**Step 3: Wrap `BlockRenderer` with `Suspense`**

```tsx
// src/components/blocks/renderer.tsx
import { Suspense } from "react";

export function BlockRenderer({ section, language }: BlockRendererProps) {
  const template = getTemplate(section.blockType, section.templateId);
  const Component = template.component;

  return (
    <Suspense fallback={<BlockSkeleton blockType={section.blockType} />}>
      <Component config={section.config} language={language} />
    </Suspense>
  );
}
```

**BlockSkeleton fallback:**
```tsx
function BlockSkeleton({ blockType }: { blockType: BlockType }) {
  const heights: Record<BlockType, string> = {
    hero: "h-96",
    navbar: "h-14",
    footer: "h-48",
    // ... etc
  };
  return (
    <div className={`animate-pulse bg-gray-100 w-full ${heights[blockType] ?? "h-32"}`} />
  );
}
```

**Expected Impact:** Reduces initial editor bundle by ~60–70%. Each template only loads when it is first rendered.

---

## Recommendation 2: Move `industry-templates.ts` to Server-Only

### Problem
`industry-templates.ts` (1449 lines, ~120KB raw) is imported in a `"use client"` component, forcing the entire file into the client bundle. The new-site page only needs the template metadata (13 items: id, name, icon, description, colors, section titles). The full section configs (which include all default text in both EN and AR for every block) are only needed during site creation — a server-side operation.

### Solution: Split into Metadata + Server Config

**Step 1: Extract metadata-only list**

```ts
// src/config/industry-templates-meta.ts
// No "use server" needed — this file contains no secrets and is imported in both
// client (for display) and server (for site creation)

export interface IndustryTemplateMeta {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  description: string;
  descriptionAr: string;
  sectionTitles: string[];
  defaultColors: { primary: string; secondary: string };
}

export const industryTemplatesMeta: IndustryTemplateMeta[] = [
  {
    id: "company",
    name: "Company",
    nameAr: "شركة",
    icon: "building-2",
    description: "Professional corporate website",
    descriptionAr: "موقع شركة احترافي",
    sectionTitles: ["Navbar", "Hero", "About", "Services", "Stats", "Clients", "Testimonials", "Contact", "Footer"],
    defaultColors: { primary: "#2563EB", secondary: "#7C3AED" },
  },
  // ... 12 more
];
```

**Step 2: Keep full configs server-only**

```ts
// src/config/industry-templates.server.ts
// This file is NEVER imported in client components
// Only used in API routes and server actions

import type { IndustryTemplate } from "./industry-templates-meta";
// ... full config data
export const industryTemplates: IndustryTemplate[] = [ /* ... full data */ ];
```

**Step 3: Update the new-site page**

```tsx
// src/app/(dashboard)/dashboard/new/page.tsx
// Convert from "use client" to server component for data loading
import { industryTemplatesMeta } from "@/config/industry-templates-meta";
import { NewSiteClient } from "@/components/dashboard/new-site-client";

export default function NewSitePage() {
  return <NewSiteClient templates={industryTemplatesMeta} />;
}
```

**Step 4: Update the site creation API**

```ts
// src/app/api/sites/route.ts
import { industryTemplates } from "@/config/industry-templates.server";
// Full config only needed here, on the server
```

**Expected Impact:** Removes ~120KB of config data from the client bundle. The new-site page loads faster.

---

## Recommendation 3: Fix tsParticles API Issue

### Problem
The project memory notes "TypeScript errors in demo hero files (tsParticles `init` prop deprecated)." The tsParticles library went through a major API change between v2 and v3, and the `init` prop on the `<Particles>` component was replaced by a different initialization pattern.

### Solution: Update to tsParticles v3 Pattern

**Old pattern (deprecated in tsParticles v3+):**
```tsx
// BROKEN — init prop no longer exists
<Particles
  id="tsparticles"
  init={particlesInit}
  options={particlesConfig}
/>
```

**New pattern (tsParticles v3):**
```tsx
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState } from "react";

export function HeroWithParticles({ config, language }: BlockProps) {
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setEngineReady(true));
  }, []);

  if (!engineReady) return null;

  return (
    <Particles
      id="tsparticles"
      options={particlesConfig}
    />
  );
}
```

**Additionally:** tsParticles should only be loaded in templates that use it, not globally. The `initParticlesEngine` call should happen in a per-template `useEffect` with proper cleanup.

**Install the correct packages:**
```bash
npm install @tsparticles/react @tsparticles/slim
# Remove the old "tsparticles" package if present
```

---

## Recommendation 4: Implement RTL Toggle in Dashboard

### Problem
The dashboard shell is English-only with no RTL support. Arabic-speaking users must interact with an English admin interface even when managing Arabic sites.

### Solution: Language-Aware Dashboard Shell

**Step 1: Add user language preference to the database**

```sql
-- Add to users table via Drizzle migration
ALTER TABLE users ADD COLUMN ui_language TEXT NOT NULL DEFAULT 'en';
```

**Step 2: Update session to include UI language**

```ts
// src/auth.ts
// Include uiLanguage in the session/JWT token
```

**Step 3: Update DashboardShell to accept and apply language**

```tsx
// src/components/dashboard/dashboard-shell.tsx
export function DashboardShell({
  userName,
  uiLanguage = "en",
  children,
}: {
  userName: string;
  uiLanguage?: "en" | "ar";
  children: React.ReactNode;
}) {
  const isRtl = uiLanguage === "ar";

  return (
    <div
      className="min-h-screen bg-gray-50"
      dir={isRtl ? "rtl" : "ltr"}
      lang={uiLanguage}
    >
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
        {/* Use logical properties: ps/pe instead of pl/pr */}
        <Link href="/dashboard" className="text-lg font-bold ...">
          {isRtl ? "صفحاتي" : "Safahati"}
        </Link>
        {/* Language toggle button */}
        <LanguageToggle currentLang={uiLanguage} />
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
```

**Step 4: Replace directional Tailwind classes with logical properties**

Run a systematic find-and-replace in dashboard components:

| Replace | With |
|---|---|
| `pl-4` | `ps-4` |
| `pr-4` | `pe-4` |
| `ml-2` | `ms-2` |
| `mr-2` | `me-2` |
| `text-left` | `text-start` |
| `text-right` | `text-end` |
| `left-0` | `start-0` |
| `right-0` | `end-0` |

---

## Recommendation 5: Replace `window.confirm()` with shadcn Dialog

### Problem
Two places use `window.confirm()`: delete site (dashboard) and unpublish site (editor). These are browser-native dialogs that cannot be styled and are blocked in certain embedded environments.

### Solution: Add `<ConfirmDialog>` Component

```tsx
// src/components/ui/confirm-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "default" | "destructive";
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  variant = "destructive",
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            className={variant === "destructive" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**Usage in dashboard:**
```tsx
// Replace window.confirm pattern
const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

<ConfirmDialog
  open={deleteTarget !== null}
  title={`Delete "${sites.find(s => s.id === deleteTarget)?.name}"?`}
  description="This action cannot be undone. The site and all its sections will be permanently deleted."
  confirmLabel="Delete Site"
  onConfirm={() => { handleDelete(deleteTarget!); setDeleteTarget(null); }}
  onCancel={() => setDeleteTarget(null)}
/>
```

---

## Recommendation 6: Improve Component Registry Pattern

### Problem
The `iconMap` in `section-list.tsx` and `content-editor-panel.tsx` is incomplete — most block types fall back to `LayoutGrid`. This is because the block registry's `icon` field stores a string name (`"menu"`, `"layout-grid"`) but there is no centralized icon resolution map.

### Solution: Move Icon Resolution into the Registry

```ts
// src/lib/registry.ts — add icon resolution

import {
  Menu, LayoutGrid, PanelBottom, Star, Info, Briefcase, Zap,
  MessageSquare, Users, BarChart2, Users2, Tag, Megaphone,
  HelpCircle, Mail, type LucideIcon
} from "lucide-react";

const BLOCK_ICONS: Record<string, LucideIcon> = {
  navbar: Menu,
  hero: Star,
  about: Info,
  services: Briefcase,
  features: Zap,
  testimonials: MessageSquare,
  clients: Users,
  stats: BarChart2,
  team: Users2,
  pricing: Tag,
  cta: Megaphone,
  faq: HelpCircle,
  contact: Mail,
  footer: PanelBottom,
};

export function getBlockIcon(type: BlockType): LucideIcon {
  return BLOCK_ICONS[type] ?? LayoutGrid;
}
```

Then remove all `iconMap` objects from `section-list.tsx` and `content-editor-panel.tsx` and use `getBlockIcon(section.blockType)` instead.

---

## Recommendation 7: Optimize Font Loading

### Problem
All 11 Google Fonts are loaded in the root layout, adding unnecessary download weight on pages that only need 1 font.

### Solution: Font Variable Strategy

**Option A (Recommended): Load all fonts but with CSS font-display: optional**

All fonts are already using `display: "swap"`. Change critical fonts (Inter, Cairo) to `display: "swap"` and non-critical fonts to `display: "optional"` to prevent layout shift while still loading them:

```ts
const amiri = Amiri({
  // ...
  display: "optional", // won't cause layout shift, won't block rendering
});
```

**Option B: Per-route font loading**

For the admin dashboard (which only uses Geist/Inter), only load Inter. For published site routes, load all 11 fonts. This requires splitting the root layout, which breaks the Next.js App Router design pattern slightly but is technically achievable via `generateMetadata` and route-specific layouts.

For the near term, Option A (display: optional for non-primary fonts) is the pragmatic choice.

---

## Recommendation 8: Add Error Boundaries to Editor

### Problem
A runtime error in any block template component will crash the entire editor with no recovery.

### Solution: Per-Section Error Boundary

```tsx
// src/components/blocks/section-error-boundary.tsx
"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  sectionId: string;
  blockType: string;
  children: ReactNode;
}

interface State { hasError: boolean; error: Error | null }

export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`Section error [${this.props.blockType}]:`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="border-2 border-dashed border-red-300 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-600">
            This section failed to render
          </p>
          <p className="text-xs text-red-400 mt-1">
            {this.state.error?.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-xs text-red-500 underline mt-2"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

**Usage in editor-client.tsx:**
```tsx
{sections.filter(s => s.isVisible).map((section) => (
  <SectionErrorBoundary
    key={section.id}
    sectionId={section.id}
    blockType={section.blockType}
  >
    <div className="relative cursor-pointer" onClick={...}>
      <BlockRenderer section={section} language={language} />
    </div>
  </SectionErrorBoundary>
))}
```

---

## Recommendation 9: Add Toast Notifications

### Problem
Save failures are silently caught with only a `console.error`. Users receive no feedback when saves fail, or any positive confirmation beyond the button state change.

### Solution: Install Sonner

```bash
npm install sonner
```

```tsx
// src/app/layout.tsx — add Toaster
import { Toaster } from "sonner";

// In RootLayout:
<body ...>
  {children}
  <Toaster position="bottom-right" richColors />
</body>
```

```tsx
// src/components/editor/editor-client.tsx
import { toast } from "sonner";

const handleSave = useCallback(async () => {
  setSaving(true);
  try {
    await fetch(/* ... */);
    await fetch(/* ... */);
    useEditorStore.setState({ isDirty: false });
    // Don't toast on success — the button state change is sufficient feedback
  } catch (err) {
    console.error("Save failed:", err);
    toast.error("Save failed. Please check your connection and try again.");
  } finally {
    setSaving(false);
  }
}, [/* ... */]);
```

---

## Recommendation 10: Use `crypto.randomUUID()` for Section IDs

### Problem
```ts
id: Date.now().toString(),
```

### Fix
```ts
id: crypto.randomUUID(), // Available in all modern browsers + Node.js 19+
```

This is a one-line fix but eliminates a potential ID collision bug.

---

## Priority Summary

| Recommendation | Effort | Impact | Priority |
|---|---|---|---|
| Lazy-load block templates | High | Very High (perf) | P1 |
| Move industry-templates to server | Medium | High (bundle size) | P1 |
| Fix tsParticles API | Low | High (fixes TS errors) | P1 |
| Add toast notifications | Low | High (UX) | P1 |
| Replace window.confirm() | Low | Medium (UX + polish) | P1 |
| Use crypto.randomUUID() | Trivial | Low (correctness) | P1 |
| Add error boundaries | Low | High (stability) | P2 |
| RTL toggle in dashboard | High | Very High (MENA market) | P2 |
| Improve icon registry | Low | Low (code quality) | P3 |
| Optimize font loading | Medium | Medium (performance) | P3 |
