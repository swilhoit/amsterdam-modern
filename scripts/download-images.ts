import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

interface ProductImage {
  url: string;
  alt: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  images: ProductImage[];
  [key: string]: unknown;
}

const DATA_DIR = path.join(process.cwd(), 'data', 'products');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'products');

// Create images directory
fs.mkdirSync(IMAGES_DIR, { recursive: true });

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Skip if already downloaded
    if (fs.existsSync(filepath)) {
      resolve(true);
      return;
    }

    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, { timeout: 30000 }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl, filepath).then(resolve);
          return;
        }
      }

      if (response.statusCode !== 200) {
        resolve(false);
        return;
      }

      const dir = path.dirname(filepath);
      fs.mkdirSync(dir, { recursive: true });

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(true);
      });

      fileStream.on('error', () => {
        fs.unlink(filepath, () => {});
        resolve(false);
      });
    });

    request.on('error', () => {
      resolve(false);
    });

    request.on('timeout', () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function processCategory(categoryFile: string): Promise<{ success: number; failed: number }> {
  const filePath = path.join(DATA_DIR, categoryFile);
  const content = fs.readFileSync(filePath, 'utf-8');
  const products: Product[] = JSON.parse(content);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const shortName = product.name.substring(0, 35);
    process.stdout.write(`\r  [${i + 1}/${products.length}] ${shortName}...`.padEnd(60));

    if (!product.images || product.images.length === 0) {
      continue;
    }

    const newImages: ProductImage[] = [];

    for (let j = 0; j < product.images.length; j++) {
      const img = product.images[j];
      const ext = '.jpg'; // All images appear to be JPEG
      const filename = `${product.id}-${j}${ext}`;
      const localPath = `/images/products/${filename}`;
      const fullPath = path.join(IMAGES_DIR, filename);

      // Check if already exists locally
      if (fs.existsSync(fullPath)) {
        newImages.push({ url: localPath, alt: img.alt });
        success++;
        continue;
      }

      // Try to download
      const downloaded = await downloadImage(img.url, fullPath);

      if (downloaded) {
        newImages.push({ url: localPath, alt: img.alt });
        success++;
      } else {
        // Keep original URL as fallback
        newImages.push(img);
        failed++;
      }

      // Small delay to avoid overwhelming the server
      await new Promise(r => setTimeout(r, 50));
    }

    product.images = newImages;
  }

  // Save updated products back to file
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  console.log('');

  return { success, failed };
}

async function main() {
  console.log('Downloading product images...\n');

  // Get all JSON files
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json') && f !== 'all-products.json');

  let totalSuccess = 0;
  let totalFailed = 0;

  for (const file of files) {
    console.log(`Processing ${file}...`);
    const { success, failed } = await processCategory(file);
    totalSuccess += success;
    totalFailed += failed;
    console.log(`  Completed: ${success} downloaded, ${failed} failed\n`);
  }

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
  console.log(`Total images downloaded: ${totalSuccess}`);
  console.log(`Total failed: ${totalFailed}`);
  console.log(`Images saved to: ${IMAGES_DIR}`);
}

main().catch(console.error);
