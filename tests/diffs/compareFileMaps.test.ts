import { expect, test } from "vitest";
import { compareFileMaps } from "../../src/diffs/compareFileMaps";
import { makeFileMapFromFiles } from "../../src/trees/makeFileMapFromFiles";

const oldHash = "4".repeat(64);
const newHash = "5".repeat(64);

test("added, removed and modified files are found and sorted by path", () => {
  const before = makeFileMapFromFiles([
    { path: "a.ts", kind: "regular", blobHash: oldHash },
    { path: "b.ts", kind: "regular", blobHash: oldHash },
    { path: "same.ts", kind: "regular", blobHash: oldHash },
  ]);
  const after = makeFileMapFromFiles([
    { path: "b.ts", kind: "regular", blobHash: newHash },
    { path: "c.ts", kind: "regular", blobHash: newHash },
    { path: "same.ts", kind: "regular", blobHash: oldHash },
  ]);
  expect(compareFileMaps(before, after).map((entry) => `${entry.change} ${entry.path}`)).toEqual([
    "removed a.ts",
    "modified b.ts",
    "added c.ts",
  ]);
});

test("a file that becomes executable is modified", () => {
  const before = makeFileMapFromFiles([{ path: "build.sh", kind: "regular", blobHash: oldHash }]);
  const after = makeFileMapFromFiles([{ path: "build.sh", kind: "executable", blobHash: oldHash }]);
  expect(compareFileMaps(before, after)).toHaveLength(1);
});
