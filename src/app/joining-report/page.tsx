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
  width = "w-44",
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
      "border-0 border-b border-dashed border-slate-400 bg-transparent px-1 text-sm text-slate-900 focus:border-slate-800 focus:outline-none",
      width,
      className,
    )}
  />
);

export default function JoiningReportPage() {
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
    console.log("Joining report confirmed", previewData);
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
          <SurfaceCard className="space-y-5 border-slate-200/80 bg-white p-6 md:p-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex items-center gap-4">
                <Image
                  src="/iit_ropar.png"
                  alt="IIT Ropar"
                  width={64}
                  height={64}
                  className="object-contain"
                />
                <div className="space-y-1 text-slate-900">
                  <p className="text-lg font-semibold">
                    भारतीय प्रौद्योगिकी संस्थान रोपड़
                  </p>
                  <p className="text-lg font-semibold uppercase">
                    INDIAN INSTITUTE OF TECHNOLOGY ROPAR
                  </p>
                  <p className="text-xs text-slate-700">
                    नंगल रोड, रूपनगर, पंजाब-140001 / Nangal Road, Rupnagar,
                    Punjab-140001
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-sm text-slate-800">
              <p>सेवा में / To,</p>
              <p>निदेशक / कुलसचिव / Director / Registrar</p>
              <p>भा.प्रौ.सं.रोपड़ / IIT Ropar</p>
            </div>

            <p className="text-center text-sm font-semibold text-slate-900">
              विभागाध्यक्ष / रिपोर्टिंग अधिकारी द्वारा / Through HOD/Reporting
              Officer
            </p>

            <div className="text-center text-sm font-semibold text-slate-900">
              विषय / Sub : कार्यग्रहण प्रतिवेदन / JOINING REPORT
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-slate-900">
              <p>महोदय / Sir,</p>

              <p className="space-y-2">
                <span>मैं,</span> <UnderlineInput id="name" width="w-56" />
                <span>दिनांक</span>{" "}
                <UnderlineInput id="fromDate" width="w-28" />
                <span>से</span> <UnderlineInput id="toDate" width="w-28" />
                <span>तक</span> <UnderlineInput id="totalDays" width="w-16" />
                <span>
                  दिन की अर्जित छुट्टी / अर्ध वेतन छुट्टी / चिकित्सक छुट्टी /
                  असाधारण छुट्टी / सत्र की समाप्ति पर छुट्टी के पश्चात
                </span>
              </p>

              <p>
                आज दिनांक <UnderlineInput id="rejoinDate" width="w-28" /> को
                पूर्वाह्न / अपराह्न को अपना कार्यग्रहण प्रतिवेदन जमा कर रहा /
                रही हूँ, जो की कार्यालय आदेश सं.
                <UnderlineInput id="orderNo" width="w-48" /> दिनांक
                <UnderlineInput id="orderDate" width="w-28" /> के द्वारा स्वीकृत
                किया था।
              </p>

              <p>
                I, hereby report myself for duty this day on
                <UnderlineInput
                  id="englishRejoin"
                  width="w-40"
                  className="ml-2"
                />{" "}
                forenoon / afternoon after availing Earned Leave / Half Pay
                Leave / Medical Leave / Extra Ordinary Leave / Vacation Leave
                for
                <UnderlineInput
                  id="englishDays"
                  width="w-16"
                  className="ml-2"
                />{" "}
                days from
                <UnderlineInput
                  id="englishFrom"
                  width="w-32"
                  className="ml-2"
                />{" "}
                to
                <UnderlineInput
                  id="englishTo"
                  width="w-32"
                  className="ml-2"
                />{" "}
                sanctioned vide Office Order No.{" "}
                <UnderlineInput
                  id="englishOrder"
                  width="w-48"
                  className="ml-2"
                />{" "}
                dated
                <UnderlineInput
                  id="englishOrderDate"
                  width="w-28"
                  className="ml-2"
                />
                .
              </p>

              <div className="space-y-1 text-right">
                <p>भवदीय / Yours faithfully</p>
                <p>
                  हस्ताक्षर / Signature:{" "}
                  <UnderlineInput id="signature" width="w-56" />
                </p>
                <p>
                  नाम / Name : <UnderlineInput id="signName" width="w-48" />
                </p>
                <p>
                  पदनाम / Designation:{" "}
                  <UnderlineInput id="signDesignation" width="w-44" />
                </p>
              </div>

              <p className="text-right">
                दिनांक / Dated: <UnderlineInput id="signedDate" width="w-32" />
              </p>
            </div>
          </SurfaceCard>

          {missingFields.length > 0 && (
            <SurfaceCard className="border border-amber-400 bg-amber-50 text-amber-900">
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
            <SurfaceCard className="border border-emerald-300 bg-emerald-50 text-emerald-900">
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
