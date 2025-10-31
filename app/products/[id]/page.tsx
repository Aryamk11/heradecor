// app/products/[id]/page.tsx
import { fetchProductById } from "@/app/lib/product-service";
import Image from 'next/image';
import ProductDetailAddToCart from "@/app/components/ProductDetailAddToCart";
import { notFound } from 'next/navigation';

// Define the product type
type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  priceValue: number;
};

function formatPrice(value: number) {
  if (typeof value !== 'number') return 'ناعدد';
  return `${value.toLocaleString('fa-IR')} تومان`;
}

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props) {
  const product = (await fetchProductById(params.id)) as Product | null;

  if (!product) {
    return { title: 'محصول یافت نشد' };
  }
  return {
    title: `${product.name} - فروشگاه هرا دکور`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = (await fetchProductById(params.id)) as Product | null;

  if (!product) {
    notFound();
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <Image 
          src={product.image} 
          className="img-fluid rounded"
          alt={product.name}
          width={600}
          height={600}
          style={{ height: 'auto' }} // This allows img-fluid to control the layout
          priority 
        />
      </div>
      <div className="col-md-6">
        <h1 className="display-5">{product.name}</h1>
        <p className="lead">{product.description}</p>
        <hr />
        <h3>{formatPrice(product.priceValue)}</h3>
        <div className="d-grid gap-2 d-md-block mt-4">
          <ProductDetailAddToCart productId={product.id} />
        </div>
      </div>
    </div>
  );
}