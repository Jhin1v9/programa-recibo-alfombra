"use client";

import Image from "next/image";

import { BrandMark } from "@/components/brand-mark";
import { CompanyStampDisplay } from "@/components/company-stamp-display";
import { useReceiptApp } from "@/components/receipt-app-provider";
import {
  DEFAULT_COMPANY,
  formatClientName,
  formatDate,
  formatReceiptNumber,
  joinNonEmpty,
  normalizeCompany,
  normalizeReceiptDraft
} from "@/lib/receipt-core";
import type { CompanyProfile, ReceiptDraft } from "@/lib/types";

type ReceiptPreviewProps = {
  company: CompanyProfile;
  receipt: ReceiptDraft;
  mode?: "screen" | "export";
  variant?: "pickup" | "delivery";
};

type PreviewCopy = {
  title: string;
  subtitle: string;
  dateLabel: string;
  dateValue: string;
  intro: string;
  serviceRows: Array<[string, string]>;
  termsTitle: string;
  termsBody: string;
  footer: string;
  footerIssuedBy: string;
};

export function ReceiptPreview({
  company,
  receipt,
  mode = "screen",
  variant = "pickup"
}: Readonly<ReceiptPreviewProps>) {
  const { t } = useReceiptApp();
  const previewCompany = normalizeCompany(company || DEFAULT_COMPANY);
  const previewReceipt = normalizeReceiptDraft(receipt);
  const rawClientName = formatClientName(previewReceipt);
  const clientName = rawClientName || t("preview.clientNameFallback");
  const fallbackReceiptNumber = sanitizeReceiptNumber(previewReceipt.receiptNumber);
  const headerAddressLines = splitAddressLines(previewCompany.companyAddress);
  const companySignatureDataUrl =
    variant === "delivery"
      ? previewReceipt.deliveryCompanySignatureDataUrl || previewCompany.companySignatureDataUrl
      : previewReceipt.companySignatureDataUrl || previewCompany.companySignatureDataUrl;
  const clientSignatureDataUrl =
    variant === "delivery"
      ? previewReceipt.deliveryClientSignatureDataUrl
      : previewReceipt.clientSignatureDataUrl;
  const locationValue =
    joinNonEmpty([previewReceipt.clientCity, previewReceipt.clientPostalCode], " / ") ||
    t("preview.cityPostalFallback");
  const companySignerName = previewCompany.companyResponsible || previewCompany.companyName;
  const previewCopy = buildPreviewCopy({
    companyName: previewCompany.companyName,
    dateFallback: formatDate(previewReceipt.pickupDate) || "--/--/----",
    deliveryFallback:
      formatDate(previewReceipt.handoverDate || previewReceipt.deliveryDate) || "--/--/----",
    fallbackReceiptNumber,
    previewReceipt,
    t,
    variant
  });

  return (
    <section
      className={`receipt-sheet ${
        mode === "export" ? "receipt-sheet-export" : "receipt-sheet-screen"
      }`}
    >
      <div
        className={`receipt-document-root ${
          mode === "export" ? "receipt-document-root-export" : "receipt-document-root-screen"
        } flex min-h-full flex-col gap-3 p-4 sm:gap-4 sm:p-6`}
      >
        <section className="receipt-surface receipt-surface-strong overflow-hidden rounded-[24px]">
          <div className="grid gap-4 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_250px] sm:items-start">
            <div className="min-w-0">
              <div className="flex items-start gap-3">
                <BrandMark compact light imageDataUrl={previewCompany.companyLogoDataUrl} />
                <div className="min-w-0">
                  <p className="receipt-company-title text-[1.18rem] font-extrabold tracking-[0.03em]">
                    {previewCompany.companyName}
                  </p>
                  <h1 className="receipt-heading-primary mt-2 text-[1.42rem] font-extrabold leading-tight tracking-[0.01em]">
                    {previewCopy.title}
                  </h1>
                  <p className="receipt-brand-overline mt-2 text-[0.68rem] font-bold uppercase tracking-[0.22em]">
                    {t("preview.brandRibbon")}
                  </p>
                </div>
              </div>
            </div>

            <div className="receipt-meta-box rounded-[18px] p-4">
              <HeaderMetaItem label={t("preview.metaReceipt")} value={fallbackReceiptNumber} />
              <HeaderMetaItem label={previewCopy.dateLabel} value={previewCopy.dateValue} />
              <HeaderMetaItem label={t("company.phone")} value={previewCompany.companyPhone} />
              <HeaderMetaItem
                label={t("company.address")}
                value={headerAddressLines[0]}
                extraLine={headerAddressLines[1]}
                withBorder={false}
              />
            </div>
          </div>

          <div className="receipt-document-divider px-5 py-3">
            <p className="receipt-copy-muted text-[0.78rem] leading-5">
              {previewCopy.subtitle}
            </p>
          </div>
        </section>

        <section className="receipt-note-box rounded-[18px] px-4 py-3">
          <p className="receipt-copy-body text-[0.78rem] leading-5">{previewCopy.intro}</p>
        </section>

        <PreviewSection title={t("preview.clientBlock")}>
          <PreviewTable
            rows={[
              [t("preview.fullName"), clientName],
              [t("clients.phone"), previewReceipt.clientPhone || t("preview.phoneFallback")],
              [t("clients.email"), previewReceipt.clientEmail || t("preview.emailFallback")],
              [t("clients.address"), previewReceipt.clientAddress || t("preview.addressFallback")],
              [t("preview.cityPostal"), locationValue]
            ]}
          />
        </PreviewSection>

        <PreviewSection title={t("preview.rugBlock")}>
          <PreviewTable
            rows={[
              [t("receipts.rugType"), previewReceipt.rugType || t("preview.rugTypeFallback")],
              [t("receipts.rugSize"), previewReceipt.rugSize || t("preview.rugSizeFallback")],
              [t("receipts.rugColor"), previewReceipt.rugColor || t("preview.rugColorFallback")],
              [
                t("receipts.rugCondition"),
                previewReceipt.rugCondition || t("preview.rugConditionFallback")
              ],
              [t("receipts.rugNotes"), previewReceipt.rugNotes || t("preview.noExtraNotes")]
            ]}
          />
        </PreviewSection>

        <PreviewSection title={t("preview.serviceBlock")}>
          <PreviewTable rows={previewCopy.serviceRows} />
        </PreviewSection>

        {variant === "delivery" ? (
          <section className="receipt-note-box rounded-[18px] px-4 py-3">
            <p className="receipt-copy-strong text-[0.76rem] font-semibold">
              {previewCopy.termsTitle}
            </p>
            <p className="receipt-copy-body mt-2 text-[0.76rem] leading-5">
              {previewCopy.termsBody}
            </p>
          </section>
        ) : null}

        <div className="mt-auto grid gap-3">
          <PreviewSection title={t("preview.signatures")}>
            <div className="grid gap-3 sm:grid-cols-2">
              <SignatureBox
                title={t("preview.clientSignature")}
                signerName={rawClientName}
                footerLabel={t("preview.signatureClientFallback")}
                imageDataUrl={clientSignatureDataUrl}
              />
              <SignatureBox
                title={t("preview.companySignature")}
                signerName={companySignerName}
                footerLabel={t("preview.signatureCompanyFallback")}
                imageDataUrl={companySignatureDataUrl}
              />
            </div>

            <div className="receipt-stamp-box mt-3 rounded-[18px] px-4 py-3">
              <p className="receipt-copy-strong text-[0.8rem] font-semibold">{t("preview.stamp")}</p>
              <div className="mt-3 flex items-center gap-4">
                <CompanyStampDisplay company={previewCompany} compact />
                <div className="receipt-copy-soft text-[0.76rem] leading-5">
                  <p>{previewCompany.companyStamp || t("preview.stampFallback")}</p>
                  <p className="mt-2">{t("preview.stampFooter")}</p>
                </div>
              </div>
            </div>
          </PreviewSection>

          <footer className="receipt-note-box rounded-[18px] px-4 py-3">
            <p className="receipt-copy-muted text-[0.7rem] leading-5">{previewCopy.footer}</p>
            <p className="receipt-copy-muted mt-2 text-[0.7rem] leading-5">
              {previewCopy.footerIssuedBy}
            </p>
          </footer>
        </div>
      </div>
    </section>
  );
}

