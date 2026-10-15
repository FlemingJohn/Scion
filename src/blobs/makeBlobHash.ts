import { createHash } from "node:crypto";
import type { BlobHash } from "../types/BlobHash";

export function makeBlobHash(contents: Buffer): BlobHash {
  return createHash("sha256").update(contents).digest("hex");
}
