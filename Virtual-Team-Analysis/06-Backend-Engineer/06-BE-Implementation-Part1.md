# Backend Engineer Implementation — PART 1
## Database Migrations & Core API Routes

---

## A. Database Migrations (Drizzle ORM)

### Complete Schema Additions for `src/lib/db/schema.ts`

This replaces the entire schema file. Includes all existing tables plus new columns and tables.

```typescript
import { 
  sqliteTable, 
  text, 
  integer,
  real,
  index
} from "drizzle-orm/sqlite-core";
import { pgTable, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

// ──────────────────────────────────────────────────────────────
// USERS TABLE — Enhanced with 9 new columns
// ──────────────────────────────────────────────────────────────

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  
  // New columns
  emailVerified: integer("email_verified", { mode: "timestamp_ms" }),
  avatar: text("avatar"), // URL to profile avatar
  phone: text("phone"),
  company: text("company"),
  country: text("country"),
  timezone: text("timezone").default("UTC"),
  language: text("language").default("en"),
  onboardingComplete: integer("onboarding_complete", { mode: "boolean" }).default(false),
  
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
}));

// ──────────────────────────────────────────────────────────────
// SITES TABLE — Enhanced with 9 new columns
// ──────────────────────────────────────────────────────────────

export const sites = sqliteTable("sites", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  industry: text("industry").notNull(),
  theme: text("theme").notNull(), // JSON string of SiteTheme
  language: text("language").notNull().default("en"),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  
  // New columns
  description: text("description"),
  logo: text("logo"), // URL to logo
  favicon: text("favicon"), // URL to favicon
  customDomain: text("custom_domain"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  
  // Timestamps
  publishedAt: integer("published_at", { mode: "timestamp_ms" }),
  draftState: text("draft_state"), // JSON string of editor state
  clientUpdatedAt: integer("client_updated_at", { mode: "timestamp_ms" }), // Optimistic concurrency
  completenessCache: integer("completeness_cache"), // 0-100 score
  
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => ({
  userIdIdx: index("sites_user_id_idx").on(table.userId),
  statusIdx: index("sites_status_idx").on(table.status),
}));

// ──────────────────────────────────────────────────────────────
// SECTIONS TABLE — Enhanced with translation_state
// ──────────────────────────────────────────────────────────────

export const sections = sqliteTable("sections", {
  id: text("id").primaryKey(),
  siteId: text("site_id")
    .notNull()
    .references(() => sites.id, { onDelete: "cascade" }),
  blockType: text("block_type").notNull(),
  templateId: text("template_id").notNull(),
  config: text("config").notNull(), // JSON string
  sortOrder: integer("sort_order").notNull(),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
  
  // New column
  translationState: text("translation_state", { enum: ["pending", "in-progress", "complete"] })
    .default("pending"),
  
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => ({
  siteIdIdx: index("sections_site_id_idx").on(table.siteId),
}));

// ──────────────────────────────────────────────────────────────
// WIZARD_DRAFTS TABLE — Save multi-step wizard progress
// ──────────────────────────────────────────────────────────────

export const wizardDrafts = sqliteTable("wizard_drafts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Wizard answers (JSON)
  businessName: text("business_name"),
  businessType: text("business_type"), // industry enum
  businessDescription: text("business_description"),
  businessLanguage: text("business_language"), // en | ar
  businessLogoUrl: text("business_logo_url"),
  businessPhoneNumber: text("business_phone_number"),
  businessEmail: text("business_email"),
  businessCountry: text("business_country"),
  
  // Step completion tracking
  currentStep: integer("current_step").default(1), // 1-8
  completedSteps: text("completed_steps").default("[]"), // JSON array [1, 2, ...]
  
  // Metadata
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }), // Auto-delete after 30 days
}, (table) => ({
  userIdIdx: index("wizard_drafts_user_id_idx").on(table.userId),
}));

// ──────────────────────────────────────────────────────────────
// OPENING_HOURS TABLE — Structured business hours
// ──────────────────────────────────────────────────────────────

export const openingHours = sqliteTable("opening_hours", {
  id: text("id").primaryKey(),
  siteId: text("site_id")
    .notNull()
    .references(() => sites.id, { onDelete: "cascade" }),
  
  // Day of week (0 = Sunday, 6 = Saturday)
  dayOfWeek: integer("day_of_week").notNull(),
  
  // Time format: "09:00" (24-hour)
  openTime: text("open_time"),
  closeTime: text("close_time"),
  isClosed: integer("is_closed", { mode: "boolean" }).default(false),
  
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => ({
  siteIdIdx: index("opening_hours_site_id_idx").on(table.siteId),
}));

// ──────────────────────────────────────────────────────────────
// MANAGED_SERVICE_REQUESTS TABLE
// ──────────────────────────────────────────────────────────────

export const managedServiceRequests = sqliteTable("managed_service_requests", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  siteId: text("site_id")
    .notNull()
    .references(() => sites.id, { onDelete: "cascade" }),
  
  // Service type
  serviceType: text("service_type").notNull(), // "content-writing" | "design" | "seo" | "tech-setup"
  
  // Status
  status: text("status", { enum: ["pending", "accepted", "in-progress", "completed", "rejected"] })
    .notNull()
    .default("pending"),
  
  // Details
  description: text("description"),
  budget: real("budget"), // Optional budget
  deadline: integer("deadline", { mode: "timestamp_ms" }),
  
  // Assignment
  assignedTo: text("assigned_to"), // Freelancer/agency ID (future)
  
  // Metadata
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => ({
  userIdIdx: index("managed_service_requests_user_id_idx").on(table.userId),
  siteIdIdx: index("managed_service_requests_site_id_idx").on(table.siteId),
  statusIdx: index("managed_service_requests_status_idx").on(table.status),
}));

// ──────────────────────────────────────────────────────────────
// POSTGRESQL EQUIVALENTS (for production deployment)
// ──────────────────────────────────────────────────────────────

// Uncomment and use these when migrating to PostgreSQL
/*

export const usersPostgres = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  emailVerified: timestamp("email_verified"),
  avatar: text("avatar"),
  phone: text("phone"),
  company: text("company"),
  country: text("country"),
  timezone: text("timezone").default("UTC"),
  language: text("language").default("en"),
  onboardingComplete: boolean("onboarding_complete").default(false),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const sitesPostgres = pgTable("sites", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersPostgres.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  industry: text("industry").notNull(),
  theme: jsonb("theme").notNull(), // Native JSONB
  language: text("language").notNull().default("en"),
  status: text("status").notNull().default("draft"),
  description: text("description"),
  logo: text("logo"),
  favicon: text("favicon"),
  customDomain: text("custom_domain"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  publishedAt: timestamp("published_at"),
  draftState: jsonb("draft_state"),
  clientUpdatedAt: timestamp("client_updated_at"),
  completenessCache: integer("completeness_cache"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const sectionsPostgres = pgTable("sections", {
  id: text("id").primaryKey(),
  siteId: text("site_id").notNull().references(() => sitesPostgres.id),
  blockType: text("block_type").notNull(),
  templateId: text("template_id").notNull(),
  config: jsonb("config").notNull(), // Native JSONB
  sortOrder: integer("sort_order").notNull(),
  isVisible: boolean("is_visible").default(true),
  translationState: text("translation_state").default("pending"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const wizardDraftsPostgres = pgTable("wizard_drafts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersPostgres.id),
  businessName: text("business_name"),
  businessType: text("business_type"),
  businessDescription: text("business_description"),
  businessLanguage: text("business_language"),
  businessLogoUrl: text("business_logo_url"),
  businessPhoneNumber: text("business_phone_number"),
  businessEmail: text("business_email"),
  businessCountry: text("business_country"),
  currentStep: integer("current_step").default(1),
  completedSteps: jsonb("completed_steps").default([]),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  expiresAt: timestamp("expires_at"),
});

export const openingHoursPostgres = pgTable("opening_hours", {
  id: text("id").primaryKey(),
  siteId: text("site_id").notNull().references(() => sitesPostgres.id),
  dayOfWeek: integer("day_of_week").notNull(),
  openTime: text("open_time"),
  closeTime: text("close_time"),
  isClosed: boolean("is_closed").default(false),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const managedServiceRequestsPostgres = pgTable("managed_service_requests", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersPostgres.id),
  siteId: text("site_id").notNull().references(() => sitesPostgres.id),
  serviceType: text("service_type").notNull(),
  status: text("status").notNull().default("pending"),
  description: text("description"),
  budget: real("budget"),
  deadline: timestamp("deadline"),
  assignedTo: text("assigned_to"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

*/
```

