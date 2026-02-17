import { FilePlus2, Upload } from "lucide-react";

import type { RoleDashboardConfig } from "../types";

export const adminDashboard: RoleDashboardConfig = {
  slug: "admin",
  label: "Portal admin",
  badge: "User provisioning",
  blurb:
    "Add new institute members, assign their roles, and onboard teams in bulk with CSV uploads.",
  helper:
    "Admins never touch the database directly—use the forms below to invite faculty, staff, and approvers.",
  quickActions: [
    {
      label: "Add single member",
      description: "Capture name, role, and department for one colleague.",
      cta: "Open form",
      icon: FilePlus2,
    },
    {
      label: "Upload CSV",
      description: "Import many users at once with a spreadsheet export.",
      cta: "Upload file",
      icon: Upload,
    },
  ],
  sections: [
    {
      title: "What you can manage",
      description:
        "Admins keep the portal roster accurate and aligned with HR records.",
      items: [
        {
          label: "Assign leave roles",
          detail:
            "Choose which workflow (HoD, Dean, Registrar, etc.) each user belongs to.",
          action: "Select role",
        },
        {
          label: "Department mapping",
          detail: "Tag users with department codes for reporting chains.",
          action: "Pick department",
        },
        {
          label: "CSV templates",
          detail: "Download the latest column format before importing data.",
          action: "Download template",
        },
      ],
    },
  ],
};
