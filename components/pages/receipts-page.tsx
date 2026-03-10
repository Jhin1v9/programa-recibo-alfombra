"use client";

import { ReceiptPreview } from "@/components/receipt-preview";
import { useReceiptApp } from "@/components/receipt-app-provider";
import {
  ActionButton,
  EditableField,
  EmptyState,
  PageIntro,
  RegistryCard,
  SectionCard
} from "@/components/workspace-ui";
import { formatClientName, formatDate } from "@/lib/receipt-core";
import type { ReceiptDraft, ServicePreset } from "@/lib/types";

export function ReceiptsPage() {
  const {
    draft,
    previewCompany,
    previewDraft,
    receipts,
    selectedClient,
    selectedReceiptId,
    nextReceiptSuggestion,
    updateDraftField,
    saveReceipt,
    deleteSelectedReceipt,
    assignNextReceiptNumber,
    prepareFreshReceipt,
    loadReceipt,
    duplicateReceipt,
    t
  } = useReceiptApp();
  const rugInputs = [
    { name: "rugType", label: t("receipts.rugType"), placeholder: t("receipts.rugTypePlaceholder") },
    { name: "rugSize", label: t("receipts.rugSize"), placeholder: t("receipts.rugSizePlaceholder") },
    {
      name: "rugColor",
      label: t("receipts.rugColor"),
      placeholder: t("receipts.rugColorPlaceholder")
    },
    {
      name: "rugCondition",
      label: t("receipts.rugCondition"),
      placeholder: t("receipts.rugConditionPlaceholder")
    },
    {
      name: "rugNotes",
      label: t("receipts.rugNotes"),
      placeholder: t("receipts.rugNotesPlaceholder"),
      multiline: true,
      rows: 4,
      full: true
    }
  ] as const;
  const serviceInputs = [
    {
      name: "receiptNumber",
      label: t("receipts.receiptNumber"),
      placeholder: t("receipts.receiptNumberPlaceholder")
    },
    { name: "pickupDate", label: t("receipts.pickupDate"), type: "date" as const },
    { name: "deliveryDate", label: t("receipts.deliveryDate"), type: "date" as const },
    {
      name: "estimatedValue",
      label: t("receipts.estimatedValue"),
      placeholder: t("receipts.estimatedValuePlaceholder")
    },
    {
      name: "serviceNotes",
      label: t("receipts.serviceNotes"),
      placeholder: t("receipts.serviceNotesPlaceholder"),
      multiline: true,
      rows: 5,
      full: true
    }
  ] as const;

  const sortedReceipts = [...receipts].sort(
    (first, second) => +new Date(second.updatedAt) - +new Date(first.updatedAt)
  );

  return (
    <>
      <PageIntro
        eyebrow={t("receipts.eyebrow")}
        title={t("receipts.title")}
        description={t("receipts.description")}
        actions={
          <div className="flex flex-wrap gap-3">
            <ActionButton label={t("receipts.save")} variant="primary" onClick={saveReceipt} />
            <ActionButton label={t("receipts.print")} variant="secondary" onClick={() => window.print()} />
          </div>
        }
      />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="workspace-panel min-w-0 grid gap-6">
          <SectionCard eyebrow={t("receipts.context")} title={t("receipts.linkedClient")} chip={t("receipts.current")}>
            {selectedClient ? (
              <div className="grid gap-3 md:grid-cols-2">
                <SummaryItem label={t("clients.firstName")} value={formatClientName(selectedClient) || t("dashboard.clientNoName")} />
                <SummaryItem label={t("clients.phone")} value={selectedClient.clientPhone || t("dashboard.noPhone")} />
                <SummaryItem label={t("clients.email")} value={selectedClient.clientEmail || t("dashboard.noEmail")} />
                <SummaryItem label={t("clients.address")} value={selectedClient.clientAddress || t("clients.noAddress")} />
              </div>
            ) : (
              <EmptyState message={t("receipts.noClientMessage")} />
            )}
          </SectionCard>

          <SectionCard eyebrow={t("receipts.rugDetails")} title={t("receipts.rugTitle")} chip={t("receipts.serviceChip")}>
            <div className="grid gap-4 md:grid-cols-2">
              {rugInputs.map((field) => (
                <EditableField
                  key={field.name}
                  config={field}
                  value={draft[field.name as keyof ServicePreset]}
                  onChange={(value) => updateDraftField(field.name as keyof ReceiptDraft, value)}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard eyebrow={t("receipts.internal")} title={t("receipts.serviceReceipt")}>
            <div className="grid gap-4 md:grid-cols-2">
              {serviceInputs.map((field) => (
                <EditableField
                  key={field.name}
                  config={field}
                  value={draft[field.name as keyof ReceiptDraft]}
                  onChange={(value) => updateDraftField(field.name as keyof ReceiptDraft, value)}
                />
              ))}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <ActionButton label={t("receipts.save")} variant="primary" onClick={saveReceipt} />
              <ActionButton label={t("receipts.newNumber")} variant="secondary" onClick={assignNextReceiptNumber} />
              <ActionButton label={t("receipts.newBlank")} variant="ghost" onClick={() => prepareFreshReceipt()} />
              <ActionButton
                label={t("clients.removeSelected")}
                variant="danger"
                onClick={deleteSelectedReceipt}
                disabled={!selectedReceiptId}
              />
            </div>

            <div className="mt-4 rounded-[22px] border border-[color:var(--line)] bg-white/72 px-4 py-3 text-sm leading-7 text-[color:var(--ink-soft)]">
              {t("receipts.suggestedNumber")}:{" "}
              <strong className="text-[color:var(--ink)]">{nextReceiptSuggestion}</strong>
            </div>
          </SectionCard>

          <SectionCard eyebrow={t("receipts.history")} title={t("receipts.savedTitle")}>
            <div className="flex flex-col gap-3">
              {sortedReceipts.length === 0 ? (
                <EmptyState message={t("receipts.empty")} />
              ) : (
                sortedReceipts.map((receipt) => (
                  <RegistryCard
                    key={receipt.id}
                    active={receipt.id === selectedReceiptId}
                    title={receipt.receiptNumber || t("dashboard.noNumber")}
                    chips={[receipt.rugType, receipt.estimatedValue].filter(Boolean)}
                    body={
                      <>
                        <p>{formatClientName(receipt) || t("dashboard.clientUndefined")}</p>
                        <p>{t("receipts.pickup")}: {formatDate(receipt.pickupDate) || "--/--/----"}</p>
                        <p>{receipt.rugSize || t("receipts.noMeasure")}</p>
                      </>
                    }
                    onOpen={() => loadReceipt(receipt.id)}
                    actions={[
                      {
                        label: t("receipts.open"),
                        variant: "primary",
                        onClick: () => loadReceipt(receipt.id)
                      },
                      {
                        label: t("receipts.duplicate"),
                        variant: "secondary",
                        onClick: () => duplicateReceipt(receipt.id)
                      }
                    ]}
                  />
                ))
              )}
            </div>
          </SectionCard>
        </div>

        <div className="preview-panel min-w-0 flex flex-col gap-4 2xl:sticky 2xl:top-6 2xl:self-start">
          <div className="print-note panel-card rounded-[24px] px-5 py-4 text-sm font-extrabold text-[color:var(--ink)]">
            {t("receipts.printNote")}
          </div>

          <ReceiptPreview company={previewCompany} receipt={previewDraft} />
        </div>
      </div>
    </>
  );
}

function SummaryItem({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-[22px] border border-[color:var(--line)] bg-white/72 px-4 py-3">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[color:var(--brand)]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-7 text-[color:var(--ink)]">{value}</p>
    </div>
  );
}
