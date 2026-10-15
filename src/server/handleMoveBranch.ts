import type { FastifyRequest } from "fastify";
import { moveBranch } from "../branches/moveBranch";
import type { BranchMove } from "../types/BranchMove";
import type { BranchMoveResponse } from "../types/BranchMoveResponse";

export async function handleMoveBranch(
  request: FastifyRequest<{ Params: { branchName: string }; Body: BranchMove }>,
): Promise<BranchMoveResponse> {
  return { result: await moveBranch(request.params.branchName, request.body) };
}
