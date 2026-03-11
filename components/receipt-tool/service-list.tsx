import { ActionButton, SectionCard } from "@/components/workspace-ui";

import type { ServiceItem } from "@/components/receipt-tool/types";
import { ServiceItemRow } from "@/components/receipt-tool/service-item-row";

const QUICK_SERVICES: ReadonlyArray<{ label: string; description: string; price: number }> = [
  { label: "+ Lavado alfombra", description: "Lavado alfombra", price: 45 },
  { label: "+ Lavado sofá", description: "Lavado sofá", price: 65 },
  { label: "+ Impermeabilización", description: "Impermeabilización", price: 30 },
  { label: "+ Recogida y entrega", description: "Recogida y entrega", price: 20 }
];

export function ServiceList({
  items,
  onAddItem,
  onAddQuickService,
  onUpdateItem,
  onRemoveItem
}: Readonly<{
  items: ServiceItem[];
  onAddItem: () => void;
  onAddQuickService: (description: string, price: number) => void;
  onUpdateItem: (itemId: string, field: "description" | "quantity" | "price", nextValue: string) => void;
  onRemoveItem: (itemId: string) => void;
}>) {
  return (
    <SectionCard
      eyebrow="Servicios"
      title="Detalle del trabajo"
      actions={<ActionButton label="Agregar servicio" variant="primary" onClick={onAddItem} />}
    >
      <div className="flex flex-wrap gap-2">
        {QUICK_SERVICES.map((quickService) => (
          <button
            key={quickService.label}
            type="button"
            className="rounded-full border border-[color:var(--line)] bg-white px-3 py-2 text-xs font-bold tracking-[0.06em] text-[color:var(--ink)] transition hover:-translate-y-0.5"
            onClick={() => onAddQuickService(quickService.description, quickService.price)}
          >
            {quickService.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <ServiceItemRow
            key={item.id}
            item={item}
            onChange={onUpdateItem}
            onRemove={onRemoveItem}
          />
        ))}
      </div>
    </SectionCard>
  );
}
