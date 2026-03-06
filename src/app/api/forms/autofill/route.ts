import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  AuthError,
  SESSION_COOKIE_NAME,
  requireSessionActor,
} from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const actor = await requireSessionActor(token);

    const user = await prisma.user.findUnique({
      where: { id: actor.userId },
      include: {
        department: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Unable to load user profile." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      data: {
        userId: user.id,
        name: user.name ?? "",
        designation: user.designation ?? "",
        department: user.department?.name ?? "",
        employeeCode: user.employeeCode ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        roleKey: user.role?.key ?? actor.roleKey,
        roleSlug: actor.roleSlug,
        todayDisplay: new Date().toLocaleDateString("en-GB"),
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: error.status },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { ok: false, message: "Unable to load autofill profile." },
      { status: 400 },
    );
  }
}
