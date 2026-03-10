"use client";

import type { Route } from "next";
import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { CompanyStampDisplay } from "@/components/company-stamp-display";
import { SignatureCaptureDialog } from "@/components/signature-capture-dialog";
import { useReceiptApp } from "@/components/receipt-app-provider";
import {
  ActionButton,
  EditableField,
  EmptyState,
  LinkButton,
  PageIntro,
  RegistryCard,
  SectionCard
} from "@/components/workspace-ui";
import { formatClientName, formatDate } from "@/lib/receipt-core";
import type { ReceiptDraft } from "@/lib/types";

export function DeliveryPage() {
  const {
    companyForm,
    draft,
    receipts,
    selectedClient,
    selectedReceiptId,
    nextReceiptSuggestion,
    updateDraftField,
    saveReceipt,
    deleteReceipt,
    deleteSelectedReceipt,
    assignNextReceiptNumber,
    prepareFreshReceipt,
    loadReceipt,
    duplicateReceipt,
    t
  } = useReceiptApp();
  const router = useRouter();
  const [signatureTarget, setSignatureTarget] = useState<"client" | "company" | null>(null);
  const sortedReceipts = [...receipts].sort(
    (first, second) => +new Date(second.updatedAt) - +new Date(first.updatedAt)
  );
  const clientSignerName = formatClientName(draft) || draft.deliveryReceivedBy || undefined;
  const companySignerName = companyForm.companyResponsible || undefined;
  const referenceInputs = [
    {
      name: "receiptNumber",
      label: t("receipts.receiptNumber"),
      placeholder: t("receipts.receiptNumberPlaceholder")
    },
    { name: "pickupDate", label: t("receipts.pickupDate"), type: "date" as const },
    { name: "deliveryDate", label: t("receipts.deliveryDate"), type: "date" as const },
    { name: "rugType", label: t("receipts.rugType"), placeholder: t("receipts.rugTypePlaceholder") },
    { name: "rugSize", label: t("receipts.rugSize"), placeholder: t("receipts.rugSizePlaceholder") },
    {
      name: "rugColor",
      label: t("receipts.rugColor"),
      placeholder: t("receipts.rugColorPlaceholder")
    },
    {
      name: "estimatedValue",
      label: t("receipts.estimatedValue"),
      placeholder: t("receipts.estimatedValuePlaceholder")
    }
  ] as const;
  const deliveryInputs = [
    {
      name: "handoverDate",
      label: t("delivery.deliveryDateActual"),
      type: "date" as const
    },
    {
      name: "deliveryReceivedBy",
      label: t("delivery.deliveryReceivedBy"),
      placeholder: t("delivery.deliveryReceivedByPlaceholder")
    },
    {
      name: "deliveryCondition",
      label: t("delivery.deliveryCondition"),
      placeholder: t("delivery.deliveryConditionPlaceholder")
    },
    {
      name: "deliveryNotes",
      label: t("delivery.deliveryNotes"),
      placeholder: t("delivery.deliveryNotesPlaceholder"),
      multiline: true,
      rows: 5,
      full: true
    }
  ] as const;

  return (
    <>
      <PageIntro
        eyebrow={t("delivery.eyebrow")}
        title={t("delivery.title")}
        description={t("delivery.description")}
        actions={
          <div className="flex flex-wrap gap-3">
            <ActionButton label={t("delivery.save")} variant="primary" onClick={saveReceipt} />
            <LinkButton href={"/entrega/pdf" as Route} label={t("delivery.viewPdf")} variant="secondary" />
          </div>
        }
      />

      <div className="workspace-panel min-w-0 grid gap-6 pb-28 md:pb-0">
        <SectionCard eyebrow={t("delivery.context")} title={t("delivery.linkedClient")} chip={t("receipts.current")}>
          {selectedClient ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <SummaryItem label={t("clients.firstName")} value={formatClientName(selectedClient) || t("dashboard.clientNoName")} />
              <SummaryItem label={t("clients.phone")} value={selectedClient.clientPhone || t("dashboard.noPhone")} />
              <SummaryItem label={t("clients.email")} value={selectedClient.clientEmail || t("dashboard.noEmail")} />
              <SummaryItem label={t("clients.address")} value={selectedClient.clientAddress || t("clients.noAddress")} />
            </div>
          ) : (
            <EmptyState message={t("delivery.noClientMessage")} />
          )}
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <SectionCard eyebrow={t("delivery.reference")} title={t("delivery.referenceTitle")}>
            <div className="grid gap-4 md:grid-cols-2">
              {referenceInputs.map((field) => (
                <EditableField
                  key={field.name}
                  config={field}
                  value={draft[field.name as keyof ReceiptDraft]}
                  onChange={(value) => updateDraftField(field.name as keyof ReceiptDraft, value)}
                />
              ))}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <ActionButton label={t("delivery.save")} variant="primary" onClick={saveReceipt} />
              <ActionButton label={t("receipts.newNumber")} variant="secondary" onClick={assignNextReceiptNumber} />
              <ActionButton
                label={t("delivery.viewPickup")}
                variant="ghost"
                onClick={() => router.push("/recibos" as Route)}
              />
              <ActionButton
                label={t("receipts.newBlank")}
                variant="ghost"
                onClick={() => prepareFreshReceipt()}
              />
            </div>

            <div className="mt-4 rounded-[22px] border border-[color:var(--line)] bg-white/72 px-4 py-3 text-sm leading-7 text-[color:var(--ink-soft)]">
              {t("receipts.suggestedNumber")}:{" "}
              <strong className="text-[color:var(--ink)]">{nextReceiptSuggestion}</strong>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow={t("delivery.deliveryEyebrow")}
            title={t("delivery.deliveryTitle")}
            actions={<ActionButton label={t("delivery.viewPdf")} variant="secondary" onClick={() => router.push("/entrega/pdf" as Route)} />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {deliveryInputs.map((field) => (
                <EditableField
                  key={field.name}
                  config={field}
                  value={draft[field.name as keyof ReceiptDraft]}
                  onChange={(value) => updateDraftField(field.name as keyof ReceiptDraft, value)}
                />
              ))}
            </div>

            <div className="mt-4 rounded-[24px] border border-[color:var(--line)] bg-[rgba(15,23,42,0.04)] p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[color:var(--brand)]">
                {t("delivery.termsEyebrow")}
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">{t("delivery.termsText")}</p>
            </div>
          </SectionCard>
        </div>

        <SectionCard eyebrow={t("delivery.validationEyebrow")} title={t("delivery.validationTitle")}>
          <p className="max-w-[72ch] text-sm leading-7 text-[color:var(--ink-soft)]">
            {t("delivery.validationText")}
          </p>

          <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px]">
            <SignatureStatusCard
              title={t("delivery.clientSignature")}
              status={
                draft.deliveryClientSignatureDataUrl
                  ? t("receipts.signaturePresent")
                  : t("receipts.signatureMissing")
              }
              imageDataUrl={draft.deliveryClientSignatureDataUrl}
              fallbackText={clientSignerName}
              primaryAction={{
                label: t("delivery.captureClientSignature"),
                onClick: () => setSignatureTarget("client")
              }}
              secondaryAction={{
                label: t("delivery.clearClientSignature"),
                onClick: () => updateDraftField("deliveryClientSignatureDataUrl", ""),
                disabled: !draft.deliveryClientSignatureDataUrl
              }}
            />

            <SignatureStatusCard
              title={t("delivery.companySignature")}
              status={
                draft.deliveryCompanySignatureDataUrl
                  ? t("receipts.signaturePresent")
                  : t("receipts.signatureMissing")
              }
              imageDataUrl={draft.deliveryCompanySignatureDataUrl}
              fallbackText={companySignerName}
              primaryAction={{
                label: t("delivery.captureCompanySignature"),
                onClick: () => setSignatureTarget("company")
              }}
              secondaryAction={{
                label: t("delivery.useSavedCompanySignature"),
                onClick: () =>
                  updateDraftField(
                    "deliveryCompanySignatureDataUrl",
                    companyForm.companySignatureDataUrl || draft.deliveryCompanySignatureDataUrl
                  ),
                disabled: !companyForm.companySignatureDataUrl
              }}
              tertiaryAction={{
                label: t("delivery.clearCompanySignature"),
                onClick: () => updateDraftField("deliveryCompanySignatureDataUrl", ""),
                disabled: !draft.deliveryCompanySignatureDataUrl
              }}
            />

            <div className="rounded-[26px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,252,0.92))] p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[color:var(--brand)]">
                {t("company.stampAsset")}
              </p>
              <div className="mt-4 flex justify-center">
                <CompanyStampDisplay company={companyForm} compact />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow={t("delivery.history")}
          title={t("delivery.historyTitle")}
          actions={
            <ActionButton
              label={t("delivery.deleteSelected")}
              variant="danger"
              onClick={deleteSelectedReceipt}
              disabled={!selectedReceiptId}
            />
          }
        >
          <div className="flex flex-col gap-3">
            {sortedReceipts.length === 0 ? (
              <EmptyState message={t("receipts.empty")} />
            ) : (
              sortedReceipts.map((receipt) => (
                <RegistryCard
                  key={receipt.id}
                  active={receipt.id === selectedReceiptId}
                  title={receipt.receiptNumber || t("dashboard.noNumber")}
                  chips={[
                    receipt.rugType,
                    receipt.handoverDate ? t("delivery.deliveredChip") : "",
                    receipt.deliveryCondition
                  ].filter(Boolean)}
                  body={
                    <>
                      <p>{formatClientName(receipt) || t("dashboard.clientUndefined")}</p>
                      <p>{t("delivery.deliveryDateActual")}: {formatDate(receipt.handoverDate) || "--/--/----"}</p>
                      <p>{receipt.deliveryReceivedBy || t("delivery.deliveryPending")}</p>
                    </>
                  }
                  onOpen={() => loadReceipt(receipt.id)}
                  actions={[
                    {
                      label: t("delivery.viewPdf"),
                      variant: "secondary",
                      onClick: () => router.push(`/entrega/pdf?receiptId=${receipt.id}` as Route)
                    },
                    {
                      label: t("receipts.duplicate"),
                      variant: "ghost",
                      onClick: () => duplicateReceipt(receipt.id)
                    },
                    {
                      label: t("receipts.delete"),
                      variant: "danger",
                      onClick: () => deleteReceipt(receipt.id)
                    }
                  ]}
                />
              ))
            )}
          </div>
        </SectionCard>
      </div>

      <div className="mobile-safe-dock pointer-events-none fixed inset-x-4 bottom-4 z-30 md:hidden">
        <div className="pointer-events-auto rounded-[26px] border border-black/6 bg-white/96 p-3 shadow-[0_24px_48px_rgba(15,23,42,0.16)] backdrop-blur">
          <div className="grid grid-cols-3 gap-2">
            <ActionButton label={t("delivery.save")} variant="primary" onClick={saveReceipt} />
            <ActionButton
              label={t("delivery.mobileBarPdf")}
              variant="secondary"
              onClick={() => router.push("/entrega/pdf" as Route)}
            />
            <ActionButton
              label={t("delivery.mobileBarSign")}
              variant="ghost"
              onClick={() => setSignatureTarget("client")}
            />
          </div>
        </div>
      </div>

      <SignatureCaptureDialog
        open={signatureTarget !== null}
        title={
          signatureTarget === "company"
            ? t("delivery.dialogTitleCompany")
            : t("delivery.dialogTitleClient")
        }
        description={t("delivery.dialogDescription")}
        signerName={signatureTarget === "company" ? companySignerName : clientSignerName}
        initialValue={
          signatureTarget === "company"
            ? draft.deliveryCompanySignatureDataUrl || companyForm.companySignatureDataUrl
            : draft.deliveryClientSignatureDataUrl
        }
        onClose={() => setSignatureTarget(null)}
        onSave={(dataUrl) => {
          if (signatureTarget === "company") {
            updateDraftField("deliveryCompanySignatureDataUrl", dataUrl);
            return;
          }

          updateDraftField("deliveryClientSignatureDataUrl", dataUrl);
        }}
        labels={{
          clear: t("signature.clear"),
          cancel: t("signature.cancel"),
          save: t("signature.save"),
          empty: t("signature.empty"),
          sheetTitle: t("signature.sheetTitle"),
          sheetNote: t("signature.sheetNote")
        }}
      />
    </>
  );
}

