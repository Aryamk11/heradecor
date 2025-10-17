// src/assets/js/cart-service.js

import { supabase } from './supabaseClient.js';
/**
 * Retrieves the cart from localStorage.
 * @returns {Array} The cart, which is an array of objects like { id, quantity }.
 */
export function getCart() {
    return JSON.parse(localStorage.getItem('heraDecorCart')) || [];
}

/**
 * Saves the cart to localStorage.
 * @param {Array} cart - The cart array to save.
 */
export function saveCart(cart) {
    localStorage.setItem('heraDecorCart', JSON.stringify(cart));
}

/**
 * Updates the cart badge in the header to show the total number of items.
 */
export function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-badge');

    if (badge) {
        badge.innerText = totalItems;
        badge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

/**
 * Adds a product to the cart or increments its quantity if it already exists.
 * @param {string} productId - The ID of the product to add.
 */
export function addToCart(productId) {
    const cart = getCart();
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        // Product already in cart, increment quantity
        cart[productIndex].quantity++;
    } else {
        // Product not in cart, add it
        cart.push({ id: productId, quantity: 1 });
    }

    saveCart(cart);
    updateCartBadge();
    
    // Optional: Add a visual confirmation
    console.log(`Product ${productId} added to cart. New cart:`, cart);
}

/**
 * Retrieves the full product details for items in the cart.
 * @returns {Promise<Array>} A promise that resolves to an array of cart items with full product details.
 */
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