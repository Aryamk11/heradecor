// app/components/AddToCartButton.tsx
"use client";

import { addToCart } from '../lib/cart-service';

type AddToCartButtonProps = {
  productId: string | number;
};

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const handleAddToCart = () => {
    // The addToCart function from your service already handles
    // localStorage and updating the badge.
    addToCart(String(productId));
    
    // Optional: Provide visual feedback to the user
    alert('محصول به سبد خرید اضافه شد!');
  };

  return (
    <button
      type="button"
      className="btn btn-sm btn-primary add-to-cart-btn"
      onClick={handleAddToCart}
    >
      افزودن به سبد
    </button>
  );
}