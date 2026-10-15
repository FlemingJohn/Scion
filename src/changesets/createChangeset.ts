import type { Changeset } from "../types/Changeset";
import type { NewChangeset } from "../types/NewChangeset";
import { checkNewChangeset } from "./checkNewChangeset";
import { makeChangesetId } from "./makeChangesetId";
import { saveChangeset } from "./saveChangeset";

export async function createChangeset(newChangeset: NewChangeset): Promise<Changeset> {
  await checkNewChangeset(newChangeset);
  const authorDate = new Date().toISOString();
  const changeset: Changeset = {
    id: makeChangesetId(newChangeset, authorDate),
    authorDate,
    parentId: newChangeset.parentId,
    author: newChangeset.author,
    message: newChangeset.message,
    fileChanges: newChangeset.fileChanges,
  };
  await saveChangeset(changeset);
  return changeset;
}
