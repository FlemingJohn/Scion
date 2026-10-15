import { LRUCache } from "lru-cache";
import { getConfiguration } from "../configuration/getConfiguration";
import type { CachedObject } from "../types/CachedObject";

let objectCache: LRUCache<string, CachedObject> | undefined;

export function getObjectCache(): LRUCache<string, CachedObject> {
  if (!objectCache) {
    objectCache = new LRUCache<string, CachedObject>({
      maxSize: getConfiguration().cacheSizeInBytes,
      sizeCalculation: (cachedObject) => Math.max(1, cachedObject.body.length),
    });
  }
  return objectCache;
}
