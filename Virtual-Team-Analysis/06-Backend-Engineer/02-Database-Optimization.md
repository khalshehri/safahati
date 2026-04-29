# Database Optimization Plan — Safahati

**Prepared by:** Backend Engineer  
**Date:** April 2026  
**Scope:** Schema drift fix, SQLite → PostgreSQL migration, indexing, JSONB, RLS, connection pooling

---

## 1. Fix Schema Drift (Immediate)

The current `src/lib/db/schema.ts` is missing columns that exist in the live database. This must be fixed before any migration or ORM-based query touches these fields.

### 1.1 Corrected Drizzle Schema (SQLite — current dev)

```ts
// src/lib/db/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: text("phone"),                           // was missing
  country: text("country"),                       // was missing
  phoneVerified: integer("phone_verified", { mode: "boolean" }).notNull().default(false), // was missing
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const sites = sqliteTable("sites", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  industry: text("industry").notNull(),
  theme: text("theme").notNull(),         // JSON string
  language: text("language").notNull().default("en"),
  status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
  businessType: text("business_type"),            // was missing
  description: text("description"),              // was missing
  whatsapp: text("whatsapp"),                     // was missing
  city: text("city"),                             // was missing
  keywordTags: text("keyword_tags"),              // was missing (JSON array string)
  themeId: text("theme_id"),                      // was missing
  aiGenerated: integer("ai_generated", { mode: "boolean" }).notNull().default(false), // was missing
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const sections = sqliteTable("sections", {
  id: text("id").primaryKey(),
  siteId: text("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }),
  blockType: text("block_type").notNull(),
  templateId: text("template_id").notNull(),
  config: text("config").notNull(),   // JSON string
  sortOrder: integer("sort_order").notNull(),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
});
```

### 1.2 SQLite migration to apply drift fix

Run this manually or via drizzle-kit if using the SQLite migration flow:

```sql
-- Add missing columns to users
ALTER TABLE users ADD COLUMN phone TEXT;
ALTER TABLE users ADD COLUMN country TEXT;
ALTER TABLE users ADD COLUMN phone_verified INTEGER NOT NULL DEFAULT 0;

-- Add missing columns to sites
ALTER TABLE sites ADD COLUMN business_type TEXT;
ALTER TABLE sites ADD COLUMN description TEXT;
ALTER TABLE sites ADD COLUMN whatsapp TEXT;
ALTER TABLE sites ADD COLUMN city TEXT;
ALTER TABLE sites ADD COLUMN keyword_tags TEXT;
ALTER TABLE sites ADD COLUMN theme_id TEXT;
ALTER TABLE sites ADD COLUMN ai_generated INTEGER NOT NULL DEFAULT 0;
```

> Note: SQLite does not support `ALTER TABLE ... ADD COLUMN NOT NULL` without a DEFAULT. All NOT NULL columns above include a DEFAULT value.

---

## 2. SQLite → PostgreSQL Migration Plan

### 2.1 Why PostgreSQL

| Factor | SQLite | PostgreSQL |
|---|---|---|
| Write concurrency | Single writer (WAL) | Unlimited concurrent writers |
| JSONB operators | None (text only) | Full JSONB indexing + operators |
| Row-level security | Not supported | Native RLS policies |
| Connection pooling | N/A | pgBouncer + pg Pool |
| Full-text search | Limited FTS5 | `tsvector` + `GIN` indexes |
| Horizontal scaling | File-based, not shareable | Multi-server via primary + replicas |
| Replication | Not production-ready | Streaming replication |
| Stored procedures | Limited | Full PL/pgSQL |

### 2.2 Target PostgreSQL Schema (Drizzle)

