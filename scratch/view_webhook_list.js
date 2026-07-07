import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  conn.exec('cat /www/server/panel/plugin/webhook/script/v7Z1pGeNbQZ0Yq4wj4xtF5wQGWpmsiRyX7zAZFtQSithZRfB.log', (err, stream) => {
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
