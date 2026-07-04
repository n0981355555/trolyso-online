# Quy tắc Viết Bài và Tối ưu Hình Ảnh SEO - Trợ Lý Số

Mỗi khi người dùng yêu cầu viết bài viết mới (Blog Post) chuẩn SEO, hệ thống Agent sẽ tuân thủ nghiêm ngặt các quy trình và quy tắc sau đây mà không cần hỏi lại:

## 1. Quy tắc Viết bài & Tạo trang tự động
* Tạo trang blog mới tại đường dẫn: `src/pages/blog/<slug-viet-tat-khong-dau>/index.astro`.
* Nội dung bài viết phải chứa tiêu đề chuẩn H1, các phân đoạn H2, H3 rõ ràng, có cấu trúc bảng biểu, hộp lưu ý làm nổi bật nội dung.
* Bài viết phải có phần **Mục lục bài viết (Table of Contents)** liên kết neo (anchor link) đặt dưới đoạn mở bài để người dùng dễ dàng chuyển nhanh đến các phần chính.
* Cuối bài viết phải chứa lời kêu gọi hành động (Call To Action - CTA) dẫn link về công cụ tính toán tương ứng của website để tăng tỷ lệ chuyển đổi.

## 2. Quy tắc Tối ưu Hình ảnh chuẩn SEO
* **Định dạng & Dung lượng:** Luôn sử dụng định dạng thế hệ mới `.webp` cho tất cả các ảnh mẫu chèn trong bài để đảm bảo tối ưu hóa PageSpeed dưới 100KB.
* **Tên file ảnh (độc nhất và chuẩn SEO):** Đặt tên bằng tiếng Việt không dấu, nối với nhau bằng dấu gạch ngang (Ví dụ: `luong-gross-la-gi-hero.webp`, `luong-gross-la-gi-flow.webp`).
* **Thẻ Alt:** Luôn điền thẻ `alt` mô tả ảnh bằng tiếng Việt không dấu, viết thường, nối bằng dấu gạch ngang (Ví dụ: `alt="cach-tinh-luong-gross-sang-net"`, `alt="cac-khoan-khau-tru-tu-luong-gross"`). Tuyệt đối không để trống alt.

## 3. Quy tắc Đồng bộ hóa Hệ thống
* Nạp thông tin bài viết (Tiêu đề, slug, ngày đăng, mô tả) vào danh mục bài viết ở đầu mảng `posts` trong `src/pages/blog/index.astro`.
* Đăng ký URL bài viết vào cơ sở dữ liệu tìm kiếm nhanh `searchIndex` trong `src/layouts/Layout.astro`.
* Đăng ký URL bài viết vào sơ đồ trang web `public/sitemap.xml`.

## 4. Quy tắc nhắc nhở Đẩy mã nguồn (Push Git)
* Sau mỗi lần cập nhật mã nguồn thành công, Agent bắt buộc phải nhắc nhở người dùng thực hiện push code lên GitHub và hướng dẫn cách làm chi tiết bằng GitHub Desktop.
