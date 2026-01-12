'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { CATEGORIES, Category } from '@/types/product';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/favorites', label: 'Favorites' },
];

// Dropdown menu component for categories with subcategories
function CategoryDropdown({ category, isActive }: { category: Category; isActive: boolean }) {
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
        className={`nav-link link-underline transition-colors ${
          isActive ? 'text-foreground after:scale-x-100' : ''
        }`}
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
        className={`nav-link link-underline transition-colors inline-flex items-center gap-1 ${
          isActive ? 'text-foreground after:scale-x-100' : ''
        }`}
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
        <div className="bg-background border border-border/50 shadow-lg min-w-[200px] py-2">
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

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Handle scroll to add compact mode
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Check if current path matches a category
  const isActiveCategory = (slug: string) => pathname === `/category/${slug}`;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
      {/* Top bar with secondary nav - hide on scroll */}
      <div className={`border-b border-border/50 transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'}`}>
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-10">
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link link-underline ${pathname === link.href ? 'text-foreground' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="hidden md:flex items-center gap-6">
              <a
                href="https://instagram.com/amsterdammodern"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link link-underline"
              >
                Instagram
              </a>
              <a
                href="https://pinterest.com/amsterdammodern"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link link-underline"
              >
                Pinterest
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-border/50">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <button className="p-2 -ml-2" aria-label="Open menu">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-background overflow-y-auto">
                <nav className="flex flex-col gap-4 mt-12 pb-8">
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
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
              <h1 className="text-sm md:text-base font-medium tracking-[0.2em] uppercase text-foreground">
                AMSTERDAM MODERN
              </h1>
            </Link>

            {/* Search */}
            <div className="flex items-center gap-4">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2 animate-in slide-in-from-right-4">
                  <Input
                    ref={searchInputRef}
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 md:w-64 h-9 text-sm bg-transparent border-border focus:border-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-2"
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:text-foreground transition-colors"
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
      <div className="hidden md:block border-b border-border/50 bg-background/80">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <nav className="flex items-center justify-center gap-10 h-12">
            {CATEGORIES.map((category) => (
              <CategoryDropdown
                key={category.id}
                category={category}
                isActive={isActiveCategory(category.slug)}
              />
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
