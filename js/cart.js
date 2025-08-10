/* --- js/cart.js (Corrected & Complete) --- */

/**
 * Formats a number into Persian currency format.
 * @param {number} number The number to format.
 * @returns {string} The formatted currency string.
 */
const toPersianCurrency = (number) => {
    const formattedNumber = new Intl.NumberFormat('fa-IR').format(number);
    return `${formattedNumber} تومان`;
};

// Initialize cart from localStorage or as an empty array
let cart = JSON.parse(localStorage.getItem('heraArtShopCart')) || [];

/**
 * Saves the current cart state to localStorage.
 */
const saveCart = () => {
    localStorage.setItem('heraArtShopCart', JSON.stringify(cart));
};

/**
 * Adds a product to the cart or increments its quantity.
 * @param {number} productId The ID of the product to add.
 */
const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    saveCart();
    updateCartBadge();
    showNotification(`«${product.name}» به سبد خرید اضافه شد.`);
};

/**
 * Updates the quantity of a specific item in the cart.
 * @param {number} productId The ID of the product to update.
 * @param {number} quantity The new quantity.
 */
const updateQuantity = (productId, quantity) => {
    const itemInCart = cart.find(item => item.id === productId);
    if (!itemInCart) return;

    if (quantity <= 0) {
        removeFromCart(productId);
    } else {
        itemInCart.quantity = quantity;
        saveCart();
        // Re-render the entire cart page to reflect changes
        if (document.getElementById('cart-items-list')) {
            displayCartItems();
        }
    }
};

/**
 * Removes an item completely from the cart.
 * @param {number} productId The ID of the product to remove.
 */
const removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    // Re-render the cart page and update the header badge
    if (document.getElementById('cart-items-list')) {
        displayCartItems();
    }
    updateCartBadge();
};

/**
 * Calculates the total number of items in the cart.
 * @returns {number} The total item count.
 */
const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Calculates the total price of all items in the cart.
 * @returns {number} The total price.
 */
const getCartTotal = () => {
    return cart.reduce((total, cartItem) => {
        const product = products.find(p => p.id === cartItem.id);
        // Ensure product exists and has a priceValue to avoid errors
        if (product && product.priceValue) {
            return total + (product.priceValue * cartItem.quantity);
        }
        return total;
    }, 0);
};

/**
 * Updates the cart badge count in the header.
 */
const updateCartBadge = () => {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = getCartItemCount();
    }
};

/**
 * Renders all items from the cart onto the cart page.
 */
const displayCartItems = () => {
    const cartItemsList = document.getElementById('cart-items-list');
    const cartSummary = document.getElementById('cart-summary');
    // This function should only run on the cart page
    if (!cartItemsList) return;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p class="cart-empty-message">سبد خرید شما خالی است.</p>';
        cartSummary.style.display = 'none'; // Hide summary if cart is empty
        return;
    }

    cartSummary.style.display = 'block';
    cartItemsList.innerHTML = ''; // Clear previous content

    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (!product) return;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${product.name}</h3>
                <p class="cart-item-price">${product.price}</p>
            </div>
            <div class="cart-item-actions">
                <input type="number" value="${cartItem.quantity}" min="1" class="cart-item-quantity" data-id="${product.id}">
                <button class="cart-item-remove" data-id="${product.id}">&times; حذف</button>
            </div>
            <div class="cart-item-subtotal">
                ${toPersianCurrency(product.priceValue * cartItem.quantity)}
            </div>
        `;
        cartItemsList.appendChild(itemElement);
    });

    // Add event listeners after creating the elements
    document.querySelectorAll('.cart-item-quantity').forEach(input => {
        input.addEventListener('change', (e) => {
            const productId = Number(e.target.dataset.id);
            const newQuantity = parseInt(e.target.value, 10);
            updateQuantity(productId, newQuantity);
        });
    });

    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = Number(e.target.dataset.id);
            removeFromCart(productId);
        });
    });
    
    updateCartSummary();
};

/**
 * Updates the order summary section on the cart page.
 */
const updateCartSummary = () => {
    const total = getCartTotal();
    const summaryTotal = document.getElementById('summary-total');
    const summaryGrandTotal = document.getElementById('summary-grand-total');
    if(summaryTotal && summaryGrandTotal) {
        summaryTotal.textContent = toPersianCurrency(total);
        summaryGrandTotal.textContent = toPersianCurrency(total);
    }
};

/**
 * Shows a temporary notification message on the screen.
 * @param {string} message The message to display.
 */
const showNotification = (message) => {
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
};
