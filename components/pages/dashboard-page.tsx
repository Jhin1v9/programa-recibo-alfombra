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
    assignNextReceiptNumber,
    t
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
        eyebrow={t("dashboard.eyebrow")}
        title={t("dashboard.title")}
        description={t("dashboard.description")}
        actions={
          <>
            <LinkButton href="/clientes" label={t("dashboard.manageClients")} variant="secondary" />
            <LinkButton href="/recibos" label={t("dashboard.openReceipts")} variant="primary" />
            <LinkButton href={"/entrega" as Route} label={t("dashboard.openDelivery")} variant="ghost" />
          </>
        }
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t("dashboard.clientsSaved")} value={String(clients.length)} />
        <StatCard label={t("dashboard.receiptsSaved")} value={String(receipts.length)} />
        <StatCard label={t("dashboard.currentState")} value={selectionLabel} />
        <StatCard label={t("dashboard.nextNumber")} value={nextReceiptSuggestion} />
      </section>

      <div className="grid gap-6">
        <SectionCard
          eyebrow={t("dashboard.quickAccess")}
          title={t("dashboard.mainFlows")}
          actions={
            <div className="flex flex-wrap gap-3">
              <ActionButton
                label={t("dashboard.newBlankReceipt")}
                variant="primary"
                onClick={() => prepareFreshReceipt()}
              />
              <ActionButton
                label={t("dashboard.suggestNumber")}
                variant="ghost"
                onClick={assignNextReceiptNumber}
              />
            </div>
          }
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <ShortcutCard
              title={t("dashboard.companyTitle")}
              text={t("dashboard.companyText")}
              href="/empresa"
              label={t("dashboard.companyAction")}
            />
            <ShortcutCard
              title={t("dashboard.clientsTitle")}
              text={t("dashboard.clientsText")}
              href="/clientes"
              label={t("dashboard.clientsAction")}
            />
            <ShortcutCard
              title={t("dashboard.receiptsTitle")}
              text={t("dashboard.receiptsText")}
              href="/recibos"
              label={t("dashboard.receiptsAction")}
            />
            <ShortcutCard
              title={t("dashboard.deliveryTitle")}
              text={t("dashboard.deliveryText")}
              href={"/entrega" as Route}
              label={t("dashboard.deliveryAction")}
            />
          </div>
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <SectionCard eyebrow={t("dashboard.context")} title={t("dashboard.currentSelection")}>
            <div className="grid gap-4 lg:grid-cols-2">
              <SummaryCard
                title={t("dashboard.activeClient")}
                lines={
                  selectedClient
                    ? [
                        formatClientName(selectedClient) || t("dashboard.clientNoName"),
                        selectedClient.clientPhone || t("dashboard.noPhone"),
                        selectedClient.clientEmail || t("dashboard.noEmail")
                      ]
                    : [t("dashboard.noClientSelected"), t("dashboard.pickClient")]
                }
              />
              <SummaryCard
                title={t("dashboard.activeReceipt")}
                lines={
                  selectedReceipt
                    ? [
                        selectedReceipt.receiptNumber || t("dashboard.noNumber"),
                        formatDate(selectedReceipt.pickupDate) || "--/--/----",
                        selectedReceipt.rugType || t("dashboard.noType")
                      ]
                    : [t("dashboard.noReceiptSelected"), t("dashboard.pickReceipt")]
                }
              />
            </div>
          </SectionCard>

          <section className="hidden xl:block">
            <SectionCard eyebrow={t("dashboard.utility")} title={t("dashboard.whatNext")}>
              <div className="grid gap-3">
                <UtilityRow
                  title={t("dashboard.setupBrand")}
                  text={t("dashboard.setupBrandText")}
                />
                <UtilityRow
                  title={t("dashboard.newClient")}
                  text={t("dashboard.newClientText")}
                />
                <UtilityRow
                  title={t("dashboard.recurringService")}
                  text={t("dashboard.recurringServiceText")}
                />
              </div>
            </SectionCard>
          </section>
        </div>

        <div className="hidden gap-6 lg:grid xl:grid-cols-2">
          <SectionCard eyebrow={t("dashboard.recent")} title={t("dashboard.latestClients")}>
            <div className="grid gap-3">
              {latestClients.length === 0 ? (
                <SummaryCard
                  title={t("dashboard.emptyClientsTitle")}
                  lines={[t("dashboard.emptyClientsText")]}
                />
              ) : (
                latestClients.map((client) => (
                  <SummaryCard
                    key={client.id}
                    title={formatClientName(client) || t("dashboard.clientNoName")}
                    lines={[client.clientPhone || t("dashboard.noPhone"), client.clientCity || t("dashboard.noCity")]}
                  />
                ))
              )}
            </div>
          </SectionCard>

          <SectionCard eyebrow={t("dashboard.recent")} title={t("dashboard.latestReceipts")}>
            <div className="grid gap-3">
              {latestReceipts.length === 0 ? (
                <SummaryCard
                  title={t("dashboard.emptyReceiptsTitle")}
                  lines={[t("dashboard.emptyReceiptsText")]}
                />
              ) : (
                latestReceipts.map((receipt) => (
                  <SummaryCard
                    key={receipt.id}
                    title={receipt.receiptNumber || t("dashboard.noNumber")}
                    lines={[
                      formatClientName(receipt) || t("dashboard.clientUndefined"),
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
