// app/components/Header.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { updateCartBadge } from '../lib/cart-service';

export default function Header() {
  useEffect(() => {
    if (typeof window.bootstrap !== 'undefined') {
      // Initialize dropdowns
      const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
      dropdownElementList.map(function (dropdownToggleEl) {
        return new (window as any).bootstrap.Dropdown(dropdownToggleEl);
      });
    }
    updateCartBadge();
  }, []);

  return (
    <>
      <div className="dev-notice">
        <strong>توجه:</strong> این وب‌سایت در حال توسعه است و صرفاً جهت نمایش نمونه کار می‌باشد.
      </div>
      <header className="p-3 shadow-sm sticky-top bg-light">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            
            {/* --- GROUP 1: BRAND AND NAVIGATION --- */}
            <div className="d-flex align-items-center">
              <Link href="/" className="d-flex align-items-center text-dark text-decoration-none">
                <Image src="/images/log.webp" alt="لوگوی هرا دکور" width="40" height="40" className="rounded-circle" />
                <span className="fs-4 me-3">کادو هنری هرا</span>
              </Link>

              <ul className="nav d-none d-lg-flex">
                <li><Link href="/" className="nav-link px-2 link-dark d-flex align-items-center"><i className="bi bi-house-door ms-1"></i>خانه</Link></li>
                <li className="nav-item dropdown">
                  <a className="nav-link px-2 link-dark d-flex align-items-center dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-shop ms-1"></i>فروشگاه
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><Link className="dropdown-item" href="/products">همه محصولات</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#">گلدان و ظروف تزئینی</a></li>
                  </ul>
                </li>
                <li><a href="#" className="nav-link px-2 link-dark d-flex align-items-center"><i className="bi bi-tag ms-1"></i>تخفیف‌ها</a></li>
                <li><Link href="/about" className="nav-link px-2 link-dark d-flex align-items-center"><i className="bi bi-info-circle ms-1"></i>درباره ما</Link></li>
                <li><a href="#" className="nav-link px-2 link-dark d-flex align-items-center"><i className="bi bi-telephone ms-1"></i>تماس با ما</a></li>
              </ul>
            </div>

            {/* --- GROUP 2: SEARCH AND ICONS --- */}
            <div className="d-flex align-items-center">
              <form className="me-3 d-none d-lg-block" role="search">
                <input type="search" className="form-control" placeholder="جستجو..." aria-label="Search" />
              </form>
              <div className="text-end d-flex">
                <a href="#" className="btn btn-light me-2">
                  <i className="bi bi-person fs-5"></i>
                </a>
                <Link href="/cart" className="btn btn-light position-relative">
                  <i className="bi bi-cart3 fs-5"></i>
                  <span id="cart-badge" className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    0
                  </span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </header>
    </>
  );
}