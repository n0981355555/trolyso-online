import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

const blogDir = path.resolve('../src/pages/blog');

// Helper to strip HTML tags for simple text extraction
function stripTags(html) {
  return html.replace(/<[^>]*>/g, '').trim();
}

async function run() {
  console.log('🏁 Starting import of old blog posts into CMS database...');

  try {
    // 1. Get default Admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminUser) {
      console.error('❌ Default admin user not found. Please run npm run prisma:seed first.');
      process.exit(1);
    }

    console.log(`👤 Using author: ${adminUser.name} (${adminUser.email})`);

    // 2. Get or create default category
    let defaultCategory = await prisma.category.findFirst({
      where: { slug: 'cam-nang' }
    });

    if (!defaultCategory) {
      defaultCategory = await prisma.category.create({
        data: {
          name: 'Cẩm nang',
          slug: 'cam-nang',
          description: 'Cẩm nang hướng dẫn và chia sẻ kiến thức hữu ích',
          color: '#3b82f6'
        }
      });
    }

    console.log(`📁 Default category: ${defaultCategory.name}`);

    // 3. Scan src/pages/blog directory
    if (!fs.existsSync(blogDir)) {
      console.error(`❌ Blog directory not found at: ${blogDir}`);
      process.exit(1);
    }

    const items = fs.readdirSync(blogDir);
    let importCount = 0;

    for (const item of items) {
      const itemPath = path.join(blogDir, item);
      const isDir = fs.statSync(itemPath).isDirectory();

      // Skip dynamic tags directory and any non-blog folders
      if (!isDir || item === 'tags' || item === 'lichcatdien') {
        continue;
      }

      const astroFilePath = path.join(itemPath, 'index.astro');
      if (!fs.existsSync(astroFilePath)) {
        continue;
      }

      const slug = item;
      console.log(`\n📖 Processing post: /blog/${slug}/`);

      // Check if post already exists in database
      const existing = await prisma.post.findUnique({
        where: { slug }
      });

      if (existing) {
        console.log(`ℹ️ Post with slug "${slug}" already exists in database. Skipping.`);
        continue;
      }

      // Read Astro file content
      const content = fs.readFileSync(astroFilePath, 'utf8');
      const $ = cheerio.load(content);

      // Parse metadata from Layout tag
      let title = '';
      let description = '';

      // Try matching title and description from Astro <Layout ...> tag
      const layoutMatch = content.match(/<Layout\s+title="([^"]+)"\s+description="([^"]+)"/s) || 
                          content.match(/<Layout\s+title="([^"]+)"/s);
      
      if (layoutMatch) {
        title = layoutMatch[1];
        // Try extracting description separately if not matched above
        const descMatch = content.match(/description="([^"]+)"/);
        description = descMatch ? descMatch[1] : '';
      }

      // Fallback: extract title from h1
      if (!title) {
        title = $('h1').text().trim() || slug;
      }

      // Extract E-E-A-T details
      let authorName = adminUser.name;
      let editorName = null;
      let editorTitle = null;
      let publishDate = new Date();

      // Attempt to extract updated date from the text "Cập nhật: DD/MM/YYYY"
      const dateMatch = content.match(/Cập nhật:?\s*(\d{2})\/(\d{2})\/(\d{4})/i) ||
                        content.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (dateMatch) {
        publishDate = new Date(`${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}T00:00:00.000Z`);
      }

      // Attempt to parse reviewer info
      const reviewerText = content.match(/Kiểm duyệt chuyên môn:?\s*([^<]+)/i) ||
                           content.match(/Đã kiểm duyệt chuyên môn bởi:?\s*([^<]+)/i) ||
                           content.match(/Được kiểm duyệt bởi:?\s*([^<]+)/i);
      
      if (reviewerText) {
        const rawReviewer = reviewerText[1].trim();
        const parts = rawReviewer.split('(');
        editorName = parts[0].trim().replace(/^Nguyễn Minh Trí,\s*/, '').replace(/,\s*CPA$/, '').trim();
        if (parts[1]) {
          editorTitle = parts[1].replace(')', '').trim();
        }
      }

      // Extract Hero Image Src, Alt and Caption
      let ogImage = '';
      let altImage = '';
      let caption = '';

      const heroImg = $('.mb-8 img').first() || $('img').first();
      if (heroImg.length > 0) {
        ogImage = heroImg.attr('src') || '';
        altImage = heroImg.attr('alt') || '';
        
        // Hero caption usually in next p tag
        const captionText = heroImg.parent().find('p').text() || heroImg.next('p').text();
        if (captionText) {
          caption = captionText.replace(/^Hình\s*\d*:\s*/i, '').trim();
        }
      }

      // Parse Prose Content to EditorJS Blocks
      const blocks = [];
      let imgCounter = 2;

      const proseContainer = $('.prose, article.prose');
      if (proseContainer.length > 0) {
        proseContainer.children().each((index, el) => {
          const $el = $(el);
          const tagName = el.name.toLowerCase();

          if (tagName === 'h2' || tagName === 'h3' || tagName === 'h4') {
            blocks.push({
              type: 'header',
              data: {
                text: $el.html().trim(),
                level: parseInt(tagName.substring(1))
              }
            });
          } else if (tagName === 'p') {
            // Check if paragraph is just text or has a child img
            const img = $el.find('img');
            if (img.length > 0) {
              const capText = $el.next('p.text-xs, p.text-center').text() || img.attr('alt') || '';
              blocks.push({
                type: 'image',
                data: {
                  url: img.attr('src') || '',
                  alt: img.attr('alt') || '',
                  caption: capText.replace(/^Hình\s*\d*:\s*/i, '').trim()
                }
              });
              imgCounter++;
            } else {
              blocks.push({
                type: 'paragraph',
                data: {
                  text: $el.html().trim()
                }
              });
            }
          } else if (tagName === 'ul' || tagName === 'ol') {
            const items = [];
            $el.find('li').each((j, li) => {
              items.push($(li).html().trim());
            });
            blocks.push({
              type: 'list',
              data: {
                style: tagName === 'ol' ? 'ordered' : 'unordered',
                items
              }
            });
          } else if (tagName === 'blockquote') {
            blocks.push({
              type: 'quote',
              data: {
                text: $el.find('p').html()?.trim() || $el.html().trim(),
                caption: $el.find('cite').html()?.trim() || ''
              }
            });
          } else if (tagName === 'pre') {
            blocks.push({
              type: 'code',
              data: {
                code: $el.find('code').text() || $el.text()
              }
            });
          } else if (tagName === 'table') {
            const tableContent = [];
            $el.find('tr').each((r, tr) => {
              const row = [];
              $(tr).find('th, td').each((c, cell) => {
                row.push($(cell).html().trim());
              });
              tableContent.push(row);
            });
            blocks.push({
              type: 'table',
              data: {
                content: tableContent
              }
            });
          } else if ($el.hasClass('bg-blue-50') || $el.hasClass('bg-amber-50') || $el.hasClass('bg-amber-950/20') || ($el.hasClass('p-4') && $el.hasClass('my-6'))) {
            const title = $el.find('.font-bold, .font-semibold').html()?.trim() || 'Lưu ý';
            const message = $el.find('p').last().html()?.trim() || $el.html().trim();
            blocks.push({
              type: 'warning',
              data: {
                title,
                message
              }
            });
          } else if ($el.find('img').length > 0) {
            const img = $el.find('img');
            const capText = $el.find('p.text-xs, p.text-center').text() || '';
            blocks.push({
              type: 'image',
              data: {
                url: img.attr('src') || '',
                alt: img.attr('alt') || '',
                caption: capText.replace(/^Hình\s*\d*:\s*/i, '').trim()
              }
            });
            imgCounter++;
          }
        });
      }

      // Parse References
      const references = [];
      const refContainer = $('.mt-12.p-6, .mt-12.border-t');
      refContainer.find('ul li').each((i, li) => {
        const a = $(li).find('a');
        const desc = $(li).find('p').text().trim();
        if (a.length > 0) {
          references.push({
            name: a.text().replace(/^🔗\s*/, '').trim(),
            url: a.attr('href') || '',
            desc: desc
          });
        }
      });

      // Parse Related Posts
      const relatedPosts = [];
      const relatedContainer = $('.grid a, .mt-8.border-t grid a');
      relatedContainer.each((i, a) => {
        const href = $(a).attr('href');
        if (href && href.startsWith('/blog/')) {
          const relSlug = href.replace('/blog/', '').replace(/\/$/, '');
          const relTitle = $(a).find('h4').text().trim() || $(a).text().trim();
          relatedPosts.push({
            title: relTitle,
            slug: relSlug
          });
        }
      });

      // Parse CTA
      let ctaLink = null;
      let ctaText = null;
      const ctaContainer = $('.my-10.p-6, .mt-12.bg-gradient-to-r');
      if (ctaContainer.length > 0) {
        const ctaBtn = ctaContainer.find('a').first();
        if (ctaBtn.length > 0) {
          ctaLink = ctaBtn.attr('href') || null;
          ctaText = ctaBtn.text().replace(/^🚀\s*/, '').trim() || null;
        }
      }

      // Convert blocks list to JSON
      const editorJsData = {
        time: Date.now(),
        blocks: blocks,
        version: '2.29.0'
      };

      // Save to database
      await prisma.post.create({
        data: {
          title,
          slug,
          description: description || '',
          content: JSON.stringify(editorJsData),
          status: 'PUBLISHED',
          publishDate,
          keywords: title,
          ogTitle: title,
          ogDescription: description || '',
          ogImage,
          altImage,
          caption,
          authorId: adminUser.id,
          editorName,
          editorTitle,
          categoryId: defaultCategory.id,
          ctaLink,
          ctaText,
          references: references.length > 0 ? JSON.stringify(references) : null,
          relatedPosts: relatedPosts.length > 0 ? JSON.stringify(relatedPosts) : null
        }
      });

      console.log(`✅ Successfully imported "${title}"`);
      importCount++;
    }

    console.log(`\n🎉 Import finished! Successfully imported ${importCount} old blog posts.`);

  } catch (error) {
    console.error('❌ Error during import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
