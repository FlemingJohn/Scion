import { expect, test } from "vitest";
import { compressBlob } from "../../src/blobs/compressBlob";
import { decompressBlob } from "../../src/blobs/decompressBlob";

test("a compressed blob comes back unchanged", () => {
  const contents = Buffer.from("export const total = 1;\n".repeat(100));
  expect(decompressBlob(compressBlob(contents)).equals(contents)).toBe(true);
});

test("repeated text gets smaller", () => {
  const contents = Buffer.from("export const total = 1;\n".repeat(100));
  expect(compressBlob(contents).length).toBeLessThan(contents.length);
});
