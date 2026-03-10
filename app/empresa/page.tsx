import type { Metadata } from "next";

import { CompanyPage } from "@/components/pages/company-page";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Empresa y datos de marca",
  description:
    "Configura la identidad de la empresa, logo para PDF, firma, sello y datos oficiales usados en cada resguardo.",
  path: "/empresa"
});

export default function EmpresaRoute() {
  return <CompanyPage />;
}
