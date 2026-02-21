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
      "Are you sure you want to apply for Joining Report?",
    );
    if (!confirmedSubmit) return;
    setConfirmed(true);
    console.log("Joining report submitted", data);
  };

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
      </div>
    </DashboardShell>
  );
}
