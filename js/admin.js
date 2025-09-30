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
        panel.innerHTML = `<h2>مدیریت محصولات</h2><p>در حال بارگذاری محصولات...</p>`;

        try {
            const { data: products, error } = await supabase.from('products').select('*').order('id');
            if (error) throw error;

            panel.innerHTML = `
                <h2>مدیریت محصولات</h2>
                <button id="show-add-product-form-btn" class="btn btn-primary">افزودن محصول جدید</button>
                <div id="add-product-form-container" class="form-container" style="display:none;">
                    <h3>فرم محصول جدید</h3>
                    <form id="add-product-form" class="admin-form">
                        <input type="text" name="name" placeholder="نام محصول" required>
                        <input type="text" name="price" placeholder="قیمت نمایشی (مثال: ۵۵۰,۰۰۰ تومان)" required>
                        <input type="number" name="priceValue" placeholder="قیمت عددی (مثال: 550000)" required>
                        <textarea name="description" placeholder="توضیحات محصول" required></textarea>
                        <label for="add-image">تصویر محصول</label>
                        <input type="file" id="add-image" name="image" accept="image/webp, image/jpeg, image/png">
                        <input type="text" name="material" placeholder="جنس" required>
                        <input type="text" name="dimensions" placeholder="ابعاد" required>
                        <select name="category" required>
                            <option value="تابلو هنری">تابلو هنری</option>
                            <option value="دکوری">دکوری</option>
                        </select>
                        <input type="text" name="tags" placeholder="تگ‌ها (جدا شده با کاما)">
                        <button type="submit" class="btn btn-primary">ذخیره محصول</button>
                        <button type="button" id="cancel-add-product-btn" class="btn btn-secondary">انصراف</button>
                    </form>
                </div>
                <div id="edit-product-form-container" class="form-container" style="display:none;">
                    <h3>فرم ویرایش محصول</h3>
                    <form id="edit-product-form" class="admin-form">
                        <input type="hidden" name="id">
                        <input type="text" name="name" placeholder="نام محصول" required>
                        <input type="text" name="price" placeholder="قیمت نمایشی" required>
                        <input type="number" name="priceValue" placeholder="قیمت عددی" required>
                        <textarea name="description" placeholder="توضیحات محصول" required></textarea>
                        <label for="edit-image">تغییر تصویر محصول (اختیاری)</label>
                        <input type="file" id="edit-image" name="image" accept="image/webp, image/jpeg, image/png">
                        <input type="text" name="material" placeholder="جنس" required>
                        <input type="text" name="dimensions" placeholder="ابعاد" required>
                        <select name="category" required>
                            <option value="تابلو هنری">تابلو هنری</option>
                            <option value="دکوری">دکوری</option>
                        </select>
                        <input type="text" name="tags" placeholder="تگ‌ها (جدا شده با کاما)">
                        <button type="submit" class="btn btn-primary">ذخیره تغییرات</button>
                        <button type="button" id="cancel-edit-product-btn" class="btn btn-secondary">انصراف</button>
                    </form>
                </div>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>نام</th>
                            <th>قیمت</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
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
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            document.getElementById('show-add-product-form-btn').addEventListener('click', () => {
                document.getElementById('add-product-form-container').style.display = 'block';
            });

            document.getElementById('cancel-add-product-btn').addEventListener('click', () => {
                document.getElementById('add-product-form-container').style.display = 'none';
            });

            document.getElementById('add-product-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const form = e.target;
                const newProduct = {
                    name: form.name.value,
                    price: form.price.value,
                    priceValue: parseInt(form.priceValue.value, 10),
                    description: form.description.value,
                    image: form.image.value,
                    material: form.material.value,
                    dimensions: form.dimensions.value,
                    category: form.category.value,
                    tags: form.tags.value.split(',').map(tag => tag.trim())
                };

                const { error } = await supabase.from('products').insert([newProduct]);
                
                if (error) {
                    alert('خطا در افزودن محصول: ' + error.message);
                } else {
                    alert('محصول با موفقیت اضافه شد.');
                    form.reset();
                    document.getElementById('add-product-form-container').style.display = 'none';
                    renderProductsPanel();
                }
            });
                        // --- Cancel Edit Button ---
            document.getElementById('cancel-edit-product-btn').addEventListener('click', () => {
                document.getElementById('edit-product-form-container').style.display = 'none';
            });

            // --- Submit Edit Form ---
// --- Submit Edit Form ---
document.getElementById('edit-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const productId = form.id.value;

    const updatedProduct = {
        name: form.name.value,
        price: form.price.value,
        priceValue: parseInt(form.priceValue.value, 10),
        description: form.description.value,
        image: form.image.value,
        material: form.material.value,
        dimensions: form.dimensions.value,
        category: form.category.value,
        tags: form.tags.value.split(',').map(tag => tag.trim())
    };

    try {
        const { error } = await supabase
            .from('products')
            .update(updatedProduct)
            .eq('id', productId);

        if (error) throw error;

        alert('محصول با موفقیت به‌روزرسانی شد.');
        form.reset();
        document.getElementById('edit-product-form-container').style.display = 'none';
        renderProductsPanel(); // Re-render the table with updated data

    } catch (error) {
        alert(`خطا در به‌روزرسانی محصول: ${error.message}`);
    }
});
            // --- Add Event Listeners for Edit/Delete Buttons ---
            const productTable = panel.querySelector('.admin-table');
            if (productTable) {
                
                productTable.addEventListener('click', async (e) => {
                    const target = e.target;
                    const productId = target.dataset.id;

                    if (!productId) return;

                    // Handle Delete Button Click
                    if (target.classList.contains('btn-delete')) {
                        if (confirm(`آیا از حذف محصول با ID ${productId} اطمینان دارید؟ این عمل غیرقابل بازگشت است.`)) {
                            try {
                                const { error } = await supabase
                                    .from('products')
                                    .delete()
                                    .eq('id', productId);

                                if (error) throw error;

                                alert('محصول با موفقیت حذف شد.');
                                renderProductsPanel(); // Re-render the table to show the change
                            } catch (error) {
                                alert(`خطا در حذف محصول: ${error.message}`);
                            }
                        }
                    }

                    // Handle Edit Button Click (Placeholder for next commit)
                    // Handle Edit Button Click
                    if (target.classList.contains('btn-edit')) {
                        try {
                            // Fetch the full product details
                            const { data: product, error } = await supabase
                                .from('products')
                                .select('*')
                                .eq('id', productId)
                                .single();

                            if (error) throw error;

                            // Show the edit form and hide the add form
                            const editContainer = document.getElementById('edit-product-form-container');
                            const addContainer = document.getElementById('add-product-form-container');
                            editContainer.style.display = 'block';
                            addContainer.style.display = 'none';

                            // Populate the form with the fetched data
                            const editForm = document.getElementById('edit-product-form');
                            editForm.id.value = product.id;
                            editForm.name.value = product.name;
                            editForm.price.value = product.price;
                            editForm.priceValue.value = product.priceValue;
                            editForm.description.value = product.description;
                            editForm.image.value = product.image;
                            editForm.material.value = product.material;
                            editForm.dimensions.value = product.dimensions;
                            editForm.category.value = product.category;
                            editForm.tags.value = product.tags ? product.tags.join(', ') : '';

                            editContainer.scrollIntoView({ behavior: 'smooth' });

                        } catch (error) {
                            alert(`خطا در دریافت اطلاعات محصول: ${error.message}`);
                        }
                    }
                });
            }

        } catch (error) {
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
    checkAdminAccess();
});