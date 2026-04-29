# API Specifications — Safahati

**Prepared by:** Backend Engineer  
**Date:** April 2026  
**Base URL:** `https://app.safahati.com/api`  
**Auth:** JWT via NextAuth v5 session cookie (httpOnly)  
**Format:** All requests and responses are `application/json` unless noted

---

## Conventions

### Authentication
All protected endpoints require a valid session. The session is validated server-side via `auth()` from NextAuth v5. No API key mechanism exists yet.

### Error response format
All error responses follow this structure:
```json
{
  "error": "Human-readable message",
  "code": "MACHINE_READABLE_CODE",
  "details": {}  // optional Zod validation errors
}
```

### Standard HTTP status codes used
| Code | Meaning |
|---|---|
| 200 | Success (GET, PUT) |
| 201 | Created (POST) |
| 400 | Validation error / bad request |
| 401 | Not authenticated |
| 403 | Authenticated but not authorized for this resource |
| 404 | Resource not found |
| 409 | Conflict (e.g., duplicate email/slug) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## 1. Authentication

### POST /api/auth/register

Register a new user account.

**Auth required:** No  
**Rate limit:** 5 requests per IP per hour

**Request body:**
```ts
// Zod schema (to be implemented)
const RegisterSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8).max(72),
  // Optional fields for extended registration
  phone: z.string().regex(/^\+?[0-9]{7,15}$/).optional(),
  country: z.string().length(2).optional(),  // ISO 3166-1 alpha-2
});
```

```json
{
  "name": "Ahmed Al-Rashidi",
  "email": "ahmed@example.com",
  "password": "SecurePassword123!",
  "phone": "+966501234567",
  "country": "SA"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Account created successfully"
}
```

**Error responses:**
```json
// 400 — validation failure
{ "error": "Validation failed", "code": "VALIDATION_ERROR", "details": { "fieldErrors": { "email": ["Invalid email"] } } }

// 409 — email already registered
{ "error": "Email already registered", "code": "EMAIL_EXISTS" }
```

---

### POST /api/auth/[...nextauth]

Handled by NextAuth v5. Relevant sub-routes:

- `POST /api/auth/signin` — credential login
- `GET /api/auth/session` — current session info
- `POST /api/auth/signout` — end session

**Credentials login request:**
```json
{
  "email": "ahmed@example.com",
  "password": "SecurePassword123!"
}
```

**Session response:**
```json
{
  "user": {
    "id": "uuid-string",
    "name": "Ahmed Al-Rashidi",
    "email": "ahmed@example.com"
  },
  "expires": "2026-05-25T00:00:00.000Z"
}
```

---

### POST /api/auth/send-otp *(proposed)*

Send a 6-digit OTP to a user's phone number for phone verification.

**Auth required:** Yes  
**Rate limit:** 3 requests per user per 15 minutes

**Request body:**
```ts
const SendOtpSchema = z.object({
  phone: z.string().regex(/^\+[0-9]{7,15}$/),
});
```

**Response 200:**
```json
{
  "success": true,
  "message": "OTP sent",
  "expiresIn": 600
}
```

**Implementation note:** Store `otp:{email}` = hashed OTP in Redis with TTL 600s.

---

### POST /api/auth/verify-otp *(proposed)*

Verify OTP and mark phone as verified.

**Auth required:** Yes  
**Rate limit:** 5 attempts per phone per 15 minutes

**Request body:**
```ts
const VerifyOtpSchema = z.object({
  phone: z.string().regex(/^\+[0-9]{7,15}$/),
  otp: z.string().length(6).regex(/^[0-9]{6}$/),
});
```

**Response 200:**
```json
{
  "success": true,
  "phoneVerified": true
}
```

**Error responses:**
```json
// 400 — wrong OTP
{ "error": "Invalid or expired OTP", "code": "INVALID_OTP" }

// 429 — too many attempts
{ "error": "Too many attempts. Try again in 15 minutes.", "code": "RATE_LIMITED" }
```

---

