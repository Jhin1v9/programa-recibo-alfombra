import { ActionButton } from "@/components/workspace-ui";

import { computeServiceSubtotal, formatMoney } from "@/components/receipt-tool/helpers";
import type { ServiceItem } from "@/components/receipt-tool/types";

export function ServiceItemRow({
  item,
  onChange,
  onRemove
}: Readonly<{
  item: ServiceItem;
  onChange: (itemId: string, field: "description" | "quantity" | "price", nextValue: string) => void;
  onRemove: (itemId: string) => void;
}>) {
  return (
    <div className="rounded-[18px] border border-[color:var(--line)] bg-white/90 p-3">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1.6fr)_120px_120px_auto]">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--ink-soft)]">
            Descripción
          </span>
          <input
            type="text"
            value={item.description}
            onChange={(event) => onChange(item.id, "description", event.target.value)}
            className="h-11 rounded-[14px] border border-[color:var(--line)] bg-white px-3 text-sm outline-none focus:border-[color:var(--brand)]"
            placeholder="Servicio"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--ink-soft)]">
            Cantidad
          </span>
          <input
            type="number"
            min="0"
            step="1"
            value={item.quantity}
            onChange={(event) => onChange(item.id, "quantity", event.target.value)}
            className="h-11 rounded-[14px] border border-[color:var(--line)] bg-white px-3 text-sm outline-none focus:border-[color:var(--brand)]"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--ink-soft)]">
            Precio
          </span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={item.price}
            onChange={(event) => onChange(item.id, "price", event.target.value)}
            className="h-11 rounded-[14px] border border-[color:var(--line)] bg-white px-3 text-sm outline-none focus:border-[color:var(--brand)]"
          />
        </label>
        <div className="flex flex-col justify-end gap-2">
          <p className="rounded-[14px] border border-[color:var(--line)] bg-[rgba(15,23,42,0.03)] px-3 py-2 text-sm font-bold text-[color:var(--ink)]">
            {formatMoney(computeServiceSubtotal(item))}
          </p>
          <ActionButton label="Quitar" variant="danger" onClick={() => onRemove(item.id)} />
        </div>
      </div>
    </div>
  );
}
