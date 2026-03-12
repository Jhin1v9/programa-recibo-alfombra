"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

type BrandMarkProps = {
  compact?: boolean;
  light?: boolean;
  imageDataUrl?: string;
  logoFit?: "contain" | "cover";
  emphasizeLogo?: boolean;
};

export function BrandMark({
  compact = false,
  light = false,
  imageDataUrl,
  logoFit = "contain",
  emphasizeLogo = false
}: Readonly<BrandMarkProps>) {
  const [logoCrop, setLogoCrop] = useState<{ source: string; cropped: string } | null>(null);

  useEffect(() => {
    if (!imageDataUrl) {
      return;
    }

    let cancelled = false;
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = imageDataUrl;

    image.onload = () => {
      if (cancelled) {
        return;
      }

      const width = image.naturalWidth;
      const height = image.naturalHeight;

      if (!width || !height) {
        setLogoCrop({ source: imageDataUrl, cropped: imageDataUrl });
        return;
      }

      const sourceCanvas = document.createElement("canvas");
      sourceCanvas.width = width;
      sourceCanvas.height = height;
      const sourceContext = sourceCanvas.getContext("2d");

      if (!sourceContext) {
        setLogoCrop({ source: imageDataUrl, cropped: imageDataUrl });
        return;
      }

      sourceContext.drawImage(image, 0, 0, width, height);
      const { data } = sourceContext.getImageData(0, 0, width, height);

      let minX = width;
      let minY = height;
      let maxX = 0;
      let maxY = 0;
      let hasVisiblePixel = false;

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const alpha = data[(y * width + x) * 4 + 3];
          if (alpha <= 8) {
            continue;
          }

          hasVisiblePixel = true;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }

      if (!hasVisiblePixel) {
        setLogoCrop({ source: imageDataUrl, cropped: imageDataUrl });
        return;
      }

      const cropWidth = Math.max(1, maxX - minX + 1);
      const cropHeight = Math.max(1, maxY - minY + 1);
      const targetCanvas = document.createElement("canvas");
      targetCanvas.width = cropWidth;
      targetCanvas.height = cropHeight;

      const targetContext = targetCanvas.getContext("2d");
      if (!targetContext) {
        setLogoCrop({ source: imageDataUrl, cropped: imageDataUrl });
        return;
      }

      targetContext.drawImage(
        sourceCanvas,
        minX,
        minY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      setLogoCrop({ source: imageDataUrl, cropped: targetCanvas.toDataURL("image/png") });
    };

    image.onerror = () => {
      if (!cancelled) {
        setLogoCrop({ source: imageDataUrl, cropped: imageDataUrl });
      }
    };

    return () => {
      cancelled = true;
    };
  }, [imageDataUrl]);

  const processedLogoDataUrl =
    imageDataUrl && logoCrop?.source === imageDataUrl ? logoCrop.cropped : imageDataUrl || "";

  const frameBorder = light ? "rgba(255, 255, 255, 0.2)" : "rgba(15, 23, 42, 0.08)";
  const frameFill = light ? "rgba(255, 255, 255, 0.08)" : "#ffffff";
  const iconInk = light ? "#ffffff" : "#0f172a";
  const iconSoft = light ? "rgba(255, 255, 255, 0.24)" : "#dbe4ef";
  const iconAccent = light ? "#f4c35a" : "#c36a39";
  const wordmark = light ? "#ffffff" : "var(--ink)";
  const submark = light ? "rgba(255, 255, 255, 0.74)" : "var(--ink-soft)";

  return (
    <div className={`flex items-center ${compact ? "gap-3" : "gap-3.5"}`}>
      <div
        className={`relative isolate overflow-hidden rounded-[18px] ${
          compact ? (emphasizeLogo ? "h-14 w-14" : "h-12 w-12") : "h-14 w-14"
        }`}
        style={{
          border: `1px solid ${frameBorder}`,
          background: frameFill
        }}
      >
        {processedLogoDataUrl ? (
          <div
            className={`flex h-full w-full items-center justify-center rounded-[14px] border border-[rgba(15,23,42,0.12)] bg-white ${
              emphasizeLogo ? "p-0.5" : "p-1.5"
            }`}
          >
            <Image
              src={processedLogoDataUrl}
              alt="Logo de la empresa"
              width={80}
              height={80}
              unoptimized
              className={`h-full w-full ${logoFit === "cover" ? "object-cover" : "object-contain"}`}
            />
          </div>
        ) : (
          <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
            <rect x="7.5" y="7.5" width="49" height="49" rx="15" fill="none" stroke={iconSoft} strokeWidth="1.5" />
            <rect x="18" y="15" width="28" height="34" rx="7" fill={iconInk} />
            <rect x="22" y="19" width="20" height="20" rx="4.5" fill="#ffffff" />
            <path d="M27 24.5h10" stroke={iconInk} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M27 29.5h10" stroke={iconInk} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M27 34.5h6.5" stroke={iconInk} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M41 24v12" stroke={iconAccent} strokeWidth="3" strokeLinecap="round" />
            <path d="M22 45h20" stroke={iconSoft} strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {compact ? null : (
        <div className="min-w-0">
          <p
            className="truncate text-[0.98rem] font-extrabold leading-5 tracking-[0.04em]"
            style={{ color: wordmark }}
          >
            Recibos Alfombra Studio
          </p>
          <p
            className="truncate text-[0.68rem] font-semibold uppercase tracking-[0.18em]"
            style={{ color: submark }}
          >
            Resguardos y custodia
          </p>
        </div>
      )}
    </div>
  );
}
