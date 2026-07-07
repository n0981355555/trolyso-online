import { Client } from 'ssh2';

const conn = new Client();

console.log('📡 Đang kết nối tới VPS qua SSH để kiểm tra lỗi...');

conn.on('ready', () => {
  console.log('✅ Đã kết nối SSH thành công.');
  
  // Chạy các lệnh kiểm tra:
  // 1. Trạng thái Nginx
  // 2. Tài nguyên bộ nhớ (free -m)
  // 3. Log của Webhook để xem quá trình build tự động có bị lỗi gì không
  const cmd = `
    echo "=== TRẠNG THÁI NGINX ==="
    systemctl status nginx | head -n 15
    
    echo -e "\\n=== BỘ NHỚ RAM ==="
    free -h
    
    echo -e "\\n=== KHÔNG GIAN ĐĨA ==="
    df -h /
    
    echo -e "\\n=== LOG WEBHOOK MỚI NHẤT ==="
    ls -lt /www/server/panel/plugin/webhook/log/ | head -n 5
    
    # Tìm file log mới nhất và đọc 30 dòng cuối
    latest_log=$(ls -t /www/server/panel/plugin/webhook/log/*.log 2>/dev/null | head -n 1)
    if [ -n "$latest_log" ]; then
      echo -e "\\n=== CHI TIẾT LOG WEBHOOK: $latest_log ==="
      tail -n 40 "$latest_log"
    else
      echo "Không tìm thấy file log webhook nào."
    fi
  `;
  
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    
    let output = '';
    stream.on('close', (code, signal) => {
      console.log('=== KẾT QUẢ KIỂM TRA VPS ===');
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
