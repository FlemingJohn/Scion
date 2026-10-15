import { getConfiguration } from "../configuration/getConfiguration";
import type { BlobHash } from "../types/BlobHash";
import { checkResponse } from "./checkResponse";

export async function uploadBlob(contents: Buffer): Promise<BlobHash> {
  const response = await fetch(`${getConfiguration().serverUrl}/blobs`, {
    method: "POST",
    headers: { "content-type": "application/octet-stream" },
    body: new Uint8Array(contents),
  });
  await checkResponse(response);
  const result = (await response.json()) as { blobHash: BlobHash };
  return result.blobHash;
}
