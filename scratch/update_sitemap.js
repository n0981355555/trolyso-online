import fs from 'fs';
import { getSlug } from '../src/utils/slugify.js';

console.log('📡 Đang cập nhật sơ đồ trang web sitemap.xml...');

async function updateSitemap() {
  try {
    const rawData = fs.readFileSync('src/data/regions.json', 'utf8');
    const rawRegions = JSON.parse(rawData);
    
    const mappedRegions = [
      { name: "Thành phố Hà Nội", slug: "ha-noi", codes: [1] },
      { name: "Tỉnh Bắc Ninh", slug: "bac-ninh", codes: [24, 27] },
      { name: "Tỉnh Quảng Ninh", slug: "quang-ninh", codes: [22] },
      { name: "Thành phố Hải Phòng", slug: "hai-phong", codes: [2, 30] }
    ];
    
    // Đọc sitemap.xml hiện tại
    let sitemapContent = fs.readFileSync('public/sitemap.xml', 'utf8');
    
    // Cắt bỏ phần đóng </urlset> để chèn thêm
    const closeTag = '</urlset>';
    const insertIndex = sitemapContent.indexOf(closeTag);
    if (insertIndex === -1) {
      throw new Error('Không tìm thấy thẻ đóng </urlset> trong sitemap.xml');
    }
    
    // Chỉ giữ phần nội dung trước </urlset>
    let baseSitemap = sitemapContent.substring(0, insertIndex);
    
    // Danh sách URL mới cần chèn
    let newUrls = '';
    const today = new Date().toISOString().split('T')[0];
    
    // 1. Thêm trang chủ Lịch Cắt Điện
    newUrls += `  <url>\n    <loc>https://trolyso.online/calculators/lich-cat-dien/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    
    // 2. Thêm toàn bộ các trang cấp Xã/Phường
    mappedRegions.forEach(target => {
      const matchingRaw = rawRegions.filter(r => target.codes.includes(r.code));
      const wards = [];
      
      matchingRaw.forEach(prov => {
        prov.districts.forEach(dist => {
          dist.wards.forEach(w => {
            wards.push({
              name: w.name,
              rawSlug: getSlug(w.name),
              districtName: dist.name
            });
          });
        });
      });
      
      // Xử lý trùng lặp slug
      const slugCounts = {};
      wards.forEach(w => {
        slugCounts[w.rawSlug] = (slugCounts[w.rawSlug] || 0) + 1;
      });
      
      wards.forEach(w => {
        const finalSlug = slugCounts[w.rawSlug] > 1 
          ? `${w.rawSlug}-${getSlug(w.districtName)}` 
          : w.rawSlug;
          
        newUrls += `  <url>\n    <loc>https://trolyso.online/calculators/lich-cat-dien/${target.slug}/${finalSlug}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      });
    });
    
    // Ghi đè lại file sitemap.xml
    const finalContent = baseSitemap + newUrls + closeTag + '\n';
    fs.writeFileSync('public/sitemap.xml', finalContent, 'utf8');
    
    console.log('✅ Thành công! Đã chèn lịch cúp điện 1,413 Phường/Xã vào public/sitemap.xml');
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật sitemap:', error);
  }
}

updateSitemap();
