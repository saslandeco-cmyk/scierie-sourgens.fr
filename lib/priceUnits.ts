export const UNIT_OPTIONS = ["m2", "mètre linéaire", "pièce"] as const;

export const STATUS_OPTIONS = ["indisponible", "nous consulter"] as const;

export const PRICE_UNITS = [...UNIT_OPTIONS, ...STATUS_OPTIONS] as const;

export type PriceUnit = (typeof PRICE_UNITS)[number];

export const PRICE_STATUS_UNITS: PriceUnit[] = [...STATUS_OPTIONS];

export function isPriceStatus(priceUnit: string | null | undefined): boolean {
  return Boolean(priceUnit && PRICE_STATUS_UNITS.includes(priceUnit as PriceUnit));
}

export function formatStatus(priceUnit: string | null | undefined): string | null {
  if (!priceUnit || !PRICE_STATUS_UNITS.includes(priceUnit as PriceUnit)) return null;
  return priceUnit.charAt(0).toUpperCase() + priceUnit.slice(1);
}

export function formatPrice(price: number | null | undefined, priceUnit: string | null | undefined): string | null {
  if (price == null) return null;
  const unit = priceUnit && !isPriceStatus(priceUnit) ? priceUnit : null;
  return unit ? `${price.toFixed(2)} € TTC / ${unit}` : `${price.toFixed(2)} € TTC`;
}
