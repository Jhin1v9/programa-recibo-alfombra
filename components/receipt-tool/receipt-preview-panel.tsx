import { SectionCard } from "@/components/workspace-ui";

import {
  computeServiceSubtotal,
  formatMoney
} from "@/components/receipt-tool/helpers";
import type { ReceiptData } from "@/components/receipt-tool/types";

export function ReceiptPreviewPanel({
  data,
  subtotal,
  total
}: Readonly<{
  data: ReceiptData;
  subtotal: number;
  total: number;
}>) {
  return (
    <SectionCard eyebrow="Preview" title="Recibo en tiempo real">
      <div className="rounded-[22px] border border-[color:var(--line)] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <header className="flex items-start justify-between gap-4 border-b border-[color:var(--line)] pb-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[color:var(--brand)]">
              Recibo profesional
            </p>
            <h3 className="mt-2 text-xl font-extrabold text-[color:var(--ink)]">{data.receiptNumber}</h3>
          </div>
          <p className="rounded-full border border-[color:var(--line)] bg-[rgba(15,23,42,0.03)] px-3 py-1.5 text-xs font-bold text-[color:var(--ink-soft)]">
            {data.issueDate}
          </p>
        </header>

        <section className="mt-4 rounded-[16px] border border-[color:var(--line)] bg-[rgba(15,23,42,0.02)] p-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[color:var(--brand)]">Cliente</p>
          <p className="mt-2 text-sm font-bold text-[color:var(--ink)]">{data.client.name || "Nombre del cliente"}</p>
          <p className="mt-1 text-sm text-[color:var(--ink-soft)]">{data.client.phone || "Teléfono"}</p>
          <p className="mt-1 text-sm text-[color:var(--ink-soft)]">{data.client.address || "Dirección"}</p>
        </section>

        <section className="mt-4">
          <div className="grid grid-cols-[minmax(0,1fr)_70px_90px_90px] gap-2 px-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[color:var(--ink-soft)]">
            <p>Descripción</p>
            <p className="text-right">Cant.</p>
            <p className="text-right">Precio</p>
            <p className="text-right">Subtotal</p>
          </div>
          <div className="mt-2 space-y-2">
            {data.services.map((service) => (
              <div
                key={service.id}
                className="grid grid-cols-[minmax(0,1fr)_70px_90px_90px] items-center gap-2 rounded-[14px] border border-[color:var(--line)] bg-white px-3 py-2 text-sm"
              >
                <p className="truncate font-semibold text-[color:var(--ink)]">
                  {service.description || "Servicio"}
                </p>
                <p className="text-right text-[color:var(--ink-soft)]">{service.quantity}</p>
                <p className="text-right text-[color:var(--ink-soft)]">{formatMoney(service.price)}</p>
                <p className="text-right font-bold text-[color:var(--ink)]">
                  {formatMoney(computeServiceSubtotal(service))}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-[16px] border border-[color:var(--line)] bg-[rgba(15,23,42,0.02)] p-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[color:var(--brand)]">Totales</p>
          <div className="mt-3 space-y-1.5 text-sm">
            <AmountRow label="Subtotal" value={formatMoney(subtotal)} />
            <AmountRow label="Descuento" value={formatMoney(data.discount)} />
            <div className="border-t border-[color:var(--line)] pt-2">
              <AmountRow label="Total" value={formatMoney(total)} strong />
            </div>
          </div>
        </section>

        {data.observations ? (
          <section className="mt-4 rounded-[16px] border border-[color:var(--line)] bg-[rgba(15,23,42,0.02)] p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[color:var(--brand)]">
              Observaciones
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[color:var(--ink-soft)]">
              {data.observations}
            </p>
          </section>
        ) : null}
      </div>
    </SectionCard>
  );
}

function AmountRow({
  label,
  value,
  strong = false
}: Readonly<{
  label: string;
  value: string;
  strong?: boolean;
}>) {
  return (
    <div className="flex items-center justify-between">
      <span className={strong ? "font-extrabold text-[color:var(--ink)]" : "font-semibold text-[color:var(--ink-soft)]"}>
        {label}
      </span>
      <span className={strong ? "text-lg font-extrabold text-[color:var(--ink)]" : "font-bold text-[color:var(--ink)]"}>
        {value}
      </span>
    </div>
  );
}
