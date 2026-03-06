import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StationLeaveApprovals } from "@/components/leaves/station-leave-approvals";
import type { RoleSlug } from "@/modules/roles";
import { isRoleSlug } from "@/modules/roles";
import { requireRoleForPage } from "@/server/auth/page-access";

const approvalEnabledRoles: RoleSlug[] = ["hod", "registrar", "director"];

type ApprovalsPageProps = {
  params: Promise<{ role: string }>;
};

export default async function ApprovalsPage({ params }: ApprovalsPageProps) {
  const { role } = await params;

  if (!isRoleSlug(role)) {
    redirect("/login");
  }

  await requireRoleForPage(role);

  if (!approvalEnabledRoles.includes(role)) {
    redirect(`/dashboard/${role}`);
  }

  return (
    <DashboardShell>
      <StationLeaveApprovals role={role} />
    </DashboardShell>
  );
}
