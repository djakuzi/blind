import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { runNpm, runCapacitor } from '../core/npm.js';
import { printLine } from '../core/terminal.js';
import { choose } from '../core/prompt.js';

const TARGETS = ['mac', 'win', 'linux'];
const HOST_TARGET = { darwin: 'mac', win32: 'win', linux: 'linux' };
const MOBILE = ['android', 'ios'];

function usage(command, detail) {
  throw new Error(`Usage: ${command} ${detail}`);
}

async function select(context, title, values) {
  printLine(title);
  const options = [{ label: 'Back', value: null }, ...values.map(({ label, value }) => ({ label, value }))];
  options.forEach((option, index) => printLine(`${index}. ${option.label}`));
  const selected = await choose(options, context.signal);
  return selected?.value ?? null;
}

async function checkNativeProject(context, platform) {
  if (platform === 'ios' && process.platform !== 'darwin') throw new Error('Preparing iOS requires macOS.');
  try {
    await access(join(context.root, platform));
  } catch {
    throw new Error(`Native project is missing: ${platform}`);
  }
}

export function registerBuildSection(registry) {
  registry.addSection({ id: 'build', title: 'Build', description: 'Build Web, Desktop or prepare mobile assets' });

  registry.addCommand({
    section: 'build',
    id: 'web',
    description: 'Web build: [debug|prod]',
    async run(context, args) {
      let mode = args[0];
      if (args.length === 0) mode = await select(context, 'Select Web build mode:', [
        { label: 'Debug', value: 'debug' },
        { label: 'Production', value: 'prod' },
      ]);
      if (mode === null) return 0;
      if (!['debug', 'prod'].includes(mode) || args.length > 1) usage('build web', '[debug|prod]');
      return runNpm(context, `build:${mode}`);
    },
  });

  registry.addCommand({
    section: 'build',
    id: 'desktop',
    description: 'Build Electron production assets',
    async run(context, args) {
      if (args.length) usage('build desktop', '');
      return runNpm(context, 'desktop:build');
    },
  });

  registry.addCommand({
    section: 'build',
    id: 'mobile',
    description: 'Build Web and sync: <android|ios> [debug|prod]',
    async run(context, args) {
      let platform = args[0];
      let mode = args[1] ?? 'prod';
      if (args.length === 0) {
        platform = await select(context, 'Select mobile platform:', MOBILE.map((value) => ({ label: value, value })));
        if (platform === null) return 0;
        mode = await select(context, 'Select Web build mode:', [
          { label: 'Debug', value: 'debug' },
          { label: 'Production', value: 'prod' },
        ]);
        if (mode === null) return 0;
      }
      if (!MOBILE.includes(platform) || !['debug', 'prod'].includes(mode) || args.length > 2) {
        usage('build mobile', '<android|ios> [debug|prod]');
      }
      await checkNativeProject(context, platform);
      const result = await runNpm(context, `build:${mode}`);
      if (result !== 0) return result;
      return runCapacitor(context, 'sync', platform);
    },
  });

  registry.addSection({ id: 'package', title: 'Package', description: 'Create Electron desktop distributions' });
  registry.addCommand({
    section: 'package',
    id: 'desktop',
    description: 'Create desktop package: [current|mac|win|linux]',
    async run(context, args) {
      let target = args[0];
      if (args.length === 0) target = await select(context, 'Select desktop target:', [
        { label: 'Current operating system', value: 'current' },
        { label: 'macOS', value: 'mac' },
        { label: 'Windows', value: 'win' },
        { label: 'Linux', value: 'linux' },
      ]);
      if (target === null) return 0;
      if (!['current', ...TARGETS].includes(target) || args.length > 1) {
        usage('package desktop', '[current|mac|win|linux]');
      }
      const actualTarget = target === 'current' ? HOST_TARGET[process.platform] : target;
      if (!actualTarget) throw new Error(`Unsupported host: ${process.platform}`);
      if (actualTarget !== HOST_TARGET[process.platform]) {
        throw new Error(`Cross-platform packaging for ${actualTarget} is not supported by this CLI. Build on its matching OS or use GitHub Actions.`);
      }
      return runNpm(context, target === 'current' ? 'desktop:package' : `desktop:package:${target}`);
    },
  });
}
