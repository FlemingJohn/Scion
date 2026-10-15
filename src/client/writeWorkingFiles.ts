import { chmod, mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { isValidPath } from "../paths/isValidPath";
import type { FileEntry } from "../types/FileEntry";
import { getBlobContents } from "./getBlobContents";

export async function writeWorkingFiles(files: FileEntry[]): Promise<void> {
  for (const file of files) {
    await writeWorkingFile(file);
  }
}

async function writeWorkingFile(file: FileEntry): Promise<void> {
  if (!isValidPath(file.path)) {
    throw new Error(`refusing to write unsafe path ${file.path}`);
  }
  const contents = await getBlobContents(file.blobHash);
  await mkdir(dirname(file.path), { recursive: true });
  await writeFile(file.path, contents);
  if (file.kind === "executable") {
    await chmod(file.path, 0o755);
  }
}
