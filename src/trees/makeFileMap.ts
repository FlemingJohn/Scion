import type { Changeset } from "../types/Changeset";
import type { FileMap } from "../types/FileMap";
import { applyFileChanges } from "./applyFileChanges";

export function makeFileMap(historyOldestFirst: Changeset[]): FileMap {
  const fileMap: FileMap = new Map();
  for (const changeset of historyOldestFirst) {
    applyFileChanges(fileMap, changeset.fileChanges);
  }
  return fileMap;
}
