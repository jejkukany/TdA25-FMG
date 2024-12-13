import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { games } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug; // The slug here is the uuid
    const includeDetails =
      new URL(request.url).searchParams.get("details") === "true";

    if (!slug) {
      return NextResponse.json(
        { code: 400, message: "UUID parameter is required" },
        { status: 400 },
      );
    }

    const game = await db.select().from(games).where(eq(games.id, slug));

    if (!game.length) {
      return NextResponse.json(
        { code: 404, message: "Resource not found" },
        { status: 404 },
      );
    }

    const result = includeDetails
      ? { ...game[0], details: "Extra details here" }
      : game[0];

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { code: 500, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug; // The slug here is the uuid

    if (!slug) {
      return NextResponse.json(
        { code: 400, message: "UUID parameter is required" },
        { status: 400 },
      );
    }

    const body = await request.json();

    const [updatedGame] = await db
      .update(games)
      .set(body)
      .where(eq(games.id, slug))
      .returning();

    if (!updatedGame) {
      return NextResponse.json(
        { code: 404, message: "Resource not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedGame, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { code: 400, message: "Bad Request" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug; // The slug here is the uuid

    if (!slug) {
      return NextResponse.json(
        { code: 400, message: "UUID parameter is required" },
        { status: 400 },
      );
    }

    const deleted = await db
      .delete(games)
      .where(eq(games.id, slug))
      .returning();

    if (!deleted.length) {
      return NextResponse.json(
        { code: 404, message: "Resource not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { code: 500, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
