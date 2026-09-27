/**
 * Whitelist of high-intent, indexable comparison pairs between major UK metropolitan hubs.
 * Only these pairs are indexed by search engines to protect crawl budget and prevent thin content traps.
 */
export const POPULAR_COMPARE_PAIRS = [
  "sw1a-1-vs-m1-1",
  "sw1a-1-vs-b1-1",
  "sw1a-1-vs-eh1-1",
  "b1-1-vs-m1-1",
  "ab10-1-vs-sw1a-1",
  "ls1-1-vs-sw1a-1",
  "bs1-1-vs-m1-1",
] as const;

export type PopularComparePair = (typeof POPULAR_COMPARE_PAIRS)[number];

export function isPopularComparePair(slug: string): boolean {
  if (!slug) return false;
  const normalized = slug.trim().toLowerCase();
  return (POPULAR_COMPARE_PAIRS as readonly string[]).includes(normalized);
}
