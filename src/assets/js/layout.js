/* src/assets/js/layout.js (Definitive Fix) */

// Import HTML content as raw strings using RELATIVE paths
import headerHTML from '../../partials/_header.html?raw';
import footerHTML from '../../partials/_footer.html?raw';

/**
 * Injects pre-imported HTML partials into placeholders.
 */
function injectLayout() {
    const headerPlaceholder = document.querySelector('div[data-include="/partials/_header.html"]');
    if (headerPlaceholder) {
        headerPlaceholder.outerHTML = headerHTML;
    } else {
        console.error('Header placeholder not found. Ensure your HTML has <div data-include="/partials/_header.html"></div>');
    }

    const footerPlaceholder = document.querySelector('div[data-include="/partials/_footer.html"]');
    if (footerPlaceholder) {
        footerPlaceholder.outerHTML = footerHTML;
    } else {
        console.error('Footer placeholder not found. Ensure your HTML has <div data-include="/partials/_footer.html"></div>');
    }
}

/**
 * Highlights the active navigation link based on the current page URL.
 */
function highlightActiveNavLink() {
    // Get the full URL of the current page
    const currentUrl = window.location.href;

    // Reset all links first to handle navigation correctly
    document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
        link.classList.remove('link-secondary');
        if (!link.classList.contains('dropdown-toggle')) {
            link.classList.add('link-dark');
        }
    });

    // Find and highlight the active link
    document.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item').forEach(link => {
        // Compare the full href of the link with the current URL
        if (link.href === currentUrl) {
            link.classList.add('link-secondary');
            link.classList.remove('link-dark');

            // If the active link is inside a dropdown, highlight the main dropdown button as well
            const dropdownToggle = link.closest('.dropdown')?.querySelector('.dropdown-toggle');
            if (dropdownToggle) {
                dropdownToggle.classList.add('link-secondary');
                dropdownToggle.classList.remove('link-dark');
            }
        }
    });
}

/**
 * Main function to set up the layout.
 */
export function setupLayout() {
    injectLayout();
    highlightActiveNavLink();
}