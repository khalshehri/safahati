import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sites, sections, wizardDrafts, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { wizardAnswersSchema } from "@/lib/validators";
import { getIndustryTemplate } from "@/config/industry-templates";
import { populateSections, buildTheme } from "@/lib/wizard-populate";
import { NextRequest, NextResponse } from "next/server";

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

    // Get industry template
    const industryTemplate = getIndustryTemplate(validated.businessType);
    if (!industryTemplate) {
      return NextResponse.json(
        { error: "Invalid industry selected" },
        { status: 400 }
      );
    }

    // Generate slug from business name
    const slug = validated.businessName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    const now = new Date();
    const siteId = crypto.randomUUID();

    // Populate template sections with wizard answers
    const populatedSections = populateSections(industryTemplate, validated);

    // Build theme from template + wizard color choice
    const theme = buildTheme(industryTemplate.defaultTheme, validated);

    // Create site
    await db
      .insert(sites)
      .values({
        id: siteId,
        userId: session.user.id,
        name: validated.businessName,
        slug,
        industry: validated.businessType,
        theme: JSON.stringify(theme),
        language: validated.language,
        status: "draft",
        description: validated.description,
        logo: validated.logo,
        createdAt: now,
        updatedAt: now,
      })
      .run();

    // Insert populated sections
    populatedSections.forEach((section, index) => {
      db.insert(sections)
        .values({
          id: crypto.randomUUID(),
          siteId,
          blockType: section.blockType,
          templateId: section.templateId,
          config: JSON.stringify(section.config),
          sortOrder: index,
          isVisible: section.isVisible,
          createdAt: now,
        })
        .run();
    });

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
