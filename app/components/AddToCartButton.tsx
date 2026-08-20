// app/components/AddToCartButton.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import { addToCart } from '../lib/cart-service';

type AddToCartButtonProps = {
  productId: string | number;
  className?: string;
  children?: React.ReactNode;
};

export default function AddToCartButton({
  productId,
  className = '',
  children,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Don't leave a timer running against an unmounted button.
  useEffect(() => () => clearTimeout(timer.current), []);

  const handleAddToCart = () => {
    addToCart(productId);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      type="button"
      className={`btn btn-primary add-to-cart-btn ${className}`}
      onClick={handleAddToCart}
    >
      {added ? (
        <>
          <i className="bi bi-check2 ms-1" aria-hidden="true"></i>افزوده شد
        </>
      ) : (
        children ?? 'افزودن به سبد'
      )}
      {/* Announced to screen readers instead of the old blocking alert(). */}
      <span className="visually-hidden" role="status" aria-live="polite">
        {added ? 'محصول به سبد خرید اضافه شد' : ''}
      </span>
    </button>
  );
}
