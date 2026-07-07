import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import fs from 'fs';
import { optimizeImage } from '../utils/image-optimizer.js';

const prisma = new PrismaClient();

// Multer memory storage configuration
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB raw image
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error('Chỉ chấp nhận các file ảnh định dạng JPG, JPEG, PNG, WEBP, GIF!'));
  }
}).single('file'); // EditorJS uses 'file' payload for uploads

export async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'Vui lòng chọn hình ảnh để tải lên' });
  }

  try {
    const altText = req.body.alt || '';
    const captionText = req.body.caption || '';
    
    // Process image with Sharp utility
    const result = await optimizeImage(req.file.buffer, req.file.originalname);
    
    // Save to Database
    const media = await prisma.media.create({
      data: {
        filename: result.filename,
        url: result.url,
        size: result.size,
        mimeType: 'image/webp',
        alt: altText,
        caption: captionText
      }
    });

    // EditorJS standard JSON format output for images tool
    return res.json({
      success: 1,
      file: {
        url: result.url,
        id: media.id,
        size: result.size,
        alt: media.alt,
        caption: media.caption
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: 0,
      message: `Lỗi upload: ${error.message}`
    });
  }
}

export async function listMedia(req, res) {
  try {
    const mediaList = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json(mediaList);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy thư viện media' });
  }
}

export async function deleteMedia(req, res) {
  const { id } = req.params;
  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return res.status(404).json({ message: 'Không tìm thấy tệp tin' });
    }
    
    // Delete local file safely
    const filePath = `../public${media.url}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    await prisma.media.delete({ where: { id } });
    return res.json({ message: 'Xóa tệp tin media thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi xóa tệp tin media' });
  }
}
