/**
 * Refresh Archive images in parallel chunks
 * Usage: npx tsx scripts/refresh-archive-chunk.ts <start> <end>
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

interface ProductImage {
  url: string;
  alt: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  url: string;
  images: ProductImage[];
  [key: string]: unknown;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'products', '15-ARCHIVE.json');
const CONCURRENT_REQUESTS = 20; // Higher concurrency
const DELAY_BETWEEN_BATCHES = 200; // Shorter delay

function fetchPage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = https.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          fetchPage(redirectUrl).then(resolve).catch(reject);
          return;
        }
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => resolve(data));
    });
    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

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

function extractImageUrls(html: string, productName: string): ProductImage[] {
  const images: ProductImage[] = [];

  // Pattern 1: srcset with S3 URLs
  const srcsetPattern = /(?:data-)?srcset="([^"]*ammod-pro\.s3[^"]*)"/gi;
  let match;
  while ((match = srcsetPattern.exec(html)) !== null) {
    const srcset = decodeHtmlEntities(match[1]);
    const urls = srcset.split(',').map(s => s.trim().split(' ')[0]);
    const highResUrl = urls[urls.length - 1] || urls[0];
    if (highResUrl && !images.some(img => img.url === highResUrl)) {
      images.push({ url: highResUrl, alt: productName });
    }
  }

  // Pattern 2: Direct src attributes
  const srcPattern = /src="(https:\/\/ammod-pro\.s3[^"]*)"/gi;
  while ((match = srcPattern.exec(html)) !== null) {
    const url = decodeHtmlEntities(match[1]);
    if (!images.some(img => img.url === url)) {
      images.push({ url, alt: productName });
    }
  }

  return images;
}

async function refreshProduct(product: Product): Promise<ProductImage[]> {
  if (!product.url) return product.images || [];

  try {
    const html = await fetchPage(product.url);
    const images = extractImageUrls(html, product.name);
    return images.length > 0 ? images : (product.images || []);
  } catch {
    return product.images || [];
  }
}

async function main() {
  const args = process.argv.slice(2);
  const start = parseInt(args[0]) || 0;
  const end = parseInt(args[1]) || 0;
  const chunkId = args[2] || '?';

  if (!end) {
    console.error('Usage: npx tsx refresh-archive-chunk.ts <start> <end> [chunkId]');
    process.exit(1);
  }

  // Read current data
  const content = fs.readFileSync(DATA_FILE, 'utf-8');
  const allProducts: Product[] = JSON.parse(content);

  const products = allProducts.slice(start, end);
  console.log(`[Chunk ${chunkId}] Processing products ${start}-${end} (${products.length} items)`);

  let updated = 0;

  for (let i = 0; i < products.length; i += CONCURRENT_REQUESTS) {
    const batch = products.slice(i, i + CONCURRENT_REQUESTS);

    const results = await Promise.all(
      batch.map(async (product) => {
        const newImages = await refreshProduct(product);
        return { product, newImages };
      })
    );

    for (const { product, newImages } of results) {
      if (newImages.length > 0 && !newImages[0].url.includes('picsum.photos')) {
        const idx = allProducts.findIndex(p => p.id === product.id);
        if (idx !== -1) {
          allProducts[idx].images = newImages;
          updated++;
        }
      }
    }

    process.stdout.write(`\r[Chunk ${chunkId}] ${i + batch.length}/${products.length} (${updated} updated)`);

    if (i + CONCURRENT_REQUESTS < products.length) {
      await new Promise(r => setTimeout(r, DELAY_BETWEEN_BATCHES));
    }
  }

  // Save updated data
  fs.writeFileSync(DATA_FILE, JSON.stringify(allProducts, null, 2));
  console.log(`\n[Chunk ${chunkId}] Complete: ${updated}/${products.length} products updated`);
}

main().catch(console.error);
