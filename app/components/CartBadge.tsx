// app/components/CartBadge.tsx
"use client";

import { useEffect, useState } from 'react';
import { CART_CHANGED_EVENT, getCartCount } from '../lib/cart-service';

/**
 * The count only exists in localStorage, so it stays null until after hydration.
 * Rendering nothing first avoids the server/client mismatch the old
 * document.getElementById('cart-badge') approach papered over.
 */
export default function CartBadge() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const sync = () => setCount(getCartCount());
    sync();

    window.addEventListener(CART_CHANGED_EVENT, sync);
    // Keeps other open tabs in sync too.
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CART_CHANGED_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  if (!count) return null;

  return (
    <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger">
      {count.toLocaleString('fa-IR')}
      <span className="visually-hidden">محصول در سبد خرید</span>
    </span>
  );
}
