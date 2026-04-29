# Non-Technical User Stories
## Safahati Platform — Non-Technical User Feature Set
### Version 1.0 | April 2026
### Author: Business Analyst (Virtual Team)

---

## Document Purpose

This document contains user stories for the 14 features identified by the Product Owner to serve non-technical users on the Safahati platform. These features are specifically designed for users who have no web development knowledge — restaurant owners, clinic managers, freelancers, and small business owners in the MENA/Saudi market who need a professional bilingual website they can build and manage themselves.

Each story is written to be independently testable, implementation-ready, and tied to a specific persona and real-world context.

---

## Persona Reference

| Persona | Role | Location | Language | Key Context |
|---|---|---|---|---|
| **Layla** | Freelance graphic designer, 28 | Riyadh | Arabic primary | Needs a portfolio site, high visual standards, mobile + desktop |
| **Ahmad** | Restaurant owner, 45 | Jeddah | Arabic-first | Wants customers to find him via WhatsApp, not email, needs simplicity |
| **Sara** | Clinic manager, 38 | Riyadh | Arabic primary, reads English | Needs a credible, professional web presence, manages staff too |

---

## Epic Index

| Epic | Stories | Description |
|---|---|---|
| EP-01 | US-01, US-02, US-03 | "Build My Site in 5 Minutes" Wizard |
| EP-02 | US-04, US-05 | WhatsApp-First Contact Integration |
| EP-03 | US-06, US-07 | Smart Content Suggestions |
| EP-04 | US-08, US-09 | Mobile Admin PWA |
| EP-05 | US-10, US-11 | "Help Me Write This" AI Button |
| EP-06 | US-12, US-13 | Opening Hours Component |
| EP-07 | US-14, US-15 | "What's Missing" Completeness Meter |
| EP-08 | US-16, US-17 | Template Switching Without Data Loss |
| EP-09 | US-18, US-19 | Duplicate & Translate |
| EP-10 | US-20, US-21 | "Launch Your Site" Celebration Screen |
| EP-11 | US-22, US-23 | Live Preview in Editor |
| EP-12 | US-24, US-25 | Auto-Save + Undo |
| EP-13 | US-26, US-27 | Plain Language Admin |
| EP-14 | US-28, US-29 | "Done for You" Upgrade Path |

---

---

## EP-01: "Build My Site in 5 Minutes" Wizard

> A conversational, 8-question guided setup that collects enough information to generate a fully populated, publish-ready site without the user touching a single config field.

---

### US-01 — Guided Site Creation Wizard (Happy Path)

```
Story ID: US-01
Epic: EP-01 — "Build My Site in 5 Minutes" Wizard
Title: Complete guided wizard to generate a ready-to-publish site
```

As **Ahmad**, a restaurant owner in Jeddah who has never built a website,
I want to answer a short series of plain-language questions about my restaurant,
So that a complete, ready-to-publish website is built for me automatically — without me having to figure out what "sections", "components", or "templates" mean.

**Acceptance Criteria:**

- **Given** Ahmad is logged in and has no existing site, **When** he clicks "أنشئ موقعي الآن" (Create My Site Now) on the dashboard, **Then** the wizard launches in full-screen mode in Arabic, showing Step 1 of 8 with a progress bar.
- **Given** Ahmad is on Step 1 (Business Type), **When** he selects "مطعم" (Restaurant) from a visual card grid (not a dropdown), **Then** the subsequent questions automatically adapt to the restaurant context (e.g., question 3 becomes "What are your main dishes?" instead of "What are your services?").
- **Given** Ahmad has answered all 8 questions, **When** he clicks "أنشئ موقعي" (Build My Site), **Then** within 15 seconds a complete site is generated with: a hero section using his business name and slogan, a menu/services section, an about section, an opening hours section, and a WhatsApp contact button — all populated with his answers.
- **Given** the site has been generated, **When** Ahmad sees the preview screen, **Then** he sees a live preview of his site (not a blank editor) and a prominent "انشر الآن" (Publish Now) button alongside an "Edit Later" link.
- **Given** Ahmad chose Arabic as his language during the wizard, **When** the site is generated, **Then** all default content is in Arabic, text direction is RTL, and the font is appropriate for Arabic readability (e.g., Noto Kufi Arabic).
- **Given** Ahmad skips an optional question (e.g., logo upload), **When** the site is generated, **Then** a placeholder logo using his initials is used, and a "Complete Your Site" tip appears on the dashboard pointing to the missing element.

**Edge Cases:**
- If the wizard is closed mid-flow (e.g., browser tab closed), the progress is saved and the wizard resumes from the last completed step on next login.
- If the AI site generation takes longer than 15 seconds, a friendly animated progress message is shown ("نبني موقعك الآن... لحظة من فضلك") — the user does not see a spinner on a blank screen.
- If Ahmad enters a business name longer than 60 characters, an inline message asks him to shorten it ("سيظهر هذا كعنوان رئيسي في موقعك — اختصره قليلاً").

**Out of Scope:**
- This story does not cover post-generation editing (covered in editor stories).
- This story does not cover multi-site creation.
- This story does not cover payment or subscription selection (wizard completes on free plan by default).

```
Priority: Must Have
Story Points: 13
Dependencies: None
Assigned Role: Both
```

---

### US-02 — Wizard Question Validation and Back Navigation

```
Story ID: US-02
Epic: EP-01 — "Build My Site in 5 Minutes" Wizard
Title: Validate wizard inputs and allow free back-and-forth navigation
```

As **Layla**, a freelance designer who is detail-oriented and wants her wizard output to be accurate,
I want to be able to go back to any previous question and change my answer,
So that I don't have to restart the entire wizard if I made a mistake or changed my mind.

**Acceptance Criteria:**

- **Given** Layla is on Step 5 of the wizard, **When** she clicks the back arrow, **Then** she returns to Step 4 with her previously entered answer still populated — nothing is cleared.
- **Given** Layla is on Step 3 and leaves the required "Business Name" field blank, **When** she clicks "Next", **Then** an inline error message appears under the field in Arabic: "اسم المشروع مطلوب" — the wizard does not advance.
- **Given** Layla is on the final confirmation screen showing a summary of all 8 answers, **When** she clicks "Edit" next to any answer, **Then** she is taken directly back to that specific question step with her current answer pre-filled.
- **Given** Layla changes her business type (Step 1) on the confirmation screen, **When** she returns to the summary, **Then** the platform warns her: "تغيير النوع سيعيد توليد بعض الأسئلة — هل تريد الاستمرار؟" and shows what will be affected.
- **Given** Layla is on the wizard using her iPhone (mobile), **When** she views each question step, **Then** the question card takes up the full screen, the input is the first focusable element, and the keyboard does not obscure the "Next" button.

**Edge Cases:**
- If Layla uploads a logo that is larger than 5MB, the wizard shows: "الصورة كبيرة جداً — يُرجى رفع صورة أصغر من 5 ميغابايت" and does not advance until the issue is resolved or the upload is skipped.
- If the user's internet drops between step 6 and step 7, progress is saved locally (localStorage) and a "Resume" prompt appears when connectivity returns.
- If the user completes the wizard on desktop but closes the browser before the site is generated, the answers are persisted and the generation can be triggered on the next login.

**Out of Scope:**
- This story does not cover the site generation algorithm (covered in US-01).
- This story does not cover A/B testing different question sets.

```
Priority: Must Have
Story Points: 5
Dependencies: US-01
Assigned Role: FE
```

---

### US-03 — Wizard Industry-Specific Question Branching

```
Story ID: US-03
Epic: EP-01 — "Build My Site in 5 Minutes" Wizard
Title: Adapt wizard questions dynamically based on selected industry
```

As **Sara**, a clinic manager who needs a very different site from a restaurant owner,
I want the wizard to ask me questions that are specific to a medical clinic,
So that the generated site reflects my actual business — not a generic placeholder.

**Acceptance Criteria:**

- **Given** Sara selects "عيادة طبية" (Medical Clinic) as her business type in Step 1, **When** she proceeds to Step 3, **Then** the question reads "What medical specialties does your clinic offer?" with multi-select chips for common Saudi clinic types (General Practice, Dentistry, Dermatology, Pediatrics, etc.) in Arabic.
- **Given** Sara selects "عيادة طبية" and advances to Step 5, **When** the question about contact preference appears, **Then** the options are: WhatsApp (pre-selected), phone call, and appointment booking form — email is not shown as a primary option.
- **Given** Sara selects "مطلب حر" (Freelancer) as the business type, **When** the wizard runs, **Then** Step 4 asks "What is your area of expertise?" and Step 5 asks "Do you want to show a portfolio of your work?" — questions irrelevant to freelancers (like "menu items") are excluded.
- **Given** the wizard generates a site for a clinic, **When** the site preview renders, **Then** it includes: specialties section, team/doctors section, opening hours, and a booking/WhatsApp CTA — and does NOT include a "menu" or "pricing packages" section unless the user added it.
- **Given** the platform supports 13 industry templates, **When** a user selects any of the 13 types in Step 1, **Then** the remaining 7 questions adapt with at least 3 industry-specific options per question.

**Edge Cases:**
- If a business type is selected that does not have a matching industry template (edge case during beta), the system defaults to the "Company" template and shows: "اخترنا قالباً عاماً — يمكنك تغييره لاحقاً" (We chose a general template — you can change it later).

**Out of Scope:**
- This story does not cover custom question sets created by admins.
- This story does not cover more than 13 industry types in v1.

```
Priority: Must Have
Story Points: 8
Dependencies: US-01
Assigned Role: Both
```

---

---

## EP-02: WhatsApp-First Contact Integration

> A floating WhatsApp button that any business owner can configure with a single phone number field, reflecting MENA communication preferences where WhatsApp is the dominant customer contact channel.

