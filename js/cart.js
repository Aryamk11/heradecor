/* js/cart.js - Refactored for Supabase */

function displayCartItems(allProducts) {
    const cartItemsList = document.getElementById('cart-items-list');
    const cartSummaryBox = document.getElementById('cart-summary-box');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!cartItemsList || !cartSummaryBox || allProducts.length === 0) {
        if (cartItemsList) cartItemsList.innerHTML = '<p class="cart-empty-message">سبد خرید شما خالی است.</p>';
        if (cartSummaryBox) cartSummaryBox.style.display = 'none';
        return;
    }

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p class="cart-empty-message">سبد خرید شما خالی است.</p>';
        cartSummaryBox.style.display = 'none';
        return;
    }

    cartItemsList.innerHTML = '';
    cartSummaryBox.style.display = 'block';
    let subtotal = 0;

    cart.forEach(item => {
        const product = allProducts.find(p => p.id === item.id);
        if (product) {
            const itemSubtotal = product.priceValue * item.quantity;
            subtotal += itemSubtotal;

            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${product.name}</h3>
                    <p class="cart-item-price">${product.price}</p>
                </div>
                <div class="cart-item-actions">
                    <input type="number" class="cart-item-quantity" value="${item.quantity}" min="1" data-id="${product.id}">
                    <button class="cart-item-remove" data-id="${product.id}">حذف</button>
                </div>
                <div class="cart-item-subtotal">${itemSubtotal.toLocaleString('fa-IR')} تومان</div>
            `;
            cartItemsList.appendChild(cartItemElement);
        }
    });

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

    cartItemsList.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id, 10);
            removeFromCart(id);
        });
    });

    cartItemsList.querySelectorAll('.cart-item-quantity').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id, 10);
            const quantity = parseInt(e.target.value, 10);
            updateCartQuantity(id, quantity);
        });
    });
}


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
    // No reload needed, UI will update dynamically if on cart page
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    window.location.reload(); // Reload to re-trigger main data fetch
}

function updateCartQuantity(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(item => item.id === productId);
    if (product && quantity > 0) {
        product.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        window.location.reload(); // Reload to re-trigger main data fetch
    }
}

function updateCartBadge() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}
