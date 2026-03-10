import {
  DEFAULT_COMPANY,
  formatClientName,
  formatDate,
  joinNonEmpty,
  normalizeCompany,
  normalizeReceiptDraft
} from "@/lib/receipt-core";
import type { CompanyProfile, ReceiptDraft } from "@/lib/types";

type ReceiptPreviewProps = {
  company: CompanyProfile;
  receipt: ReceiptDraft;
};

export function ReceiptPreview({ company, receipt }: ReceiptPreviewProps) {
  const previewCompany = normalizeCompany(company || DEFAULT_COMPANY);
  const previewReceipt = normalizeReceiptDraft(receipt);
  const clientName = formatClientName(previewReceipt) || "Nome do cliente";

  return (
    <section className="receipt-sheet mx-auto w-full max-w-[860px] rounded-[28px] border border-[color:var(--line)] p-5 md:p-[22mm]">
      <header className="receipt-header receipt-header-grid relative z-10 grid gap-4 rounded-[28px] p-5 text-white">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.28em] text-amber-200/80">
              Recibo de recolha e custodia
            </p>
            <h2 className="text-3xl leading-none md:text-[2.2rem]">{previewCompany.companyName}</h2>
            <p className="max-w-[48ch] text-sm leading-6 text-white/76">
              Limpeza profissional de alfombras, tapetes e recolhas com custodia.
            </p>
          </div>

          <p className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-4 text-sm leading-6 text-white/82">
            Pelo presente documento, <strong>{previewCompany.companyName}</strong> confirma que a
            alfombra descrita neste recibo foi recolhida nas instalacoes do cliente e permanece sob
            custodia temporaria para limpeza, tratamento e manuseamento profissional.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
          <div className="grid gap-3 text-sm">
            <MetaRow label="Recibo n.o" value={previewReceipt.receiptNumber || "RC-0000"} />
            <MetaRow label="Data" value={formatDate(previewReceipt.pickupDate) || "--/--/----"} />
            <div className="space-y-2 border-t border-white/12 pt-3 text-white/82">
              <p>{previewCompany.companyPhone}</p>
              <p>{previewCompany.companyAddress}</p>
              <p>{previewCompany.companyEmail}</p>
              <p>{previewCompany.companyTaxId}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 mt-5 space-y-5">
        <PreviewBlock title="Dados do cliente" chip="Identificacao">
          <InfoGrid
            rows={[
              ["Nome completo", clientName],
              ["Telefone", previewReceipt.clientPhone || "Telefone"],
              ["Email", previewReceipt.clientEmail || "Email"],
              ["Endereco", previewReceipt.clientAddress || "Endereco do cliente"],
              [
                "Cidade / C.P.",
                joinNonEmpty([previewReceipt.clientCity, previewReceipt.clientPostalCode], " / ") ||
                  "Cidade / Codigo postal"
              ]
            ]}
          />
        </PreviewBlock>

        <PreviewBlock title="Informacao da alfombra" chip="Artigo recolhido">
          <InfoGrid
            rows={[
              ["Tipo", previewReceipt.rugType || "Tipo da alfombra"],
              ["Tamanho", previewReceipt.rugSize || "Medidas do artigo"],
              ["Cor / descricao", previewReceipt.rugColor || "Descricao visual"],
              ["Estado ao recolher", previewReceipt.rugCondition || "Estado observado"],
              ["Observacoes do artigo", previewReceipt.rugNotes || "Sem observacoes adicionais."]
            ]}
          />
        </PreviewBlock>

        <PreviewBlock title="Controlo do servico" chip="Acompanhamento">
          <InfoGrid
            rows={[
              ["Data de recolha", formatDate(previewReceipt.pickupDate) || "--/--/----"],
              ["Entrega prevista", formatDate(previewReceipt.deliveryDate) || "--/--/----"],
              ["Valor estimado", previewReceipt.estimatedValue || "A definir"],
              [
                "Observacoes do servico",
                previewReceipt.serviceNotes || "Sem observacoes adicionais."
              ]
            ]}
          />
        </PreviewBlock>

        <PreviewBlock title="Confirmacao e assinaturas" chip="Validacao">
          <div className="grid gap-4 md:grid-cols-2">
            <SignatureCard
              label="Assinatura do cliente"
              value={clientName || "Nome e assinatura"}
            />
            <SignatureCard
              label="Assinatura da empresa"
              value={previewCompany.companyResponsible || "Responsavel / assinatura"}
            />
          </div>

          <div className="mt-4 rounded-[22px] border border-[color:var(--line)] bg-white/80 p-5">
            <p className="text-sm font-semibold text-[color:var(--ink-soft)]">Carimbo / selo</p>
            <div className="mt-3 min-h-[96px] rounded-[18px] border-2 border-dashed border-[color:var(--line-strong)] px-4 py-3 text-sm leading-6 text-[color:var(--ink-soft)]">
              {previewCompany.companyStamp || "Espaco reservado para carimbo da empresa"}
            </div>
          </div>
        </PreviewBlock>

        <footer className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-5 py-4 text-sm leading-6 text-[color:var(--ink-soft)]">
          <p>
            Este recibo comprova a recolha da alfombra pelo prestador indicado e deve ser
            conservado pelo cliente ate a devolucao do artigo.
          </p>
          <p className="mt-2">
            Documento emitido por <strong>{previewCompany.companyName}</strong>.
          </p>
        </footer>
      </div>
    </section>
  );
}

function PreviewBlock({
  title,
  chip,
  children
}: Readonly<{
  title: string;
  chip: string;
  children: React.ReactNode;
}>) {
  return (
    <section>
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h3 className="text-xl leading-none">{title}</h3>
        <span className="inline-flex w-fit rounded-full border border-[color:var(--accent-soft)] bg-[color:var(--accent-soft)] px-3 py-2 text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--accent)]">
          {chip}
        </span>
      </div>
      {children}
    </section>
  );
}

function InfoGrid({ rows }: Readonly<{ rows: Array<[string, string]> }>) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[color:var(--line)] bg-white/82">
      {rows.map(([label, value], index) => (
        <div
          key={`${label}-${index}`}
          className="receipt-info-row grid border-b border-[color:var(--line)] last:border-b-0"
        >
          <div className="receipt-info-label border-b border-[color:var(--line)] bg-black/[0.03] px-4 py-3 text-sm font-semibold text-[color:var(--ink-soft)]">
            {label}
          </div>
          <div className="min-h-[56px] px-4 py-3 text-sm leading-6 text-[color:var(--ink)]">
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}

function MetaRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/12 pb-3 text-sm last:border-b-0 last:pb-0">
      <span className="text-white/70">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SignatureCard({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex min-h-[170px] flex-col justify-between rounded-[22px] border border-[color:var(--line)] bg-white/80 p-5">
      <p className="text-sm font-semibold text-[color:var(--ink-soft)]">{label}</p>
      <div className="mt-8 border-b-2 border-black/18" />
      <p className="text-sm leading-6 text-[color:var(--ink-soft)]">{value}</p>
    </div>
  );
}
