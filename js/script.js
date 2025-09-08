/* js/script.js - Refactored for Supabase & Search Functionality */

document.addEventListener('DOMContentLoaded', () => {

    let allProducts = [];

    async function fetchAllProducts() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: true }); 

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error fetching products from Supabase:", error);
            return [];
        }
    }
// js/script.js - REPLACE just this function

async function initializeAccountPage() {
    const accountDetailsContainer = document.getElementById('account-details');
    if (!accountDetailsContainer) return;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        accountDetailsContainer.innerHTML = `
            <div class="account-info">
                <p>برای مشاهده تاریخچه سفارشات، لطفا ابتدا وارد حساب کاربری خود شوید.</p>
                <a href="#" class="btn btn-primary signin-link">ورود / ثبت‌نام</a>
            </div>
        `;
        // Re-attach the event listener for the new signin link
        accountDetailsContainer.querySelector('.signin-link').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('auth-modal').style.display = 'flex';
        });
        return;
    }

    // User is logged in, show their info and fetch orders
    accountDetailsContainer.innerHTML = `
        <div class="account-info">
            <p>خوش آمدید!</p>
            <p>شما با شماره <span class="user-email">${user.phone}</span> وارد شده‌اید.</p>
        </div>
        <h2>تاریخچه سفارشات</h2>
        <div class="order-history-list" id="order-history-list">
             <p class="loading-message">در حال بارگذاری سفارشات...</p>
        </div>
    `;

    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        const orderHistoryList = document.getElementById('order-history-list');
        if (orders.length === 0) {
            orderHistoryList.innerHTML = '<p>شما تاکنون هیچ سفارشی ثبت نکرده‌اید.</p>';
            return;
        }

        // We need product names, so let's fetch all products
        const { data: allProducts } = await supabase.from('products').select('id, name');
        const productMap = new Map(allProducts.map(p => [p.id, p.name]));
        
        orderHistoryList.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <h3>سفارش #${order.id}</h3>
                    <span class="order-status">${order.status}</span>
                </div>
                <div class="order-details-grid">
                    <div class="order-detail">
                        <p><strong>تاریخ ثبت:</strong> ${new Date(order.created_at).toLocaleDateString('fa-IR')}</p>
                    </div>
                    <div class="order-detail">
                        <p><strong>مبلغ کل:</strong> ${order.total_price.toLocaleString('fa-IR')} تومان</p>
                    </div>
                     <div class="order-detail">
                        <p><strong>گیرنده:</strong> ${order.customer_name}</p>
                    </div>
                    <div class="order-detail">
                        <p><strong>آدرس:</strong> ${order.shipping_address}</p>
                    </div>
                </div>
                <table class="order-items-table">
                    <thead>
                        <tr>
                            <th>محصول</th>
                            <th>تعداد</th>
                            <th>قیمت واحد</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.cart_items.map(item => `
                            <tr>
                                <td>${productMap.get(item.product_id) || 'محصول حذف شده'}</td>
                                <td>${item.quantity}</td>
                                <td>${item.price_at_purchase.toLocaleString('fa-IR')} تومان</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error fetching orders:', error);
        document.getElementById('order-history-list').innerHTML = '<p class="error-message">خطا در بارگذاری سفارشات.</p>';
    }
}
// ADD THIS ENTIRE FUNCTION
async function initializeProductDetailPage() {
    const productDetailContainer = document.getElementById('product-detail-content');
    if (!productDetailContainer) return; // Only run on the product detail page

    // 1. Get the product ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        productDetailContainer.innerHTML = '<p>محصولی یافت نشد. لطفا به <a href="products.html">صفحه محصولات</a> بازگردید.</p>';
        return;
    }

    try {
        // 2. Fetch the single product from Supabase
        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single(); // .single() gets one object instead of an array

        if (error || !product) throw error || new Error('Product not found');

        // 3. Update SEO tags
        document.title = `${product.name} - کادو هنری هرا`;
        document.querySelector('meta[name="description"]').setAttribute('content', product.description);

        // 4. Render the product details HTML
        productDetailContainer.innerHTML = `
            <div class="product-detail-image-container">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-detail-info">
                <h1>${product.name}</h1>
                <p class="product-detail-price">${product.price}</p>
                <p class="product-detail-description">${product.description}</p>
                <div class="product-meta">
                     <p><strong>جنس:</strong> ${product.material}</p>
                     <p><strong>ابعاد:</strong> ${product.dimensions}</p>
                </div>
                <form class="add-to-cart-form" id="add-to-cart-form">
                    <input type="number" class="quantity-input" value="1" min="1" id="quantity-to-add">
                    <button type="submit" class="btn btn-primary add-to-cart-btn">افزودن به سبد خرید</button>
                </form>
            </div>
        `;

        // 5. Add event listener to the new "Add to Cart" form
        const addToCartForm = document.getElementById('add-to-cart-form');
        addToCartForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const quantity = parseInt(document.getElementById('quantity-to-add').value, 10);
            for (let i = 0; i < quantity; i++) {
                addToCart(product.id);
            }
            showNotification(`"${product.name}" (${quantity} عدد) به سبد خرید اضافه شد`);
        });

    } catch (error) {
        console.error('Error fetching product details:', error);
        productDetailContainer.innerHTML = '<p>خطا در بارگذاری محصول. لطفا دوباره تلاش کنید.</p>';
    }
}

    async function main() {
        initializeMobileMenu();
        initializeSearch();
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
        initializeAccountPage();
        initializeProductDetailPage();
        setActiveNavLink();
    }
    
    // MODIFIED THIS FUNCTION
    function initializeProductsPage() {
        const productGrid = document.getElementById('product-grid');
        const filterBar = document.getElementById('filter-bar');
        const pageTitle = document.getElementById('products-page-title');
        
        const urlParams = new URLSearchParams(window.location.search);
        const categoryQuery = urlParams.get('category');
        const searchQuery = urlParams.get('search'); // <-- ADDED
        let productsToDisplay = allProducts;

        if (categoryQuery) {
            productsToDisplay = allProducts.filter(p => p.category === categoryQuery);
            if (pageTitle) pageTitle.textContent = categoryQuery;
            const activeButton = filterBar.querySelector(`[data-category="${categoryQuery}"]`);
            if (activeButton) updateActiveFilterButton(activeButton);
        } else if (searchQuery) { // <-- ADDED THIS BLOCK
            productsToDisplay = allProducts.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (pageTitle) pageTitle.textContent = `نتایج جستجو برای: "${searchQuery}"`;
        } else {
            if (pageTitle) pageTitle.textContent = 'همه محصولات';
        }
        
        displayProducts(productsToDisplay, productGrid);

        if (filterBar) {
            filterBar.addEventListener('click', (e) => {
                if (e.target.matches('.filter-btn')) {
                    const button = e.target;
                    const category = button.dataset.category;
                    // Clear search params when a category is clicked
                    const url = new URL(window.location);
                    url.searchParams.delete('search');
                    history.pushState({}, '', url);

                    updateActiveFilterButton(button);
                    if (pageTitle) pageTitle.textContent = button.textContent;
                    const filtered = category === 'all' ? allProducts : allProducts.filter(p => p.category === category);
                    displayProducts(filtered, productGrid);
                }
            });
        }
    }

// js/script.js - Find and replace this function

function initializeSearch() {
    // MODIFIED: Use querySelectorAll to find both desktop and mobile buttons
    const searchToggleBtns = document.querySelectorAll('.search-toggle-btn');
    const searchBarContainer = document.getElementById('search-bar-container');
    const searchCloseBtn = document.getElementById('search-close-btn');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if (!searchToggleBtns.length || !searchBarContainer || !searchCloseBtn || !searchForm) return;

    // MODIFIED: Loop through buttons and add a listener to each one
    searchToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            searchBarContainer.classList.toggle('is-visible');
            if (searchBarContainer.classList.contains('is-visible')) {
                searchInput.focus();
            }
        });
    });

    searchCloseBtn.addEventListener('click', () => {
        searchBarContainer.classList.remove('is-visible');
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        }
    });

    document.addEventListener('click', (e) => {
        // Ensure the clicked target is not a toggle button itself
        const isToggleButton = e.target.classList.contains('search-toggle-btn') || e.target.closest('.search-toggle-btn');
        if (!searchBarContainer.contains(e.target) && searchBarContainer.classList.contains('is-visible') && !isToggleButton) {
            searchBarContainer.classList.remove('is-visible');
        }
    });

    searchBarContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// REPLACE this entire function in js/script.js
function displayProducts(productList, gridElement) {
    if (!gridElement) return;

    gridElement.innerHTML = "";

    if (productList.length === 0) {
        gridElement.innerHTML = `<p class="grid-empty-message">محصولی یافت نشد.</p>`;
        return;
    }

    productList.forEach(product => {
        // The card is now an anchor tag <a> instead of a div
        const card = document.createElement("a");
        card.className = "product-card";
        // The href attribute points to the new detail page with the product's ID
        card.href = `product-detail.html?id=${product.id}`;

        card.innerHTML = `
            <div class="product-card-image-container">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-card-content">
                <h3>${product.name}</h3>
                <p class="price">${product.price}</p>
            </div>
        `;
        // The old click listener that opened the modal is now gone.
        gridElement.appendChild(card);
    });
}
    function showNotification(message){let notification=document.getElementById("notification-toast");notification||(notification=document.createElement("div"),notification.id="notification-toast",notification.className="notification",document.body.appendChild(notification)),notification.textContent=message,notification.classList.add("show"),setTimeout(()=>notification.classList.remove("show"),3e3)}
    function updateActiveFilterButton(activeButton){const filterBar=document.getElementById("filter-bar");filterBar&&filterBar.querySelectorAll(".filter-btn").forEach(btn=>btn.classList.remove("active")),activeButton.classList.add("active")}
    function lazyLoadFonts(){const fontLink=document.createElement("link");fontLink.href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;700&display=swap",fontLink.rel="stylesheet",document.head.appendChild(fontLink)}
    function initializeMobileMenu(){const menuToggle=document.getElementById("mobile-menu-toggle"),mobileNavOverlay=document.getElementById("mobile-nav-overlay"),mobileNavPanel=document.getElementById("mobile-nav"),closeButton=document.getElementById("mobile-nav-close");if(menuToggle&&mobileNavOverlay&&mobileNavPanel&&closeButton){const openMenu=()=>mobileNavOverlay.classList.add("is-active"),closeMenu=()=>mobileNavOverlay.classList.remove("is-active");menuToggle.addEventListener("click",openMenu),closeButton.addEventListener("click",closeMenu),mobileNavOverlay.addEventListener("click",closeMenu),mobileNavPanel.addEventListener("click",e=>e.stopPropagation()),mobileNavOverlay.querySelectorAll(".nav-link").forEach(link=>{link.addEventListener("click",closeMenu)})}}
// js/script.js - REPLACE this entire function
async function initializeCheckoutPage() {
    const checkoutForm = document.getElementById("checkout-form");
    if (!checkoutForm) return;

    // Fetch all products once to calculate total price
    const { data: allProducts, error: productError } = await supabase
        .from('products')
        .select('id, priceValue');

    if (productError) {
        console.error("Could not fetch products for price calculation:", productError);
        // Optionally, disable the form or show an error to the user
        return;
    }

    checkoutForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitButton = checkoutForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'در حال ثبت سفارش...';

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert("برای ثبت سفارش باید وارد حساب کاربری خود شوید.");
            // Here you might redirect to a login page or open a login modal
            submitButton.disabled = false;
            submitButton.textContent = 'ثبت نهایی سفارش';
            return;
        }

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
            alert("سبد خرید شما خالی است.");
            submitButton.disabled = false;
            submitButton.textContent = 'ثبت نهایی سفارش';
            return;
        }

        // Calculate total price on the server-side for security
        let totalPrice = 0;
        const detailedCartItems = cart.map(item => {
            const product = allProducts.find(p => p.id === item.id);
            if (product) {
                totalPrice += product.priceValue * item.quantity;
                return {
                    product_id: item.id,
                    quantity: item.quantity,
                    price_at_purchase: product.priceValue
                };
            }
            return null;
        }).filter(Boolean); // Filter out any nulls if a product wasn't found

        const orderDetails = {
            user_id: user.id,
            customer_name: document.getElementById("name").value,
            shipping_address: document.getElementById("address").value,
            phone_number: document.getElementById("phone").value,
            cart_items: detailedCartItems,
            total_price: totalPrice
        };

        try {
            const { error } = await supabase.from('orders').insert([orderDetails]);
            if (error) throw error;

            // If successful, clear the cart and redirect
            localStorage.removeItem("cart");
            window.location.href = "order-confirmation.html";

        } catch (error) {
            console.error("Error saving order:", error);
            alert("خطایی در ثبت سفارش رخ داد. لطفا دوباره تلاش کنید.");
            submitButton.disabled = false;
            submitButton.textContent = 'ثبت نهایی سفارش';
        }
    });
}
// js/script.js - REPLACE this entire function

function initializeContactPage() {
    const contactForm = document.getElementById("contact-form");
    if (!contactForm) return;

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'در حال ارسال...';

        const formData = {
            name: contactForm.name.value,
            email: contactForm.email.value,
            message: contactForm.message.value
        };

        try {
            const { error } = await supabase.from('messages').insert([formData]);
            if (error) throw error;
            
            // On success, show confirmation message
            const container = document.getElementById("contact-section-container");
            if (container) {
                container.innerHTML = `
                    <h2 class="section-title">پیام شما ارسال شد!</h2>
                    <p style="text-align: center; font-size: 1.2rem;">از تماس شما سپاسگزاریم. به زودی پاسخ خواهیم داد.</p>
                `;
            }

        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert('خطا در ارسال پیام. لطفا دوباره تلاش کنید.');
            submitButton.disabled = false;
            submitButton.textContent = 'ارسال پیام';
        }
    });
}
    function setActiveNavLink(){const currentPage=window.location.pathname.split("/").pop()||"index.html",effectivePage=""===currentPage?"index.html":currentPage;document.querySelectorAll(".header-nav a.nav-link, a.cart-link").forEach(link=>{link.classList.remove("active");const linkHref=link.getAttribute("href").replace("./","");linkHref===effectivePage&&link.classList.add("active")})}

    main();
    window.addEventListener('load', lazyLoadFonts);
});