import { PrismaClient } from '@prisma/client';
import analyticsModule from '../utils/analytics-module.js';

const prisma = new PrismaClient();

export async function getDashboardStats(req, res) {
  try {
    // 1. Query database counts
    const totalPosts = await prisma.post.count();
    const publishedCount = await prisma.post.count({ where: { status: 'PUBLISHED' } });
    const draftCount = await prisma.post.count({ where: { status: 'DRAFT' } });
    const trashCount = await prisma.post.count({ where: { status: 'TRASH' } });
    
    // 2. Query Analytics module GSC/GA
    const analytics = await analyticsModule.getDashboardData();
    
    // 3. Top posts (Mock / DB views or recent posts if GSC not returning direct details)
    const recentPosts = await prisma.post.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        publishDate: true,
        updatedAt: true
      }
    });

    return res.json({
      counts: {
        total: totalPosts,
        published: publishedCount,
        drafts: draftCount,
        trash: trashCount
      },
      analytics: {
        overview: analytics.overview,
        chartData: analytics.chartData,
        topKeywords: analytics.topKeywords,
        modulesStatus: analytics.modulesStatus
      },
      recentPosts
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ message: 'Lỗi lấy dữ liệu thống kê Dashboard' });
  }
}
