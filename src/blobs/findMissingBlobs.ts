import type { BlobHash } from "../types/BlobHash";
import type { FileChange } from "../types/FileChange";
import { hasBlob } from "./hasBlob";

export async function findMissingBlobs(fileChanges: FileChange[]): Promise<BlobHash[]> {
  const blobHashes = getBlobHashes(fileChanges);
  const blobExists = await Promise.all(blobHashes.map(hasBlob));
  return blobHashes.filter((_blobHash, index) => !blobExists[index]);
}

function getBlobHashes(fileChanges: FileChange[]): BlobHash[] {
  const blobHashes = fileChanges.flatMap((fileChange) => (fileChange.blobHash ? [fileChange.blobHash] : []));
  return [...new Set(blobHashes)];
}
