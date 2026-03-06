import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { RoleSlug } from "@/modules/roles";

type LeaveCard = {
  title: string;
  description: string;
  href: string;
  disabledFor?: RoleSlug[];
};

const leaveCards: LeaveCard[] = [
  {
    title: "Joining Report",
    description: "Submit rejoining details after sanctioned leave.",
    href: "/joining-report",
    disabledFor: ["dean", "registrar"],
  },
  {
    title: "Earned Leave",
    description: "Apply for earned leave or extension.",
    href: "/earned-leave",
  },
  {
    title: "Ex-India Leave",
    description: "Apply leave for personal ex-India visit.",
    href: "/ex-india-leave",
  },
  {
    title: "Non-Air India",
    description:
      "Request permission for travel by airlines other than Air India.",
    href: "/non-air-india",
  },
  {
    title: "LTC",
    description: "Leave Travel Concession application.",
    href: "/ltc",
  },
  {
    title: "Station Leave",
    description: "Out-of-station permission request.",
    href: "/station-leave",
    disabledFor: ["dean", "registrar"],
  },
];

export const LeavesCatalog = ({ role }: { role: RoleSlug }) => (
  <section className="space-y-4">
    <div className="space-y-1">
      <p className="text-2xl font-semibold text-slate-900">Leaves</p>
      <p className="text-sm text-slate-600">
        Choose one leave form to open a dedicated page.
      </p>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      {leaveCards.map((card) => {
        const disabled = Boolean(card.disabledFor?.includes(role));

        return (
          <SurfaceCard
            key={card.title}
            className="h-full border-slate-200/80 p-5"
          >
            <div className="flex h-full flex-col gap-4">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-slate-900">
                  {card.title}
                </p>
                <p className="text-sm text-slate-500">{card.description}</p>
                {disabled ? (
                  <p className="text-xs font-semibold text-amber-700">
                    Not available for this role.
                  </p>
                ) : null}
              </div>

              {disabled ? (
                <Button
                  variant="secondary"
                  disabled
                  className="w-full justify-center"
                >
                  Not available
                </Button>
              ) : (
                <Button asChild className="w-full justify-center">
                  <Link
                    href={`${card.href}?returnTo=/dashboard/${role}/leaves`}
                  >
                    Open form
                  </Link>
                </Button>
              )}
            </div>
          </SurfaceCard>
        );
      })}
    </div>
  </section>
);