function buildPreviewCopy({
  companyName,
  dateFallback,
  deliveryFallback,
  fallbackReceiptNumber,
  previewReceipt,
  t,
  variant
}: Readonly<{
  companyName: string;
  dateFallback: string;
  deliveryFallback: string;
  fallbackReceiptNumber: string;
  previewReceipt: ReceiptDraft;
  t: (key: string, params?: Record<string, string | number>) => string;
  variant: "pickup" | "delivery";
}>): PreviewCopy {
  if (variant === "delivery") {
    return {
      title: t("deliveryPreview.documentTitle"),
      subtitle: t("deliveryPreview.documentSubtitle"),
      dateLabel: t("deliveryPreview.metaDate"),
      dateValue: deliveryFallback,
      intro: t("deliveryPreview.confirmation", {
        company: companyName
      }),
      serviceRows: [
        [t("receipts.receiptNumber"), fallbackReceiptNumber],
        [t("receipts.pickupDate"), dateFallback],
        [t("receipts.deliveryDate"), formatDate(previewReceipt.deliveryDate) || "--/--/----"],
        [t("delivery.deliveryDateActual"), deliveryFallback],
        [t("delivery.deliveryReceivedBy"), previewReceipt.deliveryReceivedBy || companyName],
        [
          t("delivery.deliveryCondition"),
          previewReceipt.deliveryCondition || t("deliveryPreview.conditionFallback")
        ],
        [t("delivery.deliveryNotes"), previewReceipt.deliveryNotes || t("preview.noExtraNotes")]
      ],
      termsTitle: t("deliveryPreview.termsTitle"),
      termsBody: t("deliveryPreview.termsBody"),
      footer: t("deliveryPreview.footer"),
      footerIssuedBy: t("deliveryPreview.footerIssuedBy", {
        company: companyName
      })
    };
  }

  return {
    title: t("preview.documentTitle"),
    subtitle: t("preview.documentSubtitle"),
    dateLabel: t("preview.metaDate"),
    dateValue: dateFallback,
    intro: t("preview.confirmation", {
      company: companyName
    }),
    serviceRows: [
      [t("receipts.pickupDate"), dateFallback],
      [t("receipts.deliveryDate"), formatDate(previewReceipt.deliveryDate) || "--/--/----"],
      [t("receipts.estimatedValue"), previewReceipt.estimatedValue || t("preview.valueFallback")],
      [t("receipts.serviceNotes"), previewReceipt.serviceNotes || t("preview.noExtraNotes")]
    ],
    termsTitle: "",
    termsBody: "",
    footer: t("preview.footer"),
    footerIssuedBy: t("preview.footerIssuedBy", {
      company: companyName
    })
  };
}

