import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function listUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy danh sách người dùng' });
  }
}

export async function createUser(req, res) {
  const { email, name, password, role } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
  }

  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: 'Email đã tồn tại trên hệ thống' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role || 'VIEWER'
      }
    });

    return res.status(201).json({
      message: 'Tạo tài khoản thành công',
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi tạo tài khoản' });
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const { name, role, isActive, password } = req.body;

  try {
    const data = { name, role, isActive };
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(password, salt);
    }

    const user = await prisma.user.update({
      where: { id },
      data
    });

    return res.json({
      message: 'Cập nhật tài khoản thành công',
      user: { id: user.id, name: user.name, role: user.role, isActive: user.isActive }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi cập nhật tài khoản' });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  if (req.user.id === id) {
    return res.status(400).json({ message: 'Không thể xóa tài khoản của chính mình' });
  }

  try {
    await prisma.user.delete({ where: { id } });
    return res.json({ message: 'Xóa tài khoản thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi xóa tài khoản' });
  }
}
