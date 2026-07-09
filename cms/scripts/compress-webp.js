import sharp from 'sharp';
import process from 'process';

const src = process.argv[2];
const dest = process.argv[3];

if (!src || !dest) {
  console.error('Usage: node compress-webp.js <src> <dest>');
  process.exit(1);
}

sharp(src)
  .webp({ quality: 80 })
  .toFile(dest)
  .then(() => console.log(`Converted ${src} to WebP successfully!`))
  .catch(err => console.error('Error during conversion:', err));
