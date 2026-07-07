import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('✅ Kết nối VPS thành công. Đang cập nhật cấu hình bảo mật Git cho WebHook...');
  
  const newScript = `#!/bin/bash
echo "=== BẮT ĐẦU CẬP NHẬT CODE TỰ ĐỘNG ==="
git config --global --add safe.directory /www/wwwroot/trolyso.online
cd /www/wwwroot/trolyso.online
git pull origin main
npm install
chmod -R +x /www/wwwroot/trolyso.online/node_modules/.bin
npm run build
chown -R www:www /www/wwwroot/trolyso.online
echo "=== CẬP NHẬT HOÀN TẤT THÀNH CÔNG ==="`;

  // Ghi đè tệp tin script của Webhook trên VPS để tự động khai báo thư mục safe cho Git
  conn.exec(`echo '${newScript.replace(/'/g, "'\\''")}' > /www/server/panel/plugin/webhook/script/v7Z1pGeNbQZ0Yq4wj4xtF5wQGWpmsiRyX7zAZFtQSithZRfB`, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      console.log('🎉 Đã tự động cập nhật xong tệp script WebHook trên VPS!');
      conn.end();
    });
  });
}).connect({
  host: '180.93.1.246',
  port: 22,
  username: 'root',
  password: 'SbPA}{qqx6-.'
});
