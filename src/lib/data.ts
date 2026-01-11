/**
 * Data access layer for products
 *
 * This module provides functions to fetch product data.
 * In development, it uses local JSON files from the scraped data.
 * In production, it can use Shopify or another data source.
 */

import { Product, CATEGORIES, Category } from '@/types/product';
import fs from 'fs';
import path from 'path';

const USE_SHOPIFY = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ? true : false;

/**
 * Map category name to file slug
 * Product category might be "LIGHTING" but file is "1-LIGHTING.json"
 */
function getCategoryFileSlug(categoryName: string): string {
  // If it already has an ID prefix, return as-is
  if (/^\d+-/.test(categoryName)) {
    return categoryName;
  }

  // Find matching category
  const category = CATEGORIES.find(
    (c) =>
      c.name.toUpperCase() === categoryName.toUpperCase() ||
      c.slug.toUpperCase().endsWith(`-${categoryName.toUpperCase()}`)
  );

  return category?.slug || categoryName;
}

/**
 * Load products from local JSON file
 */
async function loadLocalProducts(categorySlug: string): Promise<Product[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'products', `${categorySlug}.json`);

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as Product[];
    }
  } catch (error) {
    console.error(`Error loading products for ${categorySlug}:`, error);
  }

  return [];
}

/**
 * Load all products from local JSON files
 */
async function loadAllLocalProducts(): Promise<Product[]> {
  const allProducts: Product[] = [];

  for (const category of CATEGORIES) {
    const products = await loadLocalProducts(category.slug);
    allProducts.push(...products);
  }

  // Also try to load the combined file
  try {
    const allProductsPath = path.join(process.cwd(), 'data', 'products', 'all-products.json');
    if (fs.existsSync(allProductsPath)) {
      const data = fs.readFileSync(allProductsPath, 'utf-8');
      return JSON.parse(data) as Product[];
    }
  } catch (error) {
    console.error('Error loading all products:', error);
  }

  return allProducts;
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  if (USE_SHOPIFY) {
    // In production, fetch from Shopify collections
    const { getCollections } = await import('./shopify');
    const collections = await getCollections();
    return collections.map((c) => ({
      id: c.id,
      name: c.title,
      slug: c.handle,
      url: `/category/${c.handle}`,
      description: c.description,
      image: c.image?.url,
    }));
  }

  return CATEGORIES;
}

/**
 * Get products by category with filtering support
 */
export async function getProductsByCategory(
  categorySlug: string,
  options?: {
    page?: number;
    perPage?: number;
    sort?: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'name-az' | 'name-za';
    minPrice?: number;
    maxPrice?: number;
    availability?: 'in-stock' | 'sold';
  }
): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  stats: {
    priceRange: { min: number; max: number };
    availabilityCount: { inStock: number; sold: number };
  };
}> {
  const { page = 1, perPage = 24, sort = 'newest', minPrice, maxPrice, availability } = options || {};

  if (USE_SHOPIFY) {
    const { getCollection, shopifyProductToProduct } = await import('./shopify');
    const collection = await getCollection(categorySlug, perPage);

    if (!collection) {
      return {
        products: [],
        total: 0,
        page,
        totalPages: 0,
        stats: { priceRange: { min: 0, max: 0 }, availabilityCount: { inStock: 0, sold: 0 } },
      };
    }

    const products = collection.products.edges.map((edge) =>
      shopifyProductToProduct(edge.node)
    );

    return {
      products,
      total: products.length,
      page,
      totalPages: collection.products.pageInfo.hasNextPage ? page + 1 : page,
      stats: { priceRange: { min: 0, max: 0 }, availabilityCount: { inStock: 0, sold: 0 } },
    };
  }

  // Load from local files
  const allProducts = await loadLocalProducts(categorySlug);

  // Calculate stats from all products (before filtering)
  const prices = allProducts.map((p) => p.price).filter((p) => p > 0);
  const stats = {
    priceRange: {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 0,
    },
    availabilityCount: {
      inStock: allProducts.filter((p) => p.available > 0).length,
      sold: allProducts.filter((p) => p.available === 0).length,
    },
  };

  // Apply filters
  let products = [...allProducts];

  if (minPrice !== undefined) {
    products = products.filter((p) => p.price >= minPrice);
  }

  if (maxPrice !== undefined) {
    products = products.filter((p) => p.price <= maxPrice);
  }

  if (availability === 'in-stock') {
    products = products.filter((p) => p.available > 0);
  } else if (availability === 'sold') {
    products = products.filter((p) => p.available === 0);
  }

  // Sort products
  switch (sort) {
    case 'oldest':
      products.reverse();
      break;
    case 'price-low':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'name-az':
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-za':
      products.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      // newest - already in order
      break;
  }

  const total = products.length;
  const totalPages = Math.ceil(total / perPage);
  const startIndex = (page - 1) * perPage;
  const paginatedProducts = products.slice(startIndex, startIndex + perPage);

  return {
    products: paginatedProducts,
    total,
    page,
    totalPages,
    stats,
  };
}

