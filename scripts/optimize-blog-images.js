import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const srcDir = 'C:/Users/JUNE/.gemini/antigravity/brain/ad0570cf-81c1-44a7-b333-3c950f30553f';
const destDir = 'c:/Users/JUNE/Desktop/trolyso-online/public/images/blog';

// Ensure dest dir exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const imagesToProcess = [
  {
    src: 'che_do_thai_san_hero_1783933481730.jpg',
    dest: 'tinh-che-do-thai-san-hero.webp'
  },
  {
    src: 'diem_hoa_von_hero_1783933500823.jpg',
    dest: 'tinh-diem-hoa-von-hero.webp'
  },
  {
    src: 'regex_explainer_hero_1783933512440.jpg',
    dest: 'regex-explainer-hero.webp'
  },
  {
    src: 'thai_san_body_1_1783933553917.jpg',
    dest: 'tinh-che-do-thai-san-body-1.webp'
  },
  {
    src: 'diem_hoa_von_body_1_1783933567828.jpg',
    dest: 'tinh-diem-hoa-von-body-1.webp'
  },
  {
    src: 'regex_explainer_body_1_1783933578817.jpg',
    dest: 'regex-explainer-body-1.webp'
  }
];

async function run() {
  for (const img of imagesToProcess) {
    const srcPath = path.join(srcDir, img.src);
    const destPath = path.join(destDir, img.dest);
    
    if (fs.existsSync(srcPath)) {
      console.log(`Processing ${img.src} -> ${img.dest}`);
      await sharp(srcPath)
        .resize(800) // Resize to 800px width for blog performance
        .webp({ quality: 80 }) // Convert to WebP format, quality 80%
        .toFile(destPath);
      console.log(`Successfully saved to ${destPath}`);
    } else {
      console.error(`Source file not found: ${srcPath}`);
    }
  }
}

run().catch(console.error);
