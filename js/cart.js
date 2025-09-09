// js/cart.js - REFACTORED FOR DYNAMIC UPDATES

// This global function can be called from anywhere (e.g., product detail page)
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ id: productId, quantity: 1 });
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
        
        // Initial render of the cart
        renderCart(allProducts);

    } catch (error) {
        console.error("Failed to load product data for cart:", error);
        cartItemsList.innerHTML = `<p class="cart-empty-message error-message">خطا در بارگذاری اطلاعات محصولات.</p>`;
    }
}

function renderCart(allProducts) {
    const cartItemsList = document.getElementById('cart-items-list');
    const cartSummaryBox = document.getElementById('cart-summary-box');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
    document.querySelectorAll('.cart-item').forEach(itemElement => {
        const productId = parseInt(itemElement.dataset.productId, 10);
        
        const removeButton = itemElement.querySelector('.cart-item-remove');
        removeButton.addEventListener('click', () => {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartBadge();
            renderCart(allProducts); // Re-render without reloading page
        });
        
        const quantityInput = itemElement.querySelector('.cart-item-quantity');
        quantityInput.addEventListener('change', (e) => {
            const newQuantity = parseInt(e.target.value, 10);
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const productInCart = cart.find(item => item.id === productId);

            if (productInCart && newQuantity > 0) {
                productInCart.quantity = newQuantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartBadge();
                renderCart(allProducts); // Re-render without reloading page
            }
        });
    });
}