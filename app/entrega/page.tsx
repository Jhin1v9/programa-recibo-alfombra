import type { Metadata } from "next";

import { DeliveryPage } from "@/components/pages/delivery-page";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Entrega y conformidad del servicio",
  description:
    "Documenta la entrega final de la alfombra, recoge la conformidad del cliente y genera el comprobante de devolucion en A4.",
  path: "/entrega"
});

export default function EntregaRoute() {
  return <DeliveryPage />;
}