---

### US-04 — Add WhatsApp Button with One Field

```
Story ID: US-04
Epic: EP-02 — WhatsApp-First Contact Integration
Title: Configure a floating WhatsApp contact button using a single phone number field
```

As **Ahmad**, a restaurant owner whose customers only contact him via WhatsApp,
I want to add my WhatsApp number to my site with a single input field,
So that every visitor can message me instantly without having to look up my number.

**Acceptance Criteria:**

- **Given** Ahmad is in the site editor, **When** he opens the "Contact" section settings, **Then** the first and most prominently displayed option is "WhatsApp Button" with a single phone number input field — not a form builder.
- **Given** Ahmad enters his Saudi mobile number as "0501234567", **When** he saves, **Then** the platform automatically formats it to the international WhatsApp-compatible format (+966501234567) and the floating green WhatsApp button appears on his live site.
- **Given** a visitor clicks the WhatsApp button on Ahmad's site on mobile, **When** the WhatsApp app opens, **Then** a pre-filled message reads: "مرحباً، رأيت موقعك وأريد الاستفسار" (Hello, I saw your site and would like to inquire) — the visitor does not start with a blank chat.
- **Given** Ahmad wants to customize the pre-filled message, **When** he opens the WhatsApp button settings, **Then** there is an optional "Default message" text field (max 160 characters) with a character counter and an example preview.
- **Given** the WhatsApp button is enabled, **When** a visitor views Ahmad's site on desktop, **Then** the button is visible in the bottom-right corner (or bottom-left for RTL sites), does not cover important content, and clicking it opens web.whatsapp.com in a new tab.
- **Given** Ahmad has not yet added a phone number, **When** the dashboard "What's Missing" meter runs, **Then** "Add your WhatsApp number" appears as a recommended action.

**Edge Cases:**
- If Ahmad enters an invalid phone number (e.g., "05012" or "abc"), the field shows an inline error: "يرجى إدخال رقم هاتف صحيح" and the save button is disabled until corrected.
- If the entered number does not match Saudi, UAE, or other GCC country code patterns, a soft warning appears: "تأكد أن الرقم يتضمن رمز الدولة (+966)" but does not block saving.

**Out of Scope:**
- This story does not cover WhatsApp Business API integration or automated chatbots (v2 feature).
- This story does not cover multiple WhatsApp numbers for different departments.

```
Priority: Must Have
Story Points: 3
Dependencies: None
Assigned Role: Both
```

---

### US-05 — WhatsApp Button Display and Position Control

```
Story ID: US-05
Epic: EP-02 — WhatsApp-First Contact Integration
Title: Control floating WhatsApp button visibility, position, and page-level rules
```

As **Sara**, a clinic manager who wants the WhatsApp button visible on most pages but not on the appointment booking page,
I want to control where and how the WhatsApp button appears on my site,
So that it enhances the user experience rather than cluttering the booking flow.

**Acceptance Criteria:**

- **Given** Sara opens the WhatsApp button settings, **When** she views the position options, **Then** she sees two visual options: "Bottom Right" and "Bottom Left" displayed as thumbnail previews — not a dropdown with code terms.
- **Given** Sara's site is in Arabic (RTL), **When** the WhatsApp button is first enabled, **Then** it defaults to "Bottom Left" (which is the primary side in RTL layouts), but Sara can override this.
- **Given** Sara's site has a "Book Appointment" page, **When** Sara opens the WhatsApp button settings, **Then** there is a toggle "Hide on specific pages" that when enabled shows a checklist of her site's pages — she can uncheck the booking page.
- **Given** Sara disables the WhatsApp button on the booking page, **When** a visitor navigates to that page, **Then** the floating button smoothly fades out — it does not abruptly disappear or cause layout shift.
- **Given** Sara enables the WhatsApp button, **When** she previews her site on mobile (< 768px), **Then** the button does not overlap the browser's native navigation bar or the site's footer navigation.

**Edge Cases:**
- If Sara's site has 0 pages defined beyond the homepage, the "Hide on specific pages" option is grayed out with the tooltip: "أضف صفحات إضافية لتتمكن من التحكم في ظهور الزر".
- If the phone number is deleted after the button was active, the button is automatically hidden from the live site and the dashboard shows a warning: "زر واتساب معطل — أضف رقم هاتف لتفعيله".

**Out of Scope:**
- This story does not cover scheduling rules for when the button appears (e.g., "only show during business hours").
- This story does not cover click analytics for the WhatsApp button (v2).

```
Priority: Should Have
Story Points: 3
Dependencies: US-04
Assigned Role: FE
```

---

---

## EP-03: Smart Content Suggestions

> AI-generated placeholder suggestions displayed inside every text field in the editor, giving non-technical users a starting point instead of a blank box labeled "Enter your text here."

---

### US-06 — AI Placeholder Suggestions in Text Fields

```
Story ID: US-06
Epic: EP-03 — Smart Content Suggestions
Title: See industry-specific AI suggestions inside every text field before typing
```

As **Layla**, a freelance designer who stares at blank text fields and doesn't know what to write,
I want to see a relevant suggestion already shown inside each text field when I open the editor,
So that I have a starting point and can edit rather than write from scratch.

**Acceptance Criteria:**

- **Given** Layla's site industry is set to "Freelancer" and she opens the hero section editor, **When** the headline text field is empty and focused, **Then** a gray placeholder suggestion appears inside the field reading (in Arabic): "مصممة جرافيك مبدعة — أحوّل أفكارك إلى هوية بصرية لا تُنسى" — formatted as ghost text, not editable until she starts typing.
- **Given** Layla clicks on the subheadline field without typing anything, **When** she pauses for 1 second, **Then** 3 alternative suggestions appear below the field in a dropdown list she can click to insert.
- **Given** Layla selects one of the 3 AI suggestions by clicking it, **When** the suggestion is inserted, **Then** it appears in the field as editable text, the cursor is placed at the end, and a small "AI" tag appears in the field corner to indicate AI-generated content.
- **Given** Layla's industry is "Freelancer" and she has entered her name as "Layla Al-Qahtani" in the wizard, **When** AI suggestions are generated for the about section, **Then** they include her name: "أنا ليلى القحطاني..." — suggestions are personalized, not generic.
- **Given** Layla is editing the services section, **When** she adds a new service card and focuses the title field, **Then** the AI suggestion is contextually aware: it suggests a service name appropriate for a designer (e.g., "تصميم الهوية البصرية") rather than a generic "Service Name".
- **Given** Layla has entered her own custom text in a field, **When** she deletes it and the field becomes empty again, **Then** the ghost placeholder suggestion reappears — it does not disappear after first use.

**Edge Cases:**
- If the AI suggestion API is unavailable (network error), the fields show standard static placeholder text (e.g., "أضف عنواناً هنا") — the editor remains fully functional without AI.
- If the user's language is set to English, all AI suggestions are generated in English with LTR formatting.
- If a field has a character limit (e.g., 80 chars for a headline), the AI suggestion is pre-trimmed to fit within that limit.

**Out of Scope:**
- This story does not cover AI suggestions for image fields, color fields, or layout options.
- This story does not cover suggestions learning from the user's own past content (v2).

```
Priority: Should Have
Story Points: 5
Dependencies: None
Assigned Role: Both
```

---

### US-07 — Regenerate and Cycle Through AI Suggestions

```
Story ID: US-07
Epic: EP-03 — Smart Content Suggestions
Title: Regenerate AI content suggestions to get different options
```

As **Ahmad**, who doesn't like the first AI-suggested description for his restaurant,
I want to generate new suggestions until I find one that sounds like me,
So that the content feels authentic to my business and not like a generic template.

**Acceptance Criteria:**

- **Given** Ahmad is viewing an AI suggestion in a text field, **When** he clicks the "جرّب غيرها" (Try Another) icon (a refresh icon next to the field), **Then** a new suggestion replaces the previous one within 2 seconds, and the old suggestion is kept accessible in a "Previous suggestions" mini-history (last 3).
- **Given** Ahmad has clicked "جرّب غيرها" 3 times, **When** there are no more unique suggestions available from the current generation batch, **Then** a new API call is triggered and a loading indicator shows inside the field for up to 3 seconds.
- **Given** Ahmad finds a suggestion he likes from the history, **When** he clicks it in the "Previous suggestions" list, **Then** it replaces the current field content.
- **Given** Ahmad is on a slow mobile connection (3G), **When** he requests a new suggestion, **Then** the field shows a "جاري التحميل..." (Loading...) state and the refresh button is disabled to prevent duplicate requests.
- **Given** Ahmad is editing on the same device he used yesterday, **When** he opens the same field again, **Then** the last suggestion he was viewing is still shown — suggestions persist per session.

**Edge Cases:**
- If the AI generates a suggestion that exceeds the field's character limit, it is automatically truncated with a note: "تم اختصار النص ليناسب الحقل".
- If the same suggestion is returned twice in a row by the AI, the platform detects the duplicate and automatically requests another, so Ahmad never sees the same suggestion twice in a row.

**Out of Scope:**
- This story does not cover saving favorite suggestions to a reusable library.
- This story does not cover user feedback on suggestion quality (thumbs up/down) in v1.

```
Priority: Should Have
Story Points: 3
Dependencies: US-06
Assigned Role: Both
```

---

---

## EP-04: Mobile Admin PWA

> An installable Progressive Web App that turns the Safahati dashboard into a home-screen app on the user's phone, enabling full site management from a mobile device without requiring a native app download.

---

### US-08 — Install Dashboard as PWA on iPhone/Android

```
Story ID: US-08
Epic: EP-04 — Mobile Admin PWA
Title: Install the Safahati admin dashboard as a home-screen app
```

