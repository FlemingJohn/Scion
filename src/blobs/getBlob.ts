import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getConfiguration } from "../configuration/getConfiguration";
import type { BlobHash } from "../types/BlobHash";
import { decompressBlob } from "./decompressBlob";
import { getStorageClient } from "./getStorageClient";
import { isMissingObjectError } from "./isMissingObjectError";
import { makeBlobKey } from "./makeBlobKey";

export async function getBlob(blobHash: BlobHash): Promise<Buffer | null> {
  const command = new GetObjectCommand({
    Bucket: getConfiguration().storageBucket,
    Key: makeBlobKey(blobHash),
  });
  try {
    const response = await getStorageClient().send(command);
    if (!response.Body) {
      return null;
    }
    const compressedContents = await response.Body.transformToByteArray();
    return decompressBlob(Buffer.from(compressedContents));
  } catch (error) {
    if (isMissingObjectError(error)) {
      return null;
    }
    throw error;
  }
}
