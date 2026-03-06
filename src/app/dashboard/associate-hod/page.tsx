import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { associateHoDDashboard } from "@/modules/roles/associate-hod/config";
import { requireRoleForPage } from "@/server/auth/page-access";

export default async function AssociateHodDashboardPage() {
  await requireRoleForPage("associate-hod");

  return (
    <DashboardShell>
      <RoleDashboard config={associateHoDDashboard} />
    </DashboardShell>
  );
}
