import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductGrid } from '@/components/products/ProductGrid';
import { FilterSidebar } from '@/components/products/FilterSidebar';
import { SortSelect } from '@/components/products/SortSelect';
import { getProductsByCategory } from '@/lib/data';
import { CATEGORIES } from '@/types/product';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    availability?: string;
  }>;
}

// Generate static params for all categories
export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
}

// Generate metadata for each category
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: category.name,
    description: category.description || `Browse our ${category.name.toLowerCase()} collection of mid-century modern furniture.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page = '1', sort = 'newest', minPrice, maxPrice, availability } = await searchParams;

  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const currentPage = parseInt(page, 10);
  const sortOption = sort as 'newest' | 'oldest' | 'price-low' | 'price-high' | 'name-az' | 'name-za';
  const availabilityOption = availability as 'in-stock' | 'sold' | undefined;

  const { products: paginatedProducts, total, totalPages, stats } = await getProductsByCategory(slug, {
    page: currentPage,
    perPage: 24,
    sort: sortOption,
    minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
    availability: availabilityOption,
  });

  // Build query string for pagination links
  const buildQueryString = (pageNum: number) => {
    const params = new URLSearchParams();
    params.set('page', String(pageNum));
    if (sort !== 'newest') params.set('sort', sort);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (availability) params.set('availability', availability);
    return params.toString();
  };

  return (
    <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 gallery-reveal">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-warm transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground">{category.name}</li>
        </ol>
      </nav>

      {/* Category header */}
      <header className="mb-12 gallery-reveal stagger-1">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-4">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-lg text-muted-foreground max-w-2xl">
            {category.description}
          </p>
        )}
      </header>

      <div className="flex gap-8">
        {/* Filter sidebar */}
        <FilterSidebar
          totalProducts={total}
          priceRange={stats.priceRange}
          availabilityCount={stats.availabilityCount}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort and count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-border gallery-reveal stagger-2">
            <p className="text-sm text-muted-foreground">
              Showing {paginatedProducts.length} of {total} items
            </p>
            <div className="flex items-center gap-4">
              <label htmlFor="sort" className="text-sm text-muted-foreground">
                Sort by:
              </label>
              <SortSelect currentSort={sort} slug={slug} />
            </div>
          </div>

          {/* Product grid */}
          {paginatedProducts.length > 0 ? (
            <ProductGrid products={paginatedProducts} columns={4} />
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No products match your filters.</p>
              <Link
                href={`/category/${slug}`}
                className="text-sm text-warm hover:underline"
              >
                Clear all filters
              </Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-16">
              {currentPage > 1 && (
                <Link
                  href={`/category/${slug}?${buildQueryString(currentPage - 1)}`}
                  className="px-4 py-2 text-sm hover:text-warm transition-colors"
                >
                  ← Previous
                </Link>
              )}

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }

                  return (
                    <Link
                      key={pageNum}
                      href={`/category/${slug}?${buildQueryString(pageNum)}`}
                      className={`w-10 h-10 flex items-center justify-center text-sm transition-colors ${
                        pageNum === currentPage
                          ? 'bg-foreground text-background'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>

              {currentPage < totalPages && (
                <Link
                  href={`/category/${slug}?${buildQueryString(currentPage + 1)}`}
                  className="px-4 py-2 text-sm hover:text-warm transition-colors"
                >
                  Next →
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
