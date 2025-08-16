/* js/script.js - Refactored for Supabase */

document.addEventListener('DOMContentLoaded', () => {

    let allProducts = [];

    async function fetchAllProducts() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: true }); // Ensure consistent order

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error fetching products from Supabase:", error);
            return [];
        }
    }

    async function main() {
        attachUniversalListeners();
        initializeMobileMenu();
        if (typeof updateCartBadge === 'function') updateCartBadge();

        const featuredProductGrid = document.getElementById('featured-product-grid');
        const productGrid = document.getElementById('product-grid');
        const cartItemsList = document.getElementById('cart-items-list');

        if (featuredProductGrid) featuredProductGrid.innerHTML = `<p class="grid-empty-message">در حال بارگذاری...</p>`;
        if (productGrid) productGrid.innerHTML = `<p class="grid-empty-message">در حال بارگذاری...</p>`;

        allProducts = await fetchAllProducts();
        
        if (featuredProductGrid) displayProducts(allProducts.slice(0, 5), featuredProductGrid);
        if (productGrid) initializeProductsPage();
        if (cartItemsList && typeof displayCartItems === 'function') displayCartItems(allProducts);
        
        initializeCheckoutPage();
        initializeContactPage();
        setActiveNavLink();
    }
    
    function initializeProductsPage() {
        const productGrid = document.getElementById('product-grid');
        const filterBar = document.getElementById('filter-bar');
        const pageTitle = document.getElementById('products-page-title');
        
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

    // --- UNCHANGED HELPER FUNCTIONS ---
    function displayProducts(productList, gridElement){if(!gridElement)return;gridElement.innerHTML="";if(productList.length===0){gridElement.innerHTML=`<p class="grid-empty-message">محصولی یافت نشد.</p>`;return}productList.forEach(product=>{const card=document.createElement("div");card.className="product-card";card.innerHTML=`
                <div class="product-card-image-container"><img src="${product.image}" alt="${product.name}" loading="lazy"></div>
                <div class="product-card-content"><h3>${product.name}</h3><p class="price">${product.price}</p></div>
            `;card.addEventListener("click",()=>showProductDetail(product));gridElement.appendChild(card)})}
    function showProductDetail(product){const productModal=document.getElementById("product-modal");if(!productModal)return;productModal.querySelector("#modal-image").src=product.image,productModal.querySelector("#modal-title").textContent=product.name,productModal.querySelector("#modal-price").textContent=product.price,productModal.querySelector("#modal-material").textContent=product.material,productModal.querySelector("#modal-dimensions").textContent=product.dimensions,productModal.querySelector("#modal-description").textContent=product.description;const modalTextContent=productModal.querySelector(".modal-text-content");let modalActions=modalTextContent.querySelector(".modal-actions");modalActions&&modalActions.remove(),modalActions=document.createElement("div"),modalActions.className="modal-actions";const addToCartBtn=document.createElement("button");addToCartBtn.className="btn btn-primary",addToCartBtn.textContent="افزودن به سبد خرید",addToCartBtn.onclick=()=>{"function"==typeof addToCart&&(addToCart(product.id),showNotification(`"${product.name}" به سبد خرید اضافه شد`)),closeModal()},modalActions.appendChild(addToCartBtn),modalTextContent.appendChild(modalActions),productModal.style.display="flex"}
    function closeModal(){const productModal=document.getElementById("product-modal");productModal&&(productModal.style.display="none")}
    function showNotification(message){let notification=document.getElementById("notification-toast");notification||(notification=document.createElement("div"),notification.id="notification-toast",notification.className="notification",document.body.appendChild(notification)),notification.textContent=message,notification.classList.add("show"),setTimeout(()=>notification.classList.remove("show"),3e3)}
    function updateActiveFilterButton(activeButton){const filterBar=document.getElementById("filter-bar");filterBar&&filterBar.querySelectorAll(".filter-btn").forEach(btn=>btn.classList.remove("active")),activeButton.classList.add("active")}
    function attachUniversalListeners(){const productModal=document.getElementById("product-modal");productModal&&(productModal.querySelector(".close-btn").addEventListener("click",closeModal),productModal.addEventListener("click",event=>{event.target===productModal&&closeModal()}))}
    function lazyLoadFonts(){const fontLink=document.createElement("link");fontLink.href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;700&display=swap",fontLink.rel="stylesheet",document.head.appendChild(fontLink)}
    function initializeMobileMenu(){const menuToggle=document.getElementById("mobile-menu-toggle"),mobileNavOverlay=document.getElementById("mobile-nav-overlay"),mobileNavPanel=document.getElementById("mobile-nav"),closeButton=document.getElementById("mobile-nav-close");if(menuToggle&&mobileNavOverlay&&mobileNavPanel&&closeButton){const openMenu=()=>mobileNavOverlay.classList.add("is-active"),closeMenu=()=>mobileNavOverlay.classList.remove("is-active");menuToggle.addEventListener("click",openMenu),closeButton.addEventListener("click",closeMenu),mobileNavOverlay.addEventListener("click",closeMenu),mobileNavPanel.addEventListener("click",e=>e.stopPropagation()),mobileNavOverlay.querySelectorAll(".nav-link").forEach(link=>{link.addEventListener("click",closeMenu)})}}
    function initializeCheckoutPage(){const checkoutForm=document.getElementById("checkout-form");checkoutForm&&checkoutForm.addEventListener("submit",e=>{e.preventDefault(),localStorage.removeItem("cart"),window.location.href="order-confirmation.html"})}
    function initializeContactPage(){const contactForm=document.getElementById("contact-form");contactForm&&contactForm.addEventListener("submit",e=>{e.preventDefault();const container=document.getElementById("contact-section-container");container&&(container.innerHTML=`
                    <h2 class="section-title">پیام شما ارسال شد!</h2>
                    <p style="text-align: center; font-size: 1.2rem;">از تماس شما سپاسگزاریم. به زودی پاسخ خواهیم داد.</p>
                `)})}
    function setActiveNavLink(){const currentPage=window.location.pathname.split("/").pop()||"index.html",effectivePage=""===currentPage?"index.html":currentPage;document.querySelectorAll(".header-nav a.nav-link, a.cart-link").forEach(link=>{link.classList.remove("active");const linkHref=link.getAttribute("href").replace("./","");linkHref===effectivePage&&link.classList.add("active")})}

    main();
    window.addEventListener('load', lazyLoadFonts);
});