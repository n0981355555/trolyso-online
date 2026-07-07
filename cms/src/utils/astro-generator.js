import fs from 'fs';
import path from 'path';

// Convert EditorJS block JSON to HTML
export function editorJsToHtml(contentJsonStr) {
  try {
    const data = JSON.parse(contentJsonStr);
    if (!data.blocks || !Array.isArray(data.blocks)) return '';
    
    return data.blocks.map(block => {
      switch (block.type) {
        case 'header':
          const level = block.data.level || 2;
          const cleanText = block.data.text;
          const id = cleanText.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9 ]/g, '')
            .replace(/\s+/g, '-');
          return `<h${level} id="${id}" class="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">${cleanText}</h${level}>`;
          
        case 'paragraph':
          return `<p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">${block.data.text}</p>`;
          
        case 'list':
          const listTag = block.data.style === 'ordered' ? 'ol' : 'ul';
          const listClass = block.data.style === 'ordered' ? 'list-decimal' : 'list-disc';
          const items = block.data.items.map(item => `<li class="mb-2">${item}</li>`).join('');
          return `<${listTag} class="${listClass} pl-6 text-slate-600 dark:text-slate-300 mb-6">${items}</${listTag}>`;
          
        case 'table':
          const rows = block.data.content.map((row, index) => {
            const cellTag = index === 0 ? 'th' : 'td';
            const cellClass = index === 0 
              ? 'px-4 py-3 bg-slate-100 dark:bg-slate-800 text-left font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700' 
              : 'px-4 py-3 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300';
            const cells = row.map(cell => `<${cellTag} class="${cellClass}">${cell}</${cellTag}>`).join('');
            return `<tr>${cells}</tr>`;
          }).join('');
          return `
            <div class="overflow-x-auto my-8 border border-slate-200 dark:border-slate-800 rounded-xl">
              <table class="w-full text-sm border-collapse">
                <tbody>${rows}</tbody>
              </table>
            </div>
          `;
          
        case 'quote':
          return `
            <blockquote class="border-l-4 border-brand-blue pl-4 py-1 my-6 italic text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-brand-darkCard rounded-r-lg">
              <p class="mb-2">${block.data.text}</p>
              ${block.data.caption ? `<cite class="text-xs text-slate-400 dark:text-slate-500">— ${block.data.caption}</cite>` : ''}
            </blockquote>
          `;
          
        case 'warning':
          return `
            <div class="p-4 my-6 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl text-slate-700 dark:text-slate-300">
              <div class="font-semibold text-amber-800 dark:text-amber-400 mb-1">${block.data.title || 'Lưu ý'}</div>
              <p>${block.data.message}</p>
            </div>
          `;
          
        case 'image':
          const imageUrl = block.data.file ? block.data.file.url : (block.data.url || '');
          return `
            <div class="my-8">
              <img src="${imageUrl}" alt="${block.data.alt || 'hinh-minh-hoa'}" class="w-full h-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm" loading="lazy" />
              ${block.data.caption ? `<p class="text-xs text-center text-slate-400 dark:text-slate-500 mt-2 italic font-normal">Hình: ${block.data.caption}</p>` : ''}
            </div>
          `;
          
        case 'faq':
          return `
            <div class="faq-item border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-4 bg-white dark:bg-brand-darkCard">
              <h4 class="font-semibold text-slate-800 dark:text-slate-100 flex justify-between items-center cursor-pointer">${block.data.question}</h4>
              <p class="text-slate-600 dark:text-slate-300 mt-2 text-sm">${block.data.answer}</p>
            </div>
          `;
          
        case 'code':
          return `
            <pre class="bg-slate-900 text-slate-200 p-4 rounded-xl overflow-x-auto text-sm my-6"><code>${block.data.code}</code></pre>
          `;
          
        default:
          return '';
      }
    }).join('\n');
  } catch (e) {
    console.error('Error converting EditorJS blocks to HTML:', e);
    return '';
  }
}

// Generate table of contents structure
function generateToc(contentJsonStr) {
  try {
    const data = JSON.parse(contentJsonStr);
    if (!data.blocks) return [];
    return data.blocks
      .filter(block => block.type === 'header' && (block.data.level === 2 || block.data.level === 3))
      .map(block => {
        const text = block.data.text;
        const id = text.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/[^a-z0-9 ]/g, '')
          .replace(/\s+/g, '-');
        return { text, id, level: block.data.level };
      });
  } catch (e) {
    return [];
  }
}

