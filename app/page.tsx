// app/page.tsx
import ProgressLink from './components/ProgressLink';
import { fetchProducts } from './lib/product-service';
import ProductCard from './components/ProductCard';

export default async function HomePage() {
  const featuredProducts = await fetchProducts(4);

  return (
    <>
      <section className="py-5 text-center bg-light rounded-3">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">زیبایی را به خانه خود بیاورید</h1>
            <p className="lead text-muted">جدیدترین محصولات دکوراتیو و اکسسوری‌های منزل را در هرا دکور پیدا کنید. کیفیتی که انتظار دارید و طراحی که عاشقش می‌شوید.</p>
            <p>
              <ProgressLink href="/products" className="btn btn-primary my-2">مشاهده همه محصولات</ProgressLink>
            </p>
          </div>
        </div>
      </section>

      <section className="py-5">
        <h2 className="text-center mb-4">محصولات منتخب</h2>
        {featuredProducts.length === 0 ? (
          <p className="text-center text-muted">در حال حاضر محصولی برای نمایش وجود ندارد.</p>
        ) : (
          <div id="featured-products-grid" className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
            {featuredProducts.map((product, index) => (
              <div className="col" key={product.id}>
                <ProductCard product={product} priority={index === 0} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
