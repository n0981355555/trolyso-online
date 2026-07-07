import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');
  
  // Hash the admin password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('thaonguyen1', salt);
  
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin' },
    update: {
      password: hashedPassword,
      name: 'Thảo Nguyên Admin',
      role: 'ADMIN',
      isActive: true
    },
    create: {
      email: 'admin',
      name: 'Thảo Nguyên Admin',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true
    }
  });
  
  console.log(`✅ Admin account created/updated: ${admin.email}`);
  
  // Seed some categories
  const categories = [
    { name: 'Tiện ích', slug: 'tien-ich', description: 'Các công cụ tiện ích đời sống và văn phòng', color: '#3b82f6' },
    { name: 'Hành chính', slug: 'hanh-chinh', description: 'Thủ tục hành chính và văn bản pháp luật', color: '#10b981' },
    { name: 'Tuyển dụng', slug: 'tuyen-dung', description: 'CV, đàm phán lương và việc làm', color: '#f59e0b' },
    { name: 'Sức khỏe', slug: 'suc-khoe', description: 'Các chỉ số sức khỏe và BMI', color: '#ef4444' }
  ];
  
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
  }
  
  console.log('✅ Default categories seeded.');
  console.log('🌱 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