// Extract FAQs for Schema JSON-LD
function extractFaqs(contentJsonStr) {
  try {
    const data = JSON.parse(contentJsonStr);
    if (!data.blocks) return [];
    return data.blocks
      .filter(block => block.type === 'faq')
      .map(block => ({ question: block.data.question, answer: block.data.answer }));
  } catch (e) {
    return [];
  }
}

export function generateAstroPage(post, author, category) {
  const htmlContent = editorJsToHtml(post.content);
  const toc = generateToc(post.content);
  const faqs = extractFaqs(post.content);
  
  const formattedPublishDate = post.publishDate 
    ? new Date(post.publishDate).toLocaleDateString('vi-VN') 
    : new Date().toLocaleDateString('vi-VN');
    
  const updatedDate = new Date().toLocaleDateString('vi-VN');
  
  // Build FAQ Schema if questions exist
  let faqSchemaScript = '';
  if (faqs.length > 0) {
    const faqList = faqs.map(faq => `
      {
        "@type": "Question",
        "name": "${faq.question.replace(/"/g, '\\"')}",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "${faq.answer.replace(/"/g, '\\"')}"
        }
      }
    `).join(',');
    
    faqSchemaScript = `
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [${faqList}]
      }
      </script>
    `;
  }
  
  // Build Article & Breadcrumb Schema
  const articleSchema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${post.title.replace(/"/g, '\\"')}",
      "description": "${post.description.replace(/"/g, '\\"')}",
      "image": "${post.ogImage || 'https://trolyso.online' + (post.ogImage || '')}",
      "datePublished": "${post.publishDate ? new Date(post.publishDate).toISOString() : new Date().toISOString()}",
      "dateModified": "${new Date().toISOString()}",
      "author": {
        "@type": "Person",
        "name": "${author.name}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Trợ Lý Số",
        "logo": {
          "@type": "ImageObject",
          "url": "https://trolyso.online/favicon.png"
        }
      }
    }
    </script>
  `;
  
  const breadcrumbSchema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Trang chủ",
          "item": "https://trolyso.online/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://trolyso.online/blog/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "${post.title.replace(/"/g, '\\"')}",
          "item": "https://trolyso.online/blog/${post.slug}/"
        }
      ]
    }
    </script>
  `;

  // Dynamic references parser
  let refHtml = '';
  if (post.references) {
    try {
      const refs = JSON.parse(post.references);
      if (Array.isArray(refs) && refs.length > 0) {
        refHtml = `
          <div class="mt-12 p-6 bg-slate-50 dark:bg-brand-darkCard rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              📚 Tài liệu tham khảo & Nguồn uy tín
            </h3>
            <ul class="space-y-3">
              ${refs.map(ref => `
                <li>
                  <a href="${ref.url}" target="_blank" rel="noopener noreferrer" class="text-brand-blue hover:underline font-medium text-sm block">
                    🔗 ${ref.name}
                  </a>
                  ${ref.desc ? `<p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">${ref.desc}</p>` : ''}
                </li>
              `).join('')}
            </ul>
          </div>
        `;
      }
    } catch(e) {}
  }
  
  // Dynamic related posts parser
  let relatedHtml = '';
  if (post.relatedPosts) {
    try {
      const related = JSON.parse(post.relatedPosts);
      if (Array.isArray(related) && related.length > 0) {
        relatedHtml = `
          <div class="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8">
            <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
              📰 Bài viết liên quan hữu ích
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${related.map(rel => `
                <a href="/blog/${rel.slug}/" class="group block p-5 bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-brand-blue transition shadow-sm">
                  <span class="text-xs font-semibold text-brand-blue bg-blue-50 dark:bg-blue-950/30 px-2.5 py-1 rounded-full mb-3 inline-block">
                    ${rel.category || 'Cẩm nang'}
                  </span>
                  <h4 class="font-bold text-slate-800 dark:text-slate-100 group-hover:text-brand-blue transition line-clamp-2">
                    ${rel.title}
                  </h4>
                </a>
              `).join('')}
            </div>
          </div>
        `;
      }
    } catch(e) {}
  }

  // CTA button configuration
  let ctaHtml = '';
  if (post.ctaLink) {
    ctaHtml = `
      <div class="my-10 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl text-white text-center shadow-lg">
        <h4 class="text-xl font-extrabold mb-2">💡 Bạn đang cần tính toán nhanh?</h4>
        <p class="text-sm text-blue-100 mb-6">Sử dụng ngay công cụ tự động, chính xác của Trợ Lý Số hoàn toàn miễn phí.</p>
        <a href="${post.ctaLink}" class="inline-flex items-center gap-2 px-8 py-3 bg-white text-brand-blue font-bold rounded-2xl hover:bg-slate-100 transition shadow-md" aria-label="Tra cứu công cụ">
          🚀 ${post.ctaText || 'Sử dụng công cụ ngay'}
        </a>
      </div>
    `;
  }

  // Generate Table of Contents HTML
  let tocHtml = '';
  if (toc.length > 0) {
    tocHtml = `
      <div class="my-8 p-6 bg-slate-50 dark:bg-brand-darkCard rounded-2xl border border-slate-200 dark:border-slate-800">
        <h3 class="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">📋 Mục lục bài viết</h3>
        <nav class="space-y-1.5">
          ${toc.map(item => `
            <a href="#${item.id}" class="block text-sm text-slate-600 dark:text-slate-400 hover:text-brand-blue transition ${item.level === 3 ? 'pl-4 text-xs' : 'font-medium'}">
              • ${item.text}
            </a>
          `).join('')}
        </nav>
      </div>
    `;
  }

  const astroTemplate = `---
import Layout from '../../../layouts/Layout.astro';
---

<Layout 
  title="${post.title.replace(/"/g, '\\"')}" 
  description="${post.description.replace(/"/g, '\\"')}"
>
  <main class="max-w-4xl mx-auto px-4 py-12">
    <!-- 1. Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 mb-6" aria-label="Breadcrumb">
      <a href="/" class="hover:text-brand-blue transition">Trang chủ</a>
      <span>/</span>
      <a href="/blog/" class="hover:text-brand-blue transition">Blog</a>
      <span>/</span>
      <span class="text-slate-600 dark:text-slate-400 line-clamp-1">${post.title}</span>
    </nav>

    <!-- 2. H1 Title -->
    <h1 class="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight mb-6">
      ${post.title}
    </h1>

    <!-- 3. E-E-A-T Author Box & Mentorship metadata -->
    <div class="flex flex-wrap items-center gap-4 p-5 bg-slate-50 dark:bg-brand-darkCard border border-slate-200 dark:border-slate-800 rounded-2xl mb-8 text-sm">
      <div class="flex items-center gap-3">
        ${author.avatar ? `<img src="${author.avatar}" alt="${author.name}" class="w-10 h-10 rounded-full object-cover" />` : `<div class="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">${author.name.charAt(0)}</div>`}
        <div>
          <p class="text-xs text-slate-400">Biên soạn bởi</p>
          <p class="font-bold text-slate-700 dark:text-slate-300">${author.name}</p>
        </div>
      </div>
      ${post.editorName ? `
        <div class="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
        <div>
          <p class="text-xs text-slate-400">Kiểm duyệt chuyên môn</p>
          <p class="font-bold text-slate-700 dark:text-slate-300">${post.editorName} <span class="text-xs font-normal text-slate-400">(${post.editorTitle || 'Chuyên gia'})</span></p>
        </div>
      ` : ''}
      <div class="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
      <div class="ml-auto flex items-center gap-4 text-xs text-slate-400">
        <div>📅 Cập nhật: ${updatedDate}</div>
        <div>⏱️ ${post.readingTime} phút đọc</div>
      </div>
    </div>

    <!-- 4. Hero Image -->
    ${post.ogImage ? `
      <div class="mb-8">
        <img src="${post.ogImage}" alt="${post.altImage || 'hinh-anh-hero'}" class="w-full h-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm" />
        ${post.caption ? `<p class="text-xs text-center text-slate-400 dark:text-slate-500 mt-2 italic font-normal">Hình: ${post.caption}</p>` : ''}
      </div>
    ` : ''}

    <!-- 5. Sapo -->
    <p class="text-lg font-medium text-slate-700 dark:text-slate-200 leading-relaxed mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
      ${post.description}
    </p>

    <!-- 6. Table of Contents -->
    ${tocHtml}

    <!-- 7. Main Article HTML Content -->
    <article class="prose prose-slate dark:prose-invert max-w-none">
      ${htmlContent}
    </article>

    <!-- 8. CTA Link -->
    ${ctaHtml}

    <!-- 9. References -->
    ${refHtml}

    <!-- 10. Related Articles & Internal Links -->
    ${relatedHtml}
  </main>
</Layout>

${articleSchema}
${breadcrumbSchema}
${faqSchemaScript}
`;

  // Write file out
  const targetDir = path.resolve(`../src/pages/blog/${post.slug}`);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const targetFile = path.join(targetDir, 'index.astro');
  fs.writeFileSync(targetFile, astroTemplate, 'utf8');
  console.log(`🎉 Astro page created successfully: ${targetFile}`);
}

