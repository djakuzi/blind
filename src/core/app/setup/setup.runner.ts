import { resetSetupState, setupState } from './setup.state';
import type { iSetup } from './setup.type';

export async function runPreMountSetup(setups: readonly iSetup[]) {
  resetSetupState();

  for (const setup of setups) {
    await setup.preMount?.();
  }
}

export async function runPostMountSetup(setups: readonly iSetup[]) {
  setupState.isRunning = true;

  const blockingTasks: Promise<void>[] = [];

  for (const setup of setups) {
    const postMount = setup.postMount;

    if (!postMount) {
      continue;
    }

    const task = Promise.resolve().then(() => postMount.run());

    if (postMount.mode === 'background') {
      task.catch((error) => {
        console.error(`Background setup "${setup.key}" failed:`, error);
      });

      continue;
    }

    blockingTasks.push(task);
  }

  try {
    await Promise.all(blockingTasks);
    setupState.isReady = true;
  } finally {
    setupState.isRunning = false;
  }
}
