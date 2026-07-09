import { exec } from 'child_process';
import crypto from 'crypto';
import path from 'path';

export const handleGithubWebhook = (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const secret = process.env.GITHUB_WEBHOOK_SECRET || 'trolyso_secret_key';

  if (!signature) {
    console.warn('⚠️ Webhook received without signature');
    return res.status(401).send('No signature provided');
  }

  // Verify HMAC signature using raw body buffer
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');

  // Validate signature safely using timingSafeEqual if possible, or string comparison
  const signatureBuffer = Buffer.from(signature);
  const digestBuffer = Buffer.from(digest);
  
  if (signatureBuffer.length !== digestBuffer.length || !crypto.timingSafeEqual(signatureBuffer, digestBuffer)) {
    console.error('❌ Webhook signature verification failed');
    return res.status(403).send('Signature mismatch');
  }

  console.log('✅ Webhook signature verified. Triggering deploy...');

  // Respond immediately to GitHub (expects response within 10s)
  res.status(202).json({ status: 'success', message: 'Deployment triggered' });

  // Run deployment script in the background
  const deployScriptPath = path.resolve('../scripts/deploy.js');
  
  // We execute from the workspace root directory (which is parent of cms)
  const rootDir = path.resolve('..');
  
  exec(`node "${deployScriptPath}"`, { cwd: rootDir }, (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Deployment webhook error:', err.message);
      return;
    }
    console.log('Deployment Output:\n', stdout);
    if (stderr) {
      console.error('Deployment Stderr:\n', stderr);
    }
  });
};
