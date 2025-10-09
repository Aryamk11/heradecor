import headerHTML from '../../partials/_header.html?raw';
import footerHTML from '../../partials/_footer.html?raw';

/**
 * Injects pre-imported HTML partials into placeholders.
 * This function is designed to run immediately and has no other dependencies.
 */
function injectLayout() {
    // Replace header placeholder
    const headerPlaceholder = document.querySelector('div[data-include="/partials/_header.html"]');
    if (headerPlaceholder) {
        headerPlaceholder.outerHTML = headerHTML;
    }

    // Replace footer placeholder
    const footerPlaceholder = document.querySelector('div[data-include="/partials/_footer.html"]');
    if (footerPlaceholder) {
        footerPlaceholder.outerHTML = footerHTML;
    }
}

// Run the function immediately on script load
injectLayout();