import type { FastifyReply, FastifyRequest } from "fastify";
import { makeBadRequestError } from "../errors/makeBadRequestError";
import { isValidPath } from "../paths/isValidPath";
import { getTree } from "../trees/getTree";

export async function handleGetTree(
  request: FastifyRequest<{ Params: { changesetId: string }; Querystring: { path?: string } }>,
  reply: FastifyReply,
) {
  const path = request.query.path ?? "";
  if (path !== "" && !isValidPath(path)) {
    throw makeBadRequestError(`invalid path ${path}`);
  }
  const tree = await getTree(request.params.changesetId, path);
  if (!tree) {
    return reply.code(404).send({ error: "changeset not found" });
  }
  return tree;
}
