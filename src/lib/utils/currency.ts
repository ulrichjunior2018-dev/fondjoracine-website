/** Formats integer cents into a display amount. Mirrors the formatting used on /order-confirmation. */
export function formatMoney(cents: number, currency: string): string {
  if (currency === "XAF") {
    return `${cents.toLocaleString("fr-FR")} XAF`;
  }

  return new Intl.NumberFormat("fr-FR", { currency, style: "currency" }).format(cents / 100);
}
