import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { adminDashboard } from "@/modules/roles/admin/config";
import { AdminUserManager } from "@/components/admin/admin-user-manager";

export default function AdminDashboardPage() {
  return (
    <DashboardShell>
      <RoleDashboard config={adminDashboard} />
      <AdminUserManager />
    </DashboardShell>
  );
}
