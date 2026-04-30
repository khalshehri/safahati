import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sites, openingHours } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { openingHoursValidation } from "@/lib/opening-hours";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { siteId } = params;

    // Verify user owns this site
    const site = await db
      .select()
      .from(sites)
      .where(eq(sites.id, siteId))
      .get();

    if (!site || site.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const hours = await db
      .select()
      .from(openingHours)
      .where(eq(openingHours.siteId, siteId));

    return NextResponse.json({ hours });
  } catch (error) {
    console.error("GET opening hours error:", error);
    return NextResponse.json(
      { error: "Failed to fetch opening hours" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { siteId } = params;
    const body = await req.json();

    // Verify user owns this site
    const site = await db
      .select()
      .from(sites)
      .where(eq(sites.id, siteId))
      .get();

    if (!site || site.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Validate each hour entry
    const hoursArray = Array.isArray(body) ? body : [body];
    const validated = hoursArray.map((h) => openingHoursValidation.parse(h));

    // Delete existing hours for this site
    await db.delete(openingHours).where(eq(openingHours.siteId, siteId));

    // Insert new hours
    for (const hour of validated) {
      await db.insert(openingHours).values({
        id: `hours-${siteId}-${hour.dayOfWeek}-${Date.now()}`,
        siteId,
        dayOfWeek: hour.dayOfWeek,
        timeStart: hour.timeStart,
        timeEnd: hour.timeEnd,
        crossesMidnight: hour.crossesMidnight,
      });
    }

    return NextResponse.json({ success: true, hours: validated });
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid opening hours data", details: error.message },
        { status: 400 }
      );
    }
    console.error("PUT opening hours error:", error);
    return NextResponse.json(
      { error: "Failed to update opening hours" },
      { status: 500 }
    );
  }
}
