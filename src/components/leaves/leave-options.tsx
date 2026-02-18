import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { SurfaceCard } from "@/components/ui/surface-card";
import type { RoleSlug } from "@/modules/roles";
import { getLeaveFormsForRole } from "@/modules/leaves";

export const LeaveOptions = ({ role }: { role: RoleSlug }) => {
  const options = getLeaveFormsForRole(role);

  if (!options.length) return null;

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-xl font-semibold text-slate-900">
          Leave applications
        </p>
        <p className="text-sm text-slate-500">
          Pick the flow that matches your travel or holiday plan. We will show
          the full form on the next screen.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {options.map((option) => (
          <SurfaceCard
            key={option.slug}
            className="h-full border-slate-200/80 p-5"
          >
            <div className="flex h-full flex-col gap-4">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {option.category}
                </span>
                <p className="text-lg font-semibold text-slate-900">
                  {option.title}
                </p>
                <p className="text-sm text-slate-500">{option.summary}</p>
              </div>
              <Link
                href={`/dashboard/${role}/leaves/${option.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
              >
                {option.cta}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </SurfaceCard>
        ))}
      </div>
    </section>
  );
};
