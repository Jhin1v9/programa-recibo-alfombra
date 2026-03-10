import type { Metadata } from "next";

import { ReceiptsPage } from "@/components/pages/receipts-page";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Recibos de recogida en A4",
  description:
    "Prepara resguardos de recogida, custodia temporal y limpieza profesional con firma, sello y exportacion lista para PDF.",
  path: "/recibos"
});

export default function RecibosRoute() {
  return <ReceiptsPage />;
}