As **Ahmad**, who manages everything from his phone and never opens a laptop,
I want to install the Safahati admin as an app on my phone's home screen,
So that I can update my restaurant's information from my phone the same way I manage WhatsApp.

**Acceptance Criteria:**

- **Given** Ahmad visits app.safahati.com on Safari on his iPhone for the first time, **When** a browser prompt or an in-app banner appears, **Then** it reads "أضف ساعة الزيارة الآن" (Add to Home Screen) in Arabic with the Safahati icon, and tapping it installs the PWA on his home screen.
- **Given** the PWA is installed on Ahmad's home screen, **When** he opens it, **Then** it launches in full-screen mode (no browser address bar), displays the Safahati logo and his restaurant name in the header, and loads the dashboard within 3 seconds on a standard 4G connection.
- **Given** Ahmad opens the installed PWA and his phone has an internet connection, **When** he navigates to the "Content" section, **Then** all editing features available on desktop are accessible on mobile with touch-optimized controls (larger tap targets, swipe-to-navigate between sections).
- **Given** Ahmad has the PWA installed and his phone goes offline, **When** he opens the PWA, **Then** it shows a cached version of the dashboard with a clear offline indicator ("غير متصل بالإنترنت") — it does not show a browser error page.
- **Given** Ahmad updates his restaurant's opening hours in the PWA, **When** he saves the change, **Then** the update is reflected on his live site within 10 seconds, and a green success toast appears: "تم الحفظ بنجاح ✓".

**Edge Cases:**
- If Ahmad's iPhone iOS version does not support PWA installation (iOS < 11.3), the banner does not appear and no broken install attempt is triggered.
- If the PWA cache is older than 24 hours, a soft refresh prompt appears: "يتوفر تحديث — اضغط لتحديث التطبيق" without forcing a reload.

**Out of Scope:**
- This story does not cover push notifications via PWA (v2 feature).
- This story does not cover offline editing with sync on reconnect (v2 feature).

```
Priority: Should Have
Story Points: 8
Dependencies: None
Assigned Role: Both
```

---

### US-09 — Mobile-Optimized Dashboard Navigation and Controls

```
Story ID: US-09
Epic: EP-04 — Mobile Admin PWA
Title: Navigate and edit site content from a touch-optimized mobile interface
```

As **Sara**, who checks her clinic website from her phone between patient appointments,
I want the admin dashboard to be fully usable on my phone with one hand,
So that I can make quick updates (like changing opening hours or adding a notice) in under 2 minutes.

**Acceptance Criteria:**

- **Given** Sara opens the mobile PWA, **When** she views the dashboard home, **Then** the primary navigation is a bottom tab bar (not a hamburger menu hidden behind a click) with 4 tabs: Home, Edit Site, Preview, and Account — each with an Arabic label and icon.
- **Given** Sara taps "Edit Site" in the PWA, **When** the section list loads, **Then** each section is displayed as a large card with the section name in Arabic, a brief description, and a single "تعديل" (Edit) button — minimum 48px touch target height.
- **Given** Sara opens a text field in the mobile editor, **When** the device keyboard appears, **Then** the field scrolls above the keyboard automatically and the "Save" button remains visible and tappable without scrolling.
- **Given** Sara is editing the clinic's "About Us" text on mobile, **When** she makes a change and taps the back button on the section editor, **Then** she is prompted: "لم تحفظ التغييرات — هل تريد المغادرة؟" with "احفظ" (Save) and "تجاهل" (Discard) options — her work is never silently lost.
- **Given** Sara is using the mobile PWA in portrait orientation, **When** she rotates her phone to landscape, **Then** the layout adapts without breaking, the navigation remains accessible, and no content is cropped.

**Edge Cases:**
- If Sara's phone screen is smaller than 375px wide (older Android devices), all text remains readable (min font size 14px) and no interactive element is hidden off-screen.
- If Sara loses connection while editing, a banner appears at the top: "لا يوجد اتصال — سيتم الحفظ عند عودة الاتصال" and the Save button changes to "حفظ عند الاتصال".

**Out of Scope:**
- This story does not cover a dedicated native iOS or Android app.
- This story does not cover multi-user collaboration from mobile.

```
Priority: Should Have
Story Points: 5
Dependencies: US-08
Assigned Role: FE
```

---

---

## EP-05: "Help Me Write This" AI Content Button

> A per-field AI content generation button that, when clicked, generates complete, ready-to-use text for that specific field based on the user's business context — going beyond suggestions to full generation on demand.

---

### US-10 — Generate Full Field Content with One Click

```
Story ID: US-10
Epic: EP-05 — "Help Me Write This" AI Button
Title: Generate complete field content using a per-field AI button
```

As **Ahmad**, who struggles to write professional-sounding Arabic text for his restaurant's "About Us" section,
I want to click a single button next to any text field and get professional content written for me,
So that my website sounds credible and well-written without me having to hire a copywriter.

**Acceptance Criteria:**

- **Given** Ahmad is editing his restaurant's "About Us" text field (currently empty), **When** he clicks the "✨ ساعدني في الكتابة" (Help Me Write This) button next to the field, **Then** within 5 seconds a full, professional Arabic paragraph is generated and inserted into the field — Ahmad sees the text appearing character by character (streaming effect).
- **Given** the AI generates content, **When** Ahmad reads it, **Then** it references his actual business information from the wizard (restaurant name, type, location in Jeddah) — it is not generic filler text like "Our company is dedicated to excellence."
- **Given** Ahmad is not satisfied with the generated content, **When** he clicks "أعد الكتابة" (Rewrite), **Then** a new, distinct version is generated — the second version is noticeably different in tone or structure from the first.
- **Given** the generated content is inserted, **When** Ahmad edits it manually, **Then** the field behaves as a normal editable text area — the AI content is just a starting point, fully editable.
- **Given** Ahmad is editing the "Specialties" field (a shorter field with 120-char limit), **When** he clicks "Help Me Write This", **Then** the AI generates content that fits within the character limit — it does not generate a paragraph and truncate it awkwardly.
- **Given** the "Help Me Write This" button is present, **When** a field already has user-entered content (not empty), **Then** the button label changes to "✨ حسّن هذا النص" (Improve This Text) and clicking it rewrites the existing content rather than replacing it with a generic default.

**Edge Cases:**
- If the AI API returns an error, the button shows: "تعذّر إنشاء المحتوى — حاول مرة أخرى" and the original field content (if any) is preserved.
- If Ahmad rapidly clicks the button 3 times before the first response arrives, only one request is sent — duplicate requests are debounced.
- If the field has a mandatory minimum character count (e.g., 50 chars for meta description), and the AI generates content below that count, the field shows a warning but does not block saving.

**Out of Scope:**
- This story does not cover AI-generated image content or alt text generation (separate story).
- This story does not cover full-page AI content generation (covered in wizard, US-01).

```
Priority: Should Have
Story Points: 5
Dependencies: None
Assigned Role: Both
```

---

### US-11 — Tone and Style Selection for AI-Generated Content

```
Story ID: US-11
Epic: EP-05 — "Help Me Write This" AI Button
Title: Select tone and style before generating AI content
```

As **Layla**, a freelance designer whose brand voice is creative and modern (not formal corporate),
I want to choose the tone of the AI-generated content before it writes,
So that the output sounds like me and not like a government press release.

**Acceptance Criteria:**

- **Given** Layla clicks "✨ ساعدني في الكتابة" on her portfolio bio field, **When** the AI generation panel opens, **Then** she sees 4 tone options presented as visual chips: "احترافي" (Professional), "ودّي" (Friendly), "إبداعي" (Creative), "بسيط" (Simple) — the last selected tone is remembered for the session.
- **Given** Layla selects "إبداعي" (Creative) and clicks "اكتب", **When** the content is generated, **Then** the text uses metaphorical language, shorter punchy sentences, and avoids corporate filler phrases like "نسعى لتحقيق التميز".
- **Given** Layla previously selected "Friendly" tone and navigates to a different section, **When** she opens a new field's "Help Me Write" panel, **Then** the "Friendly" tone chip is pre-selected — she does not need to re-select it every time.
- **Given** Layla's site language is Arabic, **When** she selects a tone, **Then** the generated content is in Arabic, uses the selected tone in an Arabic-natural way (not a direct translation of English tone descriptors), and is grammatically correct.
- **Given** Layla wants both Arabic and English content for the same field, **When** the site is bilingual and she generates content in one language, **Then** a secondary "Translate to English" button appears below the generated text — clicking it populates the English counterpart field.

**Edge Cases:**
- If Layla closes the tone selection panel without generating, the field content is unchanged.
- If the "Translate to English" button is clicked and the English field already has user-entered content, a confirmation appears: "هذا سيستبدل النص الإنجليزي الحالي — هل تريد الاستمرار؟"

**Out of Scope:**
- This story does not cover saving custom tone presets or creating a brand voice profile (v2).

```
Priority: Could Have
Story Points: 3
Dependencies: US-10
Assigned Role: Both
```

---

---

## EP-06: Opening Hours Component

> A structured day/time picker that lets business owners set their opening hours using a visual schedule — no free text fields, no risk of formatting errors, bilingual output automatically.

---

### US-12 — Set Business Opening Hours Using a Day/Time Picker

```
Story ID: US-12
Epic: EP-06 — Opening Hours Component
Title: Configure business opening hours with a structured visual picker
```

As **Ahmad**, whose restaurant has different hours on weekdays vs. weekends, and is closed on Fridays,
I want to set my opening hours by clicking on days and choosing times from a picker,
So that my hours display correctly on my site without me having to type them in a specific format.

**Acceptance Criteria:**

