'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-secondary overflow-hidden">
      {/* Background pattern - subtle geometric */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="gallery-reveal">
          <p className="text-xs uppercase tracking-[0.4em] text-warm mb-6">
            Est. 2005 — Los Angeles
          </p>
        </div>

        <h1 className="gallery-reveal stagger-1 font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.1] mb-8">
          Curated Mid-Century
          <br />
          <span className="italic">Modern Furniture</span>
        </h1>

        <p className="gallery-reveal stagger-2 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Exceptional European design from the 1950s through 1980s.
          Each piece selected for its authenticity, condition, and timeless appeal.
        </p>

        <div className="gallery-reveal stagger-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/category/752-JUST-LANDED" className="btn-gallery-primary">
            View New Arrivals
          </Link>
          <Link href="/about" className="btn-gallery-outline">
            Our Story
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator">
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-12 w-px h-24 bg-gradient-to-b from-transparent via-warm/30 to-transparent hidden lg:block" />
      <div className="absolute top-1/3 right-12 w-px h-32 bg-gradient-to-b from-transparent via-warm/30 to-transparent hidden lg:block" />
    </section>
  );
}
