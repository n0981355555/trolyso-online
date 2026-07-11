import fs from 'fs';
import path from 'path';

const blogFiles = [
  'src/pages/blog/cach-tinh-lai-suat-vay-tiet-kiem/index.astro',
  'src/pages/blog/cach-tinh-thue-gia-tri-gia-tang-vat/index.astro',
  'src/pages/blog/cong-cu-dem-ky-tu-online-mien-phi/index.astro',
  'src/pages/blog/cach-tinh-tien-luong-ngay-phep-chua-nghi/index.astro',
  'src/pages/blog/thue-tncn-khac-thue-vat-nhu-the-nao/index.astro'
];

console.log('🏁 Starting hover and micro-animation effects sync...');

for (const fileRel of blogFiles) {
  const filePath = path.resolve(fileRel);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File not found: ${fileRel}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Breadcrumb links
  content = content.replace(
    /class="hover:text-brand-blue transition"/g,
    'class="hover:text-brand-blue dark:hover:text-brand-mint transition duration-200"'
  );

  // 2. Inline text links
  content = content.replace(
    /class="text-brand-blue hover:underline font-bold"/g,
    'class="text-brand-blue dark:text-brand-mint hover:text-blue-700 dark:hover:text-emerald-400 hover:underline font-bold transition duration-200"'
  );

  // 3. References list links
  content = content.replace(
    /class="text-brand-blue hover:underline font-medium text-sm block"/g,
    'class="text-brand-blue dark:text-brand-mint hover:text-blue-700 dark:hover:text-emerald-400 hover:underline font-medium text-sm block transition duration-200"'
  );

  // 4. White CTA button
  content = content.replace(
    /class="inline-flex items-center gap-2 px-8 py-3 bg-white text-brand-blue font-bold rounded-2xl hover:bg-slate-100 transition shadow-md"/g,
    'class="inline-flex items-center gap-2 px-8 py-3 bg-white text-brand-blue font-bold rounded-2xl hover:bg-slate-100 hover:scale-105 active:scale-95 hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"'
  );

  // 5. Emerald CTA button
  content = content.replace(
    /class="inline-flex items-center gap-2 px-8 py-3 bg-white text-emerald-600 font-bold rounded-2xl hover:bg-slate-100 transition shadow-md"/g,
    'class="inline-flex items-center gap-2 px-8 py-3 bg-white text-emerald-600 font-bold rounded-2xl hover:bg-slate-100 hover:scale-105 active:scale-95 hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"'
  );

  // 6. Split CTA button White
  content = content.replace(
    /class="px-6 py-3 bg-white text-brand-blue font-bold rounded-2xl hover:bg-slate-100 transition shadow-md"/g,
    'class="px-6 py-3 bg-white text-brand-blue font-bold rounded-2xl hover:bg-slate-100 hover:scale-105 active:scale-95 hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"'
  );

  // 7. Split CTA button Slate
  content = content.replace(
    /class="px-6 py-3 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition shadow-md"/g,
    'class="px-6 py-3 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 hover:scale-105 active:scale-95 hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"'
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Hover effects updated for: ${fileRel}`);
  } else {
    console.log(`ℹ️ No changes needed for: ${fileRel}`);
  }
}

console.log('🎉 Hover effects processing complete!');
