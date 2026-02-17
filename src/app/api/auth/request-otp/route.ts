import { NextResponse } from "next/server";

import { requestOtpHandler } from "@/server/routes/auth/request-otp";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await requestOtpHandler(payload);
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Invalid OTP request payload", error);
    return NextResponse.json(
      { ok: false, message: "Unable to read the request body." },
      { status: 400 },
    );
  }
}
