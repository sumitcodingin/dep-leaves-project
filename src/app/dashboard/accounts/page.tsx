import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { accountsDashboard } from "@/modules/roles/accounts/config";
import { requireRoleForPage } from "@/server/auth/page-access";

export default async function AccountsDashboardPage() {
  await requireRoleForPage("accounts");

  return (
    <DashboardShell>
      <RoleDashboard config={accountsDashboard} />
    </DashboardShell>
  );
}
