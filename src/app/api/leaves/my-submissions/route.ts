import { cookies } from "next/headers";
import { LeaveStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import {
  AuthError,
  SESSION_COOKIE_NAME,
  requireSessionActor,
} from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

const isPendingStatus = (status: LeaveStatus) =>
  status === LeaveStatus.SUBMITTED || status === LeaveStatus.UNDER_REVIEW;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const actor = await requireSessionActor(token);

    const submissions = await prisma.leaveApplication.findMany({
      where: {
        applicantId: actor.userId,
        status: { not: LeaveStatus.DRAFT },
      },
      include: {
        leaveType: true,
        approvalSteps: {
          orderBy: { sequence: "asc" },
          include: {
            assignedTo: {
              include: { role: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 60,
    });

    const mapped = submissions.map((entry) => {
      const currentStep = entry.approvalSteps.find(
        (step) => step.status === "PENDING" || step.status === "IN_REVIEW",
      );

      return {
        id: entry.id,
        referenceCode: entry.referenceCode,
        leaveType: entry.leaveType.name,
        status: entry.status,
        startDate: entry.startDate.toISOString(),
        endDate: entry.endDate.toISOString(),
        totalDays: entry.totalDays,
        submittedAt:
          entry.submittedAt?.toISOString() ?? entry.createdAt.toISOString(),
        currentApprover:
          currentStep?.assignedTo?.name ??
          currentStep?.assignedTo?.role?.name ??
          null,
      };
    });

    return NextResponse.json({
      ok: true,
      data: {
        pending: mapped.filter((entry) => isPendingStatus(entry.status)),
        history: mapped.filter((entry) => !isPendingStatus(entry.status)),
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
      { ok: false, message: "Unable to load leave submissions." },
      { status: 400 },
    );
  }
}