## 2. Sites

### GET /api/sites

List all sites owned by the authenticated user.

**Auth required:** Yes  
**Rate limit:** 60 requests per user per minute

**Response 200:**
```json
{
  "sites": [
    {
      "id": "uuid",
      "name": "My Restaurant",
      "slug": "my-restaurant",
      "industry": "restaurant",
      "language": "ar",
      "status": "published",
      "aiGenerated": false,
      "createdAt": "2026-04-01T10:00:00.000Z",
      "updatedAt": "2026-04-15T14:30:00.000Z"
    }
  ]
}
```

---

### POST /api/sites

Create a new site with default sections from the industry template.

**Auth required:** Yes  
**Rate limit:** 10 sites per user per day

**Request body:**
```ts
const CreateSiteSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  industry: z.enum([
    "company", "agency", "freelancer", "resume",
    "restaurant", "clinic", "real_estate", "saas",
    "ecommerce", "event", "photography", "law_firm", "gym"
  ]),
  language: z.enum(["en", "ar"]).default("en"),
  businessType: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
});
```

```json
{
  "name": "مطعم الأصالة",
  "industry": "restaurant",
  "language": "ar",
  "city": "Riyadh"
}
```

**Response 201:**
```json
{
  "site": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "slug": "restaurant-alosala",
    "name": "مطعم الأصالة",
    "industry": "restaurant",
    "language": "ar",
    "status": "draft"
  }
}
```

**Error responses:**
```json
// 400 — invalid industry
{ "error": "Validation failed", "code": "VALIDATION_ERROR", "details": { "fieldErrors": { "industry": ["Invalid enum value"] } } }

// 401 — stale session
{ "error": "Session expired — please log out and log back in", "code": "STALE_SESSION" }

// 409 — slug conflict (internal, handled by counter — should not surface)
```

---

### GET /api/sites/[siteId]

Get full site data including all sections.

**Auth required:** Yes (must be site owner)  
**Rate limit:** 120 requests per user per minute

**URL params:** `siteId` (UUID)

**Response 200:**
```json
{
  "site": {
    "id": "uuid",
    "name": "My Restaurant",
    "slug": "my-restaurant",
    "industry": "restaurant",
    "language": "ar",
    "status": "draft",
    "theme": {
      "primaryColor": "#D97706",
      "secondaryColor": "#92400E",
      "fontFamily": "Cairo",
      "direction": "rtl"
    },
    "description": "Authentic Saudi cuisine",
    "whatsapp": "+966501234567",
    "city": "Riyadh",
    "aiGenerated": false,
    "createdAt": "2026-04-01T10:00:00.000Z",
    "updatedAt": "2026-04-15T14:30:00.000Z"
  },
  "sections": [
    {
      "id": "uuid",
      "blockType": "hero",
      "templateId": "hero-template-03",
      "config": {
        "heading": "مرحباً بكم في مطعم الأصالة",
        "subheading": "أصالة الطعم السعودي",
        "ctaText": "احجز طاولتك",
        "ctaUrl": "#contact"
      },
      "sortOrder": 1,
      "isVisible": true
    }
  ]
}
```

**Error responses:**
```json
// 404 — not found or not owned by user
{ "error": "Site not found", "code": "SITE_NOT_FOUND" }
```

---

### PUT /api/sites/[siteId]

Update site metadata (name, language, status, theme).

**Auth required:** Yes (must be site owner)  
**Rate limit:** 60 requests per user per minute

**Request body:**
```ts
const UpdateSiteSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  language: z.enum(["en", "ar"]).optional(),
  status: z.enum(["draft", "published"]).optional(),
  theme: z.object({
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    fontFamily: z.string().max(100),
    direction: z.enum(["ltr", "rtl"]),
  }).partial().optional(),
  description: z.string().max(500).optional(),
  whatsapp: z.string().regex(/^\+?[0-9]{7,15}$/).optional(),
  city: z.string().max(100).optional(),
  businessType: z.string().max(100).optional(),
  keywordTags: z.array(z.string().max(50)).max(20).optional(),
});
```

