import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { games } from "@/server/db/schema";

export async function GET() {
  try {
    const data = await db.select().from(games).all();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { code: 500, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [newGame] = await db.insert(games).values(body).returning();

    return NextResponse.json(newGame, { status: 201 });
  } catch {
    return NextResponse.json(
      { code: 400, message: "Bad Request" },
      { status: 400 },
    );
  }
}
