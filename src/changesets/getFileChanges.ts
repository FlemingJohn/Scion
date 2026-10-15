import type { Row } from "postgres";
import { getDatabase } from "../database/getDatabase";
import type { ChangesetId } from "../types/ChangesetId";
import type { FileChange } from "../types/FileChange";

export async function getFileChanges(changesetIds: ChangesetId[]): Promise<Map<ChangesetId, FileChange[]>> {
  const fileChangesByChangeset = new Map<ChangesetId, FileChange[]>();
  if (changesetIds.length === 0) {
    return fileChangesByChangeset;
  }
  const database = getDatabase();
  const rows = await database`
    select changeset_id, path, kind, blob_hash
    from file_changes
    where changeset_id in ${database(changesetIds)}
    order by path
  `;
  for (const row of rows) {
    const fileChanges = fileChangesByChangeset.get(row.changeset_id) ?? [];
    fileChanges.push(makeFileChangeFromRow(row));
    fileChangesByChangeset.set(row.changeset_id, fileChanges);
  }
  return fileChangesByChangeset;
}

function makeFileChangeFromRow(row: Row): FileChange {
  return { path: row.path, kind: row.kind, blobHash: row.blob_hash };
}
