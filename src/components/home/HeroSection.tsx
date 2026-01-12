'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Product } from '@/types/product';

interface HeroSectionProps {
  featuredProducts?: Product[];
}

export function HeroSection({ featuredProducts = [] }: HeroSectionProps) {
  // Use first 3 products for the hero display
  const heroProducts = featuredProducts.slice(0, 3);
  const mainProduct = heroProducts[0];
  const secondaryProducts = heroProducts.slice(1, 3);

  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Main grid layout */}
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left side - Branding & Copy */}
        <div className="relative flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-20 lg:py-32 order-2 lg:order-1">
          {/* Decorative vertical line */}
          <div className="absolute left-8 lg:left-16 top-32 w-px h-16 bg-gradient-to-b from-foreground/30 to-transparent hidden lg:block" />

          <div className="relative max-w-xl">
            {/* Tagline */}
            <div className="gallery-reveal mb-8">
              <span className="inline-block text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
                Est. 2005 — Los Angeles
              </span>
            </div>

            {/* Main heading */}
            <h1 className="gallery-reveal stagger-1 text-2xl md:text-3xl lg:text-4xl font-medium leading-tight mb-6 tracking-tight uppercase">
              Curated Mid-Century Modern Design
            </h1>

            {/* Description */}
            <p className="gallery-reveal stagger-2 text-base lg:text-lg text-muted-foreground max-w-md mb-12 leading-relaxed">
              Exceptional European furniture from the 1950s through 1980s.
              Each piece selected for authenticity, condition, and timeless appeal.
            </p>

            {/* CTAs */}
            <div className="gallery-reveal stagger-3 flex flex-wrap items-center gap-4">
              <Link
                href="/category/752-JUST-LANDED"
                className="group inline-flex items-center gap-3 btn-gallery-primary"
              >
                <span>New Arrivals</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="btn-gallery-outline"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="gallery-reveal stagger-4 absolute bottom-12 left-8 lg:left-16 xl:left-24 flex gap-12">
            <div>
              <span className="block text-xl lg:text-2xl font-medium text-foreground">500+</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Pieces</span>
            </div>
            <div>
              <span className="block text-xl lg:text-2xl font-medium text-foreground">19</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Years</span>
            </div>
          </div>
        </div>

        {/* Right side - Featured Product Image Grid */}
        <div className="relative bg-secondary order-1 lg:order-2">
          {mainProduct ? (
            <div className="grid grid-rows-[2fr_1fr] h-full">
              {/* Main featured product - large */}
              <Link
                href={`/product/${mainProduct.id}-${mainProduct.slug}`}
                className="relative group overflow-hidden"
              >
                <Image
                  src={mainProduct.images[0]?.url || ''}
                  alt={mainProduct.images[0]?.alt || mainProduct.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent opacity-60" />

                {/* Product info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/70 block mb-2">
                    Featured
                  </span>
                  <h3 className="text-sm lg:text-base font-medium mb-2 line-clamp-1">
                    {mainProduct.name}
                  </h3>
                  <span className="text-sm text-white/80">
                    {mainProduct.priceFormatted || `$${mainProduct.price.toLocaleString()}`}
                  </span>
                </div>
              </Link>

              {/* Secondary products - smaller grid */}
              <div className="grid grid-cols-2">
                {secondaryProducts.map((product, idx) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}-${product.slug}`}
                    className="relative group overflow-hidden"
                  >
                    <Image
                      src={product.images[0]?.url || ''}
                      alt={product.images[0]?.alt || product.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/40 transition-colors duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h4 className="text-xs font-medium line-clamp-1">{product.name}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            // Fallback if no products
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <p className="text-xs uppercase tracking-widest">Loading collection...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator z-10 hidden lg:block">
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      </div>
    </section>
  );
}
