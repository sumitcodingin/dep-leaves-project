import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  SESSION_COOKIE_NAME,
  sessionCookieConfig,
} from "@/server/auth/session";
import { verifyOtpHandler } from "@/server/routes/auth/verify-otp";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await verifyOtpHandler(payload);

    if (result.sessionToken) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: SESSION_COOKIE_NAME,
        value: result.sessionToken,
        ...sessionCookieConfig,
      });
    }

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Invalid OTP verification payload", error);
    return NextResponse.json(
      { ok: false, message: "Unable to read the request body." },
      { status: 400 },
    );
  }
}
