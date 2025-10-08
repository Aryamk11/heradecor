/* src/assets/js/main.js */

import logoImage from '../images/log.webp';
import '../scss/styles.scss';
import * as bootstrap from 'bootstrap';

import { setupLayout } from './layout.js';
// MODIFIED: Import new functions
import { fetchProducts, fetchAllProducts, fetchProductById } from './product-service.js';
import { renderProductCards, renderProductDetail } from './ui-renderer.js';

// Main application initialization logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject header/footer and highlight active nav link
    setupLayout(); 
    
    // 2. Set header logo (must be after layout is injected)
    const logoElement = document.getElementById('header-logo');
    if (logoElement) {
        logoElement.src = logoImage;
    }
    
    // 3. Initialize page-specific logic
    initializeFeaturedProducts();
    initializeProductsPage();
    initializeProductDetailPage(); // ADDED: Call the new function
});

/**
 * Fetches and displays featured products on the homepage.
 */
async function initializeFeaturedProducts() {
    const productGrid = document.getElementById('featured-products-grid');
    if (!productGrid) return; 

    const products = await fetchProducts(4);
    renderProductCards(products, productGrid);
}

/**
 * Fetches and displays all products on the products page.
 */
async function initializeProductsPage() {
    const productGrid = document.getElementById('all-products-grid');
    if (!productGrid) return;

    const products = await fetchAllProducts();
    renderProductCards(products, productGrid);
}

/**
 * Fetches and displays a single product on the product detail page.
 */
async function initializeProductDetailPage() {
    const productContainer = document.getElementById('product-detail-container');
    if (!productContainer) return;

    // Get the product ID from the URL query string
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        const product = await fetchProductById(productId);
        renderProductDetail(product, productContainer);
    } else {
        productContainer.innerHTML = '<p class="text-center text-danger">خطا: شناسه محصول مشخص نشده است.</p>';
    }
}

console.log("پروژه گالری هرا با موفقیت راه‌اندازی شد!");