import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { deanDashboard } from "@/modules/roles/dean/config";
import { requireRoleForPage } from "@/server/auth/page-access";

export default async function DeanDashboardPage() {
  await requireRoleForPage("dean");

  return (
    <DashboardShell>
      <RoleDashboard config={deanDashboard} />
    </DashboardShell>
  );
}
