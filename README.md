# Trợ Lý Số Online (trolyso.online)

Dự án website **Trợ Lý Số Online** được xây dựng trên nền tảng **Astro** (Static Site Generator), kết hợp với **Tailwind CSS** để tối ưu hóa hiệu năng, tốc độ tải trang cực nhanh và điểm số SEO hoàn hảo (Lighthouse ~100). 

Trang web cung cấp các công cụ tiện ích trực tuyến (Calculators) và hệ thống tra cứu Lịch cắt điện toàn quốc tối ưu hóa SEO tự động (Programmatic SEO) với hơn 10.000 trang xã/phường sáp nhập mới.

---

## 📂 Cấu Trúc Thư Mục Dự Án

Dưới đây là sơ đồ cấu trúc và chức năng chi tiết của các tệp tin/thư mục chính trong dự án:

```text
trolyso-online/
├── .agents/                    # Quy tắc và cấu hình các tác nhân AI của dự án
├── public/                     # Các tài nguyên tĩnh công khai (sitemap, favicon, assets)
│   ├── sitemap.xml             # Sơ đồ trang web chứa toàn bộ URL tĩnh và dynamic của dự án
│   └── ...
├── scripts/                    # Các tập lệnh tự động hóa dự án
│   └── generate-commune-pages.js # Script tự động sinh regions.json, cập nhật sitemap và searchIndex
├── src/                        # Thư mục mã nguồn chính của ứng dụng
│   ├── data/                   # Nơi lưu trữ dữ liệu tĩnh dạng JSON
│   │   ├── outages/            # Thư mục chứa dữ liệu lịch cắt điện tĩnh của từng xã (mã xã.json)
│   │   └── regions.json        # Dữ liệu 34 tỉnh/thành sáp nhập và quận/huyện/xã tương ứng
│   ├── layouts/                # Các giao diện khung (Layout template)
│   │   └── Layout.astro        # Layout chính của website (Chứa header, footer, darkmode, searchIndex)
│   ├── pages/                  # Hệ thống định tuyến (Routing) của Astro
│   │   ├── blog/               # Các trang bài viết cẩm nang hướng dẫn chuẩn SEO
│   │   ├── calculators/        # Thư mục chứa các công cụ tính toán và tiện ích trực tuyến
│   │   ├── chinh-sach-bao-mat/ # Trang chính sách bảo mật
│   │   ├── dieu-khoan/         # Trang điều khoản dịch vụ
│   │   └── index.astro         # Trang chủ chính của website
│   ├── utils/                  # Các hàm tiện ích dùng chung
│   │   └── slugify.js          # Hàm chuẩn hóa chuỗi tiếng Việt thành slug không dấu (ví dụ: ha-noi)
│   └── env.d.ts                # Tệp định nghĩa kiểu TypeScript của Astro
├── package.json                # Quản lý thư viện phụ thuộc (dependencies) và các lệnh chạy
├── tailwind.config.mjs         # Cấu hình Tailwind CSS cho dự án
└── README.md                   # Tài liệu hướng dẫn sử dụng này
```

---

## 🛠️ Danh Sách Các Công Cụ Tiện Ích (Calculators)

Dự án tích hợp **22 bộ công cụ và tiện ích** đặt trong thư mục `src/pages/calculators/`:

