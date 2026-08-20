// app/products/page.tsx
import { Suspense } from 'react';
import { fetchAllProducts, fetchCategories } from '../lib/product-service';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import ProductGridSkeleton from '../components/ProductCardSkeleton';

export const metadata = {
  title: 'همه محصولات - فروشگاه هرا دکور',
  description: 'مجموعه کامل تابلوها و اکسسوری‌های دکوراتیو هرا دکور',
};

type Props = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

/**
 * Split out so the grid can stream behind a skeleton. The Suspense boundary lives
 * inside this page rather than in a loading.tsx, which would also wrap
 * /products/[id] and stop notFound() there from returning a real 404.
 */
async function ProductGrid({ search, category }: { search?: string; category?: string }) {
  const products = await fetchAllProducts({ search, category });

  if (products.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-search fs-1 text-muted" aria-hidden="true"></i>
        <p className="mt-3 mb-1">محصولی با این مشخصات پیدا نشد.</p>
        <p className="text-muted small">عبارت دیگری را جستجو کنید یا فیلترها را بردارید.</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-muted small mb-3">
        {products.length.toLocaleString('fa-IR')} محصول
      </p>
      <div id="all-products-grid" className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
        {products.map((product, index) => (
          <div className="col" key={product.id}>
            <ProductCard product={product} priority={index < 4} />
          </div>
        ))}
      </div>
    </>
  );
}

export default async function ProductsPage({ searchParams }: Props) {
  const { q, category } = await searchParams;
  const categories = await fetchCategories();

  return (
    <div>
      <h1 className="text-center mb-4">
        {category ? category : q ? `نتایج جستجو برای «${q}»` : 'همه محصولات'}
      </h1>

      <ProductFilters categories={categories} />

      {/* Re-suspends whenever the filters change, so the skeleton shows again. */}
      <Suspense key={`${q ?? ''}|${category ?? ''}`} fallback={<ProductGridSkeleton />}>
        <ProductGrid search={q} category={category} />
      </Suspense>
    </div>
  );
}
