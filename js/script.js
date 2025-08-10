/* --- Final and Complete script.js File --- */

// Wait for the entire HTML document to be loaded and ready
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ELEMENT SELECTIONS ---
    // Get all the necessary elements from the page once.
    const productGrid = document.querySelector('.product-grid');
    const productModal = document.getElementById('product-modal');
    
    const searchToggleButton = document.getElementById('search-toggle-btn');
    const searchBarContainer = document.getElementById('search-bar-container');
    const searchCloseButton = document.getElementById('search-close-btn');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const modalCloseBtn = document.querySelector('.close-btn');


    // --- 2. INITIALIZATION ---
    // Display all products when the page first loads, if a product grid exists on the page.
    if (productGrid) {
        displayProducts(products);
    }


    // --- 3. MAIN FUNCTIONS ---

    /**
     * Takes an array of product objects and displays them in the product grid.
     * @param {Array} productList The array of products to display.
     */
    function displayProducts(productList) {
        if (!productGrid) return; // Exit if there's no grid on the current page

        productGrid.innerHTML = ''; // Clear any previous products from the grid

        productList.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${product.price}</p>
            `;
            
            // Add an event listener to each card to show details when clicked
            card.addEventListener('click', () => {
                showProductDetail(product);
            });

            productGrid.appendChild(card);
        });
    }

    /**
     * Populates and shows the product detail modal.
     * @param {object} product The product object to show details for.
     */
// Replace the old showProductDetail function in script.js

function showProductDetail(product) {
    if (!productModal) return;

    // Select all the elements inside the modal
    const modalImage = productModal.querySelector('#modal-image');
    const modalTitle = productModal.querySelector('#modal-title');
    const modalPrice = productModal.querySelector('#modal-price');
    const modalMaterial = productModal.querySelector('#modal-material');
    const modalDimensions = productModal.querySelector('#modal-dimensions');
    const modalDescription = productModal.querySelector('#modal-description');

    // Populate the elements with the product's data
    modalImage.src = product.image;
    modalTitle.textContent = product.name;
    modalPrice.textContent = product.price;
    modalMaterial.textContent = product.material;
    modalDimensions.textContent = product.dimensions;
    modalDescription.textContent = product.description;
    
    // Display the modal
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

    // Listener for the main close button (X) inside the modal
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    
    // Listener to close the modal if the user clicks on the dark background
    window.addEventListener('click', (event) => {
        if (event.target === productModal) {
            closeModal();
        }
    });

    // Listener for the "Search" link in the header to show/hide the search bar
    if (searchToggleButton) {
        searchToggleButton.addEventListener('click', (e) => {
            e.preventDefault(); // Stop the link from trying to navigate
            searchBarContainer.classList.toggle('is-visible');

            // For good user experience, focus the input field when the bar opens
            if (searchBarContainer.classList.contains('is-visible')) {
                searchInput.focus();
            }
        });
    }

    // Listener for the close button inside the search bar
    if (searchCloseButton) {
        searchCloseButton.addEventListener('click', () => {
            searchBarContainer.classList.remove('is-visible');
        });
    }

    // Listener for when the user submits a search query
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim().toLowerCase();
            
            // Hide the search bar after submitting
            searchBarContainer.classList.remove('is-visible');
            
            if (!query) {
                // If the search is empty, show all products again
                displayProducts(products);
                return;
            }

            // Filter the products array based on the query
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
            
            // Display only the filtered results
            displayProducts(filteredProducts);
        });
    }
});