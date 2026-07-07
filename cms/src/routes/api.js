import express from 'express';
import { authenticateToken, requireRole } from '../middlewares/auth.js';
import { login, tokenRefresh, logout, getProfile, changePassword } from '../controllers/auth.js';
import { listUsers, createUser, updateUser, deleteUser } from '../controllers/users.js';
import { listPosts, getPost, createPost, updatePost, deletePost, restorePost, duplicatePost, restoreRevision, checkPostSeo } from '../controllers/posts.js';
import { getCategories, createCategory, updateCategory, deleteCategory, getTags, createTag, deleteTag } from '../controllers/categories.js';
import { uploadMiddleware, uploadImage, listMedia, deleteMedia } from '../controllers/media.js';
import { getDashboardStats } from '../controllers/dashboard.js';
import { getCalculators } from '../controllers/calculators.js';

const router = express.Router();

// AUTH ROUTES
router.post('/auth/login', login);
router.post('/auth/refresh', tokenRefresh);
router.post('/auth/logout', logout);
router.get('/auth/profile', authenticateToken, getProfile);
router.put('/auth/change-password', authenticateToken, changePassword);

// USERS MANAGEMENT ROUTES (ADMIN ONLY)
router.get('/users', authenticateToken, requireRole(['ADMIN']), listUsers);
router.post('/users', authenticateToken, requireRole(['ADMIN']), createUser);
router.put('/users/:id', authenticateToken, requireRole(['ADMIN']), updateUser);
router.delete('/users/:id', authenticateToken, requireRole(['ADMIN']), deleteUser);

// BLOG POSTS ROUTES
router.get('/posts', authenticateToken, listPosts);
router.get('/posts/:id', authenticateToken, getPost);
router.post('/posts', authenticateToken, requireRole(['ADMIN', 'EDITOR', 'AUTHOR']), createPost);
router.put('/posts/:id', authenticateToken, requireRole(['ADMIN', 'EDITOR', 'AUTHOR']), updatePost);
router.delete('/posts/:id', authenticateToken, requireRole(['ADMIN', 'EDITOR']), deletePost);
router.post('/posts/:id/restore', authenticateToken, requireRole(['ADMIN', 'EDITOR']), restorePost);
router.post('/posts/:id/duplicate', authenticateToken, requireRole(['ADMIN', 'EDITOR', 'AUTHOR']), duplicatePost);
router.post('/posts/restore-revision', authenticateToken, requireRole(['ADMIN', 'EDITOR', 'AUTHOR']), restoreRevision);
router.post('/posts/check-seo', authenticateToken, checkPostSeo);

// CATEGORIES & TAGS ROUTES
router.get('/categories', getCategories);
router.post('/categories', authenticateToken, requireRole(['ADMIN', 'EDITOR']), createCategory);
router.put('/categories/:id', authenticateToken, requireRole(['ADMIN', 'EDITOR']), updateCategory);
router.delete('/categories/:id', authenticateToken, requireRole(['ADMIN', 'EDITOR']), deleteCategory);

router.get('/tags', getTags);
router.post('/tags', authenticateToken, requireRole(['ADMIN', 'EDITOR', 'AUTHOR']), createTag);
router.delete('/tags/:id', authenticateToken, requireRole(['ADMIN', 'EDITOR', 'AUTHOR']), deleteTag);

// MEDIA LIBRARY ROUTES
router.get('/media', authenticateToken, listMedia);
router.post('/media/upload', authenticateToken, requireRole(['ADMIN', 'EDITOR', 'AUTHOR']), uploadMiddleware, uploadImage);
router.delete('/media/:id', authenticateToken, requireRole(['ADMIN', 'EDITOR']), deleteMedia);

// DASHBOARD ROUTES
router.get('/dashboard/stats', authenticateToken, getDashboardStats);

// CALCULATORS/TOOLS DYNAMIC SCANNING ROUTE
router.get('/calculators', authenticateToken, getCalculators);

export default router;
