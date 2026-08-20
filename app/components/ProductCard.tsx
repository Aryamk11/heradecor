// app/components/ProductCard.tsx
import Image from 'next/image';
import ProgressLink from './ProgressLink';
import AddToCartButton from './AddToCartButton';
import { formatPrice } from '../lib/format';
import type { Product } from '../lib/definitions';

const GRID_SIZES = '(min-width: 992px) 25vw, (min-width: 576px) 33vw, 50vw';

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <article className="card shadow-sm product-card h-100">
      <div className="product-card__media">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes={GRID_SIZES}
            priority={priority}
          />
        ) : (
          // Some rows have no image yet; an empty src makes the browser refetch the page.
          <div className="product-card__placeholder" role="img" aria-label={product.name}>
            <i className="bi bi-image" aria-hidden="true"></i>
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <h3 className="card-title h6 product-card__title">
          <ProgressLink href={`/products/${product.id}`} className="stretched-link text-decoration-none text-dark">
            {product.name}
          </ProgressLink>
        </h3>

        {product.description && (
          <p className="card-text product-card__desc text-muted small">{product.description}</p>
        )}

        <div className="product-card__footer mt-auto">
          <div className="product-card__price">{formatPrice(product.priceValue)}</div>
          <AddToCartButton productId={product.id} className="btn-sm w-100" />
        </div>
      </div>
    </article>
  );
}
