import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  // Xem chi tiết nội dung file log trong thư mục log/
  conn.exec('ls -la /www/server/panel/plugin/webhook/log/; cat /www/server/panel/plugin/webhook/log/*.log || true', (err, stream) => {
    if (err) throw err;
    stream.on('close', () => conn.end())
          .on('data', (data) => process.stdout.write(data.toString()))
          .stderr.on('data', (data) => process.stderr.write(data.toString()));
  });
}).connect({
  host: '180.93.1.246',
  port: 22,
  username: 'root',
  password: 'SbPA}{qqx6-.'
});
