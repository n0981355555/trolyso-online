import fs from 'fs';

console.log('📡 Đang tải danh sách tỉnh thành từ provinces.open-api.vn...');

async function fetchRegions() {
  try {
    const response = await fetch('https://provinces.open-api.vn/api/?depth=3');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    // Các tỉnh trọng điểm giai đoạn 1: Hà Nội, Bắc Giang, Bắc Ninh, Hải Dương, Quảng Ninh
    // Mã code của các tỉnh này trong hệ thống:
    // - Thành phố Hà Nội: 01
    // - Tỉnh Bắc Giang: 24
    // - Tỉnh Bắc Ninh: 27
    // - Tỉnh Quảng Ninh: 22
    // - Tỉnh Hải Dương: 30
    // - Thành phố Hải Phòng: 02
    const targetCodes = [1, 2, 24, 27, 22, 30]; 
    
    const filtered = data.filter(p => targetCodes.includes(p.code)).map(p => ({
      name: p.name,
      codename: p.codename,
      code: p.code,
      districts: p.districts.map(d => ({
        name: d.name,
        codename: d.codename,
        code: d.code,
        wards: d.wards.map(w => ({
          name: w.name,
          codename: w.codename,
          code: w.code
        }))
      }))
    }));
    
    // Tạo thư mục src/data nếu chưa có
    if (!fs.existsSync('src/data')) {
      fs.mkdirSync('src/data', { recursive: true });
    }
    
    fs.writeFileSync('src/data/regions.json', JSON.stringify(filtered, null, 2));
    console.log(`✅ Thành công! Đã lưu danh sách vùng của ${filtered.length} tỉnh vào src/data/regions.json`);
  } catch (error) {
    console.error('❌ Lỗi khi tải dữ liệu:', error);
  }
}

fetchRegions();
