"use client";

import type { Route } from "next";

import { useReceiptApp } from "@/components/receipt-app-provider";
import {
  ActionButton,
  LinkButton,
  PageIntro,
  SectionCard,
  StatCard
} from "@/components/workspace-ui";
import { formatClientName, formatDate } from "@/lib/receipt-core";

export function DashboardPage() {
  const {
    clients,
    receipts,
    selectionLabel,
    nextReceiptSuggestion,
    selectedClient,
    selectedReceipt,
    prepareFreshReceipt,
    assignNextReceiptNumber
  } = useReceiptApp();

  const latestClients = [...clients]
    .sort((first, second) => +new Date(second.updatedAt || second.createdAt) - +new Date(first.updatedAt || first.createdAt))
    .slice(0, 3);
  const latestReceipts = [...receipts]
    .sort((first, second) => +new Date(second.updatedAt) - +new Date(first.updatedAt))
    .slice(0, 3);

  return (
    <>
      <PageIntro
        eyebrow="Painel principal"
        title="Centro de contexto e proximas acoes"
        description="A home fica leve: mostra onde voce esta, o que falta fazer e os atalhos principais. A operacao detalhada fica nas paginas especificas."
        actions={
          <>
            <LinkButton href="/clientes" label="Gerir clientes" variant="secondary" />
            <LinkButton href="/recibos" label="Abrir recibos" variant="primary" />
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="clientes guardados" value={String(clients.length)} />
        <StatCard label="recibos guardados" value={String(receipts.length)} />
        <StatCard label="estado atual" value={selectionLabel} />
        <StatCard label="proximo numero" value={nextReceiptSuggestion} />
      </section>

      <div className="grid gap-6">
        <SectionCard
          eyebrow="Acesso rapido"
          title="Fluxos principais"
          actions={
            <div className="flex flex-wrap gap-3">
              <ActionButton label="Novo recibo em branco" variant="primary" onClick={() => prepareFreshReceipt()} />
              <ActionButton label="Sugerir novo numero" variant="ghost" onClick={assignNextReceiptNumber} />
            </div>
          }
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <ShortcutCard
              title="Empresa"
              text="Atualiza identidade, contacto e dados usados em novos recibos."
              href="/empresa"
              label="Abrir empresa"
            />
            <ShortcutCard
              title="Clientes"
              text="Importa agenda, edita clientes e prepara repeticoes por historico."
              href="/clientes"
              label="Abrir clientes"
            />
            <ShortcutCard
              title="Recibos"
              text="Gere o servico, o numero e o PDF sem sair do fluxo operacional."
              href="/recibos"
              label="Abrir recibos"
            />
          </div>
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <SectionCard eyebrow="Contexto" title="Selecao atual">
            <div className="grid gap-4 lg:grid-cols-2">
              <SummaryCard
                title="Cliente ativo"
                lines={
                  selectedClient
                    ? [
                        formatClientName(selectedClient) || "Cliente sem nome",
                        selectedClient.clientPhone || "Sem telefone",
                        selectedClient.clientEmail || "Sem email"
                      ]
                    : ["Nenhum cliente selecionado", "Escolha um cliente na pagina de clientes."]
                }
              />
              <SummaryCard
                title="Recibo ativo"
                lines={
                  selectedReceipt
                    ? [
                        selectedReceipt.receiptNumber || "Sem numero",
                        formatDate(selectedReceipt.pickupDate) || "--/--/----",
                        selectedReceipt.rugType || "Tipo nao definido"
                      ]
                    : ["Nenhum recibo selecionado", "Abra um recibo ou crie um novo na pagina de recibos."]
                }
              />
            </div>
          </SectionCard>

          <SectionCard eyebrow="Utilidade" title="O que fazer agora">
            <div className="grid gap-3">
              <UtilityRow
                title="Se ainda nao configurou a marca"
                text="Passe em Empresa para guardar nome, contacto e responsavel usados em todos os recibos."
              />
              <UtilityRow
                title="Se o cliente e novo"
                text="Importe a agenda ou cadastre manualmente em Clientes antes de abrir um recibo."
              />
              <UtilityRow
                title="Se o servico e recorrente"
                text="Use modelos e repeticao do ultimo servico para evitar preencher tudo novamente."
              />
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard eyebrow="Atividade recente" title="Ultimos clientes">
            <div className="grid gap-3">
              {latestClients.length === 0 ? (
                <SummaryCard title="Agenda vazia" lines={["Ainda nao ha clientes guardados."]} />
              ) : (
                latestClients.map((client) => (
                  <SummaryCard
                    key={client.id}
                    title={formatClientName(client) || "Cliente sem nome"}
                    lines={[
                      client.clientPhone || "Sem telefone",
                      client.clientCity || "Sem cidade"
                    ]}
                  />
                ))
              )}
            </div>
          </SectionCard>

          <SectionCard eyebrow="Atividade recente" title="Ultimos recibos">
            <div className="grid gap-3">
              {latestReceipts.length === 0 ? (
                <SummaryCard title="Historico vazio" lines={["Ainda nao ha recibos guardados."]} />
              ) : (
                latestReceipts.map((receipt) => (
                  <SummaryCard
                    key={receipt.id}
                    title={receipt.receiptNumber || "Sem numero"}
                    lines={[
                      formatClientName(receipt) || "Cliente nao definido",
                      formatDate(receipt.pickupDate) || "--/--/----"
                    ]}
                  />
                ))
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}

function ShortcutCard({
  title,
  text,
  href,
  label
}: Readonly<{
  title: string;
  text: string;
  href: Route;
  label: string;
}>) {
  return (
    <div className="rounded-[24px] border border-[color:var(--line)] bg-white/72 p-5">
      <h3 className="text-xl leading-none">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">{text}</p>
      <div className="mt-4">
        <LinkButton href={href} label={label} variant="ghost" />
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  lines
}: Readonly<{
  title: string;
  lines: string[];
}>) {
  return (
    <div className="rounded-[24px] border border-[color:var(--line)] bg-white/72 p-5">
      <h3 className="text-lg leading-none">{title}</h3>
      <div className="mt-4 space-y-1 text-sm leading-7 text-[color:var(--ink-soft)]">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function UtilityRow({
  title,
  text
}: Readonly<{
  title: string;
  text: string;
}>) {
  return (
    <div className="rounded-[24px] border border-[color:var(--line)] bg-white/72 p-5">
      <h3 className="text-lg leading-none">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">{text}</p>
    </div>
  );
}
