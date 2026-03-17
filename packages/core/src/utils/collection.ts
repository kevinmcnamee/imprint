/**
 * Return a sorted array with duplicate and blank entries removed.
 */
export function uniqueStrings(values: readonly string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right)
  );
}

/**
 * Normalized case-insensitive text match.
 */
export function includesText(haystack: string, needle: string): boolean {
  return haystack.toLocaleLowerCase().includes(needle.toLocaleLowerCase());
}
