import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'Amsterdam Modern curates exceptional mid-century modern furniture from Europe. Learn about our story, philosophy, and commitment to timeless design.',
};

export default function AboutPage() {
  return (
    <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8 pt-20">
      {/* Hero section */}
      <header className="max-w-4xl mx-auto text-center mb-16 lg:mb-24">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6 gallery-reveal">
          Est. 2005 — Los Angeles
        </p>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-medium uppercase tracking-wide mb-8 gallery-reveal stagger-1">
          About Amsterdam Modern
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed gallery-reveal stagger-2">
          For nearly two decades, we&apos;ve been bringing the best of European mid-century
          modern design to collectors and design enthusiasts across North America.
        </p>
      </header>

      {/* Story section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24">
        <div className="gallery-reveal stagger-3">
          <div className="aspect-[4/5] bg-secondary" />
        </div>
        <div className="flex flex-col justify-center gallery-reveal stagger-4">
          <h2 className="text-lg md:text-xl font-medium uppercase tracking-wide mb-6">
            Our Story
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Amsterdam Modern was founded in 2005 with a simple mission: to bring exceptional
              European mid-century design to the American market. What started as a passion
              for Dutch and Scandinavian furniture has grown into one of the most respected
              vintage furniture dealers on the West Coast.
            </p>
            <p>
              Based in Los Angeles, we regularly travel to the Netherlands, Belgium, Germany,
              and Scandinavia to source pieces directly from estates, dealers, and private
              collections. Each item is carefully selected for its design merit, condition,
              and authenticity.
            </p>
            <p>
              Our showroom serves as both a gallery and a resource for designers, collectors,
              and anyone who appreciates the enduring appeal of mid-century modern design.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy section */}
      <section className="bg-foreground text-background py-16 lg:py-24 -mx-6 lg:-mx-12 px-6 lg:px-12 mb-24">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6 gallery-reveal">
            Our Philosophy
          </p>
          <blockquote className="text-base md:text-lg lg:text-xl font-normal leading-relaxed mb-8 gallery-reveal stagger-1">
            &ldquo;Good design is timeless. The pieces we curate were made to last—not just
            physically, but aesthetically. They were relevant fifty years ago, they&apos;re
            relevant today, and they&apos;ll be relevant for generations to come.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Values section */}
      <section className="mb-24">
        <h2 className="text-lg md:text-xl font-medium uppercase tracking-wide mb-12 text-center gallery-reveal">
          What Sets Us Apart
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <div className="text-center gallery-reveal stagger-1">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium uppercase tracking-wide mb-4">Authenticity</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Every piece is carefully vetted for authenticity. We provide detailed
              provenance information and stand behind everything we sell.
            </p>
          </div>
          <div className="text-center gallery-reveal stagger-2">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium uppercase tracking-wide mb-4">Curation</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We don&apos;t just sell furniture—we curate collections. Each piece is
              selected for its design significance and condition.
            </p>
          </div>
          <div className="text-center gallery-reveal stagger-3">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium uppercase tracking-wide mb-4">Service</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              From selection to delivery, we provide personalized service. Our team
              is here to help you find the perfect piece.
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="text-center py-16 border-t border-border">
        <h2 className="text-lg md:text-xl font-medium uppercase tracking-wide mb-6 gallery-reveal">
          Visit Our Showroom
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto gallery-reveal stagger-1">
          Experience our collection in person. Our Los Angeles showroom is open
          Monday through Friday 9am–5pm and Saturday 10am–6pm.
        </p>
        <Link href="/contact" className="btn-gallery-primary gallery-reveal stagger-2">
          Get Directions
        </Link>
      </section>
    </div>
  );
}
