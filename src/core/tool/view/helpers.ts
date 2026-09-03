export async function runSafeAsync(action: () => Promise<void>) {
  try {
    await action();
  } catch {
    return;
  }
}

export function canUseWebScreenOrientation() {
  return typeof screen !== 'undefined' && Boolean(screen.orientation);
}
