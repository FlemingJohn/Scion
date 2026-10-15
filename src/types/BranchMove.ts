import type { ChangesetId } from "./ChangesetId";

export interface BranchMove {
  expectedChangesetId: ChangesetId | null;
  newChangesetId: ChangesetId;
}
