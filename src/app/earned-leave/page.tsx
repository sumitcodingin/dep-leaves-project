"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { applyAutofillToForm, saveFormDraft } from "@/lib/form-autofill";
import { cn } from "@/lib/utils";

type DialogState = "confirm" | "success" | null;

const UnderlineInput = ({
  id,
  width = "w-48",
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
      "border-0 border-b border-dashed border-slate-400 bg-transparent px-1 text-[13px] text-slate-900 focus:border-slate-800 focus:outline-none",
      width,
      className,
    )}
  />
);

export default function EarnedLeavePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const formRef = useRef<HTMLFormElement>(null);
  const pendingDataRef = useRef<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
    saveFormDraft("earned-leave", data);
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
    pendingDataRef.current = data;
    setDialogState("confirm");
  };

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    void applyAutofillToForm(form, "earned-leave");
  }, []);

  const handleConfirmSubmit = () => {
    setConfirmed(true);
    setDialogState("success");
    console.log("Earned leave form submitted", pendingDataRef.current);
  };

  const handleCloseDialog = () => {
    setDialogState(null);
  };

  const handleDownloadPdf = async () => {
    const form = formRef.current;
    if (!form) return;
    setIsDownloading(true);
    try {
      await generatePdfFromForm(form, "Earned Leave");
    } catch (err) {
      console.error("PDF generation failed", err);
      window.alert("Unable to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
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
          <SurfaceCard className="mx-auto max-w-4xl space-y-5 border border-slate-300 bg-white p-4 md:p-6">
            <header className="space-y-1 text-center text-slate-900">
              <div className="flex items-center justify-center gap-4">
                <Image
                  src="/iit_ropar.png"
                  alt="IIT Ropar"
                  width={56}
                  height={56}
                  className="object-contain"
                />
                <div className="space-y-1">
                  <p className="text-base font-semibold">
                    भारतीय प्रौद्योगिकी संस्थान रोपड़
                  </p>
                  <p className="text-base font-semibold uppercase">
                    INDIAN INSTITUTE OF TECHNOLOGY ROPAR
                  </p>
                  <p className="text-[11px] text-slate-700">
                    नंगल रोड, रूपनगर, पंजाब-140001 / Nangal Road, Rupnagar,
                    Punjab-140001
                  </p>
                </div>
              </div>
              <p className="text-[12px] font-semibold">
                छुट्टी के लिए अथवा छुट्टी बढ़ाने हेतु आवेदन / Application for
                Leave or Extension of Leave
              </p>
              <p className="text-[11px]">
                (अर्जित छुट्टी/अर्ध वेतन छुट्टी/असाधारण छुट्टी/कम्यूटेड
                छुट्टी/विश्राम की छुट्टी/मातृत्व छुट्टी/पितृत्व छुट्टी/बाल
                देखभाल छुट्टी)
              </p>
              <p className="text-[11px]">
                (Earned Leave/Half Pay Leave/Extra Ordinary Leave/Commuted
                Leave/Vacation/Maternity Leave/Paternity Leave/Child Care Leave)
              </p>
            </header>

            <div className="overflow-x-auto">
              <table className="w-full border border-slate-400 text-[12px] text-slate-900">
                <colgroup>
                  <col className="w-[36%]" />
                  <col />
                </colgroup>
                <tbody>
                  <Row
                    label="1. आवेदक का नाम / Name of the applicant"
                    inputId="name"
                  />
                  <Row label="2. पद नाम / Post held" inputId="post" />
                  <Row
                    label="3. विभाग/केन्द्रीय कार्यालय/अनुभाग / Department/Office/Section"
                    inputId="department"
                  />
                  <Row
                    label="4. अवकाश का प्रकार / Nature of Leave applied for"
                    inputId="leaveType"
                  />
                  <RowPeriod />
                  <RowPrefixSuffix />
                  <Row label="7. उद्देश्य / Purpose" inputId="purpose" />
                  <Row
                    label="8. कार्य, प्रशासनिक या अन्य उत्तरदायित्व (यदि कोई हो) के लिए वैकल्पिक व्यवस्था / Alternative arrangements"
                    inputId="arrangements"
                  />
                  <Row
                    label="9. मैं एल.टी.सी. लेने हेतु प्रस्तावित करता हूँ / I propose/do not propose to avail myself of Leave Travel Concession during the leave."
                    inputId="ltc"
                  />
                  <RowAddress />
                  <RowStation />
                </tbody>
              </table>
            </div>

            <p className="text-right text-[12px] text-slate-900">
              आवेदक के हस्ताक्षर दिनांक सहित / Signature of the applicant with
              date: <UnderlineInput id="applicantSignature" width="w-60" />
            </p>

            <div className="space-y-2 border-t border-slate-400 pt-2 text-[12px] text-slate-900">
              <p className="font-semibold text-center">
                नियंत्रक अधिकारी की टिप्पणियाँ एवं सिफारिशें / Remarks and
                Recommendations of the controlling officer
              </p>
              <p>
                सिफारिश की गई / Recommended या नहीं की गई / not recommended:{" "}
                <UnderlineInput id="recommended" width="w-44" />
              </p>
              <p>
                विभागाध्यक्ष एवं विभाग प्रमुख के हस्ताक्षर तिथि सहित / Signature
                with date Head of Department/Section In-charge:
                <UnderlineInput
                  id="hodSignature"
                  width="w-60"
                  className="ml-2"
                />
              </p>
            </div>

            <div className="space-y-2 border-t border-slate-400 pt-2 text-[12px] text-slate-900">
              <p className="text-center font-semibold">
                प्रशासनिक अनुभाग द्वारा प्रयोग हेतु / For use by the
                Administration Section
              </p>
              <p>
                प्रमाणित किया जाता है कि (प्रकृति) / Certified that (nature of
                leave) for period, from
                <UnderlineInput id="adminFrom" width="w-32" /> to{" "}
                <UnderlineInput id="adminTo" width="w-32" /> is available as per
                following details:
              </p>
              <p>
                अवकाश का प्रकार / Nature of leave applied for{" "}
                <UnderlineInput id="adminLeaveType" width="w-44" /> आज की तिथि
                तक शेष / Balance as on date
                <UnderlineInput id="balance" width="w-28" /> कुल दिनों के लिए
                अवकाश / Leave applied for (No. of days)
                <UnderlineInput id="adminDays" width="w-24" />
              </p>
              <p>
                संबंधित सहायक / Dealing Assistant{" "}
                <UnderlineInput id="assistant" width="w-44" className="ml-2" />{" "}
                अधि./सहा. कुलसचिव/अनुभागाध्यक्ष/ सुपdt./AR/DR
                <UnderlineInput id="arDr" width="w-44" className="ml-2" />{" "}
                कुलसचिव / Registrar
                <UnderlineInput id="registrar" width="w-44" className="ml-2" />
              </p>
              <p>
                छुट्टी स्वीकृत करने के लिए सक्षम प्राधिकारी की टिप्पणी: स्वीकृत
                / अस्वीकृत / Comments of the competent authority to grant leave:
                Sanctioned / Not Sanctioned
              </p>
              <p>
                कुलसचिव/ डीन (Faculty Affairs & Administration) / Director के
                हस्ताक्षर / Signature of Registrar / Dean (Faculty Affairs &
                Administration) / Director:
                <UnderlineInput
                  id="authoritySign"
                  width="w-60"
                  className="ml-2"
                />
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

        <ConfirmationModal
          state={dialogState}
          title="Earned Leave"
          onCancel={handleCloseDialog}
          onConfirm={handleConfirmSubmit}
          onDownload={handleDownloadPdf}
          isDownloading={isDownloading}
        />
      </div>
    </DashboardShell>
  );
}

const generatePdfFromForm = async (element: HTMLElement, title: string) => {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    onclone: (doc) => {
      const containsUnsupported = (val?: string | null) =>
        Boolean(val && /(oklab|oklch|\slab\s*\()/i.test(val));
      const safeBorder = "rgba(15, 23, 42, 0.2)";
      const safeInk = "#0f172a";

      doc.querySelectorAll("style").forEach((styleTag) => {
        if (containsUnsupported(styleTag.textContent)) {
          styleTag.remove();
        }
      });

      const resetStyle = doc.createElement("style");
      resetStyle.textContent = `
        * { color: ${safeInk} !important; background: #ffffff !important; background-image: none !important; box-shadow: none !important; text-shadow: none !important; filter: none !important; }
        * { border-color: ${safeBorder} !important; outline-color: ${safeInk} !important; }
        svg *, path, line, rect, circle { fill: ${safeInk} !important; stroke: ${safeInk} !important; }
      `;
      doc.head.appendChild(resetStyle);

      doc.body.style.background = "#ffffff";
      doc.body.style.backgroundImage = "none";

      doc.querySelectorAll<HTMLElement>("*").forEach((el) => {
        const style = doc.defaultView?.getComputedStyle(el);
        if (!style) return;

        if (containsUnsupported(style.color)) el.style.color = safeInk;

        if (
          containsUnsupported(style.backgroundColor) ||
          containsUnsupported(style.backgroundImage)
        ) {
          el.style.backgroundColor = "#ffffff";
          el.style.backgroundImage = "none";
        }

        [
          "borderColor",
          "borderTopColor",
          "borderRightColor",
          "borderBottomColor",
          "borderLeftColor",
        ].forEach((prop) => {
          const val = (style as unknown as Record<string, string>)[prop];
          if (containsUnsupported(val)) {
            (el.style as unknown as Record<string, string>)[prop] = safeBorder;
          }
        });

        if (containsUnsupported(style.outlineColor)) {
          el.style.outlineColor = safeInk;
        }

        if (containsUnsupported(style.boxShadow)) {
          el.style.boxShadow = "none";
        }

        if (containsUnsupported(style.textShadow)) {
          el.style.textShadow = "none";
        }

        if (containsUnsupported(style.fill)) {
          el.style.fill = safeInk;
        }

        if (containsUnsupported(style.stroke)) {
          el.style.stroke = safeInk;
        }
      });
    },
  });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  while (heightLeft > 0) {
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    if (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
    }
  }

  const safeName = title.replace(/\s+/g, "-").toLowerCase();
  pdf.save(`${safeName}.pdf`);
};

