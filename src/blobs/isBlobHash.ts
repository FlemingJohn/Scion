const blobHashPattern = /^[0-9a-f]{64}$/;

export function isBlobHash(value: string): boolean {
  return blobHashPattern.test(value);
}
