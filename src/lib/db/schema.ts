import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  avatar: text("avatar"),
  phone: text("phone"),
  company: text("company"),
  country: text("country"),
  timezone: text("timezone").default("UTC"),
  language: text("language", { enum: ["ar", "en"] }).default("en"),
  onboardingComplete: integer("onboarding_complete", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const sites = sqliteTable("sites", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  industry: text("industry").notNull(),
  theme: text("theme").notNull(), // JSON string of SiteTheme
  language: text("language").notNull().default("en"),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  description: text("description"),
  logo: text("logo"),
  favicon: text("favicon"),
  customDomain: text("custom_domain"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  publishedAt: integer("published_at", { mode: "timestamp_ms" }),
  draftState: text("draft_state"), // JSON string for serialized draft config
  clientUpdatedAt: integer("client_updated_at", { mode: "timestamp_ms" }), // for 409 conflict detection
  completenessCache: text("completeness_cache"), // JSON { score, missing[], nextAction }
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const sections = sqliteTable("sections", {
  id: text("id").primaryKey(),
  siteId: text("site_id")
    .notNull()
    .references(() => sites.id, { onDelete: "cascade" }),
  blockType: text("block_type").notNull(),
  templateId: text("template_id").notNull(),
  config: text("config").notNull(), // JSON string
  translationState: text("translation_state", { enum: ["original", "ai", "human"] }).default("original"),
  sortOrder: integer("sort_order").notNull(),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const wizardDrafts = sqliteTable("wizard_drafts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  industry: text("industry"),
  step: integer("step").default(0), // 0-7 for 8-step wizard
  answers: text("answers"), // JSON string: { businessType, businessName, city, phone, logo, color, description, language }
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const openingHours = sqliteTable("opening_hours", {
  id: text("id").primaryKey(),
  siteId: text("site_id")
    .notNull()
    .references(() => sites.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sun-Sat)
  timeStart: text("time_start"), // "HH:MM" format
  timeEnd: text("time_end"), // "HH:MM" format
  crossesMidnight: integer("crosses_midnight", { mode: "boolean" }).default(false),
});

export const managedServiceRequests = sqliteTable("managed_service_requests", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  businessType: text("business_type").notNull(),
  description: text("description"),
  status: text("status", { enum: ["pending", "approved", "rejected", "completed"] }).default("pending"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});
