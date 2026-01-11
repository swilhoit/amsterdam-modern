/**
 * Fix HTML entities in image URLs
 * The scraper saved URLs with &amp; instead of &
 */

import * as fs from 'fs';
import * as path from 'path';

interface ProductImage {
  url: string;
  alt: string;
}

interface Product {
  id: string;
  images: ProductImage[];
  [key: string]: unknown;
}

const DATA_DIR = path.join(process.cwd(), 'data', 'products');

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');
}

function processFile(filename: string): number {
  const filePath = path.join(DATA_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  const products: Product[] = JSON.parse(content);

  let fixed = 0;

  for (const product of products) {
    if (!product.images) continue;

    for (const img of product.images) {
      if (img.url.includes('&amp;')) {
        img.url = decodeHtmlEntities(img.url);
        fixed++;
      }
    }
  }

  if (fixed > 0) {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  }

  return fixed;
}

async function main() {
  console.log('Fixing HTML entities in image URLs...\n');

  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  let totalFixed = 0;

  for (const file of files) {
    const fixed = processFile(file);
    if (fixed > 0) {
      console.log(`${file}: Fixed ${fixed} URLs`);
      totalFixed += fixed;
    }
  }

  console.log(`\nTotal URLs fixed: ${totalFixed}`);
}

main().catch(console.error);
