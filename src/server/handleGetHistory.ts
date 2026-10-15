import type { FastifyRequest } from "fastify";
import { getHistory } from "../changesets/getHistory";

const defaultLimit = 20;
const maximumLimit = 1000;

export async function handleGetHistory(
  request: FastifyRequest<{ Params: { changesetId: string }; Querystring: { limit?: string } }>,
) {
  return getHistory(request.params.changesetId, readLimit(request.query.limit));
}

function readLimit(limit: string | undefined): number {
  const value = Number(limit ?? defaultLimit);
  return Number.isInteger(value) && value > 0 ? Math.min(value, maximumLimit) : defaultLimit;
}