function splitAddressLines(address: string) {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length <= 2) {
    return [address, ""];
  }

  const firstLine = parts.slice(0, 2).join(", ");
  const secondLine = parts.slice(2).join(", ");
  return [firstLine, secondLine];
}

function sanitizeReceiptNumber(receiptNumber: string) {
  const cleaned = receiptNumber.trim();
  return cleaned && cleaned !== "RC-0000" ? cleaned : formatReceiptNumber(1);
}

function PreviewSection({
  title,
  children
}: Readonly<{
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <section>
      <h2 className="receipt-section-title mb-2 text-[0.78rem] font-bold uppercase tracking-[0.18em]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function PreviewTable({
  rows
}: Readonly<{
  rows: Array<[string, string]>;
}>) {
  return (
    <div className="receipt-table-shell overflow-hidden rounded-[18px]">
      {rows.map(([label, value], index) => (
        <div
          key={`${label}-${index}`}
          className="receipt-table-row receipt-table-divider grid last:border-b-0"
        >
          <div className="receipt-table-label px-4 py-2.5 text-[0.74rem] font-semibold">
            {label}
          </div>
          <div className="receipt-table-value min-h-[38px] px-4 py-2.5 text-[0.74rem] leading-5">
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}

function HeaderMetaItem({
  label,
  value,
  extraLine,
  withBorder = true
}: Readonly<{
  label: string;
  value: string;
  extraLine?: string;
  withBorder?: boolean;
}>) {
  return (
    <div
      className={`receipt-meta-line ${withBorder ? "mb-2 pb-2" : ""}`}
    >
      <p className="receipt-copy-strong text-[0.68rem] font-semibold uppercase tracking-[0.14em]">
        {label}
      </p>
      <p className="receipt-heading-secondary mt-1 text-[0.82rem] font-bold leading-5">
        {value}
      </p>
      {extraLine ? (
        <p className="receipt-copy-muted mt-1 text-[0.72rem] leading-5">{extraLine}</p>
      ) : null}
    </div>
  );
}

function SignatureBox({
  title,
  signerName,
  footerLabel,
  imageDataUrl
}: Readonly<{
  title: string;
  signerName?: string;
  footerLabel: string;
  imageDataUrl?: string;
}>) {
  return (
    <div className="receipt-signature-box flex min-h-[120px] flex-col rounded-[18px] px-4 py-3">
      <p className="receipt-copy-strong text-center text-[0.78rem] font-semibold">{title}</p>
      <div className="flex flex-1 items-center justify-center py-3">
        {imageDataUrl ? (
          <Image
            src={imageDataUrl}
            alt={title}
            width={220}
            height={62}
            unoptimized
            className="max-h-[62px] max-w-full object-contain"
          />
        ) : signerName ? (
          <p className="signature-script receipt-signature-fallback max-w-full truncate px-2 text-center">
            {signerName}
          </p>
        ) : null}
      </div>
      <div className="receipt-signature-caption pt-2 text-center text-[0.7rem] leading-5">
        {footerLabel}
      </div>
    </div>
  );
}
