# Backend Analysis — Safahati

**Prepared by:** Backend Engineer  
**Date:** April 2026  
**Codebase reviewed:** `src/app/api/`, `src/lib/db/`, `src/auth.ts`, `src/middleware.ts`

---

## 1. Architecture Overview

Safahati is a multi-tenant, config-driven website platform built on Next.js 16 (App Router). The backend consists of Next.js API route handlers, a Drizzle ORM data layer, and NextAuth v5 for authentication. The system serves multiple clients from a single deployment, identifying tenants by slug.

### Request flow (current)
```
Browser → Next.js → API Route → Drizzle → SQLite (better-sqlite3) → Response
```

### Tenant site rendering flow (current)
```
Browser (safahati.com/sites/{slug}) → Next.js SSR → DB query → SiteRenderer
```

### Planned production flow
```
Browser (client.safahati.com) → Cloudflare → Nginx → Next.js → Drizzle → PostgreSQL
                                                                      ↓
                                                                 Redis Cache
```

---

## 2. What Is Working Well

### 2.1 Ownership enforcement
Every query against `sites` and `sections` tables uses a two-condition WHERE clause that includes both the resource ID and the session user's ID. This prevents cross-tenant data leakage at the query level.

```ts
// Pattern used consistently across GET/PUT/DELETE in [siteId]/route.ts
.where(and(eq(schema.sites.id, siteId), eq(schema.sites.userId, session.user.id)))
```

### 2.2 Stale session fix
The POST `/api/sites` route now validates that the session's user ID actually exists in the DB before attempting FK inserts. This correctly handles the case where a JWT is valid but references a deleted/reset user.

```ts
const user = db.select().from(schema.users).where(eq(schema.users.id, session.user.id)).get();
if (!user) {
  return NextResponse.json({ error: "Session expired — please log out and log back in" }, { status: 401 });
}
```

### 2.3 Cascade deletes
The `sections` table has `onDelete: "cascade"` referencing `sites.id`. Deleting a site automatically removes all its sections, preventing orphaned rows.

### 2.4 WAL mode enabled
The SQLite connection enables WAL journal mode and foreign key enforcement at connection time:
```ts
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
```

### 2.5 Slug uniqueness with collision handling
The site creation endpoint generates a unique slug by appending an incrementing counter if the base slug is already taken, rather than returning an error.

### 2.6 File type allowlist on upload
The upload endpoint checks MIME type against an explicit allowlist (`image/jpeg`, `image/png`, `image/webp`, etc.) and enforces a 5MB maximum.

---

## 3. Identified Issues

### 3.1 Schema Drift (Critical)

**What it is:** The Drizzle schema in `src/lib/db/schema.ts` is out of sync with the actual SQLite database columns. The DB has columns that do not exist in the schema definition.

**Missing from Drizzle schema:**
| Table | Missing Column | Type | Notes |
|---|---|---|---|
| `users` | `phone` | text | nullable |
| `users` | `country` | text | nullable |
| `users` | `phone_verified` | integer | NOT NULL DEFAULT 0 |
| `sites` | `business_type` | text | nullable |
| `sites` | `description` | text | nullable |
| `sites` | `whatsapp` | text | nullable |
| `sites` | `city` | text | nullable |
| `sites` | `keyword_tags` | text | nullable (JSON array) |
| `sites` | `theme_id` | text | nullable |
| `sites` | `ai_generated` | integer | NOT NULL DEFAULT 0 |

**Impact:**
- Drizzle does not know these columns exist; they cannot be read or written via ORM
- Future `drizzle-kit generate` will produce migrations that drop these columns
- Any query that returns `select *` via Drizzle will silently omit these fields
- The frontend cannot receive `phone_verified`, `business_type`, or `ai_generated` from the API

**Fix required:** Add all missing columns to `schema.ts` immediately. See `02-Database-Optimization.md` for the corrected schema.

---

### 3.2 No Input Validation / Zod (High)

**All API routes parse request bodies with raw destructuring and no validation:**

```ts
// Current pattern in POST /api/sites
const { name, industry, language } = await request.json();
if (!name || !industry) {
  return NextResponse.json({ error: "Name and industry are required" }, { status: 400 });
}
```

**Issues:**
- No type enforcement: `name` could be a number, object, or null (truthy check passes for `name = {}`)
- No length limits: a 10,000-character site name could be inserted
- No email format validation in registration (`email` is stored as-is)
- No password strength enforcement beyond `length >= 6`
- `status` in PUT `/api/sites/[siteId]` accepts any string — `"deleted"` or `"hacked"` are valid inputs
- `sortOrder` in sections PUT is not validated as a positive integer
- The `industry` check in POST `/api/sites` relies on `getIndustryTemplate()` returning null for unknown values — not a proper enum validation

