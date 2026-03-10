import type { Metadata } from "next";

import { ClientsPage } from "@/components/pages/clients-page";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Clientes y agenda de contactos",
  description:
    "Importa contactos, organiza fichas de cliente y abre nuevos resguardos desde una agenda preparada para servicios recurrentes.",
  path: "/clientes"
});

export default function ClientesRoute() {
  return <ClientsPage />;
}