**Migration Notes:**
- All timestamps use millisecond-precision SQLite integer mode for dev
- PostgreSQL equivalents provided (comment block) for production
- All foreign keys use `onDelete: "cascade"` for referential integrity
- Indexes on frequently queried columns: `user_id`, `site_id`, `status`, `email`
- `clientUpdatedAt` used for optimistic concurrency in editor autosave
- `completenessCache` updated by completeness calculation function

---

## B. Five Core API Routes

### 1. `src/app/api/wizard/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Zod schema for wizard step validation
const wizardStepSchema = z.object({
  step: z.number().min(1).max(8),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  businessDescription: z.string().optional(),
  businessLanguage: z.enum(["en", "ar"]).optional(),
  businessLogoUrl: z.string().url().optional(),
  businessPhoneNumber: z.string().optional(),
  businessEmail: z.string().email().optional(),
  businessCountry: z.string().optional(),
});

type WizardStepInput = z.infer<typeof wizardStepSchema>;

// GET /api/wizard — Retrieve wizard draft for current user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const draft = db
      .select()
      .from(schema.wizardDrafts)
      .where(eq(schema.wizardDrafts.userId, session.user.id))
      .get();

    if (!draft) {
      return NextResponse.json(
        { draft: null, message: "No draft found. Start from step 1." },
        { status: 200 }
      );
    }

    return NextResponse.json({
      draft: {
        id: draft.id,
        currentStep: draft.currentStep,
        completedSteps: JSON.parse(draft.completedSteps || "[]"),
        businessName: draft.businessName,
        businessType: draft.businessType,
        businessDescription: draft.businessDescription,
        businessLanguage: draft.businessLanguage,
        businessLogoUrl: draft.businessLogoUrl,
        businessPhoneNumber: draft.businessPhoneNumber,
        businessEmail: draft.businessEmail,
        businessCountry: draft.businessCountry,
      },
    });
  } catch (e) {
    console.error("[GET /api/wizard]", e);
    return NextResponse.json(
      { error: "Failed to fetch wizard draft" },
      { status: 500 }
    );
  }
}