**Response 200:**
```json
{
  "success": true
}
```

---

### DELETE /api/sites/[siteId]

Permanently delete a site and all its sections.

**Auth required:** Yes (must be site owner)  
**Rate limit:** 10 requests per user per hour

**Response 200:**
```json
{
  "success": true
}
```

---

## 3. Sections

### GET /api/sites/[siteId]/sections

Get all sections for a site ordered by sort_order.

**Auth required:** Yes (must be site owner)  
**Rate limit:** 120 requests per user per minute

**Response 200:**
```json
{
  "sections": [
    {
      "id": "uuid",
      "blockType": "navbar",
      "templateId": "navbar-template-01",
      "config": { "logo": "My Site", "sticky": true },
      "sortOrder": 0,
      "isVisible": true
    },
    {
      "id": "uuid",
      "blockType": "hero",
      "templateId": "hero-template-01",
      "config": { "heading": "Welcome", "subheading": "Subtitle" },
      "sortOrder": 1,
      "isVisible": true
    }
  ]
}
```

---

### PUT /api/sites/[siteId]/sections

Replace all sections for a site (full replace, not partial update). Runs inside a DB transaction.

**Auth required:** Yes (must be site owner)  
**Rate limit:** 30 requests per user per minute

**Request body:**
```ts
const SectionSchema = z.object({
  id: z.string().uuid().optional(),
  blockType: z.string().min(1).max(100),
  templateId: z.string().min(1).max(100),
  config: z.record(z.unknown()),
  sortOrder: z.number().int().min(0),
  isVisible: z.boolean().default(true),
});

const UpdateSectionsSchema = z.object({
  sections: z.array(SectionSchema).min(1).max(50),
});
```

**Response 200:**
```json
{
  "success": true
}
```

**Error responses:**
```json
// 400 — not an array
{ "error": "Validation failed", "code": "VALIDATION_ERROR", "details": { "fieldErrors": { "sections": ["Required"] } } }
```

---

## 4. Publishing

### POST /api/sites/[siteId]/publish *(proposed)*

Publish a site. Validates required sections exist (navbar, hero, footer) before publishing. Invalidates Redis cache.

**Auth required:** Yes (must be site owner)  
**Rate limit:** 10 requests per user per hour

**Request body:** None

**Response 200:**
```json
{
  "success": true,
  "url": "https://my-restaurant.safahati.com"
}
```

**Error responses:**
```json
// 400 — missing required sections
{
  "error": "Site cannot be published",
  "code": "PUBLISH_VALIDATION_FAILED",
  "details": {
    "missing": ["navbar", "footer"],
    "message": "Add a navbar and footer before publishing"
  }
}
```

