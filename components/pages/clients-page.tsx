"use client";

import { useDeferredValue, useState } from "react";
import { useRouter } from "next/navigation";

import { useReceiptApp } from "@/components/receipt-app-provider";
import {
  ActionButton,
  EditableField,
  EmptyState,
  PageIntro,
  SectionCard,
  buttonClasses
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

const CLIENTS_PER_PAGE = 8;

export function ClientsPage() {
  const router = useRouter();
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
  const [clientPage, setClientPage] = useState(1);
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
  const totalClientPages = Math.max(1, Math.ceil(filteredClients.length / CLIENTS_PER_PAGE));
  const currentClientPage = Math.min(clientPage, totalClientPages);
  const pageStartIndex = (currentClientPage - 1) * CLIENTS_PER_PAGE;
  const pageEndIndex = Math.min(pageStartIndex + CLIENTS_PER_PAGE, filteredClients.length);
  const visibleClients = filteredClients.slice(pageStartIndex, pageEndIndex);

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

  function handleUseClient(clientId: string) {
    startNewReceiptForClient(clientId);
    router.push("/recibos");
  }

  return (
    <>
      <PageIntro
        eyebrow={t("clients.eyebrow")}
        title={t("clients.title")}
        description={t("clients.description")}
        actions={
          <>
            <div className="rounded-full border border-[color:var(--line)] bg-[rgba(15,23,42,0.04)] px-4 py-3 text-left">
              <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[color:var(--brand)]">
                {t("clients.currentClient")}
              </p>
              <p className="mt-1 text-sm font-semibold text-[color:var(--ink)]">
                {selectedClient ? formatClientName(selectedClient) || t("dashboard.clientNoName") : t("clients.noSelected")}
              </p>
            </div>
            <ActionButton label={t("clients.saveClient")} variant="primary" onClick={saveClient} />
            <ActionButton label={t("clients.clearClient")} variant="ghost" onClick={clearClientFields} />
          </>
        }
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
              onChange={(value) => {
                setClientSearch(value);
                setClientPage(1);
              }}
            />

            <div className="mt-4 rounded-[24px] border border-[color:var(--line)] bg-[rgba(15,23,42,0.03)] p-3 md:p-4">
              <div className="flex flex-col gap-3 border-b border-[color:var(--line)] pb-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                  <CompactInfoPill
                    label={t("clients.totalSaved")}
                    value={t("clients.totalSavedCount", { count: clients.length })}
                  />
                  <CompactInfoPill
                    label={t("clients.filtered")}
                    value={t("clients.filteredCount", { count: filteredClients.length })}
                  />
                  <CompactInfoPill
                    label={t("clients.pageLabel")}
                    value={t("clients.pageOf", { page: currentClientPage, total: totalClientPages })}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {clientSearch ? (
                    <button
                      type="button"
                      className={buttonClasses("ghost")}
                      onClick={() => {
                        setClientSearch("");
                        setClientPage(1);
                      }}
                    >
                      {t("clients.clearSearch")}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className={buttonClasses("ghost")}
                    onClick={() => setClientPage((page) => Math.max(1, page - 1))}
                    disabled={currentClientPage <= 1}
                  >
                    {t("clients.previousPage")}
                  </button>
                  <button
                    type="button"
                    className={buttonClasses("ghost")}
                    onClick={() => setClientPage((page) => Math.min(totalClientPages, page + 1))}
                    disabled={currentClientPage >= totalClientPages}
                  >
                    {t("clients.nextPage")}
                  </button>
                </div>
              </div>

              <div className="mt-3">
                {filteredClients.length === 0 ? (
                  <EmptyState message={t("clients.emptyFilter")} />
                ) : (
                  <>
                    <p className="mb-3 text-sm leading-6 text-[color:var(--ink-soft)]">
                      {t("clients.showingRange", {
                        from: pageStartIndex + 1,
                        to: pageEndIndex,
                        total: filteredClients.length
                      })}
                    </p>

                    <div
                      className="client-registry-scroll space-y-3 pr-1"
                      style={{
                        maxHeight: "min(42rem, 72vh)",
                        overflowY: "auto",
                        overscrollBehavior: "contain",
                        scrollbarGutter: "stable"
                      }}
                    >
                      {visibleClients.map((client) => {
                        const receiptCount = countReceiptsForClient(receipts, client);
                        const latestReceipt = findLatestReceiptForClient(receipts, client);

                        return (
                          <ClientRegistryRow
                            key={client.id}
                            active={client.id === selectedClientId}
                            title={formatClientName(client) || t("dashboard.clientNoName")}
                            chips={[
                              client.clientCity,
                              hasAnyField(client.servicePreset) ? t("clients.templateChip") : "",
                              receiptCount ? t("clients.receiptsCount", { count: receiptCount }) : ""
                            ].filter(Boolean)}
                            phone={client.clientPhone || t("dashboard.noPhone")}
                            email={client.clientEmail}
                            address={client.clientAddress || t("clients.noAddress")}
                            latestService={
                              latestReceipt
                                ? formatDate(latestReceipt.pickupDate)
                                : t("clients.noHistory")
                            }
                            onOpen={() => loadClient(client.id)}
                            onUse={() => handleUseClient(client.id)}
                            onNewReceipt={() => startNewReceiptForClient(client.id)}
                            onRepeat={() => repeatLastServiceForClient(client.id)}
                            labels={{
                              use: t("clients.use"),
                              newReceipt: t("clients.newReceiptShort"),
                              repeat: t("clients.repeat"),
                              lastService: t("clients.lastService")
                            }}
                          />
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
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

function CompactInfoPill({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-full border border-[color:var(--line)] bg-white px-3 py-2">
      <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[color:var(--brand)]">
        {label}
      </span>
      <strong className="ml-2 text-sm text-[color:var(--ink)]">{value}</strong>
    </div>
  );
}

function ClientRegistryRow({
  active,
  title,
  chips,
  phone,
  email,
  address,
  latestService,
  onOpen,
  onUse,
  onNewReceipt,
  onRepeat,
  labels
}: Readonly<{
  active: boolean;
  title: string;
  chips: string[];
  phone: string;
  email?: string;
  address: string;
  latestService: string;
  onOpen: () => void;
  onUse: () => void;
  onNewReceipt: () => void;
  onRepeat: () => void;
  labels: {
    use: string;
    newReceipt: string;
    repeat: string;
    lastService: string;
  };
}>) {
  return (
    <article
      className={`cursor-pointer rounded-[22px] border p-4 transition ${
        active
          ? "border-[rgba(191,95,52,0.42)] bg-[linear-gradient(135deg,rgba(255,247,241,0.98),rgba(255,255,255,0.98))] shadow-[0_16px_30px_rgba(191,95,52,0.08)]"
          : "border-[color:var(--line)] bg-white hover:border-[rgba(15,23,42,0.14)]"
      }`}
      onClick={onOpen}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
        <div className="min-w-0">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h3 className="truncate text-base font-extrabold text-[color:var(--ink)]">{title}</h3>
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[color:var(--accent-soft)] bg-[color:var(--accent-soft)] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[color:var(--accent)]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 grid gap-2 text-sm leading-6 text-[color:var(--ink-soft)] lg:grid-cols-2">
            <p className="truncate">{email ? `${phone} / ${email}` : phone}</p>
            <p className="truncate">
              {labels.lastService}: {latestService}
            </p>
            <p className="lg:col-span-2">{address}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 xl:max-w-[280px] xl:justify-end">
          <button
            type="button"
            className={buttonClasses("primary")}
            onClick={(event) => {
              event.stopPropagation();
              onUse();
            }}
          >
            {labels.use}
          </button>
          <button
            type="button"
            className={buttonClasses("ghost")}
            onClick={(event) => {
              event.stopPropagation();
              onNewReceipt();
            }}
          >
            {labels.newReceipt}
          </button>
          <button
            type="button"
            className={buttonClasses("secondary")}
            onClick={(event) => {
              event.stopPropagation();
              onRepeat();
            }}
          >
            {labels.repeat}
          </button>
        </div>
      </div>
    </article>
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
