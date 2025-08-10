/* --- Final and Complete script.js File --- */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ELEMENT SELECTIONS ---
    const productGrid = document.getElementById('product-grid'); // For all products page
    const featuredProductGrid = document.getElementById('featured-product-grid'); // For homepage
    const productModal = document.getElementById('product-modal');
    const searchToggleButton = document.getElementById('search-toggle-btn');
    const searchBarContainer = document.getElementById('search-bar-container');
    const searchCloseButton = document.getElementById('search-close-btn');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const modalCloseBtn = productModal ? productModal.querySelector('.close-btn') : null;


    // --- 2. INITIALIZATION ---

    // Logic for the main products page (products.html)
    if (productGrid) {
        const shuffledProducts = shuffleArray([...products]);
        displayProducts(shuffledProducts, productGrid);
    }

    // Logic for the featured products on the homepage (index.html)
    if (featuredProductGrid) {
        const featuredProducts = products.slice(0, 5); // Get the first 5 products as featured
        displayProducts(featuredProducts, featuredProductGrid);
    }


    // --- 3. MAIN FUNCTIONS ---

    /**
     * Shuffles an array in place using the Fisher-Yates algorithm.
     * @param {Array} array The array to shuffle.
     * @returns {Array} The shuffled array.
     */
    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    /**
     * Takes an array of products and a grid element to display them in.
     * @param {Array} productList The array of products to display.
     * @param {HTMLElement} gridElement The grid element to append cards to.
     */
    function displayProducts(productList, gridElement) {
        if (!gridElement) return;

        gridElement.innerHTML = ''; // Clear the grid

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
            
            card.addEventListener('click', () => {
                showProductDetail(product);
            });

            gridElement.appendChild(card);
        });
    }

    /**
     * Populates and shows the product detail modal.
     * @param {object} product The product object to show details for.
     */
    function showProductDetail(product) {
        if (!productModal) return;

        const modalImage = productModal.querySelector('#modal-image');
        const modalTitle = productModal.querySelector('#modal-title');
        const modalPrice = productModal.querySelector('#modal-price');
        const modalMaterial = productModal.querySelector('#modal-material');
        const modalDimensions = productModal.querySelector('#modal-dimensions');
        const modalDescription = productModal.querySelector('#modal-description');

        modalImage.src = product.image;
        modalImage.alt = product.name;
        modalTitle.textContent = product.name;
        modalPrice.textContent = product.price;
        modalMaterial.textContent = product.material;
        modalDimensions.textContent = product.dimensions;
        modalDescription.textContent = product.description;
        
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
            const query = searchInput.value.trim().toLowerCase();
            
            // Redirect to products page with search query
            window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        });
    }
    
    // Handle search query on products page load
    if (productGrid) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        if (searchQuery) {
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery) ||
                product.description.toLowerCase().includes(searchQuery)
            );
            displayProducts(filteredProducts, productGrid);
        }
    }

    // Add 'active' class to the current page's nav link
    const currentPage = window.location.pathname.split("/").pop();
    const homeLink = document.querySelector('.header-nav a[href="index.html"]');
    
    if (currentPage === '' || currentPage === 'index.html') {
         if(homeLink) homeLink.classList.add('active');
    } else {
        const activeLink = document.querySelector(`.header-nav a[href="${currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
});
