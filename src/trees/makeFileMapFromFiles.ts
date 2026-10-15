import type { FileEntry } from "../types/FileEntry";
import type { FileMap } from "../types/FileMap";

export function makeFileMapFromFiles(files: FileEntry[]): FileMap {
  return new Map(files.map((file) => [file.path, file]));
}
