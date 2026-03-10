export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const currencyFormatterPrecise = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export const percentFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number, precise = false) {
  if (Number.isNaN(value)) return "$0";
  return precise ? currencyFormatterPrecise.format(value) : currencyFormatter.format(value);
}

export function formatNumber(value: number) {
  if (Number.isNaN(value)) return "0";
  return numberFormatter.format(value);
}

export function formatPercent(value: number) {
  if (Number.isNaN(value)) return "0%";
  return `${percentFormatter.format(value)}%`;
}
