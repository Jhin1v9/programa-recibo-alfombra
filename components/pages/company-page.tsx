"use client";

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
