// js/header-template.js
(function() {
    const headerHTML = `
    <header class="site-header" id="site-header">
        <div class="container header-inner">
            <div class="header-group-right">
                <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="باز کردن منو">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
                </button>
                <div class="brand">
                    <a href="index.html" class="brand-link">
                        <h1 class="brand-title">کادو هنری <span class="brand-accent">هرا</span></h1>
                    </a>
                </div>
                <nav class="header-nav" aria-label="منوی اصلی">
                    <a href="#" id="search-toggle-btn" class="nav-link">جستجو</a>
                    <a href="products.html" class="nav-link">محصولات</a>
                    <a href="contact.html" class="nav-link">تماس با ما</a>
                    <a href="about.html" class="nav-link">درباره ما</a>
                </nav>
            </div>

            <div class="header-group-left">
                <div class="header-actions">
                    <a href="#" class="nav-link signin-link desktop-only">ورود</a>
                    <a href="cart.html" class="cart-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        <span class="cart-badge" id="cart-count">0</span>
                    </a>
                </div>
            </div>
        </div>

        <div class="search-bar-container" id="search-bar-container">
            <form class="search-form" id="search-form" role="search">
                <input type="search" id="search-input" placeholder="نام محصول را وارد کنید..." />
                <button type="submit" class="search-submit-btn">جستجو</button>
                <button type="button" id="search-close-btn" class="search-close-btn">&times;</button>
            </form>
        </div>
        <div class="mobile-nav-overlay" id="mobile-nav-overlay">
            <nav class="mobile-nav" id="mobile-nav">
                <div class="mobile-nav-header">
                    <h3 class="brand-accent">منو</h3>
                    <button class="mobile-nav-close" id="mobile-nav-close" aria-label="بستن منو">&times;</button>
                </div>
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