"use client";

type ExportReceiptPdfOptions = {
  fileName: string;
  sourceElement: HTMLElement;
  action: "download" | "open";
  targetWindow?: Window | null;
};

export async function exportReceiptPdf(options: ExportReceiptPdfOptions) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf")
  ]);
  const captureElement =
    options.sourceElement.firstElementChild instanceof HTMLElement
      ? options.sourceElement.firstElementChild
      : options.sourceElement;

  if ("fonts" in document) {
    await document.fonts.ready;
  }

  const canvas = await html2canvas(captureElement, {
    backgroundColor: "#ffffff",
    scale: 2.4,
    useCORS: true,
    width: captureElement.scrollWidth,
    height: captureElement.scrollHeight,
    windowWidth: captureElement.scrollWidth,
    windowHeight: captureElement.scrollHeight,
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
}
