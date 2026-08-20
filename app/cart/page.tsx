// app/cart/page.tsx
"use client";

import { useCallback, useEffect, useState } from 'react';
import ProgressLink from '../components/ProgressLink';
import Image from 'next/image';
import { getCartWithProductDetails, saveCart } from '../lib/cart-service';
import { formatPrice } from '../lib/format';
import type { CartLine } from '../lib/definitions';

type ItemStatus = 'idle' | 'increase' | 'decrease' | 'removed';
type CartItem = CartLine & { status: ItemStatus };

export default function CartPage() {
  const [originalCart, setOriginalCart] = useState<CartItem[]>([]);
  const [stagedCart, setStagedCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    const detailed = await getCartWithProductDetails();
    const items: CartItem[] = detailed.map((item) => ({ ...item, status: 'idle' }));
    setOriginalCart(items);
    setStagedCart(items);
  }, []);

  useEffect(() => {
    load().finally(() => setIsLoading(false));
  }, [load]);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    const quantity = Math.max(0, Math.floor(newQuantity) || 0);

    setStagedCart((current) =>
      current.map((item) => {
        if (item.id !== productId) return item;

        const original = originalCart.find((o) => o.id === productId);
        let status: ItemStatus = 'idle';
        if (quantity === 0) {
          status = 'removed';
        } else if (original) {
          if (quantity > original.quantity) status = 'increase';
          else if (quantity < original.quantity) status = 'decrease';
        }

        return { ...item, quantity, status };
      })
    );
  };

  const handleToggleRemove = (productId: number) => {
    setStagedCart((current) =>
      current.map((item) =>
        item.id === productId
          ? { ...item, status: item.status === 'removed' ? 'idle' : 'removed' }
          : item
      )
    );
  };

  const handleConfirmUpdate = async () => {
    const kept = stagedCart.filter((item) => item.status !== 'removed' && item.quantity > 0);
    saveCart(kept.map((item) => ({ id: String(item.id), quantity: item.quantity })));

    await load();
    setNotice('سبد خرید با موفقیت به‌روزرسانی شد.');
  };

  const handleCancelUpdate = () => {
    setStagedCart(originalCart);
    setNotice('');
  };

  // Emptying is staged like every other change, so it stays undoable via
  // the update bar and needs no blocking confirm() dialog.
  const handleEmptyCart = () => {
    setStagedCart((current) => current.map((item) => ({ ...item, status: 'removed' })));
  };

  const visibleItems = stagedCart.filter((item) => item.status !== 'removed');
  const stagedTotal = visibleItems.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);
  const originalTotal = originalCart.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);
  const difference = stagedTotal - originalTotal;
  const hasChanges = JSON.stringify(originalCart) !== JSON.stringify(stagedCart);

  if (isLoading) {
    return <p className="text-center">در حال بارگذاری سبد خرید...</p>;
  }

  return (
    <div>
      <h1 className="text-center mb-4">سبد خرید شما</h1>

      {notice && !hasChanges && (
        <div className="alert alert-success" role="status">{notice}</div>
      )}

      <div className="cart-layout-grid">
        {/* Summary */}
        <div className="cart-summary-wrapper">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title h5 mb-3">خلاصه سفارش</h2>
              <div className="d-flex flex-column gap-2 mb-3">
                {visibleItems.length > 0 ? (
                  visibleItems.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center gap-2 text-muted small">
                      <span className="text-truncate">{item.name}</span>
                      <span className="text-nowrap">
                        {item.quantity.toLocaleString('fa-IR')} &times; {item.priceValue.toLocaleString('fa-IR')}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted small mb-0">سبد شما برای محاسبه خالی است.</p>
                )}
              </div>
              <hr />
              {difference !== 0 && (
                <>
                  <div className={`d-flex justify-content-between align-items-center gap-2 ${difference > 0 ? 'text-success' : 'text-danger'} small fw-bold`}>
                    <span>تغییرات</span>
                    <span className="text-nowrap">{difference > 0 ? '+' : '−'}{formatPrice(Math.abs(difference))}</span>
                  </div>
                  <hr />
                </>
              )}
              <div className="d-flex justify-content-between gap-2 fw-bold fs-5">
                <span>جمع کل نهایی</span>
                <span className="text-nowrap">{formatPrice(stagedTotal)}</span>
              </div>
              <hr />
              <div className="d-grid">
                <button className="btn btn-success btn-lg" disabled={stagedTotal === 0}>
                  ادامه فرآیند خرید
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="cart-items-wrapper">
          {stagedCart.length > 0 && (
            <div className="d-flex justify-content-end mb-3">
              <button id="empty-cart-btn" className="btn btn-sm btn-outline-danger" onClick={handleEmptyCart}>
                خالی کردن سبد خرید
              </button>
            </div>
          )}
          <div id="cart-items-container">
            {stagedCart.length === 0 ? (
              <div className="card card-body text-center">
                <p className="mb-3">سبد خرید شما خالی است.</p>
                <div>
                  <ProgressLink href="/products" className="btn btn-primary">مشاهده محصولات</ProgressLink>
                </div>
              </div>
            ) : (
              <div className="card card-body">
                {stagedCart.map((item) => {
                  const statusClass =
                    item.status === 'increase' ? 'is-changed-increase'
                    : item.status === 'decrease' ? 'is-changed-decrease'
                    : item.status === 'removed' ? 'is-removed'
                    : '';
                  const isRemoved = item.status === 'removed';

                  return (
                    <div className={`cart-item-row ${statusClass}`} data-id={item.id} key={item.id}>
                      <div className="cart-item-image-wrapper">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={90}
                            height={90}
                            className="rounded"
                          />
                        ) : (
                          <div className="product-card__placeholder rounded h-100" role="img" aria-label={item.name}>
                            <i className="bi bi-image" aria-hidden="true"></i>
                          </div>
                        )}
                      </div>
                      <div className="cart-item-content">
                        <div className="item-info">
                          <h3 className="item-name h6 mb-1">{item.name}</h3>
                          <span className="item-price text-muted">{formatPrice(item.priceValue)}</span>
                        </div>
                        <div className="item-controls">
                          <div className="input-group input-group-sm item-quantity-controls">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={isRemoved}
                              aria-label={`افزودن یکی به ${item.name}`}
                            >
                              +
                            </button>
                            <input
                              type="number"
                              className="form-control text-center cart-quantity-input"
                              value={item.quantity}
                              min={0}
                              disabled={isRemoved}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 0)}
                              aria-label={`تعداد ${item.name}`}
                            />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={isRemoved}
                              aria-label={`کم کردن یکی از ${item.name}`}
                            >
                              −
                            </button>
                          </div>
                          <div className="btn-group btn-group-sm mt-2" role="group">
                            <ProgressLink href={`/products/${item.id}`} className="btn btn-outline-secondary">مشاهده</ProgressLink>
                            <button
                              type="button"
                              className={`btn ${isRemoved ? 'btn-warning' : 'btn-outline-danger'}`}
                              onClick={() => handleToggleRemove(item.id)}
                            >
                              {isRemoved ? 'لغو' : 'حذف'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Update bar */}
      {hasChanges && (
        <div id="cart-update-bar" className="mt-3 p-3 border rounded shadow-sm bg-light">
          <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
            <span>تغییراتی در سبد خرید شما ایجاد شده است.</span>
            <div className="d-flex gap-2">
              <button className="btn btn-success" onClick={handleConfirmUpdate}>به‌روزرسانی سبد</button>
              <button className="btn btn-secondary" onClick={handleCancelUpdate}>انصراف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
