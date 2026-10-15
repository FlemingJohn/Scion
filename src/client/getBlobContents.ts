import { makeBlobHash } from "../blobs/makeBlobHash";
import { getConfiguration } from "../configuration/getConfiguration";
import type { BlobHash } from "../types/BlobHash";
import { checkResponse } from "./checkResponse";
import { getLocalBlob } from "./getLocalBlob";
import { saveLocalBlob } from "./saveLocalBlob";

export async function getBlobContents(blobHash: BlobHash): Promise<Buffer> {
  const localContents = await getLocalBlob(blobHash);
  if (localContents) {
    return localContents;
  }
  const response = await fetch(`${getConfiguration().cacheUrl}/blobs/${blobHash}`);
  await checkResponse(response);
  const contents = Buffer.from(await response.arrayBuffer());
  if (makeBlobHash(contents) !== blobHash) {
    throw new Error(`blob ${blobHash} arrived damaged`);
  }
  await saveLocalBlob(blobHash, contents);
  return contents;
}
