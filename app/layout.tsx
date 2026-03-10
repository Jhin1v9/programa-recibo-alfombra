import type { Metadata, Viewport } from "next";
import { Dancing_Script, Manrope, Space_Grotesk } from "next/font/google";

import { AppShell } from "@/components/app-shell";
import { ReceiptAppProvider } from "@/components/receipt-app-provider";

import "./globals.css";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const signatureFont = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-signature"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://programa-recibo-alfombra.vercel.app"),
  title: {
    default: "Programa de resguardos para recogida de alfombras",
    template: "%s | Recibos Alfombra Studio"
  },
  description:
    "Aplicacion para importar contactos, guardar clientes y generar resguardos de recogida y custodia temporal en formato A4.",
  applicationName: "Recibos Alfombra Studio",
  keywords: ["recibos", "alfombra", "tapetes", "clientes", "pdf", "next.js", "vercel"],
  authors: [
    {
      name: "Jhin1v9"
    }
  ],
  creator: "Jhin1v9",
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: "website",
    title: "Programa de resguardos para recogida de alfombras",
    description:
      "Aplicacion para importar contactos, guardar clientes y generar resguardos de recogida y custodia temporal en formato A4.",
    url: "https://programa-recibo-alfombra.vercel.app",
    siteName: "Recibos Alfombra Studio",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "Recibos Alfombra Studio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Programa de resguardos para recogida de alfombras",
    description:
      "Aplicacion para importar contactos, guardar clientes y generar resguardos de recogida y custodia temporal en formato A4.",
    images: ["/icon.svg"]
  }
};

export const viewport: Viewport = {
  themeColor: "#121a2f"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${bodyFont.variable} ${displayFont.variable} ${signatureFont.variable}`}>
        <ReceiptAppProvider>
          <AppShell>{children}</AppShell>
        </ReceiptAppProvider>
      </body>
    </html>
  );
}
