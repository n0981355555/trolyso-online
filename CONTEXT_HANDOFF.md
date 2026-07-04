# Báo Cáo Bàn Giao Bối Cảnh Dự Án (Context Handoff)

**Dành cho Phiên làm việc mới (New Chat Session)**

> [!IMPORTANT]
> **Hướng dẫn cho Agent mới:** Hãy đọc kỹ tài liệu này để nắm bắt toàn bộ trạng thái hiện tại của dự án Trợ Lý Số (trolyso.online) mà không cần yêu cầu người dùng giải thích lại từ đầu.

---

## 1. Các Tính Năng Đã Hoàn Thành Gần Đây

### A. Công cụ Tính Lương Hưu Dự Kiến
* **Đường dẫn:** `src/pages/calculators/tinh-luong-huu/index.astro`
* **Nội dung:** Giải thuật toán tự động tính lộ trình nghỉ hưu theo Nghị định 135/2020/NĐ-CP, tính tỷ lệ hưởng lương hưu tối đa 75% và tính trợ cấp một lần cho các năm đóng dư. Hỗ trợ song ngữ Anh - Việt.

### B. Bài viết SEO "Tính Tuổi Nghỉ Hưu 2026"
* **Đường dẫn:** `src/pages/blog/tinh-tuoi-nghi-huu-2026/index.astro`
* **Nội dung:** Tích hợp Mục lục neo liên kết (TOC), CTA dẫn về công cụ tính lương hưu. Hình ảnh WebP tối ưu chuẩn SEO.

### C. Trình Tạo Ảnh AI Miễn Phí (Đã Khắc Phục Lỗi)
* **Đường dẫn:** `src/pages/calculators/tao-anh-ai/index.astro`
* **Cơ chế hoạt động:** 
  * Tích hợp gọi API qua cổng công cộng miễn phí: `https://image.pollinations.ai/prompt/...`
  * Đã khắc phục lỗi **401 Unauthorized** (bằng cách chuyển sang cổng public proxy) và lỗi **504 Gateway Timeout** (bằng cách bổ sung bộ chọn mô hình AI).
  * **Tính năng nổi bật:** Có bộ chọn **Mô hình AI** động (`Flux` - đẹp nhất, `Ideogram Turbo` - siêu nhanh 2-3s không nghẽn, `GPT Image` - nghệ thuật, `Z-Image` - sáng tạo).
  * Đã khắc phục lỗi **báo lỗi sớm (onerror)** bằng biến cờ trạng thái `isGenerating`.

---

## 2. Quy Trình Viết & Đăng Bài SEO Chuẩn Website (Checklist Bắt Buộc)

Khi người dùng yêu cầu viết hoặc đăng bài viết blog chuẩn SEO mới, Agent tiếp theo cần tuân thủ nghiêm ngặt quy trình 3 bước sau:

### Bước 1: Tạo trang blog mới
* Tạo file tại: `src/pages/blog/<slug-viet-tat-khong-dau>/index.astro`.
* Nội dung chứa: Tiêu đề H1, các phân đoạn H2/H3 rõ ràng, có bảng biểu hoặc hộp lưu ý làm nổi bật nội dung.
* **Mục lục bài viết (Table of Contents):** Chứa các neo liên kết (anchor link) đặt dưới đoạn mở bài để nhảy nhanh đến các thẻ H2/H3.
* **Call To Action (CTA):** Đặt ở cuối bài viết dẫn link về công cụ tính toán tương ứng trên website để tăng tỷ lệ chuyển đổi.

### Bước 2: Tối ưu hình ảnh chuẩn SEO
* **Định dạng & Dung lượng:** Bắt buộc dùng định dạng thế hệ mới `.webp`, nén dung lượng dưới 100KB để tối ưu PageSpeed.
* **Tên file ảnh:** Đặt tên tiếng Việt không dấu, nối bằng dấu gạch ngang (Ví dụ: `tinh-tuoi-nghi-huu-2026-hero.webp`).
* **Thẻ Alt:** Điền mô tả chi tiết bằng tiếng Việt không dấu, viết thường, nối bằng dấu gạch ngang (Ví dụ: `alt="huong-dan-tra-cuu-tuoi-nghi-huu-2026"`). Tuyệt đối không để trống alt.

### Bước 3: Đồng bộ hóa toàn hệ thống
* **Danh mục Blog:** Thêm thông tin bài viết (Tiêu đề, slug, mô tả, ngày đăng, ảnh đại diện) vào đầu mảng `posts` trong file `src/pages/blog/index.astro`.
* **Tìm kiếm nhanh:** Đăng ký URL bài viết vào cơ sở dữ liệu `searchIndex` trong file `src/layouts/Layout.astro`.
* **Sơ đồ trang web:** Đăng ký URL bài viết vào file `public/sitemap.xml`.

---

## 3. Trạng Thái Hiện Tại & Đồng Bộ
Mọi tính năng đã được kiểm thử biên dịch `npm run build` thành công 100%, không phát sinh bất kỳ lỗi nào. Bối cảnh dự án đã sẵn sàng để tiếp tục phát triển.
