import { FileCheck2, FileSignature, MapPin } from "lucide-react";

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
      label: "Joining report",
      description: "Log rejoining confirmations from onboarded members.",
      cta: "Fill the form",
      href: "/joining-report?returnTo=/dashboard/admin",
      icon: FileCheck2,
    },
    {
      label: "Earned leave form",
      description: "Application for leave or extension (bilingual).",
      cta: "Fill the form",
      href: "/earned-leave?returnTo=/dashboard/admin",
      icon: FileSignature,
    },
    {
      label: "Leave for Ex-India visit",
      description: "Four-page application with undertakings (Form I & II).",
      cta: "Fill the form",
      href: "/ex-india-leave?returnTo=/dashboard/admin",
      icon: FileSignature,
    },
    {
      label: "Travel other than Air India",
      description: "Permission request to fly airlines other than Air India.",
      cta: "Fill the form",
      href: "/non-air-india?returnTo=/dashboard/admin",
      icon: FileSignature,
    },
    {
      label: "LTC form",
      description: "Leave Travel Concession application (2 pages).",
      cta: "Fill the form",
      href: "/ltc?returnTo=/dashboard/admin",
      icon: FileSignature,
    },
    {
      label: "Station leave form",
      description: "Station leave permission request.",
      cta: "Fill the form",
      href: "/station-leave?returnTo=/dashboard/admin",
      icon: MapPin,
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
