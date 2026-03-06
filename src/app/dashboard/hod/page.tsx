import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { hodDashboard } from "@/modules/roles/hod/config";
import { requireRoleForPage } from "@/server/auth/page-access";

export default async function HodDashboardPage() {
  await requireRoleForPage("hod");

  return (
    <DashboardShell>
      <RoleDashboard config={hodDashboard} />
    </DashboardShell>
  );
}
