import { client } from "@/server/auth/client";
import { db } from "@/server/db";
import { user } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
	try {
		const { username, email, password, elo } = await request.json();
		if (!username || !email || !password || typeof elo !== "number") {
			throw new Error("Invalid request body");
		}
		const uuid = uuidv4();
		await new Promise((resolve, reject) => {
			client.signUp.email(
				{
					email,
					password,
					name: username,
					elo: elo,
					wins: 0,
					draws: 0,
					losses: 0,
					uuid: uuid,
				},
				{
					onSuccess: resolve,
					onError: (error) => reject(error),
				}
			);
		});

		const currentUser = await db
			.select()
			.from(user)
			.where(eq(user.uuid, uuid));

		return NextResponse.json(
			{
				uuid: currentUser[0].uuid,
				createdAt: currentUser[0].createdAt,
				username: currentUser[0].name,
				email: currentUser[0].email,
				elo: currentUser[0].elo,
				wins: currentUser[0].wins,
				draws: currentUser[0].draws,
				losses: currentUser[0].losses,
			},
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{ code: 400, message: `Bad request: ${error}` },
			{ status: 400 }
		);
	}
}
export async function GET() {
	try {
		const users = await db
			.select({
				uuid: user.uuid,
				createdAt: user.createdAt,
				username: user.name,
				email: user.email,
				elo: user.elo,
				wins: user.wins,
				draws: user.draws,
				losses: user.losses,
			})
			.from(user);

		return NextResponse.json(users, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ code: 400, message: `Bad request: ${error}` },
			{ status: 400 }
		);
	}
}
