"use client";

import { Upload } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { roleOptions, type RoleOptionKey } from "@/data/role-options";

const templateRows = `name,email,roleKey,departmentCode,designation,employeeCode,isTeaching
Dr. Arjun Rao,2023csb1288+newfac@iitrpr.ac.in,FACULTY,CSE,Associate Professor,IITRPR-F010,true`;

type ParsedUser = {
  name: string;
  email: string;
  roleKey: RoleOptionKey;
  departmentCode?: string;
  designation?: string;
  employeeCode?: string;
  isTeaching?: boolean;
};

const allowedRoleKeys = new Set(roleOptions.map((role) => role.key));

const parseCsv = (contents: string): ParsedUser[] => {
  const lines = contents
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length <= 1) return [];

  const headers = lines[0]
    .split(",")
    .map((header) => header.trim().toLowerCase());
  const records: ParsedUser[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = lines[i].split(",").map((value) => value.trim());
    const record: Record<string, string> = {};

    headers.forEach((header, index) => {
      record[header] = values[index] ?? "";
    });

    if (!record.name || !record.email || !record.rolekey) continue;

    const roleKeyCandidate = record.rolekey.toUpperCase() as RoleOptionKey;
    if (!allowedRoleKeys.has(roleKeyCandidate)) continue;

    records.push({
      name: record.name,
      email: record.email.toLowerCase(),
      roleKey: roleKeyCandidate,
      departmentCode: record.departmentcode?.toUpperCase(),
      designation: record.designation,
      employeeCode: record.employeecode,
      isTeaching: record.isteaching
        ? record.isteaching.toLowerCase() === "true"
        : undefined,
    });
  }

  return records;
};

export const CsvUploadForm = ({ adminEmail }: { adminEmail: string }) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "error" | null>(
    null,
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (file: File) => {
    setStatusMessage(null);
    setStatusTone(null);

    try {
      const contents = await file.text();
      const parsed = parseCsv(contents);

      if (parsed.length === 0) {
        setStatusTone("error");
        setStatusMessage("No valid rows found in the CSV file.");
        return;
      }

      setIsUploading(true);

      const response = await fetch("/api/admin/users/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requesterEmail: adminEmail, users: parsed }),
      });

      const data = (await response.json()) as { ok: boolean; message: string };

      if (!response.ok) {
        setStatusTone("error");
        setStatusMessage(data.message ?? "Bulk import failed.");
        return;
      }

      setStatusTone("success");
      setStatusMessage(
        data.message ?? `Imported ${parsed.length} users successfully.`,
      );
    } catch (error) {
      console.error("CSV upload failed", error);
      setStatusTone("error");
      setStatusMessage("Could not process the CSV file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SurfaceCard className="space-y-5">
      <div className="flex flex-col gap-2">
        <p className="text-xl font-semibold text-slate-900">Import from CSV</p>
        <p className="text-sm text-slate-500">
          Use the template to prep your sheet. The first row must match the
          column names exactly.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600">
          <Upload className="h-4 w-4" />
          <span>{isUploading ? "Uploading..." : "Select CSV file"}</span>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            disabled={isUploading || !adminEmail}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void handleFile(file);
                event.target.value = "";
              }
            }}
          />
        </label>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            const blob = new Blob([templateRows], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "leaveflow-user-template.csv";
            anchor.click();
            URL.revokeObjectURL(url);
          }}
        >
          Download template
        </Button>
      </div>

      {statusMessage && (
        <p
          className={`text-sm ${statusTone === "success" ? "text-emerald-600" : "text-rose-600"}`}
        >
          {statusMessage}
        </p>
      )}
    </SurfaceCard>
  );
};
