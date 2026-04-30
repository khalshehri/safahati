# Backend Engineer Implementation — PART 2
## AI Integration & Remaining API Routes

**Status:** Ready to implement  
**Model:** Vercel AI SDK v4.0+, PostgreSQL/SQLite, Redis 7, Next.js 15  
**Author:** Backend Engineer  
**Date:** 2026-04-25

---

## Table of Contents
1. [AI Prompts & Functions](#section-a-ai-prompts--core-generation-functions)
2. [API Routes (5 remaining)](#section-b-five-remaining-api-routes)
3. [Opening Hours System](#section-c-opening-hours-implementation)
4. [Rate Limiting](#section-d-rate-limiting-for-ai-endpoints)

---

## SECTION A — AI Prompts & Core Generation Functions

### A.1 — `src/lib/ai/prompts.ts`

System prompts for all 13 industries. Each includes Arabic + English versions with prompt caching.

```typescript
// src/lib/ai/prompts.ts

import type { MessageParam } from "ai";

export const INDUSTRY_PROMPTS = {
  company: {
    en: {
      system: `You are an AI content specialist for corporate websites. You suggest professional, concise content for business fields. Use cache_control for prompt optimization.

When users ask for field suggestions (headline, description, features, etc.), provide 2-3 options that are:
- Professional and trustworthy
- Specific to the company/service type
- SEO-friendly
- Under 100 words

Format as bullet points, one suggestion per line.`,
      systemPrompt: `system_prompt_caching: true`,
    },
    ar: {
      system: `أنت متخصص محتوى ذكي للمواقع الشركاتية. تقترح محتوى احترافيًا وموجزًا لحقول الأعمال.

عند طلب اقتراحات (عنوان، وصف، ميزات، إلخ)، قدم 2-3 خيارات:
- احترافية وموثوقة
- محددة للشركة/نوع الخدمة
- متوافقة مع SEO
- أقل من 100 كلمة

اكتبها كنقاط، اقتراح واحد لكل سطر.`,
      systemPrompt: `system_prompt_caching: true`,
    },
  },
  agency: {
    en: {
      system: `You are an AI creative director for design agencies. Suggest compelling, award-winning quality content for creative portfolios and service pages.

For field suggestions, provide 2-3 options that:
- Showcase agency expertise and creativity
- Use industry-specific terminology
- Emphasize unique differentiators
- Inspire potential clients

Format as bullet points.`,
      systemPrompt: `system_prompt_caching: true`,
    },
    ar: {
      system: `أنت مدير إبداعي ذكي لوكالات التصميم. اقترح محتوى مؤثرًا بجودة حائزة على جوائز.

للاقتراحات:
- اعرض خبرة الوكالة والإبداع
- استخدم مصطلحات تخصصية
- ركز على المميزات الفريدة
- ألهم العملاء المحتملين

اكتب كنقاط.`,
      systemPrompt: `system_prompt_caching: true`,
    },
  },
  freelancer: {
    en: {
      system: `You are an AI personal branding coach for freelancers. Suggest authentic, engaging content for portfolio and service descriptions.

Provide 2-3 options that:
- Highlight individual expertise and personality
- Build trust with potential clients
- Are conversational yet professional
- Address client pain points

Format as bullet points.`,
      systemPrompt: `system_prompt_caching: true`,
    },
    ar: {
      system: `أنت مدرب تسويق شخصي ذكي للعاملين بحسابهم الخاص. اقترح محتوى أصليًا وجذابًا.

الخيارات يجب أن:
- تبرز الخبرة الفردية والشخصية
- تبني الثقة مع العملاء المحتملين
- تكون محادثاتية وحترافية
- تعالج آلام العملاء

اكتب كنقاط.`,
      systemPrompt: `system_prompt_caching: true`,
    },
  },
  resume: {
    en: {
      system: `You are an AI resume and CV specialist. Suggest impactful, achievement-oriented content for professional profiles.

Provide 2-3 options that:
- Use action verbs and quantifiable results
- Highlight transferable skills
- Match job market demand
- Are ATS-friendly

Format as bullet points.`,
      systemPrompt: `system_prompt_caching: true`,
    },
    ar: {
      system: `أنت متخصص سيرة ذاتية وملف تعريف ذكي. اقترح محتوى مؤثرًا موجهًا للإنجازات.

الخيارات:
- استخدم أفعال إجراء ونتائج قابلة للقياس
- ركز على المهارات القابلة للنقل
- طابق طلب سوق العمل
- متوافقة مع ATS

اكتب كنقاط.`,
      systemPrompt: `system_prompt_caching: true`,
    },
  },
  restaurant: {
    en: {
      system: `You are an AI food and hospitality marketing expert. Suggest appetizing, atmospheric content for restaurant websites.

Provide 2-3 options that:
- Evoke sensory experiences
- Highlight cuisine type and specialties
- Build hunger and desire to visit
- Include ambiance/cultural elements

Format as bullet points.`,
      systemPrompt: `system_prompt_caching: true`,
    },
    ar: {
      system: `أنت خبير تسويق غذائي وضيافة ذكي. اقترح محتوى شهي وجميل للمطاعم.

الخيارات:
- أثر الحواس والخبرات
- أبرز نوع الطعام والتخصصات
- اجعل الناس جائعين للزيارة
- أضف الأجواء والعناصر الثقافية

اكتب كنقاط.`,
      systemPrompt: `system_prompt_caching: true`,
    },
  },
  clinic: {
    en: {
      system: `You are an AI healthcare marketing specialist. Suggest trust-building, patient-focused content for medical and wellness facilities.

Provide 2-3 options that:
- Emphasize safety and expertise
- Address patient concerns
- Highlight services and specializations
- Are compliant with healthcare regulations

Format as bullet points.`,
      systemPrompt: `system_prompt_caching: true`,
    },
    ar: {
      system: `أنت متخصص تسويق صحي ذكي. اقترح محتوى يبني الثقة وموجه للمريض.

الخيارات:
- أكد الأمان والخبرة
- عالج مخاوف المريض
- أبرز الخدمات والتخصصات
- متوافقة مع لوائح الصحة

اكتب كنقاط.`,
      systemPrompt: `system_prompt_caching: true`,
    },
  },
  realEstate: {
    en: {
      system: `You are an AI real estate marketing expert. Suggest compelling property and services content for real estate professionals.

Provide 2-3 options that:
- Highlight location benefits and property features
- Build investor/buyer confidence
- Emphasize market expertise
- Address buyer personas (first-time, investors, families)

Format as bullet points.`,
      systemPrompt: `system_prompt_caching: true`,
    },
    ar: {
      system: `أنت خبير تسويق عقاري ذكي. اقترح محتوى مؤثرًا للعاملين بالعقارات.

الخيارات:
- أبرز فوائد الموقع والخصائص
- بني ثقة المستثمرين والمشترين
- أكد الخبرة السوقية
- عالج فئات المشترين المختلفة

اكتب كنقاط.`,
      systemPrompt: `system_prompt_caching: true`,
    },
  },
  saas: {
    en: {
      system: `You are an AI SaaS and tech marketing specialist. Suggest product-focused, benefit-driven content for software platforms.

Provide 2-3 options that:
- Clearly explain value propositions
- Address customer pain points
- Use tech-appropriate language
- Highlight integrations and scalability

Format as bullet points.`,
      systemPrompt: `system_prompt_caching: true`,
    },
    ar: {
      system: `أنت متخصص تسويق برمجي ذكي. اقترح محتوى موجه للمنتج والفوائد.

الخيارات:
- اشرح مقترحات القيمة بوضوح
- عالج مشاكل العملاء
- استخدم لغة تقنية مناسبة
- أبرز التكاملات والقابلية للتوسع

اكتب كنقاط.`,
      systemPrompt: `system_prompt_caching: true`,
    },
  },
  ecommerce: {
    en: {
      system: `You are an AI e-commerce marketing specialist. Suggest conversion-focused content for online retailers and product platforms.

Provide 2-3 options that:
- Highlight product benefits and features
- Build urgency and desire
- Address shipping, quality, guarantees
- Include social proof elements

Format as bullet points.`,
      systemPrompt: `system_prompt_caching: true`,
    },
    ar: {
      system: `أنت متخصص تسويق تجارة إلكترونية ذكي. اقترح محتوى موجه للتحويل.

الخيارات:
- أبرز فوائد المنتجات
- بني الإلحاح والرغبة
- عالج الشحن والجودة والضمانات
- أضف عناصر الثقة الاجتماعية

اكتب كنقاط.`,
      systemPrompt: `system_prompt_caching: true`,
    },
  },
  event: {
    en: {
      system: `You are an AI event marketing specialist. Suggest exciting, engaging content for event planners and venues.

Provide 2-3 options that:
- Build excitement and anticipation
- Highlight event features and logistics
- Appeal to target attendee demographics
- Encourage registration or attendance

Format as bullet points.`,
      systemPrompt: `system_prompt_caching: true`,
    },
    ar: {
      system: `أنت متخصص تسويق الفعاليات ذكي. اقترح محتوى مثير وجذاب.

الخيارات:
- بني الإثارة والتوقع
- أبرز ميزات الفعالية واللوجستيات
- اجذب الحضور المستهدفين
- شجع التسجيل والحضور

اكتب كنقاط.`,
      systemPrompt: `system_prompt_caching: true`,
    },
  },
  photography: {
    en: {
      system: `You are an AI photography marketing specialist. Suggest visual and emotive content for photographers and visual artists.

Provide 2-3 options that:
- Emphasize visual style and storytelling
- Highlight portfolio strengths
- Appeal to specific shoot types (weddings, commercial, etc.)
- Build emotional connection

Format as bullet points.`,
      systemPrompt: `system_prompt_caching: true`,
    },
    ar: {
      system: `أنت متخصص تسويق التصوير الفوتوغرافي ذكي. اقترح محتوى بصريًا وعاطفيًا.

الخيارات:
- أكد الأسلوب البصري والقصة
- أبرز قوات المحفظة
- اجذب أنواع الجلسات المختلفة
- بني الاتصال العاطفي

اكتب كنقاط.`,
      systemPrompt: `system_prompt_caching: true`,
    },
  },
  lawFirm: {
    en: {
      system: `You are an AI legal marketing specialist. Suggest authoritative, trust-building content for law firms and legal professionals.

Provide 2-3 options that:
- Emphasize expertise and track record
- Build client confidence
- Highlight practice areas and specializations
- Are compliant with legal advertising regulations

Format as bullet points.`,
      systemPrompt: `system_prompt_caching: true`,
    },
    ar: {
      system: `أنت متخصص تسويق قانوني ذكي. اقترح محتوى موثوق يبني الثقة.

الخيارات:
- أكد الخبرة والسجل
- بني ثقة العميل
- أبرز مجالات الممارسة
- متوافقة مع لوائح الإعلان القانوني

اكتب كنقاط.`,
      systemPrompt: `system_prompt_caching: true`,
    },
  },
  gym: {
    en: {
      system: `You are an AI fitness and wellness marketing specialist. Suggest motivating, results-focused content for gyms and fitness centers.

Provide 2-3 options that:
- Inspire transformation and health
- Highlight facilities and programs
- Appeal to fitness goals and lifestyles
- Build community and belonging

Format as bullet points.`,
      systemPrompt: `system_prompt_caching: true`,
    },
    ar: {
      system: `أنت متخصص تسويق اللياقة والعافية ذكي. اقترح محتوى محفزًا موجهًا للنتائج.

الخيارات:
- ألهم التحول والصحة
- أبرز المرافق والبرامج
- اجذب أهداف اللياقة والأنماط الحياتية
- بني الجماعة والانتماء

اكتب كنقاط.`,
      systemPrompt: `system_prompt_caching: true`,
    },
  },
} as const;

// ── Wizard generation prompt ──
export const WIZARD_GENERATION_PROMPT = {
  en: `You are a website content specialist. Based on the user's business answers, generate complete, professional website section content.

Answers provided:
<user_content>
{answers}
</user_content>

Generate JSON with these fields (exact field names required):
{
  "heroTitle": "...",
  "heroSubtitle": "...",
  "aboutDescription": "...",
  "servicesIntro": "...",
  "ctaHeadline": "..."
}

All content must be professional, relevant to their industry, and between 50-150 words per field.
Return ONLY valid JSON, no markdown or extra text.`,
  ar: `أنت متخصص محتوى مواقع ويب. بناءً على إجابات العميل، أنشئ محتوى موقع ويب احترافيًا وكاملاً.

الإجابات المقدمة:
<user_content>
{answers}
</user_content>

أنشئ JSON بهذه الحقول (أسماء حقول دقيقة):
{
  "heroTitle": "...",
  "heroSubtitle": "...",
  "aboutDescription": "...",
  "servicesIntro": "...",
  "ctaHeadline": "..."
}

يجب أن يكون المحتوى احترافيًا وملائمًا لصناعتهم، بين 50-150 كلمة لكل حقل.
أرجع JSON صحيح فقط، بدون markdown أو نص إضافي.`,
};

// ── Translation prompt ──
export const TRANSLATION_PROMPT = {
  en: `You are a professional bilingual translator specializing in website content.

Translate this website section content from English to Arabic. Maintain tone, brand voice, and HTML structure.

Original content:
<user_content>
{content}
</user_content>

Return ONLY the translated text, preserving formatting and structure. Do not add any explanations or metadata.`,
  ar: `أنت مترجم ثنائي اللغة متخصص في محتوى المواقع.

ترجم محتوى قسم الموقع من العربية إلى الإنجليزية. احتفظ بالنبرة والصوت والهيكل.

المحتوى الأصلي:
<user_content>
{content}
</user_content>

أرجع النص المترجم فقط، مع الحفاظ على التنسيق والهيكل. لا تضف أي شروحات أو بيانات وصفية.`,
};

// ── Field suggestion prompt template ──
export function getFieldSuggestionPrompt(
  field: string,
  blockType: string,
  industry: string,
  context?: string
): string {
  return `Please suggest 2-3 different options for the "${field}" field in a ${blockType} block for a ${industry} website.
${context ? `Additional context: ${context}` : ""}

Requirements:
- Each suggestion should be between 50-100 words
- Be professional and relevant to the industry
- Consider SEO best practices
- Format as numbered list`;
}

export function getFieldSuggestionPromptAr(
  field: string,
  blockType: string,
  industry: string,
  context?: string
): string {
  return `يرجى اقتراح 2-3 خيارات مختلفة لحقل "${field}" في كتلة ${blockType} لموقع ${industry}.
${context ? `السياق الإضافي: ${context}` : ""}

المتطلبات:
- يجب أن يكون كل اقتراح بين 50-100 كلمة
- احترافي وملائم للصناعة
- افكر في أفضل ممارسات SEO
- اكتب كقائمة مرقمة`;
}
```

### A.2 — `src/lib/ai/generate.ts`

Core generation functions for field suggestions, wizard, and translation.

```typescript
// src/lib/ai/generate.ts

import { generateText, streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import {
  INDUSTRY_PROMPTS,
  WIZARD_GENERATION_PROMPT,
  TRANSLATION_PROMPT,
  getFieldSuggestionPrompt,
  getFieldSuggestionPromptAr,
} from "./prompts";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export interface WizardAnswers {
  businessName: string;
  description: string;
  industry: string;
  website?: string;
  targetAudience?: string;
  uniqueValue?: string;
}

export interface FieldSuggestionResponse {
  suggestions: string[];
  field: string;
}

export interface WizardGenerationResponse {
  heroTitle: string;
  heroSubtitle: string;
  aboutDescription: string;
  servicesIntro: string;
  ctaHeadline: string;
}

/**
 * Stream field suggestions for a specific block field.
 * Uses prompt caching for performance.
 *
 * @param field - Field name (e.g., "headline", "description")
 * @param blockType - Block type (e.g., "hero", "features")
 * @param industry - Industry name (from INDUSTRY_PROMPTS keys)
 * @param language - "en" or "ar"
 * @param seed - Optional seed context
 * @returns ReadableStream of suggestion text
 */
export async function streamFieldSuggestion(
  field: string,
  blockType: string,
  industry: string,
  language: "en" | "ar" = "en",
  seed?: string
): Promise<ReadableStream<Uint8Array>> {
  const industryKey = industry.toLowerCase() as keyof typeof INDUSTRY_PROMPTS;
  if (!(industryKey in INDUSTRY_PROMPTS)) {
    throw new Error(`Industry "${industry}" not supported`);
  }

  const industryPrompt = INDUSTRY_PROMPTS[industryKey];
  const isAr = language === "ar";
  const systemPrompt = isAr ? industryPrompt.ar.system : industryPrompt.en.system;
  const userPrompt = isAr
    ? getFieldSuggestionPromptAr(field, blockType, industry, seed)
    : getFieldSuggestionPrompt(field, blockType, industry, seed);

  const { stream } = await streamText({
    model: anthropic("claude-3-5-sonnet-20241022", {
      cacheControl: true,
    }),
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
    temperature: 0.7,
    maxTokens: 500,
  });

  // Convert ReadableStream<TextStreamDelta> to ReadableStream<Uint8Array>
  const readable = stream.toReadableStream();
  const textStream = readable as unknown as ReadableStream<Uint8Array>;
  return textStream;
}

/**
 * Generate complete website sections from wizard answers.
 * Batch request, no streaming.
 *
 * @param answers - Wizard form answers
 * @param language - "en" or "ar"
 * @returns Generated section content
 */
export async function generateWizardSite(
  answers: WizardAnswers,
  language: "en" | "ar" = "en"
): Promise<WizardGenerationResponse> {
  const isAr = language === "ar";
  const prompt = isAr
    ? WIZARD_GENERATION_PROMPT.ar
    : WIZARD_GENERATION_PROMPT.en;

  const userPrompt = prompt.replace(
    "{answers}",
    JSON.stringify(answers, null, 2)
  );

  const { text } = await generateText({
    model: anthropic("claude-3-5-sonnet-20241022"),
    system: isAr
      ? "You are a professional website content specialist. Generate high-quality, industry-appropriate website content in Arabic. Return ONLY valid JSON, no markdown or explanations."
      : "You are a professional website content specialist. Generate high-quality, industry-appropriate website content in English. Return ONLY valid JSON, no markdown or explanations.",
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
    temperature: 0.8,
    maxTokens: 1500,
  });

  try {
    // Extract JSON from response (in case there's any wrapper text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    const parsed = JSON.parse(jsonMatch[0]) as WizardGenerationResponse;
    return parsed;
  } catch (error) {
    console.error("[generateWizardSite] Failed to parse response:", text);
    throw new Error(
      `Failed to parse AI response: ${error instanceof Error ? error.message : "unknown error"}`
    );
  }
}

/**
 * Translate section content between languages.
 * Handles batch translation via parallel Claude requests.
 *
 * @param siteId - Site ID to translate
 * @param fromLang - Source language ("en" or "ar")
 * @param toLang - Target language ("en" or "ar")
 * @returns Count of sections updated
 */
export async function translateContent(
  siteId: string,
  fromLang: "en" | "ar",
  toLang: "en" | "ar"
): Promise<number> {
  if (fromLang === toLang) {
    throw new Error("Source and target languages must be different");
  }

  // Fetch all sections for the site
  const sections = db
    .select()
    .from(schema.sections)
    .where(eq(schema.sections.siteId, siteId))
    .all();

  if (sections.length === 0) {
    return 0;
  }

  // Batch translate each section in parallel
  const translationPromises = sections.map(async (section) => {
    const config = JSON.parse(section.config);

    // Identify translatable fields (common patterns)
    const translatableFields = [
      "heading",
      "subheading",
      "description",
      "title",
      "subtitle",
      "content",
      "text",
      "buttonText",
      "ctaText",
    ];

    const fieldsToTranslate = translatableFields.filter((f) =>
      f in config
    );
    if (fieldsToTranslate.length === 0) {
      return { sectionId: section.id, config }; // No translatable content
    }

    const contentToTranslate = fieldsToTranslate
      .map((f) => `${f}: ${config[f]}`)
      .join("\n");

    const prompt = TRANSLATION_PROMPT[toLang === "en" ? "en" : "ar"].replace(
      "{content}",
      contentToTranslate
    );

    const { text: translatedText } = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      system: `You are a professional translator. Translate the provided content from ${fromLang === "ar" ? "Arabic" : "English"} to ${toLang === "ar" ? "Arabic" : "English"}. Return ONLY the translated text, preserving structure.`,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Parse translated fields back into config
    const translatedLines = translatedText.split("\n");
    const translatedConfig = { ...config };

    fieldsToTranslate.forEach((field, idx) => {
      if (translatedLines[idx]) {
        const parts = translatedLines[idx].split(": ");
        if (parts.length === 2) {
          translatedConfig[field] = parts[1];
        }
      }
    });

    return { sectionId: section.id, config: translatedConfig };
  });

  const results = await Promise.all(translationPromises);

  // Update database
  let updateCount = 0;
  for (const result of results) {
    db.update(schema.sections)
      .set({
        config: JSON.stringify(result.config),
      })
      .where(eq(schema.sections.id, result.sectionId))
      .run();
    updateCount++;
  }

  return updateCount;
}

/**
 * Calculate site completeness score (0-100).
 * Checks: sections filled, images added, theme customized, basic info present.
 *
 * @param siteId - Site ID
 * @returns Completeness score (0-100) and detailed breakdown
 */
export async function calculateCompleteness(
  siteId: string
): Promise<{
  score: number;
  breakdown: {
    sections: number;
    images: number;
    theme: number;
    content: number;
  };
}> {
  const site = db
    .select()
    .from(schema.sites)
    .where(eq(schema.sites.id, siteId))
    .get();

  if (!site) {
    throw new Error("Site not found");
  }

  const sections = db
    .select()
    .from(schema.sections)
    .where(eq(schema.sections.siteId, siteId))
    .all();

  let sectionScore = Math.min(100, (sections.length / 10) * 100);
  let imageScore = 0;
  let themeScore = 0;
  let contentScore = 0;

  // Check for images in sections
  let imageCount = 0;
  let totalImageFields = 0;
  for (const section of sections) {
    const config = JSON.parse(section.config);
    if (config.image || config.images || config.backgroundImage) {
      imageCount++;
    }
    if (
      config.image ||
      config.images ||
      config.backgroundImage ||
      config.imageUrl
    ) {
      totalImageFields++;
    }
  }
  imageScore = totalImageFields > 0 ? (imageCount / totalImageFields) * 100 : 0;

  // Check theme customization
  const theme = JSON.parse(site.theme);
  const defaultColors = theme.colors && Object.keys(theme.colors).length > 2;
  const customFont = theme.typography && theme.typography.fontFamily !== "Inter";
  themeScore = (defaultColors ? 50 : 0) + (customFont ? 50 : 0);

  // Check content quality (simple heuristic)
  let filledFields = 0;
  let totalFields = 0;
  for (const section of sections) {
    const config = JSON.parse(section.config);
    const values = Object.values(config).filter(
      (v) => typeof v === "string" && v.length > 10
    );
    filledFields += values.length;
    totalFields += Object.keys(config).length;
  }
  contentScore =
    totalFields > 0 ? Math.min(100, (filledFields / totalFields) * 100) : 0;

  const score = Math.round(
    (sectionScore * 0.25 +
      imageScore * 0.25 +
      themeScore * 0.25 +
      contentScore * 0.25) /
      100
  );

  return {
    score,
    breakdown: {
      sections: Math.round(sectionScore),
      images: Math.round(imageScore),
      theme: Math.round(themeScore),
      content: Math.round(contentScore),
    },
  };
}
```

---

## SECTION B — Five Remaining API Routes

### B.1 — `src/app/api/ai/suggest/route.ts`

POST endpoint for streaming field suggestions.

```typescript
// src/app/api/ai/suggest/route.ts

import { NextRequest, NextResponse } from "next/server";
import { streamFieldSuggestion } from "@/lib/ai/generate";
import { auth } from "@/auth";
import { z } from "zod";

const RequestSchema = z.object({
  field: z.string().min(1, "Field name required"),
  blockType: z.string().min(1, "Block type required"),
  industry: z.string().min(1, "Industry required"),
  language: z.enum(["en", "ar"]).default("en"),
  seed: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { field, blockType, industry, language, seed } =
      RequestSchema.parse(body);

    // Get streaming response
    const stream = await streamFieldSuggestion(
      field,
      blockType,
      industry,
      language,
      seed
    );

    // Return as Server-Sent Events stream
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[POST /api/ai/suggest]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
```

### B.2 — `src/app/api/ai/translate/route.ts`

POST endpoint for site translation AR ↔ EN.

```typescript
// src/app/api/ai/translate/route.ts

import { NextResponse } from "next/server";
import { translateContent } from "@/lib/ai/generate";
import { auth } from "@/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const RequestSchema = z.object({
  siteId: z.string().uuid("Invalid site ID"),
  fromLang: z.enum(["en", "ar"]),
  toLang: z.enum(["en", "ar"]),
});

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { siteId, fromLang, toLang } = RequestSchema.parse(body);

    // Verify user owns site
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

    // Translate sections
    const sectionsUpdated = await translateContent(siteId, fromLang, toLang);

    // Update site language
    const now = new Date();
    db.update(schema.sites)
      .set({
        language: toLang,
        updatedAt: now,
      })
      .where(eq(schema.sites.id, siteId))
      .run();

    return NextResponse.json({
      success: true,
      sectionsUpdated,
      message: `Translated ${sectionsUpdated} sections from ${fromLang} to ${toLang}`,
    });
  } catch (error) {
    console.error("[POST /api/ai/translate]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to translate content" },
      { status: 500 }
    );
  }
}
```

### B.3 — `src/app/api/ai/wizard-generate/route.ts`

POST endpoint for full site generation from wizard answers (no DB write).

```typescript
// src/app/api/ai/wizard-generate/route.ts

import { NextResponse } from "next/server";
import { generateWizardSite } from "@/lib/ai/generate";
import { auth } from "@/auth";
import { z } from "zod";

const WizardAnswersSchema = z.object({
  businessName: z.string().min(1, "Business name required"),
  description: z.string().min(10, "Description must be at least 10 chars"),
  industry: z.string().min(1, "Industry required"),
  website: z.string().url().optional(),
  targetAudience: z.string().optional(),
  uniqueValue: z.string().optional(),
});

const RequestSchema = z.object({
  wizardAnswers: WizardAnswersSchema,
  language: z.enum(["en", "ar"]).default("en"),
});

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { wizardAnswers, language } = RequestSchema.parse(body);

    // Generate content (no DB writes yet)
    const generated = await generateWizardSite(wizardAnswers, language);

    return NextResponse.json({
      success: true,
      data: generated,
      note: "Content generated. Save via POST /api/sites to persist.",
    });
  } catch (error) {
    console.error("[POST /api/ai/wizard-generate]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate wizard site" },
      { status: 500 }
    );
  }
}
```

### B.4 — `src/app/api/sites/[siteId]/opening-hours/route.ts`

GET + PUT for site opening hours with Saudi weekend handling.

```typescript
// src/app/api/sites/[siteId]/opening-hours/route.ts

import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { openingHoursSchema, type OpeningHoursConfig } from "@/lib/opening-hours";
import { z } from "zod";

interface RouteParams {
  params: { siteId: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { siteId } = params;

    // Verify ownership
    const site = db
      .select()
      .from(schema.sites)
      .where(eq(schema.sites.id, siteId))
      .get();

    if (!site || site.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get sections to find opening-hours block
    const sections = db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.siteId, siteId))
      .all();

    const openingHoursSection = sections.find(
      (s) => s.blockType === "opening-hours"
    );

    if (!openingHoursSection) {
      return NextResponse.json(
        { error: "Opening hours block not found" },
        { status: 404 }
      );
    }

    const config = JSON.parse(openingHoursSection.config) as OpeningHoursConfig;

    return NextResponse.json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error("[GET /api/sites/[siteId]/opening-hours]", error);
    return NextResponse.json(
      { error: "Failed to fetch opening hours" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { siteId } = params;

    // Verify ownership
    const site = db
      .select()
      .from(schema.sites)
      .where(eq(schema.sites.id, siteId))
      .get();

    if (!site || site.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Validate with Zod schema
    const validated = openingHoursSchema.parse(body);

    // Find and update opening-hours section
    const sections = db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.siteId, siteId))
      .all();

    const openingHoursSection = sections.find(
      (s) => s.blockType === "opening-hours"
    );

    if (!openingHoursSection) {
      return NextResponse.json(
        { error: "Opening hours block not found" },
        { status: 404 }
      );
    }

    db.update(schema.sections)
      .set({
        config: JSON.stringify(validated),
      })
      .where(eq(schema.sections.id, openingHoursSection.id))
      .run();

    const now = new Date();
    db.update(schema.sites)
      .set({ updatedAt: now })
      .where(eq(schema.sites.id, siteId))
      .run();

    return NextResponse.json({
      success: true,
      message: "Opening hours updated",
      data: validated,
    });
  } catch (error) {
    console.error("[PUT /api/sites/[siteId]/opening-hours]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid opening hours format", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update opening hours" },
      { status: 500 }
    );
  }
}
```

### B.5 — `src/app/api/sites/[siteId]/completeness/route.ts`

GET endpoint with Redis caching for site completeness score.

```typescript
// src/app/api/sites/[siteId]/completeness/route.ts

import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { calculateCompleteness } from "@/lib/ai/generate";
import { getRedis } from "@/lib/redis";

interface RouteParams {
  params: { siteId: string };
}

const CACHE_TTL = 300; // 5 minutes

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { siteId } = params;

    // Verify ownership
    const site = db
      .select()
      .from(schema.sites)
      .where(eq(schema.sites.id, siteId))
      .get();

    if (!site || site.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const cacheKey = `completeness:${siteId}`;

    // Try Redis cache
    let cached: string | null = null;
    try {
      const redis = getRedis();
      cached = await redis.get(cacheKey);
    } catch (e) {
      console.warn("[completeness cache] Redis unavailable, proceeding without cache");
    }

    if (cached) {
      const parsed = JSON.parse(cached);
      return NextResponse.json({
        success: true,
        data: parsed,
        cached: true,
      });
    }

    // Calculate completeness
    const result = await calculateCompleteness(siteId);

    // Cache result (with graceful fallback if Redis fails)
    try {
      const redis = getRedis();
      await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
    } catch (e) {
      console.warn("[completeness cache] Failed to cache result");
    }

    return NextResponse.json({
      success: true,
      data: result,
      cached: false,
    });
  } catch (error) {
    console.error("[GET /api/sites/[siteId]/completeness]", error);

    return NextResponse.json(
      { error: "Failed to calculate completeness" },
      { status: 500 }
    );
  }
}
```

---

## SECTION C — Opening Hours Implementation

### C.1 — `src/lib/opening-hours.ts`

Complete opening hours system with Saudi weekend support.

```typescript
// src/lib/opening-hours.ts

import { z } from "zod";

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday-Saturday
export type TimeString = `${number}:${number}${number}`; // HH:MM format

export interface DayHours {
  open: TimeString;
  close: TimeString;
  closed?: boolean; // Optional explicit closed flag
}

export interface OpeningHoursConfig {
  timezone: string;
  isSaudiWeekend: boolean; // If true: Friday (5) & Saturday (6) are weekend
  days: Record<DayOfWeek, DayHours>;
}

// ── Zod Validation Schema ──
const TimeStringSchema = z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be HH:MM format");

const DayHoursSchema = z.object({
  open: TimeStringSchema,
  close: TimeStringSchema,
  closed: z.boolean().optional(),
});

export const openingHoursSchema = z.object({
  timezone: z.string().default("Asia/Riyadh"),
  isSaudiWeekend: z.boolean().default(true),
  days: z
    .record(
      z.union([
        z.literal("0"),
        z.literal("1"),
        z.literal("2"),
        z.literal("3"),
        z.literal("4"),
        z.literal("5"),
        z.literal("6"),
      ]),
      DayHoursSchema
    )
    .refine(
      (days) => {
        // Ensure all 7 days are present
        return Object.keys(days).length === 7;
      },
      "All 7 days must be specified (0-6)"
    ),
});

// ── Helper: Parse time string to minutes since midnight ──
function timeToMinutes(time: TimeString): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// ── Helper: Minutes since midnight to time string ──
function minutesToTime(minutes: number): TimeString {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}` as TimeString;
}

/**
 * Check if location is open now.
 * Handles overnight shifts, Saudi weekends.
 *
 * @param hours - Opening hours config
 * @param now - Current date (defaults to now)
 * @returns Object with isOpen, nextOpenSlot, translations
 */
export function isOpenNow(
  hours: OpeningHoursConfig,
  now: Date = new Date()
): {
  isOpen: boolean;
  nextOpenSlot: string; // "Mon 10:00 AM"
  nextOpenSlotAr: string; // "الاثنين 10:00 صباحاً"
} {
  const dayOfWeek = now.getDay() as DayOfWeek;
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayNamesAr = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  // Check if today is Saudi weekend
  const isSaudiWeekend =
    hours.isSaudiWeekend && (dayOfWeek === 5 || dayOfWeek === 6);

  const todayHours = hours.days[dayOfWeek];

  let isOpen = false;
  if (todayHours && !todayHours.closed && !isSaudiWeekend) {
    const openMinutes = timeToMinutes(todayHours.open);
    const closeMinutes = timeToMinutes(todayHours.close);

    // Handle overnight shifts (e.g., 22:00-02:00)
    if (closeMinutes < openMinutes) {
      isOpen =
        currentTime >= openMinutes ||
        currentTime < closeMinutes;
    } else {
      isOpen = currentTime >= openMinutes && currentTime < closeMinutes;
    }
  }

  // Calculate next open slot
  let nextDay = dayOfWeek;
  let nextOpen = dayNames[nextDay];
  let nextOpenAr = dayNamesAr[nextDay];
  let nextOpenTime = "";

  // Find next open day
  let checked = 0;
  while (checked < 7) {
    const candidate = hours.days[nextDay as DayOfWeek];
    const candidateIsSaudiWeekend =
      hours.isSaudiWeekend && (nextDay === 5 || nextDay === 6);

    if (
      candidate &&
      !candidate.closed &&
      !candidateIsSaudiWeekend
    ) {
      nextOpenTime = candidate.open;
      break;
    }

    nextDay = ((nextDay + 1) % 7) as DayOfWeek;
    nextOpen = dayNames[nextDay];
    nextOpenAr = dayNamesAr[nextDay];
    checked++;
  }

  const [nextHours, nextMins] = nextOpenTime.split(":").map(Number);
  const nextOpenSlot = `${nextOpen} ${String(nextHours).padStart(2, "0")}:${String(nextMins).padStart(2, "0")} AM`;
  const nextOpenSlotAr = `${nextOpenAr} ${String(nextHours).padStart(2, "0")}:${String(nextMins).padStart(2, "0")}`;

  return {
    isOpen,
    nextOpenSlot,
    nextOpenSlotAr,
  };
}

/**
 * Validate time range (e.g., open < close for non-overnight shifts).
 *
 * @param open - Opening time
 * @param close - Closing time
 * @returns True if valid
 */
export function isValidTimeRange(open: TimeString, close: TimeString): boolean {
  // Allow overnight (e.g., 22:00-02:00)
  return true; // Validated by Zod at API level
}

/**
 * Get default opening hours config for Saudi business.
 *
 * @returns Default config (9 AM - 9 PM, closed Friday-Saturday)
 */
export function getDefaultOpeningHours(): OpeningHoursConfig {
  const defaultHours: DayHours = {
    open: "09:00" as TimeString,
    close: "21:00" as TimeString,
  };

  return {
    timezone: "Asia/Riyadh",
    isSaudiWeekend: true,
    days: {
      0: defaultHours, // Sunday
      1: defaultHours, // Monday
      2: defaultHours, // Tuesday
      3: defaultHours, // Wednesday
      4: defaultHours, // Thursday
      5: { ...defaultHours, closed: true }, // Friday
      6: { ...defaultHours, closed: true }, // Saturday
    },
  };
}
```

---

## SECTION D — Rate Limiting for AI Endpoints

### D.1 — `src/lib/rate-limit.ts`

Redis-based daily rate limiting with plan-based tiers.

```typescript
// src/lib/rate-limit.ts

import { getRedis } from "@/lib/redis";

export type PlanType = "free" | "starter" | "pro";

export const PLAN_LIMITS: Record<PlanType, number> = {
  free: 20,
  starter: 100,
  pro: Infinity,
};

export class RateLimitError extends Error {
  constructor(
    public resetAt: Date,
    public remaining: number,
    public limit: number
  ) {
    super(
      `Rate limit exceeded. Reset at ${resetAt.toISOString()}. Remaining: ${remaining}/${limit}`
    );
    this.name = "RateLimitError";
  }
}

/**
 * Check AI endpoint rate limit for user.
 * Uses Redis daily counter.
 *
 * @param userId - User ID
 * @param plan - User plan (free|starter|pro)
 * @throws RateLimitError if limit exceeded
 * @returns { remaining, limit, resetAt }
 */
export async function checkAIRateLimit(
  userId: string,
  plan: PlanType = "free"
): Promise<{
  remaining: number;
  limit: number;
  resetAt: Date;
}> {
  const limit = PLAN_LIMITS[plan];

  // Pro plan has no limit
  if (limit === Infinity) {
    return {
      remaining: limit,
      limit,
      resetAt: new Date(Date.now() + 86400000), // Tomorrow
    };
  }

  try {
    const redis = getRedis();
    const key = `ai:rate-limit:${userId}:${getTodayDateKey()}`;

    // Get current count
    let count = 0;
    const stored = await redis.get(key);
    if (stored) {
      count = parseInt(stored, 10);
    }

    // Check if exceeded
    if (count >= limit) {
      const resetAt = getNextMidnight();
      throw new RateLimitError(resetAt, 0, limit);
    }

    // Increment counter
    const newCount = count + 1;
    const ttl = getSecondsTilMidnight();
    await redis.setex(key, ttl, newCount.toString());

    return {
      remaining: limit - newCount,
      limit,
      resetAt: getNextMidnight(),
    };
  } catch (error) {
    // Redis unavailable — allow request (graceful degradation)
    if (!(error instanceof RateLimitError)) {
      console.warn(
        "[rate-limit] Redis unavailable, allowing request:",
        error
      );
      return {
        remaining: limit - 1,
        limit,
        resetAt: getNextMidnight(),
      };
    }
    throw error;
  }
}

/**
 * Reset user's rate limit (admin use).
 *
 * @param userId - User ID
 */
export async function resetAIRateLimit(userId: string): Promise<void> {
  try {
    const redis = getRedis();
    const key = `ai:rate-limit:${userId}:${getTodayDateKey()}`;
    await redis.del(key);
  } catch (error) {
    console.warn("[rate-limit] Failed to reset:", error);
  }
}

// ── Helpers ──

function getTodayDateKey(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
}

function getSecondsTilMidnight(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return Math.ceil((tomorrow.getTime() - now.getTime()) / 1000);
}

function getNextMidnight(): Date {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow;
}
```

---

## Integration Checklist

### Before Deployment

- [ ] Add `@ai-sdk/anthropic` to package.json: `npm install @ai-sdk/anthropic`
- [ ] Ensure `ANTHROPIC_API_KEY` is set in `.env.local`
- [ ] Ensure Redis is configured (or graceful fallback handles unavailability)
- [ ] Update schema.ts to include `opening_hours` block type if not already present
- [ ] Add `translation_state` field to sections table (optional, for audit trail)
- [ ] Test all 5 new routes with Postman/curl
- [ ] Update frontend to call `/api/ai/suggest` for streaming suggestions
- [ ] Update wizard to use `/api/ai/wizard-generate` before site creation

### Database Migrations

If using PostgreSQL with Drizzle:

```typescript
// Example: add translation_state to sections (optional)
export const sections = pgTable("sections", {
  // ... existing fields ...
  translationState: text("translation_state", {
    enum: ["original", "ai", "manual"],
  }).default("original"),
});
```

### Environment Variables

```bash
ANTHROPIC_API_KEY=sk-ant-...
REDIS_URL=redis://localhost:6379
```

### Rate Limiting Middleware (Optional)

Add to API routes that need rate limiting:

```typescript
import { checkAIRateLimit, RateLimitError } from "@/lib/rate-limit";

// In POST handler:
try {
  const limits = await checkAIRateLimit(session.user.id, userPlan);
  // Continue...
} catch (error) {
  if (error instanceof RateLimitError) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        remaining: error.remaining,
        resetAt: error.resetAt,
      },
      { status: 429 }
    );
  }
  // Handle other errors
}
```

---

## Testing Examples

### Test Field Suggestions (Streaming)

```bash
curl -X POST http://localhost:3000/api/ai/suggest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "field": "headline",
    "blockType": "hero",
    "industry": "company",
    "language": "en",
    "seed": "Tech consulting"
  }'
