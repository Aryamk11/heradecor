// app/lib/format.ts

/**
 * Formats a Toman amount with Persian digits, e.g. ۵۵۰٬۰۰۰ تومان.
 * Returns a neutral dash for missing/invalid values rather than a bogus label.
 */
export function formatPrice(value: number | null | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
  return `${value.toLocaleString('fa-IR')} تومان`;
}
