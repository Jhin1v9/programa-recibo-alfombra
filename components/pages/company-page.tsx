"use client";

import { useReceiptApp } from "@/components/receipt-app-provider";
import {
  ActionButton,
  EditableField,
  PageIntro,
  SectionCard
} from "@/components/workspace-ui";
import type { CompanyProfile } from "@/lib/types";

const COMPANY_INPUTS = [
  { name: "companyName", label: "Nome da empresa", placeholder: "Ex.: Alfombra Premium" },
  { name: "companyTaxId", label: "NIF / Identificacao", placeholder: "Ex.: 123456789" },
  { name: "companyPhone", label: "Telefone", placeholder: "+34 600 000 000" },
  { name: "companyEmail", label: "Email", placeholder: "contato@empresa.com", type: "email" },
  {
    name: "companyAddress",
    label: "Morada / Endereco",
    placeholder: "Rua, numero, cidade",
    full: true
  },
  {
    name: "companyResponsible",
    label: "Responsavel",
    placeholder: "Nome do responsavel"
  },
  { name: "companyStamp", label: "Carimbo / selo", placeholder: "Ex.: Carimbo oficial" }
] as const;

export function CompanyPage() {
  const { companyForm, saveCompanyProfile, updateCompanyField, previewCompany } = useReceiptApp();

  return (
    <>
      <PageIntro
        eyebrow="Empresa"
        title="Identidade da empresa em pagina propria"
        description="Aqui ficam todos os dados institucionais usados nos recibos: contacto, morada, responsavel e carimbo."
        actions={<ActionButton label="Guardar empresa" variant="primary" onClick={saveCompanyProfile} />}
      />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <SectionCard eyebrow="Formulario" title="Dados oficiais">
          <div className="grid gap-4 md:grid-cols-2">
            {COMPANY_INPUTS.map((field) => (
              <EditableField
                key={field.name}
                config={field}
                value={companyForm[field.name as keyof CompanyProfile]}
                onChange={(value) => updateCompanyField(field.name as keyof CompanyProfile, value)}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard eyebrow="Resumo" title="Vista rapida" chip="Atual">
          <div className="space-y-4 text-sm leading-7 text-[color:var(--ink-soft)]">
            <SummaryItem label="Empresa" value={previewCompany.companyName} />
            <SummaryItem label="NIF" value={previewCompany.companyTaxId} />
            <SummaryItem label="Telefone" value={previewCompany.companyPhone} />
            <SummaryItem label="Email" value={previewCompany.companyEmail} />
            <SummaryItem label="Morada" value={previewCompany.companyAddress} />
            <SummaryItem label="Responsavel" value={previewCompany.companyResponsible} />
            <SummaryItem label="Carimbo" value={previewCompany.companyStamp} />
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