- **Given** Ahmad opens the "Opening Hours" section in his editor, **When** the component loads, **Then** all 7 days of the week are displayed as rows in Arabic, ordered Sunday through Saturday (Islamic week order), each with: a toggle for Open/Closed, and two time pickers (Open time, Close time).
- **Given** Ahmad taps the toggle on "الجمعة" (Friday) to mark it as Closed, **When** the toggle is off, **Then** the two time pickers for that row gray out and become non-interactive — no error can occur from an inconsistent state.
- **Given** Ahmad sets Monday hours as 12:00 PM to 11:00 PM, **When** he wants to apply the same hours to Tuesday through Thursday, **Then** a "تطبيق على باقي الأيام" (Apply to Other Days) link appears, and clicking it opens a checkbox list of remaining days to apply the same hours to in bulk.
- **Given** Ahmad has set all his hours, **When** he saves and views his live site, **Then** the opening hours are displayed in Arabic with the correct formatting, e.g.: "السبت – الخميس: 12:00 م – 11:00 م | الجمعة: مغلق".
- **Given** Ahmad's site is bilingual, **When** the opening hours are saved, **Then** the English version of the opening hours section automatically shows: "Sat – Thu: 12:00 PM – 11:00 PM | Fri: Closed" — he does not need to enter the hours twice.
- **Given** Ahmad enters an end time earlier than the start time (e.g., Open: 10:00 PM, Close: 8:00 PM), **When** he tries to save, **Then** an inline warning appears on that row: "وقت الإغلاق يجب أن يكون بعد وقت الفتح — أو فعّل خيار 'يعمل بعد منتصف الليل'" with a "Works past midnight" toggle option.

**Edge Cases:**
- If a restaurant operates past midnight (e.g., Open: 6 PM, Close: 2 AM), the "Works past midnight" toggle resolves the time conflict and displays the hours correctly on the live site.
- If Ahmad saves with no days marked as "Open", a warning appears: "لم تُحدد أي أيام عمل — هل تريد إخفاء قسم مواعيد العمل مؤقتاً؟"

**Out of Scope:**
- This story does not cover holiday/exception scheduling (e.g., Ramadan hours).
- This story does not cover real-time "Open Now / Closed Now" indicators based on visitor's clock (v2).

```
Priority: Must Have
Story Points: 5
Dependencies: None
Assigned Role: Both
```

---

### US-13 — Display Opening Hours with "Open Now" Status

```
Story ID: US-13
Epic: EP-06 — Opening Hours Component
Title: Show real-time Open/Closed status on the published site
```

As a visitor to Ahmad's restaurant website,
I want to see immediately whether the restaurant is open right now,
So that I know if I can visit today without having to read the full hours table.

**Acceptance Criteria:**

- **Given** a visitor arrives at Ahmad's site and the current time falls within the configured opening hours for today, **When** the Opening Hours section renders, **Then** a green "مفتوح الآن" (Open Now) badge is prominently displayed, along with "يغلق الساعة 11:00 م" (Closes at 11:00 PM).
- **Given** a visitor arrives at Ahmad's site and the current time is outside the configured opening hours, **When** the Opening Hours section renders, **Then** a red "مغلق الآن" (Closed Now) badge is displayed along with "يفتح غداً الساعة 12:00 م" (Opens tomorrow at 12:00 PM) — the next opening time is calculated automatically.
- **Given** the visitor's browser timezone is set to a timezone other than Riyadh/Jeddah (Asia/Riyadh), **When** the Open/Closed status is computed, **Then** the calculation uses the business's configured timezone (set during site setup), not the visitor's timezone.
- **Given** Ahmad's site is viewed on Friday (a closed day), **When** the Open/Closed status renders, **Then** it shows "مغلق — يفتح السبت الساعة 12:00 م" — the next open day and time is shown, not just "Closed".
- **Given** Ahmad has not yet configured his opening hours, **When** the Opening Hours section is added to his site, **Then** the "Open Now" status badge is hidden, and only the generic hours table placeholder is shown.

**Edge Cases:**
- If the system clock drifts or the server has a timezone misconfiguration, the Open/Closed calculation must be validated against the server's UTC time converted to the business's configured timezone — never the client's local time alone.

**Out of Scope:**
- This story does not cover holiday-based override of the Open/Closed status.
- This story does not cover the admin seeing this status in the dashboard editor (only visible on the published site).

```
Priority: Could Have
Story Points: 3
Dependencies: US-12
Assigned Role: Both
```

---

---

## EP-07: "What's Missing" Completeness Meter

> A dashboard-level progress indicator that scans the user's site configuration and presents specific, actionable completion tasks in plain language — replacing the confusion of an empty editor with a clear to-do list.

---

### US-14 — View Site Completeness Score on Dashboard

```
Story ID: US-14
Epic: EP-07 — "What's Missing" Completeness Meter
Title: See a site completeness score with specific missing items listed
```

As **Sara**, who built her clinic site with the wizard but isn't sure if it's complete,
I want to see a clearly visible completeness score on my dashboard,
So that I know exactly what's missing before I share the site with patients.

**Acceptance Criteria:**

- **Given** Sara logs into her dashboard, **When** the dashboard home loads, **Then** a "اكتمال موقعك" (Your Site Completeness) section is visible in the top portion of the page showing a percentage score (e.g., 65%) and a circular or horizontal progress bar.
- **Given** the completeness meter calculates the score, **When** it renders, **Then** below the percentage is a list of specific missing items in plain Arabic, e.g.: "أضف شعار العيادة", "اكتب نبذة 'من نحن'", "أضف رقم واتساب", "أضف صورة للعيادة" — not generic categories like "Media Assets Incomplete."
- **Given** Sara clicks any item in the missing items list, **When** the click is registered, **Then** she is taken directly to the relevant editor section with that specific field highlighted (scroll + highlight animation) — she does not navigate manually.
- **Given** Sara completes a missing item (e.g., uploads her logo), **When** she returns to the dashboard, **Then** the completeness score updates and the completed item is visually checked off (green checkmark) or removed from the list.
- **Given** Sara's site completeness reaches 100%, **When** the final item is saved, **Then** a celebratory animation plays on the completeness meter and a CTA button appears: "موقعك جاهز — انشره الآن!" (Your site is ready — publish it now!).
- **Given** the completeness score is below 40%, **When** Sara views the dashboard, **Then** the "Publish" button is still available but shows a soft warning: "موقعك غير مكتمل — هل أنت متأكد من النشر؟" — she is not blocked from publishing.

**Edge Cases:**
- If Sara has a site with no content sections added at all (blank site), the completeness score shows 10% (account created) and the entire missing list is shown with the top 5 items as the starting priority.
- If the completeness calculation encounters a database error, the progress bar shows a neutral empty state: "يتعذر تحميل نتائج الاكتمال — حاول لاحقاً" — no incorrect score is displayed.

**Out of Scope:**
- This story does not cover completeness metrics for SEO optimization (v2 feature).
- This story does not cover completeness comparison across multiple sites.

```
Priority: Should Have
Story Points: 5
Dependencies: None
Assigned Role: Both
```

---

### US-15 — Receive Actionable Completeness Suggestions by Priority

```
Story ID: US-15
Epic: EP-07 — "What's Missing" Completeness Meter
Title: View missing items ranked by impact and receive one-click navigation to fix them
```

As **Ahmad**, who has limited time and wants to focus on what matters most first,
I want the completeness meter to tell me which missing items are most important to fix,
So that I spend my 10 minutes on the things that will make the biggest difference to my customers.

**Acceptance Criteria:**

- **Given** the completeness meter generates missing items, **When** the list is displayed, **Then** items are ranked by a Priority label: "مهم جداً" (Critical), "مهم" (Important), "اختياري" (Optional) — each displayed with a distinct color (red, orange, gray).
- **Given** Ahmad views the missing items, **When** "أضف رقم واتساب" is listed as Critical (مهم جداً), **Then** a short explanation is shown below it: "معظم زوار موقعك سيتواصلون عبر واتساب — هذا هو أهم شيء تضيفه الآن."
- **Given** Ahmad completes all Critical items, **When** he returns to the dashboard, **Then** the Critical section disappears and the Important items are now at the top — the list adapts dynamically.
- **Given** Ahmad has completed 5 of 8 items, **When** he views the dashboard, **Then** a motivational label appears: "أنت على بُعد 3 خطوات من موقع مكتمل!" (You are 3 steps away from a complete site!) — the framing is encouraging, not punishing.
- **Given** the site is published with missing items remaining, **When** Ahmad views the dashboard, **Then** the missing items list adds a flag to each: "غير مرئي للزوار" (Invisible to visitors) or "مرئي للزوار" so he understands the live impact of each gap.

**Edge Cases:**
- If all optional items are also completed and there are no missing items, the completeness section on the dashboard shows a "موقعك مكتمل بالكامل 🎉" state with a link to the analytics page.

**Out of Scope:**
- This story does not cover emailing Ahmad when his completeness score has been below 60% for more than 7 days (email nudge is a separate notification story).

```
Priority: Should Have
Story Points: 3
Dependencies: US-14
Assigned Role: Both
```

---

---

## EP-08: Template Switching Without Data Loss

> The ability to change the entire visual design of a site (template, layout, color scheme) while keeping all of the user's actual content — text, images, opening hours, team members — intact.

---

### US-16 — Switch Template While Preserving All Content

```
Story ID: US-16
Epic: EP-08 — Template Switching Without Data Loss
Title: Change site visual template without losing any existing content
```

As **Layla**, who chose a dark portfolio template but now wants to try a lighter, more minimal one,
I want to switch my site's template without losing my portfolio items, bio, or contact details,
So that I can experiment with different looks without starting over.

**Acceptance Criteria:**

