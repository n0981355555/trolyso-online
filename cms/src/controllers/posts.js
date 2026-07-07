import { PrismaClient } from '@prisma/client';
import { generateAstroPage, updateBlogIndex, updateSearchIndex, updateSitemap, editorJsToHtml } from '../utils/astro-generator.js';
import { analyzeSeo } from '../utils/seo-analyzer.js';
import { pushToGithub } from '../utils/git-pusher.js';

const prisma = new PrismaClient();

export async function listPosts(req, res) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy danh sách bài viết' });
  }
}

export async function getPost(req, res) {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
        revisions: {
          orderBy: { createdAt: 'desc' },
          include: { updatedBy: { select: { name: true } } }
        }
      }
    });
    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }
    
    // Run SEO Analysis on load for real-time score
    const htmlContent = editorJsToHtml(post.content);
    const seoResult = analyzeSeo({
      ...post,
      contentHtml: htmlContent
    });

    return res.json({
      ...post,
      seoScore: seoResult.score,
      seoChecks: seoResult.checks
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy thông tin bài viết' });
  }
}

export async function createPost(req, res) {
  const { 
    title, slug, description, content, status, keywords, 
    canonicalUrl, robots, ogTitle, ogDescription, ogImage, 
    altImage, caption, twitterCard, readingTime, editorName, editorTitle, 
    categoryId, ctaLink, ctaText, references, relatedPosts 
  } = req.body;

  if (!title || !slug) {
    return res.status(400).json({ message: 'Tiêu đề và Slug là bắt buộc' });
  }

  // Format slug automatically
  const cleanSlug = slug
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  try {
    const exists = await prisma.post.findUnique({ where: { slug: cleanSlug } });
    if (exists) {
      return res.status(400).json({ message: 'Slug này đã tồn tại, vui lòng đổi tên khác' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug: cleanSlug,
        description: description || '',
        content: content || '{"blocks":[]}',
        status: status || 'DRAFT',
        keywords,
        canonicalUrl,
        robots: robots || 'index, follow',
        ogTitle: ogTitle || title,
        ogDescription: ogDescription || description || '',
        ogImage,
        altImage,
        caption,
        twitterCard: twitterCard || 'summary_large_image',
        readingTime: parseInt(readingTime || 5),
        editorName,
        editorTitle,
        categoryId,
        ctaLink,
        ctaText,
        references,
        relatedPosts,
        authorId: req.user.id,
        publishDate: status === 'PUBLISHED' ? new Date() : null
      }
    });

    // Create revision
    await prisma.revision.create({
      data: {
        postId: post.id,
        title: post.title,
        content: post.content,
        updatedById: req.user.id
      }
    });

    // Trigger publish logic if status is published
    if (post.status === 'PUBLISHED') {
      await publishProcess(post);
    }

    return res.status(201).json({ message: 'Tạo bài viết thành công', post });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi tạo bài viết' });
  }
}

export async function updatePost(req, res) {
  const { id } = req.params;
  const { 
    title, slug, description, content, status, keywords, 
    canonicalUrl, robots, ogTitle, ogDescription, ogImage, 
    altImage, caption, twitterCard, readingTime, editorName, editorTitle, 
    categoryId, ctaLink, ctaText, references, relatedPosts 
  } = req.body;

  try {
    const originalPost = await prisma.post.findUnique({ where: { id } });
    if (!originalPost) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }

    // Prepare update data
    const data = {
      title,
      description,
      content,
      status,
      keywords,
      canonicalUrl,
      robots,
      ogTitle,
      ogDescription,
      ogImage,
      altImage,
      caption,
      twitterCard,
      readingTime: parseInt(readingTime || 5),
      editorName,
      editorTitle,
      categoryId,
      ctaLink,
      ctaText,
      references,
      relatedPosts
    };

    if (slug && slug !== originalPost.slug) {
      const cleanSlug = slug
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      const exists = await prisma.post.findUnique({ where: { slug: cleanSlug } });
      if (exists) {
        return res.status(400).json({ message: 'Slug này đã tồn tại' });
      }
      data.slug = cleanSlug;
    }

    if (status === 'PUBLISHED' && originalPost.status !== 'PUBLISHED') {
      data.publishDate = new Date();
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data
    });

    // Create Revision if content changed
    if (content !== originalPost.content || title !== originalPost.title) {
      await prisma.revision.create({
        data: {
          postId: updatedPost.id,
          title: updatedPost.title,
          content: updatedPost.content,
          updatedById: req.user.id
        }
      });
    }

    // Trigger publish logic
    if (updatedPost.status === 'PUBLISHED') {
      const author = await prisma.user.findUnique({ where: { id: updatedPost.authorId } });
      const category = updatedPost.categoryId 
        ? await prisma.category.findUnique({ where: { id: updatedPost.categoryId } }) 
        : null;
      
      const fullPostForPublish = {
        ...updatedPost,
        altImage,
        caption
      };
      
      await publishProcess(fullPostForPublish, author, category);
    }

    return res.json({ message: 'Cập nhật bài viết thành công', post: updatedPost });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi cập nhật bài viết' });
  }
}

