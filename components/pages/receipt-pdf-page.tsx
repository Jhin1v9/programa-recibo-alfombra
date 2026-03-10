"use client";

import { useEffect, useRef, useState } from "react";

import { ReceiptPreview } from "@/components/receipt-preview";
import { useReceiptApp } from "@/components/receipt-app-provider";
import {
  ActionButton,
  LinkButton,
  PageIntro,
  SectionCard
} from "@/components/workspace-ui";
import { formatClientName } from "@/lib/receipt-core";
import { exportReceiptPdf } from "@/lib/receipt-pdf";

export function ReceiptPdfPage({
  receiptId
}: Readonly<{
  receiptId?: string;
}>) {
  const {
    hasBootstrapped,
    previewCompany,
    previewDraft,
    nextReceiptSuggestion,
    loadReceipt,
    t
  } = useReceiptApp();
  const exportPreviewRef = useRef<HTMLDivElement | null>(null);
  const loadedReceiptIdRef = useRef<string | null>(null);
  const [pdfAction, setPdfAction] = useState<"download" | "open" | null>(null);

  useEffect(() => {
    if (!hasBootstrapped || !receiptId) {
      return;
    }

    if (loadedReceiptIdRef.current === receiptId) {
      return;
    }

    loadReceipt(receiptId, true);
    loadedReceiptIdRef.current = receiptId;
  }, [hasBootstrapped, loadReceipt, receiptId]);

  async function handlePdfExport(action: "download" | "open") {
    if (!exportPreviewRef.current) {
      return;
    }

    const fileLabel = [previewDraft.receiptNumber || nextReceiptSuggestion, formatClientName(previewDraft)]
      .filter(Boolean)
      .join("-");
    const fileName =
      `${fileLabel || "recibo-alfombra"}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "recibo-alfombra";
    const targetWindow =
      action === "open" ? window.open("", "_blank", "noopener,noreferrer") : null;

    if (targetWindow) {
      targetWindow.document.write(
        `<title>${t("receipts.generatingPdf")}</title><p style="font-family:sans-serif;padding:24px">${t(
          "receipts.generatingPdf"
        )}</p>`
      );
    }

    setPdfAction(action);

    try {
      await exportReceiptPdf({
        action,
        fileName: `${fileName}.pdf`,
        sourceElement: exportPreviewRef.current,
        targetWindow
      });
    } catch (error) {
      if (targetWindow && !targetWindow.closed) {
        targetWindow.close();
      }
      window.alert(t("receipts.pdfError"));
      console.error(error);
    } finally {
      setPdfAction(null);
    }
  }

  return (
    <>
      <PageIntro
        eyebrow={t("receipts.previewPageEyebrow")}
        title={t("receipts.previewPageTitle")}
        description={t("receipts.previewPageDescription")}
        actions={
          <>
            <LinkButton href="/recibos" label={t("receipts.backToEditor")} variant="ghost" />
            <ActionButton
              label={pdfAction ? t("receipts.generatingPdf") : t("receipts.downloadPdf")}
              variant="secondary"
              onClick={() => void handlePdfExport("download")}
              disabled={pdfAction !== null}
            />
            <ActionButton
              label={pdfAction ? t("receipts.generatingPdf") : t("receipts.openPdf")}
              variant="primary"
              onClick={() => void handlePdfExport("open")}
              disabled={pdfAction !== null}
            />
          </>
        }
      />

      <SectionCard eyebrow={t("receipts.eyebrow")} title={t("receipts.printNote")}>
        <div className="overflow-auto rounded-[26px] border border-[color:var(--line)] bg-[rgba(16,24,38,0.04)] p-4 md:p-6">
          <div className="mx-auto min-w-[794px] max-w-[794px]">
            <ReceiptPreview company={previewCompany} receipt={previewDraft} />
          </div>
        </div>
      </SectionCard>

      <div className="receipt-export-host" aria-hidden="true">
        <div ref={exportPreviewRef}>
          <ReceiptPreview company={previewCompany} receipt={previewDraft} mode="export" />
        </div>
      </div>
    </>
  );
}