function SignatureStatusCard({
  title,
  status,
  imageDataUrl,
  fallbackText,
  primaryAction,
  secondaryAction,
  tertiaryAction
}: Readonly<{
  title: string;
  status: string;
  imageDataUrl?: string;
  fallbackText?: string;
  primaryAction: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void; disabled?: boolean };
  tertiaryAction?: { label: string; onClick: () => void; disabled?: boolean };
}>) {
  return (
    <div className="rounded-[26px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,252,0.92))] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-[color:var(--ink)]">{title}</h3>
          <p className="mt-1 text-sm text-[color:var(--ink-soft)]">{status}</p>
        </div>
      </div>

      <div className="mt-4 flex min-h-[148px] items-center justify-center rounded-[20px] border-2 border-dashed border-[color:var(--line-strong)] bg-white p-3">
        {imageDataUrl ? (
          <Image
            src={imageDataUrl}
            alt={title}
            width={240}
            height={112}
            unoptimized
            className="max-h-[112px] max-w-full object-contain"
          />
        ) : fallbackText ? (
          <p className="signature-script max-w-full truncate px-3 text-center text-[2rem] text-[color:var(--ink)]">
            {fallbackText}
          </p>
        ) : (
          <p className="max-w-[18ch] text-center text-sm leading-6 text-[color:var(--ink-soft)]">
            {status}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <ActionButton label={primaryAction.label} variant="primary" onClick={primaryAction.onClick} />
        {secondaryAction ? (
          <ActionButton
            label={secondaryAction.label}
            variant="ghost"
            onClick={secondaryAction.onClick}
            disabled={secondaryAction.disabled}
          />
        ) : null}
        {tertiaryAction ? (
          <ActionButton
            label={tertiaryAction.label}
            variant="ghost"
            onClick={tertiaryAction.onClick}
            disabled={tertiaryAction.disabled}
          />
        ) : null}
      </div>
    </div>
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
