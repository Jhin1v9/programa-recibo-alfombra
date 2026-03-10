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
      action === "open" ? window.open("about:blank", "_blank") : null;

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

      <div className="grid gap-6 pb-28 md:pb-0">
        <SectionCard eyebrow={t("receipts.eyebrow")} title={t("receipts.printNote")}>
          <p className="mb-4 text-sm leading-7 text-[color:var(--ink-soft)]">
            {t("receipts.previewScrollHint")}
          </p>
          <div className="rounded-[26px] border border-[color:var(--line)] bg-[rgba(16,24,38,0.04)] p-3 md:p-6">
            <div className="mx-auto max-w-[860px]">
              <ReceiptPreview company={previewCompany} receipt={previewDraft} />
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="mobile-safe-dock pointer-events-none fixed inset-x-4 bottom-4 z-30 md:hidden">
        <div className="pointer-events-auto rounded-[26px] border border-black/6 bg-white/96 p-3 shadow-[0_24px_48px_rgba(15,23,42,0.16)] backdrop-blur">
          <div className="grid grid-cols-3 gap-2">
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
          </div>
        </div>
      </div>

      <div className="receipt-export-host" aria-hidden="true">
        <div ref={exportPreviewRef}>
          <ReceiptPreview company={previewCompany} receipt={previewDraft} mode="export" />
        </div>
      </div>
    </>
  );
}
