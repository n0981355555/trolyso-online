import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'trolyso_super_secret_jwt_key_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'trolyso_super_secret_refresh_jwt_key_2026';

// Store refresh tokens in-memory (or database in production)
let refreshTokens = [];

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}

function generateRefreshToken(user) {
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  refreshTokens.push(token);
  return token;
}

export async function login(req, res) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ tên tài khoản và mật khẩu' });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: username },
          { name: username }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi hệ thống' });
  }
}

export async function tokenRefresh(req, res) {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ message: 'Yêu cầu token làm mới' });
  }
  
  if (!refreshTokens.includes(token)) {
    return res.status(403).json({ message: 'Token làm mới không tồn tại hoặc đã bị hủy' });
  }

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    
    if (!user || !user.isActive) {
      return res.status(403).json({ message: 'Tài khoản không khả dụng' });
    }

    const accessToken = generateAccessToken(user);
    return res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Token làm mới không hợp lệ hoặc đã hết hạn' });
  }
}

export async function logout(req, res) {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(t => t !== token);
  return res.json({ message: 'Đăng xuất thành công' });
}

export async function getProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      isActive: user.isActive,
      lastLogin: user.lastLogin
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống' });
  }
}

export async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Vui lòng cung cấp mật khẩu cũ và mật khẩu mới' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Mật khẩu cũ không chính xác' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedNewPassword }
    });

    return res.json({ message: 'Đổi mật khẩu thành công!' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống' });
  }
}