```ts
// src/lib/db/schema.pg.ts (new file for production)
import {
  pgTable, text, boolean, timestamp, integer,
  jsonb, uuid, pgEnum, index, uniqueIndex
} from "drizzle-orm/pg-core";

export const siteStatusEnum = pgEnum("site_status", ["draft", "published"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: text("phone"),
  country: text("country"),
  phoneVerified: boolean("phone_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  emailIdx: uniqueIndex("users_email_idx").on(table.email),
}));

export const sites = pgTable("sites", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  industry: text("industry").notNull(),
  theme: jsonb("theme").notNull().$type<SiteTheme>(),       // JSONB (not text)
  language: text("language").notNull().default("en"),
  status: siteStatusEnum("status").notNull().default("draft"),
  businessType: text("business_type"),
  description: text("description"),
  whatsapp: text("whatsapp"),
  city: text("city"),
  keywordTags: jsonb("keyword_tags").$type<string[]>(),     // JSONB array
  themeId: text("theme_id"),
  aiGenerated: boolean("ai_generated").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  slugIdx: uniqueIndex("sites_slug_idx").on(table.slug),
  userIdIdx: index("sites_user_id_idx").on(table.userId),
  industryIdx: index("sites_industry_idx").on(table.industry),
  statusIdx: index("sites_status_idx").on(table.status),
}));

export const sections = pgTable("sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  siteId: uuid("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }),
  blockType: text("block_type").notNull(),
  templateId: text("template_id").notNull(),
  config: jsonb("config").notNull(),                        // JSONB (not text)
  sortOrder: integer("sort_order").notNull(),
  isVisible: boolean("is_visible").notNull().default(true),
}, (table) => ({
  siteIdIdx: index("sections_site_id_idx").on(table.siteId),
  sortIdx: index("sections_site_sort_idx").on(table.siteId, table.sortOrder),
}));

// Additional tables for planned features
export const domains = pgTable("domains", {
  id: uuid("id").primaryKey().defaultRandom(),
  siteId: uuid("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }),
  domain: text("domain").notNull().unique(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  domainIdx: uniqueIndex("domains_domain_idx").on(table.domain),
  siteIdIdx: index("domains_site_id_idx").on(table.siteId),
}));

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  plan: text("plan").notNull().default("free"),      // free | starter | pro
  status: text("status").notNull().default("active"), // active | canceled | past_due
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("subscriptions_user_id_idx").on(table.userId),
}));

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(),      // site.created, site.deleted, section.updated
  resourceType: text("resource_type"),
  resourceId: text("resource_id"),
  meta: jsonb("meta"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("audit_logs_user_id_idx").on(table.userId),
  createdAtIdx: index("audit_logs_created_at_idx").on(table.createdAt),
}));
```

### 2.3 DB initialization change

Replace `src/lib/db/index.ts`:

```ts
// src/lib/db/index.ts (PostgreSQL production)
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,                    // max pool connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });
export { schema };
```

> All Drizzle queries must become async: `.get()` → `await ...then(r => r[0])`, `.all()` → `await`, `.run()` → `await`.

### 2.4 Migration SQL (PostgreSQL)

Raw SQL to create the initial PostgreSQL schema from scratch:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum types
CREATE TYPE site_status AS ENUM ('draft', 'published');

-- Users
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone       TEXT,
  country     TEXT,
  phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX users_email_idx ON users(email);

