import { Client } from 'ssh2';

const conn = new Client();

console.log('📡 Đang kết nối tới VPS để kiểm tra lỗi Nginx...');

conn.on('ready', () => {
  console.log('✅ Đã kết nối SSH thành công.');
  
  const cmd = `
    echo "=== KIỂM TRA CẤU HÌNH NGINX ==="
    nginx -t
    
    echo -e "\\n=== THỬ KHỞI ĐỘNG NGINX ==="
    systemctl start nginx
    systemctl status nginx | head -n 15
    
    echo -e "\\n=== ĐỌC LOG LỖI NGINX (aaPanel) ==="
    if [ -f "/www/server/nginx/logs/error.log" ]; then
      tail -n 30 /www/server/nginx/logs/error.log
    else
      echo "Không tìm thấy log tại /www/server/nginx/logs/error.log"
    fi

    echo -e "\\n=== ĐỌC LOG LỖI NGINX (Hệ thống) ==="
    if [ -f "/var/log/nginx/error.log" ]; then
      tail -n 30 /var/log/nginx/error.log
    else
      echo "Không tìm thấy log tại /var/log/nginx/error.log"
    fi
  `;
  
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    
    let output = '';
    stream.on('close', (code, signal) => {
      console.log('=== KẾT QUẢ KIỂM TRA NGINX ===');
      console.log(output);
      conn.end();
    }).on('data', (data) => {
      output += data.toString();
    }).stderr.on('data', (data) => {
      output += 'STDERR: ' + data.toString();
    });
  });
}).connect({
  host: '180.93.1.246',
  port: 22,
  username: 'root',
  password: 'SbPA}{qqx6-.'
});
