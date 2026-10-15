import type { BlobHash } from "./BlobHash";
import type { TreeEntryKind } from "./TreeEntryKind";

export interface TreeEntry {
  name: string;
  kind: TreeEntryKind;
  blobHash: BlobHash | null;
}
