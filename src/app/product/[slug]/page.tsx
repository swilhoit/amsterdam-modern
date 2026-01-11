import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/products/ProductDetail';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { getProduct, getRelatedProducts } from '@/lib/data';
import { CATEGORIES } from '@/types/product';

// Helper to get category slug from category name
function getCategorySlug(categoryName: string): string {
  if (/^\d+-/.test(categoryName)) {
    return categoryName;
  }
  const category = CATEGORIES.find(
    (c) => c.name.toUpperCase() === categoryName.toUpperCase() ||
           c.slug.toUpperCase().endsWith(`-${categoryName.toUpperCase()}`)
  );
  return category?.slug || categoryName;
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description || `${product.name} - ${product.priceFormatted}. ${product.designer}`,
    openGraph: {
      title: product.name,
      description: product.description || `${product.name} - ${product.priceFormatted}`,
      images: product.images[0] ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product, 4);

  return (
    <>
      <ProductDetail product={product} />

      {relatedProducts.length > 0 && (
        <FeaturedProducts
          products={relatedProducts}
          title="You May Also Like"
          subtitle="Similar pieces from our collection"
          viewAllLink={`/category/${getCategorySlug(product.category)}`}
          viewAllText="View All"
        />
      )}
    </>
  );
}
