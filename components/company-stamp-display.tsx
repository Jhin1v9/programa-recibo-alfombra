"use client";

import Image from "next/image";

import { VirtualCompanyStamp } from "@/components/virtual-company-stamp";
import { normalizeCompany } from "@/lib/receipt-core";
import type { CompanyProfile } from "@/lib/types";

type CompanyStampDisplayProps = {
  company: CompanyProfile;
  compact?: boolean;
};

export function CompanyStampDisplay({
  company,
  compact = false
}: Readonly<CompanyStampDisplayProps>) {
  const data = normalizeCompany(company);

  if (!data.companyStampDataUrl) {
    return <VirtualCompanyStamp company={data} compact={compact} />;
  }

  return (
    <div
      className={`flex items-center justify-center rounded-[22px] border border-[color:var(--line)] bg-white ${
        compact ? "min-h-[132px] min-w-[132px] p-3" : "min-h-[176px] min-w-[176px] p-4"
      }`}
    >
      <Image
        src={data.companyStampDataUrl}
        alt={data.companyStamp || "Sello de la empresa"}
        width={compact ? 132 : 176}
        height={compact ? 132 : 176}
        unoptimized
        className={`max-w-full object-contain ${compact ? "max-h-[108px]" : "max-h-[152px]"}`}
      />
    </div>
  );
}
