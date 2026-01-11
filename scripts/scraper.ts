import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://amsterdammodern.com';

interface ProductImage {
  url: string;
  alt: string;
}

interface Product {
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

interface Category {
  id: string;
  name: string;
  slug: string;
  url: string;
}

// Known categories from the site
const CATEGORIES: Category[] = [
  { id: '1', name: 'LIGHTING', slug: '1-LIGHTING', url: `${BASE_URL}/categories/1-LIGHTING` },
  { id: '2', name: 'SEATING', slug: '2-SEATING', url: `${BASE_URL}/categories/2-SEATING` },
  { id: '3', name: 'TABLES', slug: '3-TABLES', url: `${BASE_URL}/categories/3-TABLES` },
  { id: '4', name: 'STORAGE', slug: '4-STORAGE', url: `${BASE_URL}/categories/4-STORAGE` },
  { id: '6', name: 'OTHER', slug: '6-OTHER', url: `${BASE_URL}/categories/6-OTHER` },
  { id: '752', name: 'JUST LANDED', slug: '752-JUST-LANDED', url: `${BASE_URL}/categories/752-JUST-LANDED` },
  { id: '1112', name: 'BY STYLE', slug: '1112-BY-STYLE', url: `${BASE_URL}/categories/1112-BY-STYLE` },
  { id: '15', name: 'ARCHIVE', slug: '15-ARCHIVE', url: `${BASE_URL}/categories/15-ARCHIVE` },
];

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.text();
}

async function getProductsFromPage(pageUrl: string, categoryName: string): Promise<{ products: Product[], nextPage: string | null, totalPages: number }> {
  const html = await fetchPage(pageUrl);
  const $ = cheerio.load(html);
  const products: Product[] = [];
  const seenIds = new Set<string>();

  // Find all h2 elements within links - these are product titles
  $('a h2').each((_, h2El) => {
    const $h2 = $(h2El);
    const $parentLink = $h2.closest('a');
    const href = $parentLink.attr('href') || '';

    // Check if this is a product link (format: /categories/X-NAME/123456-product-slug)
    const productUrlMatch = href.match(/\/categories\/\d+-[A-Z-]+\/(\d+)-(.+?)(\?|$)/i);
    if (!productUrlMatch) return;

    const productId = productUrlMatch[1];
    const productSlug = productUrlMatch[2];

    // Skip duplicates
    if (seenIds.has(productId)) return;
    seenIds.add(productId);

    const name = $h2.text().trim();
    const $infoP = $parentLink.find('p');
    const infoText = $infoP.text().trim();

    // Find sibling image link (previous sibling in the list item)
    const $listItem = $parentLink.closest('li');
    const $imgLink = $listItem.find('a img').first();
    const imgSrc = $imgLink.attr('src') || '';

    if (!name) return;

    // Parse price and SKU from info text (format: "$650.00 L585 VA available: 9")
    const priceMatch = infoText.match(/\$[\d,]+\.?\d*/);
    const skuMatch = infoText.match(/([A-Z]\d{2,4}\s*[A-Z]*\d*)/);
    const availMatch = infoText.match(/available:\s*(\d+)/i);
    const isSold = infoText.toLowerCase().includes('sold');

    products.push({
      id: productId,
      slug: productSlug,
      name,
      price: priceMatch ? parseFloat(priceMatch[0].replace(/[$,]/g, '')) : 0,
      priceFormatted: priceMatch ? priceMatch[0] : (isSold ? 'sold' : ''),
      sku: skuMatch ? skuMatch[1].trim() : '',
      available: availMatch ? parseInt(availMatch[1]) : (isSold ? 0 : 1),
      description: '',
      designer: '',
      dimensions: '',
      category: categoryName,
      subcategory: '',
      images: imgSrc ? [{
        url: imgSrc.startsWith('http') ? imgSrc : `${BASE_URL}${imgSrc}`,
        alt: name,
      }] : [],
      url: href.startsWith('http') ? href : `${BASE_URL}${href}`,
    });
  });

  // Find total pages
  let totalPages = 1;
  const paginationText = $('.pagination').text();
  const pageNumbers = paginationText.match(/\d+/g);
  if (pageNumbers && pageNumbers.length > 0) {
    totalPages = Math.max(...pageNumbers.map(n => parseInt(n)));
  }

  // Check for next page
  let nextPage: string | null = null;
  $('a').each((_, el) => {
    const text = $(el).text();
    if (text.includes('Next')) {
      const href = $(el).attr('href');
      if (href) {
        nextPage = href.startsWith('http') ? href : `${BASE_URL}${href}`;
      }
    }
  });

  return { products, nextPage, totalPages };
}

