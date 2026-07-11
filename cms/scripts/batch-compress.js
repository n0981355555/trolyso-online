import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const artifactsDir = 'C:/Users/JUNE/.gemini/antigravity/brain/ad0570cf-81c1-44a7-b333-3c950f30553f';
const outputDir = path.resolve('../public/images/blog');

const mappings = [
  { prefix: 'tien_luong_ngay_phep_hero', outName: 'tien-luong-ngay-phep-hero.webp' },
  { prefix: 'tien_luong_ngay_phep_law', outName: 'tien-luong-ngay-phep-law.webp' },
  { prefix: 'tien_luong_ngay_phep_calc', outName: 'tien-luong-ngay-phep-calc.webp' },
  { prefix: 'tien_luong_ngay_phep_hr', outName: 'tien-luong-ngay-phep-hr.webp' },
  { prefix: 'tien_luong_ngay_phep_sign', outName: 'tien-luong-ngay-phep-sign.webp' },
  { prefix: 'so_sanh_thue_tncn_vat_hero', outName: 'so-sanh-thue-tncn-vat-hero.webp' },
  { prefix: 'so_sanh_thue_tncn_vat_direct', outName: 'so-sanh-thue-tncn-vat-direct.webp' },
  { prefix: 'so_sanh_thue_tncn_vat_indirect', outName: 'so-sanh-thue-tncn-vat-indirect.webp' },
  { prefix: 'so_sanh_thue_tncn_vat_table', outName: 'so-sanh-thue-tncn-vat-table.webp' },
  { prefix: 'so_sanh_thue_tncn_vat_refund', outName: 'so-sanh-thue-tncn-vat-refund.webp' },
  { prefix: 'tinh_lai_suat_hero', outName: 'tinh-lai-suat-hero.webp' },
  { prefix: 'tinh_thue_vat_hero', outName: 'tinh-thue-vat-hero.webp' },
  { prefix: 'dem_ky_tu_online_hero', outName: 'dem-ky-tu-online-hero.webp' }
];

async function run() {
  console.log('🏁 Starting batch compression of generated images...');
  
  if (!fs.existsSync(artifactsDir)) {
    console.error('❌ Artifacts directory does not exist');
    return;
  }

  const files = fs.readdirSync(artifactsDir);
  let count = 0;

  for (const mapping of mappings) {
    // Find the latest generated file for this prefix
    const matchingFiles = files.filter(f => f.startsWith(mapping.prefix) && f.endsWith('.jpg'));
    if (matchingFiles.length === 0) {
      console.warn(`⚠️ No file found for prefix: ${mapping.prefix}`);
      continue;
    }

    // Sort by name or date, pick the first (usually there's only one)
    const latestFile = matchingFiles.sort().reverse()[0];
    const srcPath = path.join(artifactsDir, latestFile);
    const destPath = path.join(outputDir, mapping.outName);

    console.log(`🔄 Compressing ${latestFile} ➔ ${mapping.outName}...`);
    
    try {
      await sharp(srcPath)
        .webp({ quality: 80 })
        .toFile(destPath);
      console.log(`✅ Success!`);
      count++;
    } catch (err) {
      console.error(`❌ Failed to compress ${latestFile}:`, err.message);
    }
  }

  console.log(`🎉 Batch compression complete! Successfully compressed ${count} images.`);
}

run();
