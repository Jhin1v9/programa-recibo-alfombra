"use client";

import { useMemo, useRef, useState } from "react";

import { PageIntro } from "@/components/workspace-ui";
import { ClientSection } from "@/components/receipt-tool/client-section";
import {
  buildReceiptNumber,
  commitSequence,
  computeSubtotal,
  computeTotal,
  parseMoneyInput,
  readNextSequence,
  todayIsoDate
} from "@/components/receipt-tool/helpers";
import { ReceiptPreviewPanel } from "@/components/receipt-tool/receipt-preview-panel";
import { ReceiptHeader } from "@/components/receipt-tool/receipt-header";
import { ServiceList } from "@/components/receipt-tool/service-list";
import { TotalsSection } from "@/components/receipt-tool/totals-section";
import type {
  ClientData,
  ReceiptData,
  ServiceItem
} from "@/components/receipt-tool/types";
import { useReceiptApp } from "@/components/receipt-app-provider";
import { exportReceiptPdf } from "@/lib/receipt-pdf";

function createServiceItem(
  description = "",
  quantity = 1,
  price = 0
): ServiceItem {
  return {
    id: `srv-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    description,
    quantity,
    price
  };
}

export function ReceiptsPage() {
  const { selectedClient } = useReceiptApp();
  const previewRef = useRef<HTMLDivElement | null>(null);
  const initialYear = new Date().getFullYear();
  const initialSequence = readNextSequence(initialYear);
  const [receiptNumber, setReceiptNumber] = useState(() =>
    buildReceiptNumber(initialYear, initialSequence)
  );
  const [issueDate, setIssueDate] = useState(todayIsoDate());
  const [sequence, setSequence] = useState(initialSequence);
  const [numberCommitted, setNumberCommitted] = useState(false);
  const [client, setClient] = useState<ClientData>({
    name: selectedClient
      ? [selectedClient.clientFirstName, selectedClient.clientLastName]
          .filter(Boolean)
          .join(" ")
          .trim()
      : "",
    phone: selectedClient?.clientPhone || "",
    address: selectedClient?.clientAddress || ""
  });
  const [services, setServices] = useState<ServiceItem[]>([createServiceItem()]);
  const [observations, setObservations] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = useMemo(() => computeSubtotal(services), [services]);
  const total = useMemo(() => computeTotal(subtotal, discount), [subtotal, discount]);

  function updateClient(field: keyof ClientData, nextValue: string) {
    setClient((current) => ({
      ...current,
      [field]: nextValue
    }));
  }

  function addServiceItem() {
    setServices((current) => [...current, createServiceItem()]);
  }

  function addQuickService(description: string, price: number) {
    setServices((current) => [...current, createServiceItem(description, 1, price)]);
  }

  function updateServiceItem(
    itemId: string,
    field: "description" | "quantity" | "price",
    nextValue: string
  ) {
    setServices((current) =>
      current.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        if (field === "description") {
          return { ...item, description: nextValue };
        }

        if (field === "quantity") {
          const parsed = Number(nextValue);
          return {
            ...item,
            quantity: Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
          };
        }

        return {
          ...item,
          price: parseMoneyInput(nextValue)
        };
      })
    );
  }

  function removeServiceItem(itemId: string) {
    setServices((current) => {
      const nextItems = current.filter((item) => item.id !== itemId);
      return nextItems.length > 0 ? nextItems : [createServiceItem()];
    });
  }

  function ensureSequenceCommitted() {
    if (numberCommitted) {
      return;
    }

    const currentYear = new Date().getFullYear();
    commitSequence(currentYear, sequence);
    setNumberCommitted(true);
  }

  function advanceToNextReceipt() {
    const currentYear = new Date().getFullYear();
    const nextSequence = sequence + 1;
    commitSequence(currentYear, sequence);
    setSequence(nextSequence);
    setReceiptNumber(buildReceiptNumber(currentYear, nextSequence));
    setNumberCommitted(false);
  }

  async function handleGeneratePdf() {
    if (!previewRef.current) {
      return;
    }

    ensureSequenceCommitted();
    const fileName = receiptNumber.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    await exportReceiptPdf({
      fileName: `${fileName || "recibo-profesional"}.pdf`,
      sourceElement: previewRef.current,
      action: "download"
    });
  }

  function handlePrint() {
    ensureSequenceCommitted();
    window.print();
  }

  function handleReset() {
    const confirmed = window.confirm("¿Limpiar el formulario y crear un nuevo recibo?");
    if (!confirmed) {
      return;
    }

    advanceToNextReceipt();
    setIssueDate(todayIsoDate());
    setClient({ name: "", phone: "", address: "" });
    setServices([createServiceItem()]);
    setObservations("");
    setDiscount(0);
  }

  const previewData: ReceiptData = {
    receiptNumber,
    issueDate,
    client,
    services,
    observations,
    discount
  };

  return (
    <>
      <div className="print:hidden">
        <PageIntro
          eyebrow="Herramienta profesional"
          title="Generador de recibos de alfombras"
          description="Flujo optimizado para crear recibos en segundos: cliente, servicios, cálculo automático y preview en tiempo real."
        />
      </div>

      <div className="grid gap-6 pb-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] print:grid-cols-1 print:pb-0">
        <div className="min-w-0 space-y-6 print:hidden">
          <ReceiptHeader
            receiptNumber={receiptNumber}
            issueDate={issueDate}
            onDateChange={setIssueDate}
          />
          <ClientSection value={client} onChange={updateClient} />
          <ServiceList
            items={services}
            onAddItem={addServiceItem}
            onAddQuickService={addQuickService}
            onUpdateItem={updateServiceItem}
            onRemoveItem={removeServiceItem}
          />
          <TotalsSection
            subtotal={subtotal}
            discount={discount}
            total={total}
            observations={observations}
            onDiscountChange={(nextValue) => setDiscount(parseMoneyInput(nextValue))}
            onObservationsChange={setObservations}
            onGeneratePdf={() => void handleGeneratePdf()}
            onPrint={handlePrint}
            onReset={handleReset}
          />
        </div>

        <div className="min-w-0 lg:sticky lg:top-20 lg:self-start print:static">
          <div ref={previewRef}>
            <ReceiptPreviewPanel data={previewData} subtotal={subtotal} total={total} />
          </div>
        </div>
      </div>
    </>
  );
}