- **Given** Layla is in the site editor and navigates to "تغيير القالب" (Change Template), **When** the template gallery opens, **Then** her current template is marked with a "الحالي" (Current) badge and all compatible templates are shown as live previews populated with her actual content — not dummy text.
- **Given** Layla hovers (desktop) or long-presses (mobile) on a new template, **When** the preview interaction is triggered, **Then** a full-screen preview shows her site with the new template applied — including her real portfolio images and bio.
- **Given** Layla clicks "تطبيق هذا القالب" (Apply This Template) on a new selection, **When** she confirms the switch in a confirmation dialog, **Then** the site's template changes within 5 seconds, all her existing content (text, images, section order) is preserved, and only the visual styling changes (fonts, colors, layout).
- **Given** the new template has a section that the old template did not (e.g., a "Client Logos" section), **When** the switch completes, **Then** the new section is added at the bottom of the page with a placeholder state and a prompt to fill it in — it does not appear empty and broken.
- **Given** Layla switches templates and immediately regrets it, **When** she clicks "تراجع" (Undo) within 60 seconds of switching, **Then** her previous template is fully restored, including all styling — a full rollback occurs, not just a navigation back.
- **Given** Layla switches to a template that supports fewer color accent options than her current one, **When** the switch completes, **Then** the closest matching color from the new template's palette is applied — no error is thrown and the site does not render with missing styles.

**Edge Cases:**
- If Layla's current template has a custom section type that the new template does not support, a warning appears before confirmation: "هذا القالب لا يدعم قسم 'معرض الأعمال' — ستبقى بياناتك محفوظة لكن لن تظهر حتى تختار قالباً مدعوماً." The switch can still proceed.
- If the template switch fails mid-application (server error), the site is rolled back to the last confirmed state and an error message is shown: "حدث خطأ أثناء تغيير القالب — تم الاحتفاظ بقالبك السابق."

**Out of Scope:**
- This story does not cover migrating custom CSS overrides between templates.
- This story does not cover template switching across different industries (e.g., from a Restaurant template to a Law Firm template) without a warning.

```
Priority: Should Have
Story Points: 8
Dependencies: None
Assigned Role: Both
```

---

### US-17 — Preview Template Before Applying

```
Story ID: US-17
Epic: EP-08 — Template Switching Without Data Loss
Title: Fully preview a new template with real content before committing to the switch
```

As **Sara**, a clinic manager who needs to approve how her site looks before making any changes visible to patients,
I want to preview any template with my actual clinic content before applying it,
So that I know exactly what my site will look like before committing to the change.

**Acceptance Criteria:**

- **Given** Sara is in the template gallery, **When** she clicks "معاينة" (Preview) on any template card, **Then** a new browser tab (or full-screen overlay) opens showing her clinic's complete site rendered in the new template — her real content, her logo, her staff photos, her Arabic text.
- **Given** the template preview is open, **When** Sara resizes the preview window or uses a responsive toggle, **Then** she can see the template on three device sizes: desktop, tablet, and mobile — represented by device frame icons at the top of the preview.
- **Given** Sara is previewing a template, **When** she clicks "تطبيق" (Apply) from within the preview, **Then** the confirmation dialog appears and she can proceed to switch without returning to the gallery first.
- **Given** Sara is previewing Template A and wants to preview Template B, **When** she clicks the ">" next arrow in the preview, **Then** the preview updates to the next template in the gallery order — she can browse templates in preview mode without returning to the gallery.
- **Given** Sara's site has 6 sections, **When** the template preview renders, **Then** all 6 sections are shown, not just the hero — the preview is a full page scroll.

**Edge Cases:**
- If a template preview fails to render (missing component, server error), the preview shows a fallback message: "لا يمكن معاينة هذا القالب الآن — حاول لاحقاً" and the Apply button is disabled for that template only.

**Out of Scope:**
- This story does not cover sharing a template preview link with a third party (e.g., to get client approval).

```
Priority: Should Have
Story Points: 3
Dependencies: US-16
Assigned Role: FE
```

---

---

## EP-09: Duplicate & Translate

> A one-click feature to automatically translate all site content from Arabic to English or vice versa using AI, populating the bilingual counterpart fields without requiring the user to manually re-enter content.

---

### US-18 — Translate All Arabic Content to English with One Click

```
Story ID: US-18
Epic: EP-09 — Duplicate & Translate
Title: Translate all site content from Arabic to English automatically
```

As **Layla**, who built her portfolio in Arabic but wants an English version for international clients,
I want to click one button and have all my Arabic content translated to English automatically,
So that my bilingual site is complete without me having to manually translate every field.

**Acceptance Criteria:**

- **Given** Layla has completed her Arabic site content and navigates to "Site Settings > Language", **When** she clicks "ترجم إلى الإنجليزية" (Translate to English), **Then** a confirmation dialog appears: "سيتم ترجمة جميع النصوص من العربية إلى الإنجليزية. يمكنك مراجعتها بعد الترجمة." with "ابدأ الترجمة" (Start Translation) and "إلغاء" (Cancel).
- **Given** Layla confirms the translation, **When** the process runs, **Then** a visible progress indicator shows "جاري ترجمة [section name]..." — each section's completion is shown, and the total estimated time is displayed upfront ("تقدير: 30 ثانية").
- **Given** the translation completes, **When** Layla views the English version of her site in the editor, **Then** every text field that had Arabic content now has its English equivalent — no field is left empty or in Arabic.
- **Given** Layla reviews the translated English content and finds a phrase she wants to change, **When** she edits the English field manually, **Then** her manual edit is preserved and is not overwritten if she triggers another Arabic-to-English translation (only empty English fields are overwritten, not manually edited ones).
- **Given** the translation produces English text, **When** Layla previews the English version of her site, **Then** all text is LTR, fonts are English-appropriate, and the layout automatically adjusts for LTR reading direction.

**Edge Cases:**
- If the AI translation API is unavailable, the process fails gracefully: "تعذّرت الترجمة الآن — لم يتم تغيير أي محتوى. حاول لاحقاً." No partial state is saved — either the full translation commits or nothing changes.
- If a field contains a mix of Arabic and English (bilingual field already), the translator skips it and marks it "تمت مراجعتها بالفعل" (Already reviewed).
- If the site has more than 5,000 words to translate, the system shows: "الترجمة ستستغرق دقيقة أو أكثر — سيتم إشعارك عند الانتهاء" and runs it as a background job.

**Out of Scope:**
- This story does not cover human professional translation review workflows.
- This story does not cover translating image alt text (v2).

```
Priority: Should Have
Story Points: 8
Dependencies: None
Assigned Role: Both
```

---

### US-19 — Review and Edit Translated Content Before Publishing

```
Story ID: US-19
Epic: EP-09 — Duplicate & Translate
Title: Review AI-translated content field by field before the translation goes live
```

As **Sara**, who is professionally cautious and does not want incorrect medical terminology to appear on her clinic site,
I want to review each translated field before the English version of my site goes live,
So that I can catch any translation errors that could affect my clinic's credibility.

**Acceptance Criteria:**

- **Given** Sara has run the Translate to English process, **When** the translation completes, **Then** the platform enters a "Translation Review Mode" where Sara is shown a side-by-side comparison: Arabic (original) on the right, English (translated) on the left, one section at a time.
- **Given** Sara is in Translation Review Mode, **When** she views each field, **Then** she can either click "موافق" (Approve) to accept the translation or directly edit the English text inline — approved fields get a green checkmark, edited fields get a blue "تم التعديل" (Edited) badge.
- **Given** Sara approves or edits all fields, **When** she clicks "تأكيد الترجمة" (Confirm Translation), **Then** the English versions are saved to the site, the site becomes bilingual, and Translation Review Mode exits.
- **Given** Sara is in Translation Review Mode and navigates away (closes browser), **When** she returns to the dashboard, **Then** a banner shows: "لديك مراجعة ترجمة غير مكتملة — 12 حقلاً بانتظار مراجعتك" with a link to resume where she left off.
- **Given** Sara reviews a translated medical term that is incorrect (e.g., "Dermatology" was translated as "Skincare"), **When** she manually corrects it in the English field, **Then** her correction is flagged as "Manual Override" and a future re-translation will skip this field rather than overwriting her correction.

**Edge Cases:**
- If Sara rejects all translations and clicks "إلغاء الترجمة كلها" (Cancel All), the English fields return to their pre-translation state (empty or whatever they were before), and no changes are saved.

**Out of Scope:**
- This story does not cover machine translation confidence scores being displayed to the user.

```
Priority: Could Have
Story Points: 5
Dependencies: US-18
Assigned Role: FE
```

---

---

## EP-10: "Launch Your Site" Celebration Screen

> A first-publish moment screen that celebrates the user's achievement of publishing their site, provides the live site URL, and gives them easy tools to share it — making the emotional peak of the journey feel rewarding.

---

### US-20 — Experience a Celebration Screen on First Publish

```
Story ID: US-20
Epic: EP-10 — "Launch Your Site" Celebration Screen
Title: See a celebratory "Your site is live!" screen on first publish
```

As **Layla**, who has never had a website before and is excited about publishing her portfolio,
I want the moment I publish my site to feel special and celebratory,
So that I feel proud of the achievement and am motivated to share it immediately.

**Acceptance Criteria:**

