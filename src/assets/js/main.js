/* src/assets/js/main.js */

import logoImage from '../images/log.webp';
import '../scss/styles.scss';
import * as bootstrap from 'bootstrap';

import { setupLayout } from './layout.js';
import { fetchProducts, fetchAllProducts } from './product-service.js';
import { renderProductCards } from './ui-renderer.js';

// Main application initialization logic
document.addEventListener('DOMContentLoaded', () => { // Removed 'async'
    // 1. Inject header/footer and highlight active nav link
    setupLayout(); // Removed 'await'
    
    // 2. Set header logo (must be after layout is injected)
    const logoElement = document.getElementById('header-logo');
    if (logoElement) {
        logoElement.src = logoImage;
    }
    
    // 3. Initialize page-specific logic
    initializeFeaturedProducts();
    initializeProductsPage();
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

console.log("پروژه گالری هرا با موفقیت راه‌اندازی شد!");