export const PRICE_UNITS = ["m2", "mètre linéaire", "pièce", "indisponible", "nous consulter"] as const;

export type PriceUnit = (typeof PRICE_UNITS)[number];

export const PRICE_STATUS_UNITS: PriceUnit[] = ["indisponible", "nous consulter"];

export function formatPrice(price: number | null | undefined, priceUnit: string | null | undefined): string | null {
  if (priceUnit && PRICE_STATUS_UNITS.includes(priceUnit as PriceUnit)) {
    return priceUnit.charAt(0).toUpperCase() + priceUnit.slice(1);
  }
  if (price == null) return null;
  return priceUnit ? `${price.toFixed(2)} € / ${priceUnit}` : `${price.toFixed(2)} €`;
}
