"use client";

import { useDeferredValue, useState } from "react";

import { useReceiptApp } from "@/components/receipt-app-provider";
import {
  ActionButton,
  EditableField,
  EmptyState,
  PageIntro,
  RegistryCard,
  SectionCard
} from "@/components/workspace-ui";
import {
  countReceiptsForClient,
  findLatestReceiptForClient,
  formatClientName,
  formatDate,
  hasAnyField,
  matchesClientSearch,
  normalizeIdentityText
} from "@/lib/receipt-core";
import type { ClientFields, ReceiptDraft } from "@/lib/types";

export function ClientsPage() {
  const {
    clients,
    receipts,
    draft,
    selectedClient,
    selectedClientId,
    updateDraftField,
    saveClient,
    deleteSelectedClient,
    clearClientFields,
    startNewReceiptForClient,
    repeatLastServiceForClient,
    saveClientTemplate,
    applyClientTemplate,
    loadClient,
    importContacts,
    t
  } = useReceiptApp();

  const [clientSearch, setClientSearch] = useState("");
  const [importFiles, setImportFiles] = useState<File[]>([]);
  const [importStatusKey, setImportStatusKey] = useState<
    "clients.importWaiting" | "clients.importPick" | "clients.importing" | "clients.importDone"
  >("clients.importWaiting");
  const [isImporting, setIsImporting] = useState(false);
  const deferredClientSearch = useDeferredValue(clientSearch);
  const clientInputs = [
    { name: "clientFirstName", label: t("clients.firstName"), placeholder: t("clients.firstName") },
    { name: "clientLastName", label: t("clients.lastName"), placeholder: t("clients.lastName") },
    { name: "clientPhone", label: t("clients.phone"), placeholder: "+34 600 000 000" },
    {
      name: "clientEmail",
      label: t("clients.email"),
      placeholder: "cliente@email.com",
      type: "email" as const
    },
    {
      name: "clientAddress",
      label: t("clients.address"),
      placeholder: "Calle, numero, ciudad",
      full: true
    },
    { name: "clientCity", label: t("clients.city"), placeholder: t("clients.city") },
    { name: "clientPostalCode", label: t("clients.postalCode"), placeholder: "08001" }
  ] as const;

  const filteredClients = [...clients]
    .sort((first, second) => +new Date(second.updatedAt || second.createdAt) - +new Date(first.updatedAt || first.createdAt))
    .filter((client) => matchesClientSearch(client, normalizeIdentityText(deferredClientSearch)));

  const importFilesLabel =
    importFiles.length === 0
      ? t("clients.noFiles")
      : importFiles.length === 1
        ? importFiles[0].name
        : t("clients.filesSelected", { count: importFiles.length });

  async function handleImport() {
    if (!importFiles.length) {
      setImportStatusKey("clients.importPick");
      return;
    }

    setIsImporting(true);
    setImportStatusKey("clients.importing");
    await importContacts(importFiles);
    setImportFiles([]);
    setImportStatusKey("clients.importDone");
    setIsImporting(false);
  }

  return (
    <>
      <PageIntro
        eyebrow={t("clients.eyebrow")}
        title={t("clients.title")}
        description={t("clients.description")}
      />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 grid gap-6">
          <SectionCard eyebrow={t("clients.import")} title={t("clients.importTitle")} chip={t("clients.importChip")}>
            <p className="mb-4 text-sm leading-7 text-[color:var(--ink-soft)]">
              {t("clients.importText")}
            </p>

            <div className="rounded-[24px] border border-dashed border-[color:var(--line-strong)] bg-[rgba(191,95,52,0.05)] p-4">
              <div className="grid gap-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
                <input
                  className="sr-only"
                  id="client-import"
                  type="file"
                  multiple
                  accept=".vcf,.csv,.tsv,.txt,text/vcard,text/csv,text/tab-separated-values"
                  onChange={(event) => setImportFiles(Array.from(event.target.files || []))}
                />
                <label
                  htmlFor="client-import"
                  className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[color:var(--ink)] px-4 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5"
                >
                  {t("clients.selectFiles")}
                </label>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-[color:var(--ink)]">{importFilesLabel}</p>
                  <p className="mt-1 text-sm text-[color:var(--ink-soft)]">{t(importStatusKey)}</p>
                </div>
                <ActionButton
                  label={isImporting ? t("clients.importingAction") : t("clients.importAction")}
                  variant="secondary"
                  onClick={handleImport}
                  disabled={isImporting}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow={t("clients.edit")}
            title={t("clients.selectedTitle")}
            actions={
              <div className="flex flex-wrap gap-3">
                <ActionButton label={t("clients.saveClient")} variant="primary" onClick={saveClient} />
                <ActionButton label={t("clients.clearClient")} variant="ghost" onClick={clearClientFields} />
              </div>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              {clientInputs.map((field) => (
                <EditableField
                  key={field.name}
                  config={field}
                  value={draft[field.name as keyof ClientFields]}
                  onChange={(value) => updateDraftField(field.name as keyof ReceiptDraft, value)}
                />
              ))}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <ActionButton
                label={t("clients.newReceipt")}
                variant="primary"
                onClick={() => startNewReceiptForClient()}
                disabled={!selectedClientId}
              />
              <ActionButton
                label={t("clients.repeatService")}
                variant="secondary"
                onClick={() => repeatLastServiceForClient()}
                disabled={!selectedClientId}
              />
              <ActionButton
                label={t("clients.saveTemplate")}
                variant="ghost"
                onClick={saveClientTemplate}
                disabled={!selectedClientId}
              />
              <ActionButton
                label={t("clients.applyTemplate")}
                variant="ghost"
                onClick={() => applyClientTemplate()}
                disabled={!selectedClientId}
              />
            </div>
          </SectionCard>

          <SectionCard
            eyebrow={t("clients.registry")}
            title={t("clients.savedTitle")}
            actions={
              <ActionButton
                label={t("clients.removeSelected")}
                variant="danger"
                onClick={deleteSelectedClient}
                disabled={!selectedClientId}
              />
            }
          >
            <EditableField
              config={{
                name: "clientSearch",
                label: t("clients.search"),
                placeholder: t("clients.searchPlaceholder"),
                type: "search",
                full: true
              }}
              value={clientSearch}
              onChange={setClientSearch}
            />

            <div className="mt-4 flex flex-col gap-3">
              {filteredClients.length === 0 ? (
                <EmptyState message={t("clients.emptyFilter")} />
              ) : (
                filteredClients.map((client) => {
                  const receiptCount = countReceiptsForClient(receipts, client);
                  const latestReceipt = findLatestReceiptForClient(receipts, client);

                  return (
                    <RegistryCard
                      key={client.id}
                      active={client.id === selectedClientId}
                      title={formatClientName(client) || t("dashboard.clientNoName")}
                      chips={[
                        client.clientCity,
                        hasAnyField(client.servicePreset) ? t("clients.templateChip") : "",
                        receiptCount ? t("clients.receiptsCount", { count: receiptCount }) : ""
                      ].filter(Boolean)}
                      body={
                        <>
                          <p>
                            {client.clientPhone || t("dashboard.noPhone")}
                            {client.clientEmail ? ` / ${client.clientEmail}` : ""}
                          </p>
                          <p>{client.clientAddress || t("clients.noAddress")}</p>
                          <p>
                            {t("clients.lastService")}:{" "}
                            {latestReceipt ? formatDate(latestReceipt.pickupDate) : t("clients.noHistory")}
                          </p>
                        </>
                      }
                      onOpen={() => loadClient(client.id)}
                      actions={[
                        {
                          label: t("clients.use"),
                          variant: "primary",
                          onClick: () => loadClient(client.id)
                        },
                        {
                          label: t("clients.newReceipt"),
                          variant: "ghost",
                          onClick: () => startNewReceiptForClient(client.id)
                        },
                        {
                          label: t("clients.repeat"),
                          variant: "secondary",
                          onClick: () => repeatLastServiceForClient(client.id)
                        }
                      ]}
                    />
                  );
                })
              )}
            </div>
          </SectionCard>
        </div>

        <SectionCard eyebrow={t("clients.summary")} title={t("clients.currentClient")} chip={t("clients.active")}>
          <div className="space-y-4 text-sm leading-7 text-[color:var(--ink-soft)]">
            {selectedClient ? (
              <>
                <SummaryItem label={t("clients.firstName")} value={formatClientName(selectedClient) || t("dashboard.clientNoName")} />
                <SummaryItem label={t("clients.phone")} value={selectedClient.clientPhone || t("dashboard.noPhone")} />
                <SummaryItem label={t("clients.email")} value={selectedClient.clientEmail || t("dashboard.noEmail")} />
                <SummaryItem label={t("clients.address")} value={selectedClient.clientAddress || t("clients.noAddress")} />
                <SummaryItem label={t("clients.city")} value={selectedClient.clientCity || t("dashboard.noCity")} />
                <SummaryItem
                  label={t("clients.templateChip")}
                  value={hasAnyField(selectedClient.servicePreset) ? t("clients.modelSaved") : t("clients.noModel")}
                />
              </>
            ) : (
              <EmptyState message={t("clients.noSelected")} />
            )}
          </div>
        </SectionCard>
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
