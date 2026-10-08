import { spawn } from 'node:child_process';

export async function runProcess(executable, args, { cwd, signal, shell = false } = {}) {
  if (!executable || !Array.isArray(args)) {
    throw new TypeError('Executable and argument array are required.');
  }
  if (signal?.aborted) return 130;

  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      cwd,
      signal,
      stdio: 'inherit',
      shell,
      windowsHide: true,
    });

    child.once('error', (error) => {
      if (signal?.aborted || error.name === 'AbortError') resolve(130);
      else reject(error);
    });
    child.once('close', (code, terminatingSignal) => {
      resolve(terminatingSignal ? 130 : (code ?? 1));
    });
  });
}