1.  **`chu-ky-email`**: Tạo mẫu chữ ký Email chuyên nghiệp (Gmail, Outlook) bằng HTML.
2.  **`dem-ngay-yeu-nhau`**: Đồng hồ Love Counter đếm chính xác thời gian bên nhau chạy giây thực tế.
3.  **`doc-so-thanh-chu`**: Chuyển đổi số tiền thành chữ viết phục vụ hóa đơn kế toán.
4.  **`giai-phuong-trinh`**: Giải phương trình bậc 2, bậc 3 hiển thị chi tiết các bước giải Delta và vẽ đồ thị.
5.  **`gop-pdf`**: Ghép nối nhiều file PDF thành một tệp duy nhất ngay trên trình duyệt (client-side).
6.  **`lich-cat-dien`**: Bản đồ tra cứu lịch mất điện vùng miền và theo mã khách hàng (EVN).
7.  **`lich-van-nien`**: Xem lịch âm dương hôm nay, đổi ngày âm/dương và xem giờ hoàng đạo.
8.  **`nen-anh`**: Nén tối ưu dung lượng ảnh JPG/PNG sang định dạng WebP thế hệ mới.
9.  **`pdf-sang-word`**: Chuyển đổi tệp PDF sang tài liệu Word (.docx) không lỗi font.
10. **`speedtest`**: Kiểm tra tốc độ mạng internet (Ping, Download, Upload) trực tuyến.
11. **`tao-anh-ai`**: Trình sinh hình ảnh nghệ thuật, tranh vẽ bằng trí tuệ nhân tạo thông qua văn bản (Prompt).
12. **`tao-cv`**: Thiết kế và viết CV xin việc chuyên nghiệp xuất file PDF chất lượng cao.
13. **`tao-ma-qr`**: Tạo mã QR chuyển khoản ngân hàng chuẩn VietQR nhanh chóng.
14. **`tao-van-ban`**: Công cụ soạn thảo 15 loại văn bản quy phạm pháp luật và 29 loại văn bản hành chính chuẩn Nghị định 30.
15. **`tinh-bhxh-1-lan`**: Ước tính số tiền nhận được khi rút Bảo hiểm xã hội một lần.
16. **`tinh-bmi`**: Tính chỉ số khối cơ thể và kiểm tra mức cân nặng lý tưởng theo WHO.
17. **`tinh-luong-huu`**: Dự tính lộ trình tuổi nghỉ hưu (Nghị định 135) và mức hưởng lương hưu dự kiến.
18. **`tinh-thue-tncn`**: Tính thuế thu nhập cá nhân lũy tiến từng phần chuẩn năm 2026.
19. **`tinh-tien-cham-nop-thue`**: Tính số tiền phạt chậm nộp thuế 0.03%/ngày và tờ khai phạt.
20. **`tra-cuu-mst`**: Tìm kiếm thông tin công ty và MST cá nhân qua thẻ CCCD.
21. **`word-sang-pdf`**: Đổi đuôi file Word .docx sang tệp PDF giữ nguyên định dạng.
22. **`xem-tarot`**: Trải bài Tarot 1 lá hoặc 3 lá trực tuyến nhận thông điệp ngẫu nhiên.

---

## ⚡ Hệ Thống Tra Cứu Lịch Cắt Điện (Programmatic SEO)

Trang tra cứu lịch cắt điện là phần cốt lõi của chiến dịch SEO tự động trên trang web:
- **Cấu hình sáp nhập:** 63 tỉnh/thành được gom nhóm thành **34 thực thể tỉnh/thành mới** sau sáp nhập theo quy hoạch mới (ví dụ: *Bắc Giang & Bắc Ninh* thành *Tỉnh Bắc Ninh*; *Hải Dương & Hải Phòng* thành *Thành phố Hải Phòng*...).
- **Cấu trúc URL tĩnh cấp xã:** Nằm tại đường dẫn `/calculators/lich-cat-dien/[tinh]/[xa]/index.astro`. Astro tự động sinh 10.047 trang HTML cho toàn bộ xã/phường/thị trấn sau sáp nhập trên toàn quốc chỉ trong khoảng ~20 giây khi build.
- **Không còn cấp Huyện:** Theo quy định sáp nhập mới nhất, các trang cấp xã hiển thị trực thuộc quản lý trực tiếp của cấp Tỉnh, loại bỏ hoàn toàn các đề cập đến cấp huyện để tránh thông tin sai lệch.

---

## 🚀 Hướng Dẫn Chạy & Phát Triển Dự Án

### 1. Cài đặt các thư viện
Trước khi chạy, hãy cài đặt các thư viện phụ thuộc:
```bash
npm install
```

### 2. Tự động cập nhật dữ liệu và trang xã mới
Khi có thay đổi về địa giới hành chính, chạy script sau để tự động lấy dữ liệu từ `dvhcvn`, gom nhóm tỉnh sáp nhập mới, đồng bộ hóa 10.047 trang vào `sitemap.xml` và `searchIndex`:
```bash
npm run generate:pages
```

### 3. Chạy môi trường phát triển (Localhost)
Khởi động server phát triển cục bộ tại địa chỉ `http://localhost:4321/`:
```bash
npm run dev
```

### 4. Biên dịch dự án (Build)
Biên dịch toàn bộ mã nguồn thành mã HTML/JS tĩnh đặt trong thư mục `dist/` để sẵn sàng đưa lên hosting/server:
```bash
npm run build
```

### 5. Kiểm tra bản build tĩnh (Preview)
Chạy thử bản đã build tĩnh trên localhost để kiểm tra trước khi deploy:
```bash
npm run preview
```