// Generate products in grid
const grid = document.getElementById('product-grid');

products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>${product.price}</p>
    `;
    card.addEventListener('click', () => {
        showProductDetail(product);
    });
    grid.appendChild(card);
});

// Show modal with product details
function showProductDetail(product) {
    document.getElementById('modal-title').textContent = product.title;
    document.getElementById('modal-price').textContent = product.price;
    document.getElementById('modal-description').textContent = product.description;
    document.getElementById('product-modal').style.display = 'flex';
}

// Close modal
function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('product-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
/* --- Header behavior: mobile toggle, cart count, search stub, shrink on scroll --- */
const hamburger = document.getElementById('hamburger');
const mobileDrawer = document.getElementById('mobile-drawer');
const siteHeader = document.getElementById('site-header');
const cartCountEl = document.getElementById('cart-count');
const drawerCartCount = document.getElementById('drawer-cart-count');

hamburger && hamburger.addEventListener('click', () => {
  const open = mobileDrawer.style.display === 'flex';
  mobileDrawer.style.display = open ? 'none' : 'flex';
  mobileDrawer.setAttribute('aria-hidden', open ? 'true' : 'false');
});

// close drawer when clicking backdrop
mobileDrawer && mobileDrawer.addEventListener('click', (e) => {
  if (e.target === mobileDrawer) {
    mobileDrawer.style.display = 'none';
    mobileDrawer.setAttribute('aria-hidden', 'true');
  }
});

// shrink header on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 12) siteHeader.classList.add('scrolled');
  else siteHeader.classList.remove('scrolled');
});

// a small API to update cart visual count (use this when user adds product)
function updateCartCount(n){
  const val = Number(cartCountEl.textContent || 0) + Number(n || 0);
  cartCountEl.textContent = val;
  drawerCartCount.textContent = val;
  // simple pulse effect
  cartCountEl.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 300 });
}

// example: call updateCartCount(1) when product added
// updateCartCount(1);

// search handler stub (hook to your product search)
const searchForm = document.getElementById('search-form');
searchForm && searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = document.getElementById('search-input').value.trim();
  if (!q) return;
  // TODO: run local search/filter on products array
  console.log('search for:', q);
});

// drawer search stub
const drawerSearch = document.getElementById('drawer-search');
drawerSearch && drawerSearch.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = document.getElementById('drawer-search-input').value.trim();
  mobileDrawer.style.display = 'none'; // close drawer
  console.log('drawer search:', q);
});
// --- Add this code below the 'products' array in script.js ---

// This function takes the product array and builds the HTML
function displayProducts(productList) {
    // Find the empty .product-grid container in the HTML
    const productGrid = document.querySelector('.product-grid');
    
    // If the container doesn't exist, stop the function
    if (!productGrid) return;

    // Clear any existing content in the grid
    productGrid.innerHTML = '';

    // Loop through each product in our array
    productList.forEach(product => {
        // Create a new div element for the product card
        const card = document.createElement('div');
        card.className = 'product-card';

        // Use template literals to create the inner HTML for the card
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price}</p>
        `;
        
        // Add the newly created card to the grid
        productGrid.appendChild(card);
    });
}

// This makes sure our script runs only after the full HTML page has loaded
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
});