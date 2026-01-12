'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Product } from '@/types/product';

interface HeroSectionProps {
  featuredProducts?: Product[];
}

export function HeroSection({ featuredProducts = [] }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get products with valid images for the slider
  const sliderProducts = featuredProducts.filter(p => p.images[0]?.url).slice(0, 5);
  const currentProduct = sliderProducts[currentIndex];

  // Auto-advance slider
  useEffect(() => {
    if (sliderProducts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderProducts.length]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Sliding background images */}
      {sliderProducts.map((product, index) => (
        <div
          key={product.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* Fallback if no images */}
      {sliderProducts.length === 0 && (
        <div className="absolute inset-0 bg-secondary" />
      )}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content overlay - minimal and elegant */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-24 lg:pb-32 px-8 lg:px-16 xl:px-24">
        <div className="max-w-xl">
          {/* Tagline */}
          <div className="gallery-reveal mb-4">
            <span className="inline-block text-[9px] uppercase tracking-[0.5em] text-white/60 font-normal">
              Est. 2005 — Los Angeles
            </span>
          </div>

          {/* Main heading - smaller and elegant */}
          <h1 className="gallery-reveal stagger-1 text-sm md:text-base lg:text-lg font-normal leading-relaxed mb-6 tracking-wide uppercase text-white">
            Curated Mid-Century Modern Design
          </h1>

          {/* CTAs - minimal */}
          <div className="gallery-reveal stagger-2 flex items-center gap-6">
            <Link
              href="/category/752-JUST-LANDED"
              className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white hover:text-white/70 transition-colors"
            >
              <span>View Collection</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Featured item indicator */}
        {currentProduct && (
          <div className="absolute bottom-12 right-8 lg:right-16 xl:right-24 text-right">
            <span className="block text-[9px] uppercase tracking-[0.3em] text-white/50 mb-2">
              Featured
            </span>
            <Link
              href={`/product/${currentProduct.id}-${currentProduct.slug}`}
              className="group block"
            >
              <span className="text-[11px] uppercase tracking-[0.15em] text-white/80 group-hover:text-white transition-colors">
                {currentProduct.name}
              </span>
            </Link>
            {currentProduct.designer && (
              <span className="block text-[9px] uppercase tracking-[0.2em] text-white/50 mt-1">
                {currentProduct.designer}
              </span>
            )}

            {/* Slide indicators */}
            {sliderProducts.length > 1 && (
              <div className="flex items-center justify-end gap-2 mt-4">
                {sliderProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-8 h-[1px] transition-all duration-300 ${
                      index === currentIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator z-10">
        <ChevronDown className="w-4 h-4 text-white/40" />
      </div>
    </section>
  );
}
