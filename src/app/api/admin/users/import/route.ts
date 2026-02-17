import { NextResponse } from "next/server";

import { importUsersHandler } from "@/server/routes/admin/users";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await importUsersHandler(payload);
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Invalid admin import payload", error);
    return NextResponse.json(
      { ok: false, message: "Unable to read the request body." },
      { status: 400 },
    );
  }
}
