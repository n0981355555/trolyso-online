import fs from 'fs';

// 1. Update src/pages/blog/index.astro - Add the blog post at the top of posts array
const blogIndexPath = 'c:/Users/JUNE/Desktop/trolyso-online/src/pages/blog/index.astro';
let blogContent = fs.readFileSync(blogIndexPath, 'utf8');

const postsInsertIdx = blogContent.indexOf('/* DYNAMIC_POSTS_START */');
if (postsInsertIdx === -1) {
  throw new Error("Could not find dynamic posts start in blog index");
}

const newPostString = `
  {
    title: "Giải Mã Giấc Mơ: Ý Nghĩa Điềm Báo Và Con Số May Mắn Theo Sổ Mơ Toàn Tập",
    description: "Khám phá cẩm nang giải mã điềm báo giấc mơ chi tiết nhất. Lý giải cát hung theo tâm linh, tâm lý học và cách tra cứu con số tài lộc từ sổ mơ dân gian.",
    slug: "huong-dan-giai-ma-giac-mo-lo-de-may-man",
    category: "Tiện ích & Học tập",
    date: "15/07/2026",
    readTime: "7 phút",
    badge: "Mới"
  },`;

const insertPosition = postsInsertIdx + '/* DYNAMIC_POSTS_START */'.length;
blogContent = blogContent.slice(0, insertPosition) + newPostString + blogContent.slice(insertPosition);
fs.writeFileSync(blogIndexPath, blogContent, 'utf8');
console.log("Updated blog/index.astro!");

// 2. Prepend search items to public/search-index.json
const searchIndexPath = 'c:/Users/JUNE/Desktop/trolyso-online/public/search-index.json';
let searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));

const newSearchItems = [
  {
    "title": "Bài viết: Giải Mã Giấc Mơ: Ý Nghĩa Điềm Báo Và Con Số May Mắn Theo Sổ Mơ",
    "desc": "Khám phá cẩm nang giải mã điềm báo giấc mơ chi tiết nhất. Lý giải cát hung theo tâm linh, tâm lý học và cách tra cứu con số tài lộc từ sổ mơ dân gian.",
    "url": "/blog/huong-dan-giai-ma-giac-mo-lo-de-may-man/"
  },
  {
    "title": "Công cụ: Giải Mã Giấc Mơ Online & Tra Sổ Mơ",
    "desc": "Tra cứu điềm báo giấc mơ cát hung và tìm các con số may mắn tương ứng theo sổ mơ dân gian.",
    "url": "/calculators/giai-ma-giac-mo/"
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
    <loc>https://trolyso.online/blog/huong-dan-giai-ma-giac-mo-lo-de-may-man/</loc>
    <lastmod>2026-07-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://trolyso.online/calculators/giai-ma-giac-mo/</loc>
    <lastmod>2026-07-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`;

sitemapContent = sitemapContent.slice(0, sitemapInsertIdx) + newSitemapUrls + sitemapContent.slice(sitemapInsertIdx);
fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
console.log("Updated sitemap.xml!");

// 4. Update src/pages/index.astro - Insert the card before calculators-grid closing tag
const indexPath = 'c:/Users/JUNE/Desktop/trolyso-online/src/pages/index.astro';
let indexContent = fs.readFileSync(indexPath, 'utf8');

const targetEndTag = `          </a>
      </div>

      <!-- View More Button -->`;

const endTagIdx = indexContent.indexOf(targetEndTag);
if (endTagIdx === -1) {
  throw new Error("Could not find the target end tag for calculators-grid");
}

const newCardString = `          </a>

          <!-- 32. Giải Mã Giấc Mơ Card -->
          <a href="/calculators/giai-ma-giac-mo/" data-category="utility" class="group p-6 bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-500 flex items-center justify-center font-bold mb-4">
                🔮
              </div>
              <h4 class="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-blue dark:group-hover:text-brand-mint transition mb-2">
                Giải Mã Giấc Mơ
              </h4>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Tra cứu điềm báo giấc mơ cát hung và tìm các con số may mắn tương ứng theo sổ mơ dân gian.
              </p>
            </div>
            <div class="text-xs text-brand-blue dark:text-brand-mint font-bold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              Mở công cụ <span>→</span>
            </div>
          </a>`;

indexContent = indexContent.slice(0, endTagIdx) + newCardString + indexContent.slice(endTagIdx + '          </a>'.length);
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log("Updated index.astro!");
