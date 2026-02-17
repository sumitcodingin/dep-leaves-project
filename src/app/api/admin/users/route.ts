import { NextResponse } from "next/server";

import { createUserHandler } from "@/server/routes/admin/users";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await createUserHandler(payload);
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Invalid admin create payload", error);
    return NextResponse.json(
      { ok: false, message: "Unable to read the request body." },
      { status: 400 },
    );
  }
}
