/* js/script.js - Refactored for Firebase */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GLOBAL VARIABLES ---
    let allProducts = []; // This will be populated from Firestore

    // --- 2. CORE FUNCTIONS ---

    // This function now shows a loading state
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
                <div class="product-card-image-container"><img src="${product.image}" alt="${product.name}" loading="lazy"></div>
                <div class="product-card-content"><h3>${product.name}</h3><p class="price">${product.price}</p></div>
            `;
            // Pass the full product object, which now includes the Firestore ID
            card.addEventListener('click', () => showProductDetail(product));
            gridElement.appendChild(card);
        });
    }

    function showProductDetail(product) {
        const productModal = document.getElementById('product-modal');
        if (!productModal) return;
        // ... (rest of the function is unchanged, but now receives the full product object)
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
                addToCart(product.id); // Use the Firestore document ID
                showNotification(`"${product.name}" به سبد خرید اضافه شد`);
            }
            closeModal();
        };
        modalActions.appendChild(addToCartBtn);
        modalTextContent.appendChild(modalActions);
        productModal.style.display = 'flex';
    }

    // --- NEW: FETCH PRODUCTS FROM FIRESTORE ---
    async function fetchAllProducts() {
        try {
            const snapshot = await db.collection('products').get();
            // Map Firestore documents to an array of objects, including the document ID
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching products: ", error);
            return []; // Return an empty array on error
        }
    }

    // --- REFACTORED INITIALIZATION LOGIC ---
    async function initializeProductsPage() {
        const productGrid = document.getElementById('product-grid');
        const filterBar = document.getElementById('filter-bar');
        const pageTitle = document.getElementById('products-page-title');
        
        // Show a loading state
        if (productGrid) productGrid.innerHTML = `<p class="grid-empty-message">در حال بارگذاری محصولات...</p>`;

        // The logic now depends on the fetched 'allProducts' array
        const urlParams = new URLSearchParams(window.location.search);
        const categoryQuery = urlParams.get('category');
        let productsToDisplay = allProducts;

        if (categoryQuery) {
            productsToDisplay = allProducts.filter(p => p.category === categoryQuery);
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
                    const filtered = category === 'all' ? allProducts : allProducts.filter(p => p.category === category);
                    displayProducts(filtered, productGrid);
                }
            });
        }
    }
    
    // --- MAIN EXECUTION ROUTER (NOW ASYNC) ---
    async function main() {
        // Universal setup
        attachUniversalListeners();
        initializeMobileMenu();
        if (typeof updateCartBadge === 'function') updateCartBadge();

        // Fetch all products once and store them
        allProducts = await fetchAllProducts();
        
        // Page-specific logic
        const featuredProductGrid = document.getElementById('featured-product-grid');
        const productGrid = document.getElementById('product-grid');
        const cartItemsList = document.getElementById('cart-items-list');

        if (featuredProductGrid) displayProducts(allProducts.slice(0, 5), featuredProductGrid);
        if (productGrid) initializeProductsPage(); // No longer needs to be awaited here
        if (cartItemsList && typeof displayCartItems === 'function') displayCartItems(); // This will be async in cart.js
        
        // Other initializers remain synchronous
        initializeCheckoutPage();
        initializeContactPage();
    }

    // ... (Other functions like closeModal, showNotification, etc., remain unchanged) ...
    function closeModal(){const productModal=document.getElementById("product-modal");if(productModal)productModal.style.display="none"}
    function showNotification(message){let n=document.getElementById("notification-toast");n||(n=document.createElement("div"),n.id="notification-toast",n.className="notification",document.body.appendChild(n)),n.textContent=message,n.classList.add("show"),setTimeout(()=>n.classList.remove("show"),3e3)}
    function updateActiveFilterButton(e){const t=document.getElementById("filter-bar");t&&t.querySelectorAll(".filter-btn").forEach(t=>t.classList.remove("active")),e.classList.add("active")}
    function initializeMobileMenu(){/*... logic ...*/}
    function initializeCheckoutPage(){/*... logic ...*/}
    function initializeContactPage(){/*... logic ...*/}
    function attachUniversalListeners(){/*... logic ...*/}


    main();
});
