import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const brainDir = 'C:/Users/JUNE/.gemini/antigravity/brain/7294d901-e40f-4239-83a6-c0144bc9c4ac';
const publicDir = './public/images/blog';

const files = fs.readdirSync(brainDir);

const mapping = {
  // First post
  'toi_duoc_giam_bao_nhieu_thue_nam_2026_hero': 'toi-duoc-giam-bao-nhieu-thue-nam-2026-hero.webp',
  'toi_duoc_giam_bao_nhieu_thue_nam_2026_giam_tru': 'toi-duoc-giam-bao-nhieu-thue-nam-2026-giam-tru.webp',
  'toi_duoc_giam_bao_nhieu_thue_nam_2026_nhan_luc': 'toi-duoc-giam-bao-nhieu-thue-nam-2026-nhan-luc.webp',
  // Second post
  'may_tinh_tang_luong_sau_cai-cach-thue_hero': 'may-tinh-tang-luong-sau-cai-cach-thue-hero.webp',
  'may_tinh_tang_luong_sau_cai_cach_thue_bang_luong': 'may-tinh-tang-luong-sau-cai-cach-thue-bang-luong.webp',
  'may_tinh_tang_luong_sau_cai_cach_thue_tu_van': 'may-tinh-tang-luong-sau-cai-cach-thue-tu-van.webp',
  // Third post (new - 1200x630, strictly under 50KB)
  'may_tinh_luong_dong_thue_hero': 'may-tinh-luong-dong-thue-hero.webp',
  'may_tinh_luong_dong_thue_gia_canh': 'may-tinh-luong-dong-thue-gia-canh.webp',
  'may_tinh_luong_dong_thue_bieu_thue': 'may-tinh-luong-dong-thue-bieu-thue.webp',
  'may_tinh_luong_dong_thue_bao_hiem': 'may-tinh-luong-dong-thue-bao-hiem.webp',
  'may_tinh_luong_dong_thue_ho_so': 'may-tinh-luong-dong-thue-ho-so.webp',
  'may_tinh_luong_dong_thue_vi_du_1': 'may-tinh-luong-dong-thue-vi-du-1.webp',
  'may_tinh_luong_dong_thue_vi_du_2': 'may-tinh-luong-dong-thue-vi-du-2.webp',
  'may_tinh_luong_dong_thue_vi_du_3': 'may-tinh-luong-dong-thue-vi-du-3.webp',
  'may_tinh_luong_dong_thue_tu_van': 'may-tinh-luong-dong-thue-tu-van.webp'
};

async function convert() {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  for (const [prefix, outputName] of Object.entries(mapping)) {
    const fileMatch = files.find(f => f.startsWith(prefix) && f.endsWith('.jpg'));
    if (fileMatch) {
      const inputPath = path.join(brainDir, fileMatch);
      const outputPath = path.join(publicDir, outputName);
      
      const isThirdPost = prefix.startsWith('may_tinh_luong_dong_thue');
      
      if (isThirdPost) {
        // Tweak quality slightly lower to 45 to guarantee all are strictly <50KB
        await sharp(inputPath)
          .resize(1200, 630, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .webp({ quality: 45, effort: 6 }) 
          .toFile(outputPath);
      } else {
        await sharp(inputPath)
          .webp({ quality: 80, effort: 6 })
          .resize(800)
          .toFile(outputPath);
      }
        
      const stats = fs.statSync(outputPath);
      console.log(`Converted ${outputName}: ${(stats.size / 1024).toFixed(2)} KB`);
    }
  }
}

convert().catch(console.error);
