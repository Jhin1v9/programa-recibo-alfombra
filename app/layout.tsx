import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

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

export const metadata: Metadata = {
  title: "Recibos Alfombra Studio",
  description:
    "Workspace moderno para importar contatos, guardar clientes e gerar recibos de recolha em A4.",
  applicationName: "Recibos Alfombra Studio",
  keywords: [
    "recibos",
    "alfombra",
    "tapetes",
    "clientes",
    "pdf",
    "next.js",
    "vercel"
  ],
  authors: [
    {
      name: "Jhin1v9"
    }
  ],
  creator: "Jhin1v9"
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
    <html lang="pt-BR">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <ReceiptAppProvider>
          <AppShell>{children}</AppShell>
        </ReceiptAppProvider>
      </body>
    </html>
  );
}
