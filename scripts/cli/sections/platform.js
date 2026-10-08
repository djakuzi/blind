import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { runNpm, runCapacitor } from '../core/npm.js';
import { printLine } from '../core/terminal.js';

const MOBILE = ['android', 'ios'];

async function ensurePlatform(context, platform) {
  if (!MOBILE.includes(platform)) throw new Error('Supported platforms: android, ios');
  if (platform === 'ios' && process.platform !== 'darwin') {
    throw new Error('iOS tooling requires macOS.');
  }
  try {
    await access(join(context.root, platform));
  } catch {
    throw new Error(`Native project is missing: ${platform}`);
  }
}

function parseOptions(args, action) {
  const [platform, ...flags] = args;
  if (!MOBILE.includes(platform)) throw new Error(`Usage: platform ${action} <android|ios>${action === 'open' ? '' : ' [--build] [--mode debug|prod]'}`);
  if (action === 'open') {
    if (flags.length) throw new Error('Usage: platform open <android|ios>');
    return { platform, build: false, mode: 'prod' };
  }
  let build = false;
  let mode = 'prod';
  const seen = new Set();
  for (let i = 0; i < flags.length; i += 1) {
    const flag = flags[i];
    if (seen.has(flag)) throw new Error(`Duplicate option: ${flag}`);
    seen.add(flag);
    if (flag === '--build') {
      build = true;
    } else if (flag === '--mode' && ['debug', 'prod'].includes(flags[i + 1])) {
      mode = flags[++i];
    } else {
      throw new Error(`Usage: platform ${action} <android|ios> [--build] [--mode debug|prod]`);
    }
  }
  if (!build && seen.has('--mode')) throw new Error('--mode requires --build');
  return { platform, build, mode };
}

export function registerPlatformSection(registry) {
  registry.addSection({
    id: 'platform',
    title: 'Platforms',
    description: 'Capacitor mobile project operations',
  });

  for (const action of ['sync', 'open', 'run']) {
    registry.addCommand({
      section: 'platform',
      id: action,
      description: action === 'open' ? 'Open native IDE: <android|ios>' : `${action} native project: <android|ios> [--build] [--mode debug|prod]`,
      async run(context, args) {
        const { platform, build, mode } = parseOptions(args, action);
        await ensurePlatform(context, platform);
        if (build) {
          printLine(`Building Web assets (${mode})...`);
          const result = await runNpm(context, mode === 'debug' ? 'build:debug' : 'build:prod');
          if (result !== 0) return result;
          const syncResult = await runCapacitor(context, 'sync', platform);
          if (syncResult !== 0 || action === 'sync') return syncResult;
        } else if (action !== 'open') {
          printLine('Using existing Web build. Pass --build to build and sync first.');
        }
        return runCapacitor(context, action, platform);
      },
    });
  }
}
