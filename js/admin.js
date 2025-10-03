// js/admin.js - CORRECTED FINAL VERSION

document.addEventListener('DOMContentLoaded', () => {
    const authCheckContainer = document.getElementById('auth-check-container');
    const authMessage = document.getElementById('auth-message');
    const adminContent = document.getElementById('admin-content');

    async function checkAdminAccess() {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            authMessage.textContent = 'دسترسی غیرمجاز. در حال انتقال به صفحه اصلی...';
            setTimeout(() => window.location.href = 'index.html', 2000);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('user_roles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (error || data.role !== 'admin') {
                throw new Error('شما دسترسی ادمین ندارید.');
            }
            
            // If we reach here, access is granted
            authCheckContainer.style.display = 'none';
            adminContent.style.display = 'block';
            initializeAdminPanel(); // This call was missing

        } catch (error) {
            authMessage.textContent = `خطا: ${error.message} در حال انتقال به صفحه اصلی...`;
            setTimeout(() => window.location.href = 'index.html', 3000);
        }
    }

    function initializeAdminPanel() {
        renderProductsPanel(); // Load products by default

        const navButtons = document.querySelectorAll('.admin-nav-btn');
        const panels = document.querySelectorAll('.admin-panel');

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                navButtons.forEach(btn => btn.classList.remove('active'));
                panels.forEach(panel => panel.classList.remove('active'));

                button.classList.add('active');
                const targetPanelId = button.dataset.target;
                document.getElementById(targetPanelId).classList.add('active');

                // Call the correct render function based on the panel ID
                if (targetPanelId === 'orders-panel') {
                    renderOrdersPanel();
                } else if (targetPanelId === 'messages-panel') {
                    renderMessagesPanel();
                }
            });
        });
    }

