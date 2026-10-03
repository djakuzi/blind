export function isFileNotFoundError(error: unknown) {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}
