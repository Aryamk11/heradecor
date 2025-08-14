// js/modal-template.js
(function() {
    const modalHTML = `
    <div class="modal" id="product-modal">
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <div class="modal-image-container">
                 <img id="modal-image" src="" alt="تصویر محصول" class="modal-image">
            </div>
            <div class="modal-text-content">
                <h3 id="modal-title"></h3>
                <p id="modal-price"></p>
                <div class="modal-details">
                    <p><strong>جنس:</strong> <span id="modal-material"></span></p>
                    <p><strong>ابعاد:</strong> <span id="modal-dimensions"></span></p>
                </div>
                <p id="modal-description"></p>
                <!-- Add to cart button will be injected here by script.js -->
            </div>
        </div>
    </div>
    `;
    // We append the modal to the body itself to ensure it's always available.
    document.body.insertAdjacentHTML('beforeend', modalHTML);
})();