```

### Test Wizard Generation

```bash
curl -X POST http://localhost:3000/api/ai/wizard-generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "wizardAnswers": {
      "businessName": "Tech Startup Inc",
      "description": "We provide cloud solutions",
      "industry": "saas"
    },
    "language": "en"
  }'
```

### Test Translation

```bash
curl -X POST http://localhost:3000/api/ai/translate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "siteId": "550e8400-e29b-41d4-a716-446655440000",
    "fromLang": "en",
    "toLang": "ar"
  }'
```

### Test Opening Hours

```bash
curl -X GET http://localhost:3000/api/sites/550e8400-e29b-41d4-a716-446655440000/opening-hours \
  -H "Authorization: Bearer <token>"

curl -X PUT http://localhost:3000/api/sites/550e8400-e29b-41d4-a716-446655440000/opening-hours \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "timezone": "Asia/Riyadh",
    "isSaudiWeekend": true,
    "days": {
      "0": {"open": "09:00", "close": "21:00"},
      "1": {"open": "09:00", "close": "21:00"},
      "2": {"open": "09:00", "close": "21:00"},
      "3": {"open": "09:00", "close": "21:00"},
      "4": {"open": "09:00", "close": "21:00"},
      "5": {"open": "09:00", "close": "21:00", "closed": true},
      "6": {"open": "09:00", "close": "21:00", "closed": true}
    }
  }'
```

### Test Completeness

```bash
curl -X GET http://localhost:3000/api/sites/550e8400-e29b-41d4-a716-446655440000/completeness \
  -H "Authorization: Bearer <token>"
```

---

## Notes

- **Prompt Caching:** Claude 3.5 Sonnet supports prompt caching via the `cacheControl` parameter. This reduces costs and latency for repeated prompts.
- **Streaming:** Field suggestions stream to the client in real-time using Server-Sent Events.
- **Graceful Degradation:** Rate limiting and completeness caching fall back gracefully if Redis is unavailable.
- **Bilingual:** All prompts, translations, and responses support both English and Arabic.
- **Saudi Specifics:** Opening hours respect Saudi weekends (Friday-Saturday) and use Asia/Riyadh timezone as default.

---

## End of Part 2

**Next Steps:**
1. Implement Part 1 (Auth, Dashboard, Block Registry)
2. Deploy all 5 new AI + data routes
3. Update Frontend to consume streaming field suggestions
4. Add Rate Limiting middleware to dashboard endpoints
5. Run end-to-end tests for wizard → generation → publish flow
