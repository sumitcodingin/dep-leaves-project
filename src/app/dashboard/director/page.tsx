import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { directorDashboard } from "@/modules/roles/director/config";
import { requireRoleForPage } from "@/server/auth/page-access";

export default async function DirectorDashboardPage() {
  await requireRoleForPage("director");

  return (
    <DashboardShell>
      <RoleDashboard config={directorDashboard} />
    </DashboardShell>
  );
}
