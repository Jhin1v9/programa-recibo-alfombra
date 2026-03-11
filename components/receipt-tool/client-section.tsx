import { EditableField, SectionCard } from "@/components/workspace-ui";

import type { ClientData } from "@/components/receipt-tool/types";

export function ClientSection({
  value,
  onChange
}: Readonly<{
  value: ClientData;
  onChange: (field: keyof ClientData, nextValue: string) => void;
}>) {
  return (
    <SectionCard eyebrow="Cliente" title="Datos de contacto">
      <div className="grid gap-4 md:grid-cols-2">
        <EditableField
          config={{
            name: "name",
            label: "Nombre",
            placeholder: "Nombre del cliente"
          }}
          value={value.name}
          onChange={(nextValue) => onChange("name", nextValue)}
        />
        <EditableField
          config={{
            name: "phone",
            label: "Teléfono",
            placeholder: "+34 600 000 000"
          }}
          value={value.phone}
          onChange={(nextValue) => onChange("phone", nextValue)}
        />
        <EditableField
          config={{
            name: "address",
            label: "Dirección",
            placeholder: "Calle, número, ciudad",
            full: true
          }}
          value={value.address}
          onChange={(nextValue) => onChange("address", nextValue)}
        />
      </div>
    </SectionCard>
  );
}
