# Scalability Plan — Safahati

**Prepared by:** Backend Engineer  
**Date:** April 2026  
**Scope:** SQLite → PostgreSQL migration, Redis caching, subdomain routing, CDN, horizontal scaling, MENA-specific considerations

---

## 1. Current State vs Target State

| Capability | Current | Target (6 months) | Target (18 months) |
|---|---|---|---|
| Database | SQLite (single file) | PostgreSQL 16 + pgBouncer | PG primary + 1 read replica |
| Caching | None | Redis 7 (single node) | Redis Cluster (3 nodes) |
| File storage | Local filesystem | MinIO (single node) | MinIO distributed / Cloudflare R2 |
| Routing | Path-based `/sites/{slug}` | Subdomain `{slug}.safahati.com` | Custom domains `client.com` |
| CDN | None | Cloudflare Free (DNS proxy) | Cloudflare Pro (full page caching) |
| Server | Single process | Single VPS (Hetzner CX31) | 2× VPS behind load balancer |
| Deployment | Manual `git pull` | Docker Compose + GitHub Actions | Kubernetes (if needed at scale) |
| Concurrency | ~50 req/s (SQLite bottleneck) | ~500 req/s | ~5,000 req/s |

---

## 2. SQLite → PostgreSQL Migration

### 2.1 Why this is the most urgent scalability step

SQLite's `better-sqlite3` is synchronous — every DB call blocks the Node.js event loop. At >100 concurrent users, this becomes a significant bottleneck. PostgreSQL with async queries via `pg` pool resolves this entirely.

### 2.2 Migration execution plan

The migration must be done with zero data loss and minimal downtime (< 5 minutes).

**Phase 1: Schema preparation (Week 1)**
1. Fix schema drift — add all missing columns to `schema.ts` (see `02-Database-Optimization.md`)
2. Create `schema.pg.ts` with full PostgreSQL schema definition
3. Write `scripts/migrate-sqlite-to-pg.ts` data migration script
4. Set up PostgreSQL 16 container in Docker Compose
5. Test migration script against a copy of production SQLite file

**Phase 2: Parallel run (Week 2)**
1. Update `src/lib/db/index.ts` to conditionally use PostgreSQL when `DATABASE_URL` is set
2. Deploy with both adapters available (SQLite for dev, PG for staging/prod)
3. Run all API route tests against PostgreSQL
4. Change all `.get()` / `.all()` / `.run()` calls to async `await` equivalents

**Phase 3: Cutover (Week 3)**
1. Take a final SQLite snapshot
2. Run migration script to populate PostgreSQL
3. Deploy new build pointing to PostgreSQL
4. Verify all routes work via smoke tests
5. Keep SQLite snapshot for 2 weeks as fallback

### 2.3 Async query rewrite

Every Drizzle query must change from synchronous to async:

```ts
// BEFORE (SQLite — synchronous)
const sites = db.select().from(schema.sites)
  .where(eq(schema.sites.userId, session.user.id))
  .all();

// AFTER (PostgreSQL — async)
const sites = await db.select().from(schema.sites)
  .where(eq(schema.sites.userId, session.user.id));
```

```ts
// BEFORE (single row)
const site = db.select().from(schema.sites)
  .where(eq(schema.sites.id, siteId))
  .get();

// AFTER
const [site] = await db.select().from(schema.sites)
  .where(eq(schema.sites.id, siteId))
  .limit(1);
```

```ts
// BEFORE (insert)
db.insert(schema.sites).values({...}).run();

// AFTER
await db.insert(schema.sites).values({...});
```

### 2.4 Transaction rewrite

```ts
// BEFORE (better-sqlite3 synchronous transaction)
const updateSections = db.transaction(() => {
  db.delete(schema.sections).where(eq(schema.sections.siteId, siteId)).run();
  for (const s of sections) {
    db.insert(schema.sections).values({...}).run();
  }
});
updateSections();

// AFTER (Drizzle PostgreSQL transaction)
await db.transaction(async (tx) => {
  await tx.delete(schema.sections).where(eq(schema.sections.siteId, siteId));
  for (const s of sections) {
    await tx.insert(schema.sections).values({...});
  }
});
```

---

## 3. Redis Caching Layer

### 3.1 What to cache