**Implementation:**
```ts
// src/app/api/sites/[siteId]/publish/route.ts
export async function POST(request: Request, { params }) {
  const { siteId } = await params;
  const session = await auth();
  // ... ownership check ...

  const sections = await db.select().from(schema.sections)
    .where(eq(schema.sections.siteId, siteId));

  const blockTypes = sections.map(s => s.blockType);
  const required = ["navbar", "hero", "footer"];
  const missing = required.filter(t => !blockTypes.includes(t));

  if (missing.length > 0) {
    return NextResponse.json({ error: "...", missing }, { status: 400 });
  }

  await db.update(schema.sites)
    .set({ status: "published", updatedAt: new Date() })
    .where(eq(schema.sites.id, siteId));

  // Invalidate Redis cache
  await redis.del(`site:config:${site.slug}`);

  return NextResponse.json({ success: true, url: `https://${site.slug}.safahati.com` });
}
```

---

### POST /api/sites/[siteId]/unpublish *(proposed)*

Set site back to draft status.

**Auth required:** Yes (must be site owner)

**Response 200:**
```json
{ "success": true }
```

---

## 5. Custom Domains

### GET /api/sites/[siteId]/domains *(proposed)*

List custom domains configured for a site.

**Auth required:** Yes

**Response 200:**
```json
{
  "domains": [
    {
      "id": "uuid",
      "domain": "www.my-restaurant.com",
      "verified": true,
      "createdAt": "2026-04-10T10:00:00.000Z"
    }
  ]
}
```

---

### POST /api/sites/[siteId]/domains *(proposed)*

Add a custom domain to a site.

**Auth required:** Yes  
**Rate limit:** 5 requests per user per day

**Request body:**
```ts
const AddDomainSchema = z.object({
  domain: z.string()
    .min(4)
    .max(253)
    .regex(/^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i)
    .transform(v => v.toLowerCase()),
});
```

**Response 201:**
```json
{
  "domain": {
    "id": "uuid",
    "domain": "www.my-restaurant.com",
    "verified": false
  },
  "verificationRecord": {
    "type": "CNAME",
    "name": "www",
    "value": "my-restaurant.safahati.com",
    "instructions": "Add this CNAME record to your DNS provider to complete verification"
  }
}
```

---

### POST /api/sites/[siteId]/domains/[domainId]/verify *(proposed)*

Trigger DNS verification check for a domain.

**Auth required:** Yes

**Response 200:**
```json
{
  "verified": true,
  "domain": "www.my-restaurant.com"
}
```

**Error responses:**
```json
// 400 — DNS not yet propagated
{
  "error": "Domain not verified",
  "code": "DNS_NOT_VERIFIED",
  "details": {
    "expected": "my-restaurant.safahati.com",
    "found": null,
    "message": "CNAME record not found. DNS changes can take up to 24 hours."
  }
}
```

---

### DELETE /api/sites/[siteId]/domains/[domainId] *(proposed)*

Remove a custom domain.

**Auth required:** Yes

**Response 200:**
```json
{ "success": true }
```

---

## 6. AI Content Generation

### POST /api/ai/generate-copy *(proposed)*

Generate website copy for a specific section using Claude AI.

**Auth required:** Yes  
**Rate limit:** 20 requests per user per day (plan-based limits)

**Request body:**
```ts
const GenerateCopySchema = z.object({
  siteId: z.string().uuid(),
  blockType: z.enum(["hero", "about", "services", "cta", "faq"]),
  language: z.enum(["en", "ar"]).default("en"),
  businessContext: z.object({
    name: z.string().max(100),
    industry: z.string().max(100),
    description: z.string().max(500).optional(),
    city: z.string().max(100).optional(),
    tone: z.enum(["professional", "friendly", "luxury", "modern"]).default("professional"),
  }),
  existingContent: z.record(z.string()).optional(),
});
```

```json
{
  "siteId": "uuid",
  "blockType": "hero",
  "language": "ar",
  "businessContext": {
    "name": "مطعم الأصالة",
    "industry": "restaurant",
    "description": "مطعم سعودي أصيل في الرياض",
    "city": "Riyadh",
    "tone": "luxury"
  }
}
```

**Response 200 (streaming via Vercel AI SDK):**
```json
{
  "content": {
    "heading": "تجربة طعام لا تُنسى",
    "headingAr": "تجربة طعام لا تُنسى",
    "subheading": "أصالة النكهة السعودية في قلب الرياض",
    "subheadingAr": "أصالة النكهة السعودية في قلب الرياض",
    "ctaText": "احجز طاولتك الآن",
    "ctaTextAr": "احجز طاولتك الآن"
  },
  "tokensUsed": 320
}
```

**Error responses:**
```json
// 403 — free plan limit reached
{
  "error": "AI generation limit reached",
  "code": "AI_QUOTA_EXCEEDED",
  "details": {
    "limit": 5,
    "used": 5,
    "resetAt": "2026-05-01T00:00:00.000Z",
    "upgradeUrl": "/pricing"
  }
}
```

---

### POST /api/ai/generate-site *(proposed)*

Generate a full site configuration from a brief prompt. Creates the site and all sections.

**Auth required:** Yes  
**Rate limit:** 3 requests per user per day

**Request body:**
```ts
const GenerateSiteSchema = z.object({
  prompt: z.string().min(20).max(1000),
  industry: z.enum([/* same enum as CreateSiteSchema */]),
  language: z.enum(["en", "ar"]).default("en"),
  name: z.string().min(2).max(100),
});
```

**Response 201:**
```json
{
  "site": {
    "id": "uuid",
    "slug": "generated-site-slug",
    "name": "Site Name"
  },
  "sectionsGenerated": 6,
  "aiGenerated": true
}
```

---

## 7. File Upload

### POST /api/upload

Upload an image file. Returns a URL to the stored file.

**Auth required:** Yes (to be implemented — currently unprotected)  
**Rate limit:** 30 requests per user per hour, max 20MB total per day

**Request:** `multipart/form-data`
- `file` — image file (JPEG, PNG, GIF, WebP, SVG, AVIF)
- Max size: 5MB per file

**Response 200:**
```json
{
  "url": "/uploads/1745640000000-a1b2c3d4.webp",
  "filename": "1745640000000-a1b2c3d4.webp"
}
```

**Error responses:**
```json
// 400 — wrong type
{ "error": "File type not allowed. Use JPEG, PNG, GIF, WebP, SVG, or AVIF.", "code": "INVALID_FILE_TYPE" }

