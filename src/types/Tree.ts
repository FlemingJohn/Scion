import type { ChangesetId } from "./ChangesetId";
import type { TreeEntry } from "./TreeEntry";

export interface Tree {
  changesetId: ChangesetId;
  path: string;
  entries: TreeEntry[];
}
