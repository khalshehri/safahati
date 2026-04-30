# Sprint 1 Task Breakdown — Developer-Ready
## Safahati Platform — Non-Technical User Features

**Sprint Duration:** 2 weeks (April 28 – May 9, 2026)  
**Total Estimated Hours:** 60 hours (FE: 35h, BE: 25h)  
**Goal:** Ship 5 foundation features for non-technical users: Wizard, WhatsApp integration, Opening Hours, Plain Language Admin, Auto-Save + Undo Indicator

---

## A. Sprint Overview & Key Metrics

| Metric | Value |
|--------|-------|
| **Total Tasks** | 26 |
| **FE Tasks** | 12 |
| **BE Tasks** | 10 |
| **QA Tasks** | 4 |
| **Estimated FE Hours** | 35 |
| **Estimated BE Hours** | 25 |
| **Estimated QA Hours** | 5 |
| **Blocked on Pre-Sprint** | Schema updates, migration creation |

**Pre-Sprint Checklist (Must Complete Before Sprint Starts):**
- [ ] Apply Drizzle schema changes (schema.ts updated with wizard_drafts, opening_hours, WhatsApp columns)
- [ ] Run `drizzle-kit generate` to create migrations
- [ ] Run migrations on test DB
- [ ] Verify no schema drift issues remain

---

## B. Feature 1: "Build My Site in 5 Minutes" Wizard

Epic: **EP-01**  
User Stories: **US-01, US-02, US-03**  
Acceptance Criteria: An 8-step wizard that generates a complete site with template sections from user answers

### FE Tasks

#### FE-001: Create WizardShell Component with Progress Indicator
- **Estimated Hours:** 4
- **Depends On:** BE-001 (schema ready), Design assets approved
- **Files to Create/Modify:**
  - `src/components/wizard/WizardShell.tsx` (new)
  - `src/components/wizard/StepIndicator.tsx` (new)
  - `src/components/wizard/WizardLayout.tsx` (new)
  - `src/app/(auth)/wizard/page.tsx` (new)

**Acceptance Criteria:**
- [ ] Progress indicator displays "Step X of 8" with a visual progress bar
- [ ] Progress bar fills left-to-right on LTR, right-to-left on RTL
- [ ] Wizard shell renders in full-screen mode, no dashboard chrome visible
- [ ] RTL layout works correctly (Arabic text, right-aligned)
- [ ] Navigation buttons (Back, Next) visible and accessible
- [ ] Mobile responsive: full-width on mobile without horizontal scroll

**Implementation Notes:**
- Use Tailwind CSS with logical properties (ps/pe, ms/me)
- Progress bar can use Framer Motion for smooth fill animation
- Wizard is accessible via `/wizard` route (logged-in users only)
- Styling should match design system colors and typography

---

#### FE-002: Implement 8 Wizard Step Components
- **Estimated Hours:** 8
- **Depends On:** FE-001, useWizardStore (FE-003)
- **Files to Create:**
  - `src/components/wizard/steps/Step1BusinessType.tsx` (select from 13 industry cards)
  - `src/components/wizard/steps/Step2SiteName.tsx` (text input, max 60 chars)
  - `src/components/wizard/steps/Step3ServiceOfferingOrMenu.tsx` (textarea, industry-specific)
  - `src/components/wizard/steps/Step4AreaOfExpertiseOrCuisine.tsx` (multi-select chips, industry-specific)
  - `src/components/wizard/steps/Step5PreferredContact.tsx` (radio: WhatsApp/phone/form)
  - `src/components/wizard/steps/Step6OpeningHoursQuick.tsx` (day/time pickers)
  - `src/components/wizard/steps/Step7BusinessDescription.tsx` (textarea, "Help me write" button deferred to Sprint 3)
  - `src/components/wizard/steps/Step8ReviewSummary.tsx` (review all answers, edit links)

**Acceptance Criteria:**
- [ ] All 8 steps render with correct input types (select, text, tel, upload, color picker, textarea, radio, review)
- [ ] Step 1 shows 13 industry cards (not a dropdown)
- [ ] Step 2 enforces max 60 char limit with character counter
- [ ] Step 3–4 questions adapt based on Step 1 industry selection (restaurant vs freelancer vs clinic show different Qs)
- [ ] Step 6 has day-of-week selector and time pickers for open/close times
- [ ] Step 7 shows "Help me write" button (disabled/grayed out with tooltip "Coming soon")
- [ ] Step 8 shows summary of all answers with individual "Edit" links next to each
- [ ] All steps support both English and Arabic text input
- [ ] Mobile-optimized: input fields full-width, keyboard doesn't obscure Next button

**Implementation Notes:**
- Industry-specific logic lives in `src/lib/wizard-config.ts` (maps businessType → questions)
- Step 6 (opening hours) collects simple day/open/close times (not stored yet, just collected)
- File uploads on Step 6 go to MinIO (deferred validation — just accept upload for now)
- Character counter on Step 2 uses real-time input onChange

---

#### FE-003: Implement useWizardStore (Zustand State Management)
- **Estimated Hours:** 3
- **Depends On:** No external dependencies
- **Files to Create:**
  - `src/stores/useWizardStore.ts` (new)

