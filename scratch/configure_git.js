import { Client } from 'ssh2';

console.log('🚀 Đang kết nối SSH tới VPS để thiết lập mã nguồn...');

const conn = new Client();
conn.on('ready', () => {
  console.log('✅ Đã kết nối! Bắt đầu dọn dẹp thư mục mặc định và clone mã nguồn từ GitHub...');
  
  // 1. Vào thư mục dự án
  // 2. Chạy cài đặt thư viện
  // 3. Cấp quyền thực thi cho các file nhị phân trong .bin
  // 4. Biên dịch Astro
  // 5. Chuyển quyền sở hữu thư mục cho user www để Nginx đọc ghi
  const cmd = 'cd /www/wwwroot/trolyso.online; npm install; chmod -R +x /www/wwwroot/trolyso.online/node_modules/.bin; npm run build; chown -R www:www /www/wwwroot/trolyso.online';
  
  conn.exec(cmd, (err, stream) => {
    if (err) {
      console.error('❌ Lỗi chạy lệnh:', err);
      conn.end();
      return;
    }
    
    stream.on('close', (code) => {
      console.log(`\n🎉 Hoàn thành thiết lập mã nguồn! Code exit: ${code}`);
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data.toString());
    }).stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });
  });
}).on('error', (err) => {
  console.error('❌ Lỗi kết nối SSH:', err.message);
}).connect({
  host: '180.93.1.246',
  port: 22,
  username: 'root',
  password: 'SbPA}{qqx6-.'
});
