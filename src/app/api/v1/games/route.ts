import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { games } from "@/server/db/schema";
import { v4 as uuidv4 } from "uuid";

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
    const validSymbols = new Set(["X", "O", ""]);

    if (
      !Array.isArray(body.board) || 
      body.board.length !== 15 || 
      body.board.some((row: any) => !Array.isArray(row) || row.length !== 15)
    ) {
      return NextResponse.json(
        { code: 400, message: "Invalid board dimensions. The board must be 15x15." },
        { status: 400 }
      );
    }

    const hasInvalidSymbols = body.board.some((row: any) =>
      row.some((cell: any) => !validSymbols.has(cell))
    );

    if (hasInvalidSymbols) {
      return NextResponse.json(
        { code: 400, message: "Invalid board contents. Only 'X', 'O', or '' are allowed." },
        { status: 400 }
      );
    }

    const [newGame] = await db
      .insert(games)
      .values({
        uuid: uuidv4(),
        name: body.name,
        difficulty: body.difficulty,
        board: body.board,
      })
      .returning();

    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { code: 400, message: "Bad Request - " + error },
      { status: 400 },
    );
  }
}
