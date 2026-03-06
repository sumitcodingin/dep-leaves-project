import type { ReactNode } from "react";

import { DashboardLogoutButton } from "@/components/dashboard/dashboard-logout-button";

export const DashboardShell = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto max-w-5xl space-y-8 py-10">
    <div className="flex justify-end">
      <DashboardLogoutButton />
    </div>
    {children}
  </div>
);
