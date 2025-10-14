// app/lib/cart-service.js
"use client"; // This service interacts with localStorage, so it's client-side

import { supabase } from './supabaseClient.js';

export function getCart() {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem('heraDecorCart')) || [];
}

export function saveCart(cart) {
    if (typeof window === "undefined") return;
    localStorage.setItem('heraDecorCart', JSON.stringify(cart));
}

export function updateCartBadge() {
    if (typeof window === "undefined") return;
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-badge');

    if (badge) {
        badge.innerText = totalItems;
        badge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

export function addToCart(productId) {
    const cart = getCart();
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        cart[productIndex].quantity++;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    saveCart(cart);
    updateCartBadge();
    
    console.log(`Product ${productId} added to cart. New cart:`, cart);
}

export async function getCartWithProductDetails() {
    const cart = getCart();
    if (cart.length === 0) {
        return [];
    }

    const productIds = cart.map(item => item.id);

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

    if (error) {
        console.error('Error fetching product details for cart:', error);
        return [];
    }

    const detailedCart = cart.map(item => {
        const productDetails = products.find(p => p.id == item.id);
        return {
            ...productDetails,
            quantity: item.quantity
        };
    });

    return detailedCart;
}