import * as fs from 'fs';
import * as path from 'path';

interface ProductImage {
  url: string;
  alt: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  images: ProductImage[];
  [key: string]: unknown;
}

const DATA_DIR = path.join(process.cwd(), 'data', 'products');

// Category-specific placeholder images using picsum with seeded IDs for consistency
const CATEGORY_SEEDS: Record<string, number> = {
  'LIGHTING': 100,
  'SEATING': 200,
  'STORAGE': 300,
  'TABLES': 400,
  'OTHER': 500,
  'JUST-LANDED': 600,
  'BY-STYLE': 700,
  'ARCHIVE': 800,
};

function getPlaceholderUrl(productId: string, imageIndex: number, category: string): string {
  // Create a deterministic seed from product ID
  const numericId = productId.replace(/\D/g, '');
  const seed = parseInt(numericId.slice(-4) || '0') + imageIndex;
  const baseSeed = CATEGORY_SEEDS[category.replace(/^\d+-/, '').toUpperCase()] || 500;

  // Use picsum with a seed for consistent images
  return `https://picsum.photos/seed/${baseSeed + seed}/800/800`;
}

function processCategory(categoryFile: string): number {
  const filePath = path.join(DATA_DIR, categoryFile);
  const content = fs.readFileSync(filePath, 'utf-8');
  const products: Product[] = JSON.parse(content);

  let updated = 0;

  for (const product of products) {
    if (!product.images || product.images.length === 0) {
      // Add a default image if none exist
      product.images = [{
        url: getPlaceholderUrl(product.id, 0, product.category),
        alt: product.name
      }];
      updated++;
      continue;
    }

    // Check if images are expired S3 URLs
    const hasExpiredUrls = product.images.some(img =>
      img.url.includes('s3.amazonaws.com') ||
      img.url.includes('X-Amz-Signature')
    );

    if (hasExpiredUrls) {
      product.images = product.images.map((img, index) => ({
        url: getPlaceholderUrl(product.id, index, product.category),
        alt: img.alt || product.name
      }));
      updated++;
    }
  }

  // Save updated products back to file
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

  return updated;
}

async function main() {
  console.log('Fixing expired S3 image URLs with placeholders...\n');

  // Get all JSON files
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json') && f !== 'all-products.json');

  let totalUpdated = 0;

  for (const file of files) {
    const updated = processCategory(file);
    console.log(`${file}: ${updated} products updated`);
    totalUpdated += updated;
  }

  // Regenerate all-products.json
  console.log('\nRegenerating all-products.json...');
  const allProducts: Product[] = [];
  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const products: Product[] = JSON.parse(content);
    allProducts.push(...products);
  }
  fs.writeFileSync(
    path.join(DATA_DIR, 'all-products.json'),
    JSON.stringify(allProducts, null, 2)
  );

  console.log(`\n=== Summary ===`);
  console.log(`Total products updated: ${totalUpdated}`);
  console.log(`Placeholder images are from picsum.photos with category-specific seeds`);
}

main().catch(console.error);
