import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
const publicDir = path.resolve(__dirname, '../public');
const distDir = path.resolve(__dirname, '../dist');

async function splitSitemaps() {
  if (!fs.existsSync(sitemapPath)) {
    console.error(`Sitemap not found at: ${sitemapPath}`);
    return;
  }

  console.log(' Reading public/sitemap.xml...');
  const content = fs.readFileSync(sitemapPath, 'utf8');

  // Match all <url>...</url> blocks
  const urlRegex = /<url>[\s\S]*?<\/url>/g;
  const urls = content.match(urlRegex) || [];
  console.log(`Found ${urls.length} total URLs in sitemap.`);

  const mainUrls = [];
  const blogUrls = [];
  const outageUrls = [];

  const locRegex = /<loc>([^<]+)<\/loc>/;

  for (const urlBlock of urls) {
    const locMatch = urlBlock.match(locRegex);
    if (!locMatch) continue;

    const loc = locMatch[1].trim();
    try {
      const urlObj = new URL(loc);
      const pathname = urlObj.pathname;

      if (pathname.startsWith('/blog/')) {
        blogUrls.push(urlBlock);
      } else if (
        pathname.startsWith('/calculators/lich-cat-dien/') &&
        pathname !== '/calculators/lich-cat-dien/' &&
        pathname !== '/calculators/lich-cat-dien'
      ) {
        outageUrls.push(urlBlock);
      } else {
        mainUrls.push(urlBlock);
      }
    } catch (e) {
      // Fallback if URL parsing fails
      if (loc.includes('/blog/')) {
        blogUrls.push(urlBlock);
      } else if (loc.includes('/calculators/lich-cat-dien/') && !loc.endsWith('/calculators/lich-cat-dien/') && !loc.endsWith('/calculators/lich-cat-dien')) {
        outageUrls.push(urlBlock);
      } else {
        mainUrls.push(urlBlock);
      }
    }
  }

  console.log(`Categorized:`);
  console.log(` - Main/Calculators: ${mainUrls.length} URLs`);
  console.log(` - Blog: ${blogUrls.length} URLs`);
  console.log(` - Power Outages (Lich Cat Dien): ${outageUrls.length} URLs`);

  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const xmlFooter = '\n</urlset>';

  const sitemapMainContent = xmlHeader + mainUrls.join('\n') + xmlFooter;
  const sitemapBlogContent = xmlHeader + blogUrls.join('\n') + xmlFooter;
  const sitemapOutageContent = xmlHeader + outageUrls.join('\n') + xmlFooter;

  const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://trolyso.online/sitemap-main.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://trolyso.online/sitemap-blog.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://trolyso.online/sitemap-lich-cat-dien.xml</loc>
  </sitemap>
</sitemapindex>`;

  // Write to dist folder if it exists (post-build sync)
  if (fs.existsSync(distDir)) {
    console.log('dist/ folder detected. Syncing split sitemaps to dist/...');
    fs.writeFileSync(path.join(distDir, 'sitemap-main.xml'), sitemapMainContent, 'utf8');
    fs.writeFileSync(path.join(distDir, 'sitemap-blog.xml'), sitemapBlogContent, 'utf8');
    fs.writeFileSync(path.join(distDir, 'sitemap-lich-cat-dien.xml'), sitemapOutageContent, 'utf8');
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapIndexContent, 'utf8');
    console.log('Successfully synced split sitemaps to dist/');
  } else {
    console.warn('dist/ folder not found. Sitemaps were not written.');
  }
}

splitSitemaps().catch(console.error);
