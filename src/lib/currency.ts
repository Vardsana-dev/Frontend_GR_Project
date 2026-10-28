/**
 * Currency utilities for standardizing display across the application.
 *
 * Rules:
 * - Laos: LAK
 * - Thailand: THB
 * - China: CNY
 * - USA: USD
 */

export function normalizeCurrency(currency?: string | null): string {
  if (!currency) return "LAK";
  const upper = String(currency).trim().toUpperCase();

  switch (upper) {
    case "KIP":
    case "LAK":
    case "LAO":
    case "₭":
      return "LAK";
    case "THB":
    case "BAHT":
    case "BATH":
    case "฿":
      return "THB";
    case "CNY":
    case "YUAN":
    case "RMB":
    case "CHY":
    case "¥":
      return "CNY";
    case "USD":
    case "$":
      return "USD";
    default:
      return upper;
  }
}

export function getCurrencySymbol(currency?: string | null): string {
  const code = normalizeCurrency(currency);
  switch (code) {
    case "THB":
      return "฿";
    case "CNY":
      return "¥";
    case "LAK":
      return "₭";
    case "USD":
      return "$";
    default:
      return code;
  }
}

export function formatCurrency(
  amount: any,
  currency?: string | null,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  if (amount === undefined || amount === null || amount === "" || isNaN(Number(amount))) {
    return "-";
  }

  const num = Number(amount);
  const minDigits = options?.minimumFractionDigits ?? 0;
  const maxDigits = options?.maximumFractionDigits ?? (Number.isInteger(num) ? 0 : 2);

  const formattedNum = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  }).format(num);

  const code = normalizeCurrency(currency);
  return `${code} ${formattedNum}`;
}
