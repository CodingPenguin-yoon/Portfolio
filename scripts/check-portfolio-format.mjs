import { execFileSync, spawnSync } from 'node:child_process';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));
const prettierExtensions = new Set([
  '.astro',
  '.cjs',
  '.css',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mdx',
  '.mjs',
  '.scss',
  '.ts',
  '.tsx',
  '.yaml',
  '.yml',
]);

function git(argumentsToRun, options = {}) {
  return execFileSync('git', argumentsToRun, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    ...options,
  });
}

function resolveMergeBase() {
  const candidates = [process.env.PORTFOLIO_FORMAT_BASE, 'main', 'origin/main'].filter(Boolean);

  for (const candidate of candidates) {
    try {
      return git(['merge-base', 'HEAD', candidate]).trim();
    } catch {
      // Try the next stable branch reference.
    }
  }

  throw new Error('Unable to resolve the portfolio format base. Set PORTFOLIO_FORMAT_BASE to a branch or commit.');
}

const mergeBase = resolveMergeBase();
const changedFiles = git(['diff', '--name-only', '--diff-filter=ACMR', mergeBase, '--'])
  .split('\n')
  .filter(Boolean)
  .sort();
const prettierFiles = changedFiles.filter((file) => prettierExtensions.has(extname(file).toLowerCase()));

git(['diff', '--check', mergeBase, '--'], { stdio: 'inherit' });

if (prettierFiles.length === 0) {
  console.log(`No Prettier-supported files changed since ${mergeBase}.`);
  process.exit(0);
}

const prettierCli = join(repositoryRoot, 'node_modules', 'prettier', 'bin', 'prettier.cjs');
const result = spawnSync(process.execPath, [prettierCli, '--check', ...prettierFiles], {
  cwd: repositoryRoot,
  stdio: 'inherit',
});

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
