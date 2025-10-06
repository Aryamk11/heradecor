/* src/assets/js/main.js */

// ۰. لوگو را از مسیر آن وارد می‌کنیم
// مسیر نسبت به فایل main.js است
import logoImage from '../images/log.webp'; 

// ۱. فایل Sass را ایمپورت کن تا Vite آن را به CSS تبدیل و به صفحه اضافه کند
import '../scss/styles.scss';

// ۲. تمام کدهای جاوااسکریپت بوت‌استرپ را ایمپورت کن
import * as bootstrap from 'bootstrap';

// ۳. مسیر لوگوی وارد شده را در تگ img قرار بده
document.getElementById('header-logo').src = logoImage;

// این پیام نشان می‌دهد که همه چیز به درستی بارگذاری شده است
console.log("پروژه گالری هرا با موفقیت راه‌اندازی شد!");