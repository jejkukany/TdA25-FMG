import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { organization: "Student Cyber Games" },
    { status: 200 },
  );
}
