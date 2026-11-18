function normalizeCode(code: string) {
  const exact = code.trim().replaceAll('_', '-').toLowerCase();

  return {
    exact,
    base: exact.split('-')[0] ?? exact,
  };
}

export const moduleNormalize = {
  normalizeCode,
};
