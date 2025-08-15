/* js/cart.js - Refactored for Firebase */

// This function is no longer needed as we will fetch from Firestore directly
// function getProductDetails(productId) { ... }

async function displayCartItems() {
    const cartItemsList = document.getElementById('cart-items-list');
    const cartSummaryBox = document.getElementById('cart-summary-box');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!cartItemsList || !cartSummaryBox) return;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p class="cart-empty-message">سبد خرید شما خالی است.</p>';
        cartSummaryBox.style.display = 'none';
        return;
    }

    cartItemsList.innerHTML = ''; // Clear for fresh render
    cartSummaryBox.style.display = 'block';
    let subtotal = 0;

    // Use Promise.all to fetch all product details in parallel for efficiency
    const productPromises = cart.map(item => 
        db.collection('products').doc(String(item.id)).get()
    );
    const productDocs = await Promise.all(productPromises);

    cart.forEach((item, index) => {
        const productDoc = productDocs[index];
        if (productDoc.exists) {
            const product = { id: productDoc.id, ...productDoc.data() };
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

    // Update summary
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

    // Add event listeners for remove and quantity change
    cartItemsList.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            removeFromCart(id);
        });
    });

    cartItemsList.querySelectorAll('.cart-item-quantity').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = e.target.dataset.id;
            const quantity = parseInt(e.target.value, 10);
            updateCartQuantity(id, quantity);
        });
    });
}

// ... (The rest of cart.js: addToCart, removeFromCart, updateCartQuantity, updateCartBadge)
// These functions do not need to be changed as they only interact with localStorage.

function addToCart(productId) { /* ... unchanged ... */ }
function removeFromCart(productId) { /* ... unchanged ... */ }
function updateCartQuantity(productId, quantity) { /* ... unchanged ... */ }
function updateCartBadge() { /* ... unchanged ... */ }

// Helper functions (minified to save space)
function addToCart(t){let e=JSON.parse(localStorage.getItem("cart"))||[],r=e.find(e=>e.id===t);r?r.quantity++:e.push({id:t,quantity:1}),localStorage.setItem("cart",JSON.stringify(e)),updateCartBadge(),displayCartItems()}function removeFromCart(t){let e=JSON.parse(localStorage.getItem("cart"))||[];e=e.filter(e=>e.id!==t),localStorage.setItem("cart",JSON.stringify(e)),updateCartBadge(),displayCartItems()}function updateCartQuantity(t,e){let r=JSON.parse(localStorage.getItem("cart"))||[],a=r.find(e=>e.id===t);a&&e>0&&(a.quantity=e,localStorage.setItem("cart",JSON.stringify(r)),updateCartBadge(),displayCartItems())}function updateCartBadge(){const t=document.getElementById("cart-count");if(t){const e=JSON.parse(localStorage.getItem("cart"))||[];let r=0;e.forEach(t=>r+=t.quantity),t.textContent=r}}
