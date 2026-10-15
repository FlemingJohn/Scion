import type { BlobHash } from "./BlobHash";
import type { FileKind } from "./FileKind";

export interface FileEntry {
  path: string;
  kind: FileKind;
  blobHash: BlobHash;
}
