# Training Materials Outline
## Safahati — User Onboarding, Admin Operations, and Incident Response Training
**Version:** 1.0
**Date:** 2026-04-25

---

## Overview

This document outlines all training materials needed to operate Safahati effectively. Materials are divided into four tracks:

1. **User Onboarding Guide** (English) — for customers new to Safahati
2. **دليل تأهيل المستخدم** (Arabic) — same content for Arabic-speaking customers
3. **Admin Operations Guide** — for the internal engineering and support team
4. **Incident Response Training** — for on-call engineers

---

## Track 1: User Onboarding Guide (English)

### Module 1: Welcome to Safahati

**Objective:** User understands what Safahati is and what they will accomplish in this guide.

**Content:**
- Welcome message: "Safahati helps MENA businesses build professional websites without writing code."
- What you'll learn in this guide:
  - How to create your account
  - How to build your first website in under 10 minutes
  - How to customize your site's content and design
  - How to publish your site and share it
- What you need: an email address and 10 minutes

---

### Module 2: Creating Your Account

**Objective:** User successfully registers and reaches the dashboard.

**Step-by-step walkthrough:**

1. Go to `app.safahati.com/register`
2. Fill in your name, email, and a password (minimum 6 characters)
3. Click "Create Account"
4. You will be taken to your dashboard automatically

**Common questions answered in this module:**
- What if I see "Email already registered"? → You may already have an account. Try logging in at `app.safahati.com/login`.
- Is my data secure? → Passwords are encrypted. We never store your password in plain text.
- Can I use the same email for multiple accounts? → No, each email address can only have one account.

---

### Module 3: Your Dashboard

**Objective:** User is comfortable navigating the dashboard.

**Content:**
- The dashboard shows all your websites
- First time: your site list is empty — let's create your first site
- "Create New Site" button is in the top-right corner
- Each site card shows: site name, industry, language, status (Draft/Published), and edit button

---

### Module 4: Creating Your First Website

**Objective:** User completes the 2-step site creation wizard.

**Step 1: Site Details**
- Enter your business or site name (e.g., "Riyadh Legal Consulting" or "مطعم البيت")
- Choose your language:
  - **English** — site content will be in English; layout is left-to-right
  - **Arabic (العربية)** — site content will be in Arabic; layout is right-to-left
- Click "Continue"

**Step 2: Choose Your Industry**
- Select the category that best matches your business:

| Industry | Best For |
|---|---|
| Company | General businesses, corporate, professional services |
| Agency | Marketing agencies, design studios, creative firms |
| Freelancer | Independent contractors, consultants, coaches |
| Resume | Personal CV pages, career portfolios |
| Restaurant | Restaurants, cafes, food trucks, catering |
| Clinic | Medical clinics, dental, physiotherapy, wellness |
| Real Estate | Property agents, real estate companies |
| SaaS | Software products, tech startups |
| E-commerce | Online shops, product sellers |
| Event | Conferences, weddings, parties, exhibitions |
| Photography | Photographers, visual artists, videographers |
| Law Firm | Legal practices, lawyers, notaries |
| Gym | Fitness centers, yoga studios, sports clubs |

- Click on your industry — Safahati creates your site and opens the editor automatically

---

### Module 5: Using the Site Editor

**Objective:** User can navigate the editor and understand its three main areas.

**Editor layout:**

```
┌─────────────────────────────────────────────────────────┐
│  [Desktop] [Tablet] [Mobile]    [EN/AR]  [Save] [Publish]│ ← Top bar
├─────────────────────────────────────────────────────────┤
│              │                               │           │
│  SECTIONS    │         LIVE PREVIEW          │  EDITOR   │
│  (left panel)│       (center, changes        │  PANEL    │
│              │        as you edit)           │  (right)  │
│  • Hero      │                               │           │
│  • About     │    [Your website preview]     │  Content  │
│  • Services  │                               │  or Theme │
│  • Contact   │                               │  settings │
│              │                               │           │
└─────────────────────────────────────────────────────────┘
```

**What the three panels do:**
- **Left panel (Sections list):** All the building blocks of your page. Click one to select it.
- **Center (Live preview):** Shows how your site looks. Updates in real time as you edit.
- **Right panel (Editor):** When a section is selected, shows fields to edit its content. Click "Theme" tab for colors and fonts.

**Device preview modes:**
- Desktop (default) — standard monitor width
- Tablet — iPad-sized view
- Mobile — phone-sized view

