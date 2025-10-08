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
                            <button type="button" class="btn btn-sm btn-outline-secondary">مشاهده</button>
                            <button type="button" class="btn btn-sm btn-primary">افزودن به سبد</button>
                        </div>
                        <small class="text-muted">${product.price}</small>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}