export async function deletePost(req, res) {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }

    // Move to trash or hard delete if already in TRASH
    if (post.status === 'TRASH') {
      await prisma.post.delete({ where: { id } });
      return res.json({ message: 'Đã xóa vĩnh viễn bài viết khỏi thùng rác' });
    } else {
      await prisma.post.update({
        where: { id },
        data: { status: 'TRASH' }
      });
      return res.json({ message: 'Đã chuyển bài viết vào thùng rác' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi xóa bài viết' });
  }
}

export async function restorePost(req, res) {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.status !== 'TRASH') {
      return res.status(400).json({ message: 'Bài viết không nằm trong thùng rác' });
    }

    const restored = await prisma.post.update({
      where: { id },
      data: { status: 'DRAFT' }
    });

    return res.json({ message: 'Đã khôi phục bài viết thành bản nháp', post: restored });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khôi phục bài viết' });
  }
}

export async function duplicatePost(req, res) {
  const { id } = req.params;
  try {
    const original = await prisma.post.findUnique({ where: { id } });
    if (!original) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết để nhân bản' });
    }

    const newSlug = `${original.slug}-copy-${Date.now()}`;
    const duplicated = await prisma.post.create({
      data: {
        ...original,
        id: undefined,
        title: `${original.title} (Bản sao)`,
        slug: newSlug,
        status: 'DRAFT',
        publishDate: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return res.status(201).json({ message: 'Nhân bản bài viết thành công', post: duplicated });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi nhân bản bài viết' });
  }
}

export async function restoreRevision(req, res) {
  const { revisionId } = req.body;
  try {
    const revision = await prisma.revision.findUnique({ where: { id: revisionId } });
    if (!revision) {
      return res.status(404).json({ message: 'Không tìm thấy phiên bản nháp cũ' });
    }

    const restoredPost = await prisma.post.update({
      where: { id: revision.postId },
      data: {
        title: revision.title,
        content: revision.content
      }
    });

    return res.json({ message: 'Khôi phục phiên bản lịch sử thành công', post: restoredPost });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khôi phục phiên bản lịch sử' });
  }
}

// SEO Score calculation helper for FE editor
export async function checkPostSeo(req, res) {
  const { title, slug, description, content, keywords, featuredImage, altImage, caption } = req.body;
  const htmlContent = editorJsToHtml(content);
  const result = analyzeSeo({
    title,
    slug,
    description,
    contentHtml: htmlContent,
    keywords,
    featuredImage,
    altImage,
    caption
  });

  return res.json(result);
}

// Core workflow for publishing a post
async function publishProcess(post, authorArg, categoryArg) {
  console.log(`📡 Bắt đầu quy trình xuất bản tĩnh Astro cho bài: ${post.slug}`);
  
  let author = authorArg;
  if (!author) {
    author = await prisma.user.findUnique({ where: { id: post.authorId } });
  }
  
  let category = categoryArg;
  if (!category && post.categoryId) {
    category = await prisma.category.findUnique({ where: { id: post.categoryId } });
  }

  // 1. Generate static HTML/Astro file
  generateAstroPage(post, author, category);
  
  // 2. Insert into pages/blog/index.astro
  updateBlogIndex(post, category?.name);
  
  // 3. Insert into Layout.astro searchIndex
  updateSearchIndex(post);
  
  // 4. Insert into sitemap.xml
  updateSitemap(post);
  
  // 5. Run auto-commit & push to GitHub
  const commitMessage = `CMS Auto-publish: ${post.title} (${post.slug})`;
  await pushToGithub(commitMessage);
}
