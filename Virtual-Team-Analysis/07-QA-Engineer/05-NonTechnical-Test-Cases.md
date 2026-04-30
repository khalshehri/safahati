# Non-Technical User Stories — Test Cases
## Safahati QA Test Specifications
**Version:** 1.0  
**Date:** 2026-04-25  
**Author:** QA Engineer (Virtual Team)  
**Scope:** 29 User Stories (US-01 through US-29)  
**Format:** Gherkin-style + Standard Test Case Format

---

## Document Structure

- **Part A:** Test cases for Epic 1-7 (US-01 through US-15)
- **Part B:** Test cases for Epic 8-14 (US-16 through US-29)
- **Part C:** Test data, environment setup, and regression checklist

---

# PART A: EPICS 1–7 TEST CASES

## Epic 1: Wizard (US-01 to US-03)

### TC-001: Wizard Step 1 — Select Business Type (Happy Path)
**User Story:** US-01  
**Title:** User selects business type from 13-card industry grid  
**Preconditions:** User logged in, on /dashboard/new, Step 1 (Business Type selection)

**Steps:**
1. User sees full-screen Step 1 with "اختر نوع مشروعك" (Select Your Business Type)
2. Progress bar shows 1/8 steps
3. User sees 13 industry cards in grid: Company, Agency, Freelancer, Resume, Restaurant, Clinic, Real Estate, SaaS, E-commerce, Event, Photography, Law Firm, Gym
4. Each card displays: icon + Arabic name + English name + brief description
5. User clicks "مطعم" (Restaurant) card
6. Card animates with blue border and checkmark
7. User clicks "التالي" (Next) button
8. Step 2 loads with industry-specific questions

**Expected Result:**
- Industry "restaurant" stored in wizardStore
- Progress bar shows 2/8
- Step 2 displays restaurant-context questions (e.g., "What are your main dishes?")
- No duplicate selection allowed; clicking another card replaces selection

**Acceptance Criteria (from US-01):**
- ✅ All 13 industry cards visible (not scrolled off-screen on mobile)
- ✅ Card has icon + name (EN) + nameAr + description
- ✅ Clicking card highlights it (blue border + checkmark)
- ✅ Next button disabled until industry is selected
- ✅ Progress indicator updates

**Test Data:** Industry selection: "restaurant"  
**Priority:** P0 (Must pass before Sprint 1)  
**Notes:** RTL-specific — verify grid layout mirrors on Arabic locale. Test on 375px (mobile), 768px (tablet), 1920px (desktop).

---

### TC-002: Wizard Step 2 — Business Name Validation
**User Story:** US-01, US-02  
**Title:** Validate business name field with character limits and required validation

**Steps:**
1. Step 2 displays: "اسم مشروعك" (Your Business Name) + required field indicator
2. User clicks name field (empty)
3. User clicks "التالي" (Next) without entering name
4. Inline error appears: "اسم المشروع مطلوب" (Business name is required)
5. Next button remains disabled
6. User types "محل أحمد للعطارة والبهارات في جدة الشمالية" (60+ chars)
7. Warning appears: "سيظهر هذا كعنوان — اختصره قليلاً" (This will be the headline — shorten it)
8. User deletes to 40 chars: "محل أحمد للعطارة"
9. Warning disappears
10. User clicks "التالي"
11. Step 3 loads

**Expected Result:**
- Field accepts max 100 chars
- Empty field blocks progression with error
- >60 chars shows warning but doesn't block (soft validation)
- Business name stored: "محل أحمد للعطارة"

**Acceptance Criteria:**
- ✅ Required field validation (error on empty submit)
- ✅ Max 100 chars enforced
- ✅ Soft warning for >60 chars
- ✅ Warning dismissed when shortened

**Test Data:** 
- Empty: "" → error
- Valid: "محل أحمد" → proceeds
- Long: "محل أحمد للعطارة والبهارات في جدة الشمالية والوسط والجنوب" (>60) → warning, then fix

**Priority:** P0  
**Notes:** Arabic text validation — ensure RTL input works. Test on mobile keyboard behavior.

---

### TC-003: Wizard Language Selection (Arabic/English Toggle)
**User Story:** US-01  
**Title:** User selects language and site direction is set correctly

**Steps:**
1. Step 1 or Step 2 displays language toggle: "العربية" | "English"
2. Default is "العربية" (Arabic) for MENA users
3. User clicks "English" toggle
4. UI language switches to English immediately
5. All subsequent steps displayed in English
6. User proceeds through wizard in English
7. Site generated with language: "en"
8. Preview shows LTR layout, English fonts
9. User goes back, clicks "العربية"
10. UI switches to Arabic
11. Language changes to "ar" in wizardStore

**Expected Result:**
- Language toggle works bidirectionally
- wizardStore.language = "en" or "ar"
- Site theme.direction set to "ltr" (en) or "rtl" (ar)
- All labels, buttons, messages in selected language
- Wizard flow unaffected by language selection

**Acceptance Criteria:**
- ✅ Language toggle immediate (no page reload)
- ✅ All UI text switches correctly
- ✅ Direction (LTR/RTL) set correctly
- ✅ Persists through wizard flow
- ✅ Site created with correct language

**Test Data:**
- Toggle: "ar" ↔ "en"
- Expected theme.direction: "rtl" (ar), "ltr" (en)

**Priority:** P0  
**Notes:** Test on bilingual content. Verify fonts load correctly (Noto Kufi Arabic for AR, system default for EN).

---

### TC-004: Wizard Industry-Specific Branching (Restaurant vs Clinic)
**User Story:** US-03  
**Title:** Different question sets for Restaurant vs Clinic industries

**Steps:**

**Path A — Restaurant:**
1. Step 1: Select "مطعم" (Restaurant)
2. Step 3 question: "What are your main dishes?" → Multi-select: [appetizers, mains, desserts, beverages]
3. User selects: appetizers, mains
4. Step 4 question: "Do you take online orders or reservations?" → Toggle
5. Step 5: "What's your preferred contact method?" → Options: [WhatsApp, phone, reservation form] (WhatsApp pre-selected)

**Path B — Clinic:**
1. Step 1: Select "عيادة طبية" (Medical Clinic)
2. Step 3 question: "What medical specialties does your clinic offer?" → Multi-select: [General Practice, Dentistry, Dermatology, Pediatrics, Orthopedics]
3. User selects: Dentistry, Dermatology
4. Step 4: "Does your clinic have multiple doctors?" → Toggle
5. Step 5: "What's your preferred contact method?" → Options: [WhatsApp, phone, appointment booking] (WhatsApp pre-selected)

**Expected Result:**
- Restaurant flow: questions about menu, ordering, dishes
- Clinic flow: questions about specialties, doctors, booking
- Email is NOT a primary contact option for either
- Both flows converge at final site generation

**Acceptance Criteria:**
- ✅ Questions adapt by industry (not generic)
- ✅ Answer choices relevant to industry (no "menu" for clinic, no "specialties" for restaurant)
- ✅ WhatsApp pre-selected for both
- ✅ Generated site reflects industry context

**Test Data:**
- Restaurant answers: [appetizers, mains], online orders: yes, contact: WhatsApp
- Clinic answers: [Dentistry, Dermatology], multiple doctors: yes, contact: appointment booking

**Priority:** P0  
**Notes:** Test all 13 industry types systematically. Verify question branching logic covers all paths.

---

### TC-005: Wizard Back Navigation and State Preservation
**User Story:** US-02  
**Title:** User can go back and change answers without losing data

**Steps:**
1. Step 1: Select "Freelancer"
2. Step 2: Enter business name "Layla Designs"
3. Step 3: Select specialties [graphic design, branding]
4. Step 4: "Ready to continue?" Yes
5. Step 5: Click back arrow
6. Step 4 still shows "Yes" selected
7. Click back arrow again
8. Step 3: [graphic design, branding] still selected
9. User clicks "Edit" on specialties, changes to [web design, UI/UX]
10. Click forward (next)
11. Step 4: Returns to previous state
12. Click forward
13. Step 5: Loads with new specialties context

**Expected Result:**
- Back button always available (except Step 1)
- Previous answers preserved
- Clicking back doesn't clear data
- Editing and returning maintains new selection
- Forward navigation resumes from last step

**Acceptance Criteria:**
- ✅ All form data persists on back navigation
- ✅ Back button available on Steps 2-8
- ✅ Editing a previous step's answer updates subsequent context
- ✅ No data is lost during back/forth navigation

**Test Data:**
- Step 2: "Layla Designs"
- Step 3 (original): [graphic design, branding]
- Step 3 (edited): [web design, UI/UX]

**Priority:** P0  
**Notes:** Test on mobile (back arrow might be in different location). Verify on slow networks (data persists even with delays).

---

