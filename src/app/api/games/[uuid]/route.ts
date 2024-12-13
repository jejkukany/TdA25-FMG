import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { games } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _: Request,
  { params }: { params: { uuid: string } },
) {
  try {
    const game = await db.select().from(games).where(eq(games.id, params.uuid));

    if (!game.length) {
      return NextResponse.json(
        { code: 404, message: "Resource not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(game[0], { status: 200 });
  } catch {
    return NextResponse.json(
      { code: 500, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { uuid: string } },
) {
  try {
    const body = await request.json();

    const [updatedGame] = await db
      .update(games)
      .set(body)
      .where(eq(games.id, params.uuid))
      .returning();

    if (!updatedGame) {
      return NextResponse.json(
        { code: 404, message: "Resource not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedGame, { status: 200 });
  } catch {
    return NextResponse.json(
      { code: 400, message: "Bad Request" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { uuid: string } },
) {
  try {
    const deleted = await db
      .delete(games)
      .where(eq(games.id, params.uuid))
      .returning();

    if (!deleted.length) {
      return NextResponse.json(
        { code: 404, message: "Resource not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { code: 500, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
