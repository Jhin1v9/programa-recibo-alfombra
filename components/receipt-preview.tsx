"use client";

import { BrandMark } from "@/components/brand-mark";
import { useReceiptApp } from "@/components/receipt-app-provider";
import {
  DEFAULT_COMPANY,
  formatClientName,
  formatDate,
  joinNonEmpty,
  normalizeCompany,
  normalizeReceiptDraft
} from "@/lib/receipt-core";
import type { CompanyProfile, ReceiptDraft } from "@/lib/types";

type ReceiptPreviewProps = {
  company: CompanyProfile;
  receipt: ReceiptDraft;
  mode?: "screen" | "export";
};

export function ReceiptPreview({
  company,
  receipt,
  mode = "screen"
}: ReceiptPreviewProps) {
  const { t } = useReceiptApp();
  const previewCompany = normalizeCompany(company || DEFAULT_COMPANY);
  const previewReceipt = normalizeReceiptDraft(receipt);
  const clientName = formatClientName(previewReceipt) || t("preview.clientNameFallback");
  const locationValue =
    joinNonEmpty([previewReceipt.clientCity, previewReceipt.clientPostalCode], " / ") ||
    t("preview.cityPostalFallback");

  return (
    <section
      className={`receipt-sheet ${
        mode === "export" ? "receipt-sheet-export" : "receipt-sheet-screen"
      }`}
    >
      <div className="flex h-full flex-col gap-3 p-4 text-slate-800 sm:gap-4 sm:p-6">
        <section className="overflow-hidden rounded-[22px] border-2 border-slate-800 bg-white">
          <div className="receipt-brand-band grid gap-4 bg-slate-900 px-5 py-4 text-white">
            <div>
              <div className="flex items-center gap-3">
                <BrandMark compact light />
                <div>
                  <p className="text-[1.42rem] font-extrabold tracking-[0.06em]">
                    {previewCompany.companyName}
                  </p>
                  <p className="mt-1 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-white/60">
                    {t("preview.brandRibbon")}
                  </p>
                </div>
              </div>
              <p className="mt-1 text-[0.74rem] leading-5 text-slate-200">
                {t("preview.headerText")}
              </p>
            </div>

            <div className="space-y-1 text-[0.76rem] leading-5 text-slate-100">
              <p>
                <span className="font-semibold">{t("company.phone")}:</span>{" "}
                {previewCompany.companyPhone}
              </p>
              <p>
                <span className="font-semibold">{t("company.address")}:</span>{" "}
                {previewCompany.companyAddress}
              </p>
              <p>{previewCompany.companyEmail}</p>
              <p>{previewCompany.companyTaxId}</p>
            </div>
          </div>

          <div className="receipt-document-head grid gap-4 border-t border-slate-800 px-5 py-4">
            <div>
              <h1 className="text-[1.35rem] font-extrabold tracking-tight text-slate-900">
                {t("preview.documentTitle")}
              </h1>
              <p className="mt-1 text-[0.76rem] leading-5 text-slate-600">
                {t("preview.documentSubtitle")}
              </p>
            </div>

            <div className="rounded-[16px] border border-slate-400 p-3 text-[0.76rem]">
              <MetaLine
                label={t("preview.metaReceipt")}
                value={previewReceipt.receiptNumber || "RC-0000"}
              />
              <MetaLine
                label={t("preview.metaDate")}
                value={formatDate(previewReceipt.pickupDate) || "--/--/----"}
                withBorder={false}
              />
            </div>
          </div>
        </section>

        <section className="rounded-[18px] border border-slate-300 bg-slate-50 px-4 py-3">
          <p className="text-[0.78rem] leading-5 text-slate-700">
            {t("preview.confirmation", {
              company: previewCompany.companyName
            })}
          </p>
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
          <PreviewTable
            rows={[
              [t("receipts.pickupDate"), formatDate(previewReceipt.pickupDate) || "--/--/----"],
              [t("receipts.deliveryDate"), formatDate(previewReceipt.deliveryDate) || "--/--/----"],
              [t("receipts.estimatedValue"), previewReceipt.estimatedValue || t("preview.valueFallback")],
              [t("receipts.serviceNotes"), previewReceipt.serviceNotes || t("preview.noExtraNotes")]
            ]}
          />
        </PreviewSection>

        <div className="mt-auto grid gap-3">
          <PreviewSection title={t("preview.signatures")}>
            <div className="grid gap-3 sm:grid-cols-2">
              <SignatureBox
                title={t("preview.clientSignature")}
                caption={clientName || t("preview.signatureClientFallback")}
              />
              <SignatureBox
                title={t("preview.companySignature")}
                caption={previewCompany.companyResponsible || t("preview.signatureCompanyFallback")}
              />
            </div>

            <div className="mt-3 rounded-[18px] border border-dashed border-slate-400 px-4 py-3">
              <p className="text-[0.8rem] font-semibold text-slate-700">{t("preview.stamp")}</p>
              <div className="mt-3 min-h-[54px] text-[0.76rem] leading-5 text-slate-500">
                {previewCompany.companyStamp || t("preview.stampFallback")}
              </div>
            </div>
          </PreviewSection>

          <footer className="rounded-[18px] border border-slate-300 bg-slate-50 px-4 py-3">
            <p className="text-[0.7rem] leading-5 text-slate-600">{t("preview.footer")}</p>
            <p className="mt-2 text-[0.7rem] leading-5 text-slate-600">
              {t("preview.footerIssuedBy", {
                company: previewCompany.companyName
              })}
            </p>
          </footer>
        </div>
      </div>
    </section>
  );
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
      <h2 className="mb-2 text-[0.78rem] font-bold uppercase tracking-[0.18em] text-slate-900">
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
    <div className="overflow-hidden rounded-[18px] border-2 border-slate-300 bg-white">
      {rows.map(([label, value], index) => (
        <div
          key={`${label}-${index}`}
          className="receipt-table-row grid border-b border-slate-300 last:border-b-0"
        >
          <div className="border-b border-r border-slate-300 bg-slate-100 px-4 py-2.5 text-[0.74rem] font-semibold text-slate-700 last:border-b-0">
            {label}
          </div>
          <div className="min-h-[38px] px-4 py-2.5 text-[0.74rem] leading-5 text-slate-700">
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}

function MetaLine({
  label,
  value,
  withBorder = true
}: Readonly<{
  label: string;
  value: string;
  withBorder?: boolean;
}>) {
  return (
    <div
      className={`flex items-center justify-between gap-3 pb-2 text-[0.76rem] ${
        withBorder ? "mb-2 border-b border-slate-300" : ""
      }`}
    >
      <span className="font-semibold text-slate-700">{label}</span>
      <span className="text-right font-bold text-slate-900">{value}</span>
    </div>
  );
}

function SignatureBox({
  title,
  caption
}: Readonly<{
  title: string;
  caption: string;
}>) {
  return (
    <div className="flex min-h-[120px] flex-col rounded-[18px] border-2 border-slate-300 px-4 py-3">
      <p className="text-center text-[0.78rem] font-semibold text-slate-700">{title}</p>
      <div className="flex-1" />
      <div className="border-t border-slate-400 pt-2 text-center text-[0.7rem] leading-5 text-slate-500">
        {caption}
      </div>
    </div>
  );
}
