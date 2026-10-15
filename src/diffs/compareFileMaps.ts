import type { DiffChange } from "../types/DiffChange";
import type { DiffEntry } from "../types/DiffEntry";
import type { FileEntry } from "../types/FileEntry";
import type { FileMap } from "../types/FileMap";

export function compareFileMaps(before: FileMap, after: FileMap): DiffEntry[] {
  const paths = [...new Set([...before.keys(), ...after.keys()])].sort();
  const diffEntries: DiffEntry[] = [];
  for (const path of paths) {
    const beforeEntry = before.get(path);
    const afterEntry = after.get(path);
    const change = getChange(beforeEntry, afterEntry);
    if (change) {
      diffEntries.push({
        path,
        change,
        beforeBlobHash: beforeEntry?.blobHash ?? null,
        afterBlobHash: afterEntry?.blobHash ?? null,
      });
    }
  }
  return diffEntries;
}

function getChange(beforeEntry: FileEntry | undefined, afterEntry: FileEntry | undefined): DiffChange | null {
  if (!beforeEntry) {
    return "added";
  }
  if (!afterEntry) {
    return "removed";
  }
  const isSame = beforeEntry.blobHash === afterEntry.blobHash && beforeEntry.kind === afterEntry.kind;
  return isSame ? null : "modified";
}
