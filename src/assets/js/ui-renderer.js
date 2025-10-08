// src/assets/js/ui-renderer.js

export function renderProductCards(products, gridElement) {
    if (!gridElement) return;

    if (!products || products.length === 0) {
        gridElement.innerHTML = '<p class="text-center text-muted">محصولی برای نمایش یافت نشد.</p>';
        return;
    }

    gridElement.innerHTML = products.map(product => `
        <div class="col">
            <div class="card shadow-sm product-card h-100" data-href="/product-detail.html?id=${product.id}">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description ? product.description.substring(0, 80) + '...' : ''}</p>                     <div class="d-flex justify-content-between align-items-center mt-auto">
                        <div class="btn-group">
                            <a href="/product-detail.html?id=${product.id}" class="btn btn-sm btn-outline-secondary">مشاهده</a>
                            <button type="button" class="btn btn-sm btn-primary add-to-cart-btn" data-id="${product.id}">افزودن به سبد</button>                        </div>
                        <small class="text-muted">${product.price}</small>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}
// ... The rest of the file (renderProductDetail) remains the same
export function renderProductDetail(product, containerElement) {
    if (!containerElement) return;

    if (!product) {
        containerElement.innerHTML = '<p class="text-center text-danger">اطلاعات محصول یافت نشد.</p>';
        return;
    }
    
    document.title = `${product.name} - فروشگاه هرا دکور`;

    containerElement.innerHTML = `
        <div class="col-md-6">
            <img src="${product.image}" class="img-fluid rounded" alt="${product.name}">
        </div>
        <div class="col-md-6">
            <h1 class="display-5">${product.name}</h1>
            <p class="lead">${product.description}</p>
            <hr>
            <h3>${product.price}</h3>
            <div class="d-grid gap-2 d-md-block mt-4">
                <button class="btn btn-primary btn-lg" type="button">
                    <i class="bi bi-cart-plus me-2"></i>افزودن به سبد خرید
                </button>
                <button class="btn btn-outline-secondary btn-lg" type="button">
                    <i class="bi bi-heart me-2"></i>افزودن به علاقه‌مندی‌ها
                </button>
            </div>
        </div>
    `;
}
/**
 * Renders the items in the shopping cart.
 * @param {Array} cartItems - An array of cart items with full product details.
 * @param {HTMLElement} containerElement - The container to inject the HTML into.
 */
export function renderCartItems(cartItems, containerElement) {
    if (!containerElement) return;

    if (!cartItems || cartItems.length === 0) {
        containerElement.innerHTML = `
            <div class="text-center">
                <p>سبد خرید شما خالی است.</p>
                <a href="/products.html" class="btn btn-primary">مشاهده محصولات</a>
            </div>
        `;
        return;
    }

    const itemsHTML = cartItems.map(item => `
        <div class="row border-bottom py-3 align-items-center">
            <div class="col-md-2">
                <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
            </div>
            <div class="col-md-4">
                <h5>${item.name}</h5>
            </div>
            <div class="col-md-2">
                <div class="input-group">
                    <button class="btn btn-outline-secondary" type="button">-</button>
                    <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
                    <button class="btn btn-outline-secondary" type="button">+</button>
                </div>
            </div>
            <div class="col-md-2 text-center">
                <span>${(item.price * item.quantity).toLocaleString('fa-IR')} تومان</span>
            </div>
            <div class="col-md-2 text-end">
                <button class="btn btn-outline-danger btn-sm">حذف</button>
            </div>
        </div>
    `).join('');

    const grandTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    containerElement.innerHTML = `
        ${itemsHTML}
        <div class="row mt-4">
            <div class="col text-end">
                <h3>مجموع کل: ${grandTotal.toLocaleString('fa-IR')} تومان</h3>
                <button class="btn btn-success btn-lg mt-2">ادامه فرآیند خرید</button>
            </div>
        </div>
    `;
}
/**
 * Renders skeleton placeholder cards into a grid.
 * @param {number} count - The number of skeleton cards to render.
 * @param {HTMLElement} gridElement - The container element to inject the HTML into.
 */
export function renderSkeletonCards(count, gridElement) {
    if (!gridElement) return;
    let skeletonsHTML = '';
    for (let i = 0; i < count; i++) {
        skeletonsHTML += `
            <div class="col">
                <div class="skeleton-card"></div>
            </div>
        `;
    }
    gridElement.innerHTML = skeletonsHTML;
}