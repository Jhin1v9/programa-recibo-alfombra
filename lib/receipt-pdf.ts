"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

type ExportReceiptPdfOptions = {
  fileName: string;
  sourceElement: HTMLElement;
  action: "download" | "open";
  targetWindow?: Window | null;
};

function resolveCaptureElement(sourceElement: HTMLElement) {
  const nestedSheet = sourceElement.querySelector(".receipt-sheet");
  return nestedSheet instanceof HTMLElement ? nestedSheet : sourceElement;
}

function createExportClone(sourceElement: HTMLElement) {
  const originalSheet = resolveCaptureElement(sourceElement);
  const sandbox = document.createElement("div");
  const clone = originalSheet.cloneNode(true);

  if (!(clone instanceof HTMLElement)) {
    throw new Error("Unable to clone receipt preview for PDF export.");
  }

  sandbox.style.position = "fixed";
  sandbox.style.left = "-10000px";
  sandbox.style.top = "0";
  sandbox.style.width = "794px";
  sandbox.style.pointerEvents = "none";
  sandbox.style.opacity = "0";
  sandbox.style.zIndex = "-1";
  sandbox.setAttribute("aria-hidden", "true");

  clone.classList.remove("receipt-sheet-screen");
  clone.classList.add("receipt-sheet-export");

  const documentRoot = clone.querySelector(".receipt-document-root-screen");
  if (documentRoot instanceof HTMLElement) {
    documentRoot.classList.remove("receipt-document-root-screen");
    documentRoot.classList.add("receipt-document-root-export");
  }

  sandbox.appendChild(clone);
  document.body.appendChild(sandbox);

  return { sandbox, clone };
}

function waitForNextFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

export async function exportReceiptPdf(options: ExportReceiptPdfOptions) {
  const { sandbox, clone } = createExportClone(options.sourceElement);

  try {
    if ("fonts" in document) {
      await document.fonts.ready;
    }

    await waitForNextFrame();

    const canvas = await html2canvas(clone, {
      backgroundColor: "#ffffff",
      scale: 2.4,
      useCORS: true,
      width: clone.scrollWidth,
      height: clone.scrollHeight,
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight,
      scrollX: 0,
      scrollY: 0
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true
    });

    const imageData = canvas.toDataURL("image/png");
    const pageWidth = 210;
    const pageHeight = 297;
    const canvasRatio = canvas.width / canvas.height;
    const pageRatio = pageWidth / pageHeight;

    let renderWidth = pageWidth;
    let renderHeight = pageHeight;

    if (canvasRatio > pageRatio) {
      renderHeight = pageWidth / canvasRatio;
    } else {
      renderWidth = pageHeight * canvasRatio;
    }

    const offsetX = (pageWidth - renderWidth) / 2;
    const offsetY = (pageHeight - renderHeight) / 2;

    pdf.addImage(imageData, "PNG", offsetX, offsetY, renderWidth, renderHeight, undefined, "FAST");

    const blob = pdf.output("blob");
    const blobUrl = URL.createObjectURL(blob);

    if (options.action === "download") {
      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = options.fileName;
      downloadLink.click();
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
      return;
    }

    if (options.targetWindow && !options.targetWindow.closed) {
      options.targetWindow.document.open();
      options.targetWindow.document.write(`
        <title>${options.fileName}</title>
        <style>
          html, body {
            margin: 0;
            height: 100%;
            background: #111827;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: 0;
          }
        </style>
        <iframe src="${blobUrl}" title="${options.fileName}"></iframe>
      `);
      options.targetWindow.document.close();
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 120_000);
      return;
    }

    const openedWindow = window.open(blobUrl, "_blank");
    if (!openedWindow) {
      window.location.href = blobUrl;
    }

    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 120_000);
  } finally {
    sandbox.remove();
  }
}
