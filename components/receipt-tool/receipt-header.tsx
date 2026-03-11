import { SectionCard } from "@/components/workspace-ui";

export function ReceiptHeader({
  receiptNumber,
  issueDate,
  onDateChange
}: Readonly<{
  receiptNumber: string;
  issueDate: string;
  onDateChange: (nextValue: string) => void;
}>) {
  return (
    <SectionCard eyebrow="Datos del recibo" title="Control de emisión">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold text-[color:var(--ink-soft)]">Número</span>
          <input
            type="text"
            value={receiptNumber}
            readOnly
            className="h-12 rounded-[16px] border border-[color:var(--line)] bg-[rgba(15,23,42,0.03)] px-4 text-sm font-bold text-[color:var(--ink)]"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold text-[color:var(--ink-soft)]">Fecha</span>
          <input
            type="date"
            value={issueDate}
            onChange={(event) => onDateChange(event.target.value)}
            className="h-12 rounded-[16px] border border-[color:var(--line)] bg-white px-4 text-sm text-[color:var(--ink)] outline-none focus:border-[color:var(--brand)]"
          />
        </label>
      </div>
    </SectionCard>
  );
}
