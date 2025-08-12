// js/header-template.js
(function() {
    const headerHTML = `
    <header class="site-header" id="site-header">
        <div class="container header-inner">
            <div class="brand">
                <a href="index.html" class="brand-link">
                    <h1 class="brand-title">کادو هنری <span class="brand-accent">هرا</span></h1>
                </a>
            </div>
            <nav class="header-nav" aria-label="منوی اصلی">
                <a href="#" id="search-toggle-btn" class="nav-link">
                    جستجو
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 21l-4.35-4.35" /><circle cx="11" cy="11" r="6" /></svg>
                </a>
                <a href="products.html" class="nav-link">محصولات</a>
                <a href="contact.html" class="nav-link">تماس با ما</a>
                <a href="about.html" class="nav-link">درباره ما</a>
            </nav>
            <div class="nav-spacer"></div>
            <div class="header-actions">
                <a href="#" class="nav-link signin-link">ورود</a>
                <a href="cart.html" class="cart-link">
                    <span>سبد خرید</span>
                    <span class="cart-badge" id="cart-count">0</span>
                </a>
            </div>
        </div>
        <div class="search-bar-container" id="search-bar-container">
            <form class="search-form" id="search-form" role="search">
                <input type="search" id="search-input" placeholder="نام محصول را وارد کنید..." />
                <button type="submit" class="search-submit-btn">جستجو</button>
                <button type="button" id="search-close-btn" class="search-close-btn">&times;</button>
            </form>
        </div>
    </header>
    `;

    const placeholder = document.getElementById('header-placeholder');
    if (placeholder) {
        placeholder.innerHTML = headerHTML;
    }
})();