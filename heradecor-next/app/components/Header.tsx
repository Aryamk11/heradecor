// app/components/Header.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { updateCartBadge } from '../lib/cart-service';

export default function Header() {
  useEffect(() => {
    updateCartBadge();
  }, []);

  return (
    <>
      <div className="dev-notice">
        <strong>توجه:</strong> این وب‌سایت در حال توسعه است و صرفاً جهت نمایش نمونه کار می‌باشد.
      </div>
      <header className="p-3 shadow-sm sticky-top bg-light">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-between position-relative">
            <div className="d-flex align-items-center">
              <button className="navbar-toggler d-lg-none me-3" type="button" data-bs-toggle="collapse" data-bs-target="#main-nav-collapse" aria-controls="main-nav-collapse" aria-expanded="false" aria-label="Toggle navigation">
                <i className="bi bi-list fs-2"></i>
              </button>
              <Link href="/" className="d-none d-lg-flex align-items-center text-dark text-decoration-none">
                {/* CORRECTED IMAGE PATH BELOW */}
                <Image src="/images/log.webp" alt="لوگوی هرا دکور" width="40" height="40" className="rounded-circle me-2" />
                <span className="fs-4">کادو هنری هرا</span>
              </Link>
            </div>

            <ul className="nav d-none d-lg-flex col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 ps-lg-4">
              <li><Link href="/" className="nav-link px-2 link-dark d-flex align-items-center"><i className="bi bi-house-door me-2"></i>خانه</Link></li>
              <li className="nav-item dropdown">
                <Link className="nav-link px-2 link-dark d-flex align-items-center dropdown-toggle" href="/products" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-shop me-2"></i>فروشگاه
                </Link>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><Link className="dropdown-item" href="/products">همه محصولات</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#">گلدان و ظروف تزئینی</a></li>
                  <li><a className="dropdown-item" href="#">آینه و هنر دیواری</a></li>
                  <li><a className="dropdown-item" href="#">شمع و خوشبوکننده</a></li>
                </ul>
              </li>
              <li><a href="#" className="nav-link px-2 link-dark d-flex align-items-center"><i className="bi bi-tag me-2"></i>تخفیف‌ها</a></li>
              <li><Link href="/about" className="nav-link px-2 link-dark d-flex align-items-center"><i className="bi bi-info-circle me-2"></i>درباره ما</Link></li>
              <li><a href="#" className="nav-link px-2 link-dark d-flex align-items-center"><i className="bi bi-telephone me-2"></i>تماس با ما</a></li>
            </ul>

            <Link href="/" className="text-dark text-decoration-none mobile-brand-name d-lg-none">کادو هنری هرا</Link>

            <div className="d-flex align-items-center col-auto">
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
                    <span className="visually-hidden">محصول در سبد خرید</span>
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