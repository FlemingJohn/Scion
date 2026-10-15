import type { FastifyRequest } from "fastify";
import { createChangeset } from "../changesets/createChangeset";
import type { NewChangeset } from "../types/NewChangeset";

export async function handleCreateChangeset(request: FastifyRequest<{ Body: NewChangeset }>) {
  return createChangeset(request.body);
}
