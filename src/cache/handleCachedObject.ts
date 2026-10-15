import type { FastifyReply, FastifyRequest } from "fastify";
import type { CachedObject } from "../types/CachedObject";
import { getCacheStatistics } from "./getCacheStatistics";
import { getFromServer } from "./getFromServer";
import { getObjectCache } from "./getObjectCache";

export async function handleCachedObject(request: FastifyRequest, reply: FastifyReply) {
  const objectCache = getObjectCache();
  const statistics = getCacheStatistics();
  const cachedObject = objectCache.get(request.url);
  if (cachedObject) {
    statistics.hits += 1;
    return sendObject(reply, cachedObject);
  }
  statistics.misses += 1;
  const fetchedObject = await getFromServer(request.url);
  if (!fetchedObject) {
    return reply.code(404).send({ error: "object not found" });
  }
  objectCache.set(request.url, fetchedObject);
  return sendObject(reply, fetchedObject);
}

function sendObject(reply: FastifyReply, cachedObject: CachedObject) {
  return reply.type(cachedObject.contentType).send(cachedObject.body);
}
