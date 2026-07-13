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
    src: 'claude_commands_hero_1783961987815.jpg',
    dest: 'cac-lenh-mac-dinh-cua-claude-ai-hero.webp'
  },
  {
    src: 'claude_commands_shortcuts_1783962004079.jpg',
    dest: 'claude-ai-keyboard-shortcuts.webp'
  },
  {
    src: 'claude_commands_artifacts_1783962018109.jpg',
    dest: 'claude-ai-artifacts-command.webp'
  },
  {
    src: 'claude_commands_project_1783962034657.jpg',
    dest: 'claude-ai-project-knowledge.webp'
  },
  {
    src: 'claude_commands_custom_1783962047472.jpg',
    dest: 'claude-ai-custom-style-prompt.webp'
  },
  {
    src: 'claude_commands_code_1783962060735.jpg',
    dest: 'claude-ai-code-generation-command.webp'
  },
  {
    src: 'claude_commands_document_1783962074006.jpg',
    dest: 'claude-ai-document-analysis.webp'
  },
  {
    src: 'claude_commands_productivity_1783962085701.jpg',
    dest: 'to-uu-hieu-suat-claude-ai.webp'
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
