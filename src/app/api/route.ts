import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(
    JSON.stringify({ organization: "Student Cyber Games" }),
    {
      status: 200,
    },
  );
}
