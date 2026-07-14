import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const items = [
  {
    src: 'C:/Users/JUNE/.gemini/antigravity/brain/ad0570cf-81c1-44a7-b333-3c950f30553f/cat_pdf_hero_1784023119791.jpg',
    dest: 'c:/Users/JUNE/Desktop/trolyso-online/public/images/blog/cat-file-pdf-online-hero.webp'
  },
  {
    src: 'C:/Users/JUNE/.gemini/antigravity/brain/ad0570cf-81c1-44a7-b333-3c950f30553f/random_number_hero_1784023130837.jpg',
    dest: 'c:/Users/JUNE/Desktop/trolyso-online/public/images/blog/tao-so-ngau-nhien-online-hero.webp'
  }
];

async function run() {
  for (const item of items) {
    if (fs.existsSync(item.src)) {
      console.log(`Processing ${item.src} -> ${item.dest}`);
      await sharp(item.src)
        .resize(800)
        .webp({ quality: 80 })
        .toFile(item.dest);
      console.log(`Successfully saved!`);
    } else {
      console.error(`Source file not found: ${item.src}`);
    }
  }
}

run().catch(console.error);
