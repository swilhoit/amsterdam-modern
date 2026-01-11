'use client';

import Link from 'next/link';
import { Product } from '@/types/product';
import { ProductGrid } from '../products/ProductGrid';

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
}

export function FeaturedProducts({
  products,
  title = 'Featured Pieces',
  subtitle = 'Hand-selected for their exceptional design and provenance',
  viewAllLink = '/category/752-JUST-LANDED',
  viewAllText = 'View All',
}: FeaturedProductsProps) {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="gallery-reveal">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
              {subtitle}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light">
              {title}
            </h2>
          </div>
          <Link
            href={viewAllLink}
            className="gallery-reveal stagger-1 group flex items-center gap-2 text-sm uppercase tracking-[0.15em] font-medium hover:text-warm transition-colors"
          >
            {viewAllText}
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {/* Products grid */}
        <ProductGrid products={products.slice(0, 8)} columns={4} />
      </div>
    </section>
  );
}
