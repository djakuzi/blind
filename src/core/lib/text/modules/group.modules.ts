function formatGroups(total: number, groupSize: number, separator: string): string {
  if (!Number.isSafeInteger(total) || !Number.isSafeInteger(groupSize) || total <= 0 || groupSize <= 0 || total % groupSize !== 0) {
    return String(total);
  }

  const groupCount = total / groupSize;

  if (groupCount < 2) {
    return String(total);
  }

  return Array.from({ length: groupCount }, () => String(groupSize)).join(separator);
}

export const moduleGroup = {
  formatGroups,
};
