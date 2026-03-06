import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { LeaveOptions } from "@/components/leaves/leave-options";
import { facultyDashboard } from "@/modules/roles/faculty/config";
import { requireRoleForPage } from "@/server/auth/page-access";

export default async function FacultyDashboardPage() {
  await requireRoleForPage("faculty");

  return (
    <DashboardShell>
      <LeaveOptions role="faculty" />
      <RoleDashboard config={facultyDashboard} />
    </DashboardShell>
  );
}
