import { getDatabase } from "../database/getDatabase";
import type { Changeset } from "../types/Changeset";

export async function saveChangeset(changeset: Changeset): Promise<void> {
  const database = getDatabase();
  await database.begin(async (transaction) => {
    await transaction`
      insert into changesets (id, parent_id, author, author_date, message)
      values (${changeset.id}, ${changeset.parentId}, ${changeset.author}, ${changeset.authorDate}, ${changeset.message})
    `;
    await transaction`insert into file_changes ${transaction(makeFileChangeRows(changeset))}`;
  });
}

function makeFileChangeRows(changeset: Changeset) {
  return changeset.fileChanges.map((fileChange) => ({
    changeset_id: changeset.id,
    path: fileChange.path,
    kind: fileChange.kind,
    blob_hash: fileChange.blobHash,
  }));
}
