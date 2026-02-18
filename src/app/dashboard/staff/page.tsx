import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { LeaveOptions } from "@/components/leaves/leave-options";
import { staffDashboard } from "@/modules/roles/staff/config";

export default function StaffDashboardPage() {
  return (
    <DashboardShell>
      <LeaveOptions role="staff" />
      <RoleDashboard config={staffDashboard} />
    </DashboardShell>
  );
}
