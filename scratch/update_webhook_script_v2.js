import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('✅ Kết nối VPS thành công. Đang cập nhật WebHook sang cơ chế Reset Hard để chống xung đột...');
  
  const newScript = `#!/bin/bash
echo "=== BẮT ĐẦU CẬP NHẬT CODE TỰ ĐỘNG ==="
git config --global --add safe.directory /www/wwwroot/trolyso.online
cd /www/wwwroot/trolyso.online
# Fetch code mới và bắt buộc ghi đè (Reset Hard) mọi tệp tin để chống xung đột package-lock
git fetch origin main
git reset --hard origin/main
npm install
chmod -R +x /www/wwwroot/trolyso.online/node_modules/.bin
npm run build
chown -R www:www /www/wwwroot/trolyso.online
echo "=== CẬP NHẬT HOÀN TẤT THÀNH CÔNG ==="`;

  // Ghi đè tệp tin script của Webhook trên VPS
  conn.exec(`echo '${newScript.replace(/'/g, "'\\''")}' > /www/server/panel/plugin/webhook/script/v7Z1pGeNbQZ0Yq4wj4xtF5wQGWpmsiRyX7zAZFtQSithZRfB`, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      console.log('🎉 Đã cập nhật xong WebHook v2 chống xung đột!');
      conn.end();
    });
  });
}).connect({
  host: '180.93.1.246',
  port: 22,
  username: 'root',
  password: 'SbPA}{qqx6-.'
});
