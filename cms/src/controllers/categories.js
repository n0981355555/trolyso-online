import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Categories
export async function getCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { posts: true } } }
    });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy danh mục' });
  }
}

export async function createCategory(req, res) {
  const { name, slug, description, color } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ message: 'Tên và Slug danh mục bắt buộc nhập' });
  }

  try {
    const category = await prisma.category.create({
      data: { name, slug, description, color }
    });
    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi tạo danh mục' });
  }
}

export async function updateCategory(req, res) {
  const { id } = req.params;
  const { name, slug, description, color } = req.body;

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, description, color }
    });
    return res.json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi cập nhật danh mục' });
  }
}

export async function deleteCategory(req, res) {
  const { id } = req.params;
  try {
    await prisma.category.delete({ where: { id } });
    return res.json({ message: 'Xóa danh mục thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi xóa danh mục' });
  }
}

// Tags
export async function getTags(req, res) {
  try {
    const tags = await prisma.tag.findMany({
      include: { _count: { select: { posts: true } } }
    });
    return res.json(tags);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy danh sách tag' });
  }
}

export async function createTag(req, res) {
  const { name, slug } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ message: 'Tên và Slug tag bắt buộc nhập' });
  }

  try {
    const tag = await prisma.tag.create({
      data: { name, slug }
    });
    return res.status(201).json(tag);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi tạo tag' });
  }
}

export async function deleteTag(req, res) {
  const { id } = req.params;
  try {
    await prisma.tag.delete({ where: { id } });
    return res.json({ message: 'Xóa tag thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi xóa tag' });
  }
}
