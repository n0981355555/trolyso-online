# Quy tắc Viết Bài và Tối ưu Hình Ảnh SEO - Trợ Lý Số

Mỗi khi người dùng yêu cầu viết bài viết mới (Blog Post) chuẩn SEO, hệ thống Agent sẽ tuân thủ nghiêm ngặt các quy trình và quy tắc sau đây mà không cần hỏi lại:

## 1. Quy tắc Viết bài & Tạo trang tự động
* Tạo trang blog mới tại đường dẫn: `src/pages/blog/<slug-viet-tat-khong-dau>/index.astro`.
* Nội dung bài viết phải chứa tiêu đề chuẩn H1, các phân đoạn H2, H3 rõ ràng, có cấu trúc bảng biểu, hộp lưu ý làm nổi bật nội dung.
* Bài viết phải có phần **Mục lục bài viết (Table of Contents)** liên kết neo (anchor link) đặt dưới đoạn mở bài để người dùng dễ dàng chuyển nhanh đến các phần chính.
* **Hiệu ứng Hover & Glow cho bài viết:** Tất cả các bài viết blog mới khi di chuột vào các khối thông tin (E-E-A-T Author Box, Mục lục bài viết, các thẻ Bài viết liên quan) phải có hiệu ứng sáng lên thông qua các class: `hover:border-brand-blue dark:hover:border-brand-mint hover:shadow-md transition duration-300` để tăng tính tương tác sinh động. Các liên kết trong Mục lục phải đổi màu và gạch chân khi hover: `hover:text-brand-blue dark:hover:text-brand-mint hover:underline transition duration-200`.
* Cuối bài viết phải chứa lời kêu gọi hành động (Call To Action - CTA) dẫn link về công cụ tính toán tương ứng của website để tăng tỷ lệ chuyển đổi.
* **Liên kết hữu ích & Trích dẫn nguồn (Authoritative Sources & Related Links):** Cuối bài viết bắt buộc phải có hai danh mục rõ ràng:
  - *Tài liệu tham khảo & Nguồn uy tín:* Trích dẫn trực tiếp nguồn cơ quan chính phủ/pháp luật liên quan (như `chinhphu.vn`, `gdt.gov.vn` hoặc các Nghị định/Luật liên quan) kèm mô tả ngắn.
  - *Bài viết liên quan hữu ích:* Liệt kê ít nhất 2-3 liên kết trỏ sang các bài viết blog cùng chủ đề trên trang web để tối ưu SEO internal link.

## 2. Quy tắc Tối ưu Hình ảnh chuẩn SEO
* **Mật độ hình ảnh:** Cấu trúc bài viết cần phân bổ mật độ ảnh trung bình từ **350 - 400 từ / 1 ảnh** (bao gồm ảnh Hero đại diện và các ảnh minh họa thân bài).
* **Định dạng & Dung lượng:** Luôn sử dụng định dạng thế hệ mới `.webp` cho tất cả các ảnh mẫu chèn trong bài để đảm bảo tối ưu hóa PageSpeed dưới 100KB.
* **Tên file ảnh (độc nhất và chuẩn SEO):** Đặt tên bằng tiếng Việt không dấu, nối với nhau bằng dấu gạch ngang (Ví dụ: `luong-gross-la-gi-hero.webp`, `luong-gross-la-gi-flow.webp`).
* **Hiển thị hình ảnh (Không co/móp ảnh):** Tuyệt đối không dùng các class bóp kích thước như `max-h-[300px]` hay `object-cover` cho ảnh minh họa vì sẽ làm co méo hoặc mất chi tiết hình vẽ. Chỉ dùng `class="w-full h-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"`.
* **Thẻ Alt:** Luôn điền thẻ `alt` mô tả ảnh bằng tiếng Việt không dấu, viết thường, nối bằng dấu gạch ngang (Ví dụ: `alt="cach-tinh-luong-gross-sang-net"`, `alt="cac-khoan-khau-tru-tu-luong-gross"`). Tuyệt đối không để trống alt.
* **Mô tả hình ảnh (Image Captions):** Ngay dưới mỗi thẻ `<img>` minh họa, bắt buộc phải chèn thẻ mô tả nội dung ảnh bằng tiếng Việt chuẩn có số thứ tự rõ ràng (Hình 1, Hình 2, Hình 3, ...): `<p class="text-xs text-center text-slate-400 dark:text-slate-500 mt-2 italic font-normal">Hình [Số thứ tự]: [Mô tả chi tiết nội dung hình ảnh]</p>`. Tuyệt đối không để chữ "Hình:" chung chung không có số thứ tự.
* **Quy chuẩn prompt tạo ảnh AI (Style Guide):** Bắt buộc sử dụng cấu trúc prompt mô tả phong cách **Manga Chibi Màu Nước Nhật Bản (Kawaii Chibi Watercolor Style)** đồng bộ sau:
  - *Prompt:* `Cute kawaii chibi anime character, cozy Japanese manga illustration style, soft hand-drawn colored pencil outlines, gentle digital watercolor paint, warm pastel colors, light cream background, clean minimalist layout, soft lighting, highly detailed, friendly, professional, style similar to cozy Japanese lifestyle infographics, no photorealistic, no 3D, no watermark, no text.`

## 3. Quy tắc Đồng bộ hóa Hệ thống
* Nạp thông tin bài viết (Tiêu đề, slug, ngày đăng, mô tả) vào danh mục bài viết ở đầu mảng `posts` trong `src/pages/blog/index.astro`.
* Đăng ký URL bài viết vào cơ sở dữ liệu tìm kiếm nhanh `searchIndex` trong `src/layouts/Layout.astro`.
* Đăng ký URL bài viết vào sơ đồ trang web `public/sitemap.xml`.

