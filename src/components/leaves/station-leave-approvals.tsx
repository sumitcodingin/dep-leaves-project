"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";

type ApprovalRecord = {
  applicationId: string;
  referenceCode: string;
  status: string;
  applicationStatus: string;
  appliedAt: string;
  applicant: {
    id: string;
    name: string;
    role: string;
    department: string;
    designation: string;
  };
  leaveWindow: {
    from: string;
    to: string;
    totalDays: number;
  };
  purpose: string;
  contactDuringLeave?: string | null;
  destination?: string | null;
  remarks?: string | null;
  actedAt?: string | null;
};

const statusTone = (value: string) => {
  if (value === "PENDING" || value === "IN_REVIEW") {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }
  if (value === "APPROVED") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
  if (value === "REJECTED") {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }
  return "bg-slate-100 text-slate-700 ring-slate-200";
};

export const StationLeaveApprovals = ({ role }: { role: string }) => {
  const [items, setItems] = useState<ApprovalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [remarksById, setRemarksById] = useState<Record<string, string>>({});

  const loadItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/station-leave/approvals", {
        method: "GET",
        cache: "no-store",
      });
      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
        data?: ApprovalRecord[];
      };

      if (!response.ok || !result.ok) {
        if (response.status === 403) {
          setItems([]);
          setError(null);
          return;
        }

        throw new Error(result.message ?? "Unable to load approvals.");
      }

      setItems(result.data ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load approvals.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const pendingItems = useMemo(
    () =>
      items.filter(
        (item) => item.status === "PENDING" || item.status === "IN_REVIEW",
      ),
    [items],
  );

  const handledItems = useMemo(
    () =>
      items.filter(
        (item) => item.status !== "PENDING" && item.status !== "IN_REVIEW",
      ),
    [items],
  );

  const runDecision = async (
    applicationId: string,
    decision: "APPROVE" | "REJECT",
  ) => {
    setBusyId(applicationId);
    setError(null);

    try {
      const response = await fetch(
        `/api/station-leave/approvals/${applicationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            decision,
            remarks: remarksById[applicationId] || undefined,
          }),
        },
      );

      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };
      if (!response.ok || !result.ok) {
        throw new Error(result.message ?? "Unable to update request.");
      }

      await loadItems();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update request.",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <SurfaceCard className="space-y-2 border-slate-200/80 p-5">
        <p className="text-xl font-semibold text-slate-900">
          Station Leave Approvals
        </p>
        <p className="text-sm text-slate-600">
          Role: {role.toUpperCase()} | Review pending station leave requests,
          then approve or reject with remarks.
        </p>
      </SurfaceCard>

      {error ? (
        <SurfaceCard className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </SurfaceCard>
      ) : null}

      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Pending approvals
        </p>
        {loading ? (
          <SurfaceCard className="p-4 text-sm text-slate-600">
            Loading requests...
          </SurfaceCard>
        ) : pendingItems.length === 0 ? (
          <SurfaceCard className="p-4 text-sm text-slate-600">
            No pending station leave approvals mapped to you.
          </SurfaceCard>
        ) : (
          pendingItems.map((item) => (
            <SurfaceCard
              key={item.applicationId}
              className="space-y-3 border-slate-200/80 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {item.referenceCode}
                  </p>
                  <p className="text-xs text-slate-500">
                    Applied by {item.applicant.name} ({item.applicant.role}) -{" "}
                    {item.applicant.department}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusTone(item.status)}`}
                >
                  {item.status}
                </span>
              </div>

              <div className="space-y-1 text-sm text-slate-700">
                <p>
                  <span className="font-semibold">Leave window:</span>{" "}
                  {new Date(item.leaveWindow.from).toLocaleDateString("en-GB")}{" "}
                  to {new Date(item.leaveWindow.to).toLocaleDateString("en-GB")}{" "}
                  ({item.leaveWindow.totalDays} days)
                </p>
                <p>
                  <span className="font-semibold">Purpose:</span> {item.purpose}
                </p>
                <p>
                  <span className="font-semibold">Contact:</span>{" "}
                  {item.contactDuringLeave || "Not provided"}
                </p>
              </div>

              <textarea
                value={remarksById[item.applicationId] ?? ""}
                onChange={(event) =>
                  setRemarksById((prev) => ({
                    ...prev,
                    [item.applicationId]: event.target.value,
                  }))
                }
                placeholder="Remarks (optional)"
                className="min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />

              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => runDecision(item.applicationId, "REJECT")}
                  disabled={busyId === item.applicationId}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => runDecision(item.applicationId, "APPROVE")}
                  disabled={busyId === item.applicationId}
                >
                  {busyId === item.applicationId ? "Saving..." : "Approve"}
                </Button>
              </div>
            </SurfaceCard>
          ))
        )}
      </section>

      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Recently handled
        </p>
        {loading ? null : handledItems.length === 0 ? (
          <SurfaceCard className="p-4 text-sm text-slate-600">
            No handled requests yet.
          </SurfaceCard>
        ) : (
          handledItems.slice(0, 8).map((item) => (
            <SurfaceCard
              key={item.applicationId}
              className="border-slate-200/80 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">
                  {item.referenceCode}
                </p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusTone(item.status)}`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {item.applicant.name} | {item.purpose} |{" "}
                {item.actedAt ? new Date(item.actedAt).toLocaleString() : "-"}
              </p>
            </SurfaceCard>
          ))
        )}
      </section>
    </div>
  );
};
