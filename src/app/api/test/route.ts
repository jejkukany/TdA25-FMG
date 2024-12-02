import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db.select().from(users).all();
  // console.log(data);
  return NextResponse.json({ data: data }, { status: 200 });
}
