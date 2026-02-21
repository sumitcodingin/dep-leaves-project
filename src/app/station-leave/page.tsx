"use client";

import type { FormEvent } from "react";
import { useMemo, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { cn } from "@/lib/utils";

const UnderlineInput = ({
  id,
  width = "w-72",
  className,
}: {
  id: string;
  width?: string;
  className?: string;
}) => (
  <input
    id={id}
    name={id}
    type="text"
    className={cn(
      "border-0 border-b border-dashed border-slate-500 bg-transparent px-1 text-[13px] text-slate-900 focus:border-slate-800 focus:outline-none",
      width,
      className,
    )}
  />
);

export default function StationLeavePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const formRef = useRef<HTMLFormElement>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<Record<string, string> | null>(
    null,
  );
  const [confirmed, setConfirmed] = useState(false);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      const safeReturnTo =
        returnTo && returnTo.startsWith("/") ? returnTo : "/";
      router.push(safeReturnTo);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmed(false);
    const form = formRef.current;
    if (!form) return;
    const data = Object.fromEntries(new FormData(form)) as Record<
      string,
      string
    >;
    const required = Array.from(
      form.querySelectorAll<HTMLInputElement>("input"),
    )
      .map((input) => input.name || input.id)
      .filter(Boolean);
    const missing = required.filter((key) => !data[key]?.trim());
    if (missing.length > 0) {
      setMissingFields(Array.from(new Set(missing)));
      setPreviewData(null);
      return;
    }
    setMissingFields([]);
    setPreviewData(data);
  };

  const handleConfirm = () => {
    if (!previewData) return;
    setConfirmed(true);
    console.log("Station leave form confirmed", previewData);
  };

  const previewEntries = useMemo(() => {
    if (!previewData) return [] as Array<[string, string]>;
    return Object.entries(previewData);
  }, [previewData]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="px-0 text-sm font-semibold text-slate-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <SurfaceCard className="mx-auto max-w-3xl space-y-5 border border-slate-300 bg-white p-6 md:p-7">
            <header className="space-y-1 text-center text-slate-900">
              <div className="flex items-start justify-center gap-4">
                <Image
                  src="/iit_ropar.png"
                  alt="IIT Ropar"
                  width={64}
                  height={64}
                  className="object-contain"
                />
                <div className="space-y-1 text-left">
                  <p className="text-base font-semibold">
                    भारतीय प्रौद्योगिकी संस्थान रोपड़
                  </p>
                  <p className="text-base font-semibold uppercase">
                    INDIAN INSTITUTE OF TECHNOLOGY ROPAR
                  </p>
                  <p className="text-[11px] text-slate-700">
                    नंगल रोड,रूपनगर,पंजाब-140001/ Nangal Road, Rupnagar,
                    Punjab-140001
                  </p>
                  <p className="text-[11px] text-slate-700">
                    दूरभाष/Tele: +91-1881-227078,फैक्स /Fax : +91-1881-223395
                  </p>
                </div>
              </div>
              <div className="border-b border-slate-500" />
              <p className="text-base font-semibold underline">
                STATION LEAVE PERMISSION (SLP)
              </p>
            </header>

            <div className="space-y-3 text-[13px] text-slate-900">
              <LineItem number="1." label="Name" inputId="name" />
              <LineItem number="2." label="Designation" inputId="designation" />
              <LineItem number="3." label="Department" inputId="department" />
              <LineItem
                number="4."
                label="Date(s) and Timing(s) for which Station Leave Permission is required"
                inputId="dates"
                suffix="No. of days"
                suffixId="days"
                secondLine="From"
                secondId="from"
                thirdLabel="to"
                thirdId="to"
              />
              <LineItem
                number="5."
                label="Nature of Leave sanctioned (if applicable)"
                inputId="nature"
              />
              <LineItem
                number="6."
                label="Purpose of the Station Leave Permission"
                inputId="purpose"
              />
              <LineItem
                number="7."
                label="Contact Number(s) and Address during station leave"
                inputId="contact"
              />
            </div>

            <div className="space-y-2 text-[13px] text-slate-900">
              <div className="flex flex-wrap items-center gap-2">
                <span>Place:</span>
                <UnderlineInput id="place" width="w-44" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span>Date:</span>
                <UnderlineInput id="date" width="w-44" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[12px] text-slate-800">
                  AR/DR (Estt.)
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-slate-800">
                    (Signature of the applicant)
                  </span>
                  <UnderlineInput id="applicantSign" width="w-64" />
                </div>
              </div>
            </div>

            <div className="space-y-3 text-center text-[13px] text-slate-900">
              <p className="font-semibold">Permitted / Not permitted</p>
              <div className="flex items-center justify-end gap-2 text-right">
                <span className="text-[12px] text-slate-800">
                  (Signature of the HoD / Reporting Officer)
                </span>
                <UnderlineInput id="hodSign" width="w-64" />
              </div>
            </div>
          </SurfaceCard>

          {missingFields.length > 0 && (
            <SurfaceCard className="max-w-3xl border border-amber-400 bg-amber-50 text-amber-900">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <div>
                  <p className="font-semibold text-sm">
                    Missing required fields
                  </p>
                  <ul className="list-disc space-y-1 pl-4 text-xs">
                    {missingFields.map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </SurfaceCard>
          )}

          {previewData && (
            <SurfaceCard className="max-w-3xl border border-emerald-300 bg-emerald-50 text-emerald-900">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4" />
                <div className="space-y-2">
                  <p className="font-semibold text-sm">
                    Review your entries before confirming
                  </p>
                  <div className="grid grid-cols-1 gap-1 text-[11px] md:grid-cols-2">
                    {previewEntries.map(([key, value]) => (
                      <div key={key} className="flex items-start gap-1">
                        <span className="font-semibold capitalize">{key}:</span>
                        <span className="break-words text-slate-800">
                          {value || "(empty)"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SurfaceCard>
          )}

          <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3">
            <div className="text-xs text-slate-600">
              {confirmed
                ? "Submission confirmed. You can still edit and resubmit if needed."
                : previewData
                  ? "Looks good? Confirm to submit."
                  : "Fill all fields, then submit to validate."}
            </div>
            <div className="flex items-center gap-2">
              {previewData && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setPreviewData(null);
                    setConfirmed(false);
                  }}
                  className="text-sm"
                >
                  Edit
                </Button>
              )}
              <Button
                type={previewData ? "button" : "submit"}
                onClick={previewData ? handleConfirm : undefined}
                className="px-4 text-sm"
              >
                {previewData ? "Confirm submit" : "Submit"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

const LineItem = ({
  number,
  label,
  inputId,
  suffix,
  suffixId,
  secondLine,
  secondId,
  thirdLabel,
  thirdId,
}: {
  number: string;
  label: string;
  inputId: string;
  suffix?: string;
  suffixId?: string;
  secondLine?: string;
  secondId?: string;
  thirdLabel?: string;
  thirdId?: string;
}) => (
  <div className="space-y-1">
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-6">{number}</span>
      <span className="flex-1">{label}</span>
      <span>:</span>
      <UnderlineInput id={inputId} className="flex-1" />
      {suffix ? (
        <>
          <span>{suffix}</span>
          <UnderlineInput id={suffixId ?? `${inputId}Suffix`} width="w-28" />
        </>
      ) : null}
    </div>
    {secondLine ? (
      <div className="flex flex-wrap items-center gap-2 pl-8">
        <span>{secondLine}</span>
        <UnderlineInput id={secondId ?? `${inputId}Second`} width="w-36" />
        {thirdLabel ? (
          <>
            <span>{thirdLabel}</span>
            <UnderlineInput id={thirdId ?? `${inputId}Third`} width="w-36" />
          </>
        ) : null}
      </div>
    ) : null}
  </div>
);
