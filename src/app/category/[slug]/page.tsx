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
    sub?: string;
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
  const { page = '1', sort = 'newest', minPrice, maxPrice, availability, sub } = await searchParams;

  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  // Find subcategory name if filtering by subcategory
  const subcategory = sub ? category.subcategories?.find(s => s.slug.includes(`sub=${sub}`)) : undefined;

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
    subcategory: sub,
  });

  // Build query string for pagination links
  const buildQueryString = (pageNum: number) => {
    const params = new URLSearchParams();
    params.set('page', String(pageNum));
    if (sort !== 'newest') params.set('sort', sort);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (availability) params.set('availability', availability);
    if (sub) params.set('sub', sub);
    return params.toString();
  };

  return (
    <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8 pt-24 md:pt-36">
      {/* Breadcrumb */}
      <nav className="mb-8 gallery-reveal">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          {subcategory ? (
            <>
              <li>
                <Link href={`/category/${slug}`} className="hover:text-foreground transition-colors">
                  {category.name}
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground">{subcategory.name}</li>
            </>
          ) : (
            <li className="text-foreground">{category.name}</li>
          )}
        </ol>
      </nav>

      {/* Category header */}
      <header className="mb-12 gallery-reveal stagger-1">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-medium uppercase tracking-wide mb-4">
          {subcategory ? subcategory.name : category.name}
        </h1>
        {!subcategory && category.description && (
          <p className="text-lg text-muted-foreground max-w-2xl">
            {category.description}
          </p>
        )}
        {subcategory && (
          <Link href={`/category/${slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← View all {category.name}
          </Link>
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
                className="text-sm text-foreground hover:underline"
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
                  className="px-4 py-2 text-sm hover:text-foreground transition-colors"
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
                  className="px-4 py-2 text-sm hover:text-foreground transition-colors"
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
