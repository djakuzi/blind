function normalizePath(path: string) {
  if (typeof path !== 'string' || !path || path.includes('\0')) {
    throw new Error('Invalid filesystem path');
  }

  const normalizedPath = path.replace(/\\/g, '/');

  if (normalizedPath.startsWith('/') || /^[a-zA-Z]:\//.test(normalizedPath)) {
    throw new Error(`Filesystem path must be relative: ${path}`);
  }

  const segments = normalizedPath.split('/');

  if (segments.some((segment) => !segment || segment === '.' || segment === '..')) {
    throw new Error(`Invalid filesystem path: ${path}`);
  }

  return {
    path: segments.join('/'),
    segments,
  };
}

export const HelperPath = {
  normalizePath,
};
