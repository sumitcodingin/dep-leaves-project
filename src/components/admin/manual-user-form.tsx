"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { roleOptions, type RoleOptionKey } from "@/data/role-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SurfaceCard } from "@/components/ui/surface-card";

const manualUserSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Enter a valid institute email"),
  roleKey: z.string().min(1),
  departmentCode: z.string().optional(),
  designation: z.string().optional(),
  employeeCode: z.string().optional(),
  isTeaching: z.boolean().optional(),
});

export type ManualUserFormValues = z.infer<typeof manualUserSchema>;

export const ManualUserForm = ({ adminEmail }: { adminEmail: string }) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "error" | null>(
    null,
  );

  const form = useForm<ManualUserFormValues>({
    resolver: zodResolver(manualUserSchema),
    defaultValues: {
      name: "",
      email: "",
      roleKey: roleOptions[0]?.key ?? "FACULTY",
      departmentCode: "",
      designation: "",
      employeeCode: "",
      isTeaching: false,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!adminEmail) return;

    setStatusMessage(null);
    setStatusTone(null);

    try {
      const payload = {
        requesterEmail: adminEmail,
        user: {
          ...values,
          email: values.email.trim().toLowerCase(),
          roleKey: values.roleKey as RoleOptionKey,
          departmentCode: values.departmentCode?.toUpperCase() ?? null,
        },
      };

      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { ok: boolean; message: string };

      if (!response.ok) {
        setStatusTone("error");
        setStatusMessage(data.message ?? "Unable to add user.");
        return;
      }

      setStatusTone("success");
      setStatusMessage(data.message ?? "User added successfully.");
      form.reset({
        name: "",
        email: "",
        roleKey: roleOptions[0]?.key ?? "FACULTY",
        departmentCode: "",
        designation: "",
        employeeCode: "",
        isTeaching: false,
      });
    } catch (error) {
      console.error("Add user failed", error);
      setStatusTone("error");
      setStatusMessage("Something went wrong while saving the user.");
    }
  });

  return (
    <SurfaceCard className="space-y-6" spotlight>
      <div>
        <p className="text-xl font-semibold text-slate-900">
          Add a single user
        </p>
        <p className="text-sm text-slate-500">
          Fill in the mandatory fields and we will create the user with the
          selected role immediately.
        </p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              placeholder="Dr. Aditi Sharma"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-rose-600">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Institute email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@iitrpr.ac.in"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-rose-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              {...form.register("roleKey")}
            >
              {roleOptions.map((role) => (
                <option key={role.key} value={role.key}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department code</Label>
            <Input
              id="department"
              placeholder="CSE"
              {...form.register("departmentCode")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employeeCode">Employee code</Label>
            <Input
              id="employeeCode"
              placeholder="IITRPR-XYZ"
              {...form.register("employeeCode")}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              placeholder="Associate Professor"
              {...form.register("designation")}
            />
          </div>
          <label className="flex items-center gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              {...form.register("isTeaching")}
              className="h-4 w-4 rounded border-slate-300"
            />
            Treat as teaching faculty
          </label>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!adminEmail || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Saving user..." : "Add user"}
        </Button>
      </form>

      {statusMessage && (
        <p
          className={`text-sm ${statusTone === "success" ? "text-emerald-600" : "text-rose-600"}`}
        >
          {statusMessage}
        </p>
      )}
    </SurfaceCard>
  );
};
