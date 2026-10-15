import Fastify from "fastify";
import { getConfiguration } from "../configuration/getConfiguration";
import { handleCachedObject } from "./handleCachedObject";
import { handleGetStatistics } from "./handleGetStatistics";

export async function startCache(): Promise<void> {
  const configuration = getConfiguration();
  const cache = Fastify({ logger: true });

  cache.get("/blobs/:blobHash", handleCachedObject);
  cache.get("/changesets/:changesetId/tree", handleCachedObject);
  cache.get("/statistics", handleGetStatistics);

  await cache.listen({ host: configuration.listenHost, port: configuration.cachePort });
}
