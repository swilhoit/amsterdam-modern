'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Product } from '@/types/product';

interface HeroSectionProps {
  featuredProducts?: Product[];
}

export function HeroSection({ featuredProducts = [] }: HeroSectionProps) {
  const mainProduct = featuredProducts[0];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Full-width background image */}
      {mainProduct?.images[0]?.url ? (
        <Image
          src={mainProduct.images[0].url}
          alt={mainProduct.images[0].alt || mainProduct.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-secondary" />
      )}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-16 xl:px-24">
        <div className="max-w-2xl">
          {/* Tagline */}
          <div className="gallery-reveal mb-8">
            <span className="inline-block text-[10px] uppercase tracking-[0.4em] text-white/70 font-medium">
              Est. 2005 — Los Angeles
            </span>
          </div>

          {/* Main heading */}
          <h1 className="gallery-reveal stagger-1 text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium leading-tight mb-6 tracking-tight uppercase text-white">
            Curated Mid-Century Modern Design
          </h1>

          {/* Description */}
          <p className="gallery-reveal stagger-2 text-base lg:text-lg text-white/80 max-w-lg mb-12 leading-relaxed">
            Exceptional European furniture from the 1950s through 1980s.
            Each piece selected for authenticity, condition, and timeless appeal.
          </p>

          {/* CTAs */}
          <div className="gallery-reveal stagger-3 flex flex-wrap items-center gap-4">
            <Link
              href="/category/752-JUST-LANDED"
              className="group inline-flex items-center gap-3 bg-white text-black px-6 py-3 text-sm uppercase tracking-wider font-medium hover:bg-white/90 transition-colors"
            >
              <span>New Arrivals</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 text-sm uppercase tracking-wider font-medium text-white border border-white/50 hover:bg-white/10 transition-colors"
            >
              Our Story
            </Link>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="gallery-reveal stagger-4 absolute bottom-12 left-8 lg:left-16 xl:left-24 flex gap-12">
          <div>
            <span className="block text-xl lg:text-2xl font-medium text-white">500+</span>
            <span className="text-xs uppercase tracking-widest text-white/60">Pieces</span>
          </div>
          <div>
            <span className="block text-xl lg:text-2xl font-medium text-white">19</span>
            <span className="text-xs uppercase tracking-widest text-white/60">Years</span>
          </div>
        </div>

        {/* Featured product link */}
        {mainProduct && (
          <Link
            href={`/product/${mainProduct.id}-${mainProduct.slug}`}
            className="absolute bottom-12 right-8 lg:right-16 xl:right-24 text-white group"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 block mb-1">
              Featured
            </span>
            <span className="text-sm font-medium group-hover:underline">
              {mainProduct.name}
            </span>
          </Link>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator z-10">
        <ChevronDown className="w-5 h-5 text-white/60" />
      </div>
    </section>
  );
}
