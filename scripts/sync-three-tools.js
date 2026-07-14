import fs from 'fs';

// 1. Update src/pages/blog/index.astro - Add the 3 blog posts at the top of posts array
const blogIndexPath = 'c:/Users/JUNE/Desktop/trolyso-online/src/pages/blog/index.astro';
let blogContent = fs.readFileSync(blogIndexPath, 'utf8');

const postsInsertIdx = blogContent.indexOf('/* DYNAMIC_POSTS_START */');
if (postsInsertIdx === -1) {
  throw new Error("Could not find dynamic posts start in blog index");
}

const newPostsString = `
  {
    title: "Cách Tính Lương Net Sang Gross Chuẩn Xác Nhất 2026",
    description: "Hướng dẫn cách tính lương Net sang Gross chuẩn nhất năm 2026. Giải thích chi tiết bảo hiểm, giảm trừ gia cảnh và cách đàm phán lương hiệu quả.",
    slug: "cach-tinh-luong-net-sang-gross",
    category: "Bảo hiểm & Lương",
    date: "14/07/2026",
    readTime: "8 phút",
    badge: "Mới"
  },
  {
    title: "Cách Cắt File PDF Và Tách Trang PDF Online Miễn Phí Không Lỗi Trang",
    description: "Hướng dẫn chi tiết cách cắt file PDF, trích xuất trang PDF bất kỳ trực tuyến nhanh chóng và an toàn tuyệt đối ngay tại trình duyệt của bạn.",
    slug: "huong-dan-cat-file-pdf-va-tach-trang-pdf-online",
    category: "Văn phòng & PDF",
    date: "14/07/2026",
    readTime: "7 phút",
    badge: "Mới"
  },
  {
    title: "Cách Tạo Số Ngẫu Nhiên Và Quay Số May Mắn Online Công Bằng Tuyệt Đối",
    description: "Hướng dẫn cách tạo số ngẫu nhiên và quay số may mắn trực tuyến nhanh chóng, công bằng tuyệt đối phục vụ bốc thăm trúng thưởng.",
    slug: "huong-dan-quay-so-may-man-va-tao-so-ngau-nhien-online",
    category: "Tiện ích & Học tập",
    date: "14/07/2026",
    readTime: "6 phút",
    badge: "Mới"
  },`;

const insertPosition = postsInsertIdx + '/* DYNAMIC_POSTS_START */'.length;
blogContent = blogContent.slice(0, insertPosition) + newPostsString + blogContent.slice(insertPosition);
fs.writeFileSync(blogIndexPath, blogContent, 'utf8');
console.log("Updated blog/index.astro with 3 new blog posts!");

// 2. Prepend search items to public/search-index.json
const searchIndexPath = 'c:/Users/JUNE/Desktop/trolyso-online/public/search-index.json';
let searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));

