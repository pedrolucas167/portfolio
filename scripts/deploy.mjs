import { execSync } from 'node:child_process';
import { cpSync, existsSync, readdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const worktreeDir = path.join(rootDir, '.deploy-worktree');

function run(command, cwd = rootDir) {
  execSync(command, {
    cwd,
    stdio: 'inherit',
  });
}

function cleanupWorktree() {
  if (existsSync(worktreeDir)) {
    try {
      run(`git worktree remove --force "${worktreeDir}"`);
    } catch {
      rmSync(worktreeDir, { recursive: true, force: true });
    }
  }
  run('git worktree prune');
}

if (!existsSync(distDir)) {
  throw new Error('dist folder not found. Run the build before deploy.');
}

try {
  run('git fetch origin gh-pages');
  cleanupWorktree();
  run(`git worktree add --detach "${worktreeDir}" origin/gh-pages`);

  for (const entry of readdirSync(worktreeDir)) {
    if (entry === '.git') continue;
    rmSync(path.join(worktreeDir, entry), { recursive: true, force: true });
  }

  cpSync(distDir, worktreeDir, { recursive: true });

  run('git add -A', worktreeDir);

  const status = execSync('git status --porcelain', {
    cwd: worktreeDir,
    encoding: 'utf8',
  }).trim();

  if (status.length === 0) {
    console.log('No changes detected in gh-pages.');
  } else {
    run('git commit -m "Deploy portfolio"', worktreeDir);
    run('git push origin HEAD:gh-pages', worktreeDir);
  }
} finally {
  cleanupWorktree();
}

