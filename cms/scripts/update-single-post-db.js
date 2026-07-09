import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

const slug = process.argv[2];
if (!slug) {
  console.error('❌ Please specify a slug. Example: node update-single-post-db.js lichcatdien');
  process.exit(1);
}

const blogDir = path.resolve('../src/pages/blog');
const postDir = path.join(blogDir, slug);
const astroFilePath = path.join(postDir, 'index.astro');

if (!fs.existsSync(astroFilePath)) {
  console.error(`❌ Astro file not found at: ${astroFilePath}`);
  process.exit(1);
}

async function run() {
  console.log(`🏁 Syncing/Updating post: /blog/${slug}/ in database...`);

  try {
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminUser) {
      console.error('❌ Default admin user not found.');
      process.exit(1);
    }

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

    const content = fs.readFileSync(astroFilePath, 'utf8');
    const $ = cheerio.load(content);

    let title = '';
    let description = '';

    const layoutMatch = content.match(/<Layout\s+title="([^"]+)"\s+description="([^"]+)"/s) || 
                        content.match(/<Layout\s+title="([^"]+)"/s);
    
    if (layoutMatch) {
      title = layoutMatch[1];
      const descMatch = content.match(/description="([^"]+)"/);
      description = descMatch ? descMatch[1] : '';
    }

    if (!title) {
      title = $('h1').text().trim() || slug;
    }

    let editorName = null;
    let editorTitle = null;
    let publishDate = new Date();

    const dateMatch = content.match(/Cập nhật:?\s*(\d{2})\/(\d{2})\/(\d{4})/i) ||
                      content.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (dateMatch) {
      publishDate = new Date(`${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}T00:00:00.000Z`);
    }

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

    let ogImage = '';
    let altImage = '';
    let caption = '';

    const heroImg = $('.mb-8 img').first() || $('img').first();
    if (heroImg.length > 0) {
      ogImage = heroImg.attr('src') || '';
      altImage = heroImg.attr('alt') || '';
      const captionText = heroImg.parent().find('p').text() || heroImg.next('p').text();
      if (captionText) {
        caption = captionText.replace(/^Hình\s*\d*:\s*/i, '').trim();
      }
    }

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

    const editorJsData = {
      time: Date.now(),
      blocks: blocks,
      version: '2.29.0'
    };

    const dataPayload = {
      title,
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
    };

    // Upsert into database
    const post = await prisma.post.findUnique({ where: { slug } });
    if (post) {
      await prisma.post.update({
        where: { id: post.id },
        data: dataPayload
      });
      console.log(`✅ Successfully updated existing database record for "${title}"`);
    } else {
      await prisma.post.create({
        data: {
          slug,
          ...dataPayload
        }
      });
      console.log(`✅ Successfully created new database record for "${title}"`);
    }

  } catch (error) {
    console.error('❌ Error updating post in database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
