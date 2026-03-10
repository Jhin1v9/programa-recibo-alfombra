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

const CLIENT_INPUTS = [
  { name: "clientFirstName", label: "Nome", placeholder: "Nome" },
  { name: "clientLastName", label: "Sobrenome", placeholder: "Sobrenome" },
  { name: "clientPhone", label: "Telefone", placeholder: "+34 600 000 000" },
  { name: "clientEmail", label: "Email", placeholder: "cliente@email.com", type: "email" },
  { name: "clientAddress", label: "Endereco", placeholder: "Rua, numero, cidade", full: true },
  { name: "clientCity", label: "Cidade", placeholder: "Cidade" },
  { name: "clientPostalCode", label: "Codigo postal", placeholder: "0000-000" }
] as const;

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
    importContacts
  } = useReceiptApp();

  const [clientSearch, setClientSearch] = useState("");
  const [importFiles, setImportFiles] = useState<File[]>([]);
  const [importStatus, setImportStatus] = useState("Aguardando importacao.");
  const [isImporting, setIsImporting] = useState(false);
  const deferredClientSearch = useDeferredValue(clientSearch);

  const filteredClients = [...clients]
    .sort((first, second) => +new Date(second.updatedAt || second.createdAt) - +new Date(first.updatedAt || first.createdAt))
    .filter((client) => matchesClientSearch(client, normalizeIdentityText(deferredClientSearch)));

  const importFilesLabel =
    importFiles.length === 0
      ? "Nenhum ficheiro selecionado."
      : importFiles.length === 1
        ? importFiles[0].name
        : `${importFiles.length} ficheiros selecionados`;

  async function handleImport() {
    if (!importFiles.length) {
      setImportStatus("Selecione pelo menos um ficheiro.");
      return;
    }

    setIsImporting(true);
    setImportStatus("Importando contatos...");
    await importContacts(importFiles);
    setImportFiles([]);
    setImportStatus("Importacao concluida.");
    setIsImporting(false);
  }

  return (
    <>
      <PageIntro
        eyebrow="Clientes"
        title="Agenda organizada e pronta para recorrencia"
        description="A pagina de clientes centraliza importacao, cadastro, pesquisa, modelos guardados e repeticao do ultimo servico."
      />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 grid gap-6">
          <SectionCard eyebrow="Importacao" title="Contatos do celular" chip="VCF / CSV / TSV">
            <p className="mb-4 text-sm leading-7 text-[color:var(--ink-soft)]">
              Suporta exportacoes de iPhone, Android, Google Contacts e tabelas comuns.
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
                  Selecionar ficheiros
                </label>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-[color:var(--ink)]">{importFilesLabel}</p>
                  <p className="mt-1 text-sm text-[color:var(--ink-soft)]">{importStatus}</p>
                </div>
                <ActionButton
                  label={isImporting ? "Importando..." : "Importar contatos"}
                  variant="secondary"
                  onClick={handleImport}
                  disabled={isImporting}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Edicao"
            title="Cliente selecionado"
            actions={
              <div className="flex flex-wrap gap-3">
                <ActionButton label="Guardar cliente" variant="primary" onClick={saveClient} />
                <ActionButton label="Limpar cliente" variant="ghost" onClick={clearClientFields} />
              </div>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              {CLIENT_INPUTS.map((field) => (
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
                label="Novo recibo deste cliente"
                variant="primary"
                onClick={() => startNewReceiptForClient()}
                disabled={!selectedClientId}
              />
              <ActionButton
                label="Repetir ultimo servico"
                variant="secondary"
                onClick={() => repeatLastServiceForClient()}
                disabled={!selectedClientId}
              />
              <ActionButton
                label="Guardar modelo do cliente"
                variant="ghost"
                onClick={saveClientTemplate}
                disabled={!selectedClientId}
              />
              <ActionButton
                label="Aplicar modelo guardado"
                variant="ghost"
                onClick={() => applyClientTemplate()}
                disabled={!selectedClientId}
              />
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Agenda"
            title="Clientes guardados"
            actions={
              <ActionButton
                label="Remover selecionado"
                variant="danger"
                onClick={deleteSelectedClient}
                disabled={!selectedClientId}
              />
            }
          >
            <EditableField
              config={{
                name: "clientSearch",
                label: "Pesquisar cliente",
                placeholder: "Nome, telefone, email ou cidade",
                type: "search",
                full: true
              }}
              value={clientSearch}
              onChange={setClientSearch}
            />

            <div className="mt-4 flex flex-col gap-3">
              {filteredClients.length === 0 ? (
                <EmptyState message="Nenhum cliente guardado para este filtro." />
              ) : (
                filteredClients.map((client) => {
                  const receiptCount = countReceiptsForClient(receipts, client);
                  const latestReceipt = findLatestReceiptForClient(receipts, client);

                  return (
                    <RegistryCard
                      key={client.id}
                      active={client.id === selectedClientId}
                      title={formatClientName(client) || "Cliente sem nome"}
                      chips={[
                        client.clientCity,
                        hasAnyField(client.servicePreset) ? "Modelo" : "",
                        receiptCount ? `${receiptCount} recibos` : ""
                      ].filter(Boolean)}
                      body={
                        <>
                          <p>
                            {client.clientPhone || "Sem telefone"}
                            {client.clientEmail ? ` / ${client.clientEmail}` : ""}
                          </p>
                          <p>{client.clientAddress || "Sem endereco"}</p>
                          <p>
                            Ultimo servico:{" "}
                            {latestReceipt ? formatDate(latestReceipt.pickupDate) : "Sem historico"}
                          </p>
                        </>
                      }
                      onOpen={() => loadClient(client.id)}
                      actions={[
                        {
                          label: "Usar",
                          variant: "primary",
                          onClick: () => loadClient(client.id)
                        },
                        {
                          label: "Novo recibo",
                          variant: "ghost",
                          onClick: () => startNewReceiptForClient(client.id)
                        },
                        {
                          label: "Repetir",
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

        <SectionCard eyebrow="Resumo" title="Cliente atual" chip="Ativo">
          <div className="space-y-4 text-sm leading-7 text-[color:var(--ink-soft)]">
            {selectedClient ? (
              <>
                <SummaryItem label="Nome" value={formatClientName(selectedClient) || "Cliente sem nome"} />
                <SummaryItem label="Telefone" value={selectedClient.clientPhone || "Sem telefone"} />
                <SummaryItem label="Email" value={selectedClient.clientEmail || "Sem email"} />
                <SummaryItem label="Endereco" value={selectedClient.clientAddress || "Sem endereco"} />
                <SummaryItem label="Cidade" value={selectedClient.clientCity || "Sem cidade"} />
                <SummaryItem
                  label="Modelo"
                  value={hasAnyField(selectedClient.servicePreset) ? "Guardado" : "Sem modelo"}
                />
              </>
            ) : (
              <EmptyState message="Nenhum cliente selecionado." />
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
