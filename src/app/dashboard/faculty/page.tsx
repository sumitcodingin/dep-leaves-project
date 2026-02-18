import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { LeaveOptions } from "@/components/leaves/leave-options";
import { facultyDashboard } from "@/modules/roles/faculty/config";

export default function FacultyDashboardPage() {
  return (
    <DashboardShell>
      <LeaveOptions role="faculty" />
      <RoleDashboard config={facultyDashboard} />
    </DashboardShell>
  );
}