---

### Module 6: Editing Your Content

**Objective:** User can change text, images, and other content in their sections.

**How to edit a section:**
1. Click on a section in the left panel (e.g., "Hero")
2. The right panel shows all editable fields for that section
3. Type in any text field — the preview updates immediately
4. For bilingual sites: you'll see fields for both English and Arabic — fill in both

**Common fields:**
- **Title / العنوان:** Main heading text
- **Description / الوصف:** Paragraph text below the heading
- **Button Text / نص الزر:** Label for the call-to-action button
- **Button URL / رابط الزر:** Where the button links to (e.g., `#contact`)
- **Image URL:** Paste a link to an image (hosted on your MinIO storage or any public URL)

**Tips for great content:**
- Keep headings short (under 8 words) — they have more impact
- The description should answer "what do you do and who do you help?"
- Button text should be an action ("Contact Us", "View Services", "Book Now")

---

### Module 7: Customizing Your Design

**Objective:** User can change colors and fonts to match their brand.

**Opening the Theme panel:**
1. Make sure no section is selected (click blank area in preview)
2. The right panel shows the "Theme" tab
3. Or click the "Theme" tab at the top of the right panel

**Colors:**
- **Primary:** Main brand color (buttons, highlights, key elements)
- **Secondary:** Supporting color (accents, secondary buttons)
- **Background:** Page background color
- **Text:** Body text color

Click any color swatch to open the color picker.

**Theme Presets:**
- Pre-built color + font combinations for a cohesive look
- Click any preset to apply it instantly
- You can still adjust individual colors after applying

**Fonts:**
- **Heading font:** Used for titles and headings
- **Body font:** Used for paragraphs and descriptions
- Arabic-optimized fonts are available when Arabic language is selected

---

### Module 8: Publishing Your Site

**Objective:** User successfully publishes their site and can access it by URL.

**Before publishing — checklist:**
- [ ] Have you edited the hero section with your real business name?
- [ ] Have you added your real description?
- [ ] Have you updated the contact section with real contact details?
- [ ] Does the site look good on mobile (check mobile preview)?

**Publishing steps:**
1. Click the "Publish" button in the top-right of the editor
2. Confirm in the dialog that appears
3. Your site is now live at: `your-site-name.safahati.com`

**Accessing your live site:**
- Your URL is shown in the editor header after publishing
- Share this URL on your social media, WhatsApp, or business cards
- The URL format is: `[your-site-name].safahati.com`

---

### Module 9: Making Changes After Publishing

**Objective:** User knows how to update their published site.

**Content:**
- Your site stays published while you make changes in the editor
- Changes are only visible on the live site after you click "Save"
- You can work on your site without it being visible (change to Draft) if needed
- There is no limit to how many times you can edit and save

---

### Module 10: Getting Help

**Objective:** User knows how to find support.

**Self-service:**
- Knowledge base: `help.safahati.com` (this guide and more articles)
- FAQ section at bottom of any page

**Contact support:**
- Email: `support@safahati.com`
- Response time: within 24 hours (business days)
- Include: your site name, screenshot if applicable, description of the issue

---

## Track 2: دليل تأهيل المستخدم (Arabic)

### الوحدة الأولى: مرحبًا بك في صفاحاتي

**الهدف:** يفهم المستخدم ما هي صفاحاتي وما الذي سيتعلمه في هذا الدليل.

**المحتوى:**
- رسالة ترحيبية: "صفاحاتي تساعد الشركات في منطقة الشرق الأوسط وشمال أفريقيا على بناء مواقع ويب احترافية دون الحاجة إلى كتابة أي كود."
- ما ستتعلمه في هذا الدليل:
  - كيفية إنشاء حسابك
  - كيفية بناء موقعك الأول في أقل من 10 دقائق
  - كيفية تخصيص محتوى موقعك وتصميمه
  - كيفية نشر موقعك ومشاركته
- ما تحتاجه: عنوان بريد إلكتروني و10 دقائق فقط

---

### الوحدة الثانية: إنشاء حسابك

**الهدف:** ينجح المستخدم في التسجيل ويصل إلى لوحة التحكم.

**الخطوات:**

1. اذهب إلى `app.safahati.com/register`
2. أدخل اسمك وبريدك الإلكتروني وكلمة مرور (6 أحرف على الأقل)
3. انقر على "إنشاء حساب"
4. ستنتقل تلقائيًا إلى لوحة التحكم