-- Sites
CREATE TABLE IF NOT EXISTS sites (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  industry      TEXT NOT NULL,
  theme         JSONB NOT NULL,
  language      TEXT NOT NULL DEFAULT 'en',
  status        site_status NOT NULL DEFAULT 'draft',
  business_type TEXT,
  description   TEXT,
  whatsapp      TEXT,
  city          TEXT,
  keyword_tags  JSONB,        -- stored as JSON array: ["tag1", "tag2"]
  theme_id      TEXT,
  ai_generated  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX sites_slug_idx ON sites(slug);
CREATE INDEX sites_user_id_idx ON sites(user_id);
CREATE INDEX sites_industry_idx ON sites(industry);
CREATE INDEX sites_status_idx ON sites(status);

-- Sections
CREATE TABLE IF NOT EXISTS sections (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id      UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  block_type   TEXT NOT NULL,
  template_id  TEXT NOT NULL,
  config       JSONB NOT NULL,
  sort_order   INTEGER NOT NULL,
  is_visible   BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX sections_site_id_idx ON sections(site_id);
CREATE INDEX sections_site_sort_idx ON sections(site_id, sort_order);

-- Domains
CREATE TABLE IF NOT EXISTS domains (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id    UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  domain     TEXT NOT NULL UNIQUE,
  verified   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES users(id),
  stripe_customer_id      TEXT UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,
  plan                    TEXT NOT NULL DEFAULT 'free',
  status                  TEXT NOT NULL DEFAULT 'active',
  current_period_end      TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),
  action        TEXT NOT NULL,
  resource_type TEXT,
  resource_id   TEXT,
  meta          JSONB,
  ip_address    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX audit_logs_user_id_idx ON audit_logs(user_id);
CREATE INDEX audit_logs_created_at_idx ON audit_logs(created_at);
```

### 2.5 Data migration script (SQLite → PostgreSQL)

```ts
// scripts/migrate-sqlite-to-pg.ts
import Database from "better-sqlite3";
import { Pool } from "pg";
import path from "path";

const sqlite = new Database(path.join(process.cwd(), "data", "safahati.db"));
const pg = new Pool({ connectionString: process.env.PG_URL });

async function migrate() {
  const client = await pg.connect();
  try {
    await client.query("BEGIN");

    // Migrate users
    const users = sqlite.prepare("SELECT * FROM users").all() as any[];
    for (const u of users) {
      await client.query(
        `INSERT INTO users (id, name, email, password_hash, phone, country, phone_verified, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, to_timestamp($8 / 1000.0))
         ON CONFLICT (email) DO NOTHING`,
        [u.id, u.name, u.email, u.password_hash, u.phone, u.country, u.phone_verified === 1, u.created_at]
      );
    }
    console.log(`Migrated ${users.length} users`);

    // Migrate sites
    const sites = sqlite.prepare("SELECT * FROM sites").all() as any[];
    for (const s of sites) {
      await client.query(
        `INSERT INTO sites (id, user_id, name, slug, industry, theme, language, status,
          business_type, description, whatsapp, city, keyword_tags, theme_id, ai_generated,
          created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8::site_status,$9,$10,$11,$12,$13::jsonb,$14,$15,
           to_timestamp($16/1000.0), to_timestamp($17/1000.0))
         ON CONFLICT (slug) DO NOTHING`,
        [
          s.id, s.user_id, s.name, s.slug, s.industry, s.theme, s.language, s.status,
          s.business_type, s.description, s.whatsapp, s.city,
          s.keyword_tags || null, s.theme_id, s.ai_generated === 1,
          s.created_at, s.updated_at
        ]
      );
    }
    console.log(`Migrated ${sites.length} sites`);

    // Migrate sections
    const sections = sqlite.prepare("SELECT * FROM sections").all() as any[];
    for (const sec of sections) {
      await client.query(
        `INSERT INTO sections (id, site_id, block_type, template_id, config, sort_order, is_visible)
         VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7)
         ON CONFLICT (id) DO NOTHING`,
        [sec.id, sec.site_id, sec.block_type, sec.template_id, sec.config, sec.sort_order, sec.is_visible === 1]
      );
    }
    console.log(`Migrated ${sections.length} sections`);

    await client.query("COMMIT");
    console.log("Migration complete");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", err);
    throw err;
  } finally {
    client.release();
    await pg.end();
    sqlite.close();
  }
}

migrate();
```

---

## 3. Indexing Strategy

### 3.1 Primary indexes (defined in schema above)

| Table | Index | Type | Reason |
|---|---|---|---|
| `users` | `email` | unique | Login lookup, registration check |
| `sites` | `slug` | unique | Subdomain routing (hot path, every request) |
| `sites` | `user_id` | btree | Dashboard: list all sites for a user |
| `sites` | `industry` | btree | Admin analytics, template filtering |
| `sites` | `status` | btree | Filter published sites for sitemap |
| `sections` | `site_id` | btree | Load sections for a site |
| `sections` | `(site_id, sort_order)` | composite btree | Ordered sections load |

### 3.2 JSONB indexes (PostgreSQL)

For queries that search inside JSONB columns:

```sql
-- Index on theme primary color (for admin analytics)
CREATE INDEX sites_theme_color_idx ON sites ((theme->>'primaryColor'));

-- GIN index on keyword_tags for array containment queries
CREATE INDEX sites_keyword_tags_gin_idx ON sites USING GIN (keyword_tags);

-- GIN index on sections.config for block-level searches
CREATE INDEX sections_config_gin_idx ON sections USING GIN (config);
```

Usage examples:
```sql
-- Find all sites using a specific theme color
SELECT id, name FROM sites WHERE theme->>'primaryColor' = '#3B82F6';

-- Find all sites tagged 'restaurant' in keyword_tags
SELECT id, name FROM sites WHERE keyword_tags @> '["restaurant"]'::jsonb;
```

### 3.3 Full-text search indexes

For future search-by-site-name feature:

```sql
-- Add tsvector column
ALTER TABLE sites ADD COLUMN search_vector tsvector;

-- Create index
CREATE INDEX sites_search_idx ON sites USING GIN (search_vector);

-- Update trigger to keep vector in sync
CREATE FUNCTION sites_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector = to_tsvector('arabic', NEW.name || ' ' || COALESCE(NEW.description, ''))
                   || to_tsvector('english', NEW.name || ' ' || COALESCE(NEW.description, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sites_search_trigger
  BEFORE INSERT OR UPDATE ON sites
  FOR EACH ROW EXECUTE FUNCTION sites_search_update();
```

---

## 4. JSONB for Config Columns

### 4.1 Benefit over text JSON

In PostgreSQL, storing `config` and `theme` as `JSONB` (not `TEXT`) provides:
- Binary storage — no re-parsing on every read
- Operator support: `->`, `->>`, `#>`, `@>`, `?`, `jsonb_set()`
- GIN indexes for containment and key-existence queries
- Automatic validation (malformed JSON is rejected at insert time)

### 4.2 Updating nested JSONB fields

Instead of reading the full config, modifying it in application code, and writing it back:

```sql
-- Update a single key inside sections.config without replacing the whole object
UPDATE sections
SET config = jsonb_set(config, '{heading}', '"New Heading"', false)
WHERE id = $1;

-- Add a new key to config
UPDATE sections
SET config = config || '{"badge": "New"}'::jsonb
WHERE id = $1;

-- Remove a key from config
UPDATE sections
SET config = config - 'badge'
WHERE id = $1;
```

This reduces round-trips for partial config updates (e.g., editing just the hero heading without rewriting all section data).

### 4.3 Querying inside configs

```sql
-- Find all hero sections with a specific heading text (for content audit)
SELECT s.site_id, s.config->>'heading' as heading
FROM sections s
WHERE s.block_type = 'hero'
  AND s.config->>'heading' ILIKE '%مرحبا%';
```

---

## 5. Multi-Tenant Row-Level Security (PostgreSQL)

Row-level security (RLS) is a PostgreSQL feature that enforces data isolation at the database level, providing a second layer of defense even if application code has a bug.

### 5.1 Enable RLS on tenant tables

```sql
-- Enable RLS
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- Create a policy: users can only see their own sites
-- (requires app to SET LOCAL app.current_user_id = '...' at connection time)
CREATE POLICY sites_tenant_isolation ON sites
  USING (user_id = current_setting('app.current_user_id')::uuid);

CREATE POLICY sections_tenant_isolation ON sections
  USING (
    site_id IN (
      SELECT id FROM sites
      WHERE user_id = current_setting('app.current_user_id')::uuid
    )
  );
```

### 5.2 Set user context per request

In the Drizzle/pg layer, before each query in a transaction:

```ts
// src/lib/db/rls.ts
export async function withTenantContext<T>(
  userId: string,
  fn: () => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query(`SET LOCAL app.current_user_id = '${userId}'`);
    return await fn();
  } finally {
    client.release();
  }
}
```

> Note: RLS adds complexity and is optional for early-stage. The application-level `userId` check in every query is sufficient for MVP. RLS becomes critical at scale or if direct DB access is granted to analytics tools.

---

## 6. Connection Pooling with pgBouncer

### 6.1 Why pgBouncer

- PostgreSQL creates one OS process per connection — at 200 connections, RAM usage is significant
- Next.js is stateless and serverless-style; each cold start opens new connections
- pgBouncer sits between the app and PostgreSQL, maintaining a small pool of persistent DB connections while serving many app connections

### 6.2 Docker Compose setup

```yaml
# docker-compose.yml (relevant services)
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: safahati
      POSTGRES_USER: safahati
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U safahati"]
      interval: 10s
      timeout: 5s
      retries: 5

  pgbouncer:
    image: bitnami/pgbouncer:latest
    environment:
      POSTGRESQL_HOST: postgres
      POSTGRESQL_PORT: 5432
      POSTGRESQL_DATABASE: safahati
      POSTGRESQL_USERNAME: safahati
      POSTGRESQL_PASSWORD: ${DB_PASSWORD}
      PGBOUNCER_DATABASE: safahati
      PGBOUNCER_POOL_MODE: transaction   # best for web apps
      PGBOUNCER_MAX_CLIENT_CONN: 200
      PGBOUNCER_DEFAULT_POOL_SIZE: 20
      PGBOUNCER_MIN_POOL_SIZE: 5
    ports:
      - "5432:5432"
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  pg_data:
```

### 6.3 Pool mode selection

| Mode | Use case | Notes |
|---|---|---|
| `session` | Long-lived DB connections | Each client holds connection for whole session |
| `transaction` | Web API routes (recommended) | Connection released after each transaction |
| `statement` | Read-only analytics | Most aggressive — released after each statement |

**Recommendation:** Use `transaction` mode for the Next.js API layer. This allows pgBouncer to serve 200 app connections from 20 physical DB connections.

### 6.4 Application connection string

```
# .env.production
DATABASE_URL=postgresql://safahati:${DB_PASSWORD}@pgbouncer:5432/safahati
```

---

## 7. Backup and Recovery

### 7.1 Automated backup with pg_dump

```bash
#!/bin/bash
# scripts/backup-db.sh
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="safahati_${TIMESTAMP}.sql.gz"

pg_dump \
  -h "${DB_HOST}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  --no-owner \
  --no-acl \
  | gzip > "/tmp/${BACKUP_FILE}"

# Upload to MinIO
mc cp "/tmp/${BACKUP_FILE}" "minio/safahati-backups/${BACKUP_FILE}"
rm "/tmp/${BACKUP_FILE}"

echo "Backup complete: ${BACKUP_FILE}"
```

```yaml
# docker-compose.yml addition
  backup:
    image: postgres:16-alpine
    environment:
      DB_HOST: pgbouncer
      DB_USER: safahati
      DB_NAME: safahati
      PGPASSWORD: ${DB_PASSWORD}
    volumes:
      - ./scripts/backup-db.sh:/backup.sh
    entrypoint: ["crond", "-f"]
    # runs daily at 2am
    command: echo "0 2 * * * /backup.sh" > /var/spool/cron/crontabs/root
```

### 7.2 Recovery procedure

```bash
# Restore from backup
gunzip < safahati_20260425_020000.sql.gz | psql \
  -h "${DB_HOST}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}"
```

---

## 8. drizzle-kit Configuration

```ts
// drizzle.config.ts
import type { Config } from "drizzle-kit";

const isProd = process.env.NODE_ENV === "production";

export default {
  schema: isProd ? "./src/lib/db/schema.pg.ts" : "./src/lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: isProd ? "postgresql" : "sqlite",
  dbCredentials: isProd
    ? { url: process.env.DATABASE_URL! }
    : { url: "./data/safahati.db" },
  verbose: true,
  strict: true,
} satisfies Config;
```

Generate and apply migrations:
```bash
# Generate migration files from schema changes
npx drizzle-kit generate

# Apply pending migrations
npx drizzle-kit migrate

# Inspect current DB state vs schema
npx drizzle-kit check
```
