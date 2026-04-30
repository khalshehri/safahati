import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sections, sites } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string; sectionId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { siteId, sectionId } = await params;
    const body = await req.json();
    const { config } = body;

    // Verify ownership
    const site = await db
      .select()
      .from(sites)
      .where(eq(sites.id, siteId))
      .get();

    if (!site || site.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Update section
    const updated = await db
      .update(sections)
      .set({
        config: JSON.stringify(config),
        updatedAt: new Date(),
      })
      .where(
        and(eq(sections.id, sectionId), eq(sections.siteId, siteId))
      )
      .returning()
      .get();

    if (!updated) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        ...updated,
        config: JSON.parse(updated.config),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/sites/[siteId]/sections/[sectionId] error:", error);
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 }
    );
  }
}
