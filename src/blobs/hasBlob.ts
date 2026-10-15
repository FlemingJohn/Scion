import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { getConfiguration } from "../configuration/getConfiguration";
import type { BlobHash } from "../types/BlobHash";
import { getStorageClient } from "./getStorageClient";
import { isMissingObjectError } from "./isMissingObjectError";
import { makeBlobKey } from "./makeBlobKey";

export async function hasBlob(blobHash: BlobHash): Promise<boolean> {
  const command = new HeadObjectCommand({
    Bucket: getConfiguration().storageBucket,
    Key: makeBlobKey(blobHash),
  });
  try {
    await getStorageClient().send(command);
    return true;
  } catch (error) {
    if (isMissingObjectError(error)) {
      return false;
    }
    throw error;
  }
}