**أسئلة شائعة:**
- ماذا لو ظهرت رسالة "البريد الإلكتروني مسجل بالفعل"؟ → ربما لديك حساب مسبق. جرّب تسجيل الدخول.
- هل بياناتي آمنة؟ → نعم، كلمات المرور مشفّرة ولا نحتفظ بها بشكل مباشر.

---

### الوحدة الثالثة: لوحة التحكم

**الهدف:** يتعرف المستخدم على لوحة التحكم.

**المحتوى:**
- تعرض لوحة التحكم جميع مواقعك
- في المرة الأولى: القائمة فارغة — لننشئ موقعك الأول
- زر "إنشاء موقع جديد" في أعلى يسار الصفحة
- كل بطاقة موقع تعرض: اسم الموقع، القطاع، اللغة، الحالة (مسودة / منشور)

---

### الوحدة الرابعة: إنشاء موقعك الأول

**الهدف:** يكمل المستخدم معالج إنشاء الموقع بخطوتين.

**الخطوة الأولى: تفاصيل الموقع**
- أدخل اسم نشاطك التجاري أو موقعك (مثال: "مطعم البيت" أو "استشارات قانونية الرياض")
- اختر اللغة:
  - **العربية** — محتوى الموقع باللغة العربية والتخطيط من اليمين إلى اليسار
  - **الإنجليزية (English)** — محتوى الموقع بالإنجليزية والتخطيط من اليسار إلى اليمين
- انقر على "متابعة"

**الخطوة الثانية: اختر القطاع**

| القطاع | الأنسب لـ |
|---|---|
| شركة | الأعمال التجارية العامة والخدمات المهنية |
| وكالة | وكالات التسويق والتصميم |
| مستقل | المستقلون والمستشارون والمدربون |
| سيرة ذاتية | صفحات السيرة الذاتية الشخصية |
| مطعم | المطاعم والمقاهي والتموين |
| عيادة | العيادات الطبية والصحة والعافية |
| عقارات | وكلاء العقارات والشركات العقارية |
| تقنية SaaS | منتجات البرمجيات والشركات الناشئة |
| تجارة إلكترونية | المتاجر الإلكترونية والبائعون |
| فعاليات | المؤتمرات والأعراس والحفلات |
| تصوير | المصورون والفنانون البصريون |
| مكتب محاماة | المكاتب القانونية والمحامون |
| صالة رياضية | مراكز اللياقة واستوديوهات اليوغا |

- انقر على قطاعك — ستنشئ صفاحاتي موقعك وتفتح المحرر تلقائيًا

---

### الوحدات الخامسة إلى العاشرة

تعكس نفس محتوى الوحدات 5-10 من الدليل الإنجليزي مع ترجمة عربية كاملة وتعديل أسلوب الكتابة ليناسب القارئ العربي. الفروق المهمة:

- واجهة المحرر تعكس من اليمين إلى اليسار
- حقول المحتوى: العنوان (بالعربية)، الوصف (بالعربية)، إلخ
- الأمثلة تستخدم أسماء ومحتوى عربي (مثال: "شركة الأعمال السعودية" بدلاً من "Company Name")
- قسم المساعدة: `support@safahati.com` مع ذكر الرد خلال 24 ساعة وأن الدعم متاح بالعربية والإنجليزية

---

## Track 3: Admin Operations Guide

### Section 1: Environment Setup

**Who should read this:** New engineers and support staff joining the team.

**Prerequisites checklist:**
- [ ] SSH key added to Hetzner VPS (ask team lead)
- [ ] Local development environment set up (Node.js 20+, npm 10+)
- [ ] Repository cloned from `github.com/khalshehri/safahati`
- [ ] `.env.local` file received from team lead (contains `AUTH_SECRET`, etc.)
- [ ] Sentry account access (when set up)
- [ ] UptimeRobot access (when set up)

**Local development startup:**
```bash
git clone https://github.com/khalshehri/safahati.git
cd safahati
npm install
cp .env.example .env.local  # fill in values
npm run db:push              # or: npx drizzle-kit push
npm run dev                  # starts on localhost:3000
```

---

### Section 2: Production Environment

**VPS Access:**
```bash
ssh root@<hetzner-vps-ip>
cd /opt/safahati
docker compose ps  # check running services
docker compose logs app --tail=100  # view app logs
```