### TC-006: Wizard Confirmation Screen and Site Generation
**User Story:** US-01  
**Title:** Final confirmation of all answers before site generation

**Steps:**
1. User completes all 8 steps
2. Step 8 (Confirmation) displays summary card:
   - Business type: "مطعم" (Restaurant)
   - Business name: "محل أحمد"
   - Main dishes: Appetizers, Mains
   - Language: Arabic
   - Contact preference: WhatsApp
3. Each field has an "Edit" button
4. User clicks "Edit" next to business name
5. Taken directly to Step 2 with name pre-filled
6. User changes name to "مطعم أحمد الجديد"
7. Clicks "Next" (or "التالي")
8. Returns to confirmation with updated name
9. User clicks "أنشئ موقعي" (Create My Site)
10. Loading state: "نبني موقعك الآن... لحظة من فضلك" (Building your site — one moment)
11. Within 15 seconds: site generated and preview shown
12. Preview displays: hero with business name, menu section, about section, opening hours, WhatsApp button

**Expected Result:**
- Confirmation screen shows all 8 answers
- Edit takes user to specific step with data pre-filled
- Generation completes within 15 seconds
- Site includes: hero, menu/services, about, opening hours, WhatsApp CTA
- Preview shown before publish prompt

**Acceptance Criteria:**
- ✅ All answers summarized on confirmation
- ✅ Edit functionality works for each field
- ✅ Site generation completes <15 seconds
- ✅ Generated site includes 5+ sections
- ✅ All user input reflected in site content

**Test Data:**
- 8 answers from previous steps
- Expected site sections: [hero, services, about, hours, contact/whatsapp]

**Priority:** P0  
**Notes:** Test site generation time on various network speeds (3G, 4G, WiFi). Monitor API response times for delays.

---

### TC-007: Wizard — Missing Optional Fields Placeholder Behavior
**User Story:** US-01  
**Title:** Optional fields like logo use placeholders if skipped

**Steps:**
1. Wizard progresses through steps
2. Step 4: "Logo upload" is optional (skipped by user)
3. Step 5: "Company tagline" is optional (skipped by user)
4. Step 8: Confirmation shows "[Not provided]" for optional fields
5. User confirms and site generates
6. Preview shows: logo placeholder (initials-based avatar "AS" for "Ahmad Shami")
7. Dashboard shows completeness tip: "أضف شعار مشروعك — ستزيد احترافيتك" (Add your logo — increases professionalism)

**Expected Result:**
- Optional fields don't block site generation
- Placeholders auto-generated (initials avatar, default tagline)
- Dashboard lists skipped fields as completion items
- User can fill them in editor later

**Acceptance Criteria:**
- ✅ Optional fields don't block wizard progression
- ✅ Placeholders auto-generated (initials, default text)
- ✅ Completeness meter identifies skipped items
- ✅ User can edit placeholders in editor

**Test Data:**
- Business name: "Ahmad Shami" → logo placeholder: initials "AS"
- Logo skipped, tagline skipped → both show as "Not provided"

**Priority:** P1  
**Notes:** Test placeholder generation for names with Arabic characters, special characters, single-letter names.

---

## Epic 2: WhatsApp Integration (US-04 to US-05)

### TC-008: WhatsApp Button Configuration — Single Phone Number
**User Story:** US-04  
**Title:** Add WhatsApp contact button with phone number field

**Steps:**
1. User in editor, opens "Contact" section settings
2. First option: "زر واتساب" (WhatsApp Button) with phone input field
3. Field label: "رقم واتسابك" (Your WhatsApp Number)
4. Field accepts international format or Saudi local format
5. User enters: "0501234567"
6. Platform validates and auto-formats: "+966501234567"
7. User enters: "+966501234567" (already formatted) → accepted
8. User enters: "5012345678" (missing leading 0 or +966) → warning: "أضف رمز الدولة +966"
9. User clicks "حفظ" (Save)
10. Live preview shows green WhatsApp button in bottom-right corner (bottom-left for RTL)
11. On mobile: Button opens WhatsApp with pre-filled message
12. On desktop: Button opens web.whatsapp.com with pre-filled message

**Expected Result:**
- Phone field accepts multiple formats
- Auto-formatting to +966XXXXXXXXX
- Button appears on live preview
- Pre-filled message: "مرحباً، رأيت موقعك وأريد الاستفسار"
- Button placement: bottom-right (LTR), bottom-left (RTL)

**Acceptance Criteria:**
- ✅ Phone number validation (Saudi +966, UAE +971, etc.)
- ✅ Auto-formatting to international format
- ✅ Pre-filled message works on mobile/desktop
- ✅ Button doesn't overlap content
- ✅ Button visible on live site immediately after save

**Test Data:**
- Input: "0501234567" → Output: "+966501234567"
- Input: "+966501234567" → Accepted as-is
- Input: "966501234567" → Warning (missing + prefix)
- Input: "abc123" → Error: "رقم صحيح يرجى إدخال"

**Priority:** P0  
**Notes:** Test GCC country codes (+966, +971, +968, +974). Test on mobile web and desktop. Verify WhatsApp Web fallback on desktop.

---

### TC-009: WhatsApp Pre-filled Message Customization
**User Story:** US-04  
**Title:** Customize default message sent to WhatsApp

**Steps:**
1. WhatsApp button settings open
2. Optional field: "الرسالة الافتراضية" (Default Message)
3. Field shows example: "مرحباً، رأيت موقعك وأريد الاستفسار"
4. Character counter displays: "0/160"
5. User types: "السلام عليكم، أتحدث عن خدماتك"
6. Counter updates: "34/160"
7. User types 130 more characters (max 160)
8. Counter shows: "160/160" (red border on field)
9. User tries to add more → field doesn't accept new chars
10. User deletes to 150 chars → border returns to normal
11. User saves

**Expected Result:**
- Custom message up to 160 chars
- Counter updates in real-time
- Max 160 chars enforced
- If empty, uses default message
- Message persists in edit panel

**Acceptance Criteria:**
- ✅ Custom message optional
- ✅ Max 160 characters enforced
- ✅ Character counter displays accurately
- ✅ Preview shows custom message when available
- ✅ Default message used if custom is empty

**Test Data:**
- Default: "مرحباً، رأيت موقعك وأريد الاستفسار"
- Custom: "السلام عليكم، أتحدث عن خدماتك" (34 chars)

**Priority:** P1  
**Notes:** Test on Arabic text (may be wider). Test on mobile input behavior.

---

### TC-010: WhatsApp Button Position Control (RTL/LTR)
**User Story:** US-05  
**Title:** Control button position and visibility on specific pages

**Steps:**
1. WhatsApp settings open
2. Position option: "موضع الزر" (Button Position)
3. Shows two visual thumbnails: "أسفل اليمين" (Bottom Right) and "أسفل اليسار" (Bottom Left)
4. For Arabic site (RTL): Default is "Bottom Left"
5. For English site (LTR): Default is "Bottom Right"
6. User can toggle between the two
7. Optional toggle: "إخفاء على صفحات محددة" (Hide on Specific Pages)
8. When enabled: Shows checklist of site pages
9. User unchecks: "حجز موعد" (Book Appointment)
10. User saves and previews
11. On homepage: WhatsApp button visible
12. On appointment page: Button fades out smoothly

**Expected Result:**
- Position toggle works (user can override default)
- Page exclusion works (button hidden on specified pages)
- Fade effect (not abrupt disappearance)
- No layout shift when button hidden
- Position persists in edit panel

**Acceptance Criteria:**
- ✅ Position toggle between Bottom Right / Bottom Left
- ✅ Default respects language direction (RTL/LTR)
- ✅ Hide on specific pages works
- ✅ Smooth transition when hidden
- ✅ No layout shift or CLS issues

**Test Data:**
- RTL site: Default "Bottom Left", user can switch to "Bottom Right"
- LTR site: Default "Bottom Right", user can switch to "Bottom Left"
- Exclude pages: ["Book Appointment", "Privacy Policy"]

**Priority:** P1  
**Notes:** Test on mobile (button placement vs. system UI). Test CLS (Cumulative Layout Shift) metrics. Verify on various screen sizes.

---

## Epic 3: Smart Content Suggestions (US-06 to US-07)

### TC-011: AI Placeholder Suggestions in Hero Section
**User Story:** US-06  
**Title:** AI-generated ghost text in empty text fields

**Steps:**
1. User opens hero section editor
2. Headline field is empty
3. User focuses on headline field
4. Ghost text appears: "مصممة جرافيك مبدعة — أحوّل أفكارك إلى هوية بصرية لا تُنسى"
5. Text is gray/faded (not selectable)
6. User starts typing: "ل"
7. Ghost text disappears
8. Field shows user input "ل"
9. User deletes all text (field empty again)
10. Ghost text reappears
11. User doesn't click "Try Another" — 3 alternative suggestions appear below field
12. User clicks one suggestion
13. Suggestion inserts as editable text
14. Field shows "AI" tag in corner

