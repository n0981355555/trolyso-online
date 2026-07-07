import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const TARGET_DIR = path.resolve('../public/images/blog');

export async function optimizeImage(fileBuffer, outputFilename) {
  // Ensure target directory exists
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  const cleanFilename = outputFilename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'h')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-');
    
  const finalFilename = `${path.parse(cleanFilename).name}.webp`;
  const outputPath = path.join(TARGET_DIR, finalFilename);
  
  console.log(`📸 Optimizing image to WebP: ${outputPath}`);

  // Sharp compression pipeline
  let quality = 80;
  let buffer = await sharp(fileBuffer)
    .resize(1200, 630, {
      fit: 'cover',
      position: 'center'
    })
    .webp({ quality })
    .toBuffer();
    
  // If buffer is larger than 100KB, reduce quality progressively
  while (buffer.length > 100 * 1024 && quality > 20) {
    quality -= 10;
    buffer = await sharp(fileBuffer)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality })
      .toBuffer();
  }
  
  await fs.promises.writeFile(outputPath, buffer);
  
  return {
    filename: finalFilename,
    url: `/images/blog/${finalFilename}`,
    size: buffer.length
  };
}
