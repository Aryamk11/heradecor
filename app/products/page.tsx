// app/products/page.tsx
import { fetchAllProducts } from "../lib/product-service";
import Link from 'next/link';

// Reusable helper function
function formatPrice(value: number) {
    if (typeof value !== 'number') return 'ناعدد';
    return `${value.toLocaleString('fa-IR')} تومان`;
}

// Note: We will create this client component next.
import AddToCartButton from '../components/AddToCartButton';

export default async function ProductsPage() {
  const allProducts = await fetchAllProducts();

  return (
    <div>
      <h1 className="text-center mb-4">همه محصولات</h1>
      <div id="all-products-grid" className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {allProducts.map(product => (
          <div className="col" key={product.id}>
            <div className="card shadow-sm product-card h-100">
              <Link href={`/products/${product.id}`} className="text-decoration-none text-dark">
                <img src={product.image} className="card-img-top" alt={product.name} />
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
  );
}