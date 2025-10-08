/* src/assets/js/main.js */

import logoImage from '../images/log.webp';
import '../scss/styles.scss';
import * as bootstrap from 'bootstrap';
import { fetchProducts } from './product-service.js';
import { renderProductCards } from './ui-renderer.js';

// Main application initialization logic
document.addEventListener('DOMContentLoaded', () => {
    // Set header logo
    const logoElement = document.getElementById('header-logo');
    if (logoElement) {
        logoElement.src = logoImage;
    }
    
    // Initialize featured products section on the homepage
    initializeFeaturedProducts();
});

/**
 * Fetches and displays featured products on the homepage.
 */
async function initializeFeaturedProducts() {
    const productGrid = document.getElementById('featured-products-grid');
    if (!productGrid) return; // Only run on the homepage

    // Fetch products using the dedicated service
    const products = await fetchProducts(4);
    
    // Render the products using the dedicated UI function
    renderProductCards(products, productGrid);
}

console.log("پروژه گالری هرا با موفقیت راه‌اندازی شد!");