**Key file locations:**
```
/opt/safahati/
├── src/                    # Application source code
├── data/
│   └── db.sqlite           # SQLite database (NEVER delete!)
├── data/backups/           # Automated backup files
├── .env.production         # Production environment variables
├── docker-compose.yml      # Service definitions
├── nginx/
│   └── default.conf        # Nginx config (subdomain routing + SSL)
└── node_modules/           # Dependencies
```

**Critical environment variables:**
| Variable | Purpose |
|---|---|
| `AUTH_SECRET` | NextAuth JWT signing key — changing this invalidates all sessions |
| `DATABASE_URL` | Path to SQLite file (or PostgreSQL connection string in future) |
| `NEXTAUTH_URL` | Full URL of the app (`https://app.safahati.com`) |
| `RESEND_API_KEY` | Email sending (transactional emails) |
| `STRIPE_SECRET_KEY` | Payment processing (when billing enabled) |

---

### Section 3: Common Operations

#### 3.1 Restarting the Application
```bash
docker compose restart app
# Wait 10 seconds, then verify:
curl https://app.safahati.com/api/health
```

#### 3.2 Viewing Application Logs
```bash
# Last 100 lines
docker compose logs app --tail=100

# Follow real-time
docker compose logs app --follow

# With timestamps
docker compose logs app --timestamps --tail=50
```

#### 3.3 Database Direct Access
```bash
# Open SQLite shell
docker compose exec app sqlite3 data/db.sqlite

# Useful queries:
# Count users
SELECT count(*) FROM users;
# Count sites by status
SELECT status, count(*) FROM sites GROUP BY status;
# Find user by email
SELECT id, name, email, created_at FROM users WHERE email='user@example.com';
# Check if site slug exists
SELECT id, name, status FROM sites WHERE slug='my-restaurant';
# Count sections for a site
SELECT count(*) FROM sections WHERE site_id='<site-id>';
```

#### 3.4 SSL Certificate Renewal
```bash
# Check expiry
docker compose exec nginx openssl x509 -in /etc/letsencrypt/live/safahati.com/cert.pem -noout -dates

# Renew (if within 30 days of expiry)
docker compose exec certbot certbot renew
docker compose exec nginx nginx -s reload
```

#### 3.5 Manual Database Backup
```bash
sqlite3 /opt/safahati/data/db.sqlite ".backup '/opt/safahati/data/backups/manual-$(date +%Y%m%d-%H%M%S).sqlite'"
ls -lh /opt/safahati/data/backups/
```

---

### Section 4: Monitoring Checklist (Daily)

Spend 5 minutes each morning checking:

- [ ] UptimeRobot dashboard — any downtime incidents overnight?
- [ ] Sentry — any new errors (filter: last 24 hours)?
- [ ] VPS disk usage: `df -h` — should be below 70%
- [ ] DB file size: `ls -lh data/db.sqlite` — track growth trend
- [ ] Docker container health: `docker compose ps` — all should be "Up"
- [ ] Last backup exists: `ls data/backups/ | tail -5`

---

## Track 4: Incident Response Training

### IRT-01: Core Principles

**Before you touch anything:**
1. Stay calm — most incidents are recoverable
2. Acknowledge the alert within the SLA window (15 min for P1)
3. Communicate before you investigate — users need to know you're aware
4. Document every action as you take it (paste commands and output to incident ticket)
5. Do not make changes without understanding why — "random restarts" can escalate an incident

**The OODA Loop for incidents:**
- **Observe:** What is the symptom? What do the logs say? What does the health check return?
- **Orient:** What do you know about this system? Have you seen this before? Is there a runbook?
- **Decide:** What is the most likely cause? What is the safest first action?
- **Act:** Take the action. Document it. Re-observe.

---

### IRT-02: Communication Protocol

**For P1/P2 incidents, communicate on three channels simultaneously:**

**1. Status Page (user-facing):**
Post within 15 minutes of detection. Use this template:
> **Investigating:** We are aware of an issue affecting [service name] and are actively investigating. We will post an update within 30 minutes.
> **Arabic:** نحن على علم بمشكلة تؤثر على [اسم الخدمة] ونحقق فيها بنشاط. سنرسل تحديثًا خلال 30 دقيقة.

**2. Internal Slack/Telegram #incidents channel:**
> 🔴 P1 INCIDENT: [brief description]
> - Time detected: [HH:MM]
> - Affected: [list what is broken]
> - Status: Investigating
> - Owner: @[your name]

