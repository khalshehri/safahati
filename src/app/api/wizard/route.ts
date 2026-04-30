import { auth } from "@/auth";
import { db } from "@/lib/db";
import { wizardDrafts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { wizardDraftSchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const draft = await db
      .select()
      .from(wizardDrafts)
      .where(eq(wizardDrafts.userId, session.user.id))
      .get();

    if (!draft) {
      return NextResponse.json(
        { error: "No wizard draft found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      industry: draft.industry,
      step: draft.step,
      answers: draft.answers ? JSON.parse(draft.answers) : {},
    });
  } catch (error) {
    console.error("GET /api/wizard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wizard draft" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const validated = wizardDraftSchema.parse(body);

    const now = new Date();
    const nowMs = now.getTime();
    const existing = await db
      .select()
      .from(wizardDrafts)
      .where(eq(wizardDrafts.userId, session.user.id))
      .get();

    if (existing) {
      await db
        .update(wizardDrafts)
        .set({
          industry: validated.industry,
          step: validated.step,
          answers: JSON.stringify(validated.answers),
          updatedAt: now,
        })
        .where(eq(wizardDrafts.userId, session.user.id));
    } else {
      await db.insert(wizardDrafts).values({
        id: `wizard-${session.user.id}-${nowMs}`,
        userId: session.user.id,
        industry: validated.industry,
        step: validated.step,
        answers: JSON.stringify(validated.answers),
        createdAt: now,
        updatedAt: now,
      });
    }

    return NextResponse.json(
      { success: true, step: validated.step },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid wizard data", details: error.message },
        { status: 400 }
      );
    }
    console.error("POST /api/wizard error:", error);
    return NextResponse.json(
      { error: "Failed to save wizard step" },
      { status: 500 }
    );
  }
}
