import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getIndustryTemplate } from "@/config/industry-templates";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sites = db
    .select()
    .from(schema.sites)
    .where(eq(schema.sites.userId, session.user.id))
    .all();

  return NextResponse.json({ sites });
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, industry, language } = await request.json();

    if (!name || !industry) {
      return NextResponse.json(
        { error: "Name and industry are required" },
        { status: 400 }
      );
    }

    const template = getIndustryTemplate(industry);
    if (!template) {
      return NextResponse.json(
        { error: "Invalid industry" },
        { status: 400 }
      );
    }

    // Verify user exists in DB (session may be stale after DB reset)
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

    // Generate unique slug
    let baseSlug = slugify(name);
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

    const siteId = crypto.randomUUID();
    const now = new Date();

    const themeWithDirection = {
      ...template.defaultTheme,
      direction: language === "ar" ? "rtl" : "ltr",
    };

    db.insert(schema.sites)
      .values({
        id: siteId,
        userId: session.user.id,
        name,
        slug,
        industry,
        theme: JSON.stringify(themeWithDirection),
        language: language || "en",
        status: "draft",
        createdAt: now,
        updatedAt: now,
      })
      .run();

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
        })
        .run();
    }

    return NextResponse.json({ site: { id: siteId, slug } });
  } catch (e) {
    console.error("[POST /api/sites]", e);
    return NextResponse.json(
      { error: "Failed to create site" },
      { status: 500 }
    );
  }
}
