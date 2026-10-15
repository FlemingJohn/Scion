import { readFile } from "node:fs/promises";
import type { FileChange } from "../types/FileChange";
import { uploadBlob } from "./uploadBlob";

export async function uploadChangedFiles(fileChanges: FileChange[]): Promise<void> {
  for (const fileChange of fileChanges) {
    if (fileChange.kind !== "deleted") {
      await uploadBlob(await readFile(fileChange.path));
    }
  }
}
