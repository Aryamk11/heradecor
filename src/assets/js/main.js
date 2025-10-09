/* src/assets/js/main.js */

// All necessary imports, consolidated into one block to prevent errors
import logoImage from '../images/log.webp';
import '../scss/styles.scss';
import * as bootstrap from 'bootstrap';

import { setupLayout } from './layout.js';
import { fetchProducts, fetchAllProducts, fetchProductById } from './product-service.js';
import { renderProductCards, renderProductDetail, renderCartItems, renderSkeletonCards } from './ui-renderer.js';
import { addToCart, updateCartBadge, getCartWithProductDetails, saveCart } from './cart-service.js';

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
// Replace initializeCartPage in main.js one last time.
async function initializeCartPage() {
    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer) return;

    let updateBar, confirmBtn, cancelBtn;
    let originalCart = [];
    let stagedCart = [];

    const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

    // --- Event Handlers (defined once) ---
    const onConfirm = async () => {
        const finalStagedCart = stagedCart.filter(item => item.status !== 'removed');
        const cartToSave = finalStagedCart.map(item => ({ id: String(item.id), quantity: item.quantity }));
        
        saveCart(cartToSave);

        // Fetch the new state from the source of truth (localStorage)
        const newDetailedCart = await getCartWithProductDetails();
        originalCart = deepCopy(newDetailedCart);
        stagedCart = deepCopy(newDetailedCart).map(item => ({ ...item, status: 'idle' }));
        
        if (updateBar) updateBar.style.display = 'none';
        updateCartBadge();
        refreshCartView();
    };

    const onCancel = () => {
        stagedCart = deepCopy(originalCart).map(item => ({ ...item, status: 'idle' }));
        if (updateBar) updateBar.style.display = 'none';
        refreshCartView();
    };

    const refreshCartView = () => {
        renderCartItems(stagedCart, cartContainer);
        // Re-query and re-bind listeners after each render
        updateBar = document.getElementById('cart-update-bar');
        confirmBtn = document.getElementById('confirm-cart-update-btn');
        cancelBtn = document.getElementById('cancel-cart-update-btn');
        
        if (confirmBtn && cancelBtn) {
            confirmBtn.addEventListener('click', onConfirm);
            cancelBtn.addEventListener('click', onCancel);
        }
    };

    // --- Initial Load ---
    const detailedCart = await getCartWithProductDetails();
    originalCart = deepCopy(detailedCart);
    stagedCart = deepCopy(detailedCart).map(item => ({ ...item, status: 'idle' }));
    refreshCartView();

    // --- Main Event Delegation for Cart Items ---
    cartContainer.addEventListener('click', (event) => {
        const target = event.target;
        const productId = target.closest('.cart-item')?.dataset.id;
        if (!productId) return;

        let stagedItemIndex = stagedCart.findIndex(item => item.id == productId);
        if (stagedItemIndex === -1) return;

        const stagedItem = stagedCart[stagedItemIndex];
        const originalItem = originalCart.find(item => item.id == productId);
        
        if (target.matches('.cart-quantity-btn')) {
            const change = parseInt(target.dataset.change, 10);
            
            // UNDO-DELETE LOGIC: If '+' is clicked on a removed item, restore it.
            if (stagedItem.status === 'removed' && change > 0) {
                stagedItem.status = 'idle'; // It's no longer 'removed'
                // The rest of the logic will handle its quantity and status below
            }
            
            const newQuantity = stagedItem.quantity + change;

            if (newQuantity <= 0) {
                stagedItem.status = 'removed';
            } else {
                stagedItem.quantity = newQuantity;
                stagedItem.status = 'idle'; // Reset status first
                if (originalItem && newQuantity > originalItem.quantity) {
                    stagedItem.status = 'increase';
                } else if (originalItem && newQuantity < originalItem.quantity) {
                    stagedItem.status = 'decrease';
                }
            }
        }

        if (target.matches('.cart-remove-btn')) {
             // UNDO-DELETE LOGIC: Pressing delete again on a removed item restores it
            if (stagedItem.status === 'removed') {
                 stagedItem.status = 'idle';
            } else {
                 stagedItem.status = 'removed';
            }
        }
        
        const hasChanges = stagedCart.some(item => {
             const original = originalCart.find(o => o.id == item.id);
             if (!original) return true; 
             return item.quantity !== original.quantity || item.status === 'removed';
        }) || stagedCart.length !== originalCart.length;

        refreshCartView();

        if (updateBar) {
            updateBar.style.display = hasChanges ? 'block' : 'none';
        }
    });
}

console.log("پروژه گالری هرا با موفقیت راه‌اندازی شد!");