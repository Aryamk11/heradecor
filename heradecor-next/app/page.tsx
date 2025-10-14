// app/page.tsx
import { fetchProducts } from "./lib/product-service";
import Link from 'next/link';

// Helper function to format price
function formatPrice(value: number) {
    if (typeof value !== 'number') return 'ناعدد';
    return `${value.toLocaleString('fa-IR')} تومان`;
}

export default async function HomePage() {
  const featuredProducts = await fetchProducts(4);

  return (
    <>
      <section className="py-5 text-center content-section-bg mt-4">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">زیبایی را به خانه خود بیاورید</h1>
            <p className="lead text-muted">جدیدترین محصولات دکوراتیو و اکسسوری‌های منزل را در هرا دکور پیدا کنید. کیفیتی که انتظار دارید و طراحی که عاشقش می‌شوید.</p>
            <p>
              <Link href="/products" className="btn btn-primary my-2">مشاهده همه محصولات</Link>
              <a href="#" className="btn btn-secondary my-2">تخفیف‌های ویژه</a>
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-5 content-section-bg my-4">
        <div className="container">
          <h2 className="text-center mb-4">محصولات منتخب</h2>
          <div id="featured-products-grid" className="row row-cols-2 row-cols-sm-2 row-cols-lg-4 g-4">
            {featuredProducts.map(product => (
              <div className="col" key={product.id}>
                <div className="card shadow-sm product-card h-100">
                   <img src={product.image} className="card-img-top" alt={product.name} />
                   <div className="card-body d-flex flex-column">
                       <h5 className="card-title">{product.name}</h5>
                       <p className="card-text">{product.description ? product.description.substring(0, 80) + '...' : ''}</p>
                       <div className="d-flex justify-content-between align-items-center mt-auto">
                           <div className="btn-group">
                               <Link href={`/products/${product.id}`} className="btn btn-sm btn-outline-secondary d-none d-sm-inline-block">مشاهده</Link>
                               {/* Add to cart functionality will be client-side */}
                               <button type="button" className="btn btn-sm btn-primary add-to-cart-btn" data-id={product.id}>افزودن به سبد</button>
                           </div>
                           <small className="text-muted">{formatPrice(product.priceValue)}</small>
                       </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}