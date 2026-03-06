import { differenceInMinutes } from "date-fns";
import { RoleKey } from "@prisma/client";
import { z } from "zod";

import type { RoleSlug } from "@/modules/roles";
import { verifyOtp } from "@/server/auth/otp";
import { createSessionToken } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const roleSlugMap: Record<RoleKey, RoleSlug> = {
  [RoleKey.FACULTY]: "faculty",
  [RoleKey.STAFF]: "staff",
  [RoleKey.HOD]: "hod",
  [RoleKey.ASSOCIATE_HOD]: "associate-hod",
  [RoleKey.DEAN]: "dean",
  [RoleKey.REGISTRAR]: "registrar",
  [RoleKey.DIRECTOR]: "director",
  [RoleKey.ACCOUNTS]: "accounts",
  [RoleKey.ESTABLISHMENT]: "establishment",
  [RoleKey.ADMIN]: "admin",
};

const resolveRoleKey = (
  providedKey: RoleKey | null | undefined,
  isTeaching: boolean,
) => {
  if (providedKey) return providedKey;
  return isTeaching ? RoleKey.FACULTY : RoleKey.STAFF;
};

type VerifyHandlerResponse = {
  status: number;
  sessionToken?: string;
  body:
    | {
        ok: true;
        message: string;
        role: RoleSlug;
        redirectTo: string;
        user: {
          id: string;
          name: string;
          email: string;
          roleKey: RoleKey;
        };
      }
    | {
        ok: false;
        message: string;
      };
};

export const verifyOtpHandler = async (
  payload: unknown,
): Promise<VerifyHandlerResponse> => {
  try {
    const { email, code } = verifySchema.parse(payload);
    const normalizedEmail = email.trim().toLowerCase();

    const token = await prisma.otpToken.findFirst({
      where: { email: normalizedEmail },
      orderBy: { createdAt: "desc" },
    });

    if (!token) {
      return {
        status: 404,
        body: { ok: false, message: "Please request a fresh OTP." },
      };
    }

    if (token.consumedAt) {
      return {
        status: 410,
        body: { ok: false, message: "This OTP has already been used." },
      };
    }

    if (token.expiresAt < new Date()) {
      return {
        status: 410,
        body: { ok: false, message: "The OTP has expired. Request a new one." },
      };
    }

    const match = await verifyOtp(code, token.tokenHash);
    if (!match) {
      await prisma.otpToken.update({
        where: { id: token.id },
        data: { attempts: { increment: 1 } },
      });

      return {
        status: 401,
        body: { ok: false, message: "Incorrect code. Please try again." },
      };
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { role: true },
    });
    if (!user) {
      return {
        status: 404,
        body: { ok: false, message: "Account not found." },
      };
    }

    await prisma.$transaction([
      prisma.otpToken.update({
        where: { id: token.id },
        data: { consumedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      }),
    ]);

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "New sign-in",
        body: `OTP sign-in completed ${differenceInMinutes(new Date(), token.createdAt)} minutes after request.`,
        type: "AUTH",
      },
    });

    const resolvedRoleKey = resolveRoleKey(user.role?.key, user.isTeaching);
    const roleSlug = roleSlugMap[resolvedRoleKey];
    const sessionToken = createSessionToken({
      userId: user.id,
      roleKey: resolvedRoleKey,
    });

    return {
      status: 200,
      sessionToken,
      body: {
        ok: true,
        message: "Signed in successfully.",
        role: roleSlug,
        redirectTo: `/dashboard/${roleSlug}`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roleKey: resolvedRoleKey,
        },
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: 400,
        body: {
          ok: false,
          message: "Please provide a valid email and 6-digit code.",
        },
      };
    }

    console.error("OTP verify failed", error);
    return {
      status: 500,
      body: { ok: false, message: "Unable to verify OTP right now." },
    };
  }
};
