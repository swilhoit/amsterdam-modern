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

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  url: string;
  description?: string;
  image?: string;
  subcategories?: Subcategory[];
}

export const CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Lighting',
    slug: '1-LIGHTING',
    url: '/categories/1-LIGHTING',
    description: 'Pendant lights, floor lamps, and wall sconces'
  },
  {
    id: '2',
    name: 'Seating',
    slug: '2-SEATING',
    url: '/categories/2-SEATING',
    description: 'Chairs, sofas, and lounge seating',
    subcategories: [
      { id: '2-1', name: 'Accent Chairs', slug: '2-SEATING?sub=accent-chairs' },
      { id: '2-2', name: 'Beds', slug: '2-SEATING?sub=beds' },
      { id: '2-3', name: 'Benches', slug: '2-SEATING?sub=benches' },
      { id: '2-4', name: 'Daybeds', slug: '2-SEATING?sub=daybeds' },
      { id: '2-5', name: 'Dining Chairs', slug: '2-SEATING?sub=dining-chairs' },
      { id: '2-6', name: 'Dining Sets', slug: '2-SEATING?sub=dining-sets' },
      { id: '2-7', name: 'Lounge Chairs', slug: '2-SEATING?sub=lounge-chairs' },
      { id: '2-8', name: 'Loveseats', slug: '2-SEATING?sub=loveseats' },
      { id: '2-9', name: 'Office', slug: '2-SEATING?sub=office' },
      { id: '2-10', name: 'Ottomans', slug: '2-SEATING?sub=ottomans' },
      { id: '2-11', name: 'Outdoor', slug: '2-SEATING?sub=outdoor' },
      { id: '2-12', name: 'Rocking Chairs', slug: '2-SEATING?sub=rocking-chairs' },
      { id: '2-13', name: 'Sectional Sofas', slug: '2-SEATING?sub=sectional-sofas' },
      { id: '2-14', name: 'Sofas', slug: '2-SEATING?sub=sofas' },
      { id: '2-15', name: 'Stacking & School', slug: '2-SEATING?sub=stacking-school' },
      { id: '2-16', name: 'Stools', slug: '2-SEATING?sub=stools' },
    ]
  },
  {
    id: '3',
    name: 'Tables',
    slug: '3-TABLES',
    url: '/categories/3-TABLES',
    description: 'Dining, coffee, and side tables',
    subcategories: [
      { id: '3-1', name: 'Carts', slug: '3-TABLES?sub=carts' },
      { id: '3-2', name: 'Coffee', slug: '3-TABLES?sub=coffee' },
      { id: '3-3', name: 'Desks', slug: '3-TABLES?sub=desks' },
      { id: '3-4', name: 'Dining', slug: '3-TABLES?sub=dining' },
      { id: '3-5', name: 'Industrial', slug: '3-TABLES?sub=industrial' },
      { id: '3-6', name: 'Nesting', slug: '3-TABLES?sub=nesting' },
      { id: '3-7', name: 'Nightstand', slug: '3-TABLES?sub=nightstand' },
      { id: '3-8', name: 'Side', slug: '3-TABLES?sub=side' },
    ]
  },
  {
    id: '4',
    name: 'Storage',
    slug: '4-STORAGE',
    url: '/categories/4-STORAGE',
    description: 'Cabinets, shelving, and credenzas',
    subcategories: [
      { id: '4-1', name: 'Bar', slug: '4-STORAGE?sub=bar' },
      { id: '4-2', name: 'Bookshelf', slug: '4-STORAGE?sub=bookshelf' },
      { id: '4-3', name: 'Credenzas', slug: '4-STORAGE?sub=credenzas' },
      { id: '4-4', name: 'Desks', slug: '4-STORAGE?sub=desks' },
      { id: '4-5', name: 'Dresser', slug: '4-STORAGE?sub=dresser' },
      { id: '4-6', name: 'Industrial Shelves', slug: '4-STORAGE?sub=industrial-shelves' },
      { id: '4-7', name: 'Vanity', slug: '4-STORAGE?sub=vanity' },
      { id: '4-8', name: 'Wall Units', slug: '4-STORAGE?sub=wall-units' },
    ]
  },
  {
    id: '6',
    name: 'Other',
    slug: '6-OTHER',
    url: '/categories/6-OTHER',
    description: 'Mirrors, art, and accessories',
    subcategories: [
      { id: '6-1', name: 'Accessories', slug: '6-OTHER?sub=accessories' },
      { id: '6-2', name: 'Art', slug: '6-OTHER?sub=art' },
      { id: '6-3', name: 'Ashtrays', slug: '6-OTHER?sub=ashtrays' },
      { id: '6-4', name: 'Ceramics', slug: '6-OTHER?sub=ceramics' },
      { id: '6-5', name: 'Coat & Umbrella', slug: '6-OTHER?sub=coat-umbrella' },
      { id: '6-6', name: 'Electronics', slug: '6-OTHER?sub=electronics' },
      { id: '6-7', name: 'Kids', slug: '6-OTHER?sub=kids' },
      { id: '6-8', name: 'Kitchenware', slug: '6-OTHER?sub=kitchenware' },
      { id: '6-9', name: 'Magazine Stands', slug: '6-OTHER?sub=magazine-stands' },
      { id: '6-10', name: 'Maps & Charts', slug: '6-OTHER?sub=maps-charts' },
      { id: '6-11', name: 'Mirrors', slug: '6-OTHER?sub=mirrors' },
      { id: '6-12', name: 'Planters', slug: '6-OTHER?sub=planters' },
      { id: '6-13', name: 'Rugs', slug: '6-OTHER?sub=rugs' },
    ]
  },
  {
    id: '752',
    name: 'Just Landed',
    slug: '752-JUST-LANDED',
    url: '/categories/752-JUST-LANDED',
    description: 'Our newest arrivals'
  },
  {
    id: '1112',
    name: 'By Style',
    slug: '1112-BY-STYLE',
    url: '/categories/1112-BY-STYLE',
    description: 'Shop by design movement'
  },
  {
    id: '15',
    name: 'Archive',
    slug: '15-ARCHIVE',
    url: '/categories/15-ARCHIVE',
    description: 'Previously sold pieces'
  },
];
