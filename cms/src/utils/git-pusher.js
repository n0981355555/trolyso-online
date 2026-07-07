import simpleGit from 'simple-git';
import path from 'path';

const git = simpleGit(path.resolve('../'));

export async function pushToGithub(message) {
  try {
    console.log('🐙 Checking git status and prepping auto-push to GitHub...');
    
    // Add all changes (Astro files, regions.json, sitemap, etc.)
    await git.add('.');
    
    // Commit
    const commitResult = await git.commit(message);
    console.log(`✅ Git commit complete: ${commitResult.summary.changes || 0} changes.`);
    
    // Push
    console.log('🚀 Pushing to origin main...');
    await git.push('origin', 'main');
    console.log('🎉 GitHub Push Successful!');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Git push failed:', error.message);
    return { success: false, error: error.message };
  }
}
