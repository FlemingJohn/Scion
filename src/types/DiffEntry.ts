import type { BlobHash } from "./BlobHash";
import type { DiffChange } from "./DiffChange";

export interface DiffEntry {
  path: string;
  change: DiffChange;
  beforeBlobHash: BlobHash | null;
  afterBlobHash: BlobHash | null;
}
