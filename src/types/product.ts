export interface ProductImage {
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  priceFormatted: string;
  sku: string;
  available: number;
  description: string;
  designer: string;
  dimensions: string;
  category: string;
  subcategory: string;
  images: ProductImage[];
  url: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  url: string;
  description?: string;
  image?: string;
}

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Lighting', slug: '1-LIGHTING', url: '/categories/1-LIGHTING', description: 'Pendant lights, floor lamps, and wall sconces' },
  { id: '2', name: 'Seating', slug: '2-SEATING', url: '/categories/2-SEATING', description: 'Chairs, sofas, and lounge seating' },
  { id: '3', name: 'Tables', slug: '3-TABLES', url: '/categories/3-TABLES', description: 'Dining, coffee, and side tables' },
  { id: '4', name: 'Storage', slug: '4-STORAGE', url: '/categories/4-STORAGE', description: 'Cabinets, shelving, and credenzas' },
  { id: '6', name: 'Other', slug: '6-OTHER', url: '/categories/6-OTHER', description: 'Mirrors, art, and accessories' },
  { id: '752', name: 'Just Landed', slug: '752-JUST-LANDED', url: '/categories/752-JUST-LANDED', description: 'Our newest arrivals' },
  { id: '1112', name: 'By Style', slug: '1112-BY-STYLE', url: '/categories/1112-BY-STYLE', description: 'Shop by design movement' },
  { id: '15', name: 'Archive', slug: '15-ARCHIVE', url: '/categories/15-ARCHIVE', description: 'Previously sold pieces' },
];
