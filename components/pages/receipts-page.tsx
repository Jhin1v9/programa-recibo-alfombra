"use client";

import type { Route } from "next";
import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { CompanyStampDisplay } from "@/components/company-stamp-display";
import { ReceiptPreview } from "@/components/receipt-preview";
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
import type { ReceiptDraft, ServicePreset } from "@/lib/types";

const CONDITION_PRESETS = [
  "Excelente",
  "Buen estado",
  "Con manchas",
  "Con desgaste",
  "Suciedad intensa"
] as const;

const NOTE_PRESETS = [
  "Manchas localizadas",
  "Desgaste por uso",
  "Posible olor",
  "Suciedad intensa",
  "Revisar bordes y costuras"
] as const;

export function ReceiptsPage() {
  const {
    companyForm,
    draft,
    receipts,
    selectedClient,
    selectedReceiptId,
    nextReceiptSuggestion,
    previewCompany,
    previewDraft,
    updateDraftField,
    saveReceipt,
    deleteReceipt,
    deleteSelectedReceipt,
    assignNextReceiptNumber,
    prepareFreshReceipt,
    loadReceipt,
    duplicateReceipt,
    startNewReceiptForClient,
    repeatLastServiceForClient,
    saveClientTemplate,
    applyClientTemplate,
    showFeedback,
    t
  } = useReceiptApp();
  const router = useRouter();
  const [signatureTarget, setSignatureTarget] = useState<"client" | "company" | null>(null);

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
  const clientSignerName = formatClientName(draft) || undefined;
  const companySignerName = companyForm.companyResponsible || undefined;

  function applyConditionPreset(preset: string) {
    updateDraftField("rugCondition", preset);
  }

  function appendRugNotePreset(note: string) {
    const currentNotes = draft.rugNotes.trim();
    const normalizedEntries = currentNotes
      ? currentNotes
          .split("\n")
          .map((entry) => entry.trim())
          .filter(Boolean)
      : [];

    if (normalizedEntries.includes(note)) {
      return;
    }

    const nextNotes = [...normalizedEntries, note].join("\n");
    updateDraftField("rugNotes", nextNotes);
  }

  function openSignatureCapture(target: "client" | "company") {
    showFeedback(
      target === "company"
        ? t("signature.dialogTitleCompany")
        : t("feedback.clientSignatureOpened")
    );

    if (signatureTarget === target) {
      setSignatureTarget(null);
      window.setTimeout(() => {
        setSignatureTarget(target);
      }, 120);
      return;
    }

    setSignatureTarget(target);
  }

  return (
    <>
      <PageIntro
        eyebrow={t("receipts.eyebrow")}
        title={t("receipts.title")}
        description={t("receipts.description")}
        actions={
          <div className="flex flex-wrap gap-3">
            <ActionButton label={t("receipts.save")} variant="primary" onClick={saveReceipt} />
            <LinkButton href={("/recibos/pdf" as Route)} label={t("receipts.viewPdf")} variant="secondary" />
            <LinkButton href={("/entrega" as Route)} label={t("receipts.openDelivery")} variant="ghost" />
          </div>
        }
      />

      <div className="workspace-panel min-w-0 grid gap-6 pb-28 md:pb-0">
        <SectionCard
          eyebrow={t("receipts.context")}
          title={t("receipts.linkedClient")}
          chip={t("receipts.current")}
          actions={
            selectedClient ? (
              <div className="flex flex-wrap gap-2">
                <ActionButton
                  label={t("clients.startNewReceipt")}
                  variant="secondary"
                  onClick={() => startNewReceiptForClient(selectedClient.id)}
                />
                <ActionButton
                  label={t("clients.repeatLastService")}
                  variant="ghost"
                  onClick={() => repeatLastServiceForClient(selectedClient.id)}
                />
                <ActionButton
                  label={t("clients.applyTemplate")}
                  variant="ghost"
                  onClick={() => applyClientTemplate(selectedClient.id)}
                />
                <ActionButton
                  label={t("clients.saveTemplate")}
                  variant="ghost"
                  onClick={saveClientTemplate}
                />
              </div>
            ) : null
          }
        >
          {selectedClient ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <SummaryItem
                label={t("clients.firstName")}
                value={formatClientName(selectedClient) || t("dashboard.clientNoName")}
              />
              <SummaryItem
                label={t("clients.phone")}
                value={selectedClient.clientPhone || t("dashboard.noPhone")}
              />
              <SummaryItem
                label={t("clients.email")}
                value={selectedClient.clientEmail || t("dashboard.noEmail")}
              />
              <SummaryItem
                label={t("clients.address")}
                value={selectedClient.clientAddress || t("clients.noAddress")}
              />
            </div>
          ) : (
            <EmptyState message={t("receipts.noClientMessage")} />
          )}
        </SectionCard>

        <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
          <div className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] 2xl:grid-cols-1">
              <SectionCard
                eyebrow={t("receipts.rugDetails")}
                title={t("receipts.rugTitle")}
                chip={t("receipts.serviceChip")}
              >
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

                <div className="mt-4 rounded-[20px] border border-[color:var(--line)] bg-white/72 p-3">
                  <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-[color:var(--brand)]">
                    Estado rapido
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {CONDITION_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => applyConditionPreset(preset)}
                        className="rounded-full border border-[color:var(--line)] bg-white px-3 py-1.5 text-xs font-bold text-[color:var(--ink)] transition hover:border-[color:var(--brand)]"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  <p className="mt-4 text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-[color:var(--brand)]">
                    Observaciones frecuentes
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {NOTE_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => appendRugNotePreset(preset)}
                        className="rounded-full border border-[color:var(--line)] bg-white px-3 py-1.5 text-xs font-bold text-[color:var(--ink)] transition hover:border-[color:var(--brand)]"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
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
                  <ActionButton
                    label={t("receipts.viewPdf")}
                    variant="ghost"
                    onClick={() => router.push("/recibos/pdf" as Route)}
                  />
                  <ActionButton
                    label={t("receipts.openDelivery")}
                    variant="ghost"
                    onClick={() => router.push("/entrega" as Route)}
                  />
                  <ActionButton
                    label={t("receipts.newBlank")}
                    variant="ghost"
                    onClick={() => prepareFreshReceipt()}
                  />
                  <ActionButton
                    label={t("clients.removeSelected")}
                    variant="danger"
                    onClick={deleteSelectedReceipt}
                    disabled={!selectedReceiptId}
                  />
                </div>

                <div className="mt-4 rounded-[22px] border border-[color:var(--line)] bg-white/72 px-4 py-3 text-sm leading-7 text-[color:var(--ink-soft)]">
                  {t("receipts.suggestedNumber")}: <strong className="text-[color:var(--ink)]">{nextReceiptSuggestion}</strong>
                </div>
              </SectionCard>
            </div>

            <SectionCard eyebrow={t("receipts.validationEyebrow")} title={t("receipts.validationTitle")}>
              <p className="max-w-[72ch] text-sm leading-7 text-[color:var(--ink-soft)]">
                {t("receipts.validationText")}
              </p>

              <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px]">
                <SignatureStatusCard
                  title={t("receipts.clientSignature")}
                  status={
                    draft.clientSignatureDataUrl
                      ? t("receipts.signaturePresent")
                      : t("receipts.signatureMissing")
                  }
                  imageDataUrl={draft.clientSignatureDataUrl}
                  fallbackText={clientSignerName}
                  primaryAction={{
                    label: t("receipts.captureClientSignature"),
                    onClick: () => openSignatureCapture("client")
                  }}
                  secondaryAction={{
                    label: t("receipts.clearClientSignature"),
                    onClick: () => updateDraftField("clientSignatureDataUrl", ""),
                    disabled: !draft.clientSignatureDataUrl
                  }}
                />

                <SignatureStatusCard
                  title={t("receipts.companySignature")}
                  status={
                    draft.companySignatureDataUrl
                      ? t("receipts.signaturePresent")
                      : t("receipts.signatureMissing")
                  }
                  imageDataUrl={draft.companySignatureDataUrl}
                  fallbackText={companySignerName}
                  primaryAction={{
                    label: t("receipts.captureCompanySignature"),
                    onClick: () => openSignatureCapture("company")
                  }}
                  secondaryAction={{
                    label: t("receipts.useSavedCompanySignature"),
                    onClick: () =>
                      updateDraftField(
                        "companySignatureDataUrl",
                        companyForm.companySignatureDataUrl || draft.companySignatureDataUrl
                      ),
                    disabled: !companyForm.companySignatureDataUrl
                  }}
                  tertiaryAction={{
                    label: t("receipts.clearCompanySignature"),
                    onClick: () => updateDraftField("companySignatureDataUrl", ""),
                    disabled: !draft.companySignatureDataUrl
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
          </div>

          <div className="hidden min-w-0 2xl:sticky 2xl:top-6 2xl:block 2xl:self-start">
            <SectionCard
              eyebrow={t("receipts.previewPageEyebrow")}
              title={t("receipts.previewPageTitle")}
              actions={
                <ActionButton
                  label={t("receipts.viewPdf")}
                  variant="secondary"
                  onClick={() => router.push("/recibos/pdf" as Route)}
                />
              }
            >
              <p className="mb-4 text-sm leading-7 text-[color:var(--ink-soft)]">
                {t("receipts.previewPageDescription")}
              </p>

              <div className="rounded-[24px] border border-[color:var(--line)] bg-[rgba(16,24,38,0.04)] p-2 md:p-3">
                <div className="mx-auto max-h-[74vh] overflow-auto rounded-[18px] border border-[color:var(--line)] bg-white">
                  <ReceiptPreview company={previewCompany} receipt={previewDraft} />
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

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
                      <p>
                        {t("receipts.pickup")}: {formatDate(receipt.pickupDate) || "--/--/----"}
                      </p>
                      <p>{receipt.rugSize || t("receipts.noMeasure")}</p>
                    </>
                  }
                  onOpen={() => loadReceipt(receipt.id)}
                  actions={[
                    {
                      label: t("receipts.viewPdf"),
                      variant: "secondary",
                      onClick: () => router.push(`/recibos/pdf?receiptId=${receipt.id}` as Route)
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
            <ActionButton label={t("receipts.mobileBarSave")} variant="primary" onClick={saveReceipt} />
            <ActionButton
              label={t("receipts.mobileBarPdf")}
              variant="secondary"
              onClick={() => router.push("/recibos/pdf" as Route)}
            />
            <ActionButton
              label={t("receipts.mobileBarSign")}
              variant="ghost"
              onClick={() => openSignatureCapture("client")}
            />
          </div>
        </div>
      </div>

      <SignatureCaptureDialog
        open={signatureTarget !== null}
        title={
          signatureTarget === "company"
            ? t("signature.dialogTitleCompany")
            : t("signature.dialogTitleClient")
        }
        description={t("signature.dialogDescription")}
        signerName={signatureTarget === "company" ? companySignerName : clientSignerName}
        initialValue={
          signatureTarget === "company"
            ? draft.companySignatureDataUrl || companyForm.companySignatureDataUrl
            : draft.clientSignatureDataUrl
        }
        onClose={() => setSignatureTarget(null)}
        onSave={(dataUrl) => {
          if (signatureTarget === "company") {
            updateDraftField("companySignatureDataUrl", dataUrl);
            return;
          }

          updateDraftField("clientSignatureDataUrl", dataUrl);
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