## 4. Quy tắc nhắc nhở Đẩy mã nguồn (Push Git) & Kiểm thử
* Sau mỗi lần cập nhật mã nguồn thành công, Agent bắt buộc phải tự động chạy lệnh `npm run preview` hoặc `npm run dev` ở chế độ nền (background task) để tạo môi trường kiểm thử cục bộ.
* Sau đó, Agent phải cung cấp đường link Localhost (ví dụ: `http://localhost:4321/...`) và yêu cầu người dùng kiểm tra kỹ giao diện, tính năng trên máy cá nhân trước.
* Chỉ sau khi nhắc người dùng test Localhost xong, Agent mới được phép nhắc nhở người dùng thực hiện push code lên GitHub và hướng dẫn cách làm chi tiết bằng GitHub Desktop kèm nội dung commit dựng sẵn.

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
*   **Tích hợp Dữ liệu Cấu trúc (JSON-LD Schemas):**
  - **WebApplication Schema:** Xác định ứng dụng web cho robot Google biết đây là một công cụ tương tác. Dùng `FinanceApplication` cho công cụ tài chính/thuế, hoặc `BusinessApplication` cho các công cụ tiện ích kinh doanh/văn phòng.
  - **FAQPage Schema:** Định dạng các câu hỏi thường gặp (FAQ) dưới dạng Rich Snippets để hiển thị trực tiếp các câu hỏi thả xuống trên kết quả tìm kiếm Google nhằm tăng tỷ lệ click (CTR).

## 7. Quy tắc Commit Git & Soạn Thảo Thông Tin Lưu Trữ
* Mỗi khi hoàn tất một nhóm tác vụ nâng cấp thành công và chuẩn bị hướng dẫn người dùng push code lên GitHub Desktop, Agent bắt buộc phải soạn sẵn nội dung commit bằng **Tiếng Việt** bao gồm:
  - **Summary (Bắt buộc):** Tiêu đề commit ngắn gọn (dưới 72 ký tự) bắt đầu bằng hành động rõ ràng (ví dụ: `Tích hợp Nhóm X: ...`).
  - **Description (Mô tả chi tiết):** Liệt kê chi tiết các tệp tin đã chỉnh sửa, các tính năng mới đã thêm, và tình trạng build test để người dùng dễ dàng theo dõi và đối chiếu sau này.

## 8. Cấu hình Hệ thống VPS (aaPanel)
* Máy chủ VPS chạy **Ubuntu 22.04 LTS**.
* Dự án **KHÔNG sử dụng Docker/Docker Compose**.
* Backend CMS chạy bằng **Node.js trực tiếp** và được quản lý tiến trình bằng **PM2** (tên process là `trolyso-cms`).
* Khi hướng dẫn người dùng chạy các lệnh database/sync trên terminal VPS, luôn luôn hướng dẫn chạy các lệnh Node.js trực tiếp (ví dụ: `node scripts/update-single-post-db.js <slug>`) mà không sử dụng tiền tố `docker-compose`.
* Luôn chỉ dẫn tường tận cách di chuyển thư mục (`cd /www/wwwroot/trolyso.online` và `cd cms`) từ trạng thái mặc định của terminal (`root@trolyso:~#`).

## 9. Quy trình Thêm Công Cụ Mới & Đồng Bộ Hệ Thống
Mỗi khi người dùng yêu cầu tạo một công cụ tính toán tiện ích mới (Calculator), Agent bắt buộc phải thực hiện đầy đủ các bước đồng bộ sau mà không để sót:
* **Bước 1: Tạo trang giao diện công cụ** tại `src/pages/calculators/<slug-khong-dau>/index.astro`.
* **Bước 2: Tối ưu SEO và Schema cuối trang:**
  - Viết phần cẩm nang hướng dẫn (công thức, ví dụ số cụ thể, căn cứ pháp lý).
  - Thêm hộp câu hỏi thường gặp (FAQ Accordion) bằng thẻ `<details>` có hover và màu tương phản cao đạt chuẩn WCAG AA.
  - Chèn link trỏ sang bài blog hướng dẫn chi tiết: `<a href="/blog/<slug-bai-viet>/" ...>`.
  - Tích hợp schema cấu trúc JSON-LD (`FinanceApplication`/`BusinessApplication` & `FAQPage`).
* **Bước 3: Đăng ký hiển thị ở Trang Chủ (`src/pages/index.astro`):**
  - Đăng ký thẻ card của công cụ vào danh sách hiển thị mặc định (`#calculators` grid).
  - Đăng ký đồng thời thẻ card vào danh sách mở rộng ẩn dưới nút bấm (`#expandedTools` grid).
* **Bước 4: Đồng bộ tìm kiếm & Sitemap:**
  - Đăng ký URL công cụ vào sơ đồ trang web `public/sitemap.xml`.
  - Đăng ký URL công cụ vào cơ sở dữ liệu tìm kiếm nhanh `public/search-index.json`.
* **Bước 5: Viết bài hướng dẫn SEO đi kèm** tại `src/pages/blog/<slug-huong-dan>/index.astro`, và đưa bài viết mới lên vị trí đầu tiên trong mảng `posts` của danh mục blog `src/pages/blog/index.astro`.
* **Bước 6: Đồng bộ hiệu ứng hover & vi hoạt ảnh (micro-animations) trên nút bấm/link** của bài viết mới trước khi bàn giao.

