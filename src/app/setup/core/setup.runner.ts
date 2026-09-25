import { appSetupState, resetAppSetupState } from './setup.state';
import type { iAppSetup } from './setup.type';

export async function runPreMountSetup(
  setups: readonly iAppSetup[],
) {
  resetAppSetupState();

  for (const setup of setups) {
    await setup.preMount?.();
  }
}

export async function runPostMountSetup(
  setups: readonly iAppSetup[],
) {
  appSetupState.isRunning = true;

  const blockingTasks: Promise<void>[] = [];

  for (const setup of setups) {
    const postMount = setup.postMount;

    if (!postMount) {
      continue;
    }

    const task = Promise
      .resolve()
      .then(() => postMount.run());

    if (postMount.mode === 'background') {
      task.catch((error) => {
        console.error(
          `Background app setup "${setup.key}" failed:`,
          error,
        );
      });

      continue;
    }

    blockingTasks.push(task);
  }

  try {
    await Promise.all(blockingTasks);
    appSetupState.isReady = true;
  } finally {
    appSetupState.isRunning = false;
  }
}
