import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LeavesCatalog } from "@/components/leaves/leaves-catalog";
import { isRoleSlug } from "@/modules/roles";
import { requireRoleForPage } from "@/server/auth/page-access";

type LeavesPageProps = {
  params: Promise<{ role: string }>;
};

export default async function LeavesPage({ params }: LeavesPageProps) {
  const { role } = await params;

  if (!isRoleSlug(role)) {
    redirect("/login");
  }

  await requireRoleForPage(role);

  return (
    <DashboardShell>
      <LeavesCatalog role={role} />
    </DashboardShell>
  );
}
