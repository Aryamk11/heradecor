// app/lib/definitions.ts

/** A product row from the `products` table. */
export type Product = {
  id: number;
  name: string;
  priceValue: number;
  image: string | null;
  description: string | null;
  dimensions: string | null;
  material: string | null;
  category: string | null;
  tags: string[] | null;
  thumbnail_url: string | null;
};

/** What we persist in localStorage. Ids are always strings here. */
export type CartEntry = {
  id: string;
  quantity: number;
};

/** A cart entry joined with its product details. */
export type CartLine = Product & { quantity: number };
