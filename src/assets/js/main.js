/* src/assets/js/main.js */

// All necessary imports, consolidated into one block to prevent errors
import logoImage from '../images/log.webp';
import '../scss/styles.scss';
import * as bootstrap from 'bootstrap';

import { setupLayout } from './layout.js';
import { fetchProducts, fetchAllProducts, fetchProductById } from './product-service.js';
import { renderProductCards, renderProductDetail, renderCartItems, renderSkeletonCards } from './ui-renderer.js';
import { addToCart, updateCartBadge, getCartWithProductDetails } from './cart-service.js';

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
    initializeCartPage(); // ADD THIS LINE
    initializeClickableCards();
});

async function initializeFeaturedProducts() {
    const productGrid = document.getElementById('featured-products-grid');
    if (!productGrid) return; 

    renderSkeletonCards(4, productGrid); // Show 4 skeletons immediately

    const products = await fetchProducts(4);
    renderProductCards(products, productGrid); // Replace skeletons with real data
}

async function initializeProductsPage() {
    const productGrid = document.getElementById('all-products-grid');
    if (!productGrid) return;

    renderSkeletonCards(8, productGrid); // Show 8 skeletons immediately

    // The rest of this function remains the same, but we can remove the extra logging
    try {
        const products = await fetchAllProducts();
        renderProductCards(products, productGrid); // Replace skeletons with real data
    } catch (error) {
        console.error("An error occurred in initializeProductsPage:", error);
        productGrid.innerHTML = '<p class="text-center text-danger">An error occurred while loading products.</p>';
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
async function initializeCartPage() {
    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer) return; // Only run this logic on the cart page

    const detailedCart = await getCartWithProductDetails();
    renderCartItems(detailedCart, cartContainer);
}

console.log("پروژه گالری هرا با موفقیت راه‌اندازی شد!");