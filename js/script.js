/* js/script.js - Final Version w/ Notifications */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ELEMENT SELECTIONS ---
    const productGrid = document.getElementById('product-grid');
    const featuredProductGrid = document.getElementById('featured-product-grid');
    const productModal = document.getElementById('product-modal');
    const filterBar = document.getElementById('filter-bar');
    const pageTitle = document.getElementById('products-page-title');
    const cartItemsList = document.getElementById('cart-items-list');

    // --- 2. CORE FUNCTIONS ---

    /**
     * Renders a list of products into a specified grid element.
     * @param {Array} productList - The array of product objects to display.
     * @param {HTMLElement} gridElement - The DOM element to insert the product cards into.
     */
    function displayProducts(productList, gridElement) {
        if (!gridElement) return;
        gridElement.innerHTML = ''; // Clear previous content

        if (productList.length === 0) {
            gridElement.innerHTML = `<p class="grid-empty-message">محصولی یافت نشد.</p>`;
            return;
        }

        productList.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-card-image-container">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-card-content">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price}</p>
                </div>
            `;
            card.addEventListener('click', () => showProductDetail(product));
            gridElement.appendChild(card);
        });
    }
    
    /**
     * Shows a notification message at the bottom of the screen.
     * @param {string} message - The message to display.
     */
    function showNotification(message) {
        let notification = document.getElementById('notification-toast');
        // If the notification element doesn't exist, create it dynamically
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification-toast';
            notification.className = 'notification'; // This class is styled in components.css
            document.body.appendChild(notification);
        }

        // Set message, show the notification, then hide it after 3 seconds
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    /**
     * Populates and shows the product detail modal.
     * @param {object} product - The product object to display.
     */
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
                // --- THIS IS THE NEW LINE ---
                showNotification(`"${product.name}" به سبد خرید اضافه شد`);
            }
            closeModal();
        };
        
        modalActions.appendChild(addToCartBtn);
        modalTextContent.appendChild(modalActions);
        
        productModal.style.display = 'flex';
    }

    /**
     * Hides the product detail modal.
     */
    function closeModal() {
        if (productModal) {
            productModal.style.display = 'none';
        }
    }

    /**
     * Sets the visual active state on a filter button.
     * @param {HTMLElement} activeButton - The button to mark as active.
     */
    function updateActiveFilterButton(activeButton) {
        if (!filterBar) return;
        filterBar.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }

    /**
     * Highlights the correct navigation link based on the current page.
     */
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split("/").pop() || 'index.html';
        const effectivePage = (currentPage === '') ? 'index.html' : currentPage;
    
        document.querySelectorAll('.header-nav a.nav-link, a.cart-link').forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href').replace('./', '');
            if (linkHref === effectivePage) {
                link.classList.add('active');
            }
        });
    }

    // --- 3. EVENT LISTENERS ---

    function attachUniversalListeners() {
        if (productModal) {
            productModal.querySelector('.close-btn').addEventListener('click', closeModal);
            productModal.addEventListener('click', (event) => {
                if (event.target === productModal) closeModal();
            });
        }
    }

    // --- 4. PAGE-SPECIFIC INITIALIZATION ---

    function initializeHomePage() {
        if (featuredProductGrid) {
            const featuredProducts = products.slice(0, 5);
            displayProducts(featuredProducts, featuredProductGrid);
        }
    }

    function initializeProductsPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        const categoryQuery = urlParams.get('category');

        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(lowerCaseQuery) ||
                product.description.toLowerCase().includes(lowerCaseQuery) ||
                product.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
            );
            displayProducts(filteredProducts, productGrid);
            if (pageTitle) pageTitle.textContent = `نتایج جستجو برای: "${searchQuery}"`;
        } else if (categoryQuery) {
            const filteredProducts = products.filter(p => p.category === categoryQuery);
            displayProducts(filteredProducts, productGrid);
            if (pageTitle) pageTitle.textContent = categoryQuery;
            const activeButton = filterBar.querySelector(`[data-category="${categoryQuery}"]`);
            if (activeButton) updateActiveFilterButton(activeButton);
        } else {
            displayProducts(products, productGrid);
            if (pageTitle) pageTitle.textContent = 'همه محصولات';
        }

        if (filterBar) {
            filterBar.addEventListener('click', (e) => {
                if (e.target.matches('.filter-btn')) {
                    const button = e.target;
                    const category = button.dataset.category;
                    
                    updateActiveFilterButton(button);

                    if (pageTitle) pageTitle.textContent = button.textContent;
                    
                    const filtered = category === 'all' 
                        ? products 
                        : products.filter(p => p.category === category);
                    
                    displayProducts(filtered, productGrid);
                }
            });
        }
    }
    
    function initializeCartPage() {
        if (typeof displayCartItems === 'function') {
            displayCartItems();
        }
    }

    // --- 5. SCRIPT EXECUTION ---
    
    function main() {
        setActiveNavLink();
        attachUniversalListeners();
        if (typeof updateCartBadge === 'function') {
            updateCartBadge();
        }

        if (featuredProductGrid) initializeHomePage();
        if (productGrid) initializeProductsPage();
        if (cartItemsList) initializeCartPage();
    }

    main();
});