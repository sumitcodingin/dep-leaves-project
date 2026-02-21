"use client";

import type { FormEvent } from "react";
import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { cn } from "@/lib/utils";

const UnderlineInput = ({
  id,
  width = "w-60",
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

export default function NonAirIndiaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const formRef = useRef<HTMLFormElement>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const markMissingInputs = (form: HTMLFormElement, missing: Set<string>) => {
    const inputs = Array.from(form.querySelectorAll<HTMLInputElement>("input"));
    inputs.forEach((input) => {
      const key = input.name || input.id;
      const hasError = key ? missing.has(key) : false;
      input.classList.toggle("border-red-500", hasError);
      input.classList.toggle("focus:border-red-600", hasError);
      input.classList.toggle("ring-1", hasError);
      input.classList.toggle("ring-red-300", hasError);
      input.classList.toggle("focus:ring-red-400", hasError);
      input.classList.toggle("bg-red-50", hasError);
      input.setAttribute("aria-invalid", hasError ? "true" : "false");
    });
  };

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
    const missingSet = new Set(missing);
    markMissingInputs(form, missingSet);
    if (missingSet.size > 0) {
      setMissingFields(Array.from(missingSet));
      return;
    }

    setMissingFields([]);
    const confirmedSubmit = window.confirm(
      "Are you sure you want to apply for Travel other than Air India?",
    );
    if (!confirmedSubmit) return;
    setConfirmed(true);
    console.log("Non-Air-India form submitted", data);
  };

  return (
    <DashboardShell>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="px-0 text-sm font-semibold text-slate-700"
          type="button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

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
                  नंगल मार्ग, रूपनगर,पंजाब-140001/Nangal Road, Rupnagar,
                  Punjab-140001
                </p>
                <p className="text-[11px] text-slate-700">
                  दूरभाष/Tele: +91-1881-227078,फैक्स /Fax : +91-1881-223395
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold uppercase">
              APPLICATION FOR PERMISSION TO TRAVEL BY AIRLINE OTHER THAN AIR
              INDIA
            </p>
          </header>

          <div className="space-y-3 text-[13px] text-slate-900">
            <LabeledLine number="1" label="Name" inputId="name" />
            <LabeledLine number="2" label="Designation" inputId="designation" />
            <LabeledLine number="3" label="Department" inputId="department" />
            <VisitDates />
            <LabeledLine
              number="5"
              label="Place to be Visited"
              inputId="placeToVisit"
            />
            <LabeledLine number="6" label="Purpose" inputId="purpose" />
            <LabeledLine
              number="7"
              label="Sectors for which permission is sought."
              inputId="sectors"
            />
            <LabeledLine
              number="8"
              label="Reason for travel by airline other than Air India"
              inputId="reason"
            />
            <PermissionMhrd />
            <LabeledLine
              number="10"
              label="Budget Head: Institute/Project"
              inputId="budgetHead"
            />
          </div>

          <p className="text-[12px] text-slate-900">
            May kindly consider and grant permission to travel by Airline other
            than AirIndia as a special case as justified at Sr. No. 8 above.
          </p>

          <div className="flex items-center justify-end text-[12px] text-slate-900">
            <span>(Signature of Applicant’s with date)</span>
            <UnderlineInput
              id="applicantSignature"
              width="w-64"
              className="ml-2"
            />
          </div>

          <div className="space-y-2 text-[12px] text-slate-900">
            <p>Recommendation of the HoD</p>
            <p>Dean (Faculty Affairs and Administration)</p>
            <p>Director</p>
          </div>
        </SurfaceCard>

        <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3">
          <div className="text-xs text-slate-600">
            {confirmed
              ? "Submission confirmed. You can still edit and resubmit if needed."
              : missingFields.length > 0
                ? "Please fill the highlighted fields."
                : "Fill all fields, then submit."}
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" className="px-4 text-sm">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </DashboardShell>
  );
}

const LabeledLine = ({
  number,
  label,
  inputId,
}: {
  number: string;
  label: string;
  inputId: string;
}) => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="w-4 text-right font-semibold">{number}</span>
    <span className="flex-1 font-semibold">{label}</span>
    <span>:</span>
    <UnderlineInput id={inputId} className="flex-1" />
  </div>
);

const VisitDates = () => (
  <div className="space-y-1">
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-4 text-right font-semibold">4</span>
      <span className="flex-1 font-semibold">Visit Dates</span>
      <span>:</span>
      <span className="font-semibold">Onward Journey:</span>
      <UnderlineInput id="onwardJourney" width="w-32" />
      <span className="font-semibold">Return Journey:</span>
      <UnderlineInput id="returnJourney" width="w-32" />
    </div>
    <div className="flex flex-wrap items-center gap-2 pl-8">
      <UnderlineInput id="visitDateLine1" width="w-48" />
      <UnderlineInput id="visitDateLine2" width="w-48" />
    </div>
  </div>
);

const PermissionMhrd = () => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="w-4 text-right font-semibold">9</span>
    <span className="flex-1 font-semibold">Permission sought from MHRD.</span>
    <span>:</span>
    <span>Yes/No(If yes mail attached):</span>
    <UnderlineInput id="permissionMhrd" width="w-28" />
  </div>
);
