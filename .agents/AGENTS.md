# Quy tắc Viết Bài và Tối ưu Hình Ảnh SEO - Trợ Lý Số

Mỗi khi người dùng yêu cầu viết bài viết mới (Blog Post) chuẩn SEO, hệ thống Agent sẽ tuân thủ nghiêm ngặt các quy trình và quy tắc sau đây mà không cần hỏi lại:

## 1. Quy tắc Viết bài & Tạo trang tự động
* Tạo trang blog mới tại đường dẫn: `src/pages/blog/<slug-viet-tat-khong-dau>/index.astro`.
* Nội dung bài viết phải chứa tiêu đề chuẩn H1, các phân đoạn H2, H3 rõ ràng, có cấu trúc bảng biểu, hộp lưu ý làm nổi bật nội dung.
* Bài viết phải có phần **Mục lục bài viết (Table of Contents)** liên kết neo (anchor link) đặt dưới đoạn mở bài để người dùng dễ dàng chuyển nhanh đến các phần chính.
* Cuối bài viết phải chứa lời kêu gọi hành động (Call To Action - CTA) dẫn link về công cụ tính toán tương ứng của website để tăng tỷ lệ chuyển đổi.

## 2. Quy tắc Tối ưu Hình ảnh chuẩn SEO
* **Mật độ hình ảnh:** Cấu trúc bài viết cần phân bổ mật độ ảnh trung bình từ **350 - 400 từ / 1 ảnh** (bao gồm ảnh Hero đại diện và các ảnh minh họa thân bài).
* **Định dạng & Dung lượng:** Luôn sử dụng định dạng thế hệ mới `.webp` cho tất cả các ảnh mẫu chèn trong bài để đảm bảo tối ưu hóa PageSpeed dưới 100KB.
* **Tên file ảnh (độc nhất và chuẩn SEO):** Đặt tên bằng tiếng Việt không dấu, nối với nhau bằng dấu gạch ngang (Ví dụ: `luong-gross-la-gi-hero.webp`, `luong-gross-la-gi-flow.webp`).
* **Thẻ Alt:** Luôn điền thẻ `alt` mô tả ảnh bằng tiếng Việt không dấu, viết thường, nối bằng dấu gạch ngang (Ví dụ: `alt="cach-tinh-luong-gross-sang-net"`, `alt="cac-khoan-khau-tru-tu-luong-gross"`). Tuyệt đối không để trống alt.
* **Quy chuẩn prompt tạo ảnh AI (Style Guide):** Bắt buộc sử dụng cấu trúc prompt mô tả phong cách thiết kế đồng bộ sau:
  - *Prompt:* `Flat Vector Illustration, cute cartoon characters in modern SaaS style with slightly large heads, dark blue outlines, light pastel colors, bright white background, clean layout, vector website UI mockups, simple illustrative icons, financial infographics, minimal shadows, soft lines, style similar to Storyset, DrawKit, ManyPixels, unDraw, professional, friendly, modern, highly detailed, no photorealistic, no 3D, no anime, no watermark, no text.`

## 3. Quy tắc Đồng bộ hóa Hệ thống
* Nạp thông tin bài viết (Tiêu đề, slug, ngày đăng, mô tả) vào danh mục bài viết ở đầu mảng `posts` trong `src/pages/blog/index.astro`.
* Đăng ký URL bài viết vào cơ sở dữ liệu tìm kiếm nhanh `searchIndex` trong `src/layouts/Layout.astro`.
* Đăng ký URL bài viết vào sơ đồ trang web `public/sitemap.xml`.

## 4. Quy tắc nhắc nhở Đẩy mã nguồn (Push Git)
* Sau mỗi lần cập nhật mã nguồn thành công, Agent bắt buộc phải nhắc nhở người dùng thực hiện push code lên GitHub và hướng dẫn cách làm chi tiết bằng GitHub Desktop.

## 5. Quy tắc Thiết kế Công cụ & Tối ưu Trải nghiệm (E-E-A-T & Lighthouse)
* **Tích hợp Đa ngôn ngữ (Việt - Anh):** Tất cả các công cụ mới phải hỗ trợ chuyển đổi ngôn ngữ Việt - Anh đồng bộ thông qua đối tượng `translations` trong `src/layouts/Layout.astro` và kiểm tra trạng thái `localStorage.getItem("lang") === "en"` trong script tính toán.
* **Đảm bảo chuẩn E-E-A-T:** Mỗi bài viết blog mới bắt buộc phải chứa Hộp tác giả & Kiểm duyệt chuyên môn dạng Card (E-E-A-T Author Box) ở đầu trang với thông tin chuyên môn rõ ràng (như CPA, Thạc sĩ Luật, Chuyên gia Nhân sự...).
* **Tối ưu hóa Lighthouse (Accessibility & Performance):**
  - Tất cả các nút, ô nhập liệu, bộ chọn và liên kết (đặc biệt là liên kết chỉ chứa SVG ở footer) phải có thẻ `aria-label` mô tả rõ ràng hành động.
  - Các tài nguyên như font chữ phải khai báo `preconnect`.
  - Các script bên thứ ba nặng hoặc theo dõi (như Google Analytics/GTM) bắt buộc phải trì hoãn tải (defer/setTimeout) sau sự kiện window `load` để tối đa hóa điểm hiệu năng.
  - Đảm bảo độ tương phản màu sắc đạt chuẩn WCAG AA trong light mode (không dùng `text-slate-400` trực tiếp trên nền trắng mà không ghi đè độ tương phản).

## 6. Quy tắc Tạo Công cụ mới Chuẩn SEO & Schema
Mỗi khi tạo hoặc cập nhật một công cụ tính toán tiện ích mới (Calculator/Tool), Agent bắt buộc phải thực hiện các quy trình sau:
* **Tối ưu hóa Tiêu đề (Title) & Từ khóa hành động:** Đặt tiêu đề `<Layout title="...">` chứa các từ khóa kích thích hành động (như "Online", "Tự động", "Miễn phí", "Chuẩn 2026").
* **Bổ sung Cẩm nang Hướng dẫn E-E-A-T ở cuối trang:** 
  - Đặt phần nội dung dưới chân trang công cụ, nằm ngoài Tool Grid (sau khi thẻ Tool Grid đóng hoàn toàn để tránh vỡ layout).
  - Nội dung phải chi tiết bao gồm: Công thức tính toán rõ ràng, Ví dụ giả định bằng số cụ thể, và Căn cứ pháp lý (Luật/Nghị định) hoặc tiêu chuẩn kỹ thuật liên quan.
* **Tích hợp Dữ liệu Cấu trúc (JSON-LD Schemas):**
  - **WebApplication Schema:** Xác định ứng dụng web cho robot Google biết đây là một công cụ tương tác. Dùng `FinanceApplication` cho công cụ tài chính/thuế, hoặc `BusinessApplication` cho các công cụ tiện ích kinh doanh/văn phòng.
  - **FAQPage Schema:** Định dạng các câu hỏi thường gặp (FAQ) dưới dạng Rich Snippets để hiển thị trực tiếp các câu hỏi thả xuống trên kết quả tìm kiếm Google nhằm tăng tỷ lệ click (CTR).
