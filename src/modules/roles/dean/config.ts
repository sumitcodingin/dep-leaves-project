import { FileCheck2, FileSignature, MapPin } from "lucide-react";

import type { RoleDashboardConfig } from "../types";

export const deanDashboard: RoleDashboardConfig = {
  slug: "dean",
  label: "Dean Affairs",
  badge: "Approver",
  blurb:
    "Review HoD-cleared items, handle HoD leave, and clear ex-India plans before Director / Establishment.",
  helper:
    "Dean is the final stop for most teaching leave unless Director approval is flagged.",
  quickActions: [
    {
      label: "Station leave approvals",
      description: "Review and decide station leave requests assigned to Dean.",
      cta: "Open approvals",
      href: "/dashboard/dean/approvals",
      icon: MapPin,
    },
    {
      label: "Joining report",
      description: "Record post-leave joining updates from departments.",
      cta: "Fill the form",
      href: "/joining-report?returnTo=/dashboard/dean",
      icon: FileCheck2,
    },
    {
      label: "Earned leave form",
      description: "Application for leave or extension (bilingual).",
      cta: "Fill the form",
      href: "/earned-leave?returnTo=/dashboard/dean",
      icon: FileSignature,
    },
    {
      label: "Leave for Ex-India visit",
      description: "Four-page application with undertakings (Form I & II).",
      cta: "Fill the form",
      href: "/ex-india-leave?returnTo=/dashboard/dean",
      icon: FileSignature,
    },
    {
      label: "Travel other than Air India",
      description: "Permission request to fly airlines other than Air India.",
      cta: "Fill the form",
      href: "/non-air-india?returnTo=/dashboard/dean",
      icon: FileSignature,
    },
    {
      label: "LTC form",
      description: "Leave Travel Concession application (2 pages).",
      cta: "Fill the form",
      href: "/ltc?returnTo=/dashboard/dean",
      icon: FileSignature,
    },
  ],
  sections: [
    {
      title: "Director-bound items",
      description: "Make sure dossiers are complete before escalation.",
      items: [
        {
          label: "Sabbatical / long leave",
          detail: "Need Director + Board signoff after you endorse.",
          action: "Prepare brief",
        },
        {
          label: "Air India exemptions",
          detail: "Confirm justification before forwarding to Director.",
          action: "Review request",
        },
        {
          label: "Office order notes",
          detail: "Provide remarks for Establishment to draft orders.",
          action: "Add remarks",
        },
      ],
    },
  ],
};
