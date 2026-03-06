import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { establishmentDashboard } from "@/modules/roles/establishment/config";
import { requireRoleForPage } from "@/server/auth/page-access";

export default async function EstablishmentDashboardPage() {
  await requireRoleForPage("establishment");

  return (
    <DashboardShell>
      <RoleDashboard config={establishmentDashboard} />
    </DashboardShell>
  );
}
