import { readFile } from "node:fs/promises";
import { makeBlobHash } from "../blobs/makeBlobHash";
import { makeFileMapFromFiles } from "../trees/makeFileMapFromFiles";
import type { CheckoutState } from "../types/CheckoutState";
import type { FileChange } from "../types/FileChange";
import { listWorkingFiles } from "./listWorkingFiles";

export async function findChangedFiles(checkoutState: CheckoutState): Promise<FileChange[]> {
  const knownFiles = makeFileMapFromFiles(checkoutState.files);
  const workingPaths = await listAllWorkingFiles(checkoutState.paths);
  const fileChanges: FileChange[] = [];
  for (const path of workingPaths) {
    const blobHash = makeBlobHash(await readFile(path));
    const knownFile = knownFiles.get(path);
    if (knownFile?.blobHash !== blobHash) {
      fileChanges.push({ path, kind: knownFile?.kind ?? "regular", blobHash });
    }
  }
  const workingPathSet = new Set(workingPaths);
  for (const file of checkoutState.files) {
    if (!workingPathSet.has(file.path)) {
      fileChanges.push({ path: file.path, kind: "deleted", blobHash: null });
    }
  }
  return fileChanges.sort((first, second) => (first.path < second.path ? -1 : 1));
}

async function listAllWorkingFiles(folderPaths: string[]): Promise<string[]> {
  const pathLists = await Promise.all(folderPaths.map(listWorkingFiles));
  return [...new Set(pathLists.flat())];
}
