# Application Support Engineer — Skills Profile
## Safahati Multi-Tenant Website Platform

---

## Role Summary

The Application Support Engineer for Safahati is responsible for the operational health of a multi-tenant SaaS platform built on Next.js 16, better-sqlite3, Drizzle ORM, and deployed on Hetzner VPS with Docker Compose + Nginx. The platform serves Arabic-first MENA/Saudi SMEs via subdomain routing with bilingual (Arabic RTL + English LTR) content. Support responsibilities span incident detection and response, user-facing support for Arabic and English speakers, database operations, deployment management, and building the infrastructure for ongoing observability.

---

## Core Technical Skills

### 1. Next.js Production Operations

- **Production deployment:** `next build` + `next start` in Docker containers; process management with PM2 or Docker restart policies
- **Environment variables:** Managing `AUTH_SECRET`, `DATABASE_URL`, `NEXTAUTH_URL`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY` across environments (dev, staging, production)
- **Log analysis:** Parsing Next.js server logs, identifying 4xx/5xx clusters, tracing request IDs
- **Build failure diagnosis:** Differentiating TypeScript errors, missing env vars, module resolution failures
- **Route analysis:** Understanding App Router conventions — RSC vs Client Component, route handlers, middleware, layout nesting
- **Cache debugging:** Understanding Next.js caching layers (Data Cache, Router Cache, Full Route Cache) and when to use `revalidatePath()`/`revalidateTag()`
- **Hot reload and deployment restart:** Zero-downtime deployment strategies with Docker Compose and Nginx upstream switching

### 2. SQLite / PostgreSQL Operations (Drizzle ORM)

- **SQLite production management:** WAL mode, backup strategy (`sqlite3 .backup`), monitoring DB file size growth
- **Drizzle ORM migrations:** Running `drizzle-kit generate` + `drizzle-kit migrate`, verifying migration success, rolling back failed migrations
- **Schema introspection:** Using `drizzle-kit introspect` to detect schema drift between code and actual DB
- **Query debugging:** Enabling Drizzle verbose logging; identifying slow queries; understanding SQLite's single-writer limitation
- **SQLite → PostgreSQL migration path:** Planning the transition when concurrent write load exceeds SQLite capacity; using Drizzle's multi-dialect support
- **Data integrity checks:** Verifying FK constraints, checking for orphaned sections after site deletes, validating JSON columns
- **Backup and restore:** Automated daily backups of `data/db.sqlite` to S3/MinIO; restore procedure testing

### 3. Incident Response

- **Incident classification:** Mapping symptoms to severity (P1–P4) using predefined runbooks
- **First response:** Acknowledging incidents, communicating status to users within SLA windows
- **Root cause analysis:** Reading Next.js server logs, SQLite error logs, Nginx access/error logs, Docker container health
- **Escalation procedures:** Knowing when to escalate to Backend Engineer (code fix needed) vs DevOps (infra issue) vs DBA (data issue)
- **Post-incident review:** Writing blameless post-mortems; updating runbooks based on lessons learned
- **On-call readiness:** Monitoring dashboards, alert configurations, out-of-hours escalation

### 4. Docker Compose and Infrastructure

- **Docker Compose operations:** `docker compose up/down/restart/logs`; inspecting container health; understanding service dependencies
- **Nginx management:** SSL certificate renewal (Certbot/Let's Encrypt), wildcard subdomain configuration, proxy pass to Next.js, rate limiting configuration
- **Hetzner VPS management:** SSH access, disk usage monitoring, memory/CPU monitoring, VPS resize procedures
- **MinIO operations:** Bucket management, access key rotation, storage quota monitoring
- **Redis management:** Cache flush procedures, monitoring memory usage, TTL inspection
- **SSL/TLS:** Wildcard certificate for `*.safahati.com` — renewal schedule, verification, Nginx reload

### 5. User Support for Bilingual SaaS

- **Arabic language support:** Ability to read and respond to support requests in Arabic; understanding Arabic-specific UX issues (RTL layout, Arabic font rendering, Arabic keyboard input)
- **English language support:** Professional written English for MENA/international users
- **Empathy-led support:** Understanding that target users are SME owners, not technically sophisticated; avoid jargon
- **Ticket triage:** Categorizing issues as user error, product bug, or configuration issue before escalating
- **Knowledge base authoring:** Writing clear how-to articles in English and Arabic
- **Feedback collection:** Structured collection of user pain points for Product team

### 6. Monitoring and Observability

- **Error tracking:** Setting up and operating Sentry (or self-hosted Glitchtip) for JavaScript/Next.js error capture
- **Application metrics:** Uptime monitoring with UptimeRobot or Checkly; response time trending
- **Log aggregation:** Centralized logging with Loki + Grafana or Logtail; structured log querying
- **Alert management:** Configuring PagerDuty/Opsgenie or Telegram/Discord webhook alerts for P1/P2 incidents
- **Dashboard creation:** Grafana dashboards for API error rates, DB query times, active user sessions
- **Health check endpoints:** Monitoring `/api/health` for DB connectivity, Redis, MinIO

### 7. Security Operations

- **Session management:** Understanding NextAuth.js v5 JWT lifecycle; handling stale session reports; clearing session tables
- **Rate limiting:** Configuring Nginx rate limits for auth endpoints; monitoring abuse patterns
- **Dependency vulnerability management:** Running `npm audit`; tracking CVEs in dependencies
- **Access log analysis:** Detecting unusual patterns — credential stuffing, scraping, IDOR probing

---

## Tools Proficiency Matrix

| Tool | Level | Usage |
|---|---|---|
| Docker Compose | Proficient | Daily operations, restart, log inspection |
| Nginx | Proficient | SSL, subdomain routing, rate limiting |
| SQLite / sqlite3 CLI | Proficient | DB inspection, backup, repair |
| Drizzle Kit | Working | Schema migrations, introspection |
| Sentry / Glitchtip | Working | Error tracking and alerting |
| Grafana + Loki | Working | Log aggregation and dashboards |
| UptimeRobot / Checkly | Working | Uptime monitoring |
| Hetzner Cloud | Working | VPS management, snapshots |
| MinIO | Basic | Object storage operations |
| Redis CLI | Basic | Cache inspection and flush |

---

## Operational Knowledge Requirements

- Safahati subdomain architecture: `client.safahati.com` → Nginx → Next.js → DB lookup by slug
- Authentication flow: email/password → bcrypt → NextAuth JWT → `session.user.id`
- Site creation flow: wizard → `POST /api/sites` → industry template seeding → sections table
- Editor save flow: Zustand `isDirty` → `PUT /api/sites/[siteId]/sections` → DB update
- The stale-session failure mode (BUG-001) and its mitigation
- Known TypeScript errors in demo hero templates (BUG-002) — these are non-production concerns
- Impact of SQLite WAL mode and single-writer constraint on concurrent usage

---

## Communication and Process Skills

- Incident communication: clear, non-technical status updates for Arabic and English users
- SLA management: tracking response and resolution times per tier
- Change management: communicating planned maintenance windows in advance
- User advocacy: translating user frustration into actionable product feedback
- Documentation: maintaining up-to-date runbooks, knowledge base, and incident logs
