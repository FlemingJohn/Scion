import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getConfiguration } from "../configuration/getConfiguration";
import type { BlobHash } from "../types/BlobHash";
import { compressBlob } from "./compressBlob";
import { getStorageClient } from "./getStorageClient";
import { hasBlob } from "./hasBlob";
import { makeBlobHash } from "./makeBlobHash";
import { makeBlobKey } from "./makeBlobKey";

export async function putBlob(contents: Buffer): Promise<BlobHash> {
  const blobHash = makeBlobHash(contents);
  if (await hasBlob(blobHash)) {
    return blobHash;
  }
  const command = new PutObjectCommand({
    Bucket: getConfiguration().storageBucket,
    Key: makeBlobKey(blobHash),
    Body: compressBlob(contents),
  });
  await getStorageClient().send(command);
  return blobHash;
}
