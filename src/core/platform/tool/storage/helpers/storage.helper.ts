function getBrowserStorage() {
  if (typeof localStorage === 'undefined') {
    throw new Error('Browser storage is not available');
  }

  return localStorage;
}

export const HelperStorage = {
  getBrowserStorage,
};
