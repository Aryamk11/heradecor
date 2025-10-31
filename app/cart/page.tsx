// app/cart/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { getCartWithProductDetails, saveCart, updateCartBadge } from '../lib/cart-service';
import Link from 'next/link';
import Image from 'next/image'; // Import next/image




// Define a type for our detailed cart items
type CartItem = {
  id: number;
  name: string;
  priceValue: number;
  image: string;
  quantity: number;
  status: 'idle' | 'increase' | 'decrease' | 'removed';
};

// DEFINE TYPE for the data from getCartWithProductDetails
type DetailedProduct = {
  id: number;
  name: string;
  priceValue: number;
  image: string;
  quantity: number;
  // ...any other properties from supabase
};

// Helper function from ui-renderer.js
function formatPrice(value: number) {
  if (typeof value !== 'number') return 'ناعدد';
  return `${value.toLocaleString('fa-IR')} تومان`;
}

export default function CartPage() {
  const [originalCart, setOriginalCart] = useState<CartItem[]>([]);
  const [stagedCart, setStagedCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial cart data on component mount
  useEffect(() => {
    async function loadCart() {
      const detailedCart: DetailedProduct[] = await getCartWithProductDetails();
      // <-- FIX: Apply 'DetailedProduct' type to 'item'
      const initialItems = detailedCart.map((item: DetailedProduct) => ({ ...item, status: 'idle' })) as CartItem[];
      setOriginalCart(JSON.parse(JSON.stringify(initialItems))); // Deep copy
      setStagedCart(JSON.parse(JSON.stringify(initialItems))); // Deep copy
      setIsLoading(false);
    }
    loadCart();
  }, []);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setStagedCart(currentCart =>
      currentCart.map(item => {
        if (item.id === productId) {
          const originalItem = originalCart.find(o => o.id === productId);
          newQuantity = Math.max(0, newQuantity);

          let newStatus: CartItem['status'] = 'idle';
          if (newQuantity === 0) {
            newStatus = 'removed';
          } else if (originalItem) {
            if (newQuantity > originalItem.quantity) newStatus = 'increase';
            else if (newQuantity < originalItem.quantity) newStatus = 'decrease';
          }
          
          return { ...item, quantity: newQuantity, status: newStatus };
        }
        return item;
      })
    );
  };

  const handleToggleRemove = (productId: number) => {
    setStagedCart(currentCart =>
      currentCart.map(item => {
        if (item.id === productId) {
          const newStatus = item.status === 'removed' ? 'idle' : 'removed';
          return { ...item, status: newStatus };
        }
        return item;
      })
    );
  };

  const handleConfirmUpdate = async () => {
    const finalCart = stagedCart.filter(item => item.status !== 'removed');
    const cartToSave = finalCart.map(item => ({ id: String(item.id), quantity: item.quantity }));
    
    saveCart(cartToSave);
    updateCartBadge();
    
    // Refresh the state to match the new saved cart
    const newDetailedCart: DetailedProduct[] = await getCartWithProductDetails();
    // <-- FIX: Apply 'DetailedProduct' type to 'item'
    const newItems = newDetailedCart.map((item: DetailedProduct) => ({ ...item, status: 'idle' })) as CartItem[];
    setOriginalCart(JSON.parse(JSON.stringify(newItems)));
    setStagedCart(JSON.parse(JSON.stringify(newItems)));
    
    alert('سبد خرید با موفقیت به‌روزرسانی شد!');
  };

  const handleCancelUpdate = () => {
    setStagedCart(JSON.parse(JSON.stringify(originalCart))); // Revert to original
  };

  const handleEmptyCart = () => {
    if (window.confirm('آیا از خالی کردن کامل سبد خرید خود اطمینان دارید؟')) {
      setStagedCart(currentCart => currentCart.map(item => ({ ...item, status: 'removed' })));
    }
  };

  // --- Calculations for rendering ---
  const stagedTotal = stagedCart.filter(item => item.status !== 'removed').reduce((total, item) => total + (item.priceValue * item.quantity), 0);
  const originalTotal = originalCart.reduce((total, item) => total + (item.priceValue * item.quantity), 0);
  const difference = stagedTotal - originalTotal;
  const hasChanges = JSON.stringify(originalCart) !== JSON.stringify(stagedCart);

if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <p className="text-center fs-4">در حال بارگذاری سبد خرید...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center mb-4">سبد خرید شما</h1>
      <div className="cart-layout-grid">
        {/* Summary Card */}
        <div className="cart-summary-wrapper">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">خلاصه سفارش</h5>
              <div className="d-flex flex-column gap-2 mb-3">
                {stagedCart.filter(item => item.status !== 'removed').length > 0 ? (
                  stagedCart.filter(item => item.status !== 'removed').map(item => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center text-muted small">
                      <span>{item.name}</span>
                      <span>{item.quantity} &times; {item.priceValue.toLocaleString('fa-IR')}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted small">سبد شما برای محاسبه خالی است.</p>
                )}
              </div>
              <hr />
              {difference !== 0 && (
                <>
                  <div className={`d-flex justify-content-between align-items-center ${difference > 0 ? 'text-success' : 'text-danger'} small fw-bold`}>
                    <span>تغییرات</span>
                    <span>{difference > 0 ? '+' : ''}{formatPrice(difference)}</span>
                  </div>
                  <hr/>
                </>
              )}
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>جمع کل نهایی</span>
                <span>{formatPrice(stagedTotal)}</span>
              </div>
              <hr />
              <div className="d-grid">
                <button className="btn btn-success btn-lg" disabled={stagedTotal === 0}>ادامه فرآیند خرید</button>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="cart-items-wrapper">
          <div className="d-flex justify-content-end mb-3">
            <button id="empty-cart-btn" className="btn btn-sm btn-outline-danger" onClick={handleEmptyCart}>خالی کردن سبد خرید</button>
          </div>
          <div id="cart-items-container">
            {stagedCart.length === 0 ? (
              <div className="card card-body text-center"><p className="mb-0">سبد خرید شما خالی است.</p></div>
            ) : (
              <div className="card card-body">
                {stagedCart.map(item => {
                  let statusClass = '';
                  if (item.status === 'increase') statusClass = 'is-changed-increase';
                  else if (item.status === 'decrease') statusClass = 'is-changed-decrease';
                  else if (item.status === 'removed') statusClass = 'is-removed';
                  
                  return (
                    <div className={`cart-item-row ${statusClass}`} data-id={item.id} key={item.id}>
                      <div className="cart-item-image-wrapper">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={90}
                          height={90}
                          className="img-fluid rounded"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="cart-item-content">
                        <div className="item-info">
                          <h6 className="item-name mb-1">{item.name}</h6>
                          <span className="item-price text-muted">{formatPrice(item.priceValue)}</span>
                        </div>
                        <div className="item-controls">
                          <div className="input-group input-group-sm item-quantity-controls">
                            <button className="btn btn-outline-secondary" type="button" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                            <input type="number" className="form-control text-center" value={item.quantity} min="0" onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 0)} />
                            <button className="btn btn-outline-secondary" type="button" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.status === 'removed'}>-</button>
                          </div>
                          <div className="btn-group btn-group-sm mt-2" role="group">
                             <Link href={`/products/${item.id}`} className="btn btn-outline-secondary">مشاهده</Link>
                            <button type="button" className={`btn ${item.status === 'removed' ? 'btn-warning' : 'btn-outline-danger'}`} onClick={() => handleToggleRemove(item.id)}>
                              {item.status === 'removed' ? 'لغو' : 'حذف'}
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

      {/* Update Bar */}
      {hasChanges && (
        <div id="cart-update-bar" className="mt-3 p-3 border rounded shadow-sm bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <span>تغییراتی در سبد خرید شما ایجاد شده است.</span>
            <div>
              <button className="btn btn-success me-2" onClick={handleConfirmUpdate}>به‌روزرسانی سبد</button>
              <button className="btn btn-secondary" onClick={handleCancelUpdate}>انصراف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

