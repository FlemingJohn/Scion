const missingObjectErrorNames = ["NotFound", "NoSuchKey", "NoSuchBucket"];

export function isMissingObjectError(error: unknown): boolean {
  return error instanceof Error && missingObjectErrorNames.includes(error.name);
}
