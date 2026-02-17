import { NextResponse } from "next/server";

import { verifyOtpHandler } from "@/server/routes/auth/verify-otp";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await verifyOtpHandler(payload);
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Invalid OTP verification payload", error);
    return NextResponse.json(
      { ok: false, message: "Unable to read the request body." },
      { status: 400 },
    );
  }
}
