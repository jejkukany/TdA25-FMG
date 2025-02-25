import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { matches, moves, user } from "@/server/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const userUuid = searchParams.get("userUuid");

		if (userUuid) {
			const [userRecord] = await db
				.select()
				.from(user)
				.where(eq(user.uuid, userUuid));

			if (!userRecord) {
				return NextResponse.json(
					{ code: 404, message: "User not found" },
					{ status: 404 }
				);
			}

			const userMatches = await db
				.select()
				.from(matches)
				.where(
					eq(matches.player1Id, userUuid) ||
						eq(matches.player2Id, userUuid)
				);
			return NextResponse.json(userMatches, { status: 200 });
		}

		const allMatches = await db.select().from(matches);
		return NextResponse.json(allMatches, { status: 200 });
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
		const {
			player1Id,
			player2Id,
			result,
			player1EloChange,
			player2EloChange,
			finalBoard,
			moves: movesData,
		} = body;

		const currentTimestamp = Date.now();

		// Create the match
		const [newMatch] = await db
			.insert(matches)
			.values({
				uuid: uuidv4(),
				createdAt: new Date(currentTimestamp),
				updatedAt: new Date(currentTimestamp),
				player1Id,
				player2Id,
				result,
				player1EloChange,
				player2EloChange,
				finalBoard,
			})
			.returning();

		// Insert moves if provided
		if (movesData && Array.isArray(movesData)) {
			await db.insert(moves).values(
				movesData.map((move) => ({
					uuid: uuidv4(),
					matchId: newMatch.uuid, // Changed from newMatch.uuid to newMatch.id
					playerId: move.playerId,
					position: move.position,
					symbol: move.symbol,
					createdAt: new Date(move.timestamp || Date.now()),
				}))
			);
		}

		return NextResponse.json(newMatch, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ code: 400, message: `Bad Request - ${error}` },
			{ status: 400 }
		);
	}
}