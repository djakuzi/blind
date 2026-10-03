import { isAbsolute, relative, sep } from 'node:path';

export function isPathOutsideRoot(root: string, target: string) {
  const relativePath = relative(root, target);

  return (
    relativePath === '..' ||
    relativePath.startsWith(`..${sep}`) ||
    isAbsolute(relativePath)
  );
}
