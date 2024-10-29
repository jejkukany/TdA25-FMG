import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return new NextResponse(
    JSON.stringify({ organization: "Student Cyber Games" }),
    {
      status: 200,
    },
  );
}
