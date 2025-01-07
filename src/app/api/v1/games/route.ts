import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { games } from "@/server/db/schema";
import { v4 as uuidv4 } from "uuid";
import { determineGameState } from "@/lib/utils";

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

    // Validate board dimensions
    if (
      !Array.isArray(body.board) ||
      body.board.length !== 15 ||
      body.board.some(
        (row: Array<string>) => !Array.isArray(row) || row.length !== 15,
      )
    ) {
      return NextResponse.json(
        {
          code: 422,
          message: "Invalid board dimensions. The board must be 15x15.",
        },
        { status: 422 },
      );
    }

    // Validate symbols on the board
    const hasInvalidSymbols = body.board.some((row: Array<string>) =>
      row.some((cell: string) => !validSymbols.has(cell)),
    );
    if (hasInvalidSymbols) {
      return NextResponse.json(
        {
          code: 422,
          message: "Invalid board contents. Only 'X', 'O', or '' are allowed.",
        },
        { status: 422 },
      );
    }

    // Calculate total moves and determine the current player
    const flatBoard = body.board.flat();
    const xCount = flatBoard.filter((cell: string) => cell === "X").length;
    const oCount = flatBoard.filter((cell: string) => cell === "O").length;
    const currentPlayer: "X" | "O" = xCount > oCount ? "O" : "X";
    const totalMoves = xCount + oCount;

    // Determine the game state
    const gameState = determineGameState(
      body.board,
      totalMoves,
      currentPlayer,
    ) as "endgame" | "opening" | "midgame" | "unknown"; // Ensure strict typing

    // Insert the new game into the database
    const [newGame] = await db
      .insert(games)
      .values({
        uuid: uuidv4(),
        name: body.name,
        difficulty: body.difficulty,
        board: body.board,
        gameState: gameState,
      })
      .returning();

    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { code: 400, message: `Bad Request - ${error}` },
      { status: 400 },
    );
  }
}
