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

  if ("fonts" in document) {
    await document.fonts.ready;
  }

  const canvas = await html2canvas(options.sourceElement, {
    backgroundColor: "#ffffff",
    scale: 2.4,
    useCORS: true,
    width: options.sourceElement.scrollWidth,
    height: options.sourceElement.scrollHeight,
    windowWidth: options.sourceElement.scrollWidth,
    windowHeight: options.sourceElement.scrollHeight
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

  if (options.action === "download") {
    pdf.save(options.fileName);
    return;
  }

  const blobUrl = String(pdf.output("bloburl"));

  if (options.targetWindow && !options.targetWindow.closed) {
    options.targetWindow.location.href = blobUrl;
  } else {
    window.open(blobUrl, "_blank", "noopener,noreferrer");
  }
}
