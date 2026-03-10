import { ReceiptPdfPage } from "@/components/pages/receipt-pdf-page";

export default async function RecibosPdfRoute({
  searchParams
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const resolvedSearchParams = await searchParams;
  const rawReceiptId = resolvedSearchParams.receiptId;
  const receiptId = Array.isArray(rawReceiptId) ? rawReceiptId[0] : rawReceiptId;

  return <ReceiptPdfPage receiptId={receiptId} />;
}
