import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { games } from "@/server/db/schema";
import { v4 as uuidv4 } from "uuid";
import { determineGameState, validateBoard } from "@/lib/utils";

export async function GET() {
	try {
		const data = await db.select().from(games).all();
		return NextResponse.json(data, { status: 200 });
	} catch {
		return NextResponse.json(
			{ code: 500, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		// Calculate total moves and determine the current player
		const flatBoard = body.board.flat();
		const xCount = flatBoard.filter((cell: string) => cell === "X").length;
		const oCount = flatBoard.filter((cell: string) => cell === "O").length;
		const currentPlayer: "X" | "O" = xCount > oCount ? "O" : "X";
		const totalMoves = xCount + oCount;
		//Validate the game
		if (validateBoard(body.board, currentPlayer) !== null) {
			return NextResponse.json(
				{ code: 422, message: "Invalid board" },
				{ status: 422 }
			);
		}

		const currentTimestamp = Date.now();

		// Determine the game state
		const gameState = determineGameState(
			body.board,
			totalMoves,
			currentPlayer
		) as "endgame" | "opening" | "midgame" | "unknown"; // Ensure strict typing

		// Insert the new game into the database
		const [newGame] = await db
			.insert(games)
			.values({
				board: body.board,
				name: body.name || "Unnamed Game",
				uuid: uuidv4(),
				difficulty: body.difficulty || "beginner",
				createdAt: new Date(currentTimestamp),
				updatedAt: new Date(currentTimestamp),
				gameState: gameState,
			})
			.returning();

		return NextResponse.json(newGame, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ code: 400, message: `Bad Request - ${error}` },
			{ status: 400 }
		);
	}
}