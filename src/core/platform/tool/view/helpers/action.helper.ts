async function runSafe(action: () => Promise<void>) {
  try {
    await action();

    return true;
  } catch {
    return false;
  }
}

export const HelperAction = {
  runSafe,
};