- **Given** Layla clicks "انشر موقعي" (Publish My Site) for the very first time, **When** the site goes live successfully, **Then** a full-screen celebration overlay appears with a confetti animation, her site name prominently displayed, and the headline: "موقعك أصبح حياً! 🎉" (Your site is live!).
- **Given** the celebration screen is shown, **When** Layla reads the screen content, **Then** she sees: her live URL (e.g., layla-designs.safahati.com) as a large clickable link, a "افتح موقعي" (Open My Site) primary button, and a row of sharing options below.
- **Given** the celebration screen shows sharing options, **When** Layla views them, **Then** the sharing options are: WhatsApp share (first and largest), Instagram story link copy, Twitter/X share, and a "نسخ الرابط" (Copy Link) button — email sharing is not the primary option.
- **Given** Layla clicks "شارك على واتساب", **When** the WhatsApp share is triggered, **Then** her phone's WhatsApp opens (or WhatsApp Web on desktop) with a pre-filled message in Arabic: "أطلقت موقعي الجديد! تفضل/تفضلي بزيارته: layla-designs.safahati.com" — she can send it directly to her contacts.
- **Given** Layla closes the celebration screen by clicking "X" or "لاحقاً" (Later), **When** she returns to the dashboard, **Then** the celebration screen does not reappear — it is a once-per-site experience, not shown on subsequent publishes.
- **Given** Layla's site goes live, **When** the celebration screen is dismissed, **Then** the dashboard now shows the live URL in the header and a green "مباشر" (Live) badge next to her site name.

**Edge Cases:**
- If the publish process fails (e.g., subdomain conflict, server error), the celebration screen does not appear — instead, a specific error message is shown: "لم نتمكن من نشر موقعك — [سبب المشكلة] — جرّب مرة أخرى."
- If the celebration screen fails to render (JS error), the site is still published and the user is redirected to the dashboard with a simple success toast: "تم نشر موقعك بنجاح ✓".

**Out of Scope:**
- This story does not cover custom domain activation celebration (separate flow).
- This story does not cover re-publish celebrations (only the first publish triggers this screen).

```
Priority: Should Have
Story Points: 3
Dependencies: None
Assigned Role: FE
```

---

### US-21 — Share Live Site Directly from Dashboard After Publish

```
Story ID: US-21
Epic: EP-10 — "Launch Your Site" Celebration Screen
Title: Access sharing tools from the dashboard at any time after first publish
```

As **Ahmad**, who wants to share his restaurant site with his customers on WhatsApp groups after publishing,
I want a persistent, easy-to-find "Share My Site" section on my dashboard,
So that I can share my site link whenever I want — not just in the first-publish moment.

**Acceptance Criteria:**

- **Given** Ahmad's site is published and he is on the dashboard, **When** he views the site header card, **Then** it permanently shows his site URL, a "شارك" (Share) button, and a "نسخ الرابط" (Copy Link) icon.
- **Given** Ahmad clicks the "شارك" (Share) button on the dashboard, **When** the share panel opens, **Then** it shows: WhatsApp (primary CTA), Instagram story link, and "نسخ الرابط" — the same options as the celebration screen.
- **Given** Ahmad clicks "نسخ الرابط", **When** the copy action succeeds, **Then** a tooltip appears for 2 seconds: "تم نسخ الرابط ✓" — Ahmad knows the copy succeeded without any doubt.
- **Given** Ahmad is using his phone (PWA), **When** he clicks the "شارك" button, **Then** the native mobile share sheet opens (using the Web Share API) allowing him to send to any app installed on his phone.
- **Given** Ahmad's site is not yet published (draft state), **When** he views the dashboard, **Then** the "شارك" button is not shown — instead, a "انشر لتتمكن من المشاركة" (Publish to share) prompt replaces it.

**Edge Cases:**
- If the Web Share API is not available (older browser), the native share sheet does not open and the fallback shows the same WhatsApp/Instagram/Copy options as the panel — no broken state.

**Out of Scope:**
- This story does not cover embedding the site via iframe share (v2).
- This story does not cover QR code generation for the site URL (v2).

```
Priority: Should Have
Story Points: 2
Dependencies: US-20
Assigned Role: FE
```

---

---

## EP-11: Live Preview in Editor

> A split-screen real-time preview that updates as the user edits, showing exactly what the published site will look like without requiring a separate preview tab or a publish action.

---

### US-22 — See Real-Time Site Preview While Editing

```
Story ID: US-22
Epic: EP-11 — Live Preview in Editor
Title: View the live site preview updating in real time as changes are made
```

As **Layla**, a designer who needs to see exactly how her site looks as she builds it,
I want a live preview that updates as I type or change settings,
So that I never have to guess how a change will look and I don't have to click "Preview" constantly.

**Acceptance Criteria:**

- **Given** Layla is in the site editor on a desktop (screen width ≥ 1280px), **When** the editor loads, **Then** the layout shows the editing panel on the left (or right for RTL) occupying 40% of the screen, and a live site preview occupying 60% of the screen.
- **Given** Layla types in any text field in the editor panel, **When** she pauses for 300ms after typing, **Then** the live preview updates to show her change without a full page reload — the change appears in place.
- **Given** Layla uploads a new image in the editor panel, **When** the upload completes, **Then** the live preview immediately shows the new image in the correct section — the preview is not stale.
- **Given** Layla changes a color (e.g., the accent color of the hero section), **When** the color picker value changes, **Then** the preview updates in real time as she drags the color picker — she sees the color changing live, not just after confirming.
- **Given** Layla is editing a hero section, **When** she changes the layout from "centered text" to "text left, image right", **Then** the preview updates the layout immediately and the editing panel remains in its current scroll position — the panel does not jump to the top.
- **Given** Layla wants to see only the preview (full-screen), **When** she clicks the "expand preview" icon, **Then** the editor panel collapses and the preview takes the full width, with a "Edit" button to return to split-screen mode.

**Edge Cases:**
- If the live preview fails to render an update (e.g., a component error from invalid data), the preview shows the last valid state and a small error indicator appears: "لا يمكن عرض التغيير — تحقق من البيانات المُدخلة." The editing panel remains functional.
- On screens smaller than 1280px (laptop or tablet), the split-screen layout is not shown. Instead, the editor shows a "Preview" button that opens a full-screen modal preview — the user manually toggles between edit and preview modes.

