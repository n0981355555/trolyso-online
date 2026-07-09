import fs from 'fs';
import path from 'path';

const searchIndexPath = path.resolve('public/search-index.json');
const indexData = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));

const targetUrl = '/blog/tao-chu-ky-email-chuyen-nghiep/';
const exists = indexData.some(item => item.url === targetUrl);

if (!exists) {
  const searchRecord = {
    title: "Bài viết: Bật Mí Cách Tạo Chữ Ký Email Chuyên Nghiệp Chuẩn 2026: Nâng Tầm Thương Hiệu Cá Nhân Trong 5 Phút",
    desc: "Khám phá cách tạo chữ ký email chuyên nghiệp giúp nâng tầm thương hiệu cá nhân. Hướng dẫn thiết kế chữ ký email bằng HTML code free và công cụ kéo thả nhanh.",
    url: targetUrl
  };
  indexData.unshift(searchRecord);
  fs.writeFileSync(searchIndexPath, JSON.stringify(indexData, null, 2), 'utf8');
  console.log("✅ search-index.json updated with new blog post!");
} else {
  console.log("ℹ️ search-index.json already contains this URL, skipping.");
}
