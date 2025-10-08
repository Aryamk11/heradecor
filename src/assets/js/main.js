/* src/assets/js/main.js */

// ۰. لوگو را از مسیر آن وارد می‌کنیم
import logoImage from '../images/log.webp';

// ۱. فایل Sass را ایمپورت کن
import '../scss/styles.scss';

// ۲. کدهای جاوااسکریپت بوت‌استرپ را ایمپورت کن
import * as bootstrap from 'bootstrap';

// ۳. کلاینت Supabase را ایمپورت کن
import { supabase } from './supabaseClient.js';

// ۴. مسیر لوگوی وارد شده را در تگ img قرار بده
document.addEventListener('DOMContentLoaded', () => {
    const logoElement = document.getElementById('header-logo');
    if (logoElement) {
        logoElement.src = logoImage;
    }
    
    // ۵. محصولات منتخب را از Supabase دریافت و نمایش بده
    fetchAndDisplayFeaturedProducts();
});

// تابع برای دریافت و نمایش محصولات
async function fetchAndDisplayFeaturedProducts() {
    const productGrid = document.getElementById('featured-products-grid');
    if (!productGrid) return; // فقط در صفحه‌ای که این المان وجود دارد اجرا شو

    try {
        // از جدول 'products'، چهار محصول اول را انتخاب کن
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .limit(4);

        if (error) {
            throw error; // اگر خطایی رخ داد، آن را به بلوک catch بفرست
        }

        // اگر محصولی وجود نداشت، پیامی نمایش بده
        if (products.length === 0) {
            productGrid.innerHTML = '<p class="text-center text-muted">محصولی برای نمایش یافت نشد.</p>';
            return;
        }

        // کارت‌های محصولات را ایجاد و در گرید قرار بده
        productGrid.innerHTML = products.map(product => `
            <div class="col">
                <div class="card shadow-sm product-card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description.substring(0, 80)}...</p>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-outline-secondary">مشاهده</button>
                                <button type="button" class="btn btn-sm btn-primary">افزودن به سبد</button>
                            </div>
                            <small class="text-muted">${product.price}</small>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('خطا در دریافت محصولات:', error);
        productGrid.innerHTML = '<p class="text-center text-danger">خطا در بارگذاری محصولات. لطفاً بعداً تلاش کنید.</p>';
    }
}

console.log("پروژه گالری هرا با موفقیت راه‌اندازی شد!");