import type { Metadata } from "next";

import { SettingsPage } from "@/components/pages/settings-page";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Configuración de idioma y preferencias",
  description:
    "Ajusta idioma, preferencias de trabajo y detalles de uso para mantener el flujo de recibos claro en escritorio y móvil.",
  path: "/configuracion"
});

export default function ConfiguracionRoute() {
  return <SettingsPage />;
}
