/* src/assets/js/main.js */

import logoImage from '../images/log.webp';
import '../scss/styles.scss';
import * as bootstrap from 'bootstrap';
import { addToCart, updateCartBadge } from './cart-service.js'; 
import { setupLayout } from './layout.js';
import { fetchProducts, fetchAllProducts, fetchProductById } from './product-service.js';
import { renderProductCards, renderProductDetail } from './ui-renderer.js';

document.addEventListener('DOMContentLoaded', () => {
    setupLayout(); 
    
    const logoElement = document.getElementById('header-logo');
    if (logoElement) {
        logoElement.src = logoImage;
    }
    
    // Initialize all page-specific logic
    initializeFeaturedProducts();
    initializeProductsPage();
    updateCartBadge(); 
    initializeProductDetailPage();
    initializeClickableCards(); // ADDED: Initialize the card click listener
});

async function initializeFeaturedProducts() {
    const productGrid = document.getElementById('featured-products-grid');
    if (!productGrid) return; 

    const products = await fetchProducts(4);
    renderProductCards(products, productGrid);
}

async function initializeProductsPage() {
    const productGrid = document.getElementById('all-products-grid');
    if (!productGrid) return;

    console.log("Attempting to fetch all products...");
    try {
        const products = await fetchAllProducts();
        console.log("Successfully fetched products:", products);

        if (products) {
            console.log(`Rendering ${products.length} products.`);
            renderProductCards(products, productGrid);
        } else {
            console.log("Received null or undefined products, rendering error.");
            grid.innerHTML = '<p class="text-center text-danger">خطا در دریافت اطلاعات محصولات.</p>';
        }

    } catch (error) {
        console.error("An error occurred in initializeProductsPage:", error);
        productGrid.innerHTML = '<p class="text-center text-danger">مشکلی در بارگذاری محصولات پیش آمد. لطفا کنسول را بررسی کنید.</p>';
    }
}
async function initializeProductDetailPage() {
    const productContainer = document.getElementById('product-detail-container');
    if (!productContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        const product = await fetchProductById(productId);
        renderProductDetail(product, productContainer);
    } else {
        productContainer.innerHTML = '<p class="text-center text-danger">خطا: شناسه محصول مشخص نشده است.</p>';
    }
}


function initializeClickableCards() {
    const grids = [
        document.getElementById('featured-products-grid'),
        document.getElementById('all-products-grid')
    ];

    grids.forEach(grid => {
        if (grid) {
            grid.addEventListener('click', (event) => {
                const addToCartButton = event.target.closest('.add-to-cart-btn');
                
                // If the 'add to cart' button was clicked, handle it
                if (addToCartButton) {
                    const productId = addToCartButton.dataset.id;
                    addToCart(productId);
                    return; // Stop further actions
                }

                // If another part of the card was clicked, navigate
                const card = event.target.closest('.product-card');
                if (card && card.dataset.href) {
                    window.location.href = card.dataset.href;
                }
            });
        }
    });
}


console.log("پروژه گالری هرا با موفقیت راه‌اندازی شد!");