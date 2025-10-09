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


async function initializeCartPage() {
    const itemsContainer = document.getElementById('cart-items-container');
    const summaryContainer = document.getElementById('cart-summary-container');
    const emptyCartBtn = document.getElementById('empty-cart-btn');
    if (!itemsContainer) return;

    let originalCart = [];
    let stagedCart = [];

    const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

    const onConfirm = async () => {
        const finalStagedCart = stagedCart.filter(item => item.status !== 'removed');
        const cartToSave = finalStagedCart.map(item => ({ id: String(item.id), quantity: item.quantity }));
        
        saveCart(cartToSave);

        const newDetailedCart = await getCartWithProductDetails();
        originalCart = deepCopy(newDetailedCart);
        stagedCart = deepCopy(newDetailedCart).map(item => ({ ...item, status: 'idle' }));
        
        updateCartBadge();
        refreshCartView();
    };

    const onCancel = () => {
        stagedCart = deepCopy(originalCart).map(item => ({ ...item, status: 'idle' }));
        refreshCartView();
    };

    const refreshCartView = () => {
        renderCartItems(stagedCart, itemsContainer, summaryContainer);
        
        const hasChanges = stagedCart.some(item => {
             const originalItem = originalCart.find(o => o.id == item.id);
             if (!originalItem && item.status !== 'removed') return true; 
             if (originalItem && item.status === 'removed') return true;
             return originalItem && item.quantity !== originalItem.quantity;
        }) || originalCart.length !== stagedCart.filter(item => item.status !== 'removed').length;

        const existingBar = document.getElementById('cart-update-bar');
        if (existingBar) existingBar.remove();

        if (hasChanges) {
            const barHTML = `
                <div id="cart-update-bar" class="mt-3 p-3 border rounded shadow-sm bg-light">
                    <div class="d-flex justify-content-between align-items-center">
                        <span>تغییراتی در سبد خرید شما ایجاد شده است.</span>
                        <div>
                            <button id="confirm-cart-update-btn" class="btn btn-success me-2">به‌روزرسانی سبد</button>
                            <button id="cancel-cart-update-btn" class="btn btn-secondary">انصراف</button>
                        </div>
                    </div>
                </div>`;
            itemsContainer.insertAdjacentHTML('afterend', barHTML);
            document.getElementById('confirm-cart-update-btn').addEventListener('click', onConfirm);
            document.getElementById('cancel-cart-update-btn').addEventListener('click', onCancel);
        }
    };

    const updateItemQuantity = (productId, newQuantity) => {
        const itemIndex = stagedCart.findIndex(item => item.id == productId);
        if (itemIndex === -1) return;

        const stagedItem = stagedCart[itemIndex];
        const originalItem = originalCart.find(item => item.id == productId);
        
        newQuantity = Math.max(0, newQuantity);

        if (newQuantity === 0) {
            stagedItem.status = 'removed';
        } else {
            stagedItem.quantity = newQuantity;
            if (stagedItem.status === 'removed') {
                stagedItem.status = 'idle'; 
            }

            if (originalItem && newQuantity > originalItem.quantity) {
                stagedItem.status = 'increase';
            } else if (originalItem && newQuantity < originalItem.quantity) {
                stagedItem.status = 'decrease';
            } else if (originalItem && newQuantity === originalItem.quantity) {
                stagedItem.status = 'idle';
            }
        }
        refreshCartView();
    };

    // --- Initial Load ---
    const detailedCart = await getCartWithProductDetails();
    originalCart = deepCopy(detailedCart);
    stagedCart = deepCopy(detailedCart).map(item => ({ ...item, status: 'idle' }));
    refreshCartView();

    // --- Event Listeners ---
    itemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        const parentItem = target.closest('.cart-item-row');
        if (!parentItem) return;
        const productId = parentItem.dataset.id;
        const item = stagedCart.find(i => i.id == productId);
        if (!item) return;

        if (target.matches('.cart-quantity-btn')) {
            const change = parseInt(target.dataset.change, 10);
            updateItemQuantity(productId, item.quantity + change);
        }

        if (target.matches('.cart-remove-btn')) {
            item.status = item.status === 'removed' ? 'idle' : 'removed';
            refreshCartView();
        }
    });

    itemsContainer.addEventListener('change', (event) => {
        const target = event.target;
        if (target.matches('.cart-quantity-input')) {
            const productId = target.closest('.cart-item-row')?.dataset.id;
            const newQuantity = parseInt(target.value, 10);
            if (!isNaN(newQuantity)) {
                updateItemQuantity(productId, newQuantity);
            }
        }
    });

    emptyCartBtn.addEventListener('click', () => {
        if (window.confirm('آیا از خالی کردن کامل سبد خرید خود اطمینان دارید؟')) {
            stagedCart.forEach(item => item.status = 'removed');
            refreshCartView();
        }
    });
}
console.log("پروژه گالری هرا با موفقیت راه‌اندازی شد!");