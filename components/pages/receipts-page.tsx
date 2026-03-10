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

const RUG_INPUTS = [
  { name: "rugType", label: "Tipo", placeholder: "Persa, moderno, la, etc." },
  { name: "rugSize", label: "Tamanho", placeholder: "Ex.: 200 x 300 cm" },
  { name: "rugColor", label: "Cor / descricao", placeholder: "Bege, azul, estampado..." },
  {
    name: "rugCondition",
    label: "Estado ao recolher",
    placeholder: "Bom estado, manchas, odor, etc."
  },
  {
    name: "rugNotes",
    label: "Observacoes do artigo",
    placeholder: "Franja solta, marcas, pontos de atencao...",
    multiline: true,
    rows: 4,
    full: true
  }
] as const;

const SERVICE_INPUTS = [
  { name: "receiptNumber", label: "Recibo n.o", placeholder: "Automatico" },
  { name: "pickupDate", label: "Data de recolha", type: "date" },
  { name: "deliveryDate", label: "Entrega prevista", type: "date" },
  { name: "estimatedValue", label: "Valor estimado", placeholder: "Ex.: 85,00 EUR" },
  {
    name: "serviceNotes",
    label: "Observacoes do servico",
    placeholder: "Instrucoes adicionais, prazo, detalhes de contacto...",
    multiline: true,
    rows: 5,
    full: true
  }
] as const;

export function ReceiptsPage() {
  const {
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
    duplicateReceipt
  } = useReceiptApp();

  const sortedReceipts = [...receipts].sort(
    (first, second) => +new Date(second.updatedAt) - +new Date(first.updatedAt)
  );

  return (
    <>
      <PageIntro
        eyebrow="Recibos"
        title="Edicao do servico, historico e preview A4"
        description="A pagina de recibos ficou dedicada ao trabalho operacional: artigo, datas, valor, duplicacao e impressao."
        actions={
          <div className="flex flex-wrap gap-3">
            <ActionButton label="Guardar recibo" variant="primary" onClick={saveReceipt} />
            <ActionButton label="Imprimir / PDF" variant="secondary" onClick={() => window.print()} />
          </div>
        }
      />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="workspace-panel min-w-0 grid gap-6">
          <SectionCard eyebrow="Contexto" title="Cliente ligado ao recibo" chip="Atual">
            {selectedClient ? (
              <div className="grid gap-3 md:grid-cols-2">
                <SummaryItem label="Nome" value={formatClientName(selectedClient) || "Cliente sem nome"} />
                <SummaryItem label="Telefone" value={selectedClient.clientPhone || "Sem telefone"} />
                <SummaryItem label="Email" value={selectedClient.clientEmail || "Sem email"} />
                <SummaryItem label="Endereco" value={selectedClient.clientAddress || "Sem endereco"} />
              </div>
            ) : (
              <EmptyState message="Nenhum cliente selecionado. Abra um cliente na pagina de clientes ou carregue um recibo do historico." />
            )}
          </SectionCard>

          <SectionCard eyebrow="Detalhes do artigo" title="Alfombra / tapete" chip="Servico">
            <div className="grid gap-4 md:grid-cols-2">
              {RUG_INPUTS.map((field) => (
                <EditableField
                  key={field.name}
                  config={field}
                  value={previewDraft[field.name as keyof ServicePreset]}
                  onChange={(value) => updateDraftField(field.name as keyof ReceiptDraft, value)}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard eyebrow="Controlo interno" title="Servico e recibo">
            <div className="grid gap-4 md:grid-cols-2">
              {SERVICE_INPUTS.map((field) => (
                <EditableField
                  key={field.name}
                  config={field}
                  value={previewDraft[field.name as keyof ReceiptDraft]}
                  onChange={(value) => updateDraftField(field.name as keyof ReceiptDraft, value)}
                />
              ))}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <ActionButton label="Guardar recibo" variant="primary" onClick={saveReceipt} />
              <ActionButton label="Novo numero" variant="secondary" onClick={assignNextReceiptNumber} />
              <ActionButton label="Novo recibo em branco" variant="ghost" onClick={() => prepareFreshReceipt()} />
              <ActionButton
                label="Remover selecionado"
                variant="danger"
                onClick={deleteSelectedReceipt}
                disabled={!selectedReceiptId}
              />
            </div>

            <div className="mt-4 rounded-[22px] border border-[color:var(--line)] bg-white/72 px-4 py-3 text-sm leading-7 text-[color:var(--ink-soft)]">
              Numero sugerido neste momento: <strong className="text-[color:var(--ink)]">{nextReceiptSuggestion}</strong>
            </div>
          </SectionCard>

          <SectionCard eyebrow="Historico" title="Recibos guardados">
            <div className="flex flex-col gap-3">
              {sortedReceipts.length === 0 ? (
                <EmptyState message="Nenhum recibo guardado ainda." />
              ) : (
                sortedReceipts.map((receipt) => (
                  <RegistryCard
                    key={receipt.id}
                    active={receipt.id === selectedReceiptId}
                    title={receipt.receiptNumber || "Sem numero"}
                    chips={[receipt.rugType, receipt.estimatedValue].filter(Boolean)}
                    body={
                      <>
                        <p>{formatClientName(receipt) || "Cliente nao definido"}</p>
                        <p>Recolha: {formatDate(receipt.pickupDate) || "--/--/----"}</p>
                        <p>{receipt.rugSize || "Sem medida definida"}</p>
                      </>
                    }
                    onOpen={() => loadReceipt(receipt.id)}
                    actions={[
                      {
                        label: "Abrir",
                        variant: "primary",
                        onClick: () => loadReceipt(receipt.id)
                      },
                      {
                        label: "Duplicar",
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
            Pagina preparada em formato A4 para imprimir ou guardar como PDF.
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
