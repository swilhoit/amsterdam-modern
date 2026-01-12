'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

interface FilterSidebarProps {
  totalProducts: number;
  priceRange: { min: number; max: number };
  availabilityCount: { inStock: number; sold: number };
}

const PRICE_RANGES = [
  { label: 'Under $500', min: 0, max: 500 },
  { label: '$500 - $1,000', min: 500, max: 1000 },
  { label: '$1,000 - $2,500', min: 1000, max: 2500 },
  { label: '$2,500 - $5,000', min: 2500, max: 5000 },
  { label: '$5,000 - $10,000', min: 5000, max: 10000 },
  { label: 'Over $10,000', min: 10000, max: 999999 },
];

export function FilterSidebar({ totalProducts, priceRange, availabilityCount }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  // Get current filter values
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentAvailability = searchParams.get('availability') || '';

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Reset to page 1 when filters change
      params.set('page', '1');

      return params.toString();
    },
    [searchParams]
  );

  const handlePriceRangeClick = (min: number, max: number) => {
    const isCurrentlySelected =
      currentMinPrice === String(min) && currentMaxPrice === String(max);

    if (isCurrentlySelected) {
      // Clear price filter
      router.push(`${pathname}?${createQueryString({ minPrice: null, maxPrice: null })}`);
    } else {
      router.push(`${pathname}?${createQueryString({ minPrice: String(min), maxPrice: String(max) })}`);
    }
  };

  const handleAvailabilityClick = (value: string) => {
    if (currentAvailability === value) {
      router.push(`${pathname}?${createQueryString({ availability: null })}`);
    } else {
      router.push(`${pathname}?${createQueryString({ availability: value })}`);
    }
  };

  const clearAllFilters = () => {
    router.push(`${pathname}?page=1`);
  };

  const hasActiveFilters = currentMinPrice || currentMaxPrice || currentAvailability;

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Price Range */}
      <div>
        <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Price Range</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map(({ label, min, max }) => {
            const isSelected = currentMinPrice === String(min) && currentMaxPrice === String(max);
            return (
              <button
                key={label}
                onClick={() => handlePriceRangeClick(min, max)}
                className={`block w-full text-left text-sm py-1.5 transition-colors ${
                  isSelected
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Availability</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleAvailabilityClick('in-stock')}
            className={`flex items-center justify-between w-full text-left text-sm py-1.5 transition-colors ${
              currentAvailability === 'in-stock'
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>In Stock</span>
            <span className="text-xs">({availabilityCount.inStock.toLocaleString()})</span>
          </button>
          <button
            onClick={() => handleAvailabilityClick('sold')}
            className={`flex items-center justify-between w-full text-left text-sm py-1.5 transition-colors ${
              currentAvailability === 'sold'
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Sold</span>
            <span className="text-xs">({availabilityCount.sold.toLocaleString()})</span>
          </button>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="text-sm text-foreground hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile filter button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 py-3 text-sm uppercase tracking-wider z-40 shadow-lg hover:bg-foreground/80 transition-colors"
      >
        Filters {hasActiveFilters && '•'}
      </button>

      {/* Mobile filter overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-background p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-medium text-xl">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 pr-12">
        <div className="sticky top-28">
          <h2 className="font-medium text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
            Filter
          </h2>
          <FilterContent />
        </div>
      </aside>
    </>
  );
}
