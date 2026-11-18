function get() {
  if (typeof localStorage === 'undefined') {
    throw new Error('Browser storage is not available');
  }

  return localStorage;
}

function tryGet() {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export const HelperBrowserStorage = {
  get,
  tryGet,
};
