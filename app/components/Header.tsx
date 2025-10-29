// app/components/Header.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { updateCartBadge } from '../lib/cart-service'; // Assuming this path is correct

export default function Header() {
  const pathname = usePathname();

  // Effect for initializing Bootstrap components
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.bootstrap !== 'undefined') {
      const { Dropdown, Collapse } = window.bootstrap;

      const dropdownElementList = Array.from(document.querySelectorAll('.dropdown-toggle'));
      dropdownElementList.forEach((dropdownToggleEl) => {
        Dropdown.getOrCreateInstance(dropdownToggleEl);
      });
      
      const collapseElementList = Array.from(document.querySelectorAll('.collapse'));
      collapseElementList.forEach((collapseEl) => {
        // Ensure collapses are initialized but not shown
        Collapse.getOrCreateInstance(collapseEl, { toggle: false });
      });
    }
  }, []); // Run only once on mount

  // Effect for updating cart badge on navigation
  useEffect(() => {
    // We update the badge on every path change.
    updateCartBadge();
  }, [pathname]);

  return (
    <>
<div className="dev-notice" style={{padding: 0}}>
  <strong>توجه:</strong> این وب‌‌سایت در حال توسعه است و صرفاً جهت نمایش نمونه کار می‌باشد.
</div>

      {/* The `bg-light` class is likely overridden by your SCSS, which is fine */}
      <header className="p-3 shadow-sm sticky-top bg-light">
        <div className="container">
{/* --- Main header bar --- */}
          <div className="d-flex flex-wrap align-items-center justify-content-between position-relative">
            
            {/* --- NEW PARENT GROUP (BRAND + NAV) --- */}
            <div className="d-flex align-items-center">

              {/* --- GROUP 1: Mobile Toggler + Desktop Brand --- */}
              <div className="d-flex align-items-center">
                <button 
                  className="navbar-toggler d-lg-none me-3" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#main-nav-collapse" 
                  aria-controls="main-nav-collapse" 
                  aria-expanded="false" 
                  aria-label="Toggle navigation"
                >
                  <i className="bi bi-list fs-2"></i>
                </button>
                <Link href="/" className="d-none d-lg-flex align-items-center text-dark text-decoration-none">
                  <Image 
                    id="header-logo" 
                    src="/images/log.webp" // Assuming this is your logo path
                    alt="لوگوی هرا دکور" 
                    width="40" 
                    height="40" 
                    className="rounded-circle me-3"
                  />
                  <span className="fs-4">کادو هنری هرا</span>
                </Link>
              </div>

              {/* --- GROUP 2: Desktop Navigation --- */}
              <ul className="nav d-none d-lg-flex col-lg-auto mb-2 justify-content-center mb-md-0">
                <li>
                  <Link href="/" className={`nav-link px-3 d-flex align-items-center ${pathname === '/' ? 'active' : 'link-dark'}`}>
                  
                    <i className="bi bi-house-door me-2"></i>خانه
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a 
                  className={`nav-link px-1 d-flex align-items-center dropdown-toggle ${pathname.startsWith('/products') ? 'active' : 'link-dark'}`}                    href="#" 
                    id="navbarDropdown" 
                    role="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <i className="bi bi-shop me-2"></i>فروشگاه
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><Link className="dropdown-item" href="/products">همه محصولات</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#">گلدان و ظروف تزئینی</a></li>
                    <li><a className="dropdown-item" href="#">آینه و هنر دیواری</a></li>
                    <li><a className="dropdown-item" href="#">شمع و خوشبوکننده</a></li>
                  </ul>
                </li>
                <li>
                  <a href="#" className={`nav-link px-1 d-flex align-items-center ${pathname === '/discounts' ? 'active' : 'link-dark'}`}>
                    <i className="bi bi-tag me-2"></i>تخفیف‌ها
                  </a>
                </li>
                <li>
                  <Link href="/about" className={`nav-link px-1 d-flex align-items-center ${pathname === '/about' ? 'active' : 'link-dark'}`}>
                    <i className="bi bi-info-circle me-2"></i>درباره ما
                  </Link>
                </li>
                <li>
                  <a href="#" className={`nav-link px-1 d-flex align-items-center ${pathname === '/contact' ? 'active' : 'link-dark'}`}>
                    <i className="bi bi-telephone me-2"></i>تماس با ما
                  </a>
                </li>
              </ul>
            </div>
            {/* --- END OF NEW PARENT GROUP --- */}


            {/* --- GROUP 3: Mobile Brand Name --- */}
            {/* This element is positioned by your _layout.scss file */}
            <Link href="/" className="text-dark text-decoration-none mobile-brand-name d-lg-none">
              کادو هنری هرا
            </Link>

{/* --- GROUP 4: Search + Icons --- */}

{/* FIX 1: Added `gap-4` here to create space between the 
  search form and the icon group. This is cleaner than using `me-5`.
*/}
<div className="d-flex align-items-center col-auto gap-4">

  {/* Search Form - Removed `me-5` */}
  <form className="d-none d-lg-block" role="search">
    <input type="search" className="form-control" placeholder="جستجو..." aria-label="Search" />
  </form>

  {/* FIX 2: Added `gap-3` here to separate the profile
    and cart icons. This is cleaner than `me-3` on the icon.
  */}
  <div className="text-end d-flex gap-3">
    
    {/* Profile Icon - Removed `me-3` */}
    <a href="#" className="btn btn-light">
      <i className="bi bi-person fs-5"></i>
    </a>

    {/* Cart Icon */}
    <Link href="/cart" className="btn btn-light position-relative">
      <i className="bi bi-cart3 fs-5"></i>
      
      {/* FIX 3: 
        - Removed invalid 'right-span-2' class.
        - Added "9" so the badge is visible.
      */}
      <span id="cart-badge" className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger">
        9 
        <span className="visually-hidden">محصول در سبد خرید</span>
      </span>
    </Link>
  </div>
</div>
          {/* --- Mobile Collapsible Navigation --- */}
          <div className="collapse navbar-collapse d-lg-none" id="main-nav-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 mt-3">
              <li className="nav-item mb-2">
                <form role="search">
                  <div className="input-group">
                    <input type="search" className="form-control" placeholder="جستجو در محصولات..." aria-label="Search" />
                    <button className="btn btn-outline-secondary" type="submit"><i className="bi bi-search"></i></button>
                  </div>
                </form>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${pathname === '/' ? 'active' : ''}`} href="/">
                  <i className="bi bi-house-door me-2"></i>خانه
                </Link>
              </li>
              <li className="nav-item accordion-item">
                <h2 className="accordion-header" id="headingShop">
                  <button 
                    className={`accordion-button collapsed ${pathname.startsWith('/products') ? 'active' : ''}`} 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#collapseShop" 
                    aria-expanded="false" 
                    aria-controls="collapseShop"
                  >
                    <i className="bi bi-shop me-2"></i>فروشگاه
                  </button>
                </h2>
                <div id="collapseShop" className="accordion-collapse collapse" aria-labelledby="headingShop" data-bs-parent="#main-nav-collapse">
                  <div className="accordion-body">
                    <ul className="list-unstyled">
                      <li><Link className="dropdown-item" href="/products">همه محصولات</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><a className="dropdown-item" href="#">گلدان و ظروف تزئینی</a></li>
                      <li><a className="dropdown-item" href="#">آینه و هنر دیواری</a></li>
                      <li><a className="dropdown-item" href="#">شمع و خوشبوکننده</a></li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${pathname === '/discounts' ? 'active' : ''}`} href="#">
                  <i className="bi bi-tag me-2"></i>تخفیف‌ها
                </a>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${pathname === '/about' ? 'active' : ''}`} href="/about">
                  <i className="bi bi-info-circle me-2"></i>درباره ما
                </Link>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${pathname === '/contact' ? 'active' : ''}`} href="#">
                  <i className="bi bi-telephone me-2"></i>تماس با ما
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      </header>
    </>
  );
}