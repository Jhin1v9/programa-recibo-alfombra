import type { Metadata } from "next";

export const SITE_URL = "https://programa-recibo-alfombra.vercel.app";
export const APP_NAME = "Recibos Alfombra Studio";
export const APP_TITLE = "Programa de resguardos para recogida de alfombras";
export const APP_DESCRIPTION =
  "Aplicacion para importar contactos, guardar clientes y generar resguardos de recogida y custodia temporal en formato A4.";
export const APP_OG_IMAGE_PATH = "/opengraph-image";

type PageMetadataInput = {
  title: string;
  description: string;
  path: `/${string}` | "/";
};

function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function buildPageMetadata({
  title,
  description,
  path
}: Readonly<PageMetadataInput>): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      type: "website",
      url: absoluteUrl(path),
      title,
      description,
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
      title,
      description,
      images: [APP_OG_IMAGE_PATH]
    }
  };
}
