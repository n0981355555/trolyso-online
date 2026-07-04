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
  // Second post (new)
  'may_tinh_tang_luong_sau_cai_cach_thue_hero': 'may-tinh-tang-luong-sau-cai-cach-thue-hero.webp',
  'may_tinh_tang_luong_sau_cai_cach_thue_bang_luong': 'may-tinh-tang-luong-sau-cai-cach-thue-bang-luong.webp',
  'may_tinh_tang_luong_sau_cai_cach_thue_tu_van': 'may-tinh-tang-luong-sau-cai-cach-thue-tu-van.webp'
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
      
      // Check if output already exists (to avoid duplicate processing unless we want to overwrite)
      console.log(`Converting ${fileMatch} to ${outputName}...`);
      
      await sharp(inputPath)
        .webp({ quality: 80, effort: 6 })
        .resize(800) // standard width for blog illustrations
        .toFile(outputPath);
        
      const stats = fs.statSync(outputPath);
      console.log(`Success! File size: ${(stats.size / 1024).toFixed(2)} KB`);
    } else {
      console.log(`Note: No file found matching prefix: ${prefix}`);
    }
  }
}

convert().catch(console.error);
