import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { registrarDashboard } from "@/modules/roles/registrar/config";
import { requireRoleForPage } from "@/server/auth/page-access";

export default async function RegistrarDashboardPage() {
  await requireRoleForPage("registrar");

  return (
    <DashboardShell>
      <RoleDashboard config={registrarDashboard} />
    </DashboardShell>
  );
}
