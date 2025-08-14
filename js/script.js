/* js/script.js - Final Version w/ Checkout & Contact Logic */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ELEMENT SELECTIONS ---
    const productGrid = document.getElementById('product-grid');
    const featuredProductGrid = document.getElementById('featured-product-grid');
    const productModal = document.getElementById('product-modal');
    const filterBar = document.getElementById('filter-bar');
    const pageTitle = document.getElementById('products-page-title');
    const cartItemsList = document.getElementById('cart-items-list');
    const checkoutForm = document.getElementById('checkout-form');
    const contactForm = document.getElementById('contact-form');


    // --- 2. CORE FUNCTIONS ---

    function displayProducts(productList, gridElement) {
        if (!gridElement) return;
        gridElement.innerHTML = '';
        if (productList.length === 0) {
            gridElement.innerHTML = `<p class="grid-empty-message">محصولی یافت نشد.</p>`;
            return;
        }
        productList.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-card-image-container"><img src="${product.image}" alt="${product.name}" loading="lazy"></div>
                <div class="product-card-content"><h3>${product.name}</h3><p class="price">${product.price}</p></div>
            `;
            card.addEventListener('click', () => showProductDetail(product));
            gridElement.appendChild(card);
        });
    }
    
    function showNotification(message) {
        let notification = document.getElementById('notification-toast');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification-toast';
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    }

    function showProductDetail(product) {
        if (!productModal) return;
        productModal.querySelector('#modal-image').src = product.image;
        productModal.querySelector('#modal-title').textContent = product.name;
        productModal.querySelector('#modal-price').textContent = product.price;
        productModal.querySelector('#modal-material').textContent = product.material;
        productModal.querySelector('#modal-dimensions').textContent = product.dimensions;
        productModal.querySelector('#modal-description').textContent = product.description;

        const modalTextContent = productModal.querySelector('.modal-text-content');
        let modalActions = modalTextContent.querySelector('.modal-actions');
        if (modalActions) modalActions.remove();
        
        modalActions = document.createElement('div');
        modalActions.className = 'modal-actions';
        const addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'btn btn-primary';
        addToCartBtn.textContent = 'افزودن به سبد خرید';
        addToCartBtn.onclick = () => {
            if (typeof addToCart === 'function') {
                addToCart(product.id);
                showNotification(`"${product.name}" به سبد خرید اضافه شد`);
            }
            closeModal();
        };
        modalActions.appendChild(addToCartBtn);
        modalTextContent.appendChild(modalActions);
        productModal.style.display = 'flex';
    }

    function closeModal() {
        if (productModal) productModal.style.display = 'none';
    }

    function updateActiveFilterButton(activeButton) {
        if (!filterBar) return;
        filterBar.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }

    function setActiveNavLink() {
        const currentPage = window.location.pathname.split("/").pop() || 'index.html';
        const effectivePage = (currentPage === '') ? 'index.html' : currentPage;
        document.querySelectorAll('.header-nav a.nav-link, a.cart-link').forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href').replace('./', '');
            if (linkHref === effectivePage) link.classList.add('active');
        });
    }

    // --- 3. EVENT LISTENERS & INITIALIZATION ---

    function attachUniversalListeners() {
        if (productModal) {
            productModal.querySelector('.close-btn').addEventListener('click', closeModal);
            productModal.addEventListener('click', (event) => {
                if (event.target === productModal) closeModal();
            });
        }
    }

    function initializeProductsPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        const categoryQuery = urlParams.get('category');
        let productsToDisplay = products;

        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            productsToDisplay = products.filter(p => p.name.toLowerCase().includes(lowerCaseQuery) || p.tags.some(t => t.toLowerCase().includes(lowerCaseQuery)));
            if (pageTitle) pageTitle.textContent = `نتایج جستجو برای: "${searchQuery}"`;
        } else if (categoryQuery) {
            productsToDisplay = products.filter(p => p.category === categoryQuery);
            if (pageTitle) pageTitle.textContent = categoryQuery;
            const activeButton = filterBar.querySelector(`[data-category="${categoryQuery}"]`);
            if (activeButton) updateActiveFilterButton(activeButton);
        } else {
            if (pageTitle) pageTitle.textContent = 'همه محصولات';
        }
        displayProducts(productsToDisplay, productGrid);

        if (filterBar) {
            filterBar.addEventListener('click', (e) => {
                if (e.target.matches('.filter-btn')) {
                    const button = e.target;
                    const category = button.dataset.category;
                    updateActiveFilterButton(button);
                    if (pageTitle) pageTitle.textContent = button.textContent;
                    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
                    displayProducts(filtered, productGrid);
                }
            });
        }
    }

    function initializeCheckoutPage() {
        if (!checkoutForm) return;
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real app, you would validate fields and process payment here.
            localStorage.removeItem('cart'); // Clear the cart
            window.location.href = 'order-confirmation.html'; // Redirect to thank you page
        });
    }

    function initializeContactPage() {
        if (!contactForm) return;
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const container = document.getElementById('contact-section-container');
            if (container) {
                container.innerHTML = `
                    <h2 class="section-title">پیام شما ارسال شد!</h2>
                    <p style="text-align: center; font-size: 1.2rem;">از تماس شما سپاسگزاریم. به زودی پاسخ خواهیم داد.</p>
                `;
            }
        });
    }
    
    // --- 4. SCRIPT EXECUTION ROUTER ---
    
    function main() {
        // Run on all pages
        setActiveNavLink();
        attachUniversalListeners();
        if (typeof updateCartBadge === 'function') updateCartBadge();

        // Page-specific logic
        if (featuredProductGrid) displayProducts(products.slice(0, 5), featuredProductGrid);
        if (productGrid) initializeProductsPage();
        if (cartItemsList && typeof displayCartItems === 'function') displayCartItems();
        if (checkoutForm) initializeCheckoutPage();
        if (contactForm) initializeContactPage();
    }

    main();
});