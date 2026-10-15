import type { FastifyReply, FastifyRequest } from "fastify";
import { getBranch } from "../branches/getBranch";

export async function handleGetBranch(
  request: FastifyRequest<{ Params: { branchName: string } }>,
  reply: FastifyReply,
) {
  const branch = await getBranch(request.params.branchName);
  if (!branch) {
    return reply.code(404).send({ error: "branch not found" });
  }
  return branch;
}
