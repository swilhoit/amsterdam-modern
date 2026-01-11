import { Metadata } from 'next';
import Link from 'next/link';
import { ProductGrid } from '@/components/products/ProductGrid';
import { searchProducts } from '@/lib/data';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : 'Search',
    description: `Search results for "${q}" in our mid-century modern furniture collection.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;

  const products = q ? await searchProducts(q, 48) : [];

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
          <li className="text-foreground">Search</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-12 gallery-reveal stagger-1">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-4">
          Search Results
        </h1>
        {q && (
          <p className="text-lg text-muted-foreground">
            {products.length} results for &ldquo;{q}&rdquo;
          </p>
        )}
      </header>

      {/* Search input for refinement */}
      <div className="mb-12 gallery-reveal stagger-2">
        <form action="/search" method="get" className="max-w-xl">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search for furniture, designers, styles..."
            className="w-full bg-transparent border border-border px-6 py-4 text-lg focus:outline-none focus:border-warm transition-colors"
          />
        </form>
      </div>

      {/* Results */}
      {!q ? (
        <div className="text-center py-16 gallery-reveal stagger-3">
          <p className="text-muted-foreground mb-4">
            Enter a search term to find products.
          </p>
          <p className="text-sm text-muted-foreground">
            Try searching for &ldquo;lamp&rdquo;, &ldquo;chair&rdquo;, or &ldquo;teak&rdquo;
          </p>
        </div>
      ) : products.length > 0 ? (
        <ProductGrid products={products} columns={4} />
      ) : (
        <div className="text-center py-16 gallery-reveal stagger-3">
          <p className="text-muted-foreground mb-4">
            No products found for &ldquo;{q}&rdquo;.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Try adjusting your search or browse our categories.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-foreground text-background text-sm uppercase tracking-wider hover:bg-warm transition-colors"
          >
            Browse Categories
          </Link>
        </div>
      )}
    </div>
  );
}
