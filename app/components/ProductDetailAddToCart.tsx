// app/components/ProductDetailAddToCart.tsx
"use client";

import { addToCart } from '@/app/lib/cart-service';

type Props = {
  productId: string | number;
};

export default function ProductDetailAddToCart({ productId }: Props) {
  const handleAddToCart = () => {
    addToCart(String(productId));
    alert('محصول به سبد خرید اضافه شد!');
  };

  return (
    <button
      type="button"
      className="btn btn-primary btn-lg"
      onClick={handleAddToCart}
    >
      <i className="bi bi-cart-plus me-2"></i>افزودن به سبد خرید
    </button>
  );
}