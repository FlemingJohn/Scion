import { createHash } from "node:crypto";
import type { ChangesetId } from "../types/ChangesetId";
import type { NewChangeset } from "../types/NewChangeset";

export function makeChangesetId(newChangeset: NewChangeset, authorDate: string): ChangesetId {
  const contents = JSON.stringify({
    parentId: newChangeset.parentId,
    author: newChangeset.author,
    authorDate,
    message: newChangeset.message,
    fileChanges: newChangeset.fileChanges,
  });
  return createHash("sha256").update(contents).digest("hex");
}
