export const UNIT_OPTIONS = ["m2", "mètre linéaire", "pièce"] as const;

export const STATUS_OPTIONS = ["indisponible", "nous consulter"] as const;

export function formatStatus(priceStatus: string | null | undefined): string | null {
  if (!priceStatus || !STATUS_OPTIONS.includes(priceStatus as (typeof STATUS_OPTIONS)[number])) return null;
  return priceStatus.charAt(0).toUpperCase() + priceStatus.slice(1);
}

export function formatPrice(price: number | null | undefined, priceUnit: string | null | undefined): string | null {
  if (price == null) return null;
  return priceUnit ? `${price.toFixed(2)} € TTC / ${priceUnit}` : `${price.toFixed(2)} € TTC`;
}