**Acceptance Criteria:**
- [ ] State persists to localStorage under key `wizard_draft`
- [ ] State shape: `{ currentStep, answers: Record<stepNum, value>, industry, completedSteps }`
- [ ] `setStep(n)` changes active step
- [ ] `updateAnswer(stepNum, value)` saves answer and auto-persists to localStorage
- [ ] `loadFromStorage()` on mount restores previous session
- [ ] `resetWizard()` clears all data (used after successful site creation)
- [ ] Zustand selector `useWizardStore` allows component-level subscriptions
- [ ] History: localStorage key is unique per user (userId + "_wizard_draft")

**Implementation Notes:**
- Create hook utilities: `useCurrentStep()`, `useWizardAnswers()`, `useIsAnswered(stepNum)`
- localStorage is a fallback; server draft is the source of truth (BE-002)
- Export test utils for Jest: `getWizardState()`, `setWizardState()` for testing

---

#### FE-004: Wire Wizard to Backend API (GET/POST /api/wizard)
- **Estimated Hours:** 4
- **Depends On:** BE-002 (wizard API endpoints), FE-003 (state management)
- **Files to Create/Modify:**
  - `src/lib/api/wizard.ts` (new, API client functions)
  - `src/components/wizard/WizardShell.tsx` (modify to call API)
  - `src/hooks/useWizardSync.ts` (new, auto-sync to server)

**Acceptance Criteria:**
- [ ] On wizard mount, fetch GET /api/wizard and populate useWizardStore if draft exists
- [ ] When user clicks Next, save current step via POST /api/wizard with body `{ step, answers }`
- [ ] API response returns `{ success, draft: { currentStep, answers } }`
- [ ] On validation error (400), show inline error toast and don't advance
- [ ] On network error, show retry button ("Try again")
- [ ] On successful step save, localStorage and server stay in sync
- [ ] Final step (Step 8) calls POST /api/wizard/complete instead of normal POST
- [ ] Complete response returns `{ success, siteId, siteUrl }` and redirects to site editor or publish preview

**Implementation Notes:**
- Use `fetch` with error boundary; export reusable `apiCall()` utility for consistency
- Debounce auto-saves if user is typing (500ms delay after last keystroke)
- On Step 8 submit, disable button and show loading spinner

---

### BE Tasks

#### BE-001: Create wizard_drafts Table & Drizzle Migration
- **Estimated Hours:** 2
- **Depends On:** None (but must be first in sprint)
- **Files to Create/Modify:**
  - `src/lib/db/schema.ts` (add wizard_drafts table definition)
  - `drizzle/migrations/[timestamp]_add_wizard_drafts.sql` (auto-generated by drizzle-kit)

**Acceptance Criteria:**
- [ ] `wizard_drafts` table created with columns:
  - `id` (text, primary key, UUID)
  - `userId` (text, FK to users.id, unique, cascade delete)
  - `currentStep` (integer, default 1)
  - `answers` (text, JSON, default "{}")
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)
  - `expiresAt` (timestamp, nullable, for 30-day auto-cleanup)
- [ ] Migration runs without error on test DB
- [ ] Drizzle ORM schema compiles without TS errors
- [ ] Index on `userId` for fast lookups
- [ ] One-to-one relationship: each user has max one active draft (upsert pattern)

**Implementation Notes:**
- Run `npm run drizzle:generate` after schema update to auto-create migration
- Columns store JSON stringified answers, not separate columns per field (flexible for industry branching)
- `expiresAt` is used by a future cleanup job (not in Sprint 1)

---

#### BE-002: Implement GET/POST /api/wizard Endpoints
- **Estimated Hours:** 3
- **Depends On:** BE-001 (schema), auth middleware
- **Files to Create:**
  - `src/app/api/wizard/route.ts` (new, GET and POST)

**Acceptance Criteria - GET /api/wizard:**
- [ ] Requires auth (401 if not logged in)
- [ ] Returns user's current wizard draft or 404 if none exists
- [ ] Response shape: `{ success: true, draft: { id, currentStep, answers, updatedAt } }`
- [ ] `answers` is parsed JSON (not a string)

**Acceptance Criteria - POST /api/wizard:**
- [ ] Requires auth and JSON body: `{ step: number, answers: Record }`
- [ ] Validates `step` is 1–8
- [ ] Validates required fields per step (Zod schema in `src/lib/validation/wizard.ts`)
  - Step 1: businessType must be one of 13 industries
  - Step 2: siteName required, max 60 chars
  - Step 3–7: no validation needed (optional fields)
  - Step 8: placeholder validation (step complete)
- [ ] Creates draft if doesn't exist; updates if exists (upsert pattern)
- [ ] Returns `{ success: true, draft: { id, currentStep, answers, updatedAt } }`
- [ ] On validation error, returns 400 with `{ success: false, errors: { fieldName: "message" } }`
- [ ] No site creation on POST /api/wizard (only progress saving)

**Implementation Notes:**
- Use Drizzle's `insert().onConflictDoUpdate()` for upsert
- Validation schema for each step in separate file: `src/lib/validation/wizard-steps.ts`
- Return 409 (Conflict) if `updatedAt` mismatch (optimistic locking for concurrent edits)

---

#### BE-003: Implement POST /api/wizard/complete Endpoint
- **Estimated Hours:** 4
- **Depends On:** BE-002 (draft exists), industry templates config
- **Files to Create:**
  - `src/app/api/wizard/complete/route.ts` (new)
  - `src/lib/wizard-generator.ts` (new, logic to create site from wizard answers)

