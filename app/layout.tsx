import type { Metadata, Viewport } from "next";
import { Dancing_Script, Manrope, Space_Grotesk } from "next/font/google";

import { AppShell } from "@/components/app-shell";
import { ReceiptAppProvider } from "@/components/receipt-app-provider";
import {
  APP_DESCRIPTION,
  APP_NAME,
  APP_OG_IMAGE_PATH,
  APP_TITLE,
  SITE_URL
} from "@/lib/site-metadata";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: APP_TITLE,
    template: `%s | ${APP_NAME}`
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
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
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    url: SITE_URL,
    siteName: APP_NAME,
    images: [
      {
        url: APP_OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: APP_NAME
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    images: [APP_OG_IMAGE_PATH]
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
