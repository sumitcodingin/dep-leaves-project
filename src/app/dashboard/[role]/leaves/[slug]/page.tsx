import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatusPill } from "@/components/ui/status-pill";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { RoleSlug } from "@/modules/roles";
import { isRoleSlug } from "@/modules/roles";
import {
  getLeaveFormsForRole,
  resolveLeaveFormForRole,
} from "@/modules/leaves";

const leaveEnabledRoles: RoleSlug[] = ["faculty", "staff"];

type LeaveFormPageProps = {
  params: Promise<{ role: string; slug: string }>;
};

export async function generateStaticParams() {
  return leaveEnabledRoles.flatMap((role) =>
    getLeaveFormsForRole(role).map((form) => ({
      role,
      slug: form.slug,
    })),
  );
}

const isLeaveRole = (
  role: RoleSlug,
): role is (typeof leaveEnabledRoles)[number] =>
  leaveEnabledRoles.includes(role);

export default async function LeaveFormPage({ params }: LeaveFormPageProps) {
  const { role: roleParam, slug } = await params;

  if (!isRoleSlug(roleParam)) {
    notFound();
  }

  const form = isLeaveRole(roleParam)
    ? resolveLeaveFormForRole(slug, roleParam)
    : null;

  const heading = form?.title ?? "Leave form coming soon";
  const summary =
    form?.summary ??
    `We are building this flow for ${roleParam} applicants. The full form will appear here once ready.`;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <Link
          href={`/dashboard/${roleParam}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <div className="space-y-3">
          <StatusPill label="Coming soon" tone="draft" />
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold text-slate-900">{heading}</h1>
            <p className="text-base text-slate-600">{summary}</p>
          </div>
        </div>

        <SurfaceCard className="flex flex-col items-start gap-3 border-slate-200/80 p-5">
          <FileText className="h-8 w-8 text-slate-300" />
          <p className="text-lg font-semibold text-slate-900">TODO</p>
          <p className="text-sm text-slate-500">
            We still need to capture leave details, review the request, and
            submit it for approvals from this page.
          </p>
        </SurfaceCard>
      </div>
    </DashboardShell>
  );
}
