import type { ChangesetId } from "./ChangesetId";
import type { FileChange } from "./FileChange";

export interface NewChangeset {
  parentId: ChangesetId | null;
  author: string;
  message: string;
  fileChanges: FileChange[];
}