| Cache Key Pattern | Content | TTL | Invalidation Trigger |
|---|---|---|---|
| `site:config:{slug}` | Full site + sections JSON | 300s | Site update, section update, publish |
| `site:meta:{slug}` | Site status + language only | 60s | Site update |
| `user:sites:{userId}` | List of user's sites (no sections) | 120s | Site create, delete |
| `user:valid:{userId}` | Boolean — user exists in DB | 3600s | User deletion |
| `rl:register:{ip}` | Rate limit counter | 3600s | Sliding window expire |
| `rl:signin:{ip}` | Rate limit counter | 900s | Sliding window expire |
| `rl:api:{userId}:{route}:{minute}` | Rate limit counter | 120s | Auto-expire |
| `otp:{email}` | Hashed OTP | 600s | Verification success |

### 3.2 Cache-aside pattern implementation

```ts
// src/lib/cache/site-cache.ts
import { Redis } from "ioredis";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  lazyConnect: true,
  maxRetriesPerRequest: 1,  // fail fast if Redis is down
});

interface SiteConfigCache {
  site: typeof schema.sites.$inferSelect;
  sections: (typeof schema.sections.$inferSelect)[];
}

export async function getSiteConfig(slug: string): Promise<SiteConfigCache | null> {
  const key = `site:config:${slug}`;

  // Try cache first
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    // Redis unavailable — fallback to DB silently
    console.warn("[cache] Redis unavailable, falling back to DB:", err);
  }

  // Cache miss — query DB
  const [site] = await db.select().from(schema.sites)
    .where(eq(schema.sites.slug, slug))
    .limit(1);

  if (!site || site.status !== "published") return null;

  const sections = await db.select().from(schema.sections)
    .where(eq(schema.sections.siteId, site.id))
    .orderBy(schema.sections.sortOrder);

  const data: SiteConfigCache = { site, sections };

  // Write to cache
  try {
    await redis.set(key, JSON.stringify(data), "EX", 300);
  } catch {
    // Non-fatal — continue without caching
  }

  return data;
}

export async function invalidateSiteCache(slug: string): Promise<void> {
  try {
    await redis.del(`site:config:${slug}`, `site:meta:${slug}`);
  } catch {
    // Non-fatal
  }
}
```

### 3.3 Integration in site publish flow

```ts
// In POST /api/sites/[siteId]/publish
await db.update(schema.sites).set({ status: "published", updatedAt: new Date() })
  .where(eq(schema.sites.id, siteId));

// Invalidate so next request gets fresh data
await invalidateSiteCache(site.slug);
```

### 3.4 Integration in sections update

```ts
// In PUT /api/sites/[siteId]/sections (after saving)
await invalidateSiteCache(site.slug);
```

### 3.5 Redis Docker Compose config

```yaml
services:
  redis:
    image: redis:7-alpine
    command: >
      redis-server
      --maxmemory 256mb
      --maxmemory-policy allkeys-lru
      --save 60 100
      --appendonly yes
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3
    restart: unless-stopped

volumes:
  redis_data:
```

### 3.6 Redis connection config

```ts
// src/lib/redis.ts
import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,  // don't queue commands when disconnected
      retryStrategy: (times) => {
        if (times > 3) return null;  // stop retrying
        return Math.min(times * 200, 1000);
      },
    });

    redis.on("error", (err) => {
      console.error("[redis] Connection error:", err.message);
    });
  }
  return redis;
}
```

---

## 4. Subdomain Routing Implementation

### 4.1 Architecture

```
User visits: my-restaurant.safahati.com
    ↓
Cloudflare DNS: *.safahati.com CNAME → safahati-vps.hetzner.com
    ↓
Nginx: wildcard SSL termination, proxy_pass to Next.js :3000
    ↓
Next.js proxy.ts: extract hostname → derive slug → set header X-Site-Slug
    ↓
Next.js page router: reads X-Site-Slug header → renders correct tenant site
```

### 4.2 Next.js proxy.ts (renamed from middleware.ts)

