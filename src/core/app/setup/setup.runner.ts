import {
  initializeBlockingSetupState,
  resetSetupState,
  setBlockingSetupStatus,
  setupState,
} from './setup.state';
import type { iSetup } from './setup.type';

const blockingSetupRegistry = new Map<string, iSetup>();

async function runBlockingSetup(setup: iSetup) {
  const postMount = setup.postMount;

  if (!postMount || postMount.mode !== 'blocking') {
    return;
  }

  setBlockingSetupStatus(setup.key, 'pending');

  try {
    await postMount.run();
    setBlockingSetupStatus(setup.key, 'loaded');
  } catch (error) {
    setBlockingSetupStatus(setup.key, 'error');
    console.error(`Blocking setup "${setup.key}" failed:`, error);
  }
}

export async function retryPostMountSetup(setupKey: string) {
  const setup = blockingSetupRegistry.get(setupKey);

  if (!setup || setupState.blocking[setupKey] !== 'error') {
    return;
  }

  await runBlockingSetup(setup);
}

export async function runPreMountSetup(setups: readonly iSetup[]) {
  resetSetupState();
  blockingSetupRegistry.clear();

  for (const setup of setups) {
    await setup.preMount?.();
  }
}

export async function runPostMountSetup(setups: readonly iSetup[]) {
  const blockingSetups = setups.filter((setup) => setup.postMount?.mode === 'blocking');

  blockingSetupRegistry.clear();

  blockingSetups.forEach((setup) => {
    blockingSetupRegistry.set(setup.key, setup);
  });

  initializeBlockingSetupState(blockingSetups.map((setup) => setup.key));

  const blockingTasks: Promise<void>[] = [];

  for (const setup of setups) {
    const postMount = setup.postMount;

    if (!postMount) {
      continue;
    }

    if (postMount.mode === 'background') {
      Promise.resolve()
        .then(() => postMount.run())
        .catch((error) => {
          console.error(`Background setup "${setup.key}" failed:`, error);
        });

      continue;
    }

    blockingTasks.push(runBlockingSetup(setup));
  }

  await Promise.all(blockingTasks);
}