// 400 — too large
{ "error": "File too large. Maximum size is 5MB.", "code": "FILE_TOO_LARGE" }

// 401 — not authenticated (to be added)
{ "error": "Unauthorized", "code": "UNAUTHORIZED" }
```

**Future change:** Replace local filesystem storage with MinIO pre-signed URL flow:
1. Client calls `POST /api/upload/presign` → gets pre-signed S3 URL
2. Client uploads directly to MinIO/S3
3. Client calls `POST /api/upload/confirm` with the file key → server validates and returns CDN URL

---

## 8. Analytics

### GET /api/sites/[siteId]/analytics *(proposed)*

Get view and engagement stats for a published site.

**Auth required:** Yes  
**Rate limit:** 30 requests per user per minute

**Query params:**
- `period`: `7d` | `30d` | `90d` (default: `30d`)

**Response 200:**
```json
{
  "period": "30d",
  "summary": {
    "totalViews": 1240,
    "uniqueVisitors": 890,
    "avgTimeOnPage": 95,
    "bounceRate": 0.43
  },
  "daily": [
    { "date": "2026-04-01", "views": 45, "visitors": 38 },
    { "date": "2026-04-02", "views": 52, "visitors": 41 }
  ],
  "topReferrers": [
    { "source": "google.com", "visits": 312 },
    { "source": "instagram.com", "visits": 187 }
  ]
}
```

---

### POST /api/analytics/event *(proposed)*

Track a page view or interaction event from a published site.

**Auth required:** No (public endpoint — for visitor tracking)  
**Rate limit:** 100 requests per IP per minute

**Request body:**
```ts
const TrackEventSchema = z.object({
  siteId: z.string().uuid(),
  event: z.enum(["page_view", "cta_click", "contact_submit", "whatsapp_click"]),
  path: z.string().max(500).optional(),
  referrer: z.string().url().optional(),
});
```

**Response 200:**
```json
{ "recorded": true }
```

---

## 9. Subscriptions / Billing

### GET /api/subscriptions/current *(proposed)*

Get the current user's subscription plan and limits.

**Auth required:** Yes

**Response 200:**
```json
{
  "plan": "starter",
  "status": "active",
  "limits": {
    "sites": 5,
    "aiGenerationsPerDay": 20,
    "customDomains": 2,
    "storage": "500MB"
  },
  "usage": {
    "sites": 2,
    "aiGenerationsToday": 7
  },
  "currentPeriodEnd": "2026-05-25T00:00:00.000Z",
  "stripeCustomerPortalUrl": "https://billing.stripe.com/session/..."
}
```

---

### POST /api/subscriptions/checkout *(proposed)*

Create a Stripe Checkout session for plan upgrade.

**Auth required:** Yes  
**Rate limit:** 10 requests per user per hour

**Request body:**
```ts
const CheckoutSchema = z.object({
  plan: z.enum(["starter", "pro"]),
  billingPeriod: z.enum(["monthly", "annual"]).default("monthly"),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});
