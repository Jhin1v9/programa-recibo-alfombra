import { DeliveryPdfPage } from "@/components/pages/delivery-pdf-page";

export default async function EntregaPdfRoute({
  searchParams
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const resolvedSearchParams = await searchParams;
  const rawReceiptId = resolvedSearchParams.receiptId;
  const receiptId = Array.isArray(rawReceiptId) ? rawReceiptId[0] : rawReceiptId;

  return <DeliveryPdfPage receiptId={receiptId} />;
}
