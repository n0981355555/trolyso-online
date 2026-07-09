# Báo Cáo Bàn Giao Bối Cảnh Dự Án (Context Handoff)

**Dành cho Phiên làm việc mới (New Chat Session)**

> [!IMPORTANT]
> **Hướng dẫn cho Agent mới:** Hãy đọc kỹ tài liệu này để nắm bắt toàn bộ trạng thái hiện tại của dự án Trợ Lý Số (trolyso.online) mà không cần yêu cầu người dùng giải thích lại từ đầu.

---

## 1. Các Tính Năng Đã Hoàn Thành Gần Đây (Mới Nhất)

### A. Hệ thống CMS Quản trị Nội dung tự động xuất bản sang Astro
* **Mô tả:** Hệ thống quản trị nội dung hoàn chỉnh chạy bằng NodeJS (Express, Prisma ORM, SQLite) kết nối với Astro Frontend.
* **Quy trình hoạt động:** 
  * Khi nhấn xuất bản (Publish) một bài viết trong CMS, backend sẽ gọi tệp tự động sinh bài viết `astro-generator.js` để ghi trực tiếp tệp Astro tương ứng vào thư mục `src/pages/blog/<slug>/index.astro`.
  * Đồng thời, backend tự động thêm bài viết vào danh mục bài viết `src/pages/blog/index.astro`, nạp URL vào searchIndex của `src/layouts/Layout.astro`, và cập nhật tệp sơ đồ trang web `public/sitemap.xml`.

### B. Tính năng chèn ảnh SEO nâng cao (`AstroImage`) & Upload trực tiếp từ máy tính
* **Mô tả:** Tích hợp khối chèn ảnh tùy chỉnh trong EditorJS (`AstroImage`) cho phép chèn 5-10 ảnh vào bất kỳ vị trí nào trong bài viết.
* **Tải ảnh máy tính:** Ngay trong modal chọn ảnh, người dùng có thể tải trực tiếp ảnh từ máy tính cá nhân. Hệ thống tự động tối ưu hóa qua thư viện **Sharp** sang định dạng `.webp` dung lượng dưới 100KB, lưu vào `public/images/blog/` và hiển thị ảnh trực quan (Preview).
* **Alt và Chú thích:** Mỗi ảnh bắt buộc điền thẻ `alt` mô tả (tiếng Việt không dấu) và `caption` chú thích hiển thị ngay dưới ảnh.

### C. Công cụ quét Calculators động làm link đích CTA
* **Mô tả:** Backend quét thư mục `src/pages/calculators/`, đọc tiêu đề trong thẻ `<Layout>` để lấy danh sách các công cụ hiện có (bao gồm cả Lịch cắt điện).
* **Giao diện:** Danh sách công cụ tự động hiển thị trong ô lựa chọn liên kết của nút hành động (CTA) ở màn hình viết bài mà không cần cấu hình cứng.

### D. Bộ dựng liên kết nội bộ (Related Posts)
* **Mô tả:** Giao diện cho phép nhập nhanh các bài viết liên quan (Tiêu đề, Slug, Chuyên mục) để chèn hộp liên kết nội bộ tự động dưới bài viết giúp tăng chỉ số SEO On-page.

---

## 2. Trạng Thái Triển Khai trên VPS (aaPanel)
Hệ thống đã được thiết lập chạy ngầm ổn định trên VPS với cấu hình:
1. **Tên miền chính (Astro Frontend):** `https://trolyso.online` (Chạy static file từ thư mục `dist/` do Nginx quản lý).
2. **Tên miền phụ quản trị (CMS Backend):** `https://cms.trolyso.online`
   * Được cấu hình thông qua **Reverse Proxy** (Proxy ngược) trong aaPanel: proxy từ `/` sang cổng nội bộ `http://127.0.0.1:5000`.
   * Cài đặt chứng chỉ bảo mật SSL Let's Encrypt (đã cấu hình *Force HTTPS*).
   * Cơ sở dữ liệu SQLite cục bộ được tách khỏi Git (`.gitignore`) để tránh xung đột dữ liệu giữa Local và VPS.
