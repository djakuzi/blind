function normalizePath(path: string) {
  const normalizedPath = path.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');

  if (!normalizedPath) {
    throw new Error('Filesystem path is empty');
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
