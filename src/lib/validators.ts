import { z } from "zod";

// Wizard step answers validation
export const wizardAnswersSchema = z.object({
  businessType: z.string().min(1, "Business type is required"),
  businessName: z.string().min(1, "Business name is required").max(100),
  city: z.string().min(1, "City is required"),
  phone: z.string().min(7, "Phone must be at least 7 characters"),
  whatsappEnabled: z.boolean().default(false),
  logo: z.string().optional(),
  themeColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Valid hex color required"),
  description: z.string().max(500).optional(),
  language: z.enum(["ar", "en"]).default("en"),
  selectedSections: z.array(z.string()).default([]),
});

export type WizardAnswers = z.infer<typeof wizardAnswersSchema>;

// Wizard draft validation
export const wizardDraftSchema = z.object({
  industry: z.string(),
  step: z.number().int().min(0).max(7),
  answers: wizardAnswersSchema.partial(),
});

export type WizardDraft = z.infer<typeof wizardDraftSchema>;

// Auto-save validation
export const autoSaveSchema = z.object({
  config: z.record(z.string(), z.any()),
  clientUpdatedAt: z.number().int().positive(),
});

// Opening hours validation
export const openingHoursSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  timeStart: z.string().regex(/^\d{2}:\d{2}$/, "HH:MM format required"),
  timeEnd: z.string().regex(/^\d{2}:\d{2}$/, "HH:MM format required"),
  crossesMidnight: z.boolean().default(false),
});

export type OpeningHours = z.infer<typeof openingHoursSchema>;

// Site schema for creation/update
export const siteSchema = z.object({
  name: z.string().min(1).max(100),
  industry: z.string(),
  theme: z.record(z.string(), z.any()),
  language: z.enum(["ar", "en"]).default("en"),
  description: z.string().max(500).optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
});

export type SiteData = z.infer<typeof siteSchema>;
