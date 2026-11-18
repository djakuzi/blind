import type { iPlatformActionResult } from '../../../type';

async function runSafe(action: () => Promise<void>) {
  try {
    await action();

    return true;
  } catch {
    return false;
  }
}

function unsupported(): Promise<iPlatformActionResult> {
  return Promise.resolve({
    isHandled: false,
  });
}

export const HelperViewAction = {
  runSafe,
  unsupported,
};