**Expected Result:**
- Ghost placeholder appears in empty fields
- Placeholder relevant to industry (Freelancer → design-focused suggestions)
- Placeholder personalizable (includes user's name if provided)
- Suggestions update as field focus changes
- AI tag indicates AI-generated content

**Acceptance Criteria:**
- ✅ Ghost text appears in empty fields
- ✅ Suggestions industry-specific
- ✅ Suggestions personalized with user's name
- ✅ Placeholder disappears on user input
- ✅ Reappears when field cleared
- ✅ AI tag displayed on AI content

**Test Data:**
- Industry: "Freelancer"
- User name: "Layla Al-Qahtani"
- Expected suggestion: Includes "Layla" and design-focused language

**Priority:** P1  
**Notes:** Test suggestion quality. Verify suggestions don't include random names. Test on slow API responses.

---

### TC-012: Regenerate Suggestions — Try Another Button
**User Story:** US-07  
**Title:** Generate new suggestions on demand

**Steps:**
1. Hero section, headline field focused
2. Suggestion displays: "مصممة جرافيك مبدعة..."
3. User clicks refresh icon "جرّب غيرها" (Try Another)
4. Field shows: "جاري التحميل..." (Loading...) for up to 2 seconds
5. New suggestion appears: "فنانة تصميم متخصصة في الهوية البصرية"
6. "Previous suggestions" mini-history shows last 2 suggestions as clickable chips
7. User clicks refresh again
8. Another new suggestion: "مصممة جرافيك ومتخصصة في التسويق البصري"
9. History now shows 3 suggestions (oldest may be removed)
10. User clicks on an older suggestion from history
11. That suggestion replaces current field

**Expected Result:**
- Refresh generates new suggestions within 2 seconds
- Last 3 suggestions available in history
- User can click history item to restore it
- Duplicate suggestions prevented (same suggestion never shown twice in a row)
- Loading state visible during generation

**Acceptance Criteria:**
- ✅ New suggestion generated on click <2 seconds
- ✅ History tracks last 3 suggestions
- ✅ History click restores old suggestion
- ✅ No duplicate suggestions in a row
- ✅ Loading state displayed

**Test Data:**
- Refresh count: 3+ times
- Expected: 3+ distinct suggestions

**Priority:** P1  
**Notes:** Test API rate limiting. Test on slow networks (loading state shouldn't disappear early). Test history persistence per session.

---

## Epic 4: Mobile Admin PWA (US-08 to US-09)

### TC-013: PWA Installation Prompt on iOS/Android
**User Story:** US-08  
**Title:** User can install dashboard as home-screen app

**Steps:**
1. User visits app.safahati.com on Safari (iPhone) for first time
2. After 3 seconds: iOS install banner or in-app prompt appears
3. Banner shows Safahati logo + "أضف ساعة الزيارة الآن" (Add to Home Screen)
4. User taps "Add"
5. System prompt: "Add 'Safahati' to Home Screen?" with icon preview
6. User confirms
7. PWA appears on home screen with Safahati icon + label
8. User taps PWA icon
9. App launches in full-screen (no browser chrome)
10. Status bar and logo visible
11. Loading: <3 seconds on 4G
12. Dashboard fully rendered in PWA mode

**Expected Result:**
- PWA installable on iOS 11.3+ and Android 5+
- Full-screen mode (no address bar)
- Fast load time (<3 seconds)
- Icon and name visible on home screen
- Works offline (cached version)

**Acceptance Criteria:**
- ✅ Install prompt appears (not on return visits)
- ✅ PWA launches in standalone mode
- ✅ Logo in header with site name
- ✅ Load time <3 seconds on 4G
- ✅ Offline fallback available

**Test Data:**
- Device: iPhone 13 Safari, Pixel 6 Chrome
- Expected load time: <3 seconds on 4G, <5 seconds on 3G

**Priority:** P1  
**Notes:** Test on actual devices (iOS and Android). Verify manifest.json and service worker setup. Test offline behavior. Check add-to-home-screen flow on both platforms.

---

### TC-014: Mobile-Optimized Dashboard Navigation
**User Story:** US-09  
**Title:** Touch-friendly dashboard with bottom tab navigation

**Steps:**
1. PWA opens on mobile (375px viewport)
2. Bottom navigation visible: 4 tabs: Home, Edit Site, Preview, Account
3. Each tab has icon + Arabic label
4. Current tab highlighted (blue background)
5. User taps "تعديل الموقع" (Edit Site)
6. Section list loads as large cards (not small list items)
7. Each card shows: section name (Arabic), brief description, "تعديل" (Edit) button
8. Button minimum 48px height (touch target)
9. User taps "Edit" on hero section
10. Section editor opens
11. Text field visible without horizontal scroll
12. Virtual keyboard appears
13. Field scrolls above keyboard automatically
14. "حفظ" (Save) button stays visible above keyboard
15. User makes change, taps back button
16. Unsaved changes warning: "لم تحفظ التغييرات — هل تريد المغادرة؟"
17. Options: "احفظ" (Save) or "تجاهل" (Discard)

**Expected Result:**
- Bottom tab navigation (not hamburger menu)
- Large touch targets (48px minimum)
- Keyboard doesn't obscure Save button
- Unsaved changes warning
- Portrait and landscape orientation supported

**Acceptance Criteria:**
- ✅ Bottom navigation visible and functional
- ✅ 48px+ touch targets
- ✅ Keyboard management (fields scroll above, Save stays visible)
- ✅ Unsaved changes warning
- ✅ Responsive on all orientations
- ✅ No horizontal scrolling

**Test Data:**
- Viewport: 375px width (mobile)
- Orientation: Portrait, then landscape
- Touch target size: 48px+ (verify with DevTools)

**Priority:** P1  
**Notes:** Test on actual phones (iPhone SE, Pixel 5). Verify keyboard behavior. Test PWA installation on both platforms. Test on screens <375px (older Android).

---

## Epic 5: AI "Help Me Write" Button (US-10 to US-11)

### TC-015: Generate Full Content with "Help Me Write" Button
**User Story:** US-10  
**Title:** AI-generated full text for any field

**Steps:**
1. About section editor, "About Us" text field empty
2. "✨ ساعدني في الكتابة" (Help Me Write This) button visible next to field
3. User clicks button
4. Field shows: "جاري الكتابة..." (Writing...) with animated dots
5. Within 5 seconds: Full Arabic paragraph appears with streaming effect (character by character)
6. Text: "مطعمنا الرائع يقدم الطعام السعودي الأصيل في جدة منذ 2020..."
7. Paragraph references business info: restaurant name, location, type
8. User not satisfied, clicks "أعد الكتابة" (Rewrite)
9. Field clears, loading starts, new distinct paragraph appears
10. Second version: Different tone/structure, but includes same business context
11. User satisfied, clicks outside field to confirm
12. Field becomes editable
13. User manually edits the generated text (it's fully editable)

**Expected Result:**
- Generated content <5 seconds
- Content includes business context (name, location, type)
- Streaming effect (character by character)
- Rewrite generates distinct content
- Generated text fully editable
- Content respects character limits

**Acceptance Criteria:**
- ✅ Generation <5 seconds
- ✅ Content personalized with business info
- ✅ Rewrite generates distinct version
- ✅ Generated text is editable
- ✅ Content respects field char limits
- ✅ Streaming animation visible

**Test Data:**
- Business: "مطعم أحمد" (Ahmad's Restaurant), Restaurant, Jeddah
- Expected content includes: restaurant name, cuisine type, location

**Priority:** P1  
**Notes:** Test content quality and relevance. Test API response times. Test on slow networks (show loading state longer). Test character limit respect. Test rewrite distinctness.

---

### TC-016: Improve Existing Text vs Generate New
**User Story:** US-10  
**Title:** Button changes behavior based on field state (empty/filled)

**Steps:**

**Scenario A — Empty Field:**
1. Text field is empty
2. Button label: "✨ ساعدني في الكتابة" (Help Me Write This)
3. User clicks
4. Full paragraph generated

**Scenario B — Field Has User Text:**
1. Text field has user-entered content: "مطعمنا يقدم خدمة رائعة"
2. Button label changes to: "✨ حسّن هذا النص" (Improve This Text)
3. User clicks
4. Existing text is rewritten (enhanced, not replaced with completely different content)
5. Enhanced version: "مطعمنا يقدم خدمة عملاء رائعة وجودة طعام عالية في بيئة دافئة"

**Expected Result:**
- Empty field: "Help Me Write" → generates new content
- Filled field: "Improve This Text" → enhances existing content
- Button label changes dynamically
- Improved text preserves original intent

**Acceptance Criteria:**
- ✅ Button label changes based on field state
- ✅ Empty → full generation
- ✅ Filled → improvement/enhancement
- ✅ Enhancement preserves original intent
- ✅ Enhanced text is distinct but related

**Test Data:**
- Empty: "" → generates new
- Filled: "مطعمنا يقدم خدمة رائعة" → enhances

**Priority:** P1  
**Notes:** Test button label changes. Test enhancement quality. Ensure improvement is distinct enough from original but not completely different.

---

### TC-017: AI Content Tone Selection
**User Story:** US-11  
**Title:** Choose tone before generating content

**Steps:**
1. Text field, "Help Me Write" button clicked
2. Tone selection panel opens with 4 chips:
   - "احترافي" (Professional)
   - "ودّي" (Friendly)
   - "إبداعي" (Creative)
   - "بسيط" (Simple)
3. Default: Professional is highlighted
4. User clicks "إبداعي" (Creative)
5. Chip highlights in blue
6. User clicks "اكتب" (Write)
7. Content generated with creative tone: Metaphorical language, short sentences, no corporate filler
8. Example: "مطعمنا هو عالم من النكهات — حيث التقاليد تلتقي بالابتكار في كل طبق"
9. User navigates to another field
10. Opens "Help Me Write" again
11. Creative tone is pre-selected (remembered in session)

**Expected Result:**
- 4 tone options available
- Selected tone remembered per session
- Generated content reflects selected tone
- Creative tone: metaphorical, short sentences
- Professional tone: structured, formal
- Friendly tone: conversational, warm
- Simple tone: clear, direct

**Acceptance Criteria:**
- ✅ Tone selection visible and functional
- ✅ 4 tone options available
- ✅ Selected tone remembered in session
- ✅ Generated content reflects tone
- ✅ Tones produce noticeably different output
- ✅ Arabic tone phrasing natural (not translated)

**Test Data:**
- Tone: "إبداعي" (Creative)
- Business: "مطعم" (Restaurant)
- Expected: Creative, metaphor-heavy content

**Priority:** P1  
**Notes:** Test tone distinctness. Ensure Arabic tone descriptions feel natural. Test tone persistence within session.

---

## Epic 6: Opening Hours (US-12 to US-13)

### TC-018: Configure Opening Hours with Day/Time Picker
**User Story:** US-12  
**Title:** Set business hours using visual picker (no free text)

**Steps:**
1. Opening Hours section in editor opens
2. 7 days displayed as rows: Sunday-Saturday (Islamic week order)
3. Each day row shows: Toggle (Open/Closed), Time Start picker, Time End picker
4. All days default to "Closed"
5. User clicks Saturday toggle → "Open"
6. Time pickers activate: "فتح من" (Open from) and "إغلاق عند" (Close at)
7. User clicks start time: time picker interface opens
8. User selects: 12:00 PM (using hours: 12, minutes: 00, period: PM)
9. User clicks end time: time picker interface opens
10. User selects: 11:00 PM
11. Row shows: "السبت: 12:00 م – 11:00 م"
12. User clicks "تطبيق على باقي الأيام" (Apply to Other Days)
13. Checkbox list appears: Sunday, Monday, Tuesday, Wednesday, Thursday
14. User checks: Sunday-Thursday
15. User confirms: All checked days now show 12:00 PM – 11:00 PM
16. Friday toggle remains "Closed"
17. User saves
18. Live site shows: "السبت – الخميس: 12:00 م – 11:00 م | الجمعة: مغلق"

**Expected Result:**
- All 7 days displayed
- Toggle enables/disables time pickers
- Time pickers default to 12:00 AM – 12:00 AM (midnight)
- Bulk apply works for multiple days
- Closed days don't show time pickers
- Live site displays Arabic formatted hours

**Acceptance Criteria:**
- ✅ Day/time picker (no free text)
- ✅ Toggle enable/disable time pickers
- ✅ Bulk apply to multiple days
- ✅ Closed days grayed out
- ✅ Live site shows Arabic formatted hours
- ✅ All 7 days covered

**Test Data:**
- Days: Saturday-Thursday open (12:00 PM – 11:00 PM), Friday closed
- Expected live display: "السبت – الخميس: 12:00 م – 11:00 م | الجمعة: مغلق"

**Priority:** P0  
**Notes:** Test on mobile (time picker UX). Test past-midnight scenario. Test bulk apply functionality. Verify Arabic day names and formatting.

---

### TC-019: Opening Hours Validation and Past-Midnight Handling
**User Story:** US-12  
**Title:** Validate hours and handle restaurants open past midnight

**Steps:**

**Scenario A — Invalid Time Range:**
1. User sets: Open 10:00 PM, Close 8:00 PM (end before start)
2. Tries to save
3. Warning appears: "وقت الإغلاق يجب أن يكون بعد وقت الفتح" (Close time must be after open time)
4. "Works past midnight" toggle appears below warning
5. User clicks toggle
6. Message changes: "موافق! يعمل بعد منتصف الليل" (OK! Works past midnight)
7. Save succeeds

**Scenario B — Past Midnight Logic:**
1. Saturday hours: Open 6:00 PM, Close 2:00 AM (next day)
2. "Works past midnight" toggle is auto-enabled
3. Live site shows: "السبت: 6:00 م – 2:00 ص (صباح الأحد)" (Saturday 6 PM – 2 AM (Sunday morning))

**Expected Result:**
- End time before start time shows validation error
- "Works past midnight" toggle resolves the error
- Past-midnight logic displays correctly on live site
- Next day is included in display

**Acceptance Criteria:**
- ✅ Validation prevents illogical times
- ✅ Past-midnight toggle available
- ✅ Toggle enables past-midnight scenario
- ✅ Live display includes next day indicator
- ✅ No confusion about which day

**Test Data:**
- Invalid: Open 10 PM, Close 8 PM → Enable past-midnight → Valid
- Past-midnight: Open 6 PM, Close 2 AM → Shows "2 AM (next day)"

**Priority:** P0  
**Notes:** Test time picker on mobile. Test past-midnight edge case. Verify Arabic day transitions.

---

### TC-020: Real-Time Open/Closed Status on Published Site
**User Story:** US-13  
**Title:** Show "Open Now" or "Closed Now" badge on live site

**Steps:**

**Scenario A — Currently Open:**
1. Visitor arrives at restaurant site at 2:00 PM on Saturday
2. Hours configured: Saturday 12:00 PM – 11:00 PM
3. Opening Hours section displays:
   - Green badge: "مفتوح الآن" (Open Now)
   - "يغلق الساعة 11:00 م" (Closes at 11:00 PM)
4. Full hours table below: All 7 days listed

**Scenario B — Currently Closed:**
1. Visitor arrives at 10:00 AM on Saturday
2. Opening Hours section displays:
   - Red badge: "مغلق الآن" (Closed Now)
   - "يفتح الساعة 12:00 م" (Opens at 12:00 PM)

**Scenario C — Closed Day (Friday):**
1. Visitor arrives on Friday
2. Opening Hours section displays:
   - Red badge: "مغلق" (Closed)
   - "يفتح السبت الساعة 12:00 م" (Opens Saturday at 12:00 PM)

**Expected Result:**
- Server-side timezone calculation (not client timezone)
- "Open Now" = green badge with closing time
- "Closed Now" = red badge with next opening time
- Next opening time calculated and displayed
- Closed days show next available open day

**Acceptance Criteria:**
- ✅ Status updates in real-time
- ✅ Correct timezone used (server, not client)
- ✅ Next opening time displayed
- ✅ Closed day shows next available opening
- ✅ Color-coded badges (green/red)

**Test Data:**
- Business timezone: Asia/Riyadh
- Current time: 2:00 PM Saturday
- Status: Open (closes 11:00 PM)

**Priority:** P1  
**Notes:** Test timezone calculation (especially for international visitors). Test day/time transitions. Test closed days. Verify server-side calculation (not client).

---

## Epic 7: Completeness Meter (US-14 to US-15)

### TC-021: Site Completeness Score and Missing Items List
**User Story:** US-14  
**Title:** Dashboard shows completeness percentage and missing items

**Steps:**
1. User logs into dashboard after completing wizard
2. "اكتمال موقعك" (Your Site Completeness) section visible at top
3. Circular progress bar shows: 65%
4. Below score: "15 من 23 عنصراً مكتملاً" (15 of 23 items complete)
5. Missing items list (in plain Arabic):
   - "أضف شعار العيادة" (Add clinic logo)
   - "اكتب نبذة 'من نحن'" (Write about section)
   - "أضف رقم واتساب" (Add WhatsApp number)
   - "أضف صور للعيادة" (Add clinic photos)
6. User clicks "اكتب نبذة 'من نحن'" (Write about section)
7. Router navigates to editor, "About" section highlighted (scroll + blue border animation)
8. User writes about section text
9. User saves (auto-save)
10. User navigates back to dashboard
11. Completeness score: 70% (updated)
12. About item: ✓ checked off or removed from list

**Expected Result:**
- Score calculates dynamically
- Missing items listed in plain Arabic
- Clicking item navigates to editor with section highlighted
- Score updates on save
- Completed items visually marked

**Acceptance Criteria:**
- ✅ Completeness percentage accurate
- ✅ Missing items in plain language (no jargon)
- ✅ Click navigation to editor
- ✅ Section highlighting on navigation
- ✅ Score updates automatically
- ✅ Completed items marked

**Test Data:**
- Initial score: 65%
- Missing: [logo, about, whatsapp, photos]
- After about completion: 70%

**Priority:** P1  
**Notes:** Test score calculation accuracy. Test navigation to editor. Test score update timing. Verify plain language (no technical terms).

---

### TC-022: Completeness Ranking by Priority
**User Story:** US-15  
**Title:** Missing items ranked by impact (Critical, Important, Optional)

**Steps:**
1. Completeness meter displays missing items with priority labels:
   - "مهم جداً" (Critical) — red
   - "مهم" (Important) — orange
   - "اختياري" (Optional) — gray
2. Critical items listed first:
   - "أضف رقم واتساب" (Add WhatsApp) — "معظم زوار موقعك سيتواصلون عبر واتساب"
   - "أضف شعار" (Add logo) — "الشعار يزيد الثقة"
3. Important items next:
   - "اكتب نبذة 'من نحن'" (Write about section)
4. Optional items last:
   - "أضف رابط فيسبوك" (Add Facebook link)
5. User completes both Critical items
6. Dashboard refreshes
7. Critical section disappears
8. Important items now at top
9. Motivational message: "أنت على بُعد 3 خطوات من موقع مكتمل!" (You're 3 steps away from complete!)

**Expected Result:**
- Items ranked by priority (Critical → Important → Optional)
- Priority labels color-coded
- Short explanation for each Critical item
- Critical section disappears when items completed
- Motivational message displayed
- List adapts dynamically

**Acceptance Criteria:**
- ✅ Priority ranking visible
- ✅ Color-coding correct (red/orange/gray)
- ✅ Explanations for Critical items
- ✅ Dynamic list adaptation
- ✅ Motivational messaging
- ✅ Section removal on completion

**Test Data:**
- Critical items: 2 (WhatsApp, logo)
- Important items: 3 (about, hours, contact)
- Optional items: 2 (social links, analytics)
- Initial score: 50%, after critical: 70%

**Priority:** P1  
**Notes:** Test priority ranking logic. Test dynamic list updates. Verify motivational messaging. Test on various completeness percentages.

---

# PART B: EPICS 8–14 TEST CASES

## Epic 8: Template Switching (US-16 to US-17)

### TC-023: Switch Template While Preserving Content
**User Story:** US-16  
**Title:** Change site visual design without losing content

**Steps:**
1. User in editor, clicks "تغيير القالب" (Change Template)
2. Template gallery opens with live previews
3. Current template marked: "القالب الحالي" (Current)
4. All compatible templates shown with user's actual content
5. User's portfolio images and bio visible in preview, not dummy text
6. User hovers on new template card
7. Full-screen preview opens: site with new template applied
8. Preview shows: real portfolio images, real bio, real services
9. User clicks "تطبيق هذا القالب" (Apply This Template)
10. Confirmation dialog: "هل تريد تطبيق هذا القالب؟ سيتم الاحتفاظ بجميع محتوياتك."
11. User confirms
12. Loading: "جاري تطبيق القالب..." (Applying template...)
13. Within 5 seconds: Site renders in new template
14. All user content preserved: text, images, section order
15. Only styling changed: fonts, colors, layout
16. User clicks "تراجع" (Undo) within 60 seconds
17. Previous template fully restored (rollback)

**Expected Result:**
- Template preview includes user's actual content
- Switch completes <5 seconds
- All content preserved
- Styling only changes
- Undo available within 60 seconds
- Rollback is complete (not just navigation back)

**Acceptance Criteria:**
- ✅ Preview shows real content, not dummy
- ✅ Switch <5 seconds
- ✅ Content fully preserved
- ✅ Styling only changes
- ✅ Undo works (rollback)
- ✅ Rollback within 60 seconds

**Test Data:**
- Old template: Dark portfolio
- New template: Light minimal
- Content preserved: [6 portfolio items, bio, 3 services]

**Priority:** P1  
**Notes:** Test on various content volumes. Test preview performance. Test undo functionality. Verify no content loss.

---

### TC-024: Template Preview with Responsive Views
**User Story:** US-17  
**Title:** Preview new template on desktop/tablet/mobile before switching

**Steps:**
1. Template gallery open
2. User clicks "معاينة" (Preview) on a template card
3. Full-screen preview opens
4. Device toggle bar shows: Desktop, Tablet, Mobile icons
5. Desktop view (default): Full-width preview with content
6. User clicks Mobile icon
7. Preview reframes to 390px width with device bezel graphic
8. Responsive layout renders correctly: text doesn't overflow, buttons are tap-sized
9. User makes edit in editor panel (in split screen behind preview)
10. Mobile preview updates in real-time
11. User clicks ">" arrow to browse to next template in preview mode
12. Next template loads, still in mobile view
13. User scrolls in preview to see all sections (full page, not just hero)
14. User clicks "تطبيق" (Apply) from within preview
15. Confirmation dialog appears
16. Apply succeeds

**Expected Result:**
- Preview available for all templates
- Device size toggle (desktop/tablet/mobile)
- Responsive preview is true simulation (not just scaled)
- Real content shown
- Full page scrollable
- "Apply" available from preview
- Template browsing in preview mode

**Acceptance Criteria:**
- ✅ Preview shows all 3 device sizes
- ✅ Responsive layout accurate
- ✅ Real content in preview
- ✅ Full page scrollable
- ✅ Template navigation in preview
- ✅ Apply from preview works

**Test Data:**
- Device widths: Desktop (1920px), Tablet (768px), Mobile (390px)
- Expected responsive: Stack on mobile, side-by-side on desktop

**Priority:** P1  
**Notes:** Test responsive accuracy. Test on actual devices. Test performance of preview rendering. Verify full page scrolling.

---

## Epic 9: Translate (US-18 to US-19)

### TC-025: Auto-Translate Arabic to English
**User Story:** US-18  
**Title:** One-click translation of all Arabic content to English

**Steps:**
1. User has completed Arabic site with full content
2. Navigates to: Site Settings > Language
3. Sees button: "ترجم إلى الإنجليزية" (Translate to English)
4. User clicks
5. Confirmation dialog: "سيتم ترجمة جميع النصوص من العربية إلى الإنجليزية. يمكنك مراجعتها بعد الترجمة."
6. User clicks "ابدأ الترجمة" (Start Translation)
7. Progress indicator shows: "جاري ترجمة قسم البطل..." (Translating hero section...)
8. Each section's completion shown as % or checkmark
9. Estimated time: "تقدير: 30 ثانية" (Estimate: 30 seconds)
10. Translation progresses through all sections
11. After 30 seconds: "انتهت الترجمة!" (Translation complete!)
12. User navigates to editor
13. All Arabic text fields now have English equivalents
14. User previews English version (LTR, English fonts)

**Expected Result:**
- Translation <30 seconds
- All text fields translated
- No field left empty or in Arabic
- Progress shown with estimated time
- English version LTR and correct
- Translation doesn't overwrite manual English edits

**Acceptance Criteria:**
- ✅ Translation <30 seconds
- ✅ All text translated
- ✅ No fields skipped
- ✅ Progress visible
- ✅ LTR layout for English
- ✅ Manual edits preserved

**Test Data:**
- Original Arabic site: [hero, about, services, testimonials, contact] (all Arabic text)
- Expected: English counterparts for all fields

**Priority:** P1  
**Notes:** Test translation quality. Test on large sites (>5000 words). Test background job for large sites. Test API availability.

---

### TC-026: Review Translated Content Before Publishing
**User Story:** US-19  
**Title:** Side-by-side review and edit translations

**Steps:**
1. Translation completes
2. "Translation Review Mode" activates
3. Side-by-side comparison: Arabic (right) vs English (left)
4. First section displayed (hero)
5. Arabic headline: "مصممة جرافيك مبدعة"
6. English translation: "Creative Graphic Designer"
7. User can click "موافق" (Approve) to accept, or edit inline
8. User clicks edit field
9. Changes to: "Award-Winning Graphic Designer"
10. Field marked: "تم التعديل" (Edited — blue badge)
11. User scrolls to next section
12. Reviews about section, testimonials, contact
13. Some translations approved, some edited
14. User clicks "تأكيد الترجمة" (Confirm Translation)
15. All translations saved
16. Site now bilingual (both languages available)
17. Translation Review Mode exits

**Expected Result:**
- Side-by-side Arabic/English comparison
- Field-by-field approval/editing
- Edited fields marked
- Progress tracking (X of Y fields reviewed)
- Confirmation saves all changes
- Manual overrides respected

**Acceptance Criteria:**
- ✅ Side-by-side comparison
- ✅ Field-by-field review
- ✅ Inline editing
- ✅ Edit tracking (badge)
- ✅ Confirmation saves all
- ✅ Bilingual site created

**Test Data:**
- 5 sections, 20 fields total
- 15 approved, 5 edited
- Expected: All 20 saved (15 translated, 5 custom)

**Priority:** P1  
**Notes:** Test review flow UX. Test large numbers of fields. Test resume mid-review. Test banner when leaving Review Mode.

---

## Epic 10: Launch Celebration (US-20 to US-21)

### TC-027: First Publish Celebration Screen
**User Story:** US-20  
**Title:** Celebratory screen on first publish

**Steps:**
1. User clicks "انشر موقعي" (Publish My Site) for first time
2. Site goes live successfully
3. Full-screen celebration overlay appears
4. Confetti animation plays
5. Headline: "موقعك أصبح حياً! 🎉" (Your site is live!)
6. Site name displayed prominently: "Layla Designs"
7. Live URL displayed: "layla-designs.safahati.com" (clickable link)
8. Primary button: "افتح موقعي" (Open My Site)
9. Sharing options row:
   - "شارك على واتساب" (Share on WhatsApp) — largest/first
   - "نسخ الرابط" (Copy Link) — with clipboard icon
   - Instagram story link
   - Twitter/X share
10. User clicks "شارك على واتساب"
11. WhatsApp opens with pre-filled message: "أطلقت موقعي الجديد! تفضل/تفضلي بزيارته: layla-designs.safahati.com"
12. User can send to contacts or groups
13. User closes celebration by clicking "X" or "لاحقاً" (Later)
14. Returns to dashboard
15. Celebration doesn't reappear on subsequent publishes
16. Site card shows green "مباشر" (Live) badge

**Expected Result:**
- Celebration screen appears only on first publish
- Confetti animation visible
- Sharing options functional
- WhatsApp message pre-filled
- Site URL live and clickable
- Desktop opens web.whatsapp.com, mobile opens app

**Acceptance Criteria:**
- ✅ Celebration on first publish only
- ✅ All sharing options functional
- ✅ WhatsApp message pre-filled correctly
- ✅ URL clickable and live
- ✅ "Live" badge on dashboard

**Test Data:**
- Site name: "Layla Designs"
- Expected URL: "layla-designs.safahati.com"
- Pre-filled message: "أطلقت موقعي الجديد! تفضل/تفضلي بزيارته: layla-designs.safahati.com"

**Priority:** P1  
**Notes:** Test on first vs. subsequent publishes. Test WhatsApp integration on mobile and desktop. Test confetti animation performance.

---

### TC-028: Share Site from Dashboard
**User Story:** US-21  
**Title:** Persistent share button on dashboard after publish

**Steps:**
1. Site is published and live
2. Dashboard displays site card
3. Card shows: site name, URL (clickable), "شارك" (Share) button, "نسخ" (Copy) icon
4. User clicks "شارك" button
5. Share panel slides up (mobile) or pops out (desktop)
6. Share options: WhatsApp, Instagram, "نسخ الرابط" (Copy Link)
7. User clicks "نسخ الرابط"
8. Tooltip appears for 2 seconds: "تم نسخ الرابط ✓" (Link copied)
9. User can paste URL in messages/email
10. User clicks "WhatsApp"
11. Pre-filled message: "أطلقت موقعي الجديد! تفضل/تفضلي بزيارته: [url]"
12. Draft site (not published): "شارك" button not shown
13. Instead shows: "انشر لتتمكن من المشاركة" (Publish to share)

**Expected Result:**
- Share button persistent on dashboard
- All sharing options functional
- Copy feedback visible
- URL live and correct
- Share unavailable for draft sites
- Mobile: Native share sheet (if available)

**Acceptance Criteria:**
- ✅ Share button on published sites
- ✅ All share options work
- ✅ Copy feedback visible
- ✅ Share unavailable for drafts
- ✅ URL correct and live

**Test Data:**
- Published site: "layla-designs.safahati.com"
- Draft site: share button not available

**Priority:** P1  
**Notes:** Test on mobile (native share sheet). Test copy feedback. Test URL accuracy. Test on draft sites.

---

## Epic 11: Live Preview (US-22 to US-23)

### TC-029: Real-Time Live Preview in Editor
**User Story:** US-22  
**Title:** Split-screen preview updates as user edits

**Steps:**
1. Desktop browser (≥1280px width)
2. Editor page loads
3. Left panel (40%): Edit form
4. Right panel (60%): Live preview
5. User edits hero headline in form
6. Pauses for 300ms
7. Preview updates to show new headline (no page reload)
8. User types description in about section
9. Preview updates showing description text
10. User uploads new image via file picker
11. Preview immediately shows new image
12. User changes accent color via color picker
13. Live preview updates color as user drags picker
14. User changes layout from "centered" to "image right"
15. Preview immediately reframes layout
16. User clicks expand preview icon
17. Editor panel collapses
18. Preview takes full width
19. User clicks "Edit" to return to split-screen

**Expected Result:**
- Live preview on desktop (≥1280px)
- Updates after 300ms of inactivity
- Image uploads immediate
- Color changes live
- Layout changes immediate
- No full page reloads
- Expand/collapse works

**Acceptance Criteria:**
- ✅ Preview updates <500ms after change
- ✅ No page reloads
- ✅ Live color preview
- ✅ Layout updates immediate
- ✅ Expand/collapse toggle works
- ✅ Editor panel stays in scroll position

**Test Data:**
- Desktop width: 1920px
- Changes: text, image, color, layout

**Priority:** P1  
**Notes:** Test debouncing (rapid typing shouldn't cause multiple updates). Test on slow networks. Test error states. Test on mobile (split-screen not available).

---

### TC-030: Device Size Toggle in Preview
**User Story:** US-23  
**Title:** Preview on desktop, tablet, mobile sizes

**Steps:**
1. Live preview visible
2. Device toggle bar above preview: Desktop, Tablet, Mobile
3. Default: Desktop (full width)
4. User clicks Mobile icon
5. Preview reframes to 390px width
6. Device bezel graphic shows phone frame
7. Hero section displays stacked (image below text) for mobile layout
8. User makes text edit in editor
9. Mobile preview updates in real-time
10. User clicks Tablet icon
11. Preview reframes to ~768px width
12. Layout shows side-by-side (image right, text left)
13. User clicks Desktop icon
14. Returns to full-width preview

**Expected Result:**
- 3 device sizes available
- Mobile: 390px with bezel
- Tablet: ~768px
- Desktop: full width
- Responsive layouts render correctly
- Real-time updates on all sizes

**Acceptance Criteria:**
- ✅ 3 device size options
- ✅ Responsive layouts accurate
- ✅ Mobile shows stacked layout
- ✅ Tablet shows 2-column
- ✅ Desktop shows full width
- ✅ Real-time updates per size

**Test Data:**
- Mobile: 390px (stacked layout)
- Tablet: 768px (side-by-side)
- Desktop: 1920px (full width)

**Priority:** P1  
**Notes:** Test responsive accuracy. Test layout stacking. Test on actual phones/tablets. Test performance.

---

## Epic 12: Auto-Save + Undo (US-24 to US-25)

### TC-031: Auto-Save Every 30 Seconds
**User Story:** US-24  
**Title:** Automatic change persistence

**Steps:**
1. User makes change in editor (text, image, toggle)
2. 30 seconds pass without further change
3. "تم الحفظ تلقائياً" (Auto-saved) indicator appears in header
4. Fades out after 3 seconds
5. User makes another change
6. Indicator shows: "جاري الحفظ..." (Saving...) with spinner
7. Change auto-saves within 30 seconds
8. Indicator shows "تم الحفظ تلقائياً" again
9. User navigates away from section immediately after change
10. Change saves immediately (no waiting for 30-second timer)
11. User closes browser tab without saving
12. Unsaved changes within 30-second window: Browser shows "Are you sure you want to leave?"
13. User loses connection mid-edit
14. Indicator shows: "تعذّر الحفظ — ستتم المحاولة مرة أخرى" (Failed to save — will retry)
15. Changes stored in localStorage
16. Connection returns
17. Auto-save retries within 60 seconds
18. Indicator shows "تم الحفظ تلقائياً"

**Expected Result:**
- Auto-save every 30 seconds
- Visible save indicator
- Immediate save on navigation
- Failed saves retry automatically
- localStorage backup on network failure
- 60-second retry on failure

**Acceptance Criteria:**
- ✅ Auto-save <30 seconds
- ✅ Save indicator visible
- ✅ Immediate save on navigation
- ✅ Network failure handling
- ✅ Retry logic
- ✅ No silent data loss

**Test Data:**
- Change: Update text field
- Timer: 30 seconds idle → auto-save
- Network failure → localStorage → retry

**Priority:** P0  
**Notes:** Test timer accuracy. Test network failure recovery. Test browser close handling. Test localStorage backup.

---

### TC-032: Undo and Redo Functionality
**User Story:** US-25  
**Title:** Undo last change with keyboard or button

**Steps:**
1. User makes change 1: "Layla Designs" → "Layla Creative Designs"
2. "↩ تراجع" (Undo) button appears in toolbar
3. User makes change 2: About text updated
4. "↩ تراجع" button still visible (active)
5. User clicks Undo
6. Change 2 reversed (about text returns to previous state)
7. "↪ إعادة" (Redo) button appears
8. User clicks Undo again
9. Change 1 reversed (name returns to "Layla Designs")
10. "↩ تراجع" button grays out (no more undo history)
11. "↪ إعادة" button active
12. User clicks Redo
13. Change 1 restored: "Layla Creative Designs"
14. User makes change 3
15. Redo button grays out (new change breaks redo chain)
16. User presses Cmd+Z (Mac) or Ctrl+Z (Windows)
17. Change 3 undone
18. Undo/Redo works via keyboard

**Expected Result:**
- Undo reverses last change
- Redo restores previous state
- Undo history: at least 5 levels
- Keyboard shortcuts (Cmd+Z / Ctrl+Z)
- Redo clears on new change
- Grayed out when unavailable
- Auto-save doesn't interfere with undo

**Acceptance Criteria:**
- ✅ Undo functionality works
- ✅ Redo functionality works
- ✅ 5+ undo levels
- ✅ Keyboard shortcuts work
- ✅ Buttons gray out appropriately
- ✅ Redo clears on new change
- ✅ Auto-save doesn't block undo

**Test Data:**
- Change sequence: 1, 2, 3, 4, 5
- Undo: 5 → 4 → 3 → 2 → 1 → none (gray)
- Redo: 1 → 2 → 3 → (clear on new change)

**Priority:** P0  
**Notes:** Test undo history depth. Test keyboard shortcuts. Test redo clearing. Test undo after auto-save.

---

## Epic 13: Plain Language Admin (US-26 to US-27)

### TC-033: Zero Technical Jargon in Admin UI
**User Story:** US-26  
**Title:** All labels use plain Arabic (no technical terms)

**Steps:**
1. Dashboard navigation labels:
   - ❌ NOT: "Components", "Templates", "Config", "Blocks"
   - ✅ YES: "أقسام الموقع" (Site Sections), "تصميم الموقع" (Site Design)
2. Editor section labels:
   - ❌ NOT: "Slug", "Meta Description", "Metadata", "Schema"
   - ✅ YES: "رابط الموقع" (Site Link) with example: "مثال: مطعم-أحمد.safahati.com"
3. Button labels:
   - ❌ NOT: "Deploy", "Publish", "Cache"
   - ✅ YES: "انشر موقعك" (Publish your site)
4. Error messages:
   - ❌ NOT: "500 Internal Server Error", "ECONNREFUSED"
   - ✅ YES: "حدث خطأ — يرجى المحاولة لاحقاً" (Something went wrong — please try again)
5. Success messages:
   - ❌ NOT: "PUT 200 OK", "Record updated"
   - ✅ YES: "تم الحفظ بنجاح ✓" (Saved successfully)
6. Reorder controls:
   - ❌ NOT: "Change order index", "Move item"
   - ✅ YES: "حرّك للأعلى" / "حرّك للأسفل" (Move up / Move down)

**Expected Result:**
- Zero English technical terms in user-facing UI
- All Arabic labels use plain, understandable words
- Errors explain problem, not error code
- Success messages confirm action in plain language
- No "component", "template", "config", "slug", "deploy", "cache", "metadata", "schema", "block", "payload", "endpoint" terminology

**Acceptance Criteria:**
- ✅ No technical jargon in any label
- ✅ All Arabic plain language
- ✅ Errors user-friendly
- ✅ Success messages clear
- ✅ No English technical terms mixed in

**Test Data:**
- Scan: All UI labels, buttons, messages, errors
- Target: 0 technical terms

**Priority:** P0  
**Notes:** Full UI audit required. Test all user-facing pages and dialogs. Check error messages. Check tooltips.

---

### TC-034: Contextual Help Tooltips
**User Story:** US-27  
**Title:** Plain-language tooltips on settings

**Steps:**
1. Hero section editor
2. "Headline" field label with "?" icon next to it
3. User hovers over "?" (desktop)
4. Tooltip appears within 200ms: "العنوان الرئيسي الكبير الذي يظهر في الأعلى — استخدم جملة قصيرة جذابة" (The main large headline at the top — use a short, catchy sentence)
5. Mobile: User taps "?" icon
6. Tooltip appears, dismissible with X or tap elsewhere
7. SEO settings section
8. Banner at top: "هذا القسم يساعد موقعك على الظهور في نتائج جوجل — لا يجب أن تكون خبيراً لملئه، فقط اتبع التعليمات."
9. "Meta Description" field relabeled: "وصف محرك البحث"
10. Tooltip: "هذا النص يظهر تحت اسم موقعك في نتائج جوجل. اجعله وصفاً مختصراً لعيادتك في جملة أو جملتين."
11. "noindex / nofollow" setting: Hidden under "Advanced Settings" with warning banner
12. Required fields marked with red asterisk (*) AND "(مطلوب)" in Arabic

**Expected Result:**
- Tooltips on 90%+ of settings
- Grade-8 reading level
- Tooltips show within 200ms
- Mobile-friendly (dismissible)
- Required fields clearly marked
- Advanced settings have warnings
- No confusing technical terms

**Acceptance Criteria:**
- ✅ Tooltip coverage 90%+
- ✅ Plain language explanations
- ✅ Mobile-friendly tooltips
- ✅ Required fields marked
- ✅ Advanced settings warned
- ✅ No technical jargon
- ✅ Tooltips accessible (ARIA)

**Test Data:**
- Fields with tooltips: [headline, description, logo, opening hours, meta description, seo settings]
- Required fields: [business name, industry, language]

**Priority:** P0  
**Notes:** WCAG accessibility check. Test tooltip positioning on narrow screens. Test ARIA attributes for screen readers.

---

## Epic 14: Done for You (US-28 to US-29)

### TC-035: Done for You Service Request
**User Story:** US-28  
**Title:** Request managed site build from dashboard

**Steps:**
1. User inactive for 3 days OR completeness <50% AND 4th login
2. Banner appears: "هل تريد أن نبني موقعك بدلاً عنك؟" (Want us to build your site?)
3. User clicks banner
4. Navigates to "أنجز معنا" (Done for You) page
5. Page displays:
   - Pricing: "799 ريال — موقع جاهز خلال 48 ساعة"
   - Bullet list: "يتضمن" (Includes)
     - موقع احترافي مكتمل
     - تصميم يعكس علامتك التجارية
     - محسّن للهواتف الذكية
     - دعم الواتساب
     - دعم باللغة العربية والإنجليزية
   - Primary button: "احجز الخدمة" (Book the Service)
   - Secondary: "تواصل عبر واتساب" (Chat via WhatsApp)
6. User clicks "احجز الخدمة"
7. Booking form opens (4 fields):
   - الاسم (Name) — required
   - رقم الهاتف (Phone) — auto-filled from account, editable
   - رقم واتساب (WhatsApp) — auto-filled if set, editable
   - أخبرنا عن مشروعك (Tell us about your business) — textarea, max 500 chars
8. User fills form and clicks "أرسل الطلب" (Submit Request)
9. Form validates all required fields
10. Submit succeeds
11. Confirmation screen: "تلقينا طلبك! سيتواصل معك فريقنا عبر واتساب خلال ساعتين."
12. User closes
13. Dashboard shows status banner: "طلب الخدمة المُدارة: قيد المراجعة" (Service request: Under review)

**Expected Result:**
- Service page accessible from nudge banner
- Pricing and benefits clearly displayed
- Booking form simple (4 fields max)
- Phone/WhatsApp auto-filled
- Confirmation shown
- Dashboard status tracked

**Acceptance Criteria:**
- ✅ Page accessible from banner
- ✅ Pricing and benefits clear
- ✅ Booking form < 4 fields
- ✅ Auto-fill works
- ✅ Validation on submit
- ✅ Confirmation screen
- ✅ Dashboard status banner

**Test Data:**
- Pricing: 799 SAR
- Service duration: 48 hours
- Form fields: 4 (name, phone, whatsapp, message)

**Priority:** P1  
**Notes:** Test form auto-fill. Test validation. Test on mobile. Test status banner timing.

---

### TC-036: Contextual Done for You Nudges
**User Story:** US-29  
**Title:** Gentle reminders when user is stuck

**Steps:**

**Scenario A — Long Inactivity:**
1. User on same editor section for 15 minutes without saving
2. Slide-in banner appears at bottom: "يبدو أنك تعمل على هذا القسم منذ فترة — هل تريد مساعدة متخصصة؟"
3. Link: "تعرّف على خدمة أنجز معنا" (Learn about Done for You)
4. User clicks "X" to dismiss
5. Banner doesn't reappear for 72 hours
6. User completes section (saves), timer resets

**Scenario B — Low Completeness:**
1. User's completeness <30% for 7+ days
2. Logs into dashboard
3. Card displayed: "لم تكمل موقعك بعد — دعنا نفعل ذلك من أجلك في 48 ساعة"
4. Button: "اعرف التفاصيل" (Learn more)
5. Click takes user to Done for You page (US-28)

**Scenario C — High Completeness:**
1. User completes site (completeness ≥80%)
2. All Done for You nudges hidden
3. Completeness meter shows: "موقعك مكتمل بالكامل 🎉"

**Scenario D — Already Purchased:**
1. User has purchased Done for You service
2. All nudge banners hidden
3. Status card shows: "طلب الخدمة المُدارة: قيد المراجعة / مكتمل"

**Expected Result:**
- Nudges appear when user is genuinely stuck
- Dismissible with 72-hour cooldown
- Nudges hidden when completeness high
- Nudges hidden when service already purchased
- Gentle, non-intrusive messaging

**Acceptance Criteria:**
- ✅ Inactivity nudge after 15 minutes
- ✅ Low completeness nudge after 7 days
- ✅ Dismissible with 72-hour cooldown
- ✅ Hidden when completeness ≥80%
- ✅ Hidden when service purchased
- ✅ Gentle messaging (not aggressive)
- ✅ Low-connectivity version available

**Test Data:**
- Inactivity timer: 15 minutes
- Completeness threshold: <30% for 7 days
- Cooldown: 72 hours
- High completeness: ≥80%

**Priority:** P1  
**Notes:** Test timing accuracy. Test cooldown logic. Test visibility rules. Test on low-connectivity (text-only version).

---

# PART C: TEST DATA, ENVIRONMENT, AND REGRESSION CHECKLIST

## Test Data Setup

### A. Default Wizard Answers (English)
```
Business Type:     "company"
Business Name:     "Acme Corp"
Language:          "en"
Slogan:            "Solutions for Tomorrow"
Services:          ["consulting", "software", "support"]
Contact Pref:      "whatsapp"
WhatsApp:          "+966501234567"
Logo:              [skipped — avatar placeholder]
Tagline:           [default provided]
```

### B. Default Wizard Answers (Arabic)
```
Business Type:     "clinic"
Business Name:     "عيادة الدكتور أحمد"
Language:          "ar"
Specialties:       ["dentistry", "dermatology"]
Doctors Count:     "multiple"
Contact Pref:      "whatsapp"
WhatsApp:          "+966501234567"
Logo:              [skipped]
Appointment Link:  [auto-generated]
```

### C. Opening Hours Test Data
```
Monday-Thursday:   12:00 PM – 11:00 PM
Friday:            Closed
Saturday:          2:00 PM – 12:00 AM (past midnight)
Sunday:            12:00 PM – 11:00 PM

Expected display (AR):
"السبت – الخميس: 12:00 م – 11:00 م | الجمعة: مغلق"
"السبت: 2:00 م – 12:00 ص (صباح الأحد)"
```

### D. AI Content Prompts
```
Restaurant About:
  "Friendly" → "مطعمنا يرحب بك! نقدم الطعام الأصيل والخدمة الدافئة في جدة."
  "Creative" → "في مطعمنا، الطعام هو فن والخدمة هي موسيقى — تفضل وشاركنا التجربة."

Clinic Specialties:
  [Dentistry, Dermatology, General Practice]
  Arabic names: طب الأسنان، الأمراض الجلدية، الطب العام

Freelancer Portfolio:
  Services: [Graphic Design, Branding, Web Design, UI/UX Design]
  Portfolio items: 3-5 samples with images and descriptions
```

### E. Translation Test Data (Arabic → English)
```
Hero Headline (AR):        "مصممة جرافيك مبدعة"
Expected (EN):            "Creative Graphic Designer"

About Section (AR):        "أنا ليلى، مصممة جرافيك متخصصة في الهوية البصرية للعلامات التجارية."
Expected (EN):            "I'm Layla, a graphic designer specializing in brand identity design."

Opening Hours (AR):        "السبت – الخميس: 12:00 م – 11:00 م | الجمعة: مغلق"
Expected (EN):            "Sat – Thu: 12:00 PM – 11:00 PM | Fri: Closed"
```

---

## Test Environment Requirements

### Infrastructure
- [ ] Test database (PostgreSQL or SQLite) with 13 industry templates pre-loaded
- [ ] Mock Claude API responses for all AI suggestions/generation
- [ ] Service worker and PWA setup (manifest.json, service-worker.js)
- [ ] Mock WhatsApp integration (API responses for button behavior)
- [ ] Time zone mock (for Open/Closed status testing) — fake server time

### Test Credentials
```
User 1 (Restaurant owner):
  Email:    ahmad@test.safahati.com
  Password: TestPass123!
  Name:     Ahmad Shami
  Phone:    +966501234567

User 2 (Freelancer):
  Email:    layla@test.safahati.com
  Password: TestPass123!
  Name:     Layla Al-Qahtani
  Phone:    +966501234568

User 3 (Clinic manager):
  Email:    sara@test.safahati.com
  Password: TestPass123!
  Name:     Sara Al-Zahrani
  Phone:    +966501234569
```

### Browser/Device Testing Matrix

| Browser | Version | Platform | Viewport | PWA |
|---------|---------|----------|----------|-----|
| Chrome | 124+ | Windows, Mac, Linux | 375px, 768px, 1920px | Yes |
| Safari | 17+ | iOS 16+, macOS 12+ | 375px, 768px, 1920px | Yes |
| Firefox | 123+ | Windows, Mac, Linux | 375px, 768px, 1920px | No |
| Chrome | 124+ | Android 10+ | 375px, 768px | Yes |
| Safari | 17+ | iOS 13+ | 375px, 768px | Yes |

### API Mocks Required
```
POST /api/auth/register       → Mock user creation
POST /api/auth/login          → Mock JWT token return
GET /api/sites                → Return mock site list
POST /api/sites               → Mock site creation with industry template seeding
POST /api/ai/generate         → Mock Claude API content generation
POST /api/ai/translate        → Mock translation API
POST /api/auth/send-otp       → Mock OTP email
POST /api/auth/verify-otp     → Mock OTP verification
```

---

## Regression Test Checklist

These tests must always pass:

- [ ] **Existing non-wizard site creation still works** (old code path)
  - Direct API POST /api/sites without wizard
  - Site created with minimal data
  - Industry template seeding succeeds

- [ ] **Dashboard site list still functions**
  - GET /api/sites returns correct user's sites only
  - List updates after site creation
  - No duplicate sites shown
  - Deleted sites removed from list

- [ ] **Published sites still render**
  - Subdomain routing works (client1.safahati.com)
  - All sections render without errors
  - Images load correctly
  - Links functional (internal and external)

- [ ] **Editor basic functionality**
  - Site loads in editor (/dashboard/[siteId]/editor)
  - All sections visible in left panel
  - Clicking section highlights it
  - Editing a field persists on save
  - No console errors in editor

- [ ] **Multi-tenant isolation**
  - User A cannot access User B's sites (404)
  - User A's dashboard shows only their sites
  - API returns 404 (not 403) for another user's data

- [ ] **Authentication flows**
  - Register: new user created, redirected to dashboard
  - Login: existing user logged in, JWT set, redirected to dashboard
  - Logout: session cleared, redirected to login
  - Unauthenticated: /dashboard redirects to /login

- [ ] **RTL/Arabic bilingual**
  - Arabic sites: dir="rtl" on document root
  - Arabic sites: font loads (Noto Kufi Arabic or equivalent)
  - English sites: dir="ltr"
  - Both languages render correctly in editor and published site

- [ ] **Mobile responsiveness**
  - No horizontal scrolling on 375px width
  - Touch targets 48px+ (for mobile testing)
  - Viewport meta tag set correctly
  - No overlaps on mobile layout

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-25  
**Total Test Cases:** 36 (covering 29 user stories with 2-3 tests each + regression checks)  
**Estimated Execution Time:** 8-10 hours (manual QA)  
**Automation Readiness:** Ready for Playwright/Vitest implementation  
