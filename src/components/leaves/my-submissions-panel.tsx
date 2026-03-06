"use client";

import { useEffect, useState } from "react";

import { SurfaceCard } from "@/components/ui/surface-card";

type SubmissionItem = {
  id: string;
  referenceCode: string;
  leaveType: string;
  status: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  submittedAt: string;
  currentApprover: string | null;
};

export const MySubmissionsPanel = () => {
  const [pending, setPending] = useState<SubmissionItem[]>([]);
  const [history, setHistory] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/leaves/my-submissions", {
          method: "GET",
          cache: "no-store",
        });
        const result = (await response.json()) as {
          ok?: boolean;
          message?: string;
          data?: { pending?: SubmissionItem[]; history?: SubmissionItem[] };
        };

        if (!response.ok || !result.ok) {
          throw new Error(
            result.message ?? "Unable to load leave submissions.",
          );
        }

        setPending(result.data?.pending ?? []);
        setHistory(result.data?.history ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load leave submissions.",
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const renderRow = (entry: SubmissionItem) => (
    <div
      key={entry.id}
      className="rounded-xl border border-slate-200/80 px-3 py-2 text-xs text-slate-700"
    >
      <p className="font-semibold text-slate-900">{entry.referenceCode}</p>
      <p>
        {entry.leaveType} |{" "}
        {new Date(entry.startDate).toLocaleDateString("en-GB")} to{" "}
        {new Date(entry.endDate).toLocaleDateString("en-GB")} ({entry.totalDays}{" "}
        days)
      </p>
      <p>
        Status: {entry.status}
        {entry.currentApprover
          ? ` | Pending with: ${entry.currentApprover}`
          : ""}
      </p>
    </div>
  );

  return (
    <section className="space-y-4">
      <SurfaceCard className="space-y-2 border-slate-200/80 p-5">
        <p className="text-lg font-semibold text-slate-900">
          My leave submissions
        </p>
        <p className="text-sm text-slate-600">
          Track pending approvals and view approved or older leave requests.
        </p>
      </SurfaceCard>

      {error ? (
        <SurfaceCard className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </SurfaceCard>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <SurfaceCard className="space-y-3 border-slate-200/80 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Pending approvals
          </p>
          {loading ? (
            <p className="text-sm text-slate-500">
              Loading pending requests...
            </p>
          ) : pending.length === 0 ? (
            <p className="text-sm text-slate-500">No pending approvals.</p>
          ) : (
            <div className="space-y-2">{pending.map(renderRow)}</div>
          )}
        </SurfaceCard>

        <SurfaceCard className="space-y-3 border-slate-200/80 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Approved / old submissions
          </p>
          {loading ? (
            <p className="text-sm text-slate-500">
              Loading previous submissions...
            </p>
          ) : history.length === 0 ? (
            <p className="text-sm text-slate-500">No old submissions yet.</p>
          ) : (
            <div className="space-y-2">{history.map(renderRow)}</div>
          )}
        </SurfaceCard>
      </div>
    </section>
  );
};