```

**Response 200:**
```json
{
  "checkoutUrl": "https://checkout.stripe.com/c/pay/...",
  "sessionId": "cs_test_..."
}
```

---

### POST /api/webhooks/stripe *(proposed)*

Receive Stripe webhook events for subscription lifecycle management.

**Auth required:** No (verified by Stripe signature)  
**Security:** Must validate `stripe-signature` header using `stripe.webhooks.constructEvent()`

**Handled events:**
- `customer.subscription.created` → update subscription status
- `customer.subscription.updated` → update plan/status
- `customer.subscription.deleted` → downgrade to free
- `invoice.payment_failed` → send dunning email, set status to `past_due`

**Response 200:**
```json
{ "received": true }
```

---

## 10. Public Site API (No Auth)

### GET /api/public/sites/[slug]

Return the published site config for subdomain rendering. Used by the site renderer.

**Auth required:** No  
**Cache:** Redis TTL 300 seconds  
**Rate limit:** 200 requests per IP per minute

**Response 200:**
```json
{
  "site": {
    "id": "uuid",
    "name": "My Restaurant",
    "slug": "my-restaurant",
    "language": "ar",
    "theme": { "primaryColor": "#D97706", "direction": "rtl" }
  },
  "sections": [/* ordered section array */]
}
```

**Response 404:**
```json
{ "error": "Site not found or not published", "code": "SITE_NOT_FOUND" }
```

---

## Rate Limiting Reference

| Endpoint | Limit | Window | Scope |
|---|---|---|---|
| POST /api/auth/register | 5 | 1 hour | Per IP |
| POST /api/auth/signin | 10 | 15 min | Per IP |
| POST /api/auth/send-otp | 3 | 15 min | Per user |
| GET /api/sites | 60 | 1 min | Per user |
| POST /api/sites | 10 | 1 day | Per user |
| PUT /api/sites/[siteId] | 60 | 1 min | Per user |
| DELETE /api/sites/[siteId] | 10 | 1 hour | Per user |
| PUT /api/sites/[siteId]/sections | 30 | 1 min | Per user |
| POST /api/ai/generate-copy | 20 | 1 day | Per user |
| POST /api/ai/generate-site | 3 | 1 day | Per user |
| POST /api/upload | 30 | 1 hour | Per user |
| POST /api/analytics/event | 100 | 1 min | Per IP |
| GET /api/public/sites/[slug] | 200 | 1 min | Per IP |

---

## Proposed Rate Limiter Implementation

```ts
// src/lib/rate-limit.ts
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

interface RateLimitConfig {
  limit: number;
  window: number; // seconds
}

export async function rateLimit(
  key: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - config.window;

  const pipe = redis.pipeline();
  pipe.zremrangebyscore(key, 0, windowStart);
  pipe.zadd(key, now, `${now}-${Math.random()}`);
  pipe.zcard(key);
  pipe.expire(key, config.window);

  const results = await pipe.exec();
  const count = results![2][1] as number;

  return {
    allowed: count <= config.limit,
    remaining: Math.max(0, config.limit - count),
    resetAt: now + config.window,
  };
}
```

Usage in a route handler:
```ts
const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
const { allowed, remaining, resetAt } = await rateLimit(
  `rl:register:${ip}`,
  { limit: 5, window: 3600 }
);

if (!allowed) {
  return NextResponse.json(
    { error: "Rate limit exceeded. Try again later.", code: "RATE_LIMITED" },
    {
      status: 429,
      headers: {
        "X-RateLimit-Limit": "5",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(resetAt),
        "Retry-After": String(resetAt - Math.floor(Date.now() / 1000)),
      },
    }
  );
}
```
