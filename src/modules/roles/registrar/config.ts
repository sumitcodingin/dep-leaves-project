import { FileCheck2, FileSignature, MapPin } from "lucide-react";

import type { RoleDashboardConfig } from "../types";

export const registrarDashboard: RoleDashboardConfig = {
  slug: "registrar",
  label: "Registrar",
  badge: "Admin lead",
  blurb:
    "Oversee non-teaching approvals, release office memos, and channel select leaves to Director.",
  helper: "Staff leave always lands here after the reporting officer stage.",
  quickActions: [
    {
      label: "Station leave approvals",
      description:
        "Review and decide station leave requests assigned to Registrar.",
      cta: "Open approvals",
      href: "/dashboard/registrar/approvals",
      icon: MapPin,
    },
    {
      label: "Joining report",
      description: "Capture joining confirmations for staff cases.",
      cta: "Fill the form",
      href: "/joining-report?returnTo=/dashboard/registrar",
      icon: FileCheck2,
    },
    {
      label: "Earned leave form",
      description: "Application for leave or extension (bilingual).",
      cta: "Fill the form",
      href: "/earned-leave?returnTo=/dashboard/registrar",
      icon: FileSignature,
    },
    {
      label: "Leave for Ex-India visit",
      description: "Four-page application with undertakings (Form I & II).",
      cta: "Fill the form",
      href: "/ex-india-leave?returnTo=/dashboard/registrar",
      icon: FileSignature,
    },
    {
      label: "Travel other than Air India",
      description: "Permission request to fly airlines other than Air India.",
      cta: "Fill the form",
      href: "/non-air-india?returnTo=/dashboard/registrar",
      icon: FileSignature,
    },
    {
      label: "LTC form",
      description: "Leave Travel Concession application (2 pages).",
      cta: "Fill the form",
      href: "/ltc?returnTo=/dashboard/registrar",
      icon: FileSignature,
    },
    {
      label: "Station leave form",
      description: "Station leave permission request.",
      cta: "Fill the form",
      href: "/station-leave?returnTo=/dashboard/registrar",
      icon: MapPin,
    },
  ],
  sections: [
    {
      title: "Registrar toolkit",
      description: "Keep records tidy and stakeholders informed.",
      items: [
        {
          label: "Service book updates",
          detail: "Record every sanctioned leave.",
          action: "Update records",
        },
        {
          label: "Office orders",
          detail: "Coordinate with Establishment for limited leaves.",
          action: "Coordinate",
        },
        {
          label: "Accounts coordination",
          detail: "Signal LTC approvals to finance team.",
          action: "Notify Accounts",
        },
      ],
    },
  ],
};
