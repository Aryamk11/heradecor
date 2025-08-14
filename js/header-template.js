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

            <!-- Desktop Navigation -->
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

            <!-- Mobile Menu Button -->
            <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="باز کردن منو">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
        </div>

        <!-- Search Bar (Remains the same) -->
        <div class="search-bar-container" id="search-bar-container">
            <form class="search-form" id="search-form" role="search">
                <input type="search" id="search-input" placeholder="نام محصول را وارد کنید..." />
                <button type="submit" class="search-submit-btn">جستجو</button>
                <button type="button" id="search-close-btn" class="search-close-btn">&times;</button>
            </form>
        </div>

        <!-- Mobile Navigation Overlay -->
        <div class="mobile-nav-overlay" id="mobile-nav-overlay">
            <nav class="mobile-nav">
                <a href="index.html" class="nav-link">صفحه اصلی</a>
                <a href="products.html" class="nav-link">محصولات</a>
                <a href="about.html" class="nav-link">درباره ما</a>
                <a href="contact.html" class="nav-link">تماس با ما</a>
                <hr>
                <a href="#" class="nav-link signin-link">ورود</a>
            </nav>
        </div>
    </header>
    `;

    const placeholder = document.getElementById('header-placeholder');
    if (placeholder) {
        placeholder.innerHTML = headerHTML;
    }
})();
