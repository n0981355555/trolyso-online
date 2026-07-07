import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('✅ Kết nối SSH thành công. Đang chạy test HTTP cục bộ trên VPS...');
  
  const cmd = `
    echo "=== CURL HTTP PORT 80 ==="
    curl -I -s http://127.0.0.1
    
    echo -e "\\n=== CURL HTTPS PORT 443 ==="
    curl -I -s -k https://127.0.0.1
    
    echo -e "\\n=== CURL DOMAIN LOCAL ==="
    curl -I -s -k https://trolyso.online --resolve trolyso.online:443:127.0.0.1
    
    echo -e "\\n=== NGINX PROCESS LISTEN PORTS ==="
    netstat -tulnp | grep nginx || ss -tulnp | grep nginx
  `;
  
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    
    let output = '';
    stream.on('close', () => {
      console.log('=== KẾT QUẢ TEST CURL VPS ===');
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
