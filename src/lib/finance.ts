import type { CurrencyCode, QuoteItem } from "../types";

export const round2 = (n: number | string) => Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;
export const toNumber = (value: unknown) => Number(value || 0);
export const uid = () => Math.random().toString(36).slice(2, 10);

const currencyMx = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 2 });
const currencyUs = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export const fmtCurrency = (amount: number | string, code: CurrencyCode = "MXN") =>
  (code === "USD" ? currencyUs : currencyMx).format(toNumber(amount));

export const computePriceFromCost = (cost: number | string, marginPercent: number | string) => round2(toNumber(cost) * (1 + toNumber(marginPercent) / 100));

export const computeLine = (item: QuoteItem) => {
  const qty = toNumber(item.quantity);
  const lineTotal = round2(qty * toNumber(item.unitPrice));
  const lineCost = round2(qty * toNumber(item.unitCost));
  return { ...item, quantity: qty, lineTotal, lineCost };
};
