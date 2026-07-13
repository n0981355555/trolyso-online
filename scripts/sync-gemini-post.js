import fs from 'fs';

// 1. Update src/pages/blog/index.astro
const blogIndexPath = 'c:/Users/JUNE/Desktop/trolyso-online/src/pages/blog/index.astro';
let blogContent = fs.readFileSync(blogIndexPath, 'utf8');

const postsInsertIdx = blogContent.indexOf('/* DYNAMIC_POSTS_START */');
if (postsInsertIdx === -1) {
  throw new Error("Could not find dynamic posts start in blog index");
}

const newPostString = `
  {
    title: "Các Lệnh Hệ Thống Mặc Định Của Gemeni AI: Hướng Dẫn Chi Tiết A-Z",
    description: "Khám phá toàn bộ các lệnh hệ thống mặc định của gemeni AI như @YouTube, @Gmail, @Google Drive. Hướng dẫn cách dùng chi tiết giúp tối ưu hiệu suất công việc.",
    slug: "cac-lenh-he-thong-mac-dinh-gemini-ai",
    category: "Công nghệ",
    date: "13/07/2026",
    readTime: "12 phút",
    badge: "Mới"
  },`;

const insertPosition = postsInsertIdx + '/* DYNAMIC_POSTS_START */'.length;
blogContent = blogContent.slice(0, insertPosition) + newPostString + blogContent.slice(insertPosition);
fs.writeFileSync(blogIndexPath, blogContent, 'utf8');
console.log("Updated blog/index.astro with new Gemini AI commands post!");

// 2. Prepend search items to public/search-index.json
const searchIndexPath = 'c:/Users/JUNE/Desktop/trolyso-online/public/search-index.json';
let searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));

const newSearchItems = [
  {
    "title": "Bài viết: Các Lệnh Hệ Thống Mặc Định Của Gemeni AI: Hướng Dẫn Chi Tiết A-Z",
    "desc": "Khám phá toàn bộ các lệnh hệ thống mặc định của gemeni AI như @YouTube, @Gmail, @Google Drive. Hướng dẫn cách dùng chi tiết giúp tối ưu hiệu suất công việc.",
    "url": "/blog/cac-lenh-he-thong-mac-dinh-gemini-ai/"
  }
];

searchIndex = [...newSearchItems, ...searchIndex];
fs.writeFileSync(searchIndexPath, JSON.stringify(searchIndex, null, 2), 'utf8');
console.log("Updated search-index.json!");

// 3. Update public/sitemap.xml
const sitemapPath = 'c:/Users/JUNE/Desktop/trolyso-online/public/sitemap.xml';
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

const sitemapInsertIdx = sitemapContent.indexOf('  <!-- Homepage -->');
if (sitemapInsertIdx === -1) {
  throw new Error("Could not find sitemap body start");
}

const newSitemapUrls = `  <url>
    <loc>https://trolyso.online/blog/cac-lenh-he-thong-mac-dinh-gemini-ai/</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

sitemapContent = sitemapContent.slice(0, sitemapInsertIdx) + newSitemapUrls + sitemapContent.slice(sitemapInsertIdx);
fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
console.log("Updated sitemap.xml!");
