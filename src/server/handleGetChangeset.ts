import type { FastifyReply, FastifyRequest } from "fastify";
import { getChangeset } from "../changesets/getChangeset";

export async function handleGetChangeset(
  request: FastifyRequest<{ Params: { changesetId: string } }>,
  reply: FastifyReply,
) {
  const changeset = await getChangeset(request.params.changesetId);
  if (!changeset) {
    return reply.code(404).send({ error: "changeset not found" });
  }
  return changeset;
}
