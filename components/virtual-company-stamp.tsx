"use client";

import Image from "next/image";

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
  const companyLines = buildStampLines(data.companyName || "Superclim Servicios");
  const stampTitle = (data.companyStamp || "Custodia temporal").toUpperCase();
  const stampFooter = data.companyTaxId || data.companyPhone || "Limpieza profesional";
  const outerRing = "#0d4d92";
  const innerRing = "rgba(31, 111, 184, 0.35)";
  const dashedRing = "rgba(75, 148, 216, 0.34)";
  const textMain = "#0b3768";
  const textSoft = "#24588f";
  const logoSrc = data.companyLogoDataUrl || "/superclim-logo.png";
  const logoWidth = compact ? 58 : 72;
  const logoHeight = compact ? 46 : 56;

  return (
    <div
      className="relative isolate overflow-hidden rounded-full text-center"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        padding: `${padding}px`,
        border: `2px solid ${outerRing}`,
        color: textMain,
        background:
          "radial-gradient(circle at 50% 36%, rgba(255, 255, 255, 1) 0%, rgba(244, 250, 255, 0.98) 54%, rgba(228, 241, 255, 0.96) 100%)"
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          inset: "8px",
          border: `1px solid ${innerRing}`
        }}
      />
      <div
        className="absolute rounded-full border-dashed"
        style={{
          inset: "16px",
          border: `1px dashed ${dashedRing}`
        }}
      />
      <div
        className="absolute left-1/2 top-[10px] -translate-x-1/2"
        style={{
          width: `${logoWidth}px`,
          height: `${logoHeight}px`
        }}
      >
        <Image
          src={logoSrc}
          alt={data.companyName}
          width={logoWidth}
          height={logoHeight}
          unoptimized
          className="h-full w-full object-contain"
        />
      </div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <div className={compact ? "pt-10" : "pt-12"}>
          {companyLines.map((line) => (
            <p
              key={line}
              className="max-w-[12ch] text-[0.7rem] font-extrabold uppercase leading-[1.1] tracking-[0.14em]"
              style={{ color: textMain }}
            >
              {line}
            </p>
          ))}
        </div>
        <div
          className="my-2 h-px w-16"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(29,122,217,0.45) 20%, rgba(13,77,146,0.78) 50%, rgba(29,122,217,0.45) 80%, transparent 100%)" }}
        />
        <p
          className="max-w-[13ch] text-[0.53rem] font-bold uppercase leading-[1.25] tracking-[0.2em]"
          style={{ color: textSoft }}
        >
          {stampTitle}
        </p>
        <p
          className="mt-2 max-w-[13ch] text-[0.56rem] font-semibold leading-[1.3]"
          style={{ color: textSoft }}
        >
          {stampFooter}
        </p>
      </div>
    </div>
  );
}

function buildStampLines(companyName: string) {
  const tokens = companyName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length <= 2) {
    return [companyName];
  }

  const midpoint = Math.ceil(tokens.length / 2);
  return [tokens.slice(0, midpoint).join(" "), tokens.slice(midpoint).join(" ")];
}