async function renderProductsPanel() {
    const panel = document.getElementById('products-panel');
    panel.innerHTML = `<p>در حال بارگذاری محصولات...</p>`;

    try {
        const { data: products, error } = await supabase.from('products').select('*').order('id');
        if (error) throw error;

        // STEP 1: RENDER THE HTML
panel.innerHTML = `
    <h2>مدیریت محصولات</h2>
    <div class="admin-search-container">
        <input type="search" id="admin-product-search" placeholder="جستجوی محصول بر اساس نام...">
    </div>
    <button id="show-add-product-form-btn" class="btn btn-primary">افزودن محصول جدید</button>
    
    <div id="add-product-form-container" class="form-container" style="display:none;">
        <h3>فرم محصول جدید</h3>
        <form id="add-product-form" class="admin-form">
            <input type="text" name="name" placeholder="نام محصول" required>
            <input type="text" name="price" placeholder="قیمت نمایشی" required>
            <input type="number" name="priceValue" placeholder="قیمت عددی" required>
            <textarea name="description" placeholder="توضیحات محصول" required></textarea>
            <div>   
                <label for="add-image" class="btn btn-secondary">انتخاب تصویر اصلی</label>
                <input type="file" id="add-image" name="image" accept="image/webp, image/jpeg, image/png" style="display: none;" required>
                <span id="add-image-filename" class="file-info"></span>
            </div>
             <div>
                <label for="add-thumbnail" class="btn btn-secondary">انتخاب تصویر کوچک (Thumbnail)</label>
                <input type="file" id="add-thumbnail" name="thumbnail" accept="image/webp, image/jpeg, image/png" style="display: none;" required>
                <span id="add-thumbnail-filename" class="file-info"></span>
            </div>
            <input type="text" name="material" placeholder="جنس" required>
            <input type="text" name="dimensions" placeholder="ابعاد" required>
            <select name="category" required><option value="تابلو هنری">تابلو هنری</option><option value="دکوری">دکوری</option></select>
            <input type="text" name="tags" placeholder="تگ‌ها (جدا شده با کاما)">
            <button type="submit" class="btn btn-primary">ذخیره محصول</button>
            <button type="button" id="cancel-add-product-btn" class="btn btn-secondary">انصراف</button>
        </form>
    </div>

    <div id="edit-product-form-container" class="form-container" style="display:none;">
        <h3>فرم ویرایش محصول</h3>
        <div class="edit-form-layout">
            <div class="admin-form-column">
                <form id="edit-product-form" class="admin-form">
                    <input type="hidden" name="id">
                    <input type="hidden" name="oldImageUrl">
                    <input type="text" name="name" placeholder="نام محصول" required>
                    <input type="text" name="price" placeholder="قیمت نمایشی" required>
                    <input type="number" name="priceValue" placeholder="قیمت عددی" required>
                    <textarea name="description" placeholder="توضیحات محصول" required rows="5"></textarea>
                    <div>
                        <label for="edit-image" class="btn btn-secondary">تغییر تصویر</label>
                        <input type="file" id="edit-image" name="image" accept="image/webp, image/jpeg, image/png" style="display: none;">
                        <span id="edit-image-filename" class="file-info"></span>
                    </div>
                    <div id="current-image-preview"></div>
                    <input type="text" name="material" placeholder="جنس" required>
                    <input type="text" name="dimensions" placeholder="ابعاد" required>
                    <select name="category" required><option value="تابلو هنری">تابلو هنry</option><option value="دکوری">دکوری</option></select>
                    <input type="text" name="tags" placeholder="تگ‌ها (جدا شده با کاما)">
                    <button type="submit" class="btn btn-primary">ذخیره تغییرات</button>
                    <button type="button" id="cancel-edit-product-btn" class="btn btn-secondary">انصراف</button>
                </form>
            </div>
            <div class="admin-previews-column">
                <div class="admin-preview-pane">
                    <h4>پیش‌نمایش کارت محصول</h4>
                    <div class="admin-preview-pane-content" id="card-preview-container">
                        </div>
                </div>
                <div class="admin-preview-pane">
                    <h4>پیش‌نمایش جزئیات محصول</h4>
                    <div class="admin-preview-pane-content" id="detail-preview-container">
                        </div>
                </div>
            </div>
        </div>
    </div>

    <table class="admin-table">
        <thead><tr><th>ID</th><th>نام</th><th>قیمت</th><th>عملیات</th></tr></thead>
        <tbody>
            ${products.map(p => `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td>${p.price}</td>
                    <td class="actions">
                        <button class="btn-edit" data-id="${p.id}">ویرایش</button>
                        <button class="btn-delete" data-id="${p.id}">حذف</button>
                    </td>
                </tr>`).join('')}
        </tbody>
    </table>
`;
        // STEP 2: ATTACH ALL EVENT LISTENERS
// STEP 2: ATTACH ALL EVENT LISTENERS (Correct and Final Version)

        // --- Search Logic ---
        const searchInput = document.getElementById('admin-product-search');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const tableRows = panel.querySelectorAll('.admin-table tbody tr');
            tableRows.forEach(row => {
                const productName = row.cells[1].textContent.toLowerCase();
                row.style.display = productName.includes(searchTerm) ? '' : 'none';
            });
        });

        // --- Form Visibility Logic ---
        document.getElementById('show-add-product-form-btn').addEventListener('click', () => {
            document.getElementById('add-product-form-container').style.display = 'block';
            document.getElementById('edit-product-form-container').style.display = 'none';
        });
        document.getElementById('cancel-add-product-btn').addEventListener('click', () => {
            document.getElementById('add-product-form-container').style.display = 'none';
        });
        document.getElementById('cancel-edit-product-btn').addEventListener('click', () => {
            document.getElementById('edit-product-form-container').style.display = 'none';
        });

        // --- File Input Display Logic ---
        const addFileInput = document.getElementById('add-image');
        const addFileNameSpan = document.getElementById('add-image-filename');
        addFileInput.addEventListener('change', () => {
            addFileNameSpan.textContent = addFileInput.files.length > 0 ? addFileInput.files[0].name : '';
        });
        const editFileInput = document.getElementById('edit-image');
        const editFileNameSpan = document.getElementById('edit-image-filename');
        editFileInput.addEventListener('change', () => {
            editFileNameSpan.textContent = editFileInput.files.length > 0 ? editFileInput.files[0].name : '';
        });
        const addThumbnailInput = document.getElementById('add-thumbnail');
        const addThumbnailNameSpan = document.getElementById('add-thumbnail-filename');
        addThumbnailInput.addEventListener('change', () => {
            addThumbnailNameSpan.textContent = addThumbnailInput.files.length > 0 ? addThumbnailInput.files[0].name : '';
        });

        // --- Add Product Form Submission ---
        document.getElementById('add-product-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const imageFile = form.image.files[0];
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'در حال آپلود تصویر...';
            if (!imageFile) {
                alert('لطفا یک تصویر برای محصول انتخاب کنید.');
                submitButton.disabled = false;
                submitButton.textContent = 'ذخیره محصول';
                return;
            }
            try {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = `public/${fileName}`;
                const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, imageFile);
                if (uploadError) throw uploadError;
                const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
                const imageUrl = urlData.publicUrl;
                submitButton.textContent = 'در حال ذخیره محصول...';
                const newProduct = { name: form.name.value, price: form.price.value, priceValue: parseInt(form.priceValue.value, 10), description: form.description.value, image: imageUrl, material: form.material.value, dimensions: form.dimensions.value, category: form.category.value, tags: form.tags.value.split(',').map(tag => tag.trim()) };
                const { error: insertError } = await supabase.from('products').insert([newProduct]);
                if (insertError) throw insertError;
                alert('محصول با موفقیت اضافه شد.');
                form.reset();
                document.getElementById('add-product-form-container').style.display = 'none';
                renderProductsPanel();
            } catch (error) {
                alert(`خطا در افزودن محصول: ${error.message}`);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'ذخیره محصول';
            }
        });

        // --- Edit Product Form Submission ---
        document.getElementById('edit-product-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const productId = form.id.value;
            const oldImageUrl = form.oldImageUrl.value;
            const imageFile = form.image.files[0];
            const submitButton = form.querySelector('button[type="submit"]');
            let newImageUrl = oldImageUrl;
            submitButton.disabled = true;
            try {
                if (imageFile) {
                    submitButton.textContent = 'در حال آپلود تصویر جدید...';
                    const fileExt = imageFile.name.split('.').pop();
                    const fileName = `${Date.now()}.${fileExt}`;
                    const filePath = `public/${fileName}`;
                    const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, imageFile);
                    if (uploadError) throw uploadError;
                    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
                    newImageUrl = urlData.publicUrl;
                }
                submitButton.textContent = 'در حال ذخیره تغییرات...';
                const updatedProduct = { name: form.name.value, price: form.price.value, priceValue: parseInt(form.priceValue.value, 10), description: form.description.value, image: newImageUrl, material: form.material.value, dimensions: form.dimensions.value, category: form.category.value, tags: form.tags.value.split(',').map(tag => tag.trim()) };
                const { error: updateError } = await supabase.from('products').update(updatedProduct).eq('id', productId);
                if (updateError) throw updateError;
                if (imageFile && oldImageUrl) {
                    const oldImageName = oldImageUrl.split('/').pop();
                    if (oldImageName) {
                        await supabase.storage.from('product-images').remove([`public/${oldImageName}`]);
                    }
                }
                alert('محصول با موفقیت به‌روزرسانی شد.');
                form.reset();
                document.getElementById('edit-product-form-container').style.display = 'none';
                renderProductsPanel();
            } catch (error) {
                alert(`خطا در به‌روزرسانی محصول: ${error.message}`);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'ذخیره تغییرات';
            }
        });

        // --- Table Actions (Edit/Delete) ---
        const productTable = panel.querySelector('.admin-table');
        productTable.addEventListener('click', async (e) => {
            const target = e.target;
            const productId = target.dataset.id;
            if (!productId) return;

            if (target.classList.contains('btn-delete')) {
                if (confirm(`آیا از حذف محصول با ID ${productId} اطمینان دارید؟`)) {
                    try {
                        const { error } = await supabase.from('products').delete().eq('id', productId);
                        if (error) throw error;
                        alert('محصول با موفقیت حذف شد.');
                        renderProductsPanel();
                    } catch (error) {
                        alert(`خطا در حذف محصول: ${error.message}`);
                    }
                }
            }

            if (target.classList.contains('btn-edit')) {
                try {
                    const { data: product, error } = await supabase.from('products').select('*').eq('id', productId).single();
                    if (error) throw error;
                    const editContainer = document.getElementById('edit-product-form-container');
                    document.getElementById('add-product-form-container').style.display = 'none';
                    editContainer.style.display = 'block';
                    const editForm = document.getElementById('edit-product-form');
                    editForm.id.value = product.id;
                    editForm.name.value = product.name;
                    editForm.price.value = product.price;
                    editForm.priceValue.value = product.priceValue;
                    editForm.oldImageUrl.value = product.image;
                    editForm.description.value = product.description;
                    editForm.material.value = product.material;
                    editForm.dimensions.value = product.dimensions;
                    editForm.category.value = product.category;
                    editForm.tags.value = product.tags ? product.tags.join(', ') : '';
                    editContainer.scrollIntoView({ behavior: 'smooth' });
                    updateAdminPreviews();
                    attachPreviewListeners();   
                } catch (error) {
                    alert(`خطا در دریافت اطلاعات محصول: ${error.message}`);
                }
            }
        });
            }
         catch (error) {
            panel.innerHTML = `<p class="error-message">خطا در بارگذاری محصولات: ${error.message}</p>`;
        }
    }
    async function renderOrdersPanel() {
    const panel = document.getElementById('orders-panel');
    panel.innerHTML = `<h2>سفارشات مشتریان</h2><p>در حال بارگذاری سفارشات...</p>`;

    try {
        // Fetch all orders, newest first
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        if (orders.length === 0) {
            panel.innerHTML = '<h2>سفارشات مشتریان</h2><p>هیچ سفارشی یافت نشد.</p>';
            return;
        }

        // Fetch all products to map product IDs to names
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, name');

        if (productsError) throw productsError;
        const productMap = new Map(products.map(p => [p.id, p.name]));

        // Generate the HTML for all orders
        panel.innerHTML = `
            <h2>سفارشات مشتریان (${orders.length})</h2>
            <div class="admin-orders-list">
                ${orders.map(order => `
                    <div class="admin-order-card">
                        <div class="order-header">
                            <h3>سفارش #${order.id}</h3>
                            <span class="order-status">${order.status || 'ثبت شده'}</span>
                        </div>
                        <div class="order-details-grid">
                            <p><strong>تاریخ:</strong> ${new Date(order.created_at).toLocaleDateString('fa-IR')}</p>
                            <p><strong>مبلغ کل:</strong> ${order.total_price.toLocaleString('fa-IR')} تومان</p>
                            <p><strong>نام مشتری:</strong> ${order.customer_name}</p>
                            <p><strong>شماره تماس:</strong> ${order.phone_number}</p>
                            <p class="full-width"><strong>آدرس:</strong> ${order.shipping_address}</p>
                        </div>
                        <h4>اقلام سفارش:</h4>
                        <table class="order-items-table">
                            <thead><tr><th>محصول</th><th>تعداد</th><th>قیمت در زمان خرید</th></tr></thead>
                            <tbody>
                                ${order.cart_items.map(item => `
                                    <tr>
                                        <td>${productMap.get(item.product_id) || `محصول حذف شده (ID: ${item.product_id})`}</td>
                                        <td>${item.quantity}</td>
                                        <td>${item.price_at_purchase.toLocaleString('fa-IR')} تومان</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        panel.innerHTML = `<p class="error-message">خطا در بارگذاری سفارشات: ${error.message}</p>`;
    }
}
async function renderMessagesPanel() {
    const panel = document.getElementById('messages-panel');
    panel.innerHTML = `<h2>پیام‌های کاربران</h2><p>در حال بارگذاری پیام‌ها...</p>`;

    try {
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (messages.length === 0) {
            panel.innerHTML = '<h2>پیام‌های کاربران</h2><p>هیچ پیامی یافت نشد.</p>';
            return;
        }

        panel.innerHTML = `
            <h2>پیام‌های کاربران (${messages.length})</h2>
            <div class="admin-messages-list">
                ${messages.map(msg => `
                    <div class="admin-message-card">
                        <div class="message-header">
                            <div>
                                <p><strong>فرستنده:</strong> ${msg.name}</p>
                                <p><strong>ایمیل:</strong> <a href="mailto:${msg.email}">${msg.email}</a></p>
                            </div>
                            <span class="message-date">${new Date(msg.created_at).toLocaleString('fa-IR')}</span>
                        </div>
                        <div class="message-body">
                            <p>${msg.message}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

    } catch (error) {
        panel.innerHTML = `<p class="error-message">خطا در بارگذاری پیام‌ها: ${error.message}</p>`;
    }
}

// ADD THIS ENTIRE BLOCK BEFORE checkAdminAccess();

function updateAdminPreviews() {
    const editForm = document.getElementById('edit-product-form');
    if (!editForm) return;

    // 1. Get current values from the form
    const productData = {
        name: editForm.name.value || "نام محصول",
        price: editForm.price.value || "قیمت",
        description: editForm.description.value || "توضیحات محصول در اینجا قرار می‌گیرد...",
        material: editForm.material.value || "جنس",
        dimensions: editForm.dimensions.value || "ابعاد",
        image: editForm.oldImageUrl.value // Default to the existing image
    };

    const cardPreviewContainer = document.getElementById('card-preview-container');
    const detailPreviewContainer = document.getElementById('detail-preview-container');
    const imageInput = document.getElementById('edit-image');
    const currentImagePreview = document.getElementById('current-image-preview');

    // 2. Handle image preview (newly selected vs. existing)
    let imageUrl = productData.image;
    if (imageInput.files && imageInput.files[0]) {
        imageUrl = URL.createObjectURL(imageInput.files[0]);
    }

    // 3. Render the Card Preview
    cardPreviewContainer.innerHTML = `
        <div class="product-card">
            <a href="#" class="product-card-link" onclick="event.preventDefault();">
                <div class="product-card-image-container">
                    <img src="${imageUrl}" alt="Preview">
                </div>
                <div class="product-card-content">
                    <h3>${productData.name}</h3>
                    <p class="price">${productData.price}</p>
                </div>
            </a>
            <div class="product-card-actions">
                <button class="btn btn-primary quick-add-btn" disabled>افزودن به سبد</button>
            </div>
        </div>
    `;

    // 4. Render the Detail Preview
    detailPreviewContainer.innerHTML = `
        <div class="product-detail-info">
            <h1>${productData.name}</h1>
            <p class="product-detail-price">${productData.price}</p>
            <p class="product-detail-description" style="font-size: 0.9em; max-height: 80px; overflow: auto;">${productData.description.replace(/\n/g, '<br>')}</p>
            <div class="product-meta" style="font-size: 0.85em;">
                <p><strong>جنس:</strong> ${productData.material}</p>
                <p><strong>ابعاد:</strong> ${productData.dimensions}</p>
            </div>
        </div>
    `;
    
    // Also update the small preview under the file input
    currentImagePreview.innerHTML = `<p style="margin-top:1rem;font-weight:600;">تصویر فعلی:</p><img src="${imageUrl}" alt="Current image" style="max-width:100px;margin-top:0.5rem;border-radius:4px;">`;
}

function attachPreviewListeners() {
    const editForm = document.getElementById('edit-product-form');
    if(editForm) {
        // Listen for any input event on the form
        editForm.addEventListener('input', updateAdminPreviews);
        
        // Specifically listen for file changes
        const imageInput = document.getElementById('edit-image');
        if (imageInput) {
            imageInput.addEventListener('change', updateAdminPreviews);
        }
    }
}
    checkAdminAccess();
});