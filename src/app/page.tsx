import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { getFeaturedProducts } from '@/lib/data';

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(8);
  return (
    <>
      <HeroSection />
      <CategoryGrid className="py-16 lg:py-24" />
      <FeaturedProducts
        products={featuredProducts}
        title="New Arrivals"
        subtitle="Recently Added to Our Collection"
        viewAllLink="/category/752-JUST-LANDED"
        viewAllText="View All New Arrivals"
      />

      {/* Gallery statement section */}
      <section className="py-16 lg:py-24 bg-foreground text-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <div className="gallery-reveal">
            <p className="text-xs uppercase tracking-[0.4em] text-warm mb-6">
              Our Philosophy
            </p>
          </div>
          <blockquote className="gallery-reveal stagger-1 font-serif text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed mb-8 italic">
            &ldquo;We believe in the enduring value of exceptional design. Each piece in our collection
            represents the best of mid-century modernism—functional, beautiful, and built to last.&rdquo;
          </blockquote>
          <div className="gallery-reveal stagger-2">
            <p className="text-sm text-background/70">
              — Amsterdam Modern, Est. 2005
            </p>
          </div>
        </div>
      </section>

      <FeaturedProducts
        products={featuredProducts.slice(0, 4)}
        title="Staff Picks"
        subtitle="Our Favorites This Month"
        viewAllLink="/favorites"
        viewAllText="See All Favorites"
      />
    </>
  );
}
