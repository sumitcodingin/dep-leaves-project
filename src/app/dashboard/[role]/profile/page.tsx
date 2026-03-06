import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileDetailsCard } from "@/components/profile/profile-details-card";
import { SurfaceCard } from "@/components/ui/surface-card";
import { isRoleSlug } from "@/modules/roles";
import { requireRoleForPage } from "@/server/auth/page-access";

type ProfilePageProps = {
  params: Promise<{ role: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { role } = await params;

  if (!isRoleSlug(role)) {
    redirect("/login");
  }

  await requireRoleForPage(role);

  return (
    <DashboardShell>
      <SurfaceCard className="space-y-2 border-slate-200/80 p-5">
        <p className="text-2xl font-semibold text-slate-900">My Profile</p>
        <p className="text-sm text-slate-600">
          View your personal and role information used across leave workflows.
        </p>
      </SurfaceCard>
      <ProfileDetailsCard />
    </DashboardShell>
  );
}
