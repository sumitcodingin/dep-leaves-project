import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  SESSION_COOKIE_NAME,
  sessionCookieConfig,
} from "@/server/auth/session";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    ...sessionCookieConfig,
    maxAge: 0,
  });

  return NextResponse.json({ ok: true, message: "Logged out successfully." });
}
