# ⚡ Hệ Thống CMS Quản Trị Bài Viết Tĩnh Cho Astro (Trợ Lý Số)

Đây là hệ thống CMS (Content Management System) quản trị nội dung độc lập viết bằng Node.js (Express), sử dụng Prisma ORM và SQLite/PostgreSQL. Hệ thống có nhiệm vụ giúp người dùng đăng bài viết, nén tối ưu ảnh, theo dõi chỉ số RankMath SEO trực gian thực và tự động sinh file Astro tĩnh để dự án tự động xây dựng (Build & Deploy) đồng bộ lên GitHub.

---

## 🚀 Tính Năng Chính

1. **Trình Soạn Thảo EditorJS:** Viết bài dạng block-based hiện đại, tạo bài viết có cấu trúc dữ liệu cực kỳ sạch (JSON).
2. **SEO Audit Thời Gian Thực (RankMath-like):** Chấm điểm bài viết từ 0-100 dựa trên từ khóa chính, độ dài mô tả, mật độ từ khóa, sự hiện diện của ảnh Alt và liên kết.
3. ** Sharp Image Optimizer:** Tự động resize ảnh đại diện/minh họa về kích thước chuẩn **1200x630px**, chuyển sang dạng `.webp` và nén dung lượng xuống **dưới 100KB** để tối đa điểm PageSpeed.
4. **Tự Động Sinh File Astro & Cập Nhật Sitemap:**
   - Tạo tệp `src/pages/blog/<slug>/index.astro` theo đúng template chuẩn SEO.
   - Thêm bài viết mới vào đầu danh sách posts trong `src/pages/blog/index.astro`.
   - Cập nhật cơ sở dữ liệu tìm kiếm `searchIndex` trong `src/layouts/Layout.astro`.
   - Thêm URL của bài viết vào sơ đồ trang web `public/sitemap.xml`.
5. **Đồng Bộ GitHub Tự Động:** Mỗi khi nhấn **Publish**, Backend sẽ tự động chạy các lệnh git add, commit và push lên GitHub repository của bạn để trigger Auto Build.
6. **Quản Lý Phiên Bản (Revisions):** Lưu lại lịch sử bài viết mỗi lần nhấn lưu, cho phép so sánh và khôi phục lại phiên bản cũ giống như WordPress Revisions.
7. **Dashboard Module hóa:** Tích hợp thống kê lượng truy cập Google Analytics 4 (GA4) và từ khóa nhấp chuột Google Search Console (GSC). Hỗ trợ sẵn các cổng mở rộng cho Google Ads, PageSpeed, Microsoft Clarity, Bing Webmaster sau này.

---

## 🛠️ Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Khởi Chạy Local (Môi Trường Phát Triển Cục Bộ)

Hệ thống local mặc định sử dụng cơ sở dữ liệu gọn nhẹ SQLite không cần cài đặt thêm phần mềm bổ sung.

**Bước 1: Di chuyển vào thư mục cms và cài đặt thư viện**
```bash
cd cms
npm install
```

**Bước 2: Đồng bộ cơ sở dữ liệu SQLite**
```bash
npx prisma db push
```

**Bước 3: Gieo hạt (Seed) dữ liệu tài khoản quản trị mặc định và danh mục**
```bash
npm run prisma:seed
```

**Bước 4: Khởi chạy dự án ở chế độ phát triển (Development)**
```bash
npm run dev
```
➔ Server CMS sẽ chạy tại địa chỉ: **`http://localhost:5000`**

---

### 2. Khởi Chạy Bằng Docker Compose (Production / Môi Trường Thực Tế)

Cấu hình Docker Compose sẽ tự động thiết lập máy chủ database PostgreSQL và khởi chạy app backend Node.js.

**Bước 1: Khởi chạy các Containers**
```bash
docker-compose up -d --build
```

**Bước 2: Chạy migration & seed database trong container**
```bash
docker-compose exec cms npx prisma db push
docker-compose exec cms npm run prisma:seed
```

---

## 🔑 Thông Tin Tài Khoản Mặc Định

- **Tài khoản (Tên đăng nhập / Email):** `admin`
- **Mật khẩu:** `thaonguyen1`

*(Bạn có thể thay đổi họ tên, mật khẩu hoặc phân quyền thành viên trong mục **Thành viên** trên thanh công cụ quản trị).*
