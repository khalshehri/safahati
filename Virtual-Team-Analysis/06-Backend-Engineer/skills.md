# Backend Engineer — Skills Profile for Safahati

This document describes the specific technical skills required of the backend engineer role on the Safahati project. Skills are grounded in the actual codebase, stack, and architectural goals — not generic backend theory.

---

## 1. Next.js API Routes (App Router)

### What is used
- Route handlers in `src/app/api/**` using the App Router convention (`route.ts`)
- Async `Request`/`NextResponse` pattern (not the old `req`, `res` Pages Router pattern)
- Dynamic segments via `params: Promise<{ id: string }>` (Next.js 15/16 async params)
- `export const dynamic = "force-dynamic"` to opt out of static caching where needed

### Skills required
- Write type-safe route handlers with proper HTTP method exports (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`)
- Handle async params correctly (Next.js 15+ made params a Promise — must `await params`)
- Return structured `NextResponse.json()` responses with correct HTTP status codes
- Integrate `auth()` from NextAuth v5 inside API routes for session-based authorization
- Understand Next.js middleware execution order and route protection

### Current patterns in the codebase
```ts
// Correct pattern used in [siteId]/route.ts
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;  // must await
  const session = await auth();
  // ...
}
```

---

## 2. Drizzle ORM

### Version and adapter
- `drizzle-orm` v0.45 with `better-sqlite3` adapter (dev)
- Will migrate to `drizzle-orm/node-postgres` with `pg` or `postgres` adapter (prod)

### Skills required
- Define table schemas using `sqliteTable()` / `pgTable()` with typed columns
- Write type-safe queries: `.select()`, `.insert()`, `.update()`, `.delete()` with `.where()` clauses
- Use Drizzle operators: `eq()`, `and()`, `or()`, `inArray()`, `like()`, `desc()`, `asc()`
- Use `.get()` for single-row queries, `.all()` for multi-row, `.run()` for mutations
- Manage schema migrations with `drizzle-kit generate` and `drizzle-kit migrate`
- Understand schema inference types (`$inferSelect`, `$inferInsert`)
- Write relations and use Drizzle's relational query API for complex joins
- Migrate schema from SQLite dialect to PostgreSQL dialect (different column types, JSONB vs text)

### SQLite → PostgreSQL column mapping
| SQLite | PostgreSQL |
|---|---|
| `text("id").primaryKey()` | `text("id").primaryKey()` |
| `integer("created_at", { mode: "timestamp_ms" })` | `timestamp("created_at")` |
| `integer("is_visible", { mode: "boolean" })` | `boolean("is_visible")` |
| `text("config")` (JSON string) | `jsonb("config")` |
| `text("theme")` (JSON string) | `jsonb("theme")` |

---

## 3. Multi-Tenant Architecture

### The Safahati model
- One Next.js app, one database, many clients
- Each client = one row in `sites` table, identified by `slug` (subdomain)
- Subdomain routing: `client.safahati.com` → middleware extracts hostname → routes to site renderer
- All data is tenant-scoped by `user_id` (owner) and `site_id` (content)

### Skills required
- Design and enforce row-level tenant isolation (every query filters by `userId` or `siteId`)
- Implement subdomain extraction in Next.js middleware (`proxy.ts` in Next.js 16)
- Map hostname → site slug → DB lookup → render correct tenant site
- Prevent cross-tenant data leakage (always validate ownership before reads/writes)
- Design shared infrastructure that doesn't create tenant coupling (Redis keys namespaced by tenantId, S3 paths prefixed by tenantId, etc.)
- Plan for tenant-level rate limiting (per-subdomain, not just per-IP)
- Understand the "noisy neighbor" problem and mitigation strategies

### Ownership enforcement pattern (as used in codebase)
```ts
// Every site query must include userId check
const site = db.select().from(schema.sites)
  .where(and(
    eq(schema.sites.id, siteId),
    eq(schema.sites.userId, session.user.id)  // tenant isolation
  ))
  .get();
if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });
```

---

## 4. SQLite → PostgreSQL Migration

### Why this migration is necessary
- `better-sqlite3` is synchronous — blocks the Node.js event loop on heavy queries
- SQLite does not support true concurrent writes (WAL helps reads but not writes)
- PostgreSQL is required for: `JSONB` operators, row-level security, full-text search, `pgBouncer` connection pooling, horizontal read replicas
- Planned production infrastructure (Hetzner VPS) will run PostgreSQL 16 in Docker

### Skills required
- Translate Drizzle SQLite schema to `drizzle-orm/pg-core` (`pgTable`, `serial`, `uuid`, `jsonb`, `timestamp`, `boolean`)
- Rewrite all DB initialization and driver code from `better-sqlite3` to `postgres` or `pg` pool
- Change all `.run()` / `.get()` / `.all()` (sync SQLite API) to `await` (async PostgreSQL API)
- Write idempotent migration SQL for adding new columns (`ALTER TABLE IF NOT EXISTS`)
- Implement connection pooling with `pg` Pool or `pgBouncer` external proxy
- Write a data migration script to transfer existing SQLite data to PostgreSQL
- Set up `drizzle-kit` config for both drivers (dev SQLite, prod PostgreSQL)

---

## 5. Redis Caching Layer

### Planned use cases for Safahati
1. Site config cache: `site:{slug}` → full site + sections JSON, TTL 5 minutes
2. Session metadata cache (supplementary to JWT)
3. Rate limiting counters: `rl:{ip}:{route}` → sliding window count
4. OTP storage: `otp:{email}` → 6-digit code, TTL 10 minutes
5. Published site HTML fragment caching (for popular sites)

### Skills required
- Connect to Redis using `ioredis` or `@upstash/redis`
- Implement cache-aside pattern: check Redis → miss → DB query → write to Redis
- Set appropriate TTLs (short for mutable data, longer for published site configs)
- Implement cache invalidation on write (delete key on site update)
- Build rate limiter using Redis `INCR` + `EXPIRE` or the sliding window algorithm
- Namespace all keys by feature/tenant to avoid collisions
- Handle Redis connection failures gracefully (fallback to DB, never crash the request)

### Cache key conventions for Safahati
```
site:config:{slug}           → full site + sections, TTL 300s
site:config:{slug}:meta      → site metadata only, TTL 60s
user:session:{userId}:valid  → boolean, TTL 3600s
rl:api:{ip}:{minute}         → counter, TTL 120s
otp:{email}                  → hashed OTP, TTL 600s
```

---

## 6. JWT Authentication with NextAuth v5

### Current implementation
- NextAuth v5 beta (credentials provider + JWT strategy)
- JWT stored in httpOnly cookie
- `auth()` function used in both API routes and server components
- No token rotation, no refresh token, no server-side revocation currently

### Skills required
- Configure NextAuth v5 with `providers`, `callbacks`, `session`, and `jwt` config
- Extend the JWT payload to include custom claims (user ID, plan, etc.)
- Handle stale session scenarios: validate JWT user ID against DB before FK inserts
- Implement JWT token rotation (refresh before expiry)
- Build server-side session revocation using Redis blacklist
- Secure cookies: `httpOnly`, `secure`, `sameSite=lax`, proper `domain` for subdomains
- Understand NextAuth v5's `auth()` vs `getServerSession()` differences

---

## 7. Input Validation with Zod

### Current gap
- No Zod schemas exist on any API route input — all parsing is manual or absent
- `package.json` includes `zod: ^4.3.6` but it is not used in any API route

### Skills required
- Define Zod schemas for every API request body and query param
- Use `schema.parse()` in API routes and return 400 with validation errors
- Define shared schemas in `src/lib/validations/` and import them in both API routes and client-side forms
- Use `.safeParse()` for non-throwing validation in edge contexts
- Leverage Zod's `.transform()` and `.default()` for data normalization

### Example pattern to implement
```ts
// src/lib/validations/sites.ts
import { z } from "zod";

export const CreateSiteSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  industry: z.enum(["company", "agency", "freelancer", "restaurant", /* ... */]),
  language: z.enum(["en", "ar"]).default("en"),
});

// In route handler:
const parsed = CreateSiteSchema.safeParse(await request.json());
if (!parsed.success) {
  return NextResponse.json(
    { error: "Validation failed", details: parsed.error.flatten() },
    { status: 400 }
  );
}
```

---

## 8. Security Fundamentals

### Skills required for this project
- Rate limiting: IP-based sliding window with Redis, per-route limits
- CSRF protection: SameSite cookie + custom header check (`X-Requested-With`) for mutation endpoints
- SQL injection prevention: always use Drizzle parameterized queries, never string interpolation
- Path traversal prevention: sanitize upload filenames (already partially done in upload route)
- Authentication on upload endpoint: currently `/api/upload` has no auth check
- Secure file storage: move from local `public/uploads` to MinIO with signed URLs
- Input length limits: enforce max lengths on all text fields to prevent resource exhaustion

---

## 9. File Storage (MinIO / S3)

### Current state
- Uploads go to `public/uploads/` on the local filesystem (not suitable for multi-server)
- No authentication on the upload endpoint
- No virus scanning, no CDN delivery

### Skills required
- Integrate `@aws-sdk/client-s3` with MinIO endpoint configuration
- Generate pre-signed upload URLs (client uploads directly, server never touches file bytes)
- Generate pre-signed download/read URLs with short TTL for private assets
- Structure bucket paths by tenant: `uploads/{userId}/{siteId}/{hash}.{ext}`
- Integrate MinIO with Docker Compose for local development

---

## 10. DevOps & Infrastructure

### Safahati production stack
- Hetzner VPS (CX21 or CX31 to start)
- Docker Compose: Next.js, PostgreSQL 16, Redis 7, MinIO, Nginx
- Cloudflare DNS with wildcard CNAME (`*.safahati.com → vps-ip`)
- Nginx with wildcard SSL (Let's Encrypt via `certbot` or Cloudflare origin cert)

### Skills required
- Write and maintain `docker-compose.yml` for full local dev environment
- Configure Nginx as reverse proxy with wildcard subdomain support
- Manage environment variables securely (Docker secrets or `.env` files outside image)
- Set up database backups (pg_dump + cron + MinIO/S3 upload)
- Monitor application health (basic: Docker healthchecks; advanced: Prometheus + Grafana)
- Zero-downtime deploys with Docker (rolling update or blue-green)
