import { getCacheStatistics } from "./getCacheStatistics";
import { getObjectCache } from "./getObjectCache";

export async function handleGetStatistics() {
  const statistics = getCacheStatistics();
  const requestCount = statistics.hits + statistics.misses;
  return {
    hits: statistics.hits,
    misses: statistics.misses,
    hitRate: requestCount === 0 ? 0 : statistics.hits / requestCount,
    objectCount: getObjectCache().size,
    sizeInBytes: getObjectCache().calculatedSize,
  };
}