const newSearchItems = [
  {
    "title": "Bài viết: Cách Tính Lương Net Sang Gross Chuẩn Xác Nhất 2026",
    "desc": "Hướng dẫn cách tính lương Net sang Gross chuẩn nhất năm 2026. Giải thích chi tiết bảo hiểm, giảm trừ gia cảnh và cách đàm phán lương hiệu quả.",
    "url": "/blog/cach-tinh-luong-net-sang-gross/"
  },
  {
    "title": "Bài viết: Cách Cắt File PDF Và Tách Trang PDF Online Miễn Phí Không Lỗi Trang",
    "desc": "Hướng dẫn chi tiết cách cắt file PDF, trích xuất trang PDF bất kỳ trực tuyến nhanh chóng và an toàn tuyệt đối ngay tại trình duyệt của bạn.",
    "url": "/blog/huong-dan-cat-file-pdf-va-tach-trang-pdf-online/"
  },
  {
    "title": "Bài viết: Cách Tạo Số Ngẫu Nhiên Và Quay Số May Mắn Online Công Bằng Tuyệt Đối",
    "desc": "Hướng dẫn cách tạo số ngẫu nhiên và quay số may mắn trực tuyến nhanh chóng, công bằng tuyệt đối phục vụ bốc thăm trúng thưởng.",
    "url": "/blog/huong-dan-quay-so-may-man-va-tao-so-ngau-nhien-online/"
  },
  {
    "title": "Công cụ: Tính Lương Net Sang Gross",
    "desc": "Quy đổi thu nhập thực nhận (Net) sang Gross trước thuế và bảo hiểm bắt buộc theo luật lao động mới nhất.",
    "url": "/calculators/tinh-luong-net-sang-gross/"
  },
  {
    "title": "Công cụ: Cắt & Tách File PDF",
    "desc": "Tách lấy các trang tài liệu bất kỳ từ tệp tin PDF lớn hoàn toàn miễn phí, nhanh chóng và bảo mật.",
    "url": "/calculators/cat-pdf/"
  },
  {
    "title": "Công cụ: Tạo Số Ngẫu Nhiên & Quay Số May Mắn",
    "desc": "Quay số may mắn bốc thăm trúng thưởng, sinh số ngẫu nhiên trong khoảng tùy chỉnh nhanh chóng.",
    "url": "/calculators/tao-so-ngau-nhien/"
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
    <loc>https://trolyso.online/blog/cach-tinh-luong-net-sang-gross/</loc>
    <lastmod>2026-07-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://trolyso.online/blog/huong-dan-cat-file-pdf-va-tach-trang-pdf-online/</loc>
    <lastmod>2026-07-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://trolyso.online/blog/huong-dan-quay-so-may-man-va-tao-so-ngau-nhien-online/</loc>
    <lastmod>2026-07-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://trolyso.online/calculators/tinh-luong-net-sang-gross/</loc>
    <lastmod>2026-07-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://trolyso.online/calculators/cat-pdf/</loc>
    <lastmod>2026-07-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://trolyso.online/calculators/tao-so-ngau-nhien/</loc>
    <lastmod>2026-07-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`;

sitemapContent = sitemapContent.slice(0, sitemapInsertIdx) + newSitemapUrls + sitemapContent.slice(sitemapInsertIdx);
fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
console.log("Updated sitemap.xml!");

// 4. Update src/pages/index.astro - Insert the 3 new tools cards before the calculators-grid closing tag
const indexPath = 'c:/Users/JUNE/Desktop/trolyso-online/src/pages/index.astro';
let indexContent = fs.readFileSync(indexPath, 'utf8');

const targetEndTag = `          </a>
      </div>

      <!-- View More Button -->`;

const endTagIdx = indexContent.indexOf(targetEndTag);
if (endTagIdx === -1) {
  throw new Error("Could not find the target end tag for calculators-grid");
}

const newCardsString = `          </a>

          <!-- 29. Tính Lương Net Sang Gross Card -->
          <a href="/calculators/tinh-luong-net-sang-gross/" data-category="insurance" class="group p-6 bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-500 flex items-center justify-center font-bold mb-4">
                🔄
              </div>
              <h4 class="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-blue dark:group-hover:text-brand-mint transition mb-2">
                Tính Lương Net Sang Gross
              </h4>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Quy đổi thu nhập thực nhận (Net) sang Gross trước thuế và bảo hiểm bắt buộc theo luật lao động mới nhất.
              </p>
            </div>
            <div class="text-xs text-brand-blue dark:text-brand-mint font-bold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              Mở công cụ <span>→</span>
            </div>
          </a>

          <!-- 30. Cắt & Tách File PDF Card -->
          <a href="/calculators/cat-pdf/" data-category="office" class="group p-6 bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950 text-red-500 flex items-center justify-center font-bold mb-4">
                ✂️
              </div>
              <h4 class="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-blue dark:group-hover:text-brand-mint transition mb-2">
                Cắt & Tách File PDF
              </h4>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Tách lấy các trang tài liệu bất kỳ từ tệp tin PDF lớn hoàn toàn miễn phí, nhanh chóng và bảo mật.
              </p>
            </div>
            <div class="text-xs text-brand-blue dark:text-brand-mint font-bold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              Mở công cụ <span>→</span>
            </div>
          </a>

          <!-- 31. Tạo Số Ngẫu Nhiên Card -->
          <a href="/calculators/tao-so-ngau-nhien/" data-category="utility" class="group p-6 bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center font-bold mb-4">
                🎲
              </div>
              <h4 class="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-blue dark:group-hover:text-brand-mint transition mb-2">
                Tạo Số Ngẫu Nhiên
              </h4>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Quay số may mắn bốc thăm trúng thưởng, sinh số ngẫu nhiên trong khoảng tùy chỉnh nhanh chóng.
              </p>
            </div>
            <div class="text-xs text-brand-blue dark:text-brand-mint font-bold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              Mở công cụ <span>→</span>
            </div>
          </a>`;

indexContent = indexContent.slice(0, endTagIdx) + newCardsString + indexContent.slice(endTagIdx + '          </a>'.length);
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log("Updated index.astro homepage with 3 new cards!");