export function updateBlogIndex(post, categoryName) {
  const indexPath = path.resolve('../src/pages/blog/index.astro');
  if (!fs.existsSync(indexPath)) return;
  
  let content = fs.readFileSync(indexPath, 'utf8');
  
  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  
  const newPostObject = {
    title: post.title,
    description: post.description,
    slug: post.slug,
    category: categoryName || 'Cẩm nang',
    date: dateStr,
    readTime: `${post.readingTime} phút`,
    badge: "Mới"
  };
  
  const postString = `  {\n    title: "${newPostObject.title.replace(/"/g, '\\"')}",\n    description: "${newPostObject.description.replace(/"/g, '\\"')}",\n    slug: "${newPostObject.slug}",\n    category: "${newPostObject.category}",\n    date: "${newPostObject.date}",\n    readTime: "${newPostObject.readTime}",\n    badge: "${newPostObject.badge}"\n  },\n`;
  
  const marker = '/* DYNAMIC_POSTS_START */';
  const insertIndex = content.indexOf(marker);
  
  if (insertIndex !== -1) {
    const before = content.slice(0, insertIndex + marker.length);
    const after = content.slice(insertIndex + marker.length);
    
    // Check if slug is already in index to prevent duplicate listings
    if (!content.includes(`slug: "${post.slug}"`)) {
      content = before + '\n' + postString + after;
      fs.writeFileSync(indexPath, content, 'utf8');
      console.log('✅ Blog index updated successfully.');
    } else {
      console.log('ℹ️ Blog index already contains this slug, skipping update.');
    }
  } else {
    console.error('❌ Could not find /* DYNAMIC_POSTS_START */ in blog/index.astro');
  }
}

