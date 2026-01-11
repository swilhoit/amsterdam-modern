'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/types/product';

// Category images - these would come from the scraped data
const CATEGORY_IMAGES: Record<string, string> = {
  '1-LIGHTING': 'https://amsterdammodern.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMDVZQXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--1d01e0c91e92a6b6c8e89a5c0b8b8c8b8c8b8c8b/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9MY21WemFYcGxTU0lNTkRBd2VETXdNQVk2QmtWVSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--8332615ee0fb01a9f3db0684d73deca02f71b941/lighting.jpg',
  '2-SEATING': 'https://amsterdammodern.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMDVZQXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--1d01e0c91e92a6b6c8e89a5c0b8b8c8b8c8b8c8b/seating.jpg',
  '3-TABLES': 'https://amsterdammodern.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMDVZQXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--1d01e0c91e92a6b6c8e89a5c0b8b8c8b8c8b8c8b/tables.jpg',
  '4-STORAGE': 'https://amsterdammodern.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMDVZQXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--1d01e0c91e92a6b6c8e89a5c0b8b8c8b8c8b8c8b/storage.jpg',
  '6-OTHER': 'https://amsterdammodern.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMDVZQXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--1d01e0c91e92a6b6c8e89a5c0b8b8c8b8c8b8c8b/other.jpg',
  '752-JUST-LANDED': 'https://amsterdammodern.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMDVZQXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--1d01e0c91e92a6b6c8e89a5c0b8b8c8b8c8b8c8b/new.jpg',
  '1112-BY-STYLE': 'https://amsterdammodern.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMDVZQXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--1d01e0c91e92a6b6c8e89a5c0b8b8c8b8c8b8c8b/style.jpg',
  '15-ARCHIVE': 'https://amsterdammodern.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMDVZQXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--1d01e0c91e92a6b6c8e89a5c0b8b8c8b8c8b8c8b/archive.jpg',
};

// Placeholder gradients for categories without images
const PLACEHOLDER_GRADIENTS = [
  'from-amber-100 to-orange-50',
  'from-stone-200 to-neutral-100',
  'from-zinc-200 to-slate-100',
  'from-warmGray-200 to-trueGray-100',
  'from-amber-50 to-yellow-50',
  'from-orange-100 to-amber-50',
  'from-stone-300 to-stone-100',
  'from-neutral-200 to-stone-100',
];

interface CategoryGridProps {
  className?: string;
}

export function CategoryGrid({ className = '' }: CategoryGridProps) {
  return (
    <section className={`py-8 ${className}`}>
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="text-center mb-12 gallery-reveal">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Curated Collections
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light">
            Browse by Category
          </h2>
        </div>

        {/* Category grid - 2x4 on desktop, 2x4 on tablet, 1x8 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {CATEGORIES.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className={`group relative aspect-[4/5] overflow-hidden bg-gradient-to-br ${PLACEHOLDER_GRADIENTS[index]} gallery-reveal stagger-${index + 1}`}
            >
              {/* Background image placeholder - will be replaced with actual images */}
              <div className="absolute inset-0 bg-secondary">
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-500" />
              </div>

              {/* Category content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                <div className="transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                  <h3 className="font-serif text-xl lg:text-2xl text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-w-[200px]">
                    {category.description}
                  </p>
                </div>

                {/* Explore arrow */}
                <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
              </div>

              {/* Hover border effect */}
              <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-colors duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
