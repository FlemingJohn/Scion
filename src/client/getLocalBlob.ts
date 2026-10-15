import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getConfiguration } from "../configuration/getConfiguration";
import type { BlobHash } from "../types/BlobHash";

export async function getLocalBlob(blobHash: BlobHash): Promise<Buffer | null> {
  try {
    return await readFile(join(getConfiguration().objectFolder, blobHash));
  } catch {
    return null;
  }
}
