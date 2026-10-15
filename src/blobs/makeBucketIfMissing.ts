import { CreateBucketCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import { getConfiguration } from "../configuration/getConfiguration";
import { getStorageClient } from "./getStorageClient";
import { isMissingObjectError } from "./isMissingObjectError";

export async function makeBucketIfMissing(): Promise<void> {
  const bucket = getConfiguration().storageBucket;
  const storageClient = getStorageClient();
  try {
    await storageClient.send(new HeadBucketCommand({ Bucket: bucket }));
  } catch (error) {
    if (!isMissingObjectError(error)) {
      throw error;
    }
    await storageClient.send(new CreateBucketCommand({ Bucket: bucket }));
  }
}
