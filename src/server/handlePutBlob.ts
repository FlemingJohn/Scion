import type { FastifyRequest } from "fastify";
import { putBlob } from "../blobs/putBlob";
import { makeBadRequestError } from "../errors/makeBadRequestError";

export async function handlePutBlob(request: FastifyRequest<{ Body: Buffer }>) {
  if (!Buffer.isBuffer(request.body)) {
    throw makeBadRequestError("send the blob as application/octet-stream");
  }
  return { blobHash: await putBlob(request.body) };
}
