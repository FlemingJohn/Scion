import { expect, test } from "vitest";
import { makeFileMap } from "../../src/trees/makeFileMap";
import type { Changeset } from "../../src/types/Changeset";

const firstHash = "1".repeat(64);
const secondHash = "2".repeat(64);

const history: Changeset[] = [
  {
    id: "first",
    parentId: null,
    author: "Ada",
    authorDate: "2026-10-15T00:00:00.000Z",
    message: "add files",
    fileChanges: [
      { path: "README.md", kind: "regular", blobHash: firstHash },
      { path: "src/app.ts", kind: "regular", blobHash: firstHash },
    ],
  },
  {
    id: "second",
    parentId: "first",
    author: "Ada",
    authorDate: "2026-10-15T00:01:00.000Z",
    message: "change the app and remove the readme",
    fileChanges: [
      { path: "README.md", kind: "deleted", blobHash: null },
      { path: "src/app.ts", kind: "regular", blobHash: secondHash },
    ],
  },
];

test("replaying history gives the latest files", () => {
  const fileMap = makeFileMap(history);
  expect([...fileMap.keys()]).toEqual(["src/app.ts"]);
  expect(fileMap.get("src/app.ts")?.blobHash).toBe(secondHash);
});
