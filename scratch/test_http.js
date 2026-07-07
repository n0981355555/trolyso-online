console.log('📡 Đang gửi thử nghiệm HTTP Request tới các URL...');

async function testUrl(url) {
  try {
    const res = await fetch(url);
    console.log(`🌐 URL: ${url} -> Status: ${res.status}`);
  } catch (error) {
    console.error(`❌ Lỗi URL: ${url} ->`, error.message);
  }
}

async function run() {
  await testUrl('https://trolyso.online/calculators/lich-cat-dien/');
  await testUrl('https://trolyso.online/calculators/lich_cat_dien/');
}

run();
