'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
  className?: string;
}

export function ProductCard({ product, index = 0, className }: ProductCardProps) {
  const isSold = product.available === 0 || product.priceFormatted === 'sold';

  return (
    <article
      className={cn(
        'group product-card gallery-reveal',
        `stagger-${(index % 8) + 1}`,
        className
      )}
    >
      <Link
        href={`/product/${product.id}-${product.slug}`}
        className="block"
      >
        {/* Image container */}
        <div className="relative aspect-square bg-secondary overflow-hidden mb-4">
          {/* Product image */}
          {product.images[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <span className="text-xs uppercase tracking-wider">No image</span>
            </div>
          )}

          {/* Sold overlay */}
          {isSold && (
            <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
              <span className="text-xs uppercase tracking-[0.2em] text-white font-medium px-4 py-2 border border-white/50">
                Sold
              </span>
            </div>
          )}

          {/* Quick actions */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              className="w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300"
              aria-label="Add to favorites"
              onClick={(e) => {
                e.preventDefault();
                // Add to favorites logic
              }}
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>

          {/* Just landed badge */}
          {product.category === 'JUST LANDED' && (
            <div className="absolute top-4 left-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white font-medium px-3 py-1.5 bg-black">
                New
              </span>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-2">
          {/* Designer/Brand */}
          {product.designer && (
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground truncate">
              {product.designer.split('/')[0].trim()}
            </p>
          )}

          {/* Product name */}
          <h3 className="font-serif text-base lg:text-lg leading-tight line-clamp-2 group-hover:opacity-60 transition-opacity duration-300">
            {product.name}
          </h3>

          {/* Price and SKU */}
          <div className="flex items-baseline justify-between gap-4">
            <span className={cn(
              'price-tag text-sm',
              isSold ? 'text-muted-foreground line-through' : 'text-foreground'
            )}>
              {isSold ? 'Sold' : product.priceFormatted || `$${product.price.toLocaleString()}`}
            </span>
            {product.sku && (
              <span className="text-xs text-muted-foreground">
                {product.sku}
              </span>
            )}
          </div>

          {/* Availability */}
          {!isSold && product.available > 1 && (
            <p className="text-xs text-muted-foreground">
              {product.available} available
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
