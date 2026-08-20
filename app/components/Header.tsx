// app/components/Header.tsx
"use client";

import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import CartBadge from './CartBadge';
import ProgressLink from './ProgressLink';
import LinkPending from './LinkPending';
import { startNavigationProgress } from './NavigationProgress';

export default function Header({ categories }: { categories: string[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [term, setTerm] = useState('');
  const collapseRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  useEffect(() => {
    setTerm(searchParams.get('q') ?? '');
  }, [searchParams]);

  // Collapse the mobile menu after navigating; Bootstrap leaves it open otherwise.
  useEffect(() => {
    collapseRef.current?.classList.remove('show');
  }, [pathname, searchParams]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = term.trim();
    startNavigationProgress();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
  };

  const categoryItems = (className: string) =>
    categories.length > 0 ? (
      categories.map((category) => (
        <li key={category}>
          <ProgressLink
            className={className}
            href={`/products?category=${encodeURIComponent(category)}`}
          >
            {category}
          </ProgressLink>
        </li>
      ))
    ) : (
      <li><span className={`${className} disabled`} aria-disabled="true">دسته‌بندی‌ای موجود نیست</span></li>
    );

  return (
    <>
      <div className="dev-notice">
        <strong>توجه:</strong> این وب‌‌سایت در حال توسعه است و صرفاً جهت نمایش نمونه کار می‌باشد.
      </div>

      <header className="p-3 shadow-sm sticky-top bg-light">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-between">

            {/* --- Brand + desktop navigation --- */}
            <div className="d-flex align-items-center">
              <button
                className="navbar-toggler d-lg-none me-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#main-nav-collapse"
                aria-controls="main-nav-collapse"
                aria-expanded="false"
                aria-label="باز و بسته کردن منو"
              >
                <i className="bi bi-list fs-2" aria-hidden="true"></i>
              </button>
              <ProgressLink href="/" className="d-none d-lg-flex align-items-center text-dark text-decoration-none">
                <Image
                  id="header-logo"
                  src="/images/log.webp"
                  alt="لوگوی هرا دکور"
                  width={40}
                  height={40}
                  className="rounded-circle me-3"
                />
                <span className="fs-4">کادو هنری هرا</span>
              </ProgressLink>

              <ul className="nav d-none d-lg-flex col-lg-auto mb-0 justify-content-center">
                <li className="nav-item">
                  <ProgressLink href="/" className={`nav-link px-3 d-flex align-items-center ${isActive('/') ? 'active' : 'link-dark'}`}>
                    <i className="bi bi-house-door me-2" aria-hidden="true"></i>خانه
                    <LinkPending />
                  </ProgressLink>
                </li>
                <li className="nav-item dropdown">
                  <button
                    className={`nav-link px-1 d-flex align-items-center dropdown-toggle ${isActive('/products') ? 'active' : 'link-dark'}`}
                    id="navbarDropdown"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-shop me-2" aria-hidden="true"></i>فروشگاه
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><ProgressLink className="dropdown-item" href="/products">همه محصولات</ProgressLink></li>
                    <li><hr className="dropdown-divider" /></li>
                    {categoryItems('dropdown-item')}
                  </ul>
                </li>
                <li className="nav-item">
                  <ProgressLink href="/about" className={`nav-link px-1 d-flex align-items-center ${isActive('/about') ? 'active' : 'link-dark'}`}>
                    <i className="bi bi-info-circle me-2" aria-hidden="true"></i>درباره ما
                    <LinkPending />
                  </ProgressLink>
                </li>
                <li className="nav-item">
                  <ProgressLink href="/contact" className={`nav-link px-1 d-flex align-items-center ${isActive('/contact') ? 'active' : 'link-dark'}`}>
                    <i className="bi bi-telephone me-2" aria-hidden="true"></i>تماس با ما
                    <LinkPending />
                  </ProgressLink>
                </li>
              </ul>
            </div>

            {/* --- Mobile brand name (centred by _layout.scss) --- */}
            <ProgressLink href="/" className="text-dark text-decoration-none mobile-brand-name d-lg-none">
              کادو هنری هرا
            </ProgressLink>

            {/* --- Search + icons --- */}
            <div className="d-flex align-items-center col-auto gap-4">
              <form className="d-none d-lg-block" role="search" onSubmit={submitSearch}>
                <input
                  type="search"
                  className="form-control"
                  placeholder="جستجو..."
                  aria-label="جستجو"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                />
              </form>

              <div className="text-end d-flex gap-3">
                <button type="button" className="btn btn-light" disabled title="حساب کاربری - به‌زودی">
                  <i className="bi bi-person fs-5" aria-hidden="true"></i>
                  <span className="visually-hidden">حساب کاربری</span>
                </button>

                <ProgressLink href="/cart" className="btn btn-light position-relative">
                  <i className="bi bi-cart3 fs-5" aria-hidden="true"></i>
                  <span className="visually-hidden">سبد خرید</span>
                  <CartBadge />
                </ProgressLink>
              </div>
            </div>
          </div>

          {/* --- Mobile collapsible navigation --- */}
          <div className="collapse navbar-collapse d-lg-none" id="main-nav-collapse" ref={collapseRef}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 mt-3">
              <li className="nav-item mb-2">
                <form role="search" onSubmit={submitSearch}>
                  <div className="input-group">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="جستجو در محصولات..."
                      aria-label="جستجو در محصولات"
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary" type="submit">
                      <i className="bi bi-search" aria-hidden="true"></i>
                      <span className="visually-hidden">جستجو</span>
                    </button>
                  </div>
                </form>
              </li>
              <li className="nav-item">
                <ProgressLink className={`nav-link ${isActive('/') ? 'active' : ''}`} href="/">
                  <i className="bi bi-house-door me-2" aria-hidden="true"></i>خانه
                </ProgressLink>
              </li>
              <li className="nav-item accordion-item">
                <h2 className="accordion-header" id="headingShop">
                  <button
                    className={`accordion-button collapsed ${isActive('/products') ? 'active' : ''}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseShop"
                    aria-expanded="false"
                    aria-controls="collapseShop"
                  >
                    <i className="bi bi-shop me-2" aria-hidden="true"></i>فروشگاه
                  </button>
                </h2>
                <div id="collapseShop" className="accordion-collapse collapse" aria-labelledby="headingShop" data-bs-parent="#main-nav-collapse">
                  <div className="accordion-body">
                    <ul className="list-unstyled mb-0">
                      <li><ProgressLink className="dropdown-item" href="/products">همه محصولات</ProgressLink></li>
                      <li><hr className="dropdown-divider" /></li>
                      {categoryItems('dropdown-item')}
                    </ul>
                  </div>
                </div>
              </li>
              <li className="nav-item">
                <ProgressLink className={`nav-link ${isActive('/about') ? 'active' : ''}`} href="/about">
                  <i className="bi bi-info-circle me-2" aria-hidden="true"></i>درباره ما
                </ProgressLink>
              </li>
              <li className="nav-item">
                <ProgressLink className={`nav-link ${isActive('/contact') ? 'active' : ''}`} href="/contact">
                  <i className="bi bi-telephone me-2" aria-hidden="true"></i>تماس با ما
                </ProgressLink>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}
