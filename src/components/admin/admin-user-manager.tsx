"use client";

import { useState } from "react";

import { SurfaceCard } from "@/components/ui/surface-card";
import { ManualUserForm } from "@/components/admin/manual-user-form";
import { CsvUploadForm } from "@/components/admin/csv-upload-form";

export const AdminUserManager = () => {
  const [adminEmail] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("lf-user-email");
  });

  if (!adminEmail) {
    return (
      <SurfaceCard className="space-y-3" spotlight>
        <p className="text-xl font-semibold text-slate-900">
          Admin verification required
        </p>
        <p className="text-sm text-slate-600">
          We could not determine your admin session. Please sign in with the
          portal admin account again to load the provisioning tools.
        </p>
      </SurfaceCard>
    );
  }

  return (
    <div className="space-y-6">
      <ManualUserForm adminEmail={adminEmail} />
      <CsvUploadForm adminEmail={adminEmail} />
    </div>
  );
};
