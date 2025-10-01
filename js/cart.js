// js/cart.js - REFACTORED FOR DYNAMIC UPDATES
let stagedCart = [];
// This global function can be called from anywhere (e.g., product detail page)
function addToCart(productId, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ id: productId, quantity: quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

// This global function updates the badge in the header
function updateCartBadge() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}


// --- All functions below are specific to the cart page ---

async function initializeCartPage() {
    // This function only runs on the cart page, identified by the presence of 'cart-items-list'
    const cartItemsList = document.getElementById('cart-items-list');
    if (!cartItemsList) return;

    // Fetch all products once to get details like name, price, and image
    try {
        const { data: allProducts, error } = await supabase.from('products').select('*');
        if (error) throw error;
        const initialCart = JSON.parse(localStorage.getItem('cart')) || [];
        stagedCart = JSON.parse(JSON.stringify(initialCart)); // Create a deep copy 
        // Initial render of the cart
        renderCart(allProducts);

    } catch (error) {
        console.error("Failed to load product data for cart:", error);
        cartItemsList.innerHTML = `<p class="cart-empty-message error-message">خطا در بارگذاری اطلاعات محصولات.</p>`;
    }
    // --- Logic for the Update/Cancel Bar ---
    const confirmBtn = document.getElementById('confirm-cart-update-btn');
    const cancelBtn = document.getElementById('cancel-cart-update-btn');
    const updateBar = document.getElementById('cart-update-bar');

    if (confirmBtn && cancelBtn && updateBar) {
        // CONFIRM button: Save changes
        confirmBtn.addEventListener('click', async () => {
            // Filter out items marked for removal (quantity 0)
            const finalCart = stagedCart.filter(item => item.quantity > 0);

            // Save the updated cart to localStorage
            localStorage.setItem('cart', JSON.stringify(finalCart));
            
            // Re-assign stagedCart to the final version
            stagedCart = finalCart;

            // Update the header badge
            updateCartBadge();
            
            // Re-render the entire cart to reflect the final state
            const { data: allProducts } = await supabase.from('products').select('*'); // Re-fetch product data
            renderCart(allProducts);
        });

        // CANCEL button: Discard changes
        cancelBtn.addEventListener('click', async () => {
            // Discard staged changes by reloading the original cart from localStorage
            const originalCart = JSON.parse(localStorage.getItem('cart')) || [];
            stagedCart = JSON.parse(JSON.stringify(originalCart)); // Deep copy

            // Re-render the cart with the original, unchanged data
            const { data: allProducts } = await supabase.from('products').select('*'); // Re-fetch product data
            renderCart(allProducts);
        });
    }
}

function renderCart(allProducts) {
    const cartItemsList = document.getElementById('cart-items-list');
    const cartSummaryBox = document.getElementById('cart-summary-box');
    let cart = stagedCart; 
    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p class="cart-empty-message">سبد خرید شما خالی است.</p>';
        cartSummaryBox.style.display = 'none';
        return;
    }

    cartItemsList.innerHTML = ''; // Clear previous content
    cartSummaryBox.style.display = 'block';
    let subtotal = 0;

    cart.forEach(item => {
        const product = allProducts.find(p => p.id === item.id);
        if (product) {
            const itemSubtotal = product.priceValue * item.quantity;
            subtotal += itemSubtotal;

            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.dataset.productId = product.id; // Add for easier selection
            cartItemElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${product.name}</h3>
                    <p class="cart-item-price">${product.price}</p>
                </div>
                <div class="cart-item-actions">
                    <input type="number" class="cart-item-quantity" value="${item.quantity}" min="1">
                    <button class="cart-item-remove">حذف</button>
                </div>
                <div class="cart-item-subtotal">${itemSubtotal.toLocaleString('fa-IR')} تومان</div>
            `;
            cartItemsList.appendChild(cartItemElement);
        }
    });

    // Update the summary box
    cartSummaryBox.innerHTML = `
        <h2>خلاصه سفارش</h2>
        <div class="summary-row">
            <span>جمع کل</span>
            <span>${subtotal.toLocaleString('fa-IR')} تومان</span>
        </div>
        <hr>
        <div class="summary-row total-row">
            <span>مبلغ قابل پرداخت</span>
            <span>${subtotal.toLocaleString('fa-IR')} تومان</span>
        </div>
        <a href="checkout.html" class="btn btn-primary checkout-btn">نهایی کردن خرید</a>
    `;

    // Add event listeners AFTER rendering the items
    addCartActionListeners(allProducts);
}

function addCartActionListeners(allProducts) {
    // A function to show the confirmation bar (we will create this UI next)
    const showUpdateBar = () => {
        const updateBar = document.getElementById('cart-update-bar');
        if (updateBar) updateBar.style.display = 'flex';
    };

    // A helper to update the subtotal for a single line item
    const updateLineItemSubtotal = (itemElement, product, quantity) => {
        const subtotalElement = itemElement.querySelector('.cart-item-subtotal');
        if (subtotalElement) {
            const itemSubtotal = product.priceValue * quantity;
            subtotalElement.textContent = `${itemSubtotal.toLocaleString('fa-IR')} تومان`;
        }
    };

    document.querySelectorAll('.cart-item').forEach(itemElement => {
        const productId = parseInt(itemElement.dataset.productId, 10);
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;
        
        const removeButton = itemElement.querySelector('.cart-item-remove');
        const quantityInput = itemElement.querySelector('.cart-item-quantity');

        // --- Remove Button Logic ---
        removeButton.addEventListener('click', () => {
            const itemInStagedCart = stagedCart.find(item => item.id === productId);
            if (itemInStagedCart) {
                // Mark for deletion by setting quantity to 0
                itemInStagedCart.quantity = 0; 
            }
            
            // Apply visual feedback
            itemElement.classList.add('is-removed');
            quantityInput.disabled = true;
            showUpdateBar();
        });
        
        // --- Quantity Input Logic ---
        quantityInput.addEventListener('change', (e) => {
            const newQuantity = parseInt(e.target.value, 10);
            const itemInStagedCart = stagedCart.find(item => item.id === productId);

            if (itemInStagedCart && newQuantity > 0) {
                // Update the temporary state
                itemInStagedCart.quantity = newQuantity;
                
                // Apply visual feedback and update line total
                itemElement.classList.add('is-changed');
                itemElement.classList.remove('is-removed'); // In case user "un-removes" by changing quantity
                updateLineItemSubtotal(itemElement, product, newQuantity);
                showUpdateBar();
            } else if (newQuantity <= 0) {
                // If user sets quantity to 0, treat it as a removal
                removeButton.click();
            }
        });
    });
}