**Affected routes:**
- `POST /api/auth/register` — email, name, password
- `POST /api/sites` — name, industry, language
- `PUT /api/sites/[siteId]` — name, language, status, theme
- `PUT /api/sites/[siteId]/sections` — entire sections array with nested objects
- `POST /api/upload` — file metadata (authenticated? no — see below)

---

### 3.3 No Authentication on Upload Endpoint (Critical Security)

**`POST /api/upload` has zero authentication.** Any anonymous request can upload files to the server.

```ts
// upload/route.ts — no auth() call anywhere
export async function POST(request: NextRequest) {
  // Directly processes file — no session check
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
```

**Impact:**
- Any bot can fill up the server's disk with arbitrary images
- Even though MIME is checked, multi-part form boundaries can be spoofed
- Files stored in `public/uploads/` are served statically to the internet with no access control

---

### 3.4 No Rate Limiting (High)

**No rate limiting exists on any endpoint.** Vulnerable routes:

| Route | Attack Vector |
|---|---|
| `POST /api/auth/register` | Account creation flood, email enumeration |
| `POST /api/auth/[...nextauth]` (signin) | Brute-force password attacks |
| `POST /api/sites` | Resource exhaustion (create thousands of sites) |
| `PUT /api/sites/[siteId]/sections` | Large payload flooding |
| `POST /api/upload` | Disk exhaustion (see §3.3) |

**Current mitigations:** None.

---

### 3.5 No CSRF Protection (Medium)

NextAuth v5 sets session cookies with `SameSite=lax` by default, which provides partial CSRF protection for top-level navigations. However, same-origin subdomains on `safahati.com` (i.e., `client1.safahati.com`) could potentially bypass `SameSite=lax` restrictions depending on browser interpretation and cookie domain configuration.

Once subdomain routing is live, a malicious client site at `evil.safahati.com` served by the same app could make credentialed requests to `app.safahati.com/api/sites` if the session cookie is scoped to `.safahati.com`.

**Fix:** Scope session cookies to `app.safahati.com` specifically (not `.safahati.com`), or add custom header validation (`X-Requested-With: XMLHttpRequest`) on all mutation endpoints.

---

### 3.6 SQLite in Production (High — Scalability)

**`better-sqlite3` is a synchronous, single-writer embedded database.** In a multi-tenant SaaS:
- All DB calls block the Node.js event loop (no async I/O — synchronous by design)
- Write concurrency is limited to a single writer at a time (WAL improves reads but not writes)
- Cannot share the database file across multiple Node.js processes or containers
- No connection pooling — the DB is a single file handle
- No horizontal scaling — you cannot spin up a second server that shares the same SQLite DB

**Impact on current scale:** SQLite is adequate for early MVP testing with <100 users. It becomes a bottleneck at:
- ~500+ concurrent users hitting API routes
- Any multi-server deployment (Docker Swarm, multiple VPS)
- Any use of background workers or job queues

---

### 3.7 Synchronous DB Calls Blocking Event Loop (Medium)

All Drizzle queries in the codebase use the synchronous `better-sqlite3` API (`.get()`, `.all()`, `.run()`). While this is technically correct for better-sqlite3, it means:
- A slow query blocks all other pending requests on that Node.js worker thread
- Under load, a single slow query cascades into request queue buildup

**Note:** This issue resolves automatically upon migrating to PostgreSQL + async Drizzle queries.

---

### 3.8 Sections Update is Non-Transactional (High)

The `PUT /api/sites/[siteId]/sections` endpoint deletes all sections then re-inserts them. This is not wrapped in a transaction:

```ts
// Non-transactional: if insert loop fails mid-way, data is partially lost
db.delete(schema.sections).where(eq(schema.sections.siteId, siteId)).run();
for (const section of sections) {
  db.insert(schema.sections).values({...}).run();
}
```

**Impact:** If the server crashes, throws, or the client disconnects mid-loop, the site is left with zero sections (blank website). SQLite does support transactions natively and `better-sqlite3` provides `db.transaction()` — this should be used immediately.

**Fix:**
```ts
const updateSections = db.transaction(() => {
  db.delete(schema.sections).where(eq(schema.sections.siteId, siteId)).run();
  for (const section of sections) {
    db.insert(schema.sections).values({...}).run();
  }
});
updateSections();
```

