"use client";
import { ManualUserForm } from "@/components/admin/manual-user-form";
import { CsvUploadForm } from "@/components/admin/csv-upload-form";

export const AdminUserManager = () => {
  return (
    <div className="space-y-6">
      <ManualUserForm />
      <CsvUploadForm />
    </div>
  );
};
