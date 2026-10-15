import type { FastifyReply, FastifyRequest } from "fastify";
import { getBlob } from "../blobs/getBlob";
import { isBlobHash } from "../blobs/isBlobHash";
import { makeBadRequestError } from "../errors/makeBadRequestError";

export async function handleGetBlob(request: FastifyRequest<{ Params: { blobHash: string } }>, reply: FastifyReply) {
  if (!isBlobHash(request.params.blobHash)) {
    throw makeBadRequestError("a blob hash is 64 lowercase hex characters");
  }
  const contents = await getBlob(request.params.blobHash);
  if (!contents) {
    return reply.code(404).send({ error: "blob not found" });
  }
  return reply.type("application/octet-stream").send(contents);
}
