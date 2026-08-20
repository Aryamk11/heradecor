// app/components/ProductCardSkeleton.tsx

/** Placeholder matching ProductCard's shape so the grid doesn't reflow on load. */
export function ProductCardSkeleton() {
  return (
    <div className="card shadow-sm product-card h-100" aria-hidden="true">
      <div className="product-card__media skeleton" />
      <div className="card-body d-flex flex-column">
        <span className="skeleton skeleton-line skeleton-line--title" />
        <span className="skeleton skeleton-line" />
        <span className="skeleton skeleton-line skeleton-line--short" />
        <div className="product-card__footer mt-auto">
          <span className="skeleton skeleton-line skeleton-line--price" />
          <span className="skeleton skeleton-button" />
        </div>
      </div>
    </div>
  );
}

export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4" aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <div className="col" key={i}>
          <ProductCardSkeleton />
        </div>
      ))}
      <span className="visually-hidden" role="status">در حال بارگذاری محصولات</span>
    </div>
  );
}
