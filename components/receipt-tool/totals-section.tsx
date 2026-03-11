import { ActionButton, SectionCard } from "@/components/workspace-ui";

import { formatMoney } from "@/components/receipt-tool/helpers";

export function TotalsSection({
  subtotal,
  discount,
  total,
  observations,
  onDiscountChange,
  onObservationsChange,
  onGeneratePdf,
  onPrint,
  onReset
}: Readonly<{
  subtotal: number;
  discount: number;
  total: number;
  observations: string;
  onDiscountChange: (nextValue: string) => void;
  onObservationsChange: (nextValue: string) => void;
  onGeneratePdf: () => void;
  onPrint: () => void;
  onReset: () => void;
}>) {
  return (
    <SectionCard eyebrow="Totales" title="Resumen financiero">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold text-[color:var(--ink-soft)]">Observaciones</span>
          <textarea
            rows={4}
            value={observations}
            onChange={(event) => onObservationsChange(event.target.value)}
            className="min-h-[110px] rounded-[16px] border border-[color:var(--line)] bg-white px-4 py-3 text-sm outline-none focus:border-[color:var(--brand)]"
            placeholder="Notas adicionales del servicio..."
          />
        </label>

        <div className="rounded-[18px] border border-[color:var(--line)] bg-[rgba(15,23,42,0.03)] p-4">
          <div className="space-y-2 text-sm">
            <Row label="Subtotal" value={formatMoney(subtotal)} />
            <label className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
              <span className="font-semibold text-[color:var(--ink-soft)]">Descuento</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(event) => onDiscountChange(event.target.value)}
                className="h-10 rounded-[12px] border border-[color:var(--line)] bg-white px-3 text-sm outline-none focus:border-[color:var(--brand)]"
              />
            </label>
            <div className="my-2 border-t border-[color:var(--line)]" />
            <Row label="Total" value={formatMoney(total)} isTotal />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <ActionButton label="Generar PDF" variant="primary" onClick={onGeneratePdf} />
        <ActionButton label="Imprimir" variant="secondary" onClick={onPrint} />
        <ActionButton label="Limpar formulario" variant="ghost" onClick={onReset} />
      </div>
    </SectionCard>
  );
}

function Row({
  label,
  value,
  isTotal = false
}: Readonly<{
  label: string;
  value: string;
  isTotal?: boolean;
}>) {
  return (
    <div className="flex items-center justify-between">
      <span className={`${isTotal ? "text-base font-extrabold text-[color:var(--ink)]" : "font-semibold text-[color:var(--ink-soft)]"}`}>
        {label}
      </span>
      <span className={`${isTotal ? "text-lg font-extrabold text-[color:var(--ink)]" : "font-bold text-[color:var(--ink)]"}`}>
        {value}
      </span>
    </div>
  );
}
