"use client";

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
};

export function ReceiptPreview({ company, receipt }: ReceiptPreviewProps) {
  const { t } = useReceiptApp();
  const previewCompany = normalizeCompany(company || DEFAULT_COMPANY);
  const previewReceipt = normalizeReceiptDraft(receipt);
  const clientName = formatClientName(previewReceipt) || t("preview.clientNameFallback");

  return (
    <section className="receipt-sheet mx-auto w-full max-w-[860px] rounded-[28px] border border-[color:var(--line)] p-5 md:p-[22mm]">
      <header className="receipt-header receipt-header-grid relative z-10 grid gap-4 rounded-[28px] p-5 text-white">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.28em] text-amber-200/80">
              {t("preview.headerEyebrow")}
            </p>
            <h2 className="text-3xl leading-none md:text-[2.2rem]">{previewCompany.companyName}</h2>
            <p className="max-w-[48ch] text-sm leading-6 text-white/76">
              {t("preview.headerText")}
            </p>
          </div>

          <p className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-4 text-sm leading-6 text-white/82">
            {t("preview.confirmation", {
              company: previewCompany.companyName
            })}
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
          <div className="grid gap-3 text-sm">
            <MetaRow label={t("preview.metaReceipt")} value={previewReceipt.receiptNumber || "RC-0000"} />
            <MetaRow label={t("preview.metaDate")} value={formatDate(previewReceipt.pickupDate) || "--/--/----"} />
            <div className="space-y-2 border-t border-white/12 pt-3 text-white/82">
              <p>{previewCompany.companyPhone}</p>
              <p>{previewCompany.companyAddress}</p>
              <p>{previewCompany.companyEmail}</p>
              <p>{previewCompany.companyTaxId}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 mt-5 space-y-5">
        <PreviewBlock title={t("preview.clientBlock")} chip={t("preview.clientChip")}>
          <InfoGrid
            rows={[
              [t("preview.fullName"), clientName],
              [t("clients.phone"), previewReceipt.clientPhone || t("preview.phoneFallback")],
              [t("clients.email"), previewReceipt.clientEmail || t("preview.emailFallback")],
              [t("clients.address"), previewReceipt.clientAddress || t("preview.addressFallback")],
              [
                t("preview.cityPostal"),
                joinNonEmpty([previewReceipt.clientCity, previewReceipt.clientPostalCode], " / ") ||
                  t("preview.cityPostalFallback")
              ]
            ]}
          />
        </PreviewBlock>

        <PreviewBlock title={t("preview.rugBlock")} chip={t("preview.rugChip")}>
          <InfoGrid
            rows={[
              [t("receipts.rugType"), previewReceipt.rugType || t("preview.rugTypeFallback")],
              [t("receipts.rugSize"), previewReceipt.rugSize || t("preview.rugSizeFallback")],
              [t("receipts.rugColor"), previewReceipt.rugColor || t("preview.rugColorFallback")],
              [t("receipts.rugCondition"), previewReceipt.rugCondition || t("preview.rugConditionFallback")],
              [t("receipts.rugNotes"), previewReceipt.rugNotes || t("preview.noExtraNotes")]
            ]}
          />
        </PreviewBlock>

        <PreviewBlock title={t("preview.serviceBlock")} chip={t("preview.serviceChip")}>
          <InfoGrid
            rows={[
              [t("receipts.pickupDate"), formatDate(previewReceipt.pickupDate) || "--/--/----"],
              [t("receipts.deliveryDate"), formatDate(previewReceipt.deliveryDate) || "--/--/----"],
              [t("receipts.estimatedValue"), previewReceipt.estimatedValue || t("preview.valueFallback")],
              [
                t("receipts.serviceNotes"),
                previewReceipt.serviceNotes || t("preview.noExtraNotes")
              ]
            ]}
          />
        </PreviewBlock>

        <PreviewBlock title={t("preview.signatures")} chip={t("preview.signaturesChip")}>
          <div className="grid gap-4 md:grid-cols-2">
            <SignatureCard
              label={t("preview.clientSignature")}
              value={clientName || t("preview.signatureClientFallback")}
            />
            <SignatureCard
              label={t("preview.companySignature")}
              value={previewCompany.companyResponsible || t("preview.signatureCompanyFallback")}
            />
          </div>

          <div className="mt-4 rounded-[22px] border border-[color:var(--line)] bg-white/80 p-5">
            <p className="text-sm font-semibold text-[color:var(--ink-soft)]">{t("preview.stamp")}</p>
            <div className="mt-3 min-h-[96px] rounded-[18px] border-2 border-dashed border-[color:var(--line-strong)] px-4 py-3 text-sm leading-6 text-[color:var(--ink-soft)]">
              {previewCompany.companyStamp || t("preview.stampFallback")}
            </div>
          </div>
        </PreviewBlock>

        <footer className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-5 py-4 text-sm leading-6 text-[color:var(--ink-soft)]">
          <p>{t("preview.footer")}</p>
          <p className="mt-2">
            {t("preview.footerIssuedBy", {
              company: previewCompany.companyName
            })}
          </p>
        </footer>
      </div>
    </section>
  );
}

function PreviewBlock({
  title,
  chip,
  children
}: Readonly<{
  title: string;
  chip: string;
  children: React.ReactNode;
}>) {
  return (
    <section>
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h3 className="text-xl leading-none">{title}</h3>
        <span className="inline-flex w-fit rounded-full border border-[color:var(--accent-soft)] bg-[color:var(--accent-soft)] px-3 py-2 text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--accent)]">
          {chip}
        </span>
      </div>
      {children}
    </section>
  );
}

function InfoGrid({ rows }: Readonly<{ rows: Array<[string, string]> }>) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[color:var(--line)] bg-white/82">
      {rows.map(([label, value], index) => (
        <div
          key={`${label}-${index}`}
          className="receipt-info-row grid border-b border-[color:var(--line)] last:border-b-0"
        >
          <div className="receipt-info-label border-b border-[color:var(--line)] bg-black/[0.03] px-4 py-3 text-sm font-semibold text-[color:var(--ink-soft)]">
            {label}
          </div>
          <div className="min-h-[56px] px-4 py-3 text-sm leading-6 text-[color:var(--ink)]">
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}

function MetaRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/12 pb-3 text-sm last:border-b-0 last:pb-0">
      <span className="text-white/70">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SignatureCard({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex min-h-[170px] flex-col justify-between rounded-[22px] border border-[color:var(--line)] bg-white/80 p-5">
      <p className="text-sm font-semibold text-[color:var(--ink-soft)]">{label}</p>
      <div className="mt-8 border-b-2 border-black/18" />
      <p className="text-sm leading-6 text-[color:var(--ink-soft)]">{value}</p>
    </div>
  );
}
