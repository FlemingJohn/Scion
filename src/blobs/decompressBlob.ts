import { brotliDecompressSync } from "node:zlib";

export function decompressBlob(compressedContents: Buffer): Buffer {
  return brotliDecompressSync(compressedContents);
}
