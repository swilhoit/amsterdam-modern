import * as fs from 'fs';
import * as path from 'path';

// Variant hash mapping
const SMALL_VARIANT = '2aee56bd1613eab785806717af7b0b01434013a7f089cb7f741b194d6a0c3933';
const LARGE_VARIANT = '2b828b68e38c7c650e25e76cd0bcabdc362e4178326ec3d97375a4b7734cb483';

const dataDir = path.join(process.cwd(), 'data', 'products');

// Get all JSON files
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

let totalProducts = 0;
let totalImages = 0;
let updatedImages = 0;

for (const file of files) {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const products = JSON.parse(content);

  for (const product of products) {
    totalProducts++;
    if (product.images && Array.isArray(product.images)) {
      for (const img of product.images) {
        totalImages++;
        if (img.url && img.url.includes(SMALL_VARIANT)) {
          img.url = img.url.replace(SMALL_VARIANT, LARGE_VARIANT);
          updatedImages++;
        }
      }
    }
  }

  // Write back
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  console.log(`Updated ${file}`);
}

console.log(`\nSummary:`);
console.log(`  Total products: ${totalProducts}`);
console.log(`  Total images: ${totalImages}`);
console.log(`  Upgraded to high-res: ${updatedImages}`);
