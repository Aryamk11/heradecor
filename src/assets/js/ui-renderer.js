// src/assets/js/ui-renderer.js

/**
 * Renders product cards into a specified grid container.
 * @param {Array} products - An array of product objects to display.
 * @param {HTMLElement} gridElement - The container element to inject the HTML into.
 */
export function renderProductCards(products, gridElement) {
    if (!gridElement) return;

    if (!products || products.length === 0) {
        gridElement.innerHTML = '<p class="text-center text-muted">محصولی برای نمایش یافت نشد.</p>';
        return;
    }

    gridElement.innerHTML = products.map(product => `
        <div class="col">
            <div class="card shadow-sm product-card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description.substring(0, 80)}...</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <div class="btn-group">
                            <a href="/product-detail.html?id=${product.id}" class="btn btn-sm btn-outline-secondary">مشاهده</a>
                            <button type="button" class="btn btn-sm btn-primary">افزودن به سبد</button>
                        </div>
                        <small class="text-muted">${product.price}</small>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Renders the full details of a single product into a container.
 * @param {Object} product - The product object to display.
 * @param {HTMLElement} containerElement - The container to inject the HTML into.
 */
export function renderProductDetail(product, containerElement) {
    if (!containerElement) return;

    if (!product) {
        containerElement.innerHTML = '<p class="text-center text-danger">اطلاعات محصول یافت نشد.</p>';
        return;
    }
    
    // Update the page title
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