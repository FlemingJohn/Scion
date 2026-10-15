import { brotliCompressSync } from "node:zlib";

export function compressBlob(contents: Buffer): Buffer {
  return brotliCompressSync(contents);
}
