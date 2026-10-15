import type { FileChange } from "../types/FileChange";
import type { FileMap } from "../types/FileMap";

export function applyFileChanges(fileMap: FileMap, fileChanges: FileChange[]): void {
  for (const fileChange of fileChanges) {
    if (fileChange.kind === "deleted" || fileChange.blobHash === null) {
      fileMap.delete(fileChange.path);
    } else {
      fileMap.set(fileChange.path, {
        path: fileChange.path,
        kind: fileChange.kind,
        blobHash: fileChange.blobHash,
      });
    }
  }
}
