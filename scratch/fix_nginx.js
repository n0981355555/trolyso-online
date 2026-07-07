import { Client } from 'ssh2';

const conn = new Client();

console.log('📡 Đang kết nối tới VPS để xử lý triệt để lỗi Nginx...');

conn.on('ready', () => {
  console.log('✅ Đã kết nối SSH thành công.');
  
  const cmd = `
    echo "=== DỪNG TOÀN BỘ NGINX ĐANG CHẠY MỒ CÔI ==="
    pkill -9 nginx || killall -9 nginx || true
    sleep 1
    
    echo -e "\\n=== KHỞI ĐỘNG LẠI NGINX QUA SYSTEMD ==="
    systemctl start nginx
    systemctl status nginx | head -n 15
    
    echo -e "\\n=== KIỂM TRA CÁC CỔNG ĐANG LẮNG NGHE (80/443) ==="
    ss -tulpn | grep -E '(:80|:443)'
  `;
  
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    
    let output = '';
    stream.on('close', (code, signal) => {
      console.log('=== KẾT QUẢ XỬ LÝ NGINX ===');
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
