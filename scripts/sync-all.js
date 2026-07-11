import fs from 'fs';
import path from 'path';

const blogIndexFile = path.resolve('src/pages/blog/index.astro');
const sitemapFile = path.resolve('public/sitemap.xml');
const searchIndexFile = path.resolve('public/search-index.json');

const today = new Date().toISOString().split('T')[0];

const newBlogPosts = [
  {
    title: "Thuế TNCN Khác Thuế VAT Như Thế Nào? So Sánh & Phân Biệt Chi Tiết",
    description: "Phân biệt thuế TNCN và thuế VAT chi tiết từ A-Z. Tìm hiểu bản chất thuế trực thu và gián thu, đối tượng chịu thuế và cơ chế khấu trừ chi tiết.",
    slug: "thue-tncn-khac-thue-vat-nhu-the-nao",
    category: "Cẩm nang",
    date: "11/07/2026",
    readTime: "12 phút",
    badge: "Mới"
  },
  {
    title: "Cách Tính Tiền Lương Ngày Phép Chưa Nghỉ Chuẩn Luật Lao Động 2026",
    description: "Hướng dẫn chi tiết cách tính tiền lương ngày phép chưa nghỉ hết theo quy định mới nhất của Bộ luật Lao động. Công thức tính và ví dụ cụ thể cho nhân sự.",
    slug: "cach-tinh-tien-luong-ngay-phep-chua-nghi",
    category: "Cẩm nang",
    date: "11/07/2026",
    readTime: "12 phút",
    badge: "Mới"
  },
  {
    title: "Công Cụ Đếm Ký Tự Online: Cách Đếm Từ & Đoạn Văn Bản Miễn Phí 2026",
    description: "Công cụ đếm ký tự online miễn phí và đếm số từ văn bản theo thời gian thực. Hướng dẫn cách đếm số từ chuẩn xác nhất cho copywriter và viết bài chuẩn SEO.",
    slug: "cong-cu-dem-ky-tu-online-mien-phi",
    category: "Cẩm nang",
    date: "11/07/2026",
    readTime: "5 phút",
    badge: "Mới"
  },
  {
    title: "Thuế VAT Là Gì? Hướng Dẫn Cách Tính Thuế Giá Trị Gia Tăng Online Từ A-Z",
    description: "Tìm hiểu thuế VAT là gì và cách tính thuế giá trị gia tăng (VAT) online 8% và 10% chính xác nhất theo 2 chiều tính xuôi và tính ngược chi tiết.",
    slug: "cach-tinh-thue-gia-tri-gia-tang-vat",
    category: "Cẩm nang",
    date: "11/07/2026",
    readTime: "6 phút",
    badge: "Mới"
  },
  {
    title: "Cách Tính Lãi Suất Vay Ngân Hàng & Gửi Tiết Kiệm Online Chuẩn Nhất 2026",
    description: "Hướng dẫn chi tiết cách tính lãi suất vay ngân hàng trả góp (dư nợ giảm dần/lũy tiến) và gửi tiết kiệm online. Công thức và ví dụ cụ thể dễ hiểu.",
    slug: "cach-tinh-lai-suat-vay-tiet-kiem",
    category: "Cẩm nang",
    date: "11/07/2026",
    readTime: "6 phút",
    badge: "Mới"
  }
];

const newTools = [
  {
    title: "Công cụ: Tính Lãi Suất Vay Trả Góp & Gửi Tiết Kiệm",
    desc: "Tính toán lịch trả nợ vay hàng tháng hoặc tính tiền lãi gửi tiết kiệm ngân hàng chính xác của các ngân hàng lớn.",
    url: "/calculators/tinh-lai-suat/"
  },
  {
    title: "Công cụ: Tính Thuế VAT Online",
    desc: "Tính nhanh số tiền thuế VAT 8% hoặc 10% xuôi và ngược chính xác phục vụ cho kế toán và hóa đơn.",
    url: "/calculators/tinh-thue-vat/"
  },
  {
    title: "Công cụ: Đếm Ký Tự & Đếm Từ Online",
    desc: "Dán hoặc viết văn bản trực tiếp để đếm số ký tự, từ, dòng và câu theo thời gian thực mượt mà.",
    url: "/calculators/dem-ky-tu-online/"
  }
];