3. **Cách khởi động lại CMS ngầm trên VPS (PM2):**
   * Truy cập Terminal của VPS:
     ```bash
     cd /www/wwwroot/trolyso.online/cms
     pm2 restart "trolyso-cms" || pm2 start src/server.js --name "trolyso-cms"
     ```

---

## 3. Quy Trình Viết & Đăng Bài SEO Chuẩn Website (Checklist Bắt Buộc)

Khi người dùng yêu cầu viết hoặc đăng bài viết blog chuẩn SEO mới, Agent tiếp theo cần tuân thủ nghiêm ngặt quy trình sau:

### Bước 1: Cấu trúc bài viết chuẩn SEO
* Nội dung chứa: Tiêu đề H1, các phân đoạn H2/H3 rõ ràng, có bảng biểu hoặc hộp lưu ý làm nổi bật nội dung.
* **Mục lục bài viết (Table of Contents):** Chứa các neo liên kết (anchor link) đặt dưới đoạn mở bài để nhảy nhanh đến các thẻ H2/H3.
* **Call To Action (CTA):** Đặt ở cuối bài viết dẫn link về công cụ tương ứng trên website để tăng tỷ lệ chuyển đổi.
* **Hộp tác giả (E-E-A-T Author Box):** Bắt buộc chèn ở đầu trang bài viết với thông tin chuyên môn rõ ràng.

### Bước 2: Tối ưu hình ảnh chuẩn SEO
* **Mật độ:** Trung bình từ 350 - 400 từ / 1 ảnh.
* **Định dạng & Dung lượng:** Bắt buộc dùng định dạng thế hệ mới `.webp` nén dưới 100KB.
* **Hiển thị hình ảnh:** Tuyệt đối không dùng các class bóp kích thước như `max-h-[300px]` hay `object-cover`. Sử dụng class chuẩn: `class="w-full h-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"`.
* **Thẻ Alt:** Điền mô tả chi tiết bằng tiếng Việt không dấu, viết thường, nối bằng dấu gạch ngang (Ví dụ: `alt="huong-dan-tra-cuu-tuoi-nghi-huu-2026"`). Tuyệt đối không để trống alt.
* **Chú thích ảnh (Image Captions):** Ngay dưới mỗi ảnh chèn thẻ mô tả nội dung bằng tiếng Việt chuẩn: `<p class="text-xs text-center text-slate-400 dark:text-slate-500 mt-2 italic font-normal">Hình: [Mô tả chi tiết nội dung hình ảnh]</p>`.
* **Quy chuẩn prompt tạo ảnh AI (Style Guide):** Bắt buộc sử dụng prompt mô tả phong cách thiết kế đồng bộ sau:
  * `Flat Vector Illustration, cute cartoon characters in modern SaaS style with slightly large heads, dark blue outlines, light pastel colors, bright white background, clean layout, vector website UI mockups, simple illustrative icons, financial infographics, minimal shadows, soft lines, style similar to Storyset, DrawKit, ManyPixels, unDraw, professional, friendly, modern, highly detailed, no photorealistic, no 3D, no anime, no watermark, no text.`

### Bước 3: Đồng bộ hóa toàn hệ thống
* **Danh mục Blog:** Thêm thông tin bài viết vào đầu mảng `posts` trong file `src/pages/blog/index.astro`.
* **Tìm kiếm nhanh:** Đăng ký URL bài viết vào cơ sở dữ liệu `searchIndex` trong file `src/layouts/Layout.astro`.
* **Sơ đồ trang web:** Đăng ký URL bài viết vào file `public/sitemap.xml`.

---

## 4. Môi trường phát triển cục bộ (Localhost)
Khi chạy ở local (máy cá nhân), hãy khởi động đồng thời cả 2 máy chủ:
* **Astro Frontend (cổng 4321):** Chạy `npm run dev` ở thư mục gốc.
* **CMS Backend (cổng 5000):** Chạy `npm run dev` ở thư mục `/cms`.