**Acceptance Criteria:**
- [ ] Requires auth and GET request (no body needed, use session wizard draft)
- [ ] Validates draft exists and currentStep === 8
- [ ] Validates all required fields are present (full Zod schema check)
- [ ] Creates a new site in `sites` table with:
  - `userId` from session
  - `name` from answers.siteName
  - `slug` auto-generated from name (slugify, ensure unique)
  - `industry` from answers.businessType
  - `language` from answers.businessLanguage (or detect from session)
  - `status` = "draft"
  - `theme` = default theme for industry (JSON stringified)
  - `publishedAt` = null
- [ ] Generates template sections:
  - Query industry template from config
  - Create 13 (or more) sections using template's section definitions
  - Insert each section into `sections` table with `siteId`, `blockType`, `templateId`, `config` (pre-populated from answers)
- [ ] Inserts opening hours into `opening_hours` table if provided in Step 6
- [ ] Deletes wizard draft from `wizard_drafts` table (cleanup)
- [ ] Returns `{ success: true, siteId, siteUrl, editUrl }`
- [ ] On error (industry template not found, DB constraint), returns 400 with error message

**Implementation Notes:**
- Template config loading: `import { industryTemplates } from '@/config/industry-templates'`
- Section population: For each template section, inject wizard answers into config
  - Hero section: use siteName, businessDescription
  - About section: use serviceOffering
  - Contact section: pre-populate WhatsApp from answers
  - Opening hours: pull from Step 6 collection
- `siteUrl` = `https://{slug}.safahati.com` or staging equivalent
- `editUrl` = `/sites/{siteId}/editor`

---

#### BE-004: Create Industry-Specific Question Configuration
- **Estimated Hours:** 2
- **Depends On:** None (config-only, no DB changes)
- **Files to Create:**
  - `src/lib/wizard-config.ts` (new)

**Acceptance Criteria:**
- [ ] Export `WIZARD_INDUSTRIES` with all 13 industry types and metadata:
  ```ts
  {
    id: 'restaurant',
    name: 'Restaurant',
    nameAr: 'مطعم',
    icon: <ChefHat />,
    step3Question: 'What are your main dishes?',
    step3QuestionAr: 'ما هي الأطباق الرئيسية لديك؟',
    step4Question: 'What type of cuisine?',
    step4QuestionAr: 'ما نوع الطعام؟',
    step4Options: ['Italian', 'Arabic', 'Asian', ...],
    step5PreferredContact: 'WhatsApp', // pre-select for restaurants
  }
  ```
- [ ] Implement `getIndustryConfig(industryId)` function that returns question text per step
- [ ] All question text in both EN and AR
- [ ] 13 industries supported: Company, Agency, Freelancer, Resume, Restaurant, Clinic, Real Estate, SaaS, E-commerce, Event, Photography, Law Firm, Gym

**Implementation Notes:**
- Used by FE-002 (dynamic step rendering) and BE-003 (template selection)
- Keep separate from `industry-templates.ts` (that file is for template design)

---

### QA Tasks

#### QA-001: Write and Execute Wizard Happy Path Test
- **Estimated Hours:** 2
- **Depends On:** FE-004, BE-003 (fully integrated)
- **Files to Create:**
  - `src/__tests__/integration/wizard-happy-path.test.ts` (new)

**Acceptance Criteria:**
- [ ] Test covers: Steps 1–8, all inputs valid, site created successfully
- [ ] Validates at each step: form submits, data persists in Zustand store
- [ ] Validates Step 8: summary shows all answers correctly
- [ ] Validates POST /api/wizard/complete: site created, 13 sections inserted, wizard draft deleted
- [ ] Validates site response: siteId, siteUrl, editUrl returned
- [ ] Test uses in-memory DB (or test DB) to avoid polluting production
- [ ] Test creates a test user before starting wizard

**Implementation Notes:**
- Use Jest + `@testing-library/react` for FE assertions
- Use supertest for BE API assertions
- Seed test DB with one industry template before running
- Mock MinIO for file uploads if needed (but Step 6 upload not persisted yet)

---

#### QA-002: Write Wizard Validation Error Cases
- **Estimated Hours:** 1.5
- **Depends On:** BE-002, FE-002
- **Files to Create:**
  - `src/__tests__/integration/wizard-validation.test.ts` (new)

**Acceptance Criteria:**
- [ ] Step 1: Invalid industry returns 400 with error message
- [ ] Step 2: Blank siteName returns error, advances are blocked
- [ ] Step 2: siteName > 60 chars returns error
- [ ] Step 2: Special characters in siteName handled gracefully
- [ ] Step 8: Missing required fields (e.g., no businessType) returns 400
- [ ] API returns proper error shape: `{ success: false, errors: { field: "message" } }`
- [ ] FE shows inline validation errors, user can fix and resubmit

---

#### QA-003: Wizard Persistence & Resume Test
- **Estimated Hours:** 1
- **Depends On:** FE-003, BE-002
- **Files to Create:**
  - `src/__tests__/integration/wizard-resume.test.ts` (new)