const ConfirmationModal = ({
  state,
  title,
  onCancel,
  onConfirm,
  onDownload,
  isDownloading,
}: {
  state: DialogState;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  onDownload: () => void;
  isDownloading: boolean;
}) => {
  if (!state) return null;
  const isSuccess = state === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8">
      <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="text-sm font-semibold text-slate-900">
            {isSuccess ? "Submission successful" : "Confirm submission"}
          </p>
          <p className="text-xs text-slate-600">
            {isSuccess
              ? `${title} form has been submitted successfully. You may close this window.`
              : `You are about to submit the ${title} form. Please review and confirm before continuing.`}
          </p>
        </div>

        <div className="space-y-3 px-5 py-4 text-sm text-slate-800">
          {isSuccess ? (
            <ul className="list-disc space-y-1 pl-4 text-[13px] text-slate-700">
              <li>Submission received and recorded.</li>
              <li>You may keep a copy for your records.</li>
            </ul>
          ) : (
            <ul className="list-disc space-y-1 pl-4 text-[13px] text-slate-700">
              <li>I confirm the information provided is accurate.</li>
              <li>I acknowledge the submission will be routed for review.</li>
              <li>I understand I may be contacted for clarifications.</li>
            </ul>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">
          {isSuccess ? (
            <>
              <Button
                type="button"
                onClick={onDownload}
                className="px-4 text-sm"
                disabled={isDownloading}
              >
                {isDownloading ? "Preparing..." : "Download PDF"}
              </Button>
              <Button type="button" onClick={onCancel} className="px-4 text-sm">
                Close
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={onCancel}
                className="px-3 text-sm"
                type="button"
              >
                Go back
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                className="px-4 text-sm"
              >
                Yes, submit
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, inputId }: { label: string; inputId: string }) => (
  <tr className="border-t border-slate-400">
    <td className="bg-slate-50 px-3 py-2 align-top font-semibold">{label}</td>
    <td className="px-3 py-2">
      <UnderlineInput id={inputId} className="w-full" />
    </td>
  </tr>
);

const RowPeriod = () => (
  <tr className="border-t border-slate-400">
    <td className="bg-slate-50 px-3 py-2 align-top font-semibold">
      5. छुट्टी की अवधि / Period of Leave
    </td>
    <td className="px-3 py-2 text-[12px]">
      <div className="flex flex-wrap items-center gap-2">
        <span>से / From:</span>
        <UnderlineInput id="fromDate" width="w-32" />
        <span>तक / To:</span>
        <UnderlineInput id="toDate" width="w-32" />
        <span>दिनों की संख्या / No. of days:</span>
        <UnderlineInput id="days" width="w-20" />
      </div>
    </td>
  </tr>
);

const RowPrefixSuffix = () => (
  <tr className="border-t border-slate-400">
    <td className="bg-slate-50 px-3 py-2 align-top font-semibold">
      6. रविवार, छुट्टी या अवकाश, छुट्टी से पहले या बाद में प्रस्तावित है
      <div className="text-[11px] font-normal">
        Sunday and holiday, if any, proposed to be prefixed/suffixed to leave
      </div>
    </td>
    <td className="px-3 py-2 text-[12px] space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span>के पूर्व Prefix</span>
        <UnderlineInput id="prefixFrom" width="w-28" />
        <span>से / From:</span>
        <UnderlineInput id="prefixFromDate" width="w-28" />
        <span>तक / To:</span>
        <UnderlineInput id="prefixToDate" width="w-28" />
        <span>दिनों की संख्या / No. of days:</span>
        <UnderlineInput id="prefixDays" width="w-20" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span>के पश्चात Suffix</span>
        <UnderlineInput id="suffixFrom" width="w-28" />
        <span>से / From:</span>
        <UnderlineInput id="suffixFromDate" width="w-28" />
        <span>तक / To:</span>
        <UnderlineInput id="suffixToDate" width="w-28" />
        <span>दिनों की संख्या / No. of days:</span>
        <UnderlineInput id="suffixDays" width="w-20" />
      </div>
    </td>
  </tr>
);

const RowAddress = () => (
  <tr className="border-t border-slate-400">
    <td className="bg-slate-50 px-3 py-2 align-top font-semibold">
      10. अवकाश के दौरान पता / Address during the leave
    </td>
    <td className="px-3 py-2 space-y-2 text-[12px]">
      <UnderlineInput id="address" className="w-full" />
      <div className="flex flex-wrap items-center gap-3">
        <span>संपर्क नं. / Contact No.</span>
        <UnderlineInput id="contactNo" width="w-40" />
        <span>पिन / PIN:</span>
        <UnderlineInput id="pin" width="w-24" />
      </div>
    </td>
  </tr>
);

const RowStation = () => (
  <tr className="border-t border-slate-400">
    <td className="bg-slate-50 px-3 py-2 align-top font-semibold">
      11. क्या स्टेशन अवकाश की आवश्यकता है / Whether Station leave is required
    </td>
    <td className="px-3 py-2 space-y-2 text-[12px]">
      <div className="flex flex-wrap items-center gap-2">
        <span>हाँ / Yes / No :</span>
        <UnderlineInput id="stationYesNo" width="w-20" />
        <span>यदि हाँ / If yes :</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span>से / From :</span>
        <UnderlineInput id="stationFrom" width="w-28" />
        <span>तक / To :</span>
        <UnderlineInput id="stationTo" width="w-28" />
      </div>
    </td>
  </tr>
);
