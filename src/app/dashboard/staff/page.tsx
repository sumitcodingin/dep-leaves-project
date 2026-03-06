import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { LeaveOptions } from "@/components/leaves/leave-options";
import { staffDashboard } from "@/modules/roles/staff/config";
import { requireRoleForPage } from "@/server/auth/page-access";

export default async function StaffDashboardPage() {
  await requireRoleForPage("staff");

  return (
    <DashboardShell>
      <LeaveOptions role="staff" />
      <RoleDashboard config={staffDashboard} />
    </DashboardShell>
  );
}
