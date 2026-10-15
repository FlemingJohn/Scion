import type { FastifyReply, FastifyRequest } from "fastify";
import { getDiff } from "../diffs/getDiff";

export async function handleGetDiff(
  request: FastifyRequest<{ Params: { fromChangesetId: string; toChangesetId: string } }>,
  reply: FastifyReply,
) {
  const diff = await getDiff(request.params.fromChangesetId, request.params.toChangesetId);
  if (!diff) {
    return reply.code(404).send({ error: "changeset not found" });
  }
  return diff;
}