**Out of Scope:**
- This story does not cover real-time collaboration (two users editing at the same time and seeing each other's changes).
- This story does not cover live preview of the Arabic vs. English version simultaneously.

```
Priority: Should Have
Story Points: 8
Dependencies: None
Assigned Role: FE
```

---

### US-23 — Preview Site on Different Device Sizes in Editor

```
Story ID: US-23
Epic: EP-11 — Live Preview in Editor
Title: Switch the live preview between mobile, tablet, and desktop views
```

As **Sara**, whose clinic patients mostly use phones to visit her website,
I want to preview how my site looks on a phone without leaving the editor,
So that I can make sure everything looks good on mobile before publishing.

**Acceptance Criteria:**

- **Given** Sara is in the editor with the live preview panel visible, **When** she sees the device toggle bar above the preview, **Then** three icons are shown: Desktop (default), Tablet, and Mobile — each with a recognizable icon and a label in Arabic.
- **Given** Sara clicks the Mobile icon, **When** the preview switches, **Then** the preview reframes to a 390px wide phone-sized frame with a device bezel graphic, and all responsive styles render correctly — text doesn't overflow, buttons are tap-sized.
- **Given** Sara is previewing her site in mobile mode, **When** she makes an edit in the editing panel, **Then** the mobile preview updates in real time, just as the desktop preview does.
- **Given** Sara switches from Desktop to Mobile preview, **When** she views the hero section, **Then** if the mobile layout stacks the image below the text (vs. side-by-side on desktop), the mobile preview correctly shows the stacked layout — the preview is a true responsive simulation, not just a scaled-down version.
- **Given** Sara is on the live preview in Mobile mode and clicks within the preview pane on an interactive element (e.g., the WhatsApp button), **When** the click happens, **Then** nothing navigates or changes in the actual site config — the preview is read-only for interaction.

**Edge Cases:**
- If Sara is using a 13" laptop screen and has the split-screen layout visible, switching to Tablet preview may cause the preview panel to be too narrow to accurately simulate a tablet. In this case, a tooltip shows: "لعرض أفضل على الحاسب، استخدم وضع الشاشة الكاملة للمعاينة."

**Out of Scope:**
- This story does not cover previewing in specific named device models (iPhone 15 Pro Max, Galaxy S24, etc.).

```
Priority: Could Have
Story Points: 3
Dependencies: US-22
Assigned Role: FE
```

---

---

## EP-12: Auto-Save + Undo

> A 30-second auto-save that continuously saves the user's work with a visible indicator, combined with a one-step undo for the last change — protecting non-technical users from the anxiety of losing work.

---

### US-24 — Auto-Save Editor Changes Every 30 Seconds

```
Story ID: US-24
Epic: EP-12 — Auto-Save + Undo
Title: Have editor changes automatically saved without needing to click Save
```

As **Ahmad**, who sometimes leaves his phone mid-edit to attend to customers and comes back later,
I want my changes to be saved automatically without me having to remember to click a save button,
So that I never lose work because I forgot to save or my phone screen turned off.

**Acceptance Criteria:**

- **Given** Ahmad makes any change in the editor (text, image, toggle), **When** 30 seconds pass since his last change, **Then** the change is automatically saved to the database and a small "تم الحفظ تلقائياً" (Auto-saved) indicator appears in the editor header for 3 seconds then fades.
- **Given** Ahmad makes a change and immediately navigates away from the editor (clicks a different section), **When** navigation is triggered, **Then** the pending change is saved immediately (not waiting for the 30-second timer) before the navigation completes.
- **Given** Ahmad is editing and the auto-save occurs, **When** the save is in progress, **Then** the save indicator shows "جاري الحفظ..." (Saving...) with a spinning icon — he has clear feedback that a save is happening.
- **Given** an auto-save attempt fails (network error), **When** the failure occurs, **Then** the indicator changes to "تعذّر الحفظ — ستتم المحاولة مرة أخرى" in amber/yellow, and the next auto-save attempt is made after 60 seconds — Ahmad is not blocked from continuing to edit.
- **Given** Ahmad has unsaved changes and closes the browser tab, **When** the browser close/unload event fires, **Then** the browser shows its native "Are you sure you want to leave?" dialog IF there are changes that have not yet been auto-saved (i.e., the 30-second timer has not yet fired).
- **Given** the auto-save is enabled, **When** Ahmad navigates to a different section of the editor without clicking Save, **Then** his changes are included in the auto-save and are present when he returns to that section — no change is ever lost silently.

**Edge Cases:**
- If Ahmad's session expires mid-edit (JWT token expiry), the auto-save detects a 401 response and stores the unsaved changes in localStorage. On next login, the system shows: "لديك تغييرات غير محفوظة من جلستك السابقة — هل تريد استعادتها؟"
- If Ahmad edits the same field rapidly (typing), the auto-save debounces and only saves the final value after the 30-second idle window — it does not save every keystroke.

**Out of Scope:**
- This story does not cover version history or the ability to revert to any past saved state (v2).
- This story does not cover offline queue auto-save (edit while offline, sync on reconnect — v2).

```
Priority: Must Have
Story Points: 5
Dependencies: None
Assigned Role: Both
```

---

### US-25 — Undo Last Change in the Editor

```
Story ID: US-25
Epic: EP-12 — Auto-Save + Undo
Title: Undo the last edit with a visible, accessible undo button
```

As **Sara**, who sometimes types in the wrong field and accidentally overwrites her clinic description,
I want to undo my last change with one click,
So that I can quickly recover from mistakes without having to reload the page or remember what I typed.

**Acceptance Criteria:**

- **Given** Sara makes any change in the editor (edits text, changes image, toggles a setting), **When** the change is registered, **Then** an "↩ تراجع" (Undo) button becomes visible in the editor toolbar — it is grayed out when there is nothing to undo.
- **Given** Sara clicks "Undo", **When** the undo is applied, **Then** the last change is reversed (previous text restored, previous image shown, previous toggle state returned), the "Undo" button grays out again if no further undo history exists, and a "↪ إعادة" (Redo) button appears.
- **Given** Sara's last change was replacing her clinic description (200 words) with a single accidental keystroke, **When** she clicks Undo, **Then** the full previous 200-word description is restored — undo captures the full field value before the change, not character-by-character.
- **Given** Sara makes 3 sequential changes (A → B → C), **When** she clicks Undo once, **Then** C is reversed to B. When she clicks Undo again, **Then** B is reversed to A — undo history supports at least 5 levels.
- **Given** Sara uses the keyboard shortcut Cmd+Z (Mac) or Ctrl+Z (Windows/Android), **When** the shortcut is detected while the editor is focused, **Then** undo triggers — the keyboard shortcut works as expected from web conventions.
- **Given** an auto-save occurs, **When** Sara clicks Undo after the auto-save, **Then** the undo still works and the undone state is immediately re-saved — undo does not get blocked by the auto-save state.

**Edge Cases:**
- If Sara accidentally clicks Undo too many times and goes back further than intended, the Redo button allows her to move forward again — she is not stranded in a past state.
- The Undo feature only covers changes made in the current editor session. Closing the editor and reopening clears the undo history (as the auto-save has persisted the most recent state).

**Out of Scope:**
- This story does not cover undoing a "Publish" action (unpublishing is a separate feature).
- This story does not cover undo across multiple editing sessions (full version history — v2).

```
Priority: Must Have
Story Points: 5
Dependencies: US-24
Assigned Role: FE
```

---

---

## EP-13: Plain Language Admin

> Renaming all technical jargon in the admin interface to plain, user-friendly language that non-technical Saudi/MENA users immediately understand — eliminating terms like "component", "template", "config", "slug", "deploy", "cache", and "metadata."

---

### US-26 — All Admin UI Uses Plain Arabic Language (No Technical Jargon)

```
Story ID: US-26
Epic: EP-13 — Plain Language Admin
Title: Experience an admin dashboard with zero technical jargon in all labels and messages
```

As **Ahmad**, a 45-year-old restaurant owner who uses WhatsApp but has never used a CMS or website builder,
I want every button, label, and message in the dashboard to be in plain Arabic that I understand,
So that I never feel confused or intimidated by technical terms I don't recognize.

**Acceptance Criteria:**

- **Given** Ahmad is on the dashboard, **When** he reads any navigation label, button, section title, or tooltip, **Then** no English technical terms or untranslated jargon appears (no "Component", "Template", "Config", "Slug", "Cache", "Deploy", "Metadata", "Schema", "Block", "Payload", "Endpoint" in the UI).
- **Given** the platform uses the term "Template" internally, **When** it appears in the user-facing UI, **Then** it is displayed as "تصميم الموقع" (Site Design) or "قالب" (where قالب is widely understood in the Arabic vernacular for website templates).
- **Given** the platform has a "Slug" field for the site's subdomain, **When** Ahmad sees this field, **Then** it is labeled "رابط موقعك" (Your site link) with an example: "مثال: مطعم-أحمد.safahati.com" — the word "slug" never appears.
- **Given** the platform generates an error message, **When** the error is displayed to Ahmad, **Then** the message is in plain Arabic that explains what happened and what he should do, not a technical string like "500 Internal Server Error" or "ECONNREFUSED".
- **Given** a success confirmation is shown after saving, **When** Ahmad reads it, **Then** it says "تم الحفظ بنجاح ✓" or a contextual equivalent like "تم تحديث مواعيد العمل" — not "Record updated" or "PUT 200 OK".
- **Given** Ahmad is managing a section of his site, **When** he sees the reorder controls, **Then** they are labeled "حرّك للأعلى" / "حرّك للأسفل" (Move up / Move down), not "Change order index" or "Reorder item".

**Edge Cases:**
- If a third-party integration (e.g., Stripe payment widget) surfaces technical text in Arabic that Safahati cannot control, the Safahati wrapper UI around it must still use plain language for all surrounding labels, buttons, and instructions.
- If a new feature is released and its UI contains a technical term discovered after launch (via user feedback), the fix must be deployed within 5 business days — this is treated as a UI bug, not a feature request.

**Out of Scope:**
- This story does not cover error messages from the browser itself (e.g., browser's native "This site is not secure" warning).
- This story does not cover the Safahati internal admin panel used by the Safahati team (only the user-facing dashboard).

```
Priority: Must Have
Story Points: 3
Dependencies: None
Assigned Role: FE
```

---

### US-27 — Contextual Tooltips and Inline Help for Every Setting

```
Story ID: US-27
Epic: EP-13 — Plain Language Admin
Title: Access plain-language help tooltips on every setting in the admin
```

As **Sara**, who is professional and detail-oriented but not a web developer,
I want to see a short plain-language explanation when I hover over or tap any setting I don't understand,
So that I can confidently use every feature without Googling or asking for help.

**Acceptance Criteria:**

- **Given** Sara sees any setting with a "?" icon next to it, **When** she hovers over (desktop) or taps (mobile) the "?" icon, **Then** a tooltip appears within 200ms with a plain-language explanation of what the setting does, written at a grade-8 reading level in Arabic.
- **Given** Sara is viewing the SEO settings section (which contains unfamiliar concepts), **When** she opens the section, **Then** a non-dismissable explanatory banner at the top reads: "هذا القسم يساعد موقعك على الظهور في نتائج جوجل — لا يجب أن تكون خبيراً لملئه، فقط اتبع التعليمات." (This section helps your site appear in Google results — you don't need to be an expert, just follow the instructions.)
- **Given** there is a setting for "noindex / nofollow", **When** it appears in the admin, **Then** it is not visible at all — it is either handled automatically by the platform or exposed only under an "Advanced Settings" section that requires deliberate navigation and shows a warning: "هذه إعدادات متقدمة — لا تغيّرها إلا إذا كنت متأكداً."
- **Given** Sara is filling in the site's "meta description" field, **When** she focuses on it, **Then** a help tip appears: "هذا النص يظهر تحت اسم موقعك في نتائج جوجل. اجعله وصفاً مختصراً لعيادتك في جملة أو جملتين." — it tells her what to write, not just what the field is.
- **Given** every required field in the editor has a label, **When** the label is rendered, **Then** required fields are marked with a red asterisk (*) AND the Arabic label "(مطلوب)" — dual indicator for accessibility.

**Edge Cases:**
- If a tooltip text is longer than 200 characters, it renders as a small popover card (not a single-line tooltip) that can be scrolled on mobile.
- If Sara is using a screen reader, all tooltips are accessible via ARIA attributes and appear as aria-describedby content on the associated input element.

**Out of Scope:**
- This story does not cover a dedicated in-app help center or documentation wiki (v2 feature).
- This story does not cover guided tours or step-by-step onboarding overlays (separate onboarding story).

```
Priority: Must Have
Story Points: 3
Dependencies: None
Assigned Role: FE
```

---

---

## EP-14: "Done for You" Upgrade Path

> An in-app upsell flow that allows users who are stuck or too busy to build their site to request a premium "Done for You" managed service where the Safahati team builds the site for them.

---

### US-28 — Request a "Done for You" Managed Site Build

```
Story ID: US-28
Epic: EP-14 — "Done for You" Upgrade Path
Title: Request a managed site build from inside the dashboard
```

As **Ahmad**, who is too busy running his restaurant to spend time building a website,
I want to be able to request that someone builds my site for me from inside the app,
So that I get a professional result without spending hours learning how to do it myself.

**Acceptance Criteria:**

- **Given** Ahmad is logged into the dashboard, **When** he sees the "هل تريد أن نبني موقعك بدلاً عنك؟" (Want us to build your site for you?) banner (shown after 3 days of inactivity or on the 4th login with completeness < 50%), **Then** clicking it takes him to a dedicated "أنجز معنا" (Done for You) page within the dashboard.
- **Given** Ahmad is on the "Done for You" page, **When** he reads the page, **Then** he sees: a clear price displayed in SAR (e.g., "799 ريال — موقع جاهز خلال 48 ساعة"), a bullet list of what's included in plain Arabic, a "احجز الخدمة" (Book the Service) primary button, and a WhatsApp chat button to ask questions first.
- **Given** Ahmad clicks "احجز الخدمة", **When** the booking flow opens, **Then** he is presented with a 4-field form: name, phone number (auto-filled from his account), WhatsApp number (auto-filled if already set), and a text area: "أخبرنا عن مشروعك" (Tell us about your business) — maximum 4 fields total.
- **Given** Ahmad submits the form, **When** the submission is successful, **Then** he sees a confirmation screen: "تلقينا طلبك! سيتواصل معك فريقنا عبر واتساب خلال ساعتين." (We received your request! Our team will contact you via WhatsApp within 2 hours.) — his dashboard state does not change (his draft site is preserved).
- **Given** Ahmad has submitted a "Done for You" request, **When** he logs into the dashboard, **Then** a status banner shows: "طلب الخدمة المُدارة: قيد المراجعة" (Managed service request: Under review) — he is not left wondering what happened to his request.
- **Given** Ahmad is on the "Done for You" page, **When** he views the page on a mobile device, **Then** the pricing, bullet points, and booking form are all clearly visible without horizontal scrolling, and the "Book the Service" CTA is always visible above the fold.

**Edge Cases:**
- If Ahmad submits the form and the backend fails to store the request, the form shows: "حدث خطأ — لم يُسجَّل طلبك. يرجى إرساله مرة أخرى أو التواصل معنا مباشرة عبر واتساب" with the support WhatsApp number displayed.
- If Ahmad is on the free plan and clicks "احجز الخدمة", the flow presents the payment step before confirming the booking — Ahmad is not charged until he explicitly confirms payment.

**Out of Scope:**
- This story does not cover the internal Safahati team workflow for fulfilling "Done for You" requests.
- This story does not cover refund flow or SLA enforcement.

```
Priority: Should Have
Story Points: 5
Dependencies: None
Assigned Role: Both
```

---

### US-29 — Contextual "Done for You" Nudge When User is Stuck

```
Story ID: US-29
Epic: EP-14 — "Done for You" Upgrade Path
Title: Receive a contextually placed upgrade prompt when the platform detects the user is stuck
```

As **Layla**, who has been trying to get her portfolio section looking right for 20 minutes and is frustrated,
I want the platform to gently offer me professional help exactly when I need it,
So that I have a clear path forward instead of giving up and abandoning my site.

**Acceptance Criteria:**

- **Given** Layla has been on the same editor section for more than 15 minutes without saving a change, **When** the inactivity threshold is reached, **Then** a soft, non-intrusive slide-in banner appears at the bottom of the editor: "يبدو أنك تعمل على هذا القسم منذ فترة — هل تريد مساعدة متخصصة؟" with a "تعرّف على خدمة أنجز معنا" (Learn about Done for You) link.
- **Given** Layla's site completeness score has been below 30% for more than 7 days, **When** she logs into the dashboard, **Then** a card is displayed in the dashboard home (below the completeness meter): "لم تكمل موقعك بعد — دعنا نفعل ذلك من أجلك في 48 ساعة" with a "اعرف التفاصيل" (Learn more) button.
- **Given** the "Done for You" nudge banner is shown, **When** Layla clicks "X" to dismiss it, **Then** it does not reappear for at least 72 hours — the platform respects that she dismissed it and does not spam her.
- **Given** the "Done for You" nudge is shown as a dashboard card, **When** Layla clicks "اعرف التفاصيل", **Then** she is taken to the same "Done for You" page described in US-28 — the journey is consistent regardless of where the nudge was triggered from.
- **Given** the nudge system is active, **When** Layla completes her site (completeness ≥ 80%), **Then** all "Done for You" nudges are automatically suppressed — the platform does not show upgrade prompts to users who don't need them.
- **Given** Layla has already purchased the "Done for You" service, **When** she logs in, **Then** all "Done for You" nudge banners and cards are permanently hidden — they are replaced by the service status card from US-28.

**Edge Cases:**
- If Layla opens the editor and immediately focuses on a text field (active engagement), the 15-minute inactivity timer resets — the nudge should only appear when the user is genuinely inactive, not while typing slowly.
- If the nudge triggers during a low-connectivity session (Layla is on 3G), the nudge banner renders as a minimal text-only version without any images or animations to avoid adding to page weight.

**Out of Scope:**
- This story does not cover email or SMS nudges for stuck users — only in-app nudges within the dashboard and editor.
- This story does not cover A/B testing different nudge messages or timing thresholds (v2 growth experiment).

```
Priority: Could Have
Story Points: 3
Dependencies: US-28
Assigned Role: Both
```

---

---

## Story Summary Table

| Story ID | Title | Epic | Priority | Points | Role |
|---|---|---|---|---|---|
| US-01 | Complete guided wizard to generate a ready-to-publish site | EP-01 | Must Have | 13 | Both |
| US-02 | Validate wizard inputs and allow free back-and-forth navigation | EP-01 | Must Have | 5 | FE |
| US-03 | Adapt wizard questions dynamically based on selected industry | EP-01 | Must Have | 8 | Both |
| US-04 | Configure a floating WhatsApp button using a single phone number field | EP-02 | Must Have | 3 | Both |
| US-05 | Control floating WhatsApp button visibility, position, and page-level rules | EP-02 | Should Have | 3 | FE |
| US-06 | See industry-specific AI suggestions inside every text field | EP-03 | Should Have | 5 | Both |
| US-07 | Regenerate AI content suggestions to get different options | EP-03 | Should Have | 3 | Both |
| US-08 | Install the Safahati admin dashboard as a home-screen app | EP-04 | Should Have | 8 | Both |
| US-09 | Navigate and edit site content from a touch-optimized mobile interface | EP-04 | Should Have | 5 | FE |
| US-10 | Generate complete field content using a per-field AI button | EP-05 | Should Have | 5 | Both |
| US-11 | Select tone and style before generating AI content | EP-05 | Could Have | 3 | Both |
| US-12 | Configure business opening hours with a structured visual picker | EP-06 | Must Have | 5 | Both |
| US-13 | Show real-time Open/Closed status on the published site | EP-06 | Could Have | 3 | Both |
| US-14 | See a site completeness score with specific missing items listed | EP-07 | Should Have | 5 | Both |
| US-15 | View missing items ranked by impact with one-click navigation to fix them | EP-07 | Should Have | 3 | Both |
| US-16 | Change site visual template without losing any existing content | EP-08 | Should Have | 8 | Both |
| US-17 | Fully preview a new template with real content before committing | EP-08 | Should Have | 3 | FE |
| US-18 | Translate all site content from Arabic to English automatically | EP-09 | Should Have | 8 | Both |
| US-19 | Review AI-translated content field by field before publishing | EP-09 | Could Have | 5 | FE |
| US-20 | See a celebratory "Your site is live!" screen on first publish | EP-10 | Should Have | 3 | FE |
| US-21 | Access sharing tools from the dashboard at any time after first publish | EP-10 | Should Have | 2 | FE |
| US-22 | View the live site preview updating in real time as changes are made | EP-11 | Should Have | 8 | FE |
| US-23 | Switch the live preview between mobile, tablet, and desktop views | EP-11 | Could Have | 3 | FE |
| US-24 | Have editor changes automatically saved without needing to click Save | EP-12 | Must Have | 5 | Both |
| US-25 | Undo the last edit with a visible, accessible undo button | EP-12 | Must Have | 5 | FE |
| US-26 | Experience an admin dashboard with zero technical jargon | EP-13 | Must Have | 3 | FE |
| US-27 | Access plain-language help tooltips on every setting in the admin | EP-13 | Must Have | 3 | FE |
| US-28 | Request a managed site build from inside the dashboard | EP-14 | Should Have | 5 | Both |
| US-29 | Receive a contextual upgrade prompt when the platform detects the user is stuck | EP-14 | Could Have | 3 | Both |

---

## Story Point Totals by Priority

| Priority | Count | Total Points |
|---|---|---|
| Must Have | 9 | 50 |
| Should Have | 14 | 66 |
| Could Have | 6 | 20 |
| **Total** | **29** | **136** |

---

## Story Point Totals by Epic

| Epic | Stories | Total Points |
|---|---|---|
| EP-01: Wizard | US-01 to US-03 | 26 |
| EP-02: WhatsApp | US-04 to US-05 | 6 |
| EP-03: AI Suggestions | US-06 to US-07 | 8 |
| EP-04: Mobile PWA | US-08 to US-09 | 13 |
| EP-05: Help Me Write | US-10 to US-11 | 8 |
| EP-06: Opening Hours | US-12 to US-13 | 8 |
| EP-07: Completeness | US-14 to US-15 | 8 |
| EP-08: Template Switch | US-16 to US-17 | 11 |
| EP-09: Translate | US-18 to US-19 | 13 |
| EP-10: Launch Celebration | US-20 to US-21 | 5 |
| EP-11: Live Preview | US-22 to US-23 | 11 |
| EP-12: Auto-Save | US-24 to US-25 | 10 |
| EP-13: Plain Language | US-26 to US-27 | 6 |
| EP-14: Done for You | US-28 to US-29 | 8 |

---

*Document prepared by: Business Analyst, Safahati Virtual Team*
*Version: 1.0 | April 2026*
*Stories: 29 total (US-01 through US-29) | 14 Epics | 136 total story points*