**Acceptance Criteria:**
- [ ] User fills Steps 1–3, closes browser (simulated via session reset)
- [ ] On login, wizard resumes at Step 4 with previous answers populated
- [ ] Answers in Zustand store match server draft
- [ ] localStorage and server are in sync
- [ ] User can now complete from Step 4 without re-entering Steps 1–3

---

---

## C. Feature 2: WhatsApp Integration

Epic: **EP-02**  
User Stories: **US-04, US-05**  
Acceptance Criteria: One phone number field → floating WhatsApp button on site, customizable message

### FE Tasks

#### FE-005: Create WhatsApp Configuration Panel in Editor
- **Estimated Hours:** 2
- **Depends On:** Existing editor state (useEditorStore), Theme panel components
- **Files to Create/Modify:**
  - `src/components/editor/contact-settings-panel.tsx` (new, or extend existing if one exists)
  - `src/components/blocks/contact/whatsapp-config.tsx` (new)

**Acceptance Criteria:**
- [ ] Contact section settings show "WhatsApp Button" as the primary option
- [ ] Phone number input accepts international format (e.g., +966501234567)
- [ ] If user enters local format (e.g., 0501234567), auto-format to international on blur
- [ ] Optional text field: "Custom message" (max 160 chars) with live character counter
- [ ] Default message preview: "Hello, I saw your site and would like to inquire"
- [ ] Both fields bilingual labels (EN/AR)
- [ ] Phone validation: show error if format invalid (inline message)
- [ ] Save button disabled until phone number is valid
- [ ] Changes auto-save after 1 second of inactivity (debounced)

**Implementation Notes:**
- Phone formatting: use `libphonenumber-js` library for E.164 validation
- Store config in section's `config` JSON: `{ phoneNumber: "+966...", customMessage: "..." }`
- Auto-focus phone field for quick entry

---

#### FE-006: Implement WhatsApp Floating Button Component
- **Estimated Hours:** 2
- **Depends On:** Existing site renderer, FE-005 (config)
- **Files to Create:**
  - `src/components/blocks/contact/whatsapp-button.tsx` (new)

**Acceptance Criteria:**
- [ ] Floating green WhatsApp button visible bottom-right (RTL: bottom-left)
- [ ] Button uses official WhatsApp icon
- [ ] On click, opens `https://wa.me/{phoneNumber}?text={customMessage}` (mobile) or web.whatsapp.com (desktop)
- [ ] On mobile, WhatsApp app opens directly (if installed)
- [ ] Button doesn't overlap critical content (e.g., footer buttons)
- [ ] Smooth entrance animation (fade + slide-in from bottom)
- [ ] Accessible: `aria-label="Contact via WhatsApp"` with bilingual support
- [ ] Button visible on all pages of the site
- [ ] Respects `prefers-reduced-motion` (no animation if set)

**Implementation Notes:**
- Use Framer Motion for entrance animation
- Position: `fixed bottom-6 right-6` (LTR) or `bottom-6 left-6` (RTL)
- Color: Tailwind `bg-green-500` with hover darkening
- Message encoding: use `encodeURIComponent()` for special characters

---

### BE Tasks

#### BE-005: Add WhatsApp Column to sites Table & Migration
- **Estimated Hours:** 1
- **Depends On:** BE-001 (migration setup)
- **Files to Create/Modify:**
  - `src/lib/db/schema.ts` (add `whatsapp` column if not already present)
  - Migration file (if needed)

**Acceptance Criteria:**
- [ ] `sites.whatsapp` column exists (text, nullable)
- [ ] Drizzle schema compiles without error
- [ ] Old sites have whatsapp = null (no migration data loss)
- [ ] New sites can have whatsapp set on creation

**Implementation Notes:**
- Column was mentioned as "schema drift" in architect doc — may already exist in DB
- If already exists, just ensure Drizzle schema reflects it
- No custom message storage yet (deferred to contact section config)

---

