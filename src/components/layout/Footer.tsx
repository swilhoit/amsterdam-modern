import Link from 'next/link';
import { CATEGORIES } from '@/types/product';

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-24">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/">
              <h2 className="font-serif text-2xl tracking-wide mb-6">
                AMSTERDAM <span className="text-warm">MODERN</span>
              </h2>
            </Link>
            <p className="text-sm text-background/70 leading-relaxed mb-6">
              Curating exceptional mid-century modern furniture from Europe and beyond since 2005.
            </p>
            <div className="space-y-2 text-sm text-background/70">
              <p>Los Angeles, California</p>
              <a
                href="mailto:info@amsterdammodern.com"
                className="hover:text-warm transition-colors"
              >
                info@amsterdammodern.com
              </a>
              <p>213-221-7380</p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-background/50 mb-6">
              Categories
            </h3>
            <nav className="flex flex-col gap-3">
              {CATEGORIES.slice(0, 5).map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="text-sm text-background/70 hover:text-warm transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-background/50 mb-6">
              Information
            </h3>
            <nav className="flex flex-col gap-3">
              <Link href="/about" className="text-sm text-background/70 hover:text-warm transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-sm text-background/70 hover:text-warm transition-colors">
                Contact
              </Link>
              <Link href="/shipping" className="text-sm text-background/70 hover:text-warm transition-colors">
                Shipping & Returns
              </Link>
              <Link href="/faq" className="text-sm text-background/70 hover:text-warm transition-colors">
                FAQ
              </Link>
              <Link href="/terms" className="text-sm text-background/70 hover:text-warm transition-colors">
                Terms & Conditions
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-background/50 mb-6">
              Newsletter
            </h3>
            <p className="text-sm text-background/70 mb-4">
              Subscribe for new arrivals and exclusive offers.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-3 bg-transparent border border-background/20 text-sm placeholder:text-background/40 focus:outline-none focus:border-warm transition-colors"
              />
              <button
                type="submit"
                className="btn-gallery bg-warm text-white hover:bg-warm/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/50">
            &copy; {new Date().getFullYear()} Amsterdam Modern. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/amsterdammodern"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-widest text-background/50 hover:text-warm transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://pinterest.com/amsterdammodern"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-widest text-background/50 hover:text-warm transition-colors"
            >
              Pinterest
            </a>
            <a
              href="https://facebook.com/amsterdammodernpage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-widest text-background/50 hover:text-warm transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
