import fs from 'fs';

console.log('📊 Đang tạo tệp CSV theo dõi tiến độ cho Google Sheets...');

const header = 'Khu vực,Tỉnh Thành Mới,Trạng thái,Giai đoạn,Chi tiết sáp nhập,Số xã ước tính\n';

const rows = [
  // Miền Bắc ( NPC + Hà Nội)
  'Miền Bắc,Thành phố Hà Nội,Chưa bắt đầu,Giai đoạn 1 (Thử nghiệm),Giữ nguyên địa giới,185',
  'Miền Bắc,Tỉnh Quảng Ninh,Chưa bắt đầu,Giai đoạn 1 (Thử nghiệm),Giữ nguyên địa giới,65',
  'Miền Bắc,Tỉnh Bắc Ninh,Chưa bắt đầu,Giai đoạn 1 (Thử nghiệm),Sáp nhập Bắc Giang & Bắc Ninh,115',
  'Miền Bắc,Thành phố Hải Phòng,Chưa bắt đầu,Giai đoạn 1 (Thử nghiệm),Sáp nhập Hải Dương & Hải Phòng,145',
  'Miền Bắc,Tỉnh Cao Bằng,Chưa bắt đầu,Giai đoạn 2,Giữ nguyên địa giới,60',
  'Miền Bắc,Tỉnh Điện Biên,Chưa bắt đầu,Giai đoạn 2,Giữ nguyên địa giới,55',
  'Miền Bắc,Tỉnh Lai Châu,Chưa bắt đầu,Giai đoạn 2,Giữ nguyên địa giới,40',
  'Miền Bắc,Tỉnh Lạng Sơn,Chưa bắt đầu,Giai đoạn 2,Giữ nguyên địa giới,80',
  'Miền Bắc,Tỉnh Sơn La,Chưa bắt đầu,Giai đoạn 2,Giữ nguyên địa giới,85',
  'Miền Bắc,Tỉnh Tuyên Quang,Chưa bắt đầu,Giai đoạn 2,Sáp nhập Hà Giang & Tuyên Quang,90',
  'Miền Bắc,Tỉnh Lào Cai,Chưa bắt đầu,Giai đoạn 2,Sáp nhập Lào Cai & Yên Bái,80',
  'Miền Bắc,Tỉnh Thái Nguyên,Chưa bắt đầu,Giai đoạn 2,Sáp nhập Bắc Kạn & Thái Nguyên,75',
  'Miền Bắc,Tỉnh Phú Thọ,Chưa bắt đầu,Giai đoạn 2,Sáp nhập Vĩnh Phúc Hòa Bình & Phú Thọ,120',
  'Miền Bắc,Tỉnh Hưng Yên,Chưa bắt đầu,Giai đoạn 2,Sáp nhập Thái Bình & Hưng Yên,110',
  'Miền Bắc,Tỉnh Ninh Bình,Chưa bắt đầu,Giai đoạn 2,Sáp nhập Hà Nam Nam Định & Ninh Bình,130',
  
  // Miền Trung ( CPC + Huế)
  'Miền Trung,Thành phố Huế,Chưa bắt đầu,Giai đoạn 4,Giữ nguyên địa giới,50',
  'Miền Trung,Tỉnh Hà Tĩnh,Chưa bắt đầu,Giai đoạn 4,Giữ nguyên địa giới,95',
  'Miền Trung,Tỉnh Nghệ An,Chưa bắt đầu,Giai đoạn 4,Giữ nguyên địa giới,180',
  'Miền Trung,Tỉnh Thanh Hóa,Chưa bắt đầu,Giai đoạn 4,Giữ nguyên địa giới,210',
  'Miền Trung,Tỉnh Quảng Trị,Chưa bắt đầu,Giai đoạn 4,Sáp nhập Quảng Bình & Quảng Trị,100',
  'Miền Trung,Thành phố Đà Nẵng,Chưa bắt đầu,Giai đoạn 4,Sáp nhập Quảng Nam & Đà Nẵng,95',
  'Miền Trung,Tỉnh Quảng Ngãi,Chưa bắt đầu,Giai đoạn 4,Sáp nhập Kon Tum & Quảng Ngãi,85',
  'Miền Trung,Tỉnh Gia Lai,Chưa bắt đầu,Giai đoạn 4,Sáp nhập Bình Định & Gia Lai,105',
  'Miền Trung,Tỉnh Khánh Hòa,Chưa bắt đầu,Giai đoạn 4,Sáp nhập Ninh Thuận & Khánh Hòa,75',
  'Miền Trung,Tỉnh Lâm Đồng,Chưa bắt đầu,Giai đoạn 4,Sáp nhập Đắk Nông Bình Thuận & Lâm Đồng,115',
  'Miền Trung,Tỉnh Đắk Lắk,Chưa bắt đầu,Giai đoạn 4,Sáp nhập Phú Yên & Đắk Lắk,105',

  // Miền Nam ( SPC + HCM)
  'Miền Nam,Thành phố Hồ Chí Minh,Chưa bắt đầu,Giai đoạn 3,Sáp nhập Bà Rịa Vũng Tàu Bình Dương & TP. HCM,195',
  'Miền Nam,Tỉnh Đồng Nai,Chưa bắt đầu,Giai đoạn 3,Sáp nhập Bình Phước & Đồng Nai,95',
  'Miền Nam,Tỉnh Tây Ninh,Chưa bắt đầu,Giai đoạn 3,Sáp nhập Long An & Tây Ninh,85',
  'Miền Nam,Thành phố Cần Thơ,Chưa bắt đầu,Giai đoạn 3,Sáp nhập Sóc Trăng Hậu Giang & Cần Thơ,110',
  'Miền Nam,Tỉnh Vĩnh Long,Chưa bắt đầu,Giai đoạn 3,Sáp nhập Bến Tre Vĩnh Long & Trà Vinh,110',
  'Miền Nam,Tỉnh Đồng Tháp,Chưa bắt đầu,Giai đoạn 3,Sáp nhập Tiền Giang & Đồng Tháp,90',
  'Miền Nam,Tỉnh Cà Mau,Chưa bắt đầu,Giai đoạn 3,Sáp nhập Bạc Liêu & Cà Mau,75',
  'Miền Nam,Tỉnh An Giang,Chưa bắt đầu,Giai đoạn 3,Sáp nhập Kiên Giang & An Giang,110'
];

const csvContent = header + rows.join('\n');

// Lưu file CSV vào thư mục scratch của dự án
if (!fs.existsSync('scratch')) {
  fs.mkdirSync('scratch', { recursive: true });
}
fs.writeFileSync('scratch/outage_tracker.csv', '\uFEFF' + csvContent); // Thêm BOM UTF-8 để Excel hiển thị tiếng Việt không bị lỗi font

console.log('✅ Thành công! Tệp CSV đã được lưu tại scratch/outage_tracker.csv');
