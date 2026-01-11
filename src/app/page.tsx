import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { getFeaturedProducts, getProductsByCategory } from '@/lib/data';
import { Product } from '@/types/product';
import Link from 'next/link';

// Fetch one product from each category for the category grid images
async function getCategoryImages(): Promise<Record<string, Product[]>> {
  const categories = [
    '1-LIGHTING',
    '2-SEATING',
    '3-TABLES',
    '4-STORAGE',
    '6-OTHER',
    '752-JUST-LANDED',
    '1112-BY-STYLE',
    '15-ARCHIVE',
  ];

  const results: Record<string, Product[]> = {};

  await Promise.all(
    categories.map(async (slug) => {
      try {
        const { products } = await getProductsByCategory(slug, { perPage: 1 });
        results[slug] = products;
      } catch {
        results[slug] = [];
      }
    })
  );

  return results;
}

export default async function HomePage() {
  // Fetch featured products and category images in parallel
  const [featuredProducts, categoryProducts] = await Promise.all([
    getFeaturedProducts(12),
    getCategoryImages(),
  ]);

  return (
    <>
      {/* Hero section with featured product images */}
      <HeroSection featuredProducts={featuredProducts} />

      {/* Category grid with real product images */}
      <CategoryGrid categoryProducts={categoryProducts} />

      {/* New arrivals section */}
      <FeaturedProducts
        products={featuredProducts}
        title="New Arrivals"
        subtitle="Recently Added to Our Collection"
        viewAllLink="/category/752-JUST-LANDED"
        viewAllText="View All New Arrivals"
      />

      {/* Philosophy statement section */}
      <section className="py-24 lg:py-32 bg-foreground text-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <div className="gallery-reveal">
            <span className="text-[10px] uppercase tracking-[0.4em] text-background/60 font-medium block mb-8">
              Our Philosophy
            </span>
          </div>
          <blockquote className="gallery-reveal stagger-1 font-serif text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed mb-10 italic">
            &ldquo;We believe in the enduring value of exceptional design. Each piece in our collection
            represents the best of mid-century modernism&mdash;functional, beautiful, and built to last.&rdquo;
          </blockquote>
          <div className="gallery-reveal stagger-2">
            <p className="text-sm text-background/60 tracking-wide">
              Amsterdam Modern, Est. 2005
            </p>
          </div>
        </div>
      </section>

      {/* Staff picks section */}
      <FeaturedProducts
        products={featuredProducts.slice(4, 12)}
        title="Staff Picks"
        subtitle="Our Favorites This Season"
        viewAllLink="/favorites"
        viewAllText="See All Favorites"
      />

      {/* Newsletter / Contact section */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <div className="gallery-reveal">
            <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium block mb-6">
              Stay Connected
            </span>
          </div>
          <h2 className="gallery-reveal stagger-1 font-serif text-3xl md:text-4xl lg:text-5xl font-light mb-6">
            Visit Our Showroom
          </h2>
          <p className="gallery-reveal stagger-2 text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Experience our collection in person at our Los Angeles showroom.
            Schedule an appointment to view pieces and speak with our team.
          </p>
          <div className="gallery-reveal stagger-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-gallery-primary">
              Schedule a Visit
            </Link>
            <Link href="/about" className="btn-gallery-outline">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
