import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const srcPath = 'C:/Users/JUNE/.gemini/antigravity/brain/ad0570cf-81c1-44a7-b333-3c950f30553f/dream_interpreter_hero_1784039441386.jpg';
const destPath = 'c:/Users/JUNE/Desktop/trolyso-online/public/images/blog/giai-ma-giac-mo-online-hero.webp';

async function run() {
  if (fs.existsSync(srcPath)) {
    console.log(`Processing ${srcPath} -> ${destPath}`);
    await sharp(srcPath)
      .resize(800)
      .webp({ quality: 80 })
      .toFile(destPath);
    console.log(`Successfully saved Dream Interpreter hero image!`);
  } else {
    console.error(`Source file not found: ${srcPath}`);
  }
}

run().catch(console.error);
