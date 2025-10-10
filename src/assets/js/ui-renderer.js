// src/assets/js/ui-renderer.js

// --- Helper function to format numbers as Persian currency ---
function formatPrice(value) {
    if (typeof value !== 'number') {
        return 'ناعدد'; // Return 'NaN' text if the input is not a number
    }
    return `${value.toLocaleString('fa-IR')} تومان`;
}

function renderCartSummary(stagedCartItems, originalCartItems, containerElement) {
    if (!containerElement) return;

    // Calculate totals for both staged and original carts
    const stagedTotal = stagedCartItems
        .filter(item => item.status !== 'removed')
        .reduce((total, item) => total + (item.priceValue * item.quantity), 0);

    const originalTotal = originalCartItems
        .reduce((total, item) => total + (item.priceValue * item.quantity), 0);

    const difference = stagedTotal - originalTotal;

    // Determine the breakdown of items in the staged cart
    const breakdownHTML = stagedCartItems
        .filter(item => item.status !== 'removed')
        .map(item => `
            <div class="d-flex justify-content-between align-items-center text-muted small">
                <span>${item.name}</span>
                <span>${item.quantity} &times; ${item.priceValue.toLocaleString('fa-IR')}</span>
            </div>
        `).join('');

    // Dynamically generate the difference HTML element if a difference exists
    let differenceHTML = '';
    if (difference !== 0) {
        const diffClass = difference > 0 ? 'text-success' : 'text-danger';
        const diffSign = difference > 0 ? '+' : '';
        differenceHTML = `
            <div class="d-flex justify-content-between align-items-center ${diffClass} small fw-bold">
                <span>تغییرات</span>
                <span>${diffSign}${formatPrice(difference)}</span>
            </div>
        `;
    }

    // Render the final summary card
    containerElement.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-body">
                <h5 class="card-title mb-3">خلاصه سفارش</h5>
                
                <div class="d-flex flex-column gap-2 mb-3">
                    ${breakdownHTML || '<p class="text-muted small">سبد شما برای محاسبه خالی است.</p>'}
                </div>
                
                <hr>

                ${differenceHTML}

                <div class="d-flex justify-content-between fw-bold fs-5">
                    <span>جمع کل نهایی</span>
                    <span>${formatPrice(stagedTotal)}</span>
                </div>
                
                <hr>
                
                <div class="mb-3">
                    <label for="order-notes" class="form-label">یادداشت سفارش</label>
                    <textarea class="form-control" id="order-notes" rows="3" placeholder="توضیحات اضافی..."></textarea>
                </div>
                <div class="d-grid">
                    <button class="btn btn-success btn-lg" ${stagedTotal === 0 ? 'disabled' : ''}>ادامه فرآیند خرید</button>
                </div>
            </div>
        </div>
    `;
}


export function renderCartItems(cartItems, originalCart, itemsContainer, summaryContainer) {
        if (!itemsContainer) return;

    renderCartSummary(cartItems, originalCart, summaryContainer);

        if (!cartItems || cartItems.length === 0) {
            itemsContainer.innerHTML = `<div class="card card-body text-center"><p class="mb-0">سبد خرید شما خالی است.</p></div>`;
            return;
        }

    const itemsHTML = cartItems.map(item => {
        let statusClass = '';
        if (item.status === 'increase') statusClass = 'is-changed-increase';
        else if (item.status === 'decrease') statusClass = 'is-changed-decrease';
        else if (item.status === 'removed') statusClass = 'is-removed';
        
        const disableMinus = item.status === 'removed';
        const removeButtonText = item.status === 'removed' ? 'لغو' : 'حذف';
        const removeButtonClass = item.status === 'removed' ? 'btn-warning' : 'btn-outline-danger';

        return `
        <div class="cart-item-row ${statusClass}" data-id="${item.id}">
            <div class="cart-item-image-wrapper">
                <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
            </div>

            <div class="cart-item-content">
                <div class="item-info">
                    <h6 class="item-name mb-1">${item.name}</h6>
                    <span class="item-price text-muted">${formatPrice(item.priceValue)}</span>
                </div>

                <div class="item-controls">
                    <div class="input-group input-group-sm item-quantity-controls">
                        <button class="btn btn-outline-secondary cart-quantity-btn" type="button" data-change="1">+</button>
                        <input type="number" class="form-control text-center cart-quantity-input" value="${item.quantity}" min="0" data-id="${item.id}">
                        <button class="btn btn-outline-secondary cart-quantity-btn" type="button" data-change="-1" ${disableMinus ? 'disabled' : ''}>-</button>
                    </div>
                    <div class="btn-group btn-group-sm mt-2" role="group">
                        <a href="/product-detail.html?id=${item.id}" class="btn btn-outline-secondary">مشاهده</a>
                        <button type="button" class="btn ${removeButtonClass} cart-remove-btn">${removeButtonText}</button>
                    </div>
                </div>
            </div>
        </div>
        `
    }).join('');

    itemsContainer.innerHTML = `<div class="card card-body">${itemsHTML}</div>`;
}
// NOTE: renderProductCards and other functions are omitted for brevity but should remain in your file.
// I am providing the full file content below to avoid confusion.

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
                    <p class="card-text">${product.description ? product.description.substring(0, 80) + '...' : ''}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <div class="btn-group">
                            <a href="/product-detail.html?id=${product.id}" class="btn btn-sm btn-outline-secondary">مشاهده</a>
                            <button type="button" class="btn btn-sm btn-primary add-to-cart-btn" data-id="${product.id}">افزودن به سبد</button>
                        </div>
                        <small class="text-muted">${formatPrice(product.priceValue)}</small>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

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
            <h3>${formatPrice(product.priceValue)}</h3>
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