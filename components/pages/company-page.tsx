"use client";

import { useState } from "react";

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
import type { CompanyProfile } from "@/lib/types";

export function CompanyPage() {
  const { companyForm, saveCompanyProfile, updateCompanyField, previewCompany, t } =
    useReceiptApp();
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
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

  return (
    <>
      <PageIntro
        eyebrow={t("company.eyebrow")}
        title={t("company.title")}
        description={t("company.description")}
        actions={<ActionButton label={t("company.save")} variant="primary" onClick={saveCompanyProfile} />}
      />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <SectionCard eyebrow={t("company.form")} title={t("company.officialData")}>
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

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <SectionCard eyebrow={t("company.identityTools")} title={t("company.virtualStampTitle")}>
          <div className="flex flex-col items-center gap-5 rounded-[26px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,252,0.94))] px-5 py-6">
            <VirtualCompanyStamp company={previewCompany} />
            <div className="max-w-[48ch] text-center text-sm leading-7 text-[color:var(--ink-soft)]">
              <p>{t("company.virtualStampText")}</p>
              <p className="mt-2">{t("company.mobileHint")}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard eyebrow={t("company.identityTools")} title={t("company.signatureTitle")}>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="rounded-[26px] border border-[color:var(--line)] bg-white/82 p-5">
              <p className="text-sm leading-7 text-[color:var(--ink-soft)]">{t("company.signatureText")}</p>
              <div className="mt-5 flex flex-wrap gap-3">
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
                  label={t("company.clearSignature")}
                  variant="ghost"
                  onClick={() => updateCompanyField("companySignatureDataUrl", "")}
                  disabled={!previewCompany.companySignatureDataUrl}
                />
              </div>
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

      <SignatureCaptureDialog
        open={signatureDialogOpen}
        title={t("signature.dialogTitleCompany")}
        description={t("signature.dialogDescription")}
        signerName={companyForm.companyResponsible}
        initialValue={companyForm.companySignatureDataUrl}
        onClose={() => setSignatureDialogOpen(false)}
        onSave={(dataUrl) => updateCompanyField("companySignatureDataUrl", dataUrl)}
        labels={{
          clear: t("signature.clear"),
          cancel: t("signature.cancel"),
          save: t("signature.save"),
          empty: t("signature.empty"),
          sheetTitle: t("signature.sheetTitle"),
          sheetNote: t("signature.sheetNote")
        }}
      />
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
