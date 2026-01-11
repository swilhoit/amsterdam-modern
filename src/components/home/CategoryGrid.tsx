'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { ArrowUpRight } from 'lucide-react';

// Category metadata for display
const CATEGORY_META: Record<string, { title: string; subtitle: string }> = {
  '1-LIGHTING': { title: 'Lighting', subtitle: 'Pendants, Floor Lamps & Sconces' },
  '2-SEATING': { title: 'Seating', subtitle: 'Chairs, Sofas & Loungers' },
  '3-TABLES': { title: 'Tables', subtitle: 'Dining, Coffee & Side Tables' },
  '4-STORAGE': { title: 'Storage', subtitle: 'Cabinets, Shelving & Credenzas' },
  '6-OTHER': { title: 'Objects', subtitle: 'Mirrors, Art & Accessories' },
  '752-JUST-LANDED': { title: 'Just Landed', subtitle: 'Our Newest Arrivals' },
  '1112-BY-STYLE': { title: 'By Style', subtitle: 'Shop by Design Movement' },
  '15-ARCHIVE': { title: 'Archive', subtitle: 'Previously Sold Pieces' },
};

interface CategoryGridProps {
  className?: string;
  categoryProducts?: Record<string, Product[]>;
}

export function CategoryGrid({ className = '', categoryProducts = {} }: CategoryGridProps) {
  const categories = Object.keys(CATEGORY_META);

  return (
    <section className={`py-20 lg:py-32 ${className}`}>
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="gallery-reveal">
            <span className="text-[10px] uppercase tracking-[0.4em] text-warm font-medium block mb-4">
              The Collection
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light leading-tight">
              Browse by Category
            </h2>
          </div>
          <p className="gallery-reveal stagger-1 text-muted-foreground max-w-md text-sm lg:text-base leading-relaxed">
            Each category represents a carefully curated selection of authentic mid-century pieces,
            sourced from across Europe.
          </p>
        </div>

        {/* Category grid - Asymmetric bento layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {categories.map((slug, index) => {
            const meta = CATEGORY_META[slug];
            const products = categoryProducts[slug] || [];
            const featuredImage = products[0]?.images[0]?.url;

            // Determine size based on position for visual interest
            const isLarge = index === 0 || index === 3;
            const isTall = index === 1 || index === 6;

            return (
              <Link
                key={slug}
                href={`/category/${slug}`}
                className={`
                  group relative overflow-hidden bg-secondary
                  gallery-reveal stagger-${(index % 4) + 1}
                  ${isLarge ? 'lg:col-span-2 aspect-[16/10] md:aspect-[16/9]' : ''}
                  ${isTall ? 'aspect-[4/5] lg:aspect-[3/4]' : ''}
                  ${!isLarge && !isTall ? 'aspect-square' : ''}
                `}
              >
                {/* Background image */}
                {featuredImage ? (
                  <Image
                    src={featuredImage}
                    alt={meta.title}
                    fill
                    sizes={isLarge ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 768px) 100vw, 25vw'}
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted" />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                  <div className="transform transition-transform duration-500 group-hover:translate-y-[-4px]">
                    <h3 className="font-serif text-2xl lg:text-3xl text-white mb-2">
                      {meta.title}
                    </h3>
                    <p className="text-sm text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {meta.subtitle}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="absolute top-6 right-6 lg:top-8 lg:right-8 w-10 h-10 rounded-full border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Hover border effect */}
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-500" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
