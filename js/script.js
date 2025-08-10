/* --- js/script.js (Corrected & Complete) --- */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ELEMENT SELECTIONS ---
    const productGrid = document.getElementById('product-grid');
    const featuredProductGrid = document.getElementById('featured-product-grid');
    const productModal = document.getElementById('product-modal');
    const searchToggleButton = document.getElementById('search-toggle-btn');
    const searchBarContainer = document.getElementById('search-bar-container');
    const searchCloseButton = document.getElementById('search-close-btn');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const modalCloseBtn = productModal ? productModal.querySelector('.close-btn') : null;

    // --- 2. INITIALIZATION ---
    
    // Update cart badge on every page load, requires cart.js to be loaded first
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }

    // Logic for the main products page (products.html)
    if (productGrid) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(lowerCaseQuery) ||
                product.description.toLowerCase().includes(lowerCaseQuery)
            );
            displayProducts(filteredProducts, productGrid);
        } else {
            const shuffledProducts = shuffleArray([...products]);
            displayProducts(shuffledProducts, productGrid);
        }
    }

    // Logic for the featured products on the homepage (index.html)
    if (featuredProductGrid) {
        const featuredProducts = products.slice(0, 5);
        displayProducts(featuredProducts, featuredProductGrid);
    }
    
    // Logic for the cart page (cart.html)
    if (document.getElementById('cart-items-list') && typeof displayCartItems === 'function') {
        displayCartItems();
    }
    
    // Set active class on navigation link
    const currentPage = window.location.pathname.split("/").pop() || 'index.html';
    document.querySelectorAll('.header-nav a.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    // Special case for cart link, which is styled differently
    if (currentPage === 'cart.html') {
         const cartLink = document.querySelector('a.cart-link');
         if (cartLink) cartLink.classList.add('active');
    }


    // --- 3. FUNCTIONS ---

    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function displayProducts(productList, gridElement) {
        if (!gridElement) return;
        gridElement.innerHTML = '';
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

    function showProductDetail(product) {
        if (!productModal) return;

        productModal.querySelector('#modal-image').src = product.image;
        productModal.querySelector('#modal-image').alt = product.name;
        productModal.querySelector('#modal-title').textContent = product.name;
        productModal.querySelector('#modal-price').textContent = product.price;
        productModal.querySelector('#modal-material').textContent = product.material;
        productModal.querySelector('#modal-dimensions').textContent = product.dimensions;
        productModal.querySelector('#modal-description').textContent = product.description;

        let modalTextContent = productModal.querySelector('.modal-text-content');
        let modalActions = modalTextContent.querySelector('.modal-actions');
        if (modalActions) {
            modalActions.remove();
        }
        
        modalActions = document.createElement('div');
        modalActions.className = 'modal-actions';
        
        const addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'btn btn-primary';
        addToCartBtn.textContent = 'افزودن به سبد خرید';
        addToCartBtn.onclick = () => {
            if (typeof addToCart === 'function') {
                addToCart(product.id);
            }
            closeModal();
        };
        
        modalActions.appendChild(addToCartBtn);
        modalTextContent.appendChild(modalActions);
        
        productModal.style.display = 'flex';
    }

    function closeModal() {
        if (productModal) {
            productModal.style.display = 'none';
        }
    }

    // --- 4. EVENT LISTENERS ---

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    
    if (productModal) {
        productModal.addEventListener('click', (event) => {
            if (event.target === productModal) {
                closeModal();
            }
        });
    }

    if (searchToggleButton) {
        searchToggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            searchBarContainer.classList.toggle('is-visible');
            if (searchBarContainer.classList.contains('is-visible')) {
                searchInput.focus();
            }
        });
    }

    if (searchCloseButton) {
        searchCloseButton.addEventListener('click', () => {
            searchBarContainer.classList.remove('is-visible');
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `products.html?search=${encodeURIComponent(query)}`;
            }
        });
    }
});