export function updateSearchIndex(post) {
  const layoutPath = path.resolve('../src/layouts/Layout.astro');
  if (!fs.existsSync(layoutPath)) return;
  
  let content = fs.readFileSync(layoutPath, 'utf8');
  
  const searchRecord = {
    title: `Bài viết: ${post.title}`,
    desc: post.description,
    url: `/blog/${post.slug}/`
  };
  
  const recordString = `          { title: "${searchRecord.title.replace(/"/g, '\\"')}", desc: "${searchRecord.desc.replace(/"/g, '\\"')}", url: "${searchRecord.url}" },\n`;
  
  const marker = '/* DYNAMIC_POSTS_START */';
  const insertIndex = content.indexOf(marker);
  
  if (insertIndex !== -1) {
    const before = content.slice(0, insertIndex + marker.length);
    const after = content.slice(insertIndex + marker.length);
    
    if (!content.includes(`url: "/blog/${post.slug}/"`)) {
      content = before + '\n' + recordString + after;
      fs.writeFileSync(layoutPath, content, 'utf8');
      console.log('✅ Layout searchIndex updated successfully.');
    } else {
      console.log('ℹ️ Layout searchIndex already contains this blog url, skipping update.');
    }
  } else {
    console.error('❌ Could not find /* DYNAMIC_POSTS_START */ in Layout.astro');
  }
}

export function updateSitemap(post) {
  const sitemapPath = path.resolve('../public/sitemap.xml');
  if (!fs.existsSync(sitemapPath)) return;
  
  let content = fs.readFileSync(sitemapPath, 'utf8');
  
  const today = new Date().toISOString().split('T')[0];
  const sitemapUrlBlock = `  <url>\n    <loc>https://trolyso.online/blog/${post.slug}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  
  const marker = '<!-- DYNAMIC_POSTS_START -->';
  const insertIndex = content.indexOf(marker);
  
  if (insertIndex !== -1) {
    const before = content.slice(0, insertIndex + marker.length);
    const after = content.slice(insertIndex + marker.length);
    
    if (!content.includes(`https://trolyso.online/blog/${post.slug}/`)) {
      content = before + '\n' + sitemapUrlBlock + after;
      fs.writeFileSync(sitemapPath, content, 'utf8');
      console.log('✅ sitemap.xml updated successfully.');
    } else {
      console.log('ℹ️ sitemap.xml already contains this blog URL, skipping update.');
    }
  } else {
    console.error('❌ Could not find <!-- DYNAMIC_POSTS_START --> in sitemap.xml');
  }
}
