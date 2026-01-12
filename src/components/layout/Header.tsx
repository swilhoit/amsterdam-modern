'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { CATEGORIES } from '@/types/product';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/favorites', label: 'Favorites' },
];

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
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
              <SheetContent side="left" className="w-80 bg-background">
                <nav className="flex flex-col gap-6 mt-12">
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
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
                    Categories
                  </p>
                  {CATEGORIES.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="nav-link text-sm"
                    >
                      {category.name}
                    </Link>
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
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className={`nav-link link-underline transition-colors ${
                  isActiveCategory(category.slug)
                    ? 'text-foreground after:scale-x-100'
                    : ''
                }`}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
