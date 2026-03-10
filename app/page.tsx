import type { Metadata } from "next";

import { DashboardPage } from "@/components/pages/dashboard-page";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Recibos Alfombra Studio",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://programa-recibo-alfombra.vercel.app/",
  description:
    "Programa para guardar clientes y generar resguardos de recogida y custodia temporal para limpieza profesional.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR"
  }
};

export const metadata: Metadata = {
  title: "Programa de resguardos para recogida de alfombras",
  alternates: {
    canonical: "/"
  }
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <DashboardPage />
    </>
  );
}
