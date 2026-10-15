import type { BlobHash } from "../types/BlobHash";

export function makeBlobKey(blobHash: BlobHash): string {
  return `blobs/${blobHash.slice(0, 2)}/${blobHash}`;
}
