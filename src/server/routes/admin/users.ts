import { RoleKey } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/server/db/prisma";

const baseUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  roleKey: z.nativeEnum(RoleKey),
  departmentCode: z.string().optional().nullable(),
  designation: z.string().optional().nullable(),
  employeeCode: z.string().optional().nullable(),
  isTeaching: z.boolean().optional(),
});

const createSchema = z.object({ user: baseUserSchema });
const importSchema = z.object({
  users: z.array(baseUserSchema).min(1).max(200),
});

type HandlerResult = {
  status: number;
  body: { ok: boolean; message: string };
};

const resolveDepartmentId = async (code?: string | null) => {
  if (!code) return null;
  const normalized = code.toUpperCase();
  const record = await prisma.department.findUnique({
    where: { code: normalized },
  });
  return record?.id ?? null;
};

const createUserRecord = async (input: z.infer<typeof baseUserSchema>) => {
  const normalizedEmail = input.email.toLowerCase();
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    throw new Error(`User with email ${input.email} already exists.`);
  }

  const role = await prisma.role.findUnique({ where: { key: input.roleKey } });
  if (!role) {
    throw new Error(`Role ${input.roleKey} is not configured in the system.`);
  }

  const departmentId = await resolveDepartmentId(
    input.departmentCode ?? undefined,
  );

  await prisma.user.create({
    data: {
      name: input.name,
      email: normalizedEmail,
      designation: input.designation ?? null,
      employeeCode: input.employeeCode ?? null,
      isTeaching: input.isTeaching ?? input.roleKey === RoleKey.FACULTY,
      departmentId,
      roleId: role.id,
    },
  });
};

export const createUserHandler = async (
  payload: unknown,
): Promise<HandlerResult> => {
  try {
    const data = createSchema.parse(payload);

    await createUserRecord(data.user);

    return {
      status: 201,
      body: { ok: true, message: "User added successfully." },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: 400,
        body: { ok: false, message: "Invalid user payload." },
      };
    }

    return {
      status: 400,
      body: {
        ok: false,
        message: error instanceof Error ? error.message : "Unable to add user.",
      },
    };
  }
};

export const importUsersHandler = async (
  payload: unknown,
): Promise<HandlerResult> => {
  try {
    const data = importSchema.parse(payload);

    const successes: string[] = [];
    const failures: string[] = [];

    for (const user of data.users) {
      try {
        await createUserRecord(user);
        successes.push(user.email);
      } catch (error) {
        failures.push(
          `${user.email}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }

    const summaryParts: string[] = [];
    if (successes.length) summaryParts.push(`${successes.length} added`);
    if (failures.length) summaryParts.push(`${failures.length} skipped`);

    const summary = summaryParts.length
      ? summaryParts.join(", ")
      : "No rows processed.";
    const detail = failures.length ? ` Details: ${failures.join("; ")}` : "";

    return {
      status: failures.length ? 207 : 200,
      body: {
        ok: failures.length === 0,
        message: `${summary}${detail}`,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: 400,
        body: { ok: false, message: "Invalid import payload." },
      };
    }

    return {
      status: 400,
      body: {
        ok: false,
        message: error instanceof Error ? error.message : "Import failed.",
      },
    };
  }
};
