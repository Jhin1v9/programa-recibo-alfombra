"use client";

import { normalizeCompany } from "@/lib/receipt-core";
import type { CompanyProfile } from "@/lib/types";

type VirtualCompanyStampProps = {
  company: CompanyProfile;
  compact?: boolean;
};

export function VirtualCompanyStamp({
  company,
  compact = false
}: Readonly<VirtualCompanyStampProps>) {
  const data = normalizeCompany(company);
  const size = compact ? 132 : 176;
  const padding = compact ? 14 : 20;

  return (
    <div
      className="relative isolate overflow-hidden rounded-full text-center"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        padding: `${padding}px`,
        border: "2px solid var(--brand-deep)",
        color: "var(--brand-deep)",
        background:
          "radial-gradient(circle, rgba(255, 255, 255, 0.98) 0%, rgba(255, 248, 243, 0.96) 58%, rgba(255, 240, 231, 0.94) 100%)"
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          inset: "8px",
          border: "1px solid rgba(195, 106, 57, 0.5)"
        }}
      />
      <div
        className="absolute rounded-full border-dashed"
        style={{
          inset: "16px",
          border: "1px dashed rgba(195, 106, 57, 0.35)"
        }}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <p className="max-w-[11ch] text-[0.76rem] font-extrabold uppercase leading-4 tracking-[0.16em]">
          {data.companyName}
        </p>
        <div className="my-2 h-px w-16" style={{ background: "rgba(195, 106, 57, 0.35)" }} />
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">
          {data.companyStamp}
        </p>
        <p className="mt-2 max-w-[13ch] text-[0.58rem] font-semibold leading-4">
          {data.companyTaxId}
        </p>
      </div>
    </div>
  );
}
