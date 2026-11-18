import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { printLine } from '../core/terminal.js';

const ENV_FILES = ['.env.debug', '.env.prod'];
const REQUIRED_PROPERTY_FILES = {
  android: 'android/local.properties',
  ios: 'ios/local.xcconfig',
};

function runVersion(executable, args = ['--version']) {
  const result = spawnSync(executable, args, { encoding: 'utf8', timeout: 5000, windowsHide: true });
  if (result.error || result.status !== 0) return null;
  return (result.stdout || result.stderr || '').trim().split(/\r?\n/)[0] || 'installed';
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function getPackage(root) {
  return JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
}

async function loadTemplateKeys(root) {
  const content = await readFile(join(root, '.env.template'), 'utf8');
  return [...content.matchAll(/^\s*([A-Za-z_][\w]*)\s*=/gm)].map((match) => match[1]);
}

function parseEnvKeys(content) {
  return new Set([...content.matchAll(/^\s*(?:export\s+)?([A-Za-z_][\w]*)\s*=/gm)].map((match) => match[1]));
}

function assertNoArgs(args, usage) {
  if (args.length) throw new Error(`Usage: ${usage}`);
}

function report(name, ok, detail = '') {
  printLine(`${ok ? '[OK]' : '[FAIL]'} ${name}${detail ? `: ${detail}` : ''}`);
  return ok;
}

async function checkEnvironment(root) {
  const required = await loadTemplateKeys(root);
  let healthy = true;
  for (const name of ENV_FILES) {
    const filePath = join(root, name);
    if (!(await exists(filePath))) {
      healthy = report(name, false, 'missing') && healthy;
      continue;
    }
    const keys = parseEnvKeys(await readFile(filePath, 'utf8'));
    const missing = required.filter((key) => !keys.has(key));
    healthy =
      report(name, missing.length === 0, missing.length ? `missing keys: ${missing.join(', ')}` : 'all required keys present') && healthy;
  }
  return healthy;
}

function platformChecks(platform) {
  if (platform === 'android') {
    return [
      ['Java', 'java', ['-version']],
      ['ADB', 'adb', ['version']],
    ];
  }
  if (platform === 'ios') {
    return [
      ['Xcode', 'xcodebuild', ['-version']],
      ['CocoaPods', 'pod', ['--version']],
    ];
  }
  if (platform === 'desktop' || platform === 'web') return [];
  throw new Error('Usage: project doctor [web|desktop|android|ios]');
}

async function doctor(context, args) {
  if (args.length > 1) throw new Error('Usage: project doctor [web|desktop|android|ios]');
  const target = args[0] ?? 'web';
  const checks = platformChecks(target);
  const pkg = await getPackage(context.root);
  const requiredNode = Number(pkg.engines.node.match(/\d+/)?.[0] ?? 22);
  const nodeOk = Number(process.versions.node.split('.')[0]) >= requiredNode;
  let healthy = report('Node.js', nodeOk, `${process.version} (requires ${pkg.engines.node})`);
  healthy = report('npm', Boolean(runVersion(process.platform === 'win32' ? 'npm.cmd' : 'npm'))) && healthy;
  healthy = report('Git', Boolean(runVersion('git'))) && healthy;
  healthy = report('node_modules', await exists(join(context.root, 'node_modules'))) && healthy;
  healthy = (await checkEnvironment(context.root)) && healthy;
  if (target === 'android' || target === 'ios') {
    healthy = report(`${target} project`, await exists(join(context.root, target))) && healthy;
    const property = REQUIRED_PROPERTY_FILES[target];
    healthy = report(property, await exists(join(context.root, property))) && healthy;
    if (target === 'ios') healthy = report('macOS', process.platform === 'darwin') && healthy;
  }
  for (const [name, executable, versionArgs] of checks) {
    const result = runVersion(executable, versionArgs);
    healthy = report(name, result !== null, result ?? 'not found') && healthy;
  }
  printLine(healthy ? 'Doctor: ready' : 'Doctor: some requirements are missing');
  return healthy ? 0 : 1;
}

async function status(context, args) {
  assertNoArgs(args, 'project status');
  const pkg = await getPackage(context.root);
  const git = spawnSync('git', ['branch', '--show-current'], { cwd: context.root, encoding: 'utf8', timeout: 5000 });
  const porcelain = spawnSync('git', ['status', '--porcelain'], { cwd: context.root, encoding: 'utf8', timeout: 5000 });
  printLine(`Project: ${pkg.name}@${pkg.version}`);
  printLine(`Branch: ${git.status === 0 ? git.stdout.trim() || '(detached)' : 'unavailable'}`);
  printLine(`Working tree: ${porcelain.status !== 0 ? 'unavailable' : porcelain.stdout.trim() ? 'modified' : 'clean'}`);
  printLine(`Node: ${process.version}; OS: ${process.platform}`);
  printLine(`Dependencies: ${(await exists(join(context.root, 'node_modules'))) ? 'installed' : 'missing'}`);
  return 0;
}

async function versions(context, args) {
  assertNoArgs(args, 'project versions');
  const pkg = await getPackage(context.root);
  printLine(`Blind: ${pkg.version}`);
  printLine(`Node: ${process.version}`);
  for (const [name, bin, params] of [
    ['npm', process.platform === 'win32' ? 'npm.cmd' : 'npm', ['--version']],
    ['Git', 'git', ['--version']],
  ])
    printLine(`${name}: ${runVersion(bin, params) ?? 'not installed'}`);
  for (const name of ['vue', 'vite', 'typescript', 'electron', '@capacitor/core']) {
    printLine(`${name}: ${pkg.dependencies?.[name] ?? pkg.devDependencies?.[name] ?? 'not configured'}`);
  }
  return 0;
}

export function registerProjectSection(registry) {
  registry.addSection({ id: 'project', title: 'Project', description: 'Project status and environment diagnostics' });
  registry.addCommand({
    section: 'project',
    id: 'info',
    description: 'Show basic project information',
    run: async (context, args) => {
      assertNoArgs(args, 'project info');
      const pkg = await getPackage(context.root);
      printLine(`Project: ${pkg.name}\nVersion: ${pkg.version}\nNode: ${process.version}\nPlatform: ${process.platform}`);
      return 0;
    },
  });
  registry.addCommand({ section: 'project', id: 'status', description: 'Show Git and workspace status', run: status });
  registry.addCommand({ section: 'project', id: 'versions', description: 'Show tool and dependency versions', run: versions });
  registry.addCommand({
    section: 'project',
    id: 'env',
    description: 'Check environment keys without exposing values',
    run: async (context, args) => {
      assertNoArgs(args, 'project env');
      return (await checkEnvironment(context.root)) ? 0 : 1;
    },
  });
  registry.addCommand({ section: 'project', id: 'doctor', description: 'Check requirements: [web|desktop|android|ios]', run: doctor });
}