// POST /api/wizard — Save wizard step
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = wizardStepSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data as WizardStepInput;
    const now = new Date();

    // Fetch or create draft
    let draft = db
      .select()
      .from(schema.wizardDrafts)
      .where(eq(schema.wizardDrafts.userId, session.user.id))
      .get();

    if (!draft) {
      // Create new draft
      const draftId = crypto.randomUUID();
      const completedSteps = data.step ? [data.step] : [];

      db.insert(schema.wizardDrafts)
        .values({
          id: draftId,
          userId: session.user.id,
          currentStep: data.step || 1,
          completedSteps: JSON.stringify(completedSteps),
          businessName: data.businessName,
          businessType: data.businessType,
          businessDescription: data.businessDescription,
          businessLanguage: data.businessLanguage,
          businessLogoUrl: data.businessLogoUrl,
          businessPhoneNumber: data.businessPhoneNumber,
          businessEmail: data.businessEmail,
          businessCountry: data.businessCountry,
          createdAt: now,
          updatedAt: now,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        })
        .run();

      return NextResponse.json(
        {
          draftId,
          step: data.step || 1,
          message: "Wizard draft created",
        },
        { status: 201 }
      );
    }

    // Update existing draft
    const completedSteps = JSON.parse(draft.completedSteps || "[]") as number[];
    if (data.step && !completedSteps.includes(data.step)) {
      completedSteps.push(data.step);
    }

    db.update(schema.wizardDrafts)
      .set({
        currentStep: data.step ?? draft.currentStep,
        completedSteps: JSON.stringify(completedSteps),
        businessName: data.businessName ?? draft.businessName,
        businessType: data.businessType ?? draft.businessType,
        businessDescription: data.businessDescription ?? draft.businessDescription,
        businessLanguage: data.businessLanguage ?? draft.businessLanguage,
        businessLogoUrl: data.businessLogoUrl ?? draft.businessLogoUrl,
        businessPhoneNumber: data.businessPhoneNumber ?? draft.businessPhoneNumber,
        businessEmail: data.businessEmail ?? draft.businessEmail,
        businessCountry: data.businessCountry ?? draft.businessCountry,
        updatedAt: now,
      })
      .where(eq(schema.wizardDrafts.id, draft.id))
      .run();

    return NextResponse.json(
      {
        draftId: draft.id,
        step: data.step || draft.currentStep,
        completedSteps,
        message: "Wizard step saved",
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("[POST /api/wizard]", e);
    return NextResponse.json(
      { error: "Failed to save wizard step" },
      { status: 500 }
    );
  }
}
```

---

### 2. `src/app/api/wizard/complete/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getIndustryTemplate } from "@/config/industry-templates";

