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
    src: 'gemini_commands_hero_1783962852058.jpg',
    dest: 'cac-lenh-he-thong-mac-dinh-cua-gemeni-ai-hero.webp'
  },
  {
    src: 'gemini_commands_extensions_1783962865540.jpg',
    dest: 'gemini-ai-extensions.webp'
  },
  {
    src: 'gemini_commands_workspace_1783962880229.jpg',
    dest: 'gemini-ai-google-workspace.webp'
  },
  {
    src: 'gemini_commands_youtube_1783962894615.jpg',
    dest: 'gemini-ai-youtube-extension.webp'
  },
  {
    src: 'gemini_commands_maps_1783962906405.jpg',
    dest: 'gemini-ai-google-maps.webp'
  },
  {
    src: 'gemini_commands_travel_1783962919034.jpg',
    dest: 'gemini-ai-flights-hotels.webp'
  },
  {
    src: 'gemini_commands_code_1783962932304.jpg',
    dest: 'gemini-ai-code-sandbox.webp'
  },
  {
    src: 'gemini_commands_productivity_1783962945242.jpg',
    dest: 'to-uu-hieu-suat-gemini-ai.webp'
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
