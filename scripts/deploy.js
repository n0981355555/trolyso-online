import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

try {
  console.log('🏁 Starting deployment webhook handler...');

  // 1. Run git pull
  console.log('📥 Pulling code from Git...');
  const gitPullResult = execSync('git pull', { encoding: 'utf8' });
  console.log(gitPullResult);

  // 2. Identify changed files in the last commit
  console.log('🔍 Identifying changed blog posts...');
  const diffOutput = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' });
  const changedFiles = diffOutput.trim().split('\n');

  const changedSlugs = new Set();
  for (const file of changedFiles) {
    if (file.startsWith('src/pages/blog/') && file.endsWith('/index.astro')) {
      const parts = file.split('/');
      if (parts.length === 5) {
        changedSlugs.add(parts[3]);
      }
    }
  }

  // 3. Sync changed posts database records
  if (changedSlugs.size > 0) {
    console.log(`🔄 Syncing database for changed posts: ${Array.from(changedSlugs).join(', ')}`);
    // Ensure we are in the cms directory
    process.chdir('cms');
    for (const slug of changedSlugs) {
      console.log(`👉 Syncing database for: ${slug}`);
      try {
        const syncResult = execSync(`node scripts/update-single-post-db.js ${slug}`, { encoding: 'utf8' });
        console.log(syncResult);
      } catch (err) {
        console.error(`❌ Failed to sync slug: ${slug}`, err.message);
      }
    }
    process.chdir('..');
  } else {
    console.log('ℹ️ No blog post changes detected, skipping database sync.');
  }

  // 4. Run Astro build to generate static pages
  console.log('🏗️ Building Astro website...');
  const buildResult = execSync('npm run build', { encoding: 'utf8' });
  console.log(buildResult);

  console.log('✅ Deployment finished successfully!');
} catch (err) {
  console.error('❌ Deployment script failed:', err.message);
}
