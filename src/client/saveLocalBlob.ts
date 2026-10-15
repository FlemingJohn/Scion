import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getConfiguration } from "../configuration/getConfiguration";
import type { BlobHash } from "../types/BlobHash";

export async function saveLocalBlob(blobHash: BlobHash, contents: Buffer): Promise<void> {
  const objectFolder = getConfiguration().objectFolder;
  await mkdir(objectFolder, { recursive: true });
  await writeFile(join(objectFolder, blobHash), contents);
}
