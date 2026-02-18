import type { RoleSlug } from "@/modules/roles";

export type LeaveFormRoleOverride = {
  title?: string;
  summary?: string;
  cta?: string;
};

export type LeaveFormDefinition = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  cta: string;
  roles: RoleSlug[];
  steps: string[];
  roleOverrides?: Partial<Record<RoleSlug, LeaveFormRoleOverride>>;
};

const leaveForms: LeaveFormDefinition[] = [
  {
    slug: "earned-station-leave",
    title: "Earned / Station Leave",
    summary:
      "Plan earned leave, include station leave information, and nominate a reliever so HoD / Registrar can clear it quickly.",
    category: "Time away",
    cta: "Start leave form",
    roles: ["faculty", "staff"],
    steps: [
      "Enter start / end dates and whether you will be out of station.",
      "Share work handover or reporting officer acknowledgement.",
      "Upload supporting memo if the request is longer than 10 days.",
      "Review the summary and submit to kick off the approvals.",
    ],
    roleOverrides: {
      staff: {
        title: "Earned / Casual Leave",
        summary:
          "Request casual or earned leave and route it automatically to your reporting officer and Registrar.",
        cta: "Request leave",
      },
    },
  },
  {
    slug: "ex-india-visit",
    title: "Ex-India Visit",
    summary:
      "Start approvals for academic travel outside India. Attach invitation letters and funding approvals for Dean / Director.",
    category: "Travel",
    cta: "Begin ex-India",
    roles: ["faculty"],
    steps: [
      "Capture itinerary, host institute details, and estimated cost.",
      "Tag whether institute funds are being used for tickets / stay.",
      "Upload invitation letter plus any LTC or project approvals.",
      "Review obligations (bond, report) before submitting.",
    ],
  },
  {
    slug: "air-india-exemption",
    title: "Air India Exemption",
    summary:
      "Use when you need director approval to fly airlines other than Air India on official duty.",
    category: "Travel",
    cta: "Request exemption",
    roles: ["faculty"],
    steps: [
      "List proposed airlines, sectors, and fare comparison.",
      "Explain why Air India or Alliance Air options are not feasible.",
      "Upload quotations or screenshots validating availability.",
      "Confirm compliance statement then submit for approval.",
    ],
  },
  {
    slug: "restricted-holiday",
    title: "Restricted Holiday",
    summary:
      "Plan restricted holiday / compensatory off so Establishment can record it against your leave ledger.",
    category: "Holiday",
    cta: "Book holiday",
    roles: ["staff"],
    steps: [
      "Choose the restricted holiday or comp-off date.",
      "Reference the duty performed (if claiming comp-off).",
      "Upload supporting memo signed by your supervisor.",
      "Review and submit for Registrar approval.",
    ],
  },
];

const withRoleOverride = (form: LeaveFormDefinition, role: RoleSlug) => {
  const override = form.roleOverrides?.[role];
  return {
    ...form,
    title: override?.title ?? form.title,
    summary: override?.summary ?? form.summary,
    cta: override?.cta ?? form.cta,
  };
};

export const getLeaveFormsForRole = (role: RoleSlug) =>
  leaveForms
    .filter((form) => form.roles.includes(role))
    .map((form) => withRoleOverride(form, role));

export const getLeaveFormBySlug = (slug: string) =>
  leaveForms.find((form) => form.slug === slug);

export const resolveLeaveFormForRole = (slug: string, role: RoleSlug) => {
  const form = getLeaveFormBySlug(slug);
  if (!form || !form.roles.includes(role)) return null;
  return withRoleOverride(form, role);
};

export type LeaveFormForRole = ReturnType<typeof resolveLeaveFormForRole>;
