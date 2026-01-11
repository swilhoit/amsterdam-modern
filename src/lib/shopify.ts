/**
 * Shopify Storefront API Integration
 *
 * This module provides functions to interact with Shopify's Storefront API
 * for fetching products, collections, and handling cart operations.
 *
 * Configuration:
 * Set these environment variables in your .env.local file:
 * - NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: Your Shopify store domain (e.g., "your-store.myshopify.com")
 * - SHOPIFY_STOREFRONT_ACCESS_TOKEN: Your Storefront API access token
 */

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number;
  price: ShopifyPrice;
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyProductVariant;
    }>;
  };
  metafields: Array<{
    key: string;
    value: string;
  }> | null;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

interface ShopifyResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!domain || !storefrontAccessToken) {
    throw new Error('Shopify configuration missing. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables.');
  }

  const url = `https://${domain}/api/2024-01/graphql.json`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const json: ShopifyResponse<T> = await response.json();

  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join(', '));
  }

  return json.data;
}

// GraphQL Fragments
const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          price {
            amount
            currencyCode
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    metafields(identifiers: [
      { namespace: "custom", key: "sku" },
      { namespace: "custom", key: "dimensions" },
      { namespace: "custom", key: "designer" }
    ]) {
      key
      value
    }
  }
`;

const COLLECTION_FRAGMENT = `
  fragment CollectionFragment on Collection {
    id
    handle
    title
    description
    image {
      url
      altText
      width
      height
    }
  }
`;

// API Functions

/**
 * Fetch all collections
 */
export async function getCollections(): Promise<ShopifyCollection[]> {
  const query = `
    query GetCollections {
      collections(first: 20) {
        edges {
          node {
            ...CollectionFragment
          }
        }
      }
    }
    ${COLLECTION_FRAGMENT}
  `;

  const data = await shopifyFetch<{
    collections: { edges: Array<{ node: ShopifyCollection }> };
  }>(query);

  return data.collections.edges.map((edge) => edge.node);
}

/**
 * Fetch a single collection by handle with products
 */
export async function getCollection(
  handle: string,
  first: number = 24,
  after?: string
): Promise<ShopifyCollection | null> {
  const query = `
    query GetCollection($handle: String!, $first: Int!, $after: String) {
      collection(handle: $handle) {
        ...CollectionFragment
        products(first: $first, after: $after) {
          edges {
            node {
              ...ProductFragment
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
    ${COLLECTION_FRAGMENT}
    ${PRODUCT_FRAGMENT}
  `;

  const data = await shopifyFetch<{ collection: ShopifyCollection | null }>(query, {
    handle,
    first,
    after,
  });

  return data.collection;
}

/**
 * Fetch a single product by handle
 */
export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        ...ProductFragment
      }
    }
    ${PRODUCT_FRAGMENT}
  `;

  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(query, {
    handle,
  });

  return data.product;
}

/**
 * Fetch multiple products
 */
export async function getProducts(
  first: number = 24,
  after?: string,
  query?: string
): Promise<{
  products: ShopifyProduct[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const gqlQuery = `
    query GetProducts($first: Int!, $after: String, $query: String) {
      products(first: $first, after: $after, query: $query) {
        edges {
          node {
            ...ProductFragment
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
    ${PRODUCT_FRAGMENT}
  `;

  const data = await shopifyFetch<{
    products: {
      edges: Array<{ node: ShopifyProduct }>;
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  }>(gqlQuery, { first, after, query });

  return {
    products: data.products.edges.map((edge) => edge.node),
    pageInfo: data.products.pageInfo,
  };
}

/**
 * Search products
 */
export async function searchProducts(
  searchQuery: string,
  first: number = 24
): Promise<ShopifyProduct[]> {
  const { products } = await getProducts(first, undefined, searchQuery);
  return products;
}

// Cart Operations

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      handle: string;
    };
    price: ShopifyPrice;
    image: ShopifyImage | null;
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyPrice;
    totalAmount: ShopifyPrice;
    totalTaxAmount: ShopifyPrice | null;
  };
  lines: {
    edges: Array<{ node: CartLine }>;
  };
}

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                title
                handle
              }
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Create a new cart
 */
export async function createCart(): Promise<Cart> {
  const mutation = `
    mutation CreateCart {
      cartCreate {
        cart {
          ...CartFragment
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const data = await shopifyFetch<{ cartCreate: { cart: Cart } }>(mutation);
  return data.cartCreate.cart;
}

/**
 * Get cart by ID
 */
export async function getCart(cartId: string): Promise<Cart | null> {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFragment
      }
    }
    ${CART_FRAGMENT}
  `;

  const data = await shopifyFetch<{ cart: Cart | null }>(query, { cartId });
  return data.cart;
}

/**
 * Add items to cart
 */
export async function addToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<Cart> {
  const mutation = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const data = await shopifyFetch<{ cartLinesAdd: { cart: Cart } }>(mutation, {
    cartId,
    lines,
  });

  return data.cartLinesAdd.cart;
}

/**
 * Update cart line quantities
 */
export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<Cart> {
  const mutation = `
    mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const data = await shopifyFetch<{ cartLinesUpdate: { cart: Cart } }>(mutation, {
    cartId,
    lines,
  });

  return data.cartLinesUpdate.cart;
}

/**
 * Remove items from cart
 */
export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const mutation = `
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFragment
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const data = await shopifyFetch<{ cartLinesRemove: { cart: Cart } }>(mutation, {
    cartId,
    lineIds,
  });

  return data.cartLinesRemove.cart;
}

// Utility Functions

/**
 * Format price for display
 */
export function formatPrice(price: ShopifyPrice): string {
  const amount = parseFloat(price.amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(amount);
}

/**
 * Convert Shopify product to our Product type
 */
export function shopifyProductToProduct(shopifyProduct: ShopifyProduct): import('@/types/product').Product {
  const variant = shopifyProduct.variants.edges[0]?.node;
  const metafields = shopifyProduct.metafields || [];

  const sku = metafields.find((m) => m.key === 'sku')?.value || '';
  const dimensions = metafields.find((m) => m.key === 'dimensions')?.value || '';
  const designer = metafields.find((m) => m.key === 'designer')?.value || shopifyProduct.vendor;

  return {
    id: shopifyProduct.id.split('/').pop() || shopifyProduct.id,
    slug: shopifyProduct.handle,
    name: shopifyProduct.title,
    price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
    priceFormatted: formatPrice(shopifyProduct.priceRange.minVariantPrice),
    sku,
    available: variant?.quantityAvailable || (shopifyProduct.availableForSale ? 1 : 0),
    description: shopifyProduct.description,
    designer,
    dimensions,
    category: shopifyProduct.productType || '',
    subcategory: shopifyProduct.tags[0] || '',
    images: shopifyProduct.images.edges.map((edge) => ({
      url: edge.node.url,
      alt: edge.node.altText || shopifyProduct.title,
    })),
    url: `/product/${shopifyProduct.handle}`,
  };
}
