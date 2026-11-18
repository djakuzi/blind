import { lstat, realpath, rm } from 'node:fs/promises';
import { resolve, relative, isAbsolute, sep } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { runProcess } from '../core/process.js';
import { printLine } from '../core/terminal.js';

const TARGETS = Object.freeze({
  web: ['dist'],
  desktop: ['dist-electron'],
  release: ['release/desktop'],
  cache: ['node_modules/.vite', 'node_modules/.cache'],
  dependencies: ['node_modules'],
});
const FORBIDDEN = new Set(['.', '', '..']);

async function safePath(root, entry) {
  if (isAbsolute(entry) || FORBIDDEN.has(entry)) throw new Error('Unsafe cleanup target.');
  const absolute = resolve(root, entry);
  const rel = relative(root, absolute);
  if (!rel || rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)) throw new Error('Unsafe cleanup target.');
  const stat = await lstat(absolute).catch((error) => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  if (!stat) return null;
  if (stat.isSymbolicLink()) throw new Error(`Refusing symbolic link target: ${entry}`);
  const canonicalRoot = await realpath(root);
  const canonical = await realpath(absolute);
  const canonicalRelative = relative(canonicalRoot, canonical);
  if (!canonicalRelative || canonicalRelative === '..' || canonicalRelative.startsWith('..' + sep) || isAbsolute(canonicalRelative)) {
    throw new Error(`Target escapes project root: ${entry}`);
  }
  return absolute;
}

async function confirm(message, signal) {
  if (!stdin.isTTY || !stdout.isTTY) throw new Error('Confirmation requires a terminal. Use --yes for non-interactive operations.');
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    const value = await rl.question(`${message} [y/N]: `, { signal });
    return value.trim().toLowerCase() === 'y' || value.trim().toLowerCase() === 'yes';
  } catch (error) {
    if (signal.aborted || error.name === 'AbortError') return false;
    throw error;
  } finally {
    rl.close();
  }
}

async function cleanup(context, target, flags) {
  if (!Object.hasOwn(TARGETS, target)) throw new Error('Usage: clean <web|desktop|release|cache|dependencies> [--dry-run] [--yes]');
  if (flags.some((flag) => !['--dry-run', '--yes'].includes(flag)) || new Set(flags).size !== flags.length) {
    throw new Error('Usage: clean <target> [--dry-run] [--yes]');
  }
  const entries = TARGETS[target];
  const paths = [];
  for (const entry of entries) {
    const path = await safePath(context.root, entry);
    if (path) paths.push({ entry, path });
  }
  if (!paths.length) {
    printLine('Nothing to clean.');
    return 0;
  }
  printLine('Cleanup targets:');
  paths.forEach(({ entry }) => printLine(`  ${entry}`));
  if (flags.includes('--dry-run')) {
    printLine('Dry run: no files removed.');
    return 0;
  }
  if (!flags.includes('--yes') && !(await confirm('Remove these targets?', context.signal))) {
    printLine('Cancelled.');
    return 0;
  }
  for (const { entry, path } of paths) {
    if (context.signal.aborted) return 130;
    // Revalidate immediately before deletion.
    if (!(await safePath(context.root, entry))) continue;
    await rm(path, { recursive: true, force: true });
    printLine(`Removed: ${entry}`);
  }
  return 0;
}

export function registerCleanSection(registry) {
  registry.addSection({ id: 'clean', title: 'Clean', description: 'Remove generated artifacts safely' });
  for (const target of Object.keys(TARGETS)) {
    registry.addCommand({
      section: 'clean',
      id: target,
      description: `Clean ${TARGETS[target].join(', ')} [--dry-run] [--yes]`,
      run(context, args) {
        return cleanup(context, target, args);
      },
    });
  }
  registry.addCommand({
    section: 'clean',
    id: 'reinstall',
    description: 'Remove node_modules and run npm ci [--dry-run] [--yes]',
    async run(context, args) {
      if (args.some((flag) => !['--dry-run', '--yes'].includes(flag)) || new Set(args).size !== args.length) {
        throw new Error('Usage: clean reinstall [--dry-run] [--yes]');
      }
      if (args.includes('--dry-run')) {
        printLine('Dry run: remove node_modules, then npm ci.');
        return 0;
      }
      if (!args.includes('--yes') && !(await confirm('Remove node_modules and reinstall dependencies?', context.signal))) {
        printLine('Cancelled.');
        return 0;
      }
      const result = await cleanup(context, 'dependencies', ['--yes']);
      if (result !== 0) return result;
      return runProcess(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['ci'], {
        cwd: context.root,
        signal: context.signal,
        shell: process.platform === 'win32',
      });
    },
  });
}
