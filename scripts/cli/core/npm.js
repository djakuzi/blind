import { runProcess } from './process.js';

export function runNpm(context, script) {
  const windows = process.platform === 'win32';
  return runProcess(windows ? 'npm.cmd' : 'npm', ['run', script], {
    cwd: context.root,
    signal: context.signal,
    shell: windows,
  });
}

export function runCapacitor(context, action, platform) {
  const windows = process.platform === 'win32';
  return runProcess(windows ? 'npx.cmd' : 'npx', ['--no-install', 'cap', action, platform], {
    cwd: context.root,
    signal: context.signal,
    shell: windows,
  });
}
