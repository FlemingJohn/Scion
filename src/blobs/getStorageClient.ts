import { S3Client } from "@aws-sdk/client-s3";
import { getConfiguration } from "../configuration/getConfiguration";

let storageClient: S3Client | undefined;

export function getStorageClient(): S3Client {
  if (!storageClient) {
    const configuration = getConfiguration();
    storageClient = new S3Client({
      endpoint: configuration.storageEndpoint,
      region: "us-east-1",
      forcePathStyle: true,
      credentials: {
        accessKeyId: configuration.storageAccessKey,
        secretAccessKey: configuration.storageSecretKey,
      },
    });
  }
  return storageClient;
}