#### BE-006: Implement Contact Section Config API
- **Estimated Hours:** 2
- **Depends On:** Existing section update endpoints
- **Files to Create/Modify:**
  - Extend `src/app/api/sites/[siteId]/sections/[sectionId]/route.ts` (or create if doesn't exist)

**Acceptance Criteria:**
- [ ] PATCH /api/sites/{siteId}/sections/{sectionId} accepts `config` JSON with:
  - `{ phoneNumber: "+966...", customMessage: "..." }`
- [ ] Validates phoneNumber format (E.164), returns 400 if invalid
- [ ] Validates customMessage length <= 160 chars
- [ ] Updates section in DB: `sections.config` JSONB
- [ ] Returns updated section: `{ sectionId, config, updatedAt }`
- [ ] Requires auth and ownership check (user owns site)

**Implementation Notes:**
- Use `libphonenumber-js` for validation on BE too
- Store as stringified JSON in `sections.config`
- No WhatsApp column needed if storing in section config (cleaner approach)

---

### QA Tasks

#### QA-004: Test WhatsApp Button Configuration and Rendering
- **Estimated Hours:** 1
- **Depends On:** FE-006, BE-006
- **Files to Create:**
  - `src/__tests__/integration/whatsapp-button.test.ts` (new)

**Acceptance Criteria:**
- [ ] User can set phone number in editor, button appears on site
- [ ] Invalid phone format shows error, button doesn't render
- [ ] Valid phone number formats (various international formats) all work
- [ ] Custom message is used in WhatsApp link
- [ ] Desktop click opens web.whatsapp.com, mobile opens app
- [ ] Button position correct in RTL layout

---

---

## D. Feature 3: Opening Hours Component

Epic: **EP-06**  
User Stories: **US-12, US-13**  
Acceptance Criteria: Day-by-day open/close times, "Closed" toggle, displays intelligently based on current time

### FE Tasks

#### FE-007: Create Opening Hours Editor Panel
- **Estimated Hours:** 3
- **Depends On:** Existing editor UI components, useEditorStore
- **Files to Create:**
  - `src/components/blocks/opening-hours/opening-hours-editor.tsx` (new)
  - `src/components/blocks/opening-hours/day-time-input.tsx` (new)

**Acceptance Criteria:**
- [ ] Shows 7 days of week (Sun–Sat) as rows or tabs
- [ ] Each day has:
  - [ ] "Closed" toggle (checkbox or switch)
  - [ ] "Open" time picker (HH:MM, 24-hour format)
  - [ ] "Close" time picker (HH:MM, 24-hour format)
  - [ ] "Open" and "Close" fields disabled when "Closed" is toggled on
- [ ] Time pickers are native HTML5 `<input type="time">` for mobile-friendly UX
- [ ] Can set business hours for each day independently
- [ ] "Copy to all days" button (for users with same hours Mon–Fri)
- [ ] Save button persists to section config
- [ ] Bilingual: day names in Arabic when language = AR

**Implementation Notes:**
- Day order: Sunday first (standard in Middle East/Saudi)
- Store config format: `{ hours: [{ dayOfWeek: 0, openTime: "09:00", closeTime: "17:00", isClosed: false }, ...] }`
- Time pickers can use Radix or shadcn/ui time picker if available, else fallback to HTML5 native

---

#### FE-008: Implement Opening Hours Display Block
- **Estimated Hours:** 2
- **Depends On:** FE-007 (config), existing template system
- **Files to Create:**
  - `src/components/blocks/opening-hours/opening-hours-display.tsx` (new)
  - `src/components/blocks/opening-hours/current-status.tsx` (new)

**Acceptance Criteria:**
- [ ] Displays opening hours table (day | open time | close time) or a clean vertical list
- [ ] Shows "OPEN NOW" or "CLOSED" status based on current time
- [ ] Status color: green for open, red for closed
- [ ] For today's row, highlight with subtle background color
- [ ] If multiple locations supported (future), show location tabs
- [ ] Mobile responsive: stack rows vertically
- [ ] RTL compatible: day names and times correctly positioned
- [ ] Bilingual: day names and status text in user's language

**Implementation Notes:**
- Current time calculated in browser (client-side), use `new Date()` and timezone from user
- "OPEN NOW" calculation: if current time >= openTime AND <= closeTime AND not isClosed
- Timezone: use user's browser timezone (Intl API), document limitation in AC

---

### BE Tasks

#### BE-007: Create opening_hours Table & Migration
- **Estimated Hours:** 1
- **Depends On:** BE-001 (schema setup)
- **Files to Create/Modify:**
  - `src/lib/db/schema.ts` (add opening_hours table)
  - Migration file

**Acceptance Criteria:**
- [ ] `opening_hours` table with columns:
  - `id` (text, PK, UUID)
  - `siteId` (text, FK to sites.id, cascade delete)
  - `dayOfWeek` (integer, 0–6)
  - `openTime` (text, HH:MM format, nullable)
  - `closeTime` (text, HH:MM format, nullable)
  - `isClosed` (boolean, default false)
  - `createdAt`, `updatedAt` (timestamps)
- [ ] Unique constraint: (siteId, dayOfWeek) — one entry per day per site
- [ ] Migration runs without error
- [ ] Drizzle schema compiles

**Implementation Notes:**
- Index on siteId for fast lookup
- No timezone column (feature scoped to single timezone per site for now)

---

#### BE-008: Implement Opening Hours CRUD API
- **Estimated Hours:** 2
- **Depends On:** BE-007 (schema), BE-001 (migrations)
- **Files to Create:**
  - `src/app/api/sites/[siteId]/opening-hours/route.ts` (GET, POST/PUT all 7 days)

**Acceptance Criteria - GET /api/sites/{siteId}/opening-hours:**
- [ ] Returns array of 7 days with their hours
- [ ] If no opening hours exist, returns default (Mon–Fri 9–5, Sat–Sun closed)
- [ ] Response: `{ success: true, hours: [{ dayOfWeek, openTime, closeTime, isClosed }, ...] }`

**Acceptance Criteria - POST/PUT /api/sites/{siteId}/opening-hours:**
- [ ] Body: `{ hours: [{ dayOfWeek, openTime, closeTime, isClosed }, ...] }`
- [ ] Validates: each entry has dayOfWeek 0–6
- [ ] Validates: openTime and closeTime in HH:MM format (if not isClosed)
- [ ] Validates: openTime < closeTime (if not isClosed)
- [ ] Upserts all 7 days (delete existing, insert new ones)
- [ ] Returns updated hours
- [ ] Requires auth and ownership check

**Implementation Notes:**
- Use transaction: delete all 7 days for site, then insert new ones
- Validation: `openTime` must be < `closeTime` if day is open
- If `isClosed` is true, openTime/closeTime ignored (can be null)

---

### QA Tasks

#### QA-005: Test Opening Hours Configuration and Display
- **Estimated Hours:** 1
- **Depends On:** FE-008, BE-008
- **Files to Create:**
  - `src/__tests__/integration/opening-hours.test.ts` (new)

**Acceptance Criteria:**
- [ ] User can set hours for each day of week
- [ ] "Closed" toggle disables time pickers
- [ ] Opening hours saved and retrieved correctly
- [ ] Display shows correct "OPEN NOW" / "CLOSED" status
- [ ] Test at different times (morning, evening, midnight)
- [ ] RTL layout renders correctly

---

---

## E. Feature 4: Plain Language Admin Labels

Epic: **EP-13**  
User Stories: **US-26, US-27**  
Acceptance Criteria: Rename complex field labels in editor to plain language, bilingual

### FE Tasks

#### FE-009: Create Plain Language Label System
- **Estimated Hours:** 1
- **Depends On:** None
- **Files to Create:**
  - `src/lib/plain-labels.ts` (new)

**Acceptance Criteria:**
- [ ] Export `PLAIN_LABELS` object mapping field names to plain EN/AR labels
- [ ] Example mappings:
  ```ts
  {
    blockType: { en: 'Component Type', ar: 'نوع المكون' },
    templateId: { en: 'Layout Style', ar: 'نمط التخطيط' },
    config.title: { en: 'Your Heading', ar: 'عنوانك' },
    config.description: { en: 'Your Description', ar: 'وصفك' },
    sortOrder: { en: 'Display Order', ar: 'ترتيب العرض' },
  }
  ```
- [ ] Export `getPlainLabel(fieldPath, language)` function
- [ ] Fallback to field name if no plain label exists (graceful degradation)
- [ ] Covers all major fields in: section editing, theme customization, site settings

**Implementation Notes:**
- Use dot notation for nested fields: `config.title`, `config.ctaButtonText`, etc.
- Maintenance: keep in sync with component schemas
- Consider i18n integration later (for now, hardcoded EN/AR)

---

#### FE-010: Apply Plain Labels Throughout Editor UI
- **Estimated Hours:** 2
- **Depends On:** FE-009
- **Files to Modify:**
  - `src/components/editor/content-editor-panel.tsx`
  - `src/components/editor/theme-editor-panel.tsx`
  - `src/components/blocks/*/editor.tsx` (all block editors)
  - `src/app/(dashboard)/dashboard/page.tsx` (site list labels)

**Acceptance Criteria:**
- [ ] All field labels in editor use `getPlainLabel()` instead of raw field names
- [ ] "Block Type" instead of "blockType"
- [ ] "Display Order" instead of "sortOrder"
- [ ] "Your Heading" instead of "config.title" or "title"
- [ ] All labels bilingual (switch with user's language preference)
- [ ] No "technical" language visible to users (no camelCase, no "config", no "template", no "section")
- [ ] Tooltips available for complex fields (deferred to Sprint 2)

**Implementation Notes:**
- Replace `<label>{field}</label>` with `<label>{getPlainLabel(field, language)}</label>`
- Export utility hook: `usePlainLabel(field)` for convenience
- Example: `<input ... /> <label htmlFor>{usePlainLabel('config.title')}</label>`

---

### QA Tasks

#### QA-006: Verify Plain Language Labeling
- **Estimated Hours:** 0.5
- **Depends On:** FE-010
- **Files to Create:**
  - `src/__tests__/unit/plain-labels.test.ts` (new)

**Acceptance Criteria:**
- [ ] All fields in `PLAIN_LABELS` have both EN and AR translations
- [ ] No raw field names visible in rendered editor (grep for camelCase labels in HTML)
- [ ] Test a few fields end-to-end: edit form renders with plain label, user sees non-technical text
- [ ] RTL/LTR rendering correct

---

---

## F. Feature 5: Auto-Save Indicator + Undo Foundation

Epic: **EP-12**  
User Stories: **US-24, US-25**  
Acceptance Criteria: Visual auto-save indicator (spinner), undo/redo buttons in UI (action queued for Sprint 3)

### FE Tasks

#### FE-011: Implement Auto-Save with Visual Indicator
- **Estimated Hours:** 3
- **Depends On:** Existing editor state, useEditorStore
- **Files to Create/Modify:**
  - `src/lib/editor-store.ts` (extend with auto-save metadata)
  - `src/components/editor/auto-save-indicator.tsx` (new)
  - `src/hooks/useAutoSave.ts` (new)

**Acceptance Criteria:**
- [ ] When user makes any edit (section added, config changed, theme updated), auto-save triggers
- [ ] Auto-save is debounced: waits 2 seconds after last edit, then saves
- [ ] Visual indicator states:
  - [ ] Default (no unsaved): checkmark icon, text "All changes saved" (gray)
  - [ ] Unsaved (after edit): spinner, text "Saving..." (blue)
  - [ ] Save success: checkmark, text "Changes saved" (green, 2 sec then fade)
  - [ ] Save error: warning icon, text "Save failed" (red, with "Retry" button)
- [ ] Indicator visible in top-right of editor (or header bar)
- [ ] On network error, retry button allows user to manually trigger save
- [ ] Mobile responsive: text can be hidden on small screens (icon only)
- [ ] Accessibility: indicator has live region with aria-live="polite"

**Implementation Notes:**
- Debounce using Zustand middleware or custom hook
- Auto-save calls the existing save API (no new endpoints needed)
- Store auto-save state in useEditorStore: `{ isSaving, lastSaveTime, lastSaveError }`
- Export hook `useAutoSaveStatus()` for components to subscribe

---

#### FE-012: Add Undo/Redo Buttons to Editor UI (Foundation)
- **Estimated Hours:** 2
- **Depends On:** FE-011 (editor state), Zustand store
- **Files to Create/Modify:**
  - `src/components/editor/editor-top-bar.tsx` (or similar header component)
  - `src/lib/editor-store.ts` (add undo/redo action stubs)

**Acceptance Criteria - UI Only (Logic in Sprint 3):**
- [ ] Undo button (↶ icon) in top bar, left of auto-save indicator
- [ ] Redo button (↷ icon) next to undo
- [ ] Buttons disabled (grayed out) when no undo/redo history available
- [ ] Tooltip on hover: "Undo (Ctrl+Z)" and "Redo (Ctrl+Shift+Z)"
- [ ] Bilingual tooltips (switch with user language)
- [ ] Button onClick connects to store actions: `editor.undo()`, `editor.redo()`
- [ ] Keyboard shortcuts work (add listeners in editor component)
- [ ] Mobile: buttons visible and touch-friendly (no hover needed)

**Implementation Notes:**
- Add stubs to useEditorStore: `undo: () => {}` and `redo: () => {}` (no-ops for now)
- Undo/redo history logic implemented in Sprint 3 FE-003 (Task 3.4 in Frontend Plan)
- Keyboard listener example:
  ```ts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        editor.undo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor]);
  ```

---

### BE Tasks

#### BE-009: Add Auto-Save Metadata to Editor Save Endpoint
- **Estimated Hours:** 1
- **Depends On:** Existing save endpoints
- **Files to Modify:**
  - `src/app/api/sites/[siteId]/save/route.ts` (or POST /api/sites/{siteId})

**Acceptance Criteria:**
- [ ] Endpoint returns `{ success, draft: { sections, theme, savedAt, autoSaved: true } }`
- [ ] Include `savedAt` timestamp so FE knows when last save occurred
- [ ] No change to save logic, just response shape
- [ ] Include new field `autoSaved: boolean` (true if called from auto-save mechanism)

**Implementation Notes:**
- Document API response clearly for FE consumption
- No new DB schema changes

---

#### BE-010: Create Undo/Redo History Table & Schema (Foundation)
- **Estimated Hours:** 2
- **Depends On:** BE-001 (schema), but optional for Sprint 1
- **Files to Create/Modify:**
  - `src/lib/db/schema.ts` (add edit_history table definition, optional)

**Acceptance Criteria - Optional (Can Defer to Sprint 3):**
- [ ] `edit_history` table created (or plan documented for Sprint 3)
  - `id`, `siteId`, `userId`, `action` (add/delete/modify), `snapshot` (JSON of sections/theme), `createdAt`
- [ ] Or: document in comments that history will be added in Sprint 3
- [ ] For Sprint 1, undo/redo is FE-only (in-memory Zustand store)

**Implementation Notes:**
- For Sprint 1, undo/redo buttons are UI-only, history is in-memory Zustand
- Server-side history table created in Sprint 3 when full undo/redo logic ships
- Consider: do we need to persist history to DB, or is it FE-only ephemeral?

---

---

## G. Cross-Sprint Dependencies

| Feature | Dependencies | Blocks |
|---------|--------------|--------|
| **Wizard** (FE-001-004, BE-001-004) | Schema ready | Editor route changes (FE needs to handle site creation response) |
| **WhatsApp** (FE-005-006, BE-005-006) | None | None |
| **Opening Hours** (FE-007-008, BE-007-008) | wizard_drafts schema | Completeness meter (Sprint 2) |
| **Plain Labels** (FE-009-010) | None | All future editor UX improvements |
| **Auto-Save** (FE-011-012, BE-009) | Existing save endpoints | Undo/redo (Sprint 3 FE-003) |
| **Undo/Redo buttons** (FE-012, BE-010) | Auto-save foundation | Full undo logic (Sprint 3) |

**Critical Path:**
1. Schema updates + migrations (BE-001, BE-007) — **must complete first**
2. Wizard API (BE-002, BE-003, BE-004) — unblocks FE-004
3. FE-001-004 (Wizard UI + state) — in parallel with BE-002-004
4. All other features can proceed in parallel after schema is ready

---

## H. Daily Standup Questions

**Every day at [standup time], team answers:**

1. **What did you finish yesterday?**
   - [ ] Which tasks went to "Done"?
   - [ ] Any blockers you resolved?

2. **What are you working on today?**
   - [ ] Which tasks are "In Progress"?
   - [ ] Any expected handoff between FE and BE?

3. **What's blocking you?**
   - [ ] Do you need a PR review?
   - [ ] Are you waiting for another team member?
   - [ ] DB schema not ready? API contract unclear?

4. **Any surprises or scope creep?**
   - [ ] Did a task turn out to be bigger than estimated?
   - [ ] Did you find a dependency we missed?

**Scrum Master checks:**
- [ ] Is the 2-week sprint on track for ~60 hours total effort?
- [ ] Are blockers resolved within 24 hours?
- [ ] Is any task at risk of overrunning (e.g., 4h task running 6h)?

---

## I. Definition of Done (DoD)

A task is "Done" when:

1. **Code written** — all acceptance criteria met
2. **Tests written** — unit or integration tests pass locally
3. **PR created** — pushed to `feature/task-id` branch
4. **Code review approved** — at least one other engineer signs off
5. **Tests pass on CI** — no regressions in existing tests
6. **Merged to main** — commit message references task ID (e.g., "FE-001: Create WizardShell")
7. **DB migration applied (if applicable)** — migration runs on test DB, no errors
8. **Docs updated (if applicable)** — code comments, README, API docs reflect changes
9. **Deployed to staging** — feature is live on staging.safahati.com for QA to test
10. **QA signed off** — QA task (if any) is complete and feature works end-to-end

---

## J. Sprint Success Criteria

**Sprint 1 is successful if:**

- [ ] All 5 features ship: Wizard, WhatsApp, Opening Hours, Plain Labels, Auto-Save Indicator
- [ ] 26/26 tasks completed (no rollover)
- [ ] Test coverage ≥ 80% for critical paths (wizard, BE APIs)
- [ ] No regressions in existing dashboard/editor functionality
- [ ] Wizard can generate a fully populated site ready to publish (within 15 sec)
- [ ] All UI text bilingual (EN + AR) and properly positioned (LTR + RTL)
- [ ] Zero critical bugs reported by QA
- [ ] Performance: wizard load < 2 sec, editor stays < 300KB JS
- [ ] Accessibility: all new components pass WCAG 2.1 AA (keyboard nav, screen reader, color contrast)

---

## K. Sprint Resources & Tools

| Resource | Purpose | Owner |
|----------|---------|-------|
| Staging Database | Test migrations and API changes | DevOps |
| Figma Design System | UI components, icon library | UI/UX Designer |
| Jira/Linear Board | Track task progress, burndown | Scrum Master |
| GitHub PRs | Code review, CI checks | Engineers |
| Slack #sprint-1-updates | Daily standups, blockers | Team |

**Key Slack Channels:**
- `#sprint-1-updates` — daily sync
- `#frontend` — FE-specific questions
- `#backend` — BE-specific questions
- `#qa-testing` — QA test results

---

## L. Appendix: Estimation Rationale

**FE Estimates (35h total):**
- **Wizard (FE-001-004): 15h** — 8 step components, state management, API integration, complex branching
- **WhatsApp (FE-005-006): 4h** — 2 small panels, straightforward integration
- **Opening Hours (FE-007-008): 5h** — time pickers, day selector, display logic
- **Plain Labels (FE-009-010): 3h** — label system, UI updates across multiple files
- **Auto-Save (FE-011-012): 8h** — debouncing, visual indicator, keyboard listeners, undo UI

**BE Estimates (25h total):**
- **Wizard (BE-001-004): 11h** — schema, 3 API endpoints, question config, site generation logic
- **WhatsApp (BE-005-006): 3h** — column, CRUD for contact settings
- **Opening Hours (BE-007-008): 3h** — schema, CRUD endpoints
- **Auto-Save (BE-009-010): 2h** — response shape tweak, optional history schema
- **Buffer (6h)** — integration issues, unforeseen complexity

**QA Estimates (5h total):**
- Wizard: 2.5h (happy path, validation, resume)
- WhatsApp: 1h
- Opening Hours: 1h
- Plain Labels: 0.5h

---

## M. Git Workflow for Sprint 1

**Branch naming:**
```
feature/fe-001-wizard-shell
feature/be-002-wizard-api
feature/qa-001-wizard-tests
fix/schema-drift-whatsapp-column
```

**Commit message format:**
```
FE-001: Create WizardShell component with progress indicator

- Add WizardShell.tsx with progress bar animation
- Add StepIndicator.tsx for "X of 8" display
- RTL layout via logical CSS properties
- Full-screen wizard mode

Closes #FE-001
```

**PR checklist before merging:**
- [ ] CI passes (tests, lint, build)
- [ ] 1 approval from team member
- [ ] No merge conflicts
- [ ] Task reference in commit message
- [ ] If DB change: migration tested on staging

**Merge strategy:** Squash + merge to `main` (keeps history clean)

---

## N. Rollover Risk & Contingency

**If any feature doesn't complete by end of Sprint 1:**

1. **Wizard** (highest priority) — partial completion acceptable:
   - Essential: BE API complete (BE-002, BE-003), FE steps 1–3 working (FE-002 partial)
   - Can defer: Step 7 "Help me write" button, full Step 8 summary UI

2. **WhatsApp** — fully deferrable to Sprint 2 if needed (low dependency)

3. **Opening Hours** — deferrable (mid-priority feature)

4. **Plain Labels** — deferrable (nice-to-have polish)

5. **Auto-Save Indicator** — defer full undo logic, but keep visual indicator (Sprint 2 rollover)

**Rollover branch:** `sprint-1-incomplete` if any tasks remain

---

**Document Version:** 1.0  
**Created:** April 25, 2026  
**Last Updated:** April 25, 2026  
**Owner:** Solution Architect / Scrum Master  
**Status:** Ready for Sprint Kickoff