/**
 * Get a single product by ID or slug
 */
export async function getProduct(idOrSlug: string): Promise<Product | null> {
  if (USE_SHOPIFY) {
    const { getProduct: getShopifyProduct, shopifyProductToProduct } = await import('./shopify');
    const product = await getShopifyProduct(idOrSlug);
    return product ? shopifyProductToProduct(product) : null;
  }

  // Load from local files - search through all categories
  const allProducts = await loadAllLocalProducts();

  // Try to find by ID first (format: "id-slug")
  const idMatch = idOrSlug.match(/^(\d+)/);
  if (idMatch) {
    const product = allProducts.find((p) => p.id === idMatch[1]);
    if (product) return product;
  }

  // Try to find by slug
  const product = allProducts.find(
    (p) => p.slug === idOrSlug || `${p.id}-${p.slug}` === idOrSlug
  );

  return product || null;
}

/**
 * Get featured/new products
 */
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  if (USE_SHOPIFY) {
    const { getProducts, shopifyProductToProduct } = await import('./shopify');
    const { products } = await getProducts(limit);
    return products.map(shopifyProductToProduct);
  }

  // Load from "Just Landed" category or all products
  let products = await loadLocalProducts('752-JUST-LANDED');

  if (products.length === 0) {
    products = await loadAllLocalProducts();
  }

  return products.slice(0, limit);
}

/**
 * Search products
 */
export async function searchProducts(query: string, limit: number = 24): Promise<Product[]> {
  if (USE_SHOPIFY) {
    const { searchProducts: shopifySearch, shopifyProductToProduct } = await import('./shopify');
    const products = await shopifySearch(query, limit);
    return products.map(shopifyProductToProduct);
  }

  const allProducts = await loadAllLocalProducts();
  const searchTerms = query.toLowerCase().split(' ');

  return allProducts
    .filter((product) => {
      const searchableText = `${product.name} ${product.designer} ${product.description} ${product.sku}`.toLowerCase();
      return searchTerms.every((term) => searchableText.includes(term));
    })
    .slice(0, limit);
}

/**
 * Get related products
 */
export async function getRelatedProducts(product: Product, limit: number = 4): Promise<Product[]> {
  if (USE_SHOPIFY) {
    const { getCollection, shopifyProductToProduct } = await import('./shopify');
    const collection = await getCollection(product.category, limit + 1);

    if (!collection) return [];

    return collection.products.edges
      .map((edge) => shopifyProductToProduct(edge.node))
      .filter((p) => p.id !== product.id)
      .slice(0, limit);
  }

  // Map category name to file slug (e.g., "LIGHTING" -> "1-LIGHTING")
  const categorySlug = getCategoryFileSlug(product.category);
  const categoryProducts = await loadLocalProducts(categorySlug);

  return categoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, limit);
}
