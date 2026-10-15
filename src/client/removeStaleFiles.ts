import { rm } from "node:fs/promises";
import { isValidPath } from "../paths/isValidPath";
import type { FileEntry } from "../types/FileEntry";

export async function removeStaleFiles(previousFiles: FileEntry[], currentFiles: FileEntry[]): Promise<void> {
  const currentPaths = new Set(currentFiles.map((file) => file.path));
  const stalePaths = previousFiles.map((file) => file.path).filter((path) => !currentPaths.has(path));
  for (const path of stalePaths.filter(isValidPath)) {
    await rm(path, { force: true });
  }
}
