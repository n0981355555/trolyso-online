import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const files = [
  { src: 'C:/Users/JUNE/.gemini/antigravity/brain/ad0570cf-81c1-44a7-b333-3c950f30553f/tao_chu_ky_email_hero_1783624749725.jpg', name: 'tao-chu-ky-email-chuyen-nghiep-hero.webp' },
  { src: 'C:/Users/JUNE/.gemini/antigravity/brain/ad0570cf-81c1-44a7-b333-3c950f30553f/tao_chu_ky_email_compare_1783624760935.jpg', name: 'tao-chu-ky-email-chuyen-nghiep-compare.webp' },
  { src: 'C:/Users/JUNE/.gemini/antigravity/brain/ad0570cf-81c1-44a7-b333-3c950f30553f/tao_chu_ky_email_steps_1783624773170.jpg', name: 'tao-chu-ky-email-chuyen-nghiep-steps.webp' },
  { src: 'C:/Users/JUNE/.gemini/antigravity/brain/ad0570cf-81c1-44a7-b333-3c950f30553f/tao_chu_ky_email_templates_1783624786451.jpg', name: 'tao-chu-ky-email-chuyen-nghiep-templates.webp' },
  { src: 'C:/Users/JUNE/.gemini/antigravity/brain/ad0570cf-81c1-44a7-b333-3c950f30553f/tao_chu_ky_email_responsive_1783624797650.jpg', name: 'tao-chu-ky-email-chuyen-nghiep-responsive.webp' }
];

const destDir = path.resolve('public/images/blog');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

async function processImages() {
  for (const file of files) {
    const destPath = path.join(destDir, file.name);
    console.log(`Processing ${file.src} -> ${destPath}...`);
    
    // We will resize to width 1000px (standard content size) and convert to webp with quality 75
    await sharp(file.src)
      .resize({ width: 1000, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(destPath);
      
    const stats = fs.statSync(destPath);
    console.log(`Saved ${file.name} (${Math.round(stats.size / 1024)} KB)`);
  }
}

processImages().then(() => {
  console.log("🎉 All images optimized and copied successfully!");
}).catch(err => {
  console.error("❌ Error processing images:", err);
});
