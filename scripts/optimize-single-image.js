import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const srcPath = 'C:/Users/JUNE/.gemini/antigravity/brain/ad0570cf-81c1-44a7-b333-3c950f30553f/thai_san_father_holding_baby_1783975165511.jpg';
const destPath = 'c:/Users/JUNE/Desktop/trolyso-online/public/images/blog/tinh-che-do-thai-san-body-1.webp';

async function run() {
  if (fs.existsSync(srcPath)) {
    console.log(`Processing ${srcPath} -> ${destPath}`);
    await sharp(srcPath)
      .resize(800)
      .webp({ quality: 80 })
      .toFile(destPath);
    console.log(`Successfully updated image!`);
  } else {
    console.error(`Source file not found: ${srcPath}`);
  }
}

run().catch(console.error);
