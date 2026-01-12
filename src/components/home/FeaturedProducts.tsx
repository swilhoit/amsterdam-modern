'use client';

import Link from 'next/link';
import { Product } from '@/types/product';
import { ProductGrid } from '../products/ProductGrid';
import { ArrowRight } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  variant?: 'default' | 'dark';
}

export function FeaturedProducts({
  products,
  title = 'Featured Pieces',
  subtitle = 'Hand-selected for their exceptional design and provenance',
  viewAllLink = '/category/752-JUST-LANDED',
  viewAllText = 'View All',
  variant = 'default',
}: FeaturedProductsProps) {
  const isDark = variant === 'dark';

  return (
    <section className={`py-20 lg:py-32 ${isDark ? 'bg-foreground text-background' : 'bg-background'}`}>
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div className="gallery-reveal">
            <span className={`text-[10px] uppercase tracking-[0.4em] font-medium block mb-4 ${isDark ? 'text-background/60' : 'text-muted-foreground'}`}>
              {subtitle}
            </span>
            <h2 className={`text-lg md:text-xl lg:text-2xl font-medium leading-tight uppercase tracking-wide ${isDark ? 'text-background' : 'text-foreground'}`}>
              {title}
            </h2>
          </div>

          <Link
            href={viewAllLink}
            className={`
              gallery-reveal stagger-1 group inline-flex items-center gap-3
              text-xs uppercase tracking-[0.2em] font-medium
              transition-colors duration-300
              ${isDark ? 'text-background/70 hover:text-background' : 'text-muted-foreground hover:text-foreground'}
            `}
          >
            <span>{viewAllText}</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Products grid */}
        <ProductGrid products={products.slice(0, 8)} columns={4} />
      </div>
    </section>
  );
}
