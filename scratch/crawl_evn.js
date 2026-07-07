import fs from 'fs';
import path from 'path';

console.log('⚡ Bắt đầu tiến trình cào dữ liệu lịch cắt điện từ EVN...');

// Tạo thư mục chứa dữ liệu lịch cúp điện nếu chưa có
const outputDir = 'src/data/outages';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Hàm giả lập gọi API EVN cho từng Phường/Xã
async function crawlEvnForWard(wardCode, wardName, provinceName) {
  try {
    // Trong thực tế, đây là nơi gọi tới API của EVN NPC/EVNHANOI
    // Ví dụ:
    // const res = await fetch(`https://cskh.npc.com.vn/api/outages?ward=${wardCode}`);
    // const data = await res.json();
    
    // Giả lập: Hầu hết các Phường/Xã hoạt động bình thường, không có lịch cắt điện (98%).
    // Random 2% các Phường/Xã có lịch cắt để kiểm tra giao diện.
    const hasOutage = Math.random() < 0.02;
    const outages = [];

    if (hasOutage) {
      const today = new Date();
      const startTime = new Date(today);
      startTime.setHours(7, 30, 0, 0);

      const endTime = new Date(today);
      endTime.setHours(12, 0, 0, 0);

      outages.push({
        id: `OUT-${wardCode}-${Date.now()}`,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        area: `Toàn bộ khu vực thôn/xóm trung tâm thuộc địa bàn ${wardName}`,
        reason: 'Thay đổi, nâng cấp định kỳ máy biến áp phân phối và sửa chữa lưới điện trung thế để đảm bảo vận hành an toàn mùa nắng nóng.'
      });
    }

    fs.writeFileSync(
      path.join(outputDir, `${wardCode}.json`),
      JSON.stringify({
        wardCode,
        wardName,
        provinceName,
        lastUpdated: new Date().toISOString(),
        outages
      }, null, 2)
    );

    return outages.length > 0;
  } catch (error) {
    console.error(`❌ Lỗi khi cào dữ liệu cho mã xã ${wardCode}:`, error);
    return false;
  }
}

async function runCrawler() {
  try {
    const rawData = fs.readFileSync('src/data/regions.json', 'utf8');
    const regions = JSON.parse(rawData);
    
    let totalWards = 0;
    let outageCount = 0;

    console.log('📦 Đang phân tích mã Phường/Xã để quét...');
    
    for (const province of regions) {
      for (const district of province.districts) {
        for (const ward of district.wards) {
          totalWards++;
          const hasOutage = await crawlEvnForWard(ward.code, ward.name, province.name);
          if (hasOutage) outageCount++;
        }
      }
    }

    console.log(`✅ Hoàn thành! Quét xong ${totalWards} Phường/Xã. Phát hiện ${outageCount} khu vực có lịch cúp điện.`);
  } catch (error) {
    console.error('❌ Lỗi hệ thống crawler:', error);
  }
}

runCrawler();
