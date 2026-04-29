# Knowledge Base Structure
## Safahati — User and Internal Team Documentation Plan
**Version:** 1.0
**Date:** 2026-04-25

---

## Overview

The Safahati knowledge base is organized into two sections:

1. **User-Facing Articles** — Guides for SME owners, freelancers, and other customers who use Safahati to build and manage their websites. Written in both English and Arabic.
2. **Internal Team Articles** — Technical runbooks, deployment checklists, DB operations, and incident playbooks for the engineering and support team.

---

## Section 1: User-Facing Articles

### 1.1 Getting Started

#### Article: GS-01 — What is Safahati?
**Audience:** New users, trial users
**Languages:** English + Arabic
**Content:**
- What the platform does (config-driven multi-tenant website builder)
- Who it's for (SMEs, freelancers, clinics, restaurants, agencies in MENA/Saudi)
- How subdomain routing works (your-business.safahati.com)
- What you get on each plan (outline, not detailed pricing)
- Link to "Create your first site" guide

---

#### Article: GS-02 — Creating Your Account
**Audience:** New users
**Languages:** English + Arabic
**Content:**
- Step-by-step registration (name, email, password)
- Email verification process
- What happens after registration (redirected to dashboard)
- "Forgot password" process
- Account security tips (strong password, don't share credentials)

---

#### Article: GS-03 — Dashboard Overview
**Audience:** New users
**Languages:** English + Arabic
**Content:**
- Annotated screenshot of the dashboard
- "My Sites" list — what the cards show (name, status, industry, language)
- "Create New Site" button — where it leads
- Account settings location
- Logout process

---

### 1.2 Creating a Site

#### Article: CS-01 — Creating Your First Website (Step-by-Step)
**Audience:** All users
**Languages:** English + Arabic
**Content:**
- Click "Create New Site" from dashboard
- **Step 1:** Enter site name
  - Tips for choosing a good name
  - Name appears as the page title and is used to generate your URL slug
- **Step 1:** Choosing language (English vs Arabic)
  - What Arabic mode does: RTL layout, Arabic fonts, Arabic default content
  - You can change language later in site settings
- **Step 2:** Choosing an industry template
  - What each industry template includes (list all 13)
  - Company: professional services, corporate websites
  - Agency: creative and digital agencies
  - Freelancer: personal professional portfolios
  - Resume: CV-style personal pages
  - Restaurant: food service businesses
  - Clinic: medical and health practices
  - Real Estate: property listings and agents
  - SaaS: software product pages
  - E-commerce: online stores
  - Event: conferences, weddings, events
  - Photography: visual portfolio
  - Law Firm: legal services
  - Gym: fitness centers and studios
- After clicking an industry: loading screen, then editor opens

---

#### Article: CS-02 — Understanding the Site Editor
**Audience:** All users
**Languages:** English + Arabic
**Content:**
- Annotated screenshot of the full editor layout
- Left panel: Section list (visible sections in order)
- Center: Live preview (desktop/tablet/mobile toggle)
- Right panel: Content editor (when a section is selected) / Theme editor
- Top bar: Device mode buttons, Language toggle, Save button, Publish button
- What "Draft" vs "Published" means
- Auto-save behavior (or manual save — clarify current behavior)

---

#### Article: CS-03 — Editing Section Content
**Audience:** All users
**Languages:** English + Arabic
**Content:**
- Click on a section in the preview or section list to select it
- Right panel switches to Content editor
- What each field type looks like (text, textarea, toggle, color picker, image URL)
- Bilingual editing: English tab and Arabic tab side by side
- How to change images (URL input, with recommended image sizes)
- Saving changes with the Save button (or auto-save if implemented)
- Reverting changes (if implemented) or refreshing to discard

---

#### Article: CS-04 — Changing a Section's Template
**Audience:** All users
**Languages:** English + Arabic
**Content:**
- What "template" means (visual design variant for the same section type)
- Where the template selector appears (content editor panel)
- How switching templates affects your content (content config is merged/preserved)
- Warning: some templates have different fields — switching may show blank content
- Examples: Hero section has 25+ template variations

---

#### Article: CS-05 — Adding and Removing Sections
**Audience:** All users
**Languages:** English + Arabic
**Content:**
- Adding a section: click the "+" Add Section button
- Choosing block type (Hero, About, Features, Pricing, etc.) — what each does
- Removing a section: hover section → delete icon → confirm
- Maximum sections per site (if any limit)
- Recommended section order for professional-looking pages

---

#### Article: CS-06 — Reordering Sections
**Audience:** All users
**Languages:** English + Arabic
**Content:**
- Drag-and-drop to reorder (if implemented)
- Up/Down arrow buttons in section list
- Section order affects how your page looks when published

---

#### Article: CS-07 — Hiding and Showing Sections
**Audience:** All users
**Languages:** English + Arabic
**Content:**
- The eye icon on each section toggles visibility
- Hidden sections are not shown on published site
- Hidden sections remain in the editor and can be re-shown
- Use case: seasonal sections (event ended, promotion expired)

---

### 1.3 Customizing Your Site

#### Article: CU-01 — Customizing Your Site's Theme
**Audience:** All users
**Languages:** English + Arabic
**Content:**
- Accessing the Theme tab in the editor
- **Colors:** Primary, secondary, accent, background, text
- **Fonts:** Heading font and body font (font options available)
- **Border radius:** Sharp, default, rounded presets
- **Theme presets:** Pre-built color and font combinations
- Saving theme changes
- Warning: changing fonts may affect Arabic text rendering

---

#### Article: CU-02 — Using Theme Presets
**Audience:** All users
**Languages:** English + Arabic
**Content:**
- What a theme preset includes (colors + fonts combined)
- List of available presets (Modern Blue, Warm Sunset, etc. — from theme-presets.ts)
- Applying a preset replaces your current colors and fonts
- You can still customize individual colors after applying a preset

---

### 1.4 Publishing Your Site

#### Article: PB-01 — Publishing Your Site
**Audience:** All users
**Languages:** English + Arabic
**Content:**
- Difference between Draft and Published
  - Draft: only visible in your editor, not accessible by URL
  - Published: accessible at [your-slug].safahati.com
- Click "Publish" button in editor top bar
- Confirm publication dialog
- Your site's URL after publishing
- How long it takes to go live (near-instant)
- Unpublishing a site (changing back to Draft)

---

#### Article: PB-02 — Your Site's URL
**Audience:** All users
**Languages:** English + Arabic
**Content:**
- How your URL is generated from your site name (slugify)
- Examples: "My Restaurant" → my-restaurant.safahati.com
- What happens if the slug is already taken (counter appended: my-restaurant-2)
- Custom domain (coming soon / current plan tiers)
- Sharing your site URL

---

### 1.5 Managing Your Sites

#### Article: MG-01 — Managing Multiple Sites
**Audience:** Power users
**Languages:** English + Arabic
**Content:**
- How many sites you can have per plan
- Switching between sites in the dashboard
- Site status indicators in dashboard (Draft / Published)
- Deleting a site (warning: permanent, sections also deleted)
- Site settings (rename, change language)

---

### 1.6 Troubleshooting

#### Article: TR-01 — "Session Expired — Please Log Out and Log Back In"
**Audience:** All users
**Languages:** English + Arabic
**Content:**
- What this error means (your login session is outdated)
- How to fix it: click your profile icon → Log Out → log back in
- Why it happens (security measure; may occur after system updates)
- If problem persists after re-login, contact support

---

#### Article: TR-02 — My Site Is Not Showing the Changes I Made
**Audience:** All users
**Languages:** English + Arabic
**Content:**
- Did you click Save after making changes?
- Is the site Published? (Draft sites don't update the public URL)
- Browser cache: try hard-refresh (Ctrl+F5 / Cmd+Shift+R)
- If still not updated after 5 minutes, contact support

---

#### Article: TR-03 — The Editor Looks Blank or Shows an Error
**Audience:** All users
**Languages:** English + Arabic
**Content:**
- Try refreshing the page
- Try a different browser (Chrome, Firefox, Edge)
- Check your internet connection
- If the problem persists, note the URL you were on and contact support with:
  - Your browser name and version
  - The time the error occurred
  - What you were doing when it happened

---

#### Article: TR-04 — Arabic Text Is Not Displaying Correctly
**Audience:** Arabic users
**Languages:** Arabic (primarily)
**Content:**
- Verify the site language is set to Arabic (editor → Settings)
- If font looks wrong: the browser may need the Arabic font to load; try refreshing
- If text appears left-aligned instead of right-aligned: site language may be set to English
- Contact support with a screenshot if the issue persists

---

## Section 2: Internal Team Articles

### 2.1 Architecture Runbooks

#### Runbook: ARCH-01 — Platform Architecture Overview
**Audience:** All engineers, new hires
**Content:**
- Safahati service topology: Next.js app, SQLite DB, MinIO, Redis, Nginx, Docker Compose
- Subdomain routing flow: `client.safahati.com` → Nginx → Next.js middleware → DB lookup by slug → render
- Auth flow: login form → `POST /api/auth/[...nextauth]` → bcrypt verify → JWT → `auth()` on routes
- Site creation flow: wizard → `POST /api/sites` → industry template seed → sections table
- Block registry pattern: `getBlock(type)` → templates list → `getTemplate(id)` → `defaultConfig`
- File locations: `src/lib/db/schema.ts`, `src/lib/registry.ts`, `src/config/industry-templates.ts`, `src/middleware.ts`

---

#### Runbook: ARCH-02 — Database Schema Reference
**Audience:** Backend engineers, support engineers
**Content:**
- Full schema listing (users, sites, sections tables)
- Column types and constraints
- FK relationships and cascade rules (sections cascade-delete when site deleted)
- JSON columns: `sites.theme` (SiteTheme), `sections.config` (block-specific config)
- Known schema drift (BUG-004): extra columns that may exist in production DB

---

### 2.2 Deployment Runbooks

#### Runbook: DEPLOY-01 — Standard Deployment Checklist
**Audience:** DevOps, Backend Engineer
**Content:**
```
Pre-deployment:
[ ] All CI checks green on the commit to deploy
[ ] DB migration files tested on staging
[ ] .env.production values reviewed (no stale secrets)
[ ] Announce maintenance window if > 5min downtime expected

Deployment steps:
[ ] SSH into Hetzner VPS
[ ] cd /opt/safahati
[ ] git pull origin main
[ ] npm ci
[ ] npm run build
[ ] npx drizzle-kit migrate (if schema changed)
[ ] docker compose up -d --build
[ ] docker compose ps (verify all containers healthy)
[ ] curl http://localhost:3000/api/health (verify 200 OK)

Post-deployment:
[ ] Test register flow on staging
[ ] Test login flow
[ ] Test site creation with Company template
[ ] Test editor save
[ ] Verify published site loads
[ ] Check Sentry for new errors in first 15 minutes
[ ] Update status page (no incident → mark maintenance complete)
```

---

#### Runbook: DEPLOY-02 — Rollback Procedure
**Audience:** DevOps, Backend Engineer
**Content:**
```
If deployment causes P1 incident:
1. git log --oneline (find last good commit SHA)
2. git checkout <last-good-sha>
3. npm ci && npm run build
4. npx drizzle-kit migrate --to=<previous-migration> (if schema rollback needed)
5. docker compose up -d --build
6. Verify with health check and smoke test
7. Post to status page: "We have rolled back to a previous version while investigating"
8. Create incident ticket
```

---

### 2.3 Incident Playbooks

#### Playbook: INC-01 — Application is Down (503 / No Response)
**Audience:** On-call support engineer
**Content:**
```
Symptoms: UptimeRobot alert fires; users report site not loading; health check fails

Diagnosis:
1. SSH to VPS: docker compose ps
   - If Next.js container exited: docker compose logs app --tail=50
   - If Nginx container exited: docker compose logs nginx --tail=50
2. Check VPS resources: df -h (disk), free -m (memory), top (CPU)
3. Check if OOM (out of memory) killed the process

Common causes and fixes:
A. OOM Kill:
   → free -m shows <100MB available
   → docker compose restart app
   → Consider increasing VPS RAM or adding swap
B. Build failure on last deploy:
   → docker compose logs app shows build error
   → Rollback to previous version (see DEPLOY-02)
C. DB locked/corrupted:
   → logs show "database is locked" or "disk I/O error"
   → Stop app: docker compose stop app
   → sqlite3 data/db.sqlite "PRAGMA integrity_check;"
   → If corrupted: restore from last backup
D. Port conflict:
   → netstat -tlnp | grep 3000
   → Kill conflicting process or change port
```

---

#### Playbook: INC-02 — Users Cannot Log In
**Audience:** On-call support engineer
**Content:**
```
Symptoms: Users report "Invalid credentials" or login page loops; Sentry shows auth errors

Diagnosis:
1. Can YOU log in with a known-good test account?
2. Check Sentry for errors in /api/auth/[...nextauth]
3. Verify AUTH_SECRET env var is set: docker compose exec app printenv AUTH_SECRET
4. Check bcrypt errors in logs (bcrypt compare failure)
5. Check if users table is accessible: sqlite3 data/db.sqlite "SELECT count(*) FROM users;"

Common causes:
A. AUTH_SECRET missing or changed:
   → Existing JWTs invalid → all sessions invalidated
   → Restore correct AUTH_SECRET value; users must re-login
B. DB file permissions:
   → docker compose exec app ls -la data/
   → Fix permissions: chown -R node:node data/
C. NEXTAUTH_URL mismatch:
   → Verify NEXTAUTH_URL matches the actual domain in use
```

---

#### Playbook: INC-03 — Site Creation Fails (500 Error)
**Audience:** On-call support engineer
**Content:**
```
Symptoms: User reports "Failed to create site" error; Sentry captures 500 in POST /api/sites

Diagnosis:
1. Check Sentry error details: what is the error message?
2. If "FOREIGN KEY constraint failed":
   → Stale session issue (BUG-001)
   → User's JWT contains a user ID not in the DB
   → Fix: user must log out and back in
   → This should no longer produce a 500 (BUG-001 was fixed), but if it recurs, re-verify the fix is deployed
3. If "UNIQUE constraint failed: sites.slug":
   → Slug generation loop failed (race condition or loop bug)
   → Check the slug generation code
4. If "database is locked":
   → Another write operation is holding the lock
   → SQLite single-writer limitation hit under concurrent load
   → Restart app container; consider migrating to PostgreSQL

Resolution for user:
→ Ask user to log out, log back in, and try again
→ If still failing, collect: user email, site name they tried, time of error
→ Check DB for partial site creation: sqlite3 db "SELECT * FROM sites ORDER BY created_at DESC LIMIT 5;"
```

---

#### Playbook: INC-04 — Published Site Not Loading
**Audience:** On-call support engineer
**Content:**
```
Symptoms: User's site URL returns 404 or blank page; other sites work fine

Diagnosis:
1. Verify site status: sqlite3 db "SELECT slug, status FROM sites WHERE slug='<slug>';"
   → If status='draft': site is not published; tell user to publish it
   → If status='published': rendering issue
2. Check Nginx logs: docker compose logs nginx | grep "<slug>"
3. Verify subdomain routing: curl -H "Host: <slug>.safahati.com" http://localhost:3000
4. Check if site sections exist: sqlite3 db "SELECT count(*) FROM sections WHERE site_id='<id>';"
   → If 0 sections: site seeding failed; re-create or manually seed

Common causes:
A. Site is in Draft mode (user hasn't published): direct user to publish
B. Nginx wildcard SSL certificate expired: check cert expiry; renew with certbot
C. Sections table empty: manual DB investigation needed
```

---

### 2.4 Database Operations

#### Runbook: DB-01 — Manual Backup and Restore
**Audience:** Support engineers, DBAs
**Content:**
```bash
# Manual backup
sqlite3 /opt/safahati/data/db.sqlite ".backup '/opt/safahati/backups/db-$(date +%Y%m%d-%H%M%S).sqlite'"

# Automated daily backup (cron job)
0 2 * * * sqlite3 /opt/safahati/data/db.sqlite ".backup '/opt/safahati/backups/db-$(date +\%Y\%m\%d).sqlite'"

# Restore from backup
cp /opt/safahati/data/db.sqlite /opt/safahati/data/db.sqlite.bak
cp /opt/safahati/backups/db-20260425.sqlite /opt/safahati/data/db.sqlite
docker compose restart app

# Verify restore
sqlite3 /opt/safahati/data/db.sqlite "SELECT count(*) FROM users; SELECT count(*) FROM sites;"
```

---

#### Runbook: DB-02 — Schema Migration
**Audience:** Backend engineers
**Content:**
```bash
# Check current migration status
npx drizzle-kit check

# Generate migration from schema changes
npx drizzle-kit generate

# Review generated SQL in drizzle/ folder before applying
cat drizzle/0001_<migration-name>.sql

# Apply migration
npx drizzle-kit migrate

# Verify migration applied
sqlite3 data/db.sqlite ".schema users"
sqlite3 data/db.sqlite ".schema sites"

# Rollback: SQLite does not support transactional DDL rollback
# Manual rollback requires restoring from backup + re-running migrations up to desired version
```

---

#### Runbook: DB-03 — Investigate Schema Drift
**Audience:** Backend engineers, support engineers
**Content:**
```bash
# Check actual DB columns vs Drizzle schema
sqlite3 data/db.sqlite ".schema users"
sqlite3 data/db.sqlite ".schema sites"
sqlite3 data/db.sqlite ".schema sections"

# If extra columns found (phone, country, etc.):
# Option A: Add to Drizzle schema (if these are needed features)
# Option B: Drop columns via migration (if not needed)
# Run drizzle-kit introspect to generate schema from actual DB:
npx drizzle-kit introspect

# Compare generated schema to src/lib/db/schema.ts
diff <generated> <current-schema>
```

---

### 2.5 Monitoring Runbooks

#### Runbook: MON-01 — Sentry Alert Response
**Audience:** Support engineers
**Content:**
- **New error alert:** Review error in Sentry; check if it matches a known bug in Bug Registry; if new, create bug ticket with Sentry link; assign to Backend Engineer
- **Error rate spike:** Check which route is failing; check if recent deployment correlates; escalate to on-call engineer
- **Performance degradation:** Check Sentry performance dashboard; identify slow routes; share with Backend Engineer

---

#### Runbook: MON-02 — UptimeRobot Downtime Alert
**Audience:** Support engineers, on-call engineer
**Content:**
- **App.safahati.com down:** Execute INC-01 playbook
- **Specific subdomain down:** Check Nginx routing; check if site is published; execute INC-04
- **API health check failing:** Check DB connectivity; check container health; execute INC-01
- **False positive (alert cleared in < 2 minutes):** Log it; if recurring, investigate flakiness
