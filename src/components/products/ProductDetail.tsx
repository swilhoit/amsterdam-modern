'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, CATEGORIES } from '@/types/product';
import { cn } from '@/lib/utils';

// Helper to get category slug from category name
function getCategorySlug(categoryName: string): string {
  // If it already has an ID prefix, return as-is
  if (/^\d+-/.test(categoryName)) {
    return categoryName;
  }
  // Find matching category
  const category = CATEGORIES.find(
    (c) => c.name.toUpperCase() === categoryName.toUpperCase() ||
           c.slug.toUpperCase().endsWith(`-${categoryName.toUpperCase()}`)
  );
  return category?.slug || categoryName;
}

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const isSold = product.available === 0 || product.priceFormatted === 'sold';

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 gallery-reveal">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/category/${getCategorySlug(product.category)}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category}
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground truncate max-w-[200px]">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Image gallery */}
        <div className="gallery-reveal">
          {/* Main image */}
          <div className="relative aspect-square bg-secondary mb-4 overflow-hidden">
            {product.images[selectedImageIndex]?.url && (
              <Image
                src={product.images[selectedImageIndex].url}
                alt={product.images[selectedImageIndex].alt || product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            )}

            {/* Sold overlay */}
            {isSold && (
              <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
                <span className="text-sm uppercase tracking-[0.2em] text-white font-medium px-6 py-3 border border-white/50">
                  Sold
                </span>
              </div>
            )}

            {/* Navigation arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-foreground hover:text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-foreground hover:text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    'relative w-20 h-20 flex-shrink-0 bg-secondary overflow-hidden transition-all duration-300',
                    selectedImageIndex === index
                      ? 'ring-2 ring-foreground'
                      : 'opacity-60 hover:opacity-100'
                  )}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="gallery-reveal stagger-2">
          {/* Designer/Brand */}
          {product.designer && (
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              {product.designer}
            </p>
          )}

          {/* Product name */}
          <h1 className="text-lg md:text-xl lg:text-2xl font-medium mb-6 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-border">
            <span
              className={cn(
                'text-base font-medium',
                isSold ? 'text-muted-foreground line-through' : 'text-foreground'
              )}
            >
              {isSold ? 'Sold' : product.priceFormatted || `$${product.price.toLocaleString()}`}
            </span>
            {product.sku && (
              <span className="text-sm text-muted-foreground">
                Item: {product.sku}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-8">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Details table */}
          <div className="space-y-4 mb-8 pb-8 border-b border-border">
            {product.dimensions && (
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">Dimensions</span>
                <span className="text-sm">{product.dimensions}</span>
              </div>
            )}
            {!isSold && product.available > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">Availability</span>
                <span className="text-sm">
                  {product.available} {product.available === 1 ? 'piece' : 'pieces'} available
                </span>
              </div>
            )}
            {product.category && (
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">Category</span>
                <Link
                  href={`/category/${getCategorySlug(product.category)}`}
                  className="text-sm hover:text-foreground transition-colors"
                >
                  {product.category.replace(/^\d+-/, '').replace(/-/g, ' ')}
                </Link>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {!isSold ? (
              <a
                href={`mailto:info@amsterdammodern.com?subject=Inquiry about ${encodeURIComponent(product.name)} (${product.sku})`}
                className="btn-gallery-primary flex-1 text-center"
              >
                Inquire About This Piece
              </a>
            ) : (
              <button className="btn-gallery bg-secondary text-muted-foreground flex-1 cursor-not-allowed">
                Sold
              </button>
            )}
            <button
              className="btn-gallery-outline flex items-center justify-center gap-2"
              aria-label="Add to favorites"
            >
              <Heart className="w-4 h-4" />
              Save
            </button>
            <button
              className="btn-gallery-outline flex items-center justify-center gap-2"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          {/* Contact info */}
          <div className="bg-secondary p-6">
            <p className="text-sm text-muted-foreground mb-2">
              Questions about this piece?
            </p>
            <p className="text-sm mb-4">
              Contact us at{' '}
              <a
                href="mailto:info@amsterdammodern.com"
                className="text-foreground hover:underline"
              >
                info@amsterdammodern.com
              </a>
              {' '}or call{' '}
              <a href="tel:+12132217380" className="text-foreground hover:underline">
                213-221-7380
              </a>
            </p>
            <p className="text-xs text-muted-foreground">
              Open Monday–Friday 9am–5pm, Saturday 10am–6pm
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
