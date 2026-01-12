'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CATEGORIES, Category, Product } from '@/types/product';

const NAV_LINKS = [
  { href: '/contact', label: 'Contact' },
];

// Dropdown menu component for categories with subcategories
function CategoryDropdown({ category, isActive, isTransparent }: { category: Category; isActive: boolean; isTransparent: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  if (!category.subcategories || category.subcategories.length === 0) {
    return (
      <Link
        href={`/category/${category.slug}`}
        className={`text-[10px] uppercase tracking-[0.15em] transition-colors ${
          isTransparent
            ? 'text-white/80 hover:text-white'
            : 'text-muted-foreground hover:text-foreground'
        } ${isActive ? (isTransparent ? 'text-white' : 'text-foreground') : ''}`}
      >
        {category.name}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`/category/${category.slug}`}
        className={`text-[10px] uppercase tracking-[0.15em] transition-colors inline-flex items-center gap-1 ${
          isTransparent
            ? 'text-white/80 hover:text-white'
            : 'text-muted-foreground hover:text-foreground'
        } ${isActive ? (isTransparent ? 'text-white' : 'text-foreground') : ''}`}
      >
        {category.name}
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Link>

      {/* Dropdown menu */}
      <div
        className={`absolute top-full left-0 pt-2 transition-all duration-200 ${
          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
        }`}
      >
        <div className="bg-background border border-border/50 shadow-lg min-w-[200px] py-2 rounded-lg">
          {category.subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/category/${sub.slug}`}
              className="block px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Search result item component
function SearchResultItem({ product, onClick }: { product: Product; onClick: () => void }) {
  return (
    <Link
      href={`/product/${product.id}-${product.slug}`}
      onClick={onClick}
      className="flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors"
    >
      <div className="relative w-12 h-12 bg-secondary rounded overflow-hidden flex-shrink-0">
        {product.images[0]?.url && (
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{product.name}</p>
        {product.designer && (
          <p className="text-xs text-muted-foreground truncate">{product.designer}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {product.priceFormatted || `$${product.price.toLocaleString()}`}
        </p>
      </div>
    </Link>
  );
}

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Check if on homepage (where we want transparent header over hero)
  const isHomepage = pathname === '/';

  // Transparent mode: on homepage and not scrolled past hero
  const isTransparent = isHomepage && !isScrolled;

  // Handle scroll - change header style after scrolling past hero (100vh)
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      setIsScrolled(window.scrollY > heroHeight - 100);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  // Debounced search function
  const searchProducts = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.products || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchProducts]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // Close search and clear results
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Check if current path matches a category
  const isActiveCategory = (slug: string) => pathname === `/category/${slug}`;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent ? 'bg-transparent' : 'bg-background/95 backdrop-blur-sm'} ${isScrolled ? 'shadow-sm' : ''}`}>
      {/* Main header - single row with logo, nav, and search */}
      <div className={`transition-colors duration-300 ${isTransparent ? 'border-b border-white/20' : 'border-b border-border/50'}`}>
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <button className={`p-2 -ml-2 transition-colors ${isTransparent ? 'text-white' : ''}`} aria-label="Open menu">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-background overflow-y-auto">
                <nav className="flex flex-col gap-4 mt-12 pb-8">
                  <Link href="/" className="nav-link text-sm">Home</Link>
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="nav-link text-sm"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="h-px bg-border my-4" />
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                    Categories
                  </p>
                  {CATEGORIES.map((category) => (
                    <div key={category.id}>
                      {category.subcategories && category.subcategories.length > 0 ? (
                        <div>
                          <button
                            onClick={() => setExpandedMobileCategory(
                              expandedMobileCategory === category.id ? null : category.id
                            )}
                            className="nav-link text-sm w-full flex items-center justify-between py-1"
                          >
                            <span>{category.name}</span>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                expandedMobileCategory === category.id ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              expandedMobileCategory === category.id
                                ? 'max-h-[500px] opacity-100'
                                : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className="pl-4 pt-2 pb-2 flex flex-col gap-2">
                              <Link
                                href={`/category/${category.slug}`}
                                className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                              >
                                All {category.name}
                              </Link>
                              {category.subcategories.map((sub) => (
                                <Link
                                  key={sub.id}
                                  href={`/category/${sub.slug}`}
                                  className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={`/category/${category.slug}`}
                          className="nav-link text-sm block py-1"
                        >
                          {category.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <h1 className={`text-sm md:text-base font-medium tracking-[0.2em] uppercase transition-colors ${isTransparent ? 'text-white' : 'text-foreground'}`}>
                AMSTERDAM MODERN
              </h1>
            </Link>

            {/* Search */}
            <div className="flex items-center gap-4" ref={searchContainerRef}>
              {isSearchOpen ? (
                <div className="relative">
                  <form onSubmit={handleSearch} className="flex items-center gap-2 animate-in slide-in-from-right-4">
                    <div className="relative">
                      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isTransparent ? 'text-white/50' : 'text-muted-foreground'}`} />
                      <input
                        ref={searchInputRef}
                        type="search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-64 md:w-80 h-10 pl-10 pr-4 text-sm bg-transparent rounded-full outline-none transition-colors ${
                          isTransparent
                            ? 'border border-white/50 text-white placeholder:text-white/50 focus:border-white'
                            : 'border border-border text-foreground placeholder:text-muted-foreground focus:border-foreground'
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={closeSearch}
                      className={`p-2 transition-colors ${isTransparent ? 'text-white' : ''}`}
                      aria-label="Close search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Search results dropdown */}
                  {(searchResults.length > 0 || isSearching) && searchQuery.length >= 2 && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50">
                      {isSearching ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          Searching...
                        </div>
                      ) : (
                        <>
                          <div className="max-h-[400px] overflow-y-auto">
                            {searchResults.map((product) => (
                              <SearchResultItem
                                key={product.id}
                                product={product}
                                onClick={closeSearch}
                              />
                            ))}
                          </div>
                          {searchResults.length > 0 && (
                            <div className="border-t border-border p-3">
                              <button
                                onClick={handleSearch}
                                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                              >
                                View all results for &ldquo;{searchQuery}&rdquo;
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className={`p-2 transition-colors ${isTransparent ? 'text-white hover:text-white/70' : 'hover:text-foreground'}`}
                  aria-label="Open search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category navigation */}
      <div className={`hidden md:block transition-colors duration-300 ${isTransparent ? 'border-b border-white/20 bg-transparent' : 'border-b border-border/50 bg-background/80'}`}>
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <nav className="flex items-center justify-center gap-10 h-12">
            {CATEGORIES.map((category) => (
              <CategoryDropdown
                key={category.id}
                category={category}
                isActive={isActiveCategory(category.slug)}
                isTransparent={isTransparent}
              />
            ))}
            <Link
              href="/contact"
              className={`text-[10px] uppercase tracking-[0.15em] transition-colors ${
                isTransparent
                  ? 'text-white/80 hover:text-white'
                  : 'text-muted-foreground hover:text-foreground'
              } ${pathname === '/contact' ? (isTransparent ? 'text-white' : 'text-foreground') : ''}`}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
