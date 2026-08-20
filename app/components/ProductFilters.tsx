// app/components/ProductFilters.tsx
"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { startNavigationProgress } from './NavigationProgress';

export default function ProductFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeCategory = searchParams.get('category') ?? '';
  const activeSearch = searchParams.get('q') ?? '';
  const [term, setTerm] = useState(activeSearch);

  // Keep the box in step when the URL changes from elsewhere (back button, chips).
  useEffect(() => setTerm(activeSearch), [activeSearch]);

  const apply = (next: { q?: string; category?: string }) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }

    const query = params.toString();
    startNavigationProgress();
    startTransition(() => router.push(query ? `/products?${query}` : '/products'));
  };

  const hasFilters = Boolean(activeCategory || activeSearch);

  return (
    <div className="product-filters mb-4">
      <form
        role="search"
        className="product-filters__search"
        onSubmit={(e) => {
          e.preventDefault();
          apply({ q: term.trim() });
        }}
      >
        <div className="input-group">
          <input
            type="search"
            className="form-control"
            placeholder="جستجو در محصولات..."
            aria-label="جستجو در محصولات"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <button className="btn btn-primary" type="submit" disabled={isPending}>
            <i className="bi bi-search" aria-hidden="true"></i>
            <span className="visually-hidden">جستجو</span>
          </button>
        </div>
      </form>

      <div className="product-filters__chips" role="group" aria-label="دسته‌بندی‌ها">
        <button
          type="button"
          className={`btn btn-sm ${activeCategory ? 'btn-outline-secondary' : 'btn-primary'}`}
          onClick={() => apply({ category: '' })}
        >
          همه
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`btn btn-sm ${activeCategory === category ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => apply({ category })}
          >
            {category}
          </button>
        ))}
        {hasFilters && (
          <button
            type="button"
            className="btn btn-sm btn-link text-decoration-none"
            onClick={() => apply({ q: '', category: '' })}
          >
            حذف فیلترها
          </button>
        )}
      </div>
    </div>
  );
}
