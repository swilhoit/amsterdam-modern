/**
 * Re-scrape product images from amsterdammodern.com to get fresh S3 URLs
 * The original signed URLs expired after 7 days
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

const DATA_DIR = path.join(process.cwd(), 'data', 'products');
const CONCURRENT_REQUESTS = 5;
const DELAY_BETWEEN_BATCHES = 1000; // 1 second

function fetchPage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = https.get(url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
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

// Decode HTML entities in URLs
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

  // Look for image URLs in the page
  // Pattern 1: data-srcset or srcset with S3 URLs
  const srcsetPattern = /(?:data-)?srcset="([^"]*ammod-pro\.s3[^"]*)"/gi;
  let match;

  while ((match = srcsetPattern.exec(html)) !== null) {
    const srcset = decodeHtmlEntities(match[1]);
    // Get the highest resolution URL (usually the last one or 2x)
    const urls = srcset.split(',').map(s => s.trim().split(' ')[0]);
    const highResUrl = urls[urls.length - 1] || urls[0];
    if (highResUrl && !images.some(img => img.url === highResUrl)) {
      images.push({ url: highResUrl, alt: productName });
    }
  }

  // Pattern 2: Direct src attributes with S3 URLs
  const srcPattern = /src="(https:\/\/ammod-pro\.s3[^"]*)"/gi;
  while ((match = srcPattern.exec(html)) !== null) {
    const url = decodeHtmlEntities(match[1]);
    if (!images.some(img => img.url === url)) {
      images.push({ url, alt: productName });
    }
  }

  // Pattern 3: Look for background-image URLs
  const bgPattern = /background-image:\s*url\(['"]?(https:\/\/ammod-pro\.s3[^'")\s]*)/gi;
  while ((match = bgPattern.exec(html)) !== null) {
    const url = decodeHtmlEntities(match[1]);
    if (!images.some(img => img.url === url)) {
      images.push({ url, alt: productName });
    }
  }

  // Pattern 4: JSON-LD or data attributes
  const jsonPattern = /"image":\s*"(https:\/\/ammod-pro\.s3[^"]*)"/gi;
  while ((match = jsonPattern.exec(html)) !== null) {
    const url = decodeHtmlEntities(match[1]);
    if (!images.some(img => img.url === url)) {
      images.push({ url, alt: productName });
    }
  }

  return images;
}

async function refreshProductImages(product: Product): Promise<ProductImage[]> {
  if (!product.url) {
    return product.images || [];
  }

  try {
    const html = await fetchPage(product.url);
    const images = extractImageUrls(html, product.name);

    if (images.length > 0) {
      return images;
    }

    // If no images found, keep existing (might already be valid)
    return product.images || [];
  } catch (error) {
    // On error, keep existing images
    return product.images || [];
  }
}

async function processBatch(products: Product[], startIdx: number): Promise<number> {
  const batch = products.slice(startIdx, startIdx + CONCURRENT_REQUESTS);

  const results = await Promise.all(
    batch.map(async (product) => {
      const newImages = await refreshProductImages(product);
      return { product, newImages };
    })
  );

  let updated = 0;
  for (const { product, newImages } of results) {
    if (newImages.length > 0 && newImages[0].url !== product.images?.[0]?.url) {
      product.images = newImages;
      updated++;
    }
  }

  return updated;
}

async function processCategory(categoryFile: string): Promise<{ total: number; updated: number }> {
  const filePath = path.join(DATA_DIR, categoryFile);
  const content = fs.readFileSync(filePath, 'utf-8');
  const products: Product[] = JSON.parse(content);

  let totalUpdated = 0;

  for (let i = 0; i < products.length; i += CONCURRENT_REQUESTS) {
    const shortName = products[Math.min(i, products.length - 1)].name.substring(0, 30);
    process.stdout.write(`\r  [${i + 1}-${Math.min(i + CONCURRENT_REQUESTS, products.length)}/${products.length}] ${shortName}...`.padEnd(70));

    const updated = await processBatch(products, i);
    totalUpdated += updated;

    // Delay between batches to avoid rate limiting
    if (i + CONCURRENT_REQUESTS < products.length) {
      await new Promise(r => setTimeout(r, DELAY_BETWEEN_BATCHES));
    }
  }

  // Save updated products back to file
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  console.log('');

  return { total: products.length, updated: totalUpdated };
}

async function main() {
  const args = process.argv.slice(2);
  const testMode = args.includes('--test');
  const specificFile = args.find(a => a.endsWith('.json'));

  console.log('Refreshing product images from amsterdammodern.com...\n');

  if (testMode) {
    console.log('TEST MODE: Only processing first 10 products\n');
  }

  // Get files to process
  let files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json') && f !== 'all-products.json');

  if (specificFile) {
    files = files.filter(f => f === specificFile);
  }

  // Sort by size (smallest first for faster feedback)
  files.sort((a, b) => {
    const sizeA = fs.statSync(path.join(DATA_DIR, a)).size;
    const sizeB = fs.statSync(path.join(DATA_DIR, b)).size;
    return sizeA - sizeB;
  });

  let grandTotal = 0;
  let grandUpdated = 0;

  for (const file of files) {
    console.log(`Processing ${file}...`);

    if (testMode) {
      // In test mode, only process first file with limited products
      const filePath = path.join(DATA_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const products: Product[] = JSON.parse(content);
      const testProducts = products.slice(0, 10);

      let updated = 0;
      for (let i = 0; i < testProducts.length; i++) {
        const product = testProducts[i];
        process.stdout.write(`\r  [${i + 1}/10] ${product.name.substring(0, 30)}...`.padEnd(60));
        const newImages = await refreshProductImages(product);
        if (newImages.length > 0 && newImages[0].url !== product.images?.[0]?.url) {
          product.images = newImages;
          updated++;
        }
        await new Promise(r => setTimeout(r, 500));
      }

      console.log(`\n  Test: ${updated}/10 products got fresh images`);

      // Show a sample
      if (testProducts[0].images?.[0]) {
        console.log(`  Sample URL: ${testProducts[0].images[0].url.substring(0, 80)}...`);
      }
      break;
    }

    const { total, updated } = await processCategory(file);
    grandTotal += total;
    grandUpdated += updated;
    console.log(`  Completed: ${updated}/${total} products updated\n`);
  }

  if (!testMode) {
    // Regenerate all-products.json
    console.log('Regenerating all-products.json...');
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
    console.log(`Total products processed: ${grandTotal}`);
    console.log(`Products with refreshed images: ${grandUpdated}`);
  }
}

main().catch(console.error);
