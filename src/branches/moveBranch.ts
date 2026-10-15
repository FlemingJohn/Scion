import { getDatabase } from "../database/getDatabase";
import type { BranchMove } from "../types/BranchMove";
import type { BranchMoveResult } from "../types/BranchMoveResult";
import { createBranch } from "./createBranch";

export async function moveBranch(branchName: string, branchMove: BranchMove): Promise<BranchMoveResult> {
  if (branchMove.expectedChangesetId === null) {
    const hasCreated = await createBranch(branchName, branchMove.newChangesetId);
    return hasCreated ? "moved" : "conflict";
  }
  const database = getDatabase();
  const result = await database`
    update branches
    set changeset_id = ${branchMove.newChangesetId}
    where name = ${branchName} and changeset_id = ${branchMove.expectedChangesetId}
  `;
  return result.count === 1 ? "moved" : "conflict";
}
