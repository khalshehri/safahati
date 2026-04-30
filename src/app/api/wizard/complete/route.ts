import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sites, sections, wizardDrafts, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { wizardAnswersSchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

// Industry templates mapping - defines default sections for each industry
const INDUSTRY_TEMPLATES: Record<string, any[]> = {
  company: [
    {
      blockType: "hero",
      templateId: "company-growth",
      config: { headline: "Welcome", subheadline: "Your company description" },
    },
    {
      blockType: "service",
      templateId: "service-card",
      config: { title: "Our Services", items: [] },
    },
  ],
  freelancer: [
    {
      blockType: "hero",
      templateId: "freelancer-notebook",
      config: { headline: "I'm a Freelancer", subheadline: "Your tagline" },
    },
    {
      blockType: "portfolio",
      templateId: "portfolio-grid",
      config: { title: "My Work", items: [] },
    },
  ],
  restaurant: [
    {
      blockType: "hero",
      templateId: "restaurant-chef",
      config: { headline: "Welcome to our Restaurant", subheadline: "Est. 2024" },
    },
    {
      blockType: "menu",
      templateId: "menu-grid",
      config: { title: "Our Menu", items: [] },
    },
  ],
  clinic: [
    {
      blockType: "hero",
      templateId: "clinic-care",
      config: { headline: "Your Health, Our Priority", subheadline: "" },
    },
    {
      blockType: "service",
      templateId: "service-card",
      config: { title: "Services", items: [] },
    },
  ],
  agency: [
    {
      blockType: "hero",
      templateId: "agency-studio",
      config: { headline: "Creative Agency", subheadline: "We create amazing experiences" },
    },
    {
      blockType: "portfolio",
      templateId: "portfolio-grid",
      config: { title: "Our Work", items: [] },
    },
  ],
  // Add more industries as needed
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify user exists to avoid FK constraint violation
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .get();

    if (!user) {
      return NextResponse.json(
        { error: "Session expired — please log out and log back in" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = wizardAnswersSchema.parse(body);

    // Generate slug from business name
    const slug = validated.businessName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    const now = Date.now();
    const siteId = `site-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Get template sections for this industry
    const templates = INDUSTRY_TEMPLATES[validated.businessType] || [];

    // Create site and sections in transaction
    const result = await db
      .insert(sites)
      .values({
        id: siteId,
        userId: session.user.id,
        name: validated.businessName,
        slug,
        industry: validated.businessType,
        theme: JSON.stringify({ primaryColor: validated.themeColor }),
        language: validated.language,
        status: "draft",
        description: validated.description,
        logo: validated.logo,
        createdAt: now,
        updatedAt: now,
      })
      .run();

    // Insert default sections
    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      await db.insert(sections).values({
        id: `section-${siteId}-${i}`,
        siteId,
        blockType: template.blockType,
        templateId: template.templateId,
        config: JSON.stringify(template.config),
        sortOrder: i,
        isVisible: true,
        createdAt: now,
      });
    }

    // Clear wizard draft
    await db
      .delete(wizardDrafts)
      .where(eq(wizardDrafts.userId, session.user.id));

    return NextResponse.json(
      {
        success: true,
        siteId,
        url: `${slug}.${process.env.SITE_DOMAIN || "localhost:3000"}`,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid wizard data", details: error.message },
        { status: 400 }
      );
    }
    console.error("POST /api/wizard/complete error:", error);
    return NextResponse.json(
      { error: "Failed to complete wizard" },
      { status: 500 }
    );
  }
}
