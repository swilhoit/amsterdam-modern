import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Amsterdam Modern | Mid-Century Modern Furniture',
    template: '%s | Amsterdam Modern',
  },
  description:
    'Curated mid-century modern furniture from Europe. Exceptional design from the 1950s through 1980s, selected for authenticity, condition, and timeless appeal.',
  keywords: [
    'mid-century modern',
    'furniture',
    'vintage furniture',
    'designer furniture',
    'European furniture',
    'Los Angeles',
    'Dutch design',
    'Scandinavian design',
  ],
  authors: [{ name: 'Amsterdam Modern' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://amsterdammodern.com',
    siteName: 'Amsterdam Modern',
    title: 'Amsterdam Modern | Mid-Century Modern Furniture',
    description:
      'Curated mid-century modern furniture from Europe. Exceptional design from the 1950s through 1980s.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amsterdam Modern | Mid-Century Modern Furniture',
    description:
      'Curated mid-century modern furniture from Europe. Exceptional design from the 1950s through 1980s.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
