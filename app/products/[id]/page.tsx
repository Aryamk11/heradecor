// app/products/[id]/page.tsx
import { Suspense } from 'react';
import Image from 'next/image';
import ProgressLink from '../../components/ProgressLink';
import { notFound } from 'next/navigation';
import { fetchProductById, fetchRelatedProducts } from '@/app/lib/product-service';
import AddToCartButton from '@/app/components/AddToCartButton';
import ProductCard from '@/app/components/ProductCard';
import ProductGridSkeleton from '@/app/components/ProductCardSkeleton';
import { formatPrice } from '@/app/lib/format';

// In Next 15 `params` is a promise and must be awaited before use.
type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return { title: 'محصول یافت نشد' };
  }
  return {
    title: `${product.name} - فروشگاه هرا دکور`,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: product.image ? [product.image] : undefined,
      type: 'website',
    },
  };
}

async function RelatedProducts({ id, category }: { id: number; category: string | null }) {
  const related = await fetchRelatedProducts(id, category);
  if (related.length === 0) return null;

  return (
    <section className="mt-5 pt-4 border-top">
      <h2 className="h4 mb-4">محصولات مشابه</h2>
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
        {related.map((product) => (
          <div className="col" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  // Resolved before any Suspense boundary below, so notFound() still sets a 404.
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <nav aria-label="مسیر صفحه" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><ProgressLink href="/">خانه</ProgressLink></li>
          <li className="breadcrumb-item"><ProgressLink href="/products">محصولات</ProgressLink></li>
          {product.category && (
            <li className="breadcrumb-item">
              <ProgressLink href={`/products?category=${encodeURIComponent(product.category)}`}>
                {product.category}
              </ProgressLink>
            </li>
          )}
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="row g-4">
        <div className="col-md-6">
          {product.image ? (
            <Image
              src={product.image}
              className="img-fluid rounded"
              alt={product.name}
              width={600}
              height={600}
              sizes="(min-width: 768px) 50vw, 100vw"
              style={{ height: 'auto' }} // lets img-fluid control the layout
              priority
            />
          ) : (
            <div className="product-card__placeholder rounded" style={{ aspectRatio: '1' }} role="img" aria-label={product.name}>
              <i className="bi bi-image" aria-hidden="true"></i>
            </div>
          )}
        </div>
        <div className="col-md-6">
          <h1 className="display-5">{product.name}</h1>
          {product.description && <p className="lead">{product.description}</p>}

          {(product.dimensions || product.material) && (
            <ul className="list-unstyled text-muted small mb-0">
              {product.dimensions && <li><strong>ابعاد:</strong> {product.dimensions}</li>}
              {product.material && <li><strong>جنس:</strong> {product.material}</li>}
            </ul>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mt-3">
              {product.tags.map((tag) => (
                <span className="badge product-tag" key={tag}>{tag}</span>
              ))}
            </div>
          )}

          <hr />
          <h2 className="h3">{formatPrice(product.priceValue)}</h2>
          <div className="d-grid gap-2 d-md-block mt-4">
            <AddToCartButton productId={product.id} className="btn-lg">
              <>
                <i className="bi bi-cart-plus ms-2" aria-hidden="true"></i>افزودن به سبد خرید
              </>
            </AddToCartButton>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="mt-5 pt-4 border-top"><ProductGridSkeleton count={4} /></div>}>
        <RelatedProducts id={product.id} category={product.category} />
      </Suspense>
    </div>
  );
}
