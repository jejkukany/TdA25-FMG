import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { games } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { determineGameState, validateBoard } from "@/lib/utils";
import { formatISO } from "date-fns";


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) {
  try {
    const uuid = (await params).uuid; // The uuid here is the uuid

    if (!uuid) {
      return NextResponse.json(
        { code: 400, message: "UUID parameter is required" },
        { status: 400 },
      );
    }

    const game = await db.select().from(games).where(eq(games.uuid, uuid));

    if (!game.length) {
      return NextResponse.json(
        { code: 404, message: "Resource not found" },
        { status: 404 },
      );
    }

    const gameData = game[0];
    const board = gameData.board;
    // Dynamically calculate currentPlayer
    const flatBoard = board.flat();
    const xCount = flatBoard.filter((cell) => cell === "X").length;
    const oCount = flatBoard.filter((cell) => cell === "O").length;
    const currentPlayer: "X" | "O" = xCount > oCount ? "O" : "X"; // "X" always starts

    const validationError = validateBoard(board, currentPlayer);

    if (validationError) {
      return NextResponse.json(
        { code: 400, message: validationError },
        { status: 400 }
      );
    }

    const totalMoves = board.flat().filter((cell) => cell === "X" || cell === "O").length;
    const gameState = determineGameState(board, totalMoves, currentPlayer);

    // Return the game data with the derived currentPlayer
    return NextResponse.json(
      {
        ...gameData,
        currentPlayer,
        gameState,
      },
      { status: 200 },
    );
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
  { params }: { params: Promise<{ uuid: string }> },
) {
  try {
    const uuid = (await params).uuid; // The uuid here is the uuid

    if (!uuid) {
      return NextResponse.json(
        { code: 400, message: "UUID parameter is required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const updatedDate = new Date().toISOString();
    body.updatedAt = updatedDate;

    const [updatedGame] = await db
      .update(games)
      .set(body)
      .where(eq(games.uuid, uuid))
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
  { params }: { params: Promise<{ uuid: string }> },
) {
  try {
    const uuid = (await params).uuid; // The uuid here is the uuid

    if (!uuid) {
      return NextResponse.json(
        { code: 400, message: "UUID parameter is required" },
        { status: 400 },
      );
    }

    const deleted = await db
      .delete(games)
      .where(eq(games.uuid, uuid))
      .returning();

    if (!deleted.length) {
      return NextResponse.json(
        { code: 404, message: "Resource not found" },
        { status: 404 },
      );
    }

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { code: 500, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
