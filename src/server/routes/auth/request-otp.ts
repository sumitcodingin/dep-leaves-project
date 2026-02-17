import { addMinutes, differenceInSeconds } from "date-fns";
import { z } from "zod";

import { env } from "@/env";
import { generateOtp, hashOtp } from "@/server/auth/otp";
import { sendOtpEmail } from "@/server/email/mailer";
import { prisma } from "@/server/db/prisma";

const requestSchema = z.object({
  email: z.string().email(),
});

const maskEmail = (email: string) => {
  const [userPart, domain] = email.split("@");
  const visible = userPart.slice(0, 2);
  return `${visible}***@${domain}`;
};

type HandlerResponse = {
  status: number;
  body: { ok: boolean; message: string };
};

export const requestOtpHandler = async (
  payload: unknown,
): Promise<HandlerResponse> => {
  try {
    const { email } = requestSchema.parse(payload);
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (!user) {
      return {
        status: 404,
        body: {
          ok: false,
          message: "This email is not registered with the leave portal.",
        },
      };
    }

    const recentToken = await prisma.otpToken.findFirst({
      where: { email: normalizedEmail },
      orderBy: { createdAt: "desc" },
    });

    if (
      recentToken &&
      differenceInSeconds(new Date(), recentToken.createdAt) < 45
    ) {
      return {
        status: 429,
        body: {
          ok: false,
          message: "Please wait a few seconds before requesting another code.",
        },
      };
    }

    await prisma.otpToken.deleteMany({
      where: {
        email: normalizedEmail,
        OR: [{ consumedAt: { not: null } }, { expiresAt: { lt: new Date() } }],
      },
    });

    const otp = generateOtp();
    const tokenHash = await hashOtp(otp);
    const expiresAt = addMinutes(new Date(), env.OTP_EXP_MINUTES);

    await prisma.otpToken.create({
      data: {
        email: normalizedEmail,
        tokenHash,
        expiresAt,
        userId: user.id,
      },
    });

    await sendOtpEmail(normalizedEmail, otp);

    return {
      status: 200,
      body: { ok: true, message: `OTP sent to ${maskEmail(normalizedEmail)}` },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: 400,
        body: { ok: false, message: "Please enter a valid institute email." },
      };
    }

    console.error("OTP request failed", error);
    return {
      status: 500,
      body: {
        ok: false,
        message: "Unable to send OTP right now. Please try again shortly.",
      },
    };
  }
};
