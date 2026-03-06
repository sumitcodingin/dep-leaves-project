import { FileCheck2, FileSignature, MapPin } from "lucide-react";

import type { RoleDashboardConfig } from "../types";

export const directorDashboard: RoleDashboardConfig = {
  slug: "director",
  label: "Director",
  badge: "Final authority",
  blurb:
    "See escalations needing institute-level approval (long breaks, ex-India visits, airline exemptions).",
  helper: "Only requests flagged by Dean/Registrar appear here.",
  quickActions: [
    {
      label: "Station leave approvals",
      description:
        "Review and decide station leave requests routed to Director.",
      cta: "Open approvals",
      href: "/dashboard/director/approvals",
      icon: MapPin,
    },
    {
      label: "Joining report",
      description: "Review critical rejoining confirmations escalated to you.",
      cta: "Fill the form",
      href: "/joining-report?returnTo=/dashboard/director",
      // Open in same window; target removed.
      icon: FileCheck2,
    },
    {
      label: "Earned leave form",
      description: "Application for leave or extension (bilingual).",
      cta: "Fill the form",
      href: "/earned-leave?returnTo=/dashboard/director",
      icon: FileSignature,
    },
    {
      label: "Leave for Ex-India visit",
      description: "Four-page application with undertakings (Form I & II).",
      cta: "Fill the form",
      href: "/ex-india-leave?returnTo=/dashboard/director",
      icon: FileSignature,
    },
    {
      label: "Travel other than Air India",
      description: "Permission request to fly airlines other than Air India.",
      cta: "Fill the form",
      href: "/non-air-india?returnTo=/dashboard/director",
      icon: FileSignature,
    },
    {
      label: "LTC form",
      description: "Leave Travel Concession application (2 pages).",
      cta: "Fill the form",
      href: "/ltc?returnTo=/dashboard/director",
      icon: FileSignature,
    },
    {
      label: "Station leave form",
      description: "Station leave permission request.",
      cta: "Fill the form",
      href: "/station-leave?returnTo=/dashboard/director",
      icon: MapPin,
    },
  ],
  sections: [
    {
      title: "What needs your decision",
      description: "Prepared by Dean/Registrar.",
      items: [
        {
          label: "Sabbatical approvals",
          detail: "Ensure coverage + funding plan is supplied.",
          action: "Approve / decline",
        },
        {
          label: "Director’s notes",
          detail: "Add remarks for Establishment orders.",
          action: "Add note",
        },
        {
          label: "Communicate decisions",
          detail: "Send signed memo back to Dean & Registrar.",
          action: "Send memo",
        },
      ],
    },
  ],
};
