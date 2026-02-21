import { FileCheck2, FileSignature, MapPin } from "lucide-react";

import type { RoleDashboardConfig } from "../types";

export const associateHoDDashboard: RoleDashboardConfig = {
  slug: "associate-hod",
  label: "Associate HoD",
  badge: "Delegated approver",
  blurb:
    "Act when HoD assigns you approvals; keep Dean looped in and update coverage plans.",
  helper: "Only sees queues explicitly delegated by the HoD.",
  quickActions: [
    {
      label: "Joining report",
      description: "Confirm faculty have rejoined after leave.",
      cta: "Fill the form",
      href: "/joining-report?returnTo=/dashboard/associate-hod",
      icon: FileCheck2,
    },
    {
      label: "Earned leave form",
      description: "Application for leave or extension (bilingual).",
      cta: "Fill the form",
      href: "/earned-leave?returnTo=/dashboard/associate-hod",
      icon: FileSignature,
    },
    {
      label: "Leave for Ex-India visit",
      description: "Four-page application with undertakings (Form I & II).",
      cta: "Fill the form",
      href: "/ex-india-leave?returnTo=/dashboard/associate-hod",
      icon: FileSignature,
    },
    {
      label: "Travel other than Air India",
      description: "Permission request to fly airlines other than Air India.",
      cta: "Fill the form",
      href: "/non-air-india?returnTo=/dashboard/associate-hod",
      icon: FileSignature,
    },
    {
      label: "LTC form",
      description: "Leave Travel Concession application (2 pages).",
      cta: "Fill the form",
      href: "/ltc?returnTo=/dashboard/associate-hod",
      icon: FileSignature,
    },
    {
      label: "Station leave form",
      description: "Station leave permission request.",
      cta: "Fill the form",
      href: "/station-leave?returnTo=/dashboard/associate-hod",
      icon: MapPin,
    },
  ],
  sections: [
    {
      title: "Delegation toolkit",
      description: "Everything you need while acting HoD.",
      items: [
        {
          label: "Faculty leave approvals",
          detail: "Mirror HoD decision notes for transparency.",
          action: "Start reviewing",
        },
        {
          label: "Escalate exceptions",
          detail: "Flag unusual long-duration breaks to Dean.",
          action: "Escalate",
        },
        {
          label: "Return control",
          detail: "Hand approvals back when HoD resumes.",
          action: "End delegation",
        },
      ],
    },
  ],
};
