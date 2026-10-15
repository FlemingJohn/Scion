import type { BlobHash } from "./BlobHash";
import type { FileChangeKind } from "./FileChangeKind";

export interface FileChange {
  path: string;
  kind: FileChangeKind;
  blobHash: BlobHash | null;
}