---

### 3.9 middleware.ts Deprecation (Low — Maintenance)

Next.js 16 renamed `middleware.ts` to `proxy.ts`. The current file at `src/middleware.ts` still uses the old naming. This generates a deprecation warning on startup and will break in a future Next.js release.

**Current file content:**
```ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
export default NextAuth(authConfig).auth;
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
```

**Fix:** Rename to `src/proxy.ts` and update any imports.

---

### 3.10 No Subdomain Routing (High — Feature Gap)

The platform's primary value proposition (each client gets `client.safahati.com`) is not implemented. Currently, sites are accessed at `safahati.com/sites/{slug}` — a path-based URL, not subdomain-based.

**What is missing:**
- Nginx wildcard SSL termination for `*.safahati.com`
- `proxy.ts` middleware that extracts the subdomain from the `Host` header
- Logic to map `{slug}.safahati.com` → DB lookup by slug → site renderer
- Custom domain support (CNAME `client-domain.com` → `safahati.com`)

---

### 3.11 Local Filesystem Upload Storage (Medium)

Uploads are saved to `public/uploads/` on the local filesystem:
- Files are publicly accessible at `/uploads/filename` with no access control
- In a multi-server deployment, each server has its own filesystem — uploads from server A are invisible to server B
- No CDN delivery — large images are served directly from the Node.js process
- No cleanup — deleted sites leave orphaned files on disk

---

### 3.12 Missing Error Boundaries in GET /api/sites (Low)

The `GET /api/sites` handler has no try/catch:

```ts
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) { ... }
  const sites = db.select().from(schema.sites).where(...).all();
  return NextResponse.json({ sites });
}
```

If the DB is unavailable or the query throws, Next.js returns an unformatted 500 with a stack trace. All GET handlers should have a try/catch.

---

## 4. Security Vulnerability Summary

| # | Vulnerability | Severity | Status |
|---|---|---|---|
| 1 | No auth on `/api/upload` | Critical | Open |
| 2 | No rate limiting on any endpoint | High | Open |
| 3 | No input validation (Zod) | High | Open |
| 4 | Sections update non-transactional | High | Open |
| 5 | Schema drift → silent data loss | High | Open |
| 6 | CSRF risk across subdomains (future) | Medium | Open (pre-prod) |
| 7 | Files in public/ with no ACL | Medium | Open |
| 8 | No HTTPS enforcement in API layer | Medium | Open (Nginx handles) |
| 9 | Stale JWT not revocable | Low | Accepted (JWT pattern) |
| 10 | middleware.ts deprecation | Low | Open |

---

## 5. Scalability Concerns

| Concern | Current State | Threshold | Fix |
|---|---|---|---|
| SQLite single-writer | Synchronous, 1 writer | ~100 users | Migrate to PostgreSQL |
| No caching layer | Every request hits DB | ~500 req/s | Redis + cache-aside |
| Local file storage | Non-replicable | Multi-server | MinIO S3 |
| No CDN | Direct server delivery | ~1000 users | Cloudflare caching |
| No background jobs | Synchronous AI generation | >3s operations | Queue (BullMQ/Redis) |
| No read replicas | All reads hit primary | ~10k sites | PG read replica |

---

## 6. Code Quality Assessment

| Area | Grade | Notes |
|---|---|---|
| Auth integration | B+ | Consistent, missing stale session handling in GET routes |
| Ownership checks | A | All mutation routes check ownership correctly |
| Error handling | C | Inconsistent — some routes have try/catch, others don't |
| Input validation | D | Only basic presence checks, no Zod, no type enforcement |
| Transactions | D | Sections replace is non-transactional |
| Logging | C | `console.error` with prefix — no structured logging |
| TypeScript types | B | Good Drizzle inference usage, some `unknown` casts |
| Code organization | B | Clean route file structure, but validation logic mixed in |

---

## 7. Recommended Fix Priority

### Immediate (before any production traffic)
1. Fix sections update to use a DB transaction
2. Add authentication to `/api/upload`
3. Add Zod validation to all API route inputs
4. Sync Drizzle schema with actual DB columns

### Short-term (before public launch)
5. Add rate limiting (Redis-based or IP-based middleware)
6. Implement Redis caching for site configs
7. Rename `middleware.ts` → `proxy.ts`
8. Migrate from SQLite to PostgreSQL

### Medium-term (first month post-launch)
9. Implement subdomain routing
10. Migrate file storage to MinIO
11. Add structured logging
12. Add audit log table for destructive operations
