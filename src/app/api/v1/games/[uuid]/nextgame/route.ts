import { eq, gt } from "drizzle-orm";
import { db } from "@/server/db";
import { games } from "@/server/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ uuid: string }> },
) {
    try {
        const currentGameUuid = (await params).uuid;

        if (!currentGameUuid) {
            return NextResponse.json(
                { code: 400, message: "UUID parameter is required" },
                { status: 400 },
            );
        }

        // Find the current game
        const [currentGame] = await db
            .select({ createdAt: games.createdAt })
            .from(games)
            .where(eq(games.uuid, currentGameUuid));

        if (!currentGame) {
            return NextResponse.json(
                { code: 404, message: "Current game not found" },
                { status: 404 },
            );
        }

        // Find the next game
        const [nextGame] = await db
            .select()
            .from(games)
            .where(gt(games.createdAt, currentGame.createdAt))
            .orderBy(games.createdAt)
            .limit(1);

        if (nextGame) {
            return NextResponse.json(nextGame, { status: 200 });
        }

        // If the current game is the last one, fetch the first game
        const [firstGame] = await db
            .select()
            .from(games)
            .orderBy(games.createdAt)
            .limit(1);

        if (!firstGame) {
            return NextResponse.json(
                { code: 404, message: "No games found in the database" },
                { status: 404 },
            );
        }

        return NextResponse.json(firstGame, { status: 200 });
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json(
            { code: 500, message: "Internal Server Error" },
            { status: 500 },
        );
    }
}