**3. User-facing email (for P1 incidents lasting > 1 hour):**
Notify affected users via Resend email from `incidents@safahati.com`.

---

### IRT-03: Escalation Decision Tree

```
Alert received
      │
      ▼
Can you diagnose the cause? ──Yes──► Follow the relevant playbook (INC-01 through INC-04)
      │
     No
      │
      ▼
Is it infrastructure? ──Yes──► Escalate to DevOps / VPS admin
(VPS down, disk full, OOM)
      │
     No
      │
      ▼
Is it a code bug? ──Yes──► Escalate to Backend Engineer
(unexpected 500, auth issue, data issue)
      │
     No
      │
      ▼
Is it a data integrity issue? ──Yes──► Escalate to Backend Engineer + notify team lead
(corrupted DB, orphaned records)
      │
     No
      │
      ▼
Is it a 3rd party service? ──Yes──► Check Stripe/Resend/Cloudflare status pages
(payment, email, DNS)
      │
     No
      │
      ▼
Escalate to team lead immediately
```

---

### IRT-04: Post-Incident Review Template

After every P1/P2 incident, complete this review within 48 hours:

```markdown
## Incident Post-Mortem

**Incident ID:** INC-YYYYMMDD-XX
**Date:** YYYY-MM-DD
**Duration:** HH:MM - HH:MM (X hours X minutes)
**Severity:** P1 / P2
**Author:** [name]

### Summary
[2-3 sentence plain English summary of what happened]

### Timeline
| Time | Event |
|---|---|
| HH:MM | Alert received / incident detected |
| HH:MM | First response — status page updated |
| HH:MM | Root cause identified |
| HH:MM | Fix applied |
| HH:MM | Incident resolved — service confirmed healthy |

### Root Cause
[Technical explanation of why this happened]

### Impact
- Users affected: [estimate]
- Duration of user impact: [X minutes / hours]
- Data affected: [yes/no, description if yes]

### What Went Well
- [Something that helped you respond quickly]

### What Went Poorly
- [Something that slowed down the response]

### Action Items
| Action | Owner | Due Date |
|---|---|---|
| Update runbook INC-XX with new steps | [name] | [date] |
| Add monitoring for X | [name] | [date] |
| Fix root cause bug (link to ticket) | [name] | [date] |
```

---

### IRT-05: Tabletop Exercise Scenarios

Practice these scenarios in team meetings quarterly:

**Scenario 1: Database is locked**
- Simulate: Two scripts writing to SQLite simultaneously
- Expected response: Stop one writer; restart app; verify recovery
- Learning: SQLite single-writer limitation; need for future PostgreSQL migration

**Scenario 2: Stale session cascade**
- Simulate: Reset DB in production after 50 users are registered
- Expected response: Users get helpful error message (BUG-001 fix); users re-login
- Learning: Verify the BUG-001 fix is in place; understand JWT lifecycle

**Scenario 3: SSL certificate expired**
- Simulate: Certbot failed to auto-renew; wildcard cert expired
- Expected response: Manual certbot renew; nginx reload; verify HTTPS
- Learning: Certificate monitoring; why automated renewal matters

**Scenario 4: VPS disk full**
- Simulate: Log files or old SQLite backups fill /opt partition
- Expected response: Identify largest files; clean up old backups; add disk monitoring
- Learning: Log rotation; backup retention policy; disk alert thresholds

---

## Training Completion Checklist

### For New Support Engineers

- [ ] Read ARCH-01 (Architecture Overview) and ARCH-02 (DB Schema)
- [ ] Complete local development setup
- [ ] Walk through all 10 user-facing modules (feel the product as a user)
- [ ] Shadow an experienced engineer on one deployment (DEPLOY-01)
- [ ] Practice DB queries (DB-01 operations)
- [ ] Read all 4 incident playbooks (INC-01 through INC-04)
- [ ] Complete IRT-01 and IRT-02 (incident principles + communication)
- [ ] Participate in one tabletop exercise
- [ ] Handle 3 mock support tickets under supervision
- [ ] Complete first solo on-call shift with backup available

### For New Engineers (Technical Team)

- [ ] Read all architecture runbooks
- [ ] Complete local dev setup and run the app
- [ ] Deploy to staging once using DEPLOY-01
- [ ] Write and run one DB migration using DB-02
- [ ] Review all known bugs in Bug Registry
- [ ] Read QA Test Strategy and understand the testing plan
- [ ] Participate in code review using the Code Review Checklist from Quality Standards
