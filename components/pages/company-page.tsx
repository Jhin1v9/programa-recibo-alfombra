"use client";

import { useRef, useState, type ChangeEvent } from "react";

import Image from "next/image";

import { SignatureCaptureDialog } from "@/components/signature-capture-dialog";
import { VirtualCompanyStamp } from "@/components/virtual-company-stamp";
import { useReceiptApp } from "@/components/receipt-app-provider";
import {
  ActionButton,
  EditableField,
  PageIntro,
  SectionCard
} from "@/components/workspace-ui";
import { STORAGE_KEYS, normalizeCompany } from "@/lib/receipt-core";
import type { CompanyProfile } from "@/lib/types";

export function CompanyPage() {
  const { companyForm, saveCompanyProfile, updateCompanyField, previewCompany, t } =
    useReceiptApp();
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const signatureUploadRef = useRef<HTMLInputElement | null>(null);
  const companyInputs = [
    {
      name: "companyName",
      label: t("company.name"),
      placeholder: t("company.namePlaceholder")
    },
    {
      name: "companyTaxId",
      label: t("company.taxId"),
      placeholder: t("company.taxIdPlaceholder")
    },
    {
      name: "companyPhone",
      label: t("company.phone"),
      placeholder: "+34 600 000 000"
    },
    {
      name: "companyEmail",
      label: t("company.email"),
      placeholder: "contacto@empresa.com",
      type: "email" as const
    },
    {
      name: "companyAddress",
      label: t("company.address"),
      placeholder: t("company.addressPlaceholder"),
      full: true
    },
    {
      name: "companyResponsible",
      label: t("company.responsible"),
      placeholder: t("company.responsiblePlaceholder")
    },
    {
      name: "companyStamp",
      label: t("company.stamp"),
      placeholder: t("company.stampPlaceholder")
    }
  ] as const;

  function openSignatureUpload() {
    signatureUploadRef.current?.click();
  }

  function persistSignatureValue(dataUrl: string) {
    updateCompanyField("companySignatureDataUrl", dataUrl);
    window.localStorage.setItem(
      STORAGE_KEYS.company,
      JSON.stringify(
        normalizeCompany({
          ...companyForm,
          companySignatureDataUrl: dataUrl
        })
      )
    );
  }

  function handleSignatureFileChange(event: ChangeEvent<HTMLInputElement>) {
    const [file] = Array.from(event.target.files || []);

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      window.alert(t("company.signatureUploadInvalid"));
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        persistSignatureValue(reader.result);
      }
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  return (
    <>
      <PageIntro
        eyebrow={t("company.eyebrow")}
        title={t("company.title")}
        description={t("company.description")}
        actions={<ActionButton label={t("company.save")} variant="primary" onClick={saveCompanyProfile} />}
      />

      <div className="grid gap-6 pb-28 md:pb-0">
        <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <SectionCard
            eyebrow={t("company.form")}
            title={t("company.officialData")}
            actions={<ActionButton label={t("company.save")} variant="primary" onClick={saveCompanyProfile} />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {companyInputs.map((field) => (
                <EditableField
                  key={field.name}
                  config={field}
                  value={companyForm[field.name as keyof CompanyProfile]}
                  onChange={(value) => updateCompanyField(field.name as keyof CompanyProfile, value)}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard eyebrow={t("company.summary")} title={t("company.quickView")} chip={t("company.current")}>
            <div className="space-y-4 text-sm leading-7 text-[color:var(--ink-soft)]">
              <SummaryItem label={t("company.name")} value={previewCompany.companyName} />
              <SummaryItem label={t("company.taxId")} value={previewCompany.companyTaxId} />
              <SummaryItem label={t("company.phone")} value={previewCompany.companyPhone} />
              <SummaryItem label={t("company.email")} value={previewCompany.companyEmail} />
              <SummaryItem label={t("company.address")} value={previewCompany.companyAddress} />
              <SummaryItem label={t("company.responsible")} value={previewCompany.companyResponsible} />
              <SummaryItem label={t("company.stamp")} value={previewCompany.companyStamp} />
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <SectionCard eyebrow={t("company.identityTools")} title={t("company.virtualStampTitle")}>
            <div className="flex flex-col items-center gap-5 rounded-[26px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,252,0.94))] px-5 py-6">
              <VirtualCompanyStamp company={previewCompany} />
              <div className="max-w-[48ch] text-center text-sm leading-7 text-[color:var(--ink-soft)]">
                <p>{t("company.virtualStampText")}</p>
                <p className="mt-2">{t("company.mobileHint")}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow={t("company.identityTools")}
            title={t("company.signatureTitle")}
            actions={
              <div className="flex flex-wrap gap-3">
                <ActionButton
                  label={t("company.uploadSignature")}
                  variant="secondary"
                  onClick={openSignatureUpload}
                />
                <ActionButton label={t("company.save")} variant="primary" onClick={saveCompanyProfile} />
              </div>
            }
          >
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div className="rounded-[26px] border border-[color:var(--line)] bg-white/82 p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[color:var(--brand)]">
                  {t("company.uploadSignature")}
                </p>
                <p className="text-sm leading-7 text-[color:var(--ink-soft)]">{t("company.signatureText")}</p>
                <input
                  ref={signatureUploadRef}
                  className="sr-only"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleSignatureFileChange}
                />
                <div className="mt-5 flex flex-wrap gap-3">
                  <ActionButton
                    label={t("company.uploadSignature")}
                    variant="secondary"
                    onClick={openSignatureUpload}
                  />
                  <ActionButton
                    label={
                      previewCompany.companySignatureDataUrl
                        ? t("company.updateSignature")
                        : t("company.captureSignature")
                    }
                    variant="primary"
                    onClick={() => setSignatureDialogOpen(true)}
                  />
                  <ActionButton
                    label={t("company.uploadSignature")}
                    variant="secondary"
                    onClick={openSignatureUpload}
                  />
                  <ActionButton
                    label={t("company.clearSignature")}
                    variant="ghost"
                    onClick={() => persistSignatureValue("")}
                    disabled={!previewCompany.companySignatureDataUrl}
                  />
                  <ActionButton
                    label={t("company.save")}
                    variant="ghost"
                    onClick={saveCompanyProfile}
                  />
                </div>
                <p className="mt-4 text-sm leading-6 text-[color:var(--ink-soft)]">
                  {t("company.uploadSignatureHint")}
                </p>
              </div>

              <div className="rounded-[26px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,252,0.92))] p-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[color:var(--brand)]">
                  {previewCompany.companySignatureDataUrl ? t("company.savedSignature") : t("company.noSignature")}
                </p>
                <div className="mt-4 flex min-h-[180px] items-center justify-center rounded-[20px] border-2 border-dashed border-[color:var(--line-strong)] bg-white">
                  {previewCompany.companySignatureDataUrl ? (
                    <Image
                      src={previewCompany.companySignatureDataUrl}
                      alt={t("company.savedSignature")}
                      width={240}
                      height={130}
                      unoptimized
                      className="max-h-[130px] max-w-full object-contain"
                    />
                  ) : (
                    <p className="max-w-[18ch] text-center text-sm leading-6 text-[color:var(--ink-soft)]">
                      {t("company.noSignature")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <SignatureCaptureDialog
        open={signatureDialogOpen}
        title={t("signature.dialogTitleCompany")}
        description={t("signature.dialogDescription")}
        signerName={companyForm.companyResponsible}
        initialValue={companyForm.companySignatureDataUrl}
        onClose={() => setSignatureDialogOpen(false)}
        onSave={persistSignatureValue}
        labels={{
          clear: t("signature.clear"),
          cancel: t("signature.cancel"),
          save: t("signature.save"),
          empty: t("signature.empty"),
          sheetTitle: t("signature.sheetTitle"),
          sheetNote: t("signature.sheetNote")
        }}
      />

      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-30 md:hidden">
        <div className="pointer-events-auto rounded-[26px] border border-black/6 bg-white/96 p-3 shadow-[0_24px_48px_rgba(15,23,42,0.16)] backdrop-blur">
          <div className="grid grid-cols-2 gap-2">
            <ActionButton label={t("company.uploadSignature")} variant="ghost" onClick={openSignatureUpload} />
            <ActionButton label={t("company.save")} variant="primary" onClick={saveCompanyProfile} />
          </div>
        </div>
      </div>
    </>
  );
}

function SummaryItem({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-[22px] border border-[color:var(--line)] bg-white/72 px-4 py-3">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[color:var(--brand)]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-7 text-[color:var(--ink)]">{value}</p>
    </div>
  );
}
