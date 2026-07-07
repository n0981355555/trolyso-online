import { Client } from 'ssh2';

console.log('🚀 Đang kết nối SSH tới VPS 180.93.1.246...');

const conn = new Client();
conn.on('ready', () => {
  console.log('✅ Đã kết nối thành công! Đang khởi chạy lệnh cài đặt aaPanel...');
  
  conn.shell((err, stream) => {
    if (err) {
      console.error('❌ Lỗi mở shell:', err);
      conn.end();
      return;
    }
    
    stream.on('close', () => {
      console.log('\n🔒 Kết nối đã đóng.');
      conn.end();
    }).on('data', (data) => {
      const output = data.toString();
      process.stdout.write(output);
      
      // Tự động đồng ý cài đặt vào thư mục /www
      if (output.includes('Do you want to install aaPanel to the /www directory now?')) {
        console.log('\n🤖 Tự động trả lời: y');
        stream.write('y\n');
      }
    });
    
    // Gửi lệnh cài đặt aaPanel cho Ubuntu
    stream.write('URL=https://www.aapanel.com/script/install_panel_en.sh && if [ -f /usr/bin/curl ];then curl -ksSO "$URL" ;else wget --no-check-certificate -O install_panel_en.sh "$URL";fi;bash install_panel_en.sh forum\n');
  });
}).on('error', (err) => {
  console.error('❌ Lỗi kết nối SSH:', err.message);
}).connect({
  host: '180.93.1.246',
  port: 22,
  username: 'root',
  password: 'SbPA}{qqx6-.'
});