function syncBlogIndex() {
  console.log('🔄 Syncing blog index...');
  let content = fs.readFileSync(blogIndexFile, 'utf8');
  const marker = '/* DYNAMIC_POSTS_START */';
  const insertIndex = content.indexOf(marker);

  if (insertIndex === -1) {
    console.error('❌ Could not find DYNAMIC_POSTS_START in blog index');
    return;
  }

  let postsString = '';
  for (const post of newBlogPosts) {
    if (!content.includes(`slug: "${post.slug}"`)) {
      postsString += `  {\n    title: "${post.title}",\n    description: "${post.description}",\n    slug: "${post.slug}",\n    category: "${post.category}",\n    date: "${post.date}",\n    readTime: "${post.readTime}",\n    badge: "${post.badge}"\n  },\n\n`;
    }
  }

  if (postsString) {
    const before = content.slice(0, insertIndex + marker.length);
    const after = content.slice(insertIndex + marker.length);
    content = before + '\n' + postsString + after;
    fs.writeFileSync(blogIndexFile, content, 'utf8');
    console.log('✅ Blog index synced successfully.');
  } else {
    console.log('ℹ️ Blog index already up to date.');
  }
}

function syncSitemap() {
  console.log('🔄 Syncing sitemap...');
  let content = fs.readFileSync(sitemapFile, 'utf8');
  const marker = '<!-- DYNAMIC_POSTS_START -->';
  const insertIndex = content.indexOf(marker);

  if (insertIndex === -1) {
    console.error('❌ Could not find DYNAMIC_POSTS_START in sitemap');
    return;
  }

  let sitemapBlock = '';
  
  // Add tools
  for (const tool of newTools) {
    const fullUrl = `https://trolyso.online${tool.url}`;
    if (!content.includes(fullUrl)) {
      sitemapBlock += `  <url>\n    <loc>${fullUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    }
  }

  // Add blog posts
  for (const post of newBlogPosts) {
    const fullUrl = `https://trolyso.online/blog/${post.slug}/`;
    if (!content.includes(fullUrl)) {
      sitemapBlock += `  <url>\n    <loc>${fullUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }
  }

  if (sitemapBlock) {
    const before = content.slice(0, insertIndex + marker.length);
    const after = content.slice(insertIndex + marker.length);
    content = before + '\n' + sitemapBlock + after;
    fs.writeFileSync(sitemapFile, content, 'utf8');
    console.log('✅ Sitemap synced successfully.');
  } else {
    console.log('ℹ️ Sitemap already up to date.');
  }
}

function syncSearchIndex() {
  console.log('🔄 Syncing search index...');
  const indexData = JSON.parse(fs.readFileSync(searchIndexFile, 'utf8'));

  let updated = false;

  // Add tools
  for (const tool of newTools) {
    const exists = indexData.some(item => item.url === tool.url);
    if (!exists) {
      indexData.unshift({
        title: tool.title,
        desc: tool.desc,
        url: tool.url
      });
      updated = true;
    }
  }

  // Add blog posts
  for (const post of newBlogPosts) {
    const targetUrl = `/blog/${post.slug}/`;
    const exists = indexData.some(item => item.url === targetUrl);
    if (!exists) {
      indexData.unshift({
        title: `Bài viết: ${post.title}`,
        desc: post.description,
        url: targetUrl
      });
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync(searchIndexFile, JSON.stringify(indexData, null, 2), 'utf8');
    console.log('✅ Search index synced successfully.');
  } else {
    console.log('ℹ️ Search index already up to date.');
  }
}

syncBlogIndex();
syncSitemap();
syncSearchIndex();
console.log('🎉 All sync tasks completed!');
