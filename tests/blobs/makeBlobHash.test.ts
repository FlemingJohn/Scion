import { expect, test } from "vitest";
import { isBlobHash } from "../../src/blobs/isBlobHash";
import { makeBlobHash } from "../../src/blobs/makeBlobHash";

test("the same contents always make the same hash", () => {
  expect(makeBlobHash(Buffer.from("hello"))).toBe(makeBlobHash(Buffer.from("hello")));
});

test("different contents make different hashes", () => {
  expect(makeBlobHash(Buffer.from("hello"))).not.toBe(makeBlobHash(Buffer.from("hello!")));
});

test("a hash is 64 lowercase hex characters", () => {
  expect(isBlobHash(makeBlobHash(Buffer.from("hello")))).toBe(true);
  expect(isBlobHash("../../etc/passwd")).toBe(false);
});
