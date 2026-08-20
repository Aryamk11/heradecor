// app/lib/cart-service.ts
// The cart lives in localStorage, so every export here is browser-only.
import { supabase } from './supabaseClient';
import type { CartEntry, CartLine, Product } from './definitions';

const STORAGE_KEY = 'heraDecorCart';

/** Fired on window whenever the stored cart changes, so the UI can re-read it. */
export const CART_CHANGED_EVENT = 'hera:cart-changed';

/** Ids are stored as strings so localStorage round-trips can't change their type. */
function normalize(entries: unknown): CartEntry[] {
  if (!Array.isArray(entries)) return [];
  return entries.flatMap((entry) => {
    if (typeof entry !== 'object' || entry === null) return [];
    const { id, quantity } = entry as Partial<CartEntry>;
    if (id === undefined || id === null) return [];
    const count = Number(quantity);
    if (!Number.isFinite(count) || count < 1) return [];
    return [{ id: String(id), quantity: Math.floor(count) }];
  });
}

export function getCart(): CartEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return normalize(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'));
  } catch {
    // A corrupt entry used to throw and take the whole cart page down with it.
    console.warn('Discarding unreadable cart in localStorage.');
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function saveCart(cart: CartEntry[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalize(cart)));
  window.dispatchEvent(new Event(CART_CHANGED_EVENT));
}

/** Total number of items in the cart, used for the header badge. */
export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function addToCart(productId: string | number): void {
  const id = String(productId);
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }

  saveCart(cart);
}

/** Joins the stored cart against the products table, dropping items that no longer exist. */
export async function getCartWithProductDetails(): Promise<CartLine[]> {
  const cart = getCart();
  if (cart.length === 0) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', cart.map((item) => item.id));

  if (error) {
    console.error('Error fetching product details for cart:', error);
    return [];
  }

  const products = (data ?? []) as Product[];
  const lines = cart.flatMap((item) => {
    const product = products.find((p) => String(p.id) === item.id);
    // A product deleted since it was added would previously spread to `undefined`
    // and render a blank row with a NaN subtotal.
    return product ? [{ ...product, quantity: item.quantity }] : [];
  });

  // Drop ids that no longer resolve, so the header badge can't keep counting
  // products that the cart page won't show. No-ops once storage is consistent.
  if (lines.length !== cart.length) {
    saveCart(lines.map((line) => ({ id: String(line.id), quantity: line.quantity })));
  }

  return lines;
}
