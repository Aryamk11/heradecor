// app/page.tsx
import { fetchProducts } from "./lib/product-service";
import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from './components/AddToCartButton';

function formatPrice(value: number) {
    if (typeof value !== 'number') return 'ناعدد';
    return `${value.toLocaleString('fa-IR')} تومان`;
}

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
              <Link href="/products" className="btn btn-primary my-2">مشاهده همه محصولات</Link>
              <a href="#" className="btn btn-secondary my-2">تخفیف‌های ویژه</a>
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">محصولات منتخب</h2>
          <div id="featured-products-grid" className="row row-cols-2 row-cols-sm-2 row-cols-lg-4 g-4">
            {featuredProducts.map((product, index) => (
              <div className="col" key={product.id}>
                <div className="card shadow-sm product-card h-100">
                   <Link href={`/products/${product.id}`} className="text-decoration-none text-dark">
                      <Image 
                        src={product.image} 
                        className="card-img-top" 
                        alt={product.name}
                        width={300}
                        height={300}
                        style={{ height: 'auto', objectFit: 'cover' }} // Fixes aspect ratio warning
                        priority={index === 0} // Fixes LCP warning
                      />
                   </Link>
                   <div className="card-body d-flex flex-column">
                       <h5 className="card-title">
                          <Link href={`/products/${product.id}`} className="text-decoration-none text-dark">{product.name}</Link>
                       </h5>
                       <p className="card-text">{product.description ? product.description.substring(0, 80) + '...' : ''}</p>
                       <div className="d-flex justify-content-between align-items-center mt-auto">
                           <div className="btn-group">
                               <Link href={`/products/${product.id}`} className="btn btn-sm btn-outline-secondary d-none d-sm-inline-block">مشاهده</Link>
                               <AddToCartButton productId={product.id} />
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