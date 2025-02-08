import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { games } from "@/server/db/schema";
import { eq, gt } from "drizzle-orm";
import { determineGameState, validateBoard } from "@/lib/utils";


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) {
  try {
    const currentGameUuid = (await params).uuid;

    if (!currentGameUuid) {
      return NextResponse.json(
        { code: 400, message: "UUID parameter is required" },
        { status: 400 }
      );
    }

    // Fetch current game
    const [currentGame] = await db
      .select()
      .from(games)
      .where(eq(games.uuid, currentGameUuid));

    if (!currentGame) {
      return NextResponse.json(
        { code: 404, message: "Game not found" },
        { status: 404 }
      );
    }

    // Fetch next game based on createdAt timestamp
    const [nextGame] = await db
      .select()
      .from(games)
      .where(gt(games.createdAt, currentGame.createdAt))
      .orderBy(games.createdAt)
      .limit(1);

    let nextGameUuid = nextGame?.uuid || null;

    // If no next game is found, get the first game in the database (wrap around)
    if (!nextGameUuid) {
      const [firstGame] = await db
        .select()
        .from(games)
        .orderBy(games.createdAt)
        .limit(1);

      if (firstGame && firstGame.uuid !== currentGameUuid) {
        nextGameUuid = firstGame.uuid;
      }
    }

    const board = currentGame.board;
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

    const totalMoves = flatBoard.filter((cell) => cell === "X" || cell === "O").length;
    const gameState = determineGameState(board, totalMoves, currentPlayer);

    return NextResponse.json(
      {
        ...currentGame,
        currentPlayer,
        gameState,
        nextGameUuid, // ✅ Includes the next game UUID
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { code: 500, message: "Internal Server Error" },
      { status: 500 }
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
