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
                        <input type="text" name="image" placeholder="URL تصویر محصول" required>
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

        } catch (error) {
            panel.innerHTML = `<p class="error-message">خطا در بارگذاری محصولات: ${error.message}</p>`;
        }
    }

    checkAdminAccess();
});