```ts
// src/proxy.ts  (Next.js 16 — renamed from middleware.ts)
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "app.safahati.com";
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "safahati.com";

export default async function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  const host = request.headers.get("host") || hostname;

  // ── App subdomain (app.safahati.com) → dashboard auth protection ──
  if (host === APP_DOMAIN || host.startsWith("localhost")) {
    const session = await auth();
    const isProtected = pathname.startsWith("/dashboard");
    const isAuth = pathname.startsWith("/login") || pathname.startsWith("/register");

    if (isProtected && !session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuth && session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // ── Tenant subdomain ({slug}.safahati.com) → site renderer ──
  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    const slug = host.replace(`.${ROOT_DOMAIN}`, "");

    // Skip static assets and API routes
    if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
      return NextResponse.next();
    }

    // Rewrite to the tenant site page, passing slug via header
    const url = request.nextUrl.clone();
    url.pathname = `/sites/${slug}${pathname === "/" ? "" : pathname}`;

    const response = NextResponse.rewrite(url);
    response.headers.set("X-Site-Slug", slug);
    return response;
  }

  // ── Custom domains → look up by domain in DB / Redis ──
  // (Phase 2 feature — after custom domain table is implemented)
  // const siteSlug = await lookupCustomDomain(host);
  // if (siteSlug) { ... rewrite to /sites/{siteSlug} }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

### 4.3 Site renderer reading the slug

The site renderer at `/sites/[slug]/page.tsx` already uses `params.slug`. When the proxy rewrites `my-restaurant.safahati.com/` to `/sites/my-restaurant`, the `[slug]` dynamic segment receives the correct value — no changes needed there.

### 4.4 Nginx configuration for wildcard subdomain

```nginx
# /etc/nginx/sites-available/safahati.conf

# Wildcard SSL certificate covers *.safahati.com and safahati.com
ssl_certificate     /etc/letsencrypt/live/safahati.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/safahati.com/privkey.pem;

# Main app: app.safahati.com
server {
  listen 443 ssl http2;
  server_name app.safahati.com;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
  }
}

# Tenant subdomains: *.safahati.com
server {
  listen 443 ssl http2;
  server_name ~^(?<slug>[^.]+)\.safahati\.com$;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}

# Redirect HTTP to HTTPS
server {
  listen 80;
  server_name safahati.com *.safahati.com;
  return 301 https://$host$request_uri;
}
```

### 4.5 Cloudflare DNS configuration

```
Type    Name           Content                  Proxy status
A       safahati.com   YOUR_VPS_IP              Proxied
CNAME   app            safahati.com             Proxied
CNAME   *              safahati.com             Proxied  ← wildcard
```

The wildcard CNAME `*` routes all `{slug}.safahati.com` requests through Cloudflare to the VPS.

### 4.6 Wildcard SSL with Let's Encrypt

Wildcard certificates require DNS challenge validation (HTTP challenge cannot prove `*.domain.com`):

```bash
# Install certbot with Cloudflare DNS plugin
apt install certbot python3-certbot-dns-cloudflare

# Create Cloudflare API token with Zone:DNS:Edit permission
echo "dns_cloudflare_api_token = YOUR_CF_TOKEN" > /etc/letsencrypt/cloudflare.ini
chmod 600 /etc/letsencrypt/cloudflare.ini

# Issue wildcard certificate
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini \
  -d safahati.com \
  -d "*.safahati.com" \
  --email admin@safahati.com \
  --agree-tos

# Auto-renew (add to crontab)
0 0 1 * * certbot renew --quiet && nginx -s reload
```

---

## 5. CDN Strategy

### 5.1 Cloudflare (current — free tier)

Cloudflare free tier provides:
- DDoS protection (unmetered)
- DNS with Anycast routing — fast DNS resolution from MENA datacenters
- SSL termination at Cloudflare edge
- Basic caching for static assets (JS, CSS, images)

**Configuration for static assets:**
```
# Cloudflare Page Rule
URL pattern: *safahati.com/_next/static/*
Cache Level: Cache Everything
Edge Cache TTL: 1 month
Browser Cache TTL: 7 days
```

### 5.2 Cloudflare Pro (recommended at ~1000 MAU)

Pro tier adds:
- Full site caching with cache rules (not just static assets)
- Cache published tenant sites by hostname pattern: `*.safahati.com`
- APO (Automatic Platform Optimization) for Next.js — caches SSR output at edge
- Image optimization via Cloudflare Images
- Analytics with real user metrics (Core Web Vitals per site)

**Cache rule for published sites:**
```
If: hostname matches *.safahati.com AND path does not start with /api
Then: Cache everything, Edge TTL = 5 minutes
```

The combination of Cloudflare edge caching + Redis app-level caching means a popular site can serve thousands of requests per second without hitting PostgreSQL.

### 5.3 Image CDN

Currently images are served from `public/uploads/` on the VPS. Once MinIO is integrated:
- Store images in MinIO → expose via Cloudflare R2 CDN (or MinIO behind Nginx with `Cache-Control: max-age=31536000`)
- Use Next.js `<Image>` component with `remotePatterns` configured for the CDN domain
- Client-uploaded images get a content-addressed path: `/{userId}/{siteId}/{sha256}.{ext}` — immutable, cache forever

---

## 6. Horizontal Scaling Plan

### 6.1 Single VPS (current target — 0–1,000 MAU)

**Recommended VPS: Hetzner CX31**
- 2 vCPU, 8GB RAM, 80GB NVMe
- ~€10/month

**Docker Compose stack:**
```
Next.js app    → port 3000
PostgreSQL 16  → internal only
pgBouncer      → port 5432 (proxies to PG)
Redis 7        → port 6379 (internal only)
MinIO          → port 9000 (internal) + 9001 (console)
Nginx          → port 80/443 (public)
```

**Capacity:** ~500 concurrent users, ~2,000 tenant sites

### 6.2 Two-server setup (1,000–10,000 MAU)

Split stateless app from stateful data services:

```
Server A (CX31 — App):       Next.js, Nginx
Server B (CX41 — Data):      PostgreSQL, Redis, MinIO
```

- Configure Next.js on Server A to connect to Server B for DB/Redis
- Both servers behind Hetzner's free load balancer (or Nginx on Server A)
- MinIO on Server B accessible from Server A via internal Hetzner network (free bandwidth)

**Next.js can run multiple instances** once the DB and Redis are external (no shared local state):

```yaml
# docker-compose.app.yml (Server A)
services:
  app:
    image: ghcr.io/khalshehri/safahati:latest
    deploy:
      replicas: 2  # 2 Node.js processes
    environment:
      DATABASE_URL: postgresql://...@SERVER_B_IP:5432/safahati
      REDIS_URL: redis://SERVER_B_IP:6379
```

### 6.3 Read replica for dashboard analytics (5,000+ MAU)

Heavy analytics queries (site views, user stats) should not hit the primary PostgreSQL:

```sql
-- On primary: enable replication
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET max_wal_senders = 3;
```

```ts
// src/lib/db/index.ts — separate read/write pools
const writePool = new Pool({ connectionString: process.env.PG_PRIMARY_URL });
const readPool = new Pool({ connectionString: process.env.PG_REPLICA_URL });

export const db = drizzle(writePool, { schema });      // for mutations
export const readDb = drizzle(readPool, { schema });   // for analytics queries
```

### 6.4 Background job processing

Slow operations (AI site generation, email sending, image processing) must not block API routes. Use BullMQ with Redis:

```bash
npm install bullmq
```

```ts
// src/lib/queues/ai-generation.ts
import { Queue, Worker } from "bullmq";
import { getRedis } from "@/lib/redis";

export const aiQueue = new Queue("ai-generation", {
  connection: getRedis(),
  defaultJobOptions: { attempts: 3, backoff: { type: "exponential", delay: 1000 } },
});

// Worker runs in a separate process or as a background service
const worker = new Worker("ai-generation", async (job) => {
  const { siteId, prompt, language } = job.data;
  // ... call Claude API, update DB, invalidate cache
}, { connection: getRedis() });
```

API route enqueues job instead of running synchronously:
```ts
// POST /api/ai/generate-site
const job = await aiQueue.add("generate", { siteId, prompt, language, userId });
return NextResponse.json({ jobId: job.id, status: "queued" }, { status: 202 });
```

---

## 7. MENA-Specific Considerations

### 7.1 Data residency

Saudi Arabia and the GCC increasingly require that customer data be stored within the region. Hetzner does not have a MENA data center.

**Options:**
| Provider | Location | Notes |
|---|---|---|
| Hetzner | EU (Nuremberg, Helsinki, Falkenstein) | Cheapest — fine for early MVP |
| OVHcloud | Bahrain (coming) | Mid-range — good for GCC compliance |
| AWS Bahrain | `me-south-1` | Enterprise-grade but expensive |
| Azure UAE North | Dubai | Microsoft enterprise, good for Saudi gov |

**Recommendation:** Launch on Hetzner EU for cost efficiency. Evaluate data residency requirements when approaching enterprise/government customers or when Saudi PDPL enforcement tightens.

### 7.2 Cloudflare data center proximity

Cloudflare has data centers in:
- Riyadh, Saudi Arabia
- Dubai, UAE
- Cairo, Egypt

With Cloudflare proxying all requests, Saudi users receive content from the Riyadh PoP regardless of where the VPS is located. This provides low-latency delivery (DNS resolution, TLS handshake, cached responses) without requiring a MENA VPS.

### 7.3 RTL performance

The Arabic RTL version of each site uses the same components as LTR. At scale:
- Consider caching RTL and LTR versions separately: `site:config:{slug}:ar` and `site:config:{slug}:en`
- Or cache language-agnostic data and resolve language in the renderer

### 7.4 Arabic full-text search

PostgreSQL's built-in `tsvector` supports Arabic text (configured with `arabic` dictionary). For advanced Arabic search (stemming, morphological analysis):

```sql
-- Using pg_trgm for fuzzy matching across Arabic/English
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX sites_name_trgm_idx ON sites USING GIN (name gin_trgm_ops);

-- Query: fuzzy site name search
SELECT id, name FROM sites
WHERE name % 'مطعم'   -- similarity match
ORDER BY similarity(name, 'مطعم') DESC
LIMIT 10;
```

### 7.5 WhatsApp integration

WhatsApp is the primary customer communication channel in MENA. Every site config includes a `whatsapp` field. At scale:
- Track WhatsApp button clicks as analytics events
- Consider integrating WhatsApp Business API for template-based messaging from the platform

### 7.6 Saudi VAT compliance

When billing Saudi customers (Stripe + Saudi AR), VAT must be applied at 15% and included in invoices. Stripe Tax supports Saudi Arabia — enable it in the Stripe dashboard and configure the `automatic_tax` option on Checkout sessions.

---

## 8. Deployment Pipeline

### 8.1 Docker Compose production config

```yaml
# docker-compose.prod.yml
version: "3.9"
services:
  app:
    image: ghcr.io/khalshehri/safahati:${IMAGE_TAG}
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: redis://redis:6379
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: https://app.safahati.com
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: safahati
      POSTGRES_USER: safahati
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U safahati"]
      interval: 10s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --maxmemory 128mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data

  minio:
    image: minio/minio:latest
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}
    volumes:
      - minio_data:/data

volumes:
  pg_data:
  redis_data:
  minio_data:
```

### 8.2 GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: |
          docker build -t ghcr.io/khalshehri/safahati:${{ github.sha }} .
          docker tag ghcr.io/khalshehri/safahati:${{ github.sha }} ghcr.io/khalshehri/safahati:latest

      - name: Push to GitHub Container Registry
        run: |
          echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
          docker push ghcr.io/khalshehri/safahati:${{ github.sha }}
          docker push ghcr.io/khalshehri/safahati:latest

      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /srv/safahati
            export IMAGE_TAG=${{ github.sha }}
            docker compose -f docker-compose.prod.yml pull app
            docker compose -f docker-compose.prod.yml up -d --no-deps app
            docker compose -f docker-compose.prod.yml exec app npx drizzle-kit migrate
            docker image prune -f
```

### 8.3 Health check endpoint

```ts
// src/app/api/health/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({ status: "ok", db: "connected" });
  } catch {
    return NextResponse.json({ status: "error", db: "disconnected" }, { status: 503 });
  }
}
```

---

## 9. Scalability Timeline

### Q2 2026 (Months 1–3): Foundation
- Migrate to PostgreSQL 16 + pgBouncer
- Add Redis caching for site configs
- Fix all critical backend issues (auth on upload, Zod validation, transactions)
- Implement subdomain routing (proxy.ts + Nginx wildcard SSL)
- Docker Compose production stack on Hetzner CX31

### Q3 2026 (Months 4–6): Growth
- Implement BullMQ job queue for AI generation
- MinIO for file storage (replace local filesystem)
- Cloudflare Pro for full page caching
- Rate limiting on all API routes
- Audit logging to `audit_logs` table

### Q4 2026 (Months 7–9): Scale
- Separate app and data servers (two Hetzner VPS)
- PostgreSQL read replica for analytics
- Redis Cluster for high availability
- Custom domain support (CNAME verification)
- Full analytics pipeline (ClickHouse or TimescaleDB for events)

### Q1 2027 (Months 10–12): Enterprise
- Evaluate OVHcloud Bahrain or AWS Bahrain for data residency
- Multi-region session management
- Enterprise SSO (SAML via NextAuth provider)
- SLA monitoring (Uptime Robot / Better Uptime)
- GDPR/PDPL compliance audit
