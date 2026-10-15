import type { CacheStatistics } from "../types/CacheStatistics";

const cacheStatistics: CacheStatistics = { hits: 0, misses: 0 };

export function getCacheStatistics(): CacheStatistics {
  return cacheStatistics;
}
