import fs from 'fs';
import path from 'path';

// 1. Update src/pages/blog/index.astro
const blogIndexPath = 'c:/Users/JUNE/Desktop/trolyso-online/src/pages/blog/index.astro';
let blogContent = fs.readFileSync(blogIndexPath, 'utf8');

const postsInsertIdx = blogContent.indexOf('/* DYNAMIC_POSTS_START */');
if (postsInsertIdx === -1) {
  throw new Error("Could not find dynamic posts start in blog index");
}

const newPostsString = `
  {
    title: "Cách Tính Chế Độ Thai Sản Cho Cả Bố Và Mẹ Chuẩn Luật Mới Nhất",
    description: "Hướng dẫn chi tiết cách tính chế độ thai sản tự động dành cho cả bố và mẹ theo quy định mới của Luật Bảo hiểm xã hội. Chi tiết tiền nghỉ phép, tiền trợ cấp thai sản và trợ cấp một lần.",
    slug: "cach-tinh-che-do-thai-san-cho-bo-me",
    category: "Bảo hiểm",
    date: "13/07/2026",
    readTime: "12 phút",
    badge: "Mới"
  },
  {
    title: "Cách Tính Điểm Hòa Vốn Trong Kinh Doanh Ăn Uống, Cafe Cho Người Mới",
    description: "Hướng dẫn chi tiết cách tính điểm hòa vốn (Break-even Point) trong kinh doanh nhà hàng, quán ăn, quán cafe từ A-Z. Công thức định phí, biến phí và ví dụ số cụ thể.",
    slug: "cach-tinh-diem-hoa-von-kinh-doanh-an-uong",
    category: "Kế toán",
    date: "13/07/2026",
    readTime: "12 phút",
    badge: "Mới"
  },
  {
    title: "Giải Thích Biểu Thức Chính Quy (Regex) Bằng Tiếng Việt Dễ Hiểu Nhất",
    description: "Regex là gì? Hướng dẫn học biểu thức chính quy (Regular Expression) từ cơ bản đến nâng cao. Bảng tra cứu ký tự Regex thông dụng và ví dụ dễ hiểu.",
    slug: "giai-thich-bieu-thuc-chinh-quy-regex-tieng-viet",
    category: "Công nghệ",
    date: "13/07/2026",
    readTime: "10 phút",
    badge: "Mới"
  },`;

const insertPosition = postsInsertIdx + '/* DYNAMIC_POSTS_START */'.length;
blogContent = blogContent.slice(0, insertPosition) + newPostsString + blogContent.slice(insertPosition);
fs.writeFileSync(blogIndexPath, blogContent, 'utf8');
console.log("Updated blog/index.astro with 3 new posts!");

// 2. Prepend search items to public/search-index.json
const searchIndexPath = 'c:/Users/JUNE/Desktop/trolyso-online/public/search-index.json';
let searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));

const newSearchItems = [
  {
    "title": "Công cụ: Tính Chế Độ Thai Sản Cho Bố & Mẹ",
    "desc": "Tính tự động thời gian nghỉ phép thai sản và số tiền trợ cấp một lần, hàng tháng cho cả bố và mẹ theo BHXH Việt Nam.",
    "url": "/calculators/tinh-che-do-thai-san/"
  },
  {
    "title": "Công cụ: Tính Điểm Hòa Vốn Kinh Doanh (BEP)",
    "desc": "Tính tự động sản lượng hòa vốn, doanh số hòa vốn và mục tiêu lợi nhuận cho các chủ quán ăn, nhà hàng, cafe, shop bán lẻ.",
    "url": "/calculators/tinh-diem-hoa-von/"
  },
  {
    "title": "Công cụ: Regex Explainer Giải Thích Tiếng Việt",
    "desc": "Giải thích chi tiết biểu thức chính quy (Regex) và kiểm tra so khớp chuỗi văn bản trực tiếp theo thời gian thực dành cho lập trình viên.",
    "url": "/calculators/regex-explainer/"
  },
  {
    "title": "Bài viết: Cách Tính Chế Độ Thai Sản Cho Cả Bố Và Mẹ Chuẩn Luật Mới Nhất",
    "desc": "Hướng dẫn chi tiết cách tính chế độ thai sản tự động dành cho cả bố và mẹ theo quy định mới của Luật Bảo hiểm xã hội. Chi tiết tiền nghỉ phép, tiền trợ cấp thai sản và trợ cấp một lần.",
    "url": "/blog/cach-tinh-che-do-thai-san-cho-bo-me/"
  },
  {
    "title": "Bài viết: Cách Tính Điểm Hòa Vốn Trong Kinh Doanh Ăn Uống, Cafe Cho Người Mới",
    "desc": "Hướng dẫn chi tiết cách tính điểm hòa vốn (Break-even Point) trong kinh doanh nhà hàng, quán ăn, quán cafe từ A-Z. Công thức định phí, biến phí và ví dụ số cụ thể.",
    "url": "/blog/cach-tinh-diem-hoa-von-kinh-doanh-an-uong/"
  },
  {
    "title": "Bài viết: Giải Thích Biểu Thức Chính Quy (Regex) Bằng Tiếng Việt Dễ Hiểu Nhất",
    "desc": "Regex là gì? Hướng dẫn học biểu thức chính quy (Regular Expression) từ cơ bản đến nâng cao. Bảng tra cứu ký tự Regex thông dụng và ví dụ dễ hiểu.",
    "url": "/blog/giai-thich-bieu-thuc-chinh-quy-regex-tieng-viet/"
  }
];

searchIndex = [...newSearchItems, ...searchIndex];
fs.writeFileSync(searchIndexPath, JSON.stringify(searchIndex, null, 2), 'utf8');
console.log("Updated search-index.json with 6 new items!");

// 3. Update public/sitemap.xml
const sitemapPath = 'c:/Users/JUNE/Desktop/trolyso-online/public/sitemap.xml';
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

const sitemapInsertIdx = sitemapContent.indexOf('  <!-- Homepage -->');
if (sitemapInsertIdx === -1) {
  throw new Error("Could not find sitemap body start");
}

const newSitemapUrls = `  <!-- New Calculators & Blog Posts 2026 -->
  <url>
    <loc>https://trolyso.online/calculators/tinh-che-do-thai-san/</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://trolyso.online/calculators/tinh-diem-hoa-von/</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://trolyso.online/calculators/regex-explainer/</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://trolyso.online/blog/cach-tinh-che-do-thai-san-cho-bo-me/</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://trolyso.online/blog/cach-tinh-diem-hoa-von-kinh-doanh-an-uong/</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://trolyso.online/blog/giai-thich-bieu-thuc-chinh-quy-regex-tieng-viet/</loc>
    <lastmod>2026-07-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

sitemapContent = sitemapContent.slice(0, sitemapInsertIdx) + newSitemapUrls + sitemapContent.slice(sitemapInsertIdx);
fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
console.log("Updated sitemap.xml with 6 new URLs!");
