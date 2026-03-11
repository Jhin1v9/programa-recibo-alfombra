import type { ServiceItem } from "@/components/receipt-tool/types";

export const RECEIPT_SEQUENCE_STORAGE_PREFIX = "receipt_tool_sequence_";

export function buildReceiptNumber(year: number, sequence: number) {
  return `REC-${year}-${String(sequence).padStart(3, "0")}`;
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function readNextSequence(year: number) {
  if (typeof window === "undefined") {
    return 1;
  }

  const raw = window.localStorage.getItem(`${RECEIPT_SEQUENCE_STORAGE_PREFIX}${year}`);
  const current = Number(raw);
  if (!Number.isFinite(current) || current < 1) {
    return 1;
  }

  return current + 1;
}

export function commitSequence(year: number, sequence: number) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(`${RECEIPT_SEQUENCE_STORAGE_PREFIX}${year}`, String(sequence));
}

export function computeServiceSubtotal(item: ServiceItem) {
  return item.quantity * item.price;
}

export function computeSubtotal(services: ServiceItem[]) {
  return services.reduce((accumulator, item) => accumulator + computeServiceSubtotal(item), 0);
}

export function computeTotal(subtotal: number, discount: number) {
  return Math.max(subtotal - discount, 0);
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2
  }).format(value);
}

export function parseMoneyInput(rawValue: string) {
  const normalized = rawValue.replace(",", ".").trim();
  if (!normalized) {
    return 0;
  }

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}
