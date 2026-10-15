import { expect, test } from "vitest";
import { makeFileMapFromFiles } from "../../src/trees/makeFileMapFromFiles";
import { makeTree } from "../../src/trees/makeTree";

const blobHash = "3".repeat(64);

const fileMap = makeFileMapFromFiles([
  { path: "README.md", kind: "regular", blobHash },
  { path: "src/app.ts", kind: "regular", blobHash },
  { path: "src/server/start.ts", kind: "regular", blobHash },
  { path: "tools/build.sh", kind: "executable", blobHash },
]);

test("the root tree lists files and folders once each", () => {
  const tree = makeTree("changeset", fileMap, "");
  expect(tree.entries.map((entry) => `${entry.kind} ${entry.name}`)).toEqual([
    "regular README.md",
    "folder src",
    "folder tools",
  ]);
});

test("a folder tree lists only what is directly inside it", () => {
  const tree = makeTree("changeset", fileMap, "src");
  expect(tree.entries.map((entry) => `${entry.kind} ${entry.name}`)).toEqual(["regular app.ts", "folder server"]);
});

test("a folder name that only starts the same is not included", () => {
  const tree = makeTree("changeset", makeFileMapFromFiles([{ path: "srcs/a.ts", kind: "regular", blobHash }]), "src");
  expect(tree.entries).toEqual([]);
});
