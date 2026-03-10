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
  const logoUploadRef = useRef<HTMLInputElement | null>(null);
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

  function openLogoUpload() {
    logoUploadRef.current?.click();
  }

  function persistCompanyAssetValue(fieldName: "companyLogoDataUrl" | "companySignatureDataUrl", dataUrl: string) {
    updateCompanyField(fieldName, dataUrl);
    window.localStorage.setItem(
      STORAGE_KEYS.company,
      JSON.stringify(
        normalizeCompany({
          ...companyForm,
          [fieldName]: dataUrl
        })
      )
    );
  }

  function handleImageFileChange(
    event: ChangeEvent<HTMLInputElement>,
    fieldName: "companyLogoDataUrl" | "companySignatureDataUrl",
    invalidMessage: string
  ) {
    const [file] = Array.from(event.target.files || []);

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      window.alert(invalidMessage);
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        persistCompanyAssetValue(fieldName, reader.result);
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
        actions={
          <div className="flex flex-wrap gap-3">
            <ActionButton label={t("company.uploadLogo")} variant="secondary" onClick={openLogoUpload} />
            <ActionButton label={t("company.save")} variant="primary" onClick={saveCompanyProfile} />
          </div>
        }
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
              <SummaryItem
                label={t("company.logo")}
                value={previewCompany.companyLogoDataUrl ? t("company.currentLogo") : t("company.noLogo")}
              />
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

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <SectionCard eyebrow={t("company.identityTools")} title={t("company.virtualStampTitle")}>
            <div className="flex flex-col items-center gap-5 rounded-[26px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,252,0.94))] px-5 py-6">
              <VirtualCompanyStamp company={previewCompany} />
              <div className="max-w-[48ch] text-center text-sm leading-7 text-[color:var(--ink-soft)]">
                <p>{t("company.virtualStampText")}</p>
                <p className="mt-2">{t("company.mobileHint")}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard eyebrow={t("company.identityTools")} title={t("company.assetsTitle")}>
            <input
              ref={logoUploadRef}
              className="sr-only"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(event) =>
                handleImageFileChange(event, "companyLogoDataUrl", t("company.logoUploadInvalid"))
              }
            />
            <input
              ref={signatureUploadRef}
              className="sr-only"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) =>
                handleImageFileChange(event, "companySignatureDataUrl", t("company.signatureUploadInvalid"))
              }
            />

            <div className="grid gap-5 xl:grid-cols-2">
              <AssetPanel
                eyebrow={t("company.logo")}
                title={previewCompany.companyLogoDataUrl ? t("company.currentLogo") : t("company.noLogo")}
                description={t("company.logoText")}
                preview={previewCompany.companyLogoDataUrl ? (
                  <Image
                    src={previewCompany.companyLogoDataUrl}
                    alt={t("company.currentLogo")}
                    width={260}
                    height={140}
                    unoptimized
                    className="max-h-[140px] max-w-full object-contain"
                  />
                ) : (
                  <BrandPreviewPlaceholder message={t("company.noLogo")} />
                )}
                actions={
                  <>
                    <ActionButton
                      label={previewCompany.companyLogoDataUrl ? t("company.updateLogo") : t("company.uploadLogo")}
                      variant="secondary"
                      onClick={openLogoUpload}
                    />
                    <ActionButton
                      label={t("company.clearLogo")}
                      variant="ghost"
                      onClick={() => persistCompanyAssetValue("companyLogoDataUrl", "")}
                      disabled={!previewCompany.companyLogoDataUrl}
                    />
                  </>
                }
                hint={t("company.logoHint")}
              />

              <AssetPanel
                eyebrow={t("company.signatureTitle")}
                title={
                  previewCompany.companySignatureDataUrl ? t("company.savedSignature") : t("company.noSignature")
                }
                description={t("company.signatureText")}
                preview={
                  previewCompany.companySignatureDataUrl ? (
                    <Image
                      src={previewCompany.companySignatureDataUrl}
                      alt={t("company.savedSignature")}
                      width={240}
                      height={130}
                      unoptimized
                      className="max-h-[130px] max-w-full object-contain"
                    />
                  ) : (
                    <BrandPreviewPlaceholder message={t("company.noSignature")} />
                  )
                }
                actions={
                  <>
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
                      label={t("company.clearSignature")}
                      variant="ghost"
                      onClick={() => persistCompanyAssetValue("companySignatureDataUrl", "")}
                      disabled={!previewCompany.companySignatureDataUrl}
                    />
                  </>
                }
                hint={t("company.uploadSignatureHint")}
              />
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
        onSave={(dataUrl) => persistCompanyAssetValue("companySignatureDataUrl", dataUrl)}
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
          <div className="grid grid-cols-3 gap-2">
            <ActionButton label={t("company.uploadLogo")} variant="secondary" onClick={openLogoUpload} />
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

function AssetPanel({
  eyebrow,
  title,
  description,
  preview,
  actions,
  hint
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  preview: React.ReactNode;
  actions: React.ReactNode;
  hint: string;
}>) {
  return (
    <div className="rounded-[26px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,252,0.92))] p-5">
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[color:var(--brand)]">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-lg text-[color:var(--ink)]">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">{description}</p>
      <div className="mt-4 flex min-h-[180px] items-center justify-center rounded-[20px] border-2 border-dashed border-[color:var(--line-strong)] bg-white p-4">
        {preview}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">{actions}</div>
      <p className="mt-4 text-sm leading-6 text-[color:var(--ink-soft)]">{hint}</p>
    </div>
  );
}

function BrandPreviewPlaceholder({ message }: Readonly<{ message: string }>) {
  return (
    <p className="max-w-[18ch] text-center text-sm leading-6 text-[color:var(--ink-soft)]">
      {message}
    </p>
  );
}
