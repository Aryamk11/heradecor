// js/templates.js

document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch and insert HTML content
    const loadComponent = (url, placeholderId) => {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const placeholder = document.getElementById(placeholderId);
                if (placeholder) {
                    placeholder.innerHTML = data;
                }
                
                // After loading the header, run scripts that depend on it
                if (placeholderId === 'header-placeholder') {
                    // Re-run the active link logic from script.js
                    setActiveNavLink();
                    // Re-run the cart badge update
                    if (typeof updateCartBadge === 'function') {
                        updateCartBadge();
                    }
                    // Re-attach search button listeners
                    attachSearchListeners();
                }
            })
            .catch(error => console.error('Error loading component:', error));
    };

    // Load header and footer
    loadComponent('header.html', 'header-placeholder');
    loadComponent('footer.html', 'footer-placeholder');
});

// This function sets the active class on the correct navigation link
const setActiveNavLink = () => {
    const currentPage = window.location.pathname.split("/").pop() || 'index.html';
    document.querySelectorAll('.header-nav a.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    // Special case for cart link
    if (currentPage === 'cart.html') {
         const cartLink = document.querySelector('a.cart-link');
         if (cartLink) cartLink.classList.add('active');
    }
};

// This function re-attaches event listeners for the search bar
const attachSearchListeners = () => {
    const searchToggleButton = document.getElementById('search-toggle-btn');
    const searchBarContainer = document.getElementById('search-bar-container');
    const searchCloseButton = document.getElementById('search-close-btn');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

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
};
