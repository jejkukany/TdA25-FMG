import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { user } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/server/auth/auth";

// Helper function for error responses
const errorResponse = (code: number, message: string) =>
  NextResponse.json({ code, message }, { status: code });

// GET single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) {
  try {
    const uuid = (await params).uuid;
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.uuid, uuid));

    if (!userRecord) return errorResponse(404, "Resource not found");

    return NextResponse.json(
      {
        uuid: userRecord.uuid,
        createdAt: userRecord.createdAt,
        username: userRecord.name,
        email: userRecord.email,
        elo: userRecord.elo,
        wins: userRecord.wins,
        draws: userRecord.draws,
        losses: userRecord.losses,
      },
      { status: 200 },
    );
  } catch {
    return errorResponse(500, "Internal Server Error");
  }
}

// UPDATE user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) {
  try {
    const uuid = (await params).uuid;
    const body = await request.json();

    const updateData: Record<string, string | number> = {
      ...body,
    };

    if ("username" in body) {
      updateData.name = body.username;
      delete updateData.username;
    }
    if ("password" in body) {
      delete updateData.password;
    }
    // Update password if provided
    if ("password" in body) {
      const [currentUser] = await db
        .select()
        .from(user)
        .where(eq(user.uuid, uuid));

      const ctx = await auth.$context;
      const hash = await ctx.password.hash(body.password);
      await ctx.internalAdapter.updatePassword(currentUser.id, hash);
    }

    const [updatedUser] = await db
      .update(user)
      .set(updateData)
      .where(eq(user.uuid, uuid))
      .returning();

    if (!updatedUser) return errorResponse(404, "User not found");

    return NextResponse.json(
      {
        uuid: updatedUser.uuid,
        createdAt: updatedUser.createdAt,
        username: updatedUser.name, // Convert back to username in response
        email: updatedUser.email,
        elo: updatedUser.elo,
        wins: updatedUser.wins,
        draws: updatedUser.draws,
        losses: updatedUser.losses,
      },
      { status: 200 },
    );
  } catch (error) {
    return errorResponse(400, `Bad Request: ${error}`);
  }
}

// DELETE user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) {
  try {
    const uuid = (await params).uuid;
    const [deletedUser] = await db
      .delete(user)
      .where(eq(user.uuid, uuid))
      .returning();

    if (!deletedUser) return errorResponse(404, "User not found");

    return new Response(null, { status: 204 });
  } catch {
    return errorResponse(500, "Internal Server Error");
  }
}
