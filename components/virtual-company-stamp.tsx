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

  return (
    <div
      className={`relative isolate overflow-hidden rounded-full border-2 border-[color:var(--brand-deep)] text-center ${
        compact ? "h-[132px] w-[132px] p-3.5" : "h-[176px] w-[176px] p-5"
      } bg-[radial-gradient(circle,rgba(255,255,255,0.98)_0%,rgba(255,248,243,0.96)_58%,rgba(255,240,231,0.94)_100%)] text-[color:var(--brand-deep)]`}
    >
      <div className="absolute inset-[8px] rounded-full border border-[color:var(--brand)]/50" />
      <div className="absolute inset-[16px] rounded-full border border-dashed border-[color:var(--brand)]/35" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <p className="max-w-[11ch] text-[0.76rem] font-extrabold uppercase leading-4 tracking-[0.16em]">
          {data.companyName}
        </p>
        <div className="my-2 h-px w-16 bg-[color:var(--brand)]/35" />
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
