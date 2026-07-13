import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const srcDir = 'C:/Users/JUNE/.gemini/antigravity/brain/ad0570cf-81c1-44a7-b333-3c950f30553f';
const destDir = 'c:/Users/JUNE/Desktop/trolyso-online/public/images/blog';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const imagesToProcess = [
  {
    src: 'chatgpt_commands_hero_1783949025924.jpg',
    dest: 'cac-lenh-mac-dinh-cua-he-thong-chatgpt-hero.webp'
  },
  {
    src: 'chatgpt_commands_search_1783949042130.jpg',
    dest: 'lenh-search-chatgpt.webp'
  },
  {
    src: 'chatgpt_commands_reason_1783949057370.jpg',
    dest: 'lenh-reason-chatgpt.webp'
  },
  {
    src: 'chatgpt_commands_canvas_1783949070199.jpg',
    dest: 'lenh-canvas-chatgpt.webp'
  },
  {
    src: 'chatgpt_commands_dalle_1783949082627.jpg',
    dest: 'lenh-dalle-chatgpt.webp'
  },
  {
    src: 'chatgpt_commands_code_1783949095919.jpg',
    dest: 'lenh-code-interpreter-chatgpt.webp'
  },
  {
    src: 'chatgpt_commands_custom_1783949109735.jpg',
    dest: 'lenh-custom-chatgpt.webp'
  },
  {
    src: 'chatgpt_commands_productivity_1783949123277.jpg',
    dest: 'to-uu-hieu-suat-chatgpt.webp'
  }
];

async function run() {
  for (const img of imagesToProcess) {
    const srcPath = path.join(srcDir, img.src);
    const destPath = path.join(destDir, img.dest);
    
    if (fs.existsSync(srcPath)) {
      console.log(`Processing ${img.src} -> ${img.dest}`);
      await sharp(srcPath)
        .resize(800)
        .webp({ quality: 80 })
        .toFile(destPath);
      console.log(`Successfully saved to ${destPath}`);
    } else {
      console.error(`Source file not found: ${srcPath}`);
    }
  }
}

run().catch(console.error);