async function getProductDetails(product: Product): Promise<Product> {
  try {
    const html = await fetchPage(product.url);
    const $ = cheerio.load(html);

    // Get all paragraphs in product info area
    const paragraphs = $('p').toArray();

    for (const p of paragraphs) {
      const text = $(p).text().trim();

      // Designer info (contains slashes like "Designer / Manufacturer / Country")
      if (text.includes('/') && text.length < 150 && !text.includes('@') && !text.includes('©')) {
        product.designer = text;
      }

      // Description (longer text without special patterns)
      if (text.length > 100 && !text.includes('/') && !text.includes('@') && !text.includes('©')) {
        product.description = text;
      }
    }

    // Get dimensions from table
    $('tr').each((_, row) => {
      const rowText = $(row).text();
      if (rowText.includes('Size:')) {
        const cells = $(row).find('td');
        if (cells.length >= 2) {
          product.dimensions = $(cells[1]).text().trim();
        }
      }
    });

    // Get all product images
    const images: ProductImage[] = [];
    const seenUrls = new Set<string>();

    $('img').each((_, el) => {
      const src = $(el).attr('src') || '';
      if (src && src.includes('active_storage') && !seenUrls.has(src)) {
        seenUrls.add(src);
        // Try to get larger version
        let largeUrl = src;
        if (src.includes('representations')) {
          largeUrl = src.replace(/\/\d+x\d+\b/, '/800x600');
        }
        images.push({
          url: largeUrl.startsWith('http') ? largeUrl : `${BASE_URL}${largeUrl}`,
          alt: product.name,
        });
      }
    });

    if (images.length > 0) {
      product.images = images;
    }

    return product;
  } catch (error) {
    console.error(`Error fetching details for ${product.name}:`, error);
    return product;
  }
}

async function scrapeCategory(categorySlug: string, outputDir: string, quickMode: boolean = false): Promise<Product[]> {
  const category = CATEGORIES.find(c => c.slug === categorySlug);
  if (!category) {
    console.error(`Unknown category: ${categorySlug}`);
    return [];
  }

  console.log(`Scraping category: ${category.name}`);

  const allProducts: Product[] = [];
  let currentUrl: string | null = `${category.url}?order=added_new-old&page=1`;
  let pageNum = 1;
  let totalPages = 1;

  while (currentUrl) {
    console.log(`  Page ${pageNum}/${totalPages}...`);
    try {
      const { products, nextPage, totalPages: total } = await getProductsFromPage(currentUrl, category.name);
      totalPages = total;
      allProducts.push(...products);
      console.log(`    Found ${products.length} products`);
      currentUrl = nextPage;
      pageNum++;

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`  Error on page ${pageNum}:`, error);
      break;
    }
  }

  console.log(`  Total: ${allProducts.length} products in ${category.name}`);

  // Get details for each product (with rate limiting)
  if (!quickMode) {
    const detailedProducts: Product[] = [];
    for (let i = 0; i < allProducts.length; i++) {
      const shortName = allProducts[i].name.substring(0, 40);
      process.stdout.write(`\r  Getting details ${i + 1}/${allProducts.length}: ${shortName}...`.padEnd(80));
      try {
        const detailed = await getProductDetails(allProducts[i]);
        detailedProducts.push(detailed);
      } catch (e) {
        detailedProducts.push(allProducts[i]);
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    console.log('\n  Details fetched.');

    // Save to file
    const outputPath = path.join(outputDir, `${categorySlug}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(detailedProducts, null, 2));
    console.log(`  Saved to ${outputPath}`);
    return detailedProducts;
  } else {
    // Save basic data only
    const outputPath = path.join(outputDir, `${categorySlug}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2));
    console.log(`  Saved to ${outputPath}`);
    return allProducts;
  }
}

async function main() {
  const outputDir = path.join(process.cwd(), 'data', 'products');
  fs.mkdirSync(outputDir, { recursive: true });

  const categoryArg = process.argv[2];
  const quickMode = process.argv.includes('--quick');

  if (categoryArg && categoryArg !== '--all') {
    // Scrape specific category
    await scrapeCategory(categoryArg, outputDir, quickMode);
  } else if (categoryArg === '--all') {
    // Scrape all categories
    const allProducts: Product[] = [];
    for (const category of CATEGORIES) {
      const products = await scrapeCategory(category.slug, outputDir, quickMode);
      allProducts.push(...products);
    }

    // Save combined file
    fs.writeFileSync(
      path.join(outputDir, 'all-products.json'),
      JSON.stringify(allProducts, null, 2)
    );
    console.log(`\nTotal: ${allProducts.length} products saved to all-products.json`);
  } else {
    // Save categories and show usage
    fs.writeFileSync(
      path.join(outputDir, '../categories.json'),
      JSON.stringify(CATEGORIES, null, 2)
    );
    console.log('Categories:');
    CATEGORIES.forEach(c => console.log(`  - ${c.slug}`));
    console.log('\nUsage:');
    console.log('  npx tsx scripts/scraper.ts <category-slug>  # Scrape one category');
    console.log('  npx tsx scripts/scraper.ts --all            # Scrape all categories');
    console.log('  npx tsx scripts/scraper.ts --all --quick    # Quick mode (no details)');
  }
}

main().catch(console.error);
