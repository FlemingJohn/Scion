import { expect, test } from "vitest";
import { makeChangesetId } from "../../src/changesets/makeChangesetId";
import type { NewChangeset } from "../../src/types/NewChangeset";

const newChangeset: NewChangeset = {
  parentId: null,
  author: "Ada",
  message: "add the readme",
  fileChanges: [{ path: "README.md", kind: "regular", blobHash: "a".repeat(64) }],
};

test("the same changeset at the same time gets the same id", () => {
  const authorDate = "2026-10-15T00:00:00.000Z";
  expect(makeChangesetId(newChangeset, authorDate)).toBe(makeChangesetId(newChangeset, authorDate));
});

test("a different message gets a different id", () => {
  const authorDate = "2026-10-15T00:00:00.000Z";
  const otherChangeset = { ...newChangeset, message: "rename the readme" };
  expect(makeChangesetId(otherChangeset, authorDate)).not.toBe(makeChangesetId(newChangeset, authorDate));
});
