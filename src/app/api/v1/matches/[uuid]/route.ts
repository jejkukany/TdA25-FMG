import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { matches, moves } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ uuid: string }> }
) {
	try {
		const uuid = (await params).uuid;

		if (!uuid) {
			return NextResponse.json(
				{ code: 400, message: "UUID parameter is required" },
				{ status: 400 }
			);
		}

		const [match] = await db
			.select()
			.from(matches)
			.where(eq(matches.uuid, uuid));

		if (!match) {
			return NextResponse.json(
				{ code: 404, message: "Match not found" },
				{ status: 404 }
			);
		}

		// Get all moves for this match
		const matchMoves = await db
			.select()
			.from(moves)
			.where(eq(moves.matchId, match.uuid))
			.orderBy(moves.createdAt);

		return NextResponse.json(
			{
				...match,
				moves: matchMoves,
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
	{ params }: { params: Promise<{ uuid: string }> }
) {
	try {
		const uuid = (await params).uuid;

		if (!uuid) {
			return NextResponse.json(
				{ code: 400, message: "UUID parameter is required" },
				{ status: 400 }
			);
		}

		const body = await request.json();
		const updatedDate = new Date().toISOString();
		body.updatedAt = updatedDate;

		const [updatedMatch] = await db
			.update(matches)
			.set(body)
			.where(eq(matches.uuid, uuid))
			.returning();

		if (!updatedMatch) {
			return NextResponse.json(
				{ code: 404, message: "Match not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(updatedMatch, { status: 200 });
	} catch (error) {
		console.error("PUT Error:", error);
		return NextResponse.json(
			{ code: 400, message: "Bad Request" },
			{ status: 400 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ uuid: string }> }
) {
	try {
		const uuid = (await params).uuid;

		if (!uuid) {
			return NextResponse.json(
				{ code: 400, message: "UUID parameter is required" },
				{ status: 400 }
			);
		}

		const deleted = await db
			.delete(matches)
			.where(eq(matches.uuid, uuid))
			.returning();

		if (!deleted.length) {
			return NextResponse.json(
				{ code: 404, message: "Match not found" },
				{ status: 404 }
			);
		}

		return new Response(null, {
			status: 204,
		});
	} catch (error) {
		console.error("DELETE Error:", error);
		return NextResponse.json(
			{ code: 500, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}