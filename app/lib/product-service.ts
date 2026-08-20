// app/lib/product-service.ts
import { unstable_cache } from 'next/cache';
import { supabase } from './supabaseClient';
import type { Product } from './definitions';

// The Supabase project answers in ~1.2s from here, and none of this data changes
// per-request, so every read goes through the data cache. `products` is the tag
// to revalidate after an admin edit.
const CACHE_TAG = 'products';
const REVALIDATE_SECONDS = 300;

export type ProductQuery = {
  search?: string;
  category?: string;
};

/** Escapes PostgREST `or=` filter syntax, where , ( ) and . are delimiters. */
function escapeFilterValue(value: string): string {
  return value.replace(/[,()."\\]/g, ' ').trim();
}

async function queryProducts({ search, category }: ProductQuery): Promise<Product[]> {
  let request = supabase.from('products').select('*').order('id', { ascending: true });

  if (category) {
    request = request.eq('category', category);
  }

  const term = search ? escapeFilterValue(search) : '';
  if (term) {
    request = request.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const { data, error } = await request;
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data ?? [];
}

/** Fetches a limited number of products, for the homepage grid. */
export const fetchProducts = unstable_cache(
  async (limit = 4): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    return data ?? [];
  },
  ['featured-products'],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] }
);

/** Fetches products, optionally narrowed by search term and/or category. */
export const fetchAllProducts = unstable_cache(
  async (query: ProductQuery = {}): Promise<Product[]> => queryProducts(query),
  ['all-products'],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] }
);

/** Distinct categories actually present in the table, for the nav and filters. */
export const fetchCategories = unstable_cache(
  async (): Promise<string[]> => {
    const { data, error } = await supabase.from('products').select('category');
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    const unique = new Set(
      (data ?? [])
        .map((row) => (row as { category: string | null }).category)
        .filter((c): c is string => Boolean(c && c.trim()))
    );
    return [...unique].sort((a, b) => a.localeCompare(b, 'fa'));
  },
  ['product-categories'],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] }
);

/** Fetches a single product by id, or null if it does not exist. */
export const fetchProductById = unstable_cache(
  async (id: string | number): Promise<Product | null> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      return null;
    }
    return data;
  },
  ['product-by-id'],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] }
);

/** A few other products from the same category, for the detail page. */
export const fetchRelatedProducts = unstable_cache(
  async (id: number, category: string | null, limit = 4): Promise<Product[]> => {
    if (!category) return [];
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .neq('id', id)
      .limit(limit);

    if (error) {
      console.error('Error fetching related products:', error);
      return [];
    }
    return data ?? [];
  },
  ['related-products'],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] }
);