const completeWizardSchema = z.object({
  businessName: z.string().min(1, "Business name required"),
  businessType: z.string().min(1, "Business type required"),
  businessDescription: z.string().optional(),
  businessLanguage: z.enum(["en", "ar"]).default("en"),
  businessLogoUrl: z.string().url().optional(),
  businessPhoneNumber: z.string().optional(),
  businessEmail: z.string().email().optional(),
  businessCountry: z.string().optional(),
});

type CompleteWizardInput = z.infer<typeof completeWizardSchema>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = completeWizardSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data as CompleteWizardInput;
    const now = new Date();

    // Verify user exists
    const user = db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, session.user.id))
      .get();

    if (!user) {
      return NextResponse.json(
        { error: "Session expired — please log out and log back in" },
        { status: 401 }
      );
    }

    // Get industry template
    const template = getIndustryTemplate(data.businessType);
    if (!template) {
      return NextResponse.json(
        { error: "Invalid business type" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let baseSlug = slugify(data.businessName);
    if (!baseSlug) baseSlug = "site";
    let slug = baseSlug;
    let counter = 1;
    while (
      db
        .select()
        .from(schema.sites)
        .where(eq(schema.sites.slug, slug))
        .get()
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create site
    const siteId = crypto.randomUUID();
    const themeWithDirection = {
      ...template.defaultTheme,
      direction: data.businessLanguage === "ar" ? "rtl" : "ltr",
    };

    db.insert(schema.sites)
      .values({
        id: siteId,
        userId: session.user.id,
        name: data.businessName,
        slug,
        industry: data.businessType,
        theme: JSON.stringify(themeWithDirection),
        language: data.businessLanguage,
        description: data.businessDescription,
        logo: data.businessLogoUrl,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      })
      .run();

    // Insert template sections
    for (const section of template.sections) {
      db.insert(schema.sections)
        .values({
          id: crypto.randomUUID(),
          siteId,
          blockType: section.blockType,
          templateId: section.templateId,
          config: JSON.stringify(section.config),
          sortOrder: section.sortOrder,
          isVisible: section.isVisible,
          createdAt: now,
          updatedAt: now,
        })
        .run();
    }

    // Delete wizard draft
    db.delete(schema.wizardDrafts)
      .where(eq(schema.wizardDrafts.userId, session.user.id))
      .run();

    return NextResponse.json(
      {
        siteId,
        slug,
        url: `https://${slug}.safahati.com`,
        message: "Site created successfully",
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("[POST /api/wizard/complete]", e);
    return NextResponse.json(
      { error: "Failed to create site from wizard" },
      { status: 500 }
    );
  }
}
```

---

### 3. `src/app/api/sites/[siteId]/autosave/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const autosaveSchema = z.object({
  draftState: z.record(z.any()), // Flexible editor state
  clientUpdatedAt: z.number().optional(), // Timestamp (ms)
});

type AutosaveInput = z.infer<typeof autosaveSchema>;

export async function POST(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const siteId = params.siteId;
    const body = await request.json();
    const validation = autosaveSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data as AutosaveInput;

    // Fetch site and verify ownership
    const site = db
      .select()
      .from(schema.sites)
      .where(eq(schema.sites.id, siteId))
      .get();

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    if (site.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const now = new Date();
    const serverTimestamp = now.getTime();
    const clientTimestamp = data.clientUpdatedAt || serverTimestamp;
    const tolerance = 2000; // 2-second tolerance

    // Check for conflict (optimistic concurrency)
    if (
      site.clientUpdatedAt &&
      Math.abs(serverTimestamp - site.clientUpdatedAt.getTime()) > tolerance
    ) {
      // Conflict detected — return current state
      return NextResponse.json(
        {
          conflict: true,
          currentState: site.draftState ? JSON.parse(site.draftState) : null,
          serverUpdatedAt: site.clientUpdatedAt.getTime(),
          message: "Conflict detected. Use server state and retry.",
        },
        { status: 409 }
      );
    }

    // No conflict — save draft
    db.update(schema.sites)
      .set({
        draftState: JSON.stringify(data.draftState),
        clientUpdatedAt: now,
        updatedAt: now,
      })
      .where(eq(schema.sites.id, siteId))
      .run();

    return NextResponse.json(
      {
        saved: true,
        timestamp: serverTimestamp,
        message: "Draft saved",
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("[POST /api/sites/[siteId]/autosave]", e);
    return NextResponse.json(
      { error: "Failed to autosave draft" },
      { status: 500 }
    );
  }
}
```

---

### 4. `src/app/api/sites/[siteId]/preview-token/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { createHmac } from "crypto";

interface PreviewTokenPayload {
  siteId: string;
  userId: string;
  exp: number; // Expiration time (seconds, Unix epoch)
}

function createPreviewToken(payload: PreviewTokenPayload): string {
  // Simple JWT-like token (format: header.payload.signature)
  // In production, use a proper JWT library or NextAuth session management

  const secret = process.env.JWT_SECRET || "dev-secret-key";
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");

  const signature = createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64url");

  return `${header}.${body}.${signature}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const siteId = params.siteId;

    // Verify site exists and user owns it
    const site = db
      .select()
      .from(schema.sites)
      .where(eq(schema.sites.id, siteId))
      .get();

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    if (site.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create 5-minute preview token
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 5 * 60; // 5 minutes
    const expiresAt = now + expiresIn;

    const token = createPreviewToken({
      siteId,
      userId: session.user.id,
      exp: expiresAt,
    });

    return NextResponse.json(
      {
        token,
        expiresAt,
        expiresIn,
        previewUrl: `https://${site.slug}.safahati.com?preview=${token}`,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("[GET /api/sites/[siteId]/preview-token]", e);
    return NextResponse.json(
      { error: "Failed to generate preview token" },
      { status: 500 }
    );
  }
}
```

---

### 5. `src/app/api/sites/[siteId]/publish/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const publishSchema = z.object({
  // Optional: allow publishing with custom domain
  customDomain: z.string().optional(),
});

type PublishInput = z.infer<typeof publishSchema>;

export async function POST(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const siteId = params.siteId;
    const body = await request.json();
    const validation = publishSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data as PublishInput;

    // Fetch site and verify ownership
    const site = db
      .select()
      .from(schema.sites)
      .where(eq(schema.sites.id, siteId))
      .get();

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    if (site.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if this is the first publish
    const isFirstPublish = site.status === "draft" && !site.publishedAt;
    const now = new Date();

    // Update site
    const updateData: any = {
      status: "published",
      updatedAt: now,
    };

    // Set publishedAt only on first publish
    if (isFirstPublish) {
      updateData.publishedAt = now;
    }

    // Optionally set custom domain
    if (data.customDomain) {
      updateData.customDomain = data.customDomain;
    }

    db.update(schema.sites)
      .set(updateData)
      .where(eq(schema.sites.id, siteId))
      .run();

    // Construct public URL
    const publicUrl = data.customDomain
      ? `https://${data.customDomain}`
      : `https://${site.slug}.safahati.com`;

    return NextResponse.json(
      {
        isFirstPublish,
        url: publicUrl,
        publishedAt: isFirstPublish ? now.toISOString() : site.publishedAt?.toISOString(),
        message: isFirstPublish ? "Site published!" : "Site updated",
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("[POST /api/sites/[siteId]/publish]", e);
    return NextResponse.json(
      { error: "Failed to publish site" },
      { status: 500 }
    );
  }
}
```

---

## C. Completeness Score Function

### `src/lib/completeness.ts`

```typescript
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export interface CompletenessResult {
  score: number; // 0-100
  missing: Array<{
    key: string;
    labelEn: string;
    labelAr: string;
  }>;
  nextAction: string;
}

export async function calculateCompleteness(
  siteId: string
): Promise<CompletenessResult> {
  try {
    // Fetch site
    const site = db
      .select()
      .from(schema.sites)
      .where(eq(schema.sites.id, siteId))
      .get();

    if (!site) {
      return {
        score: 0,
        missing: [],
        nextAction: "Site not found",
      };
    }

    // Fetch sections
    const sections = db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.siteId, siteId))
      .all();

    const checks: Array<{
      key: string;
      labelEn: string;
      labelAr: string;
      passed: boolean;
    }> = [];

    // 1. Logo present
    checks.push({
      key: "logo",
      labelEn: "Add logo",
      labelAr: "إضافة الشعار",
      passed: !!site.logo,
    });

    // 2. Phone number
    checks.push({
      key: "phone",
      labelEn: "Add phone number",
      labelAr: "إضافة رقم الهاتف",
      passed: !!site.description?.includes("phone") || sections.some(s => {
        const config = JSON.parse(s.config || "{}");
        return config.phone || config.phoneNumber;
      }),
    });

    // 3. Arabic content
    let hasArabicContent = false;
    for (const section of sections) {
      const config = JSON.parse(section.config || "{}");
      if (config.headingAr || config.descriptionAr || config.contentAr) {
        hasArabicContent = true;
        break;
      }
    }
    checks.push({
      key: "arabic_content",
      labelEn: "Add Arabic content",
      labelAr: "إضافة محتوى عربي",
      passed: hasArabicContent || site.language === "en",
    });

    // 4. English content
    let hasEnglishContent = false;
    for (const section of sections) {
      const config = JSON.parse(section.config || "{}");
      if (config.heading || config.description || config.content) {
        hasEnglishContent = true;
        break;
      }
    }
    checks.push({
      key: "english_content",
      labelEn: "Add English content",
      labelAr: "إضافة محتوى إنجليزي",
      passed: hasEnglishContent,
    });

    // 5. 3+ sections
    checks.push({
      key: "sections",
      labelEn: "Add 3+ sections",
      labelAr: "إضافة 3 أقسام على الأقل",
      passed: sections.length >= 3,
    });

    // 6. Published
    checks.push({
      key: "published",
      labelEn: "Publish site",
      labelAr: "نشر الموقع",
      passed: site.status === "published",
    });

    // 7. Custom domain (optional but counts)
    checks.push({
      key: "custom_domain",
      labelEn: "Add custom domain",
      labelAr: "إضافة نطاق مخصص",
      passed: !!site.customDomain,
    });

    // Calculate score
    const totalChecks = checks.length;
    const passedChecks = checks.filter(c => c.passed).length;
    const score = Math.round((passedChecks / totalChecks) * 100);

    // Identify missing items
    const missing = checks
      .filter(c => !c.passed)
      .map(c => ({
        key: c.key,
        labelEn: c.labelEn,
        labelAr: c.labelAr,
      }));

    // Suggest next action
    let nextAction = "Site complete!";
    if (!checks.find(c => c.key === "logo")?.passed) {
      nextAction = "Upload a logo to brand your site.";
    } else if (!checks.find(c => c.key === "english_content")?.passed) {
      nextAction = "Add English content to your sections.";
    } else if (!checks.find(c => c.key === "sections")?.passed) {
      nextAction = "Add more sections to enrich your site.";
    } else if (!checks.find(c => c.key === "published")?.passed) {
      nextAction = "Publish your site to go live!";
    }

    return { score, missing, nextAction };
  } catch (error) {
    console.error("[calculateCompleteness]", error);
    return {
      score: 0,
      missing: [],
      nextAction: "Error calculating completeness",
    };
  }
}

// Optional: Cache the result to the database
export async function updateCompletenessCache(siteId: string): Promise<void> {
  try {
    const result = await calculateCompleteness(siteId);
    db.update(schema.sites)
      .set({
        completenessCache: result.score,
        updatedAt: new Date(),
      })
      .where(eq(schema.sites.id, siteId))
      .run();
  } catch (error) {
    console.error("[updateCompletenessCache]", error);
  }
}
```

---

## Implementation Notes

### Schema Additions Summary
- **9 new columns on `users`**: emailVerified, avatar, phone, company, country, timezone, language, onboardingComplete, + timestamps
- **9 new columns on `sites`**: description, logo, favicon, customDomain, seoTitle, seoDescription, publishedAt, draftState, clientUpdatedAt, completenessCache
- **1 new column on `sections`**: translationState
- **3 new tables**: wizardDrafts, openingHours, managedServiceRequests

### API Routes Summary
1. **Wizard (GET/POST)** — Resume and save multi-step wizard state
2. **Wizard Complete (POST)** — Finalize wizard → create full site with template sections
3. **Autosave (POST)** — Optimistic concurrency with 2-second tolerance conflict detection
4. **Preview Token (GET)** — Generate 5-minute preview JWT for draft viewing
5. **Publish (POST)** — Transition draft → published, detect first publish via `publishedAt` null check

### Completeness Score
- Checks 7 criteria (logo, phone, Arabic, English, 3+ sections, published, custom domain)
- Returns score (0-100), missing items, and next action
- Function can be called on any site mutation to update cache

### Key Design Decisions
- Timestamps stored as milliseconds in SQLite, seconds in JWT (standard)
- Conflict resolution uses 2-second window for network latency tolerance
- First publish detection via `publishedAt` null check (not status change alone)
- Completeness cache updated separately to avoid per-request recalculation
- All routes validate auth, check ownership, and return proper HTTP status codes
- Zod schemas centralize validation logic for request bodies

---

## Next Steps (PART 2)
- Frontend hooks for wizard flow (React Context + Zustand)
- Editor UI components with autosave integration
- Preview mode middleware validation
- Deploy scripts for database migrations
- Email notifications on first publish
