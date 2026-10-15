import { joinPath } from "../paths/joinPath";
import type { ChangesetId } from "../types/ChangesetId";
import type { FileEntry } from "../types/FileEntry";
import { getTreeFromCache } from "./getTreeFromCache";

export async function collectFiles(changesetId: ChangesetId, folderPath: string): Promise<FileEntry[]> {
  const tree = await getTreeFromCache(changesetId, folderPath);
  const files: FileEntry[] = [];
  for (const entry of tree.entries) {
    const entryPath = joinPath(folderPath, entry.name);
    if (entry.kind === "folder") {
      files.push(...(await collectFiles(changesetId, entryPath)));
    } else if (entry.blobHash !== null) {
      files.push({ path: entryPath, kind: entry.kind, blobHash: entry.blobHash });
    }
  }
  return files;
}
