import type { ChangesetId } from "./ChangesetId";
import type { FileEntry } from "./FileEntry";

export interface CheckoutState {
  branchName: string;
  changesetId: ChangesetId | null;
  isNewBranch: boolean;
  paths: string[];
  files: FileEntry[];
}
