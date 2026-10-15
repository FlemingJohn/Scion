import type { Row } from "postgres";
import type { Changeset } from "../types/Changeset";
import type { FileChange } from "../types/FileChange";

export function makeChangesetFromRow(row: Row, fileChanges: FileChange[]): Changeset {
  return {
    id: row.id,
    parentId: row.parent_id,
    author: row.author,
    authorDate: new Date(row.author_date).toISOString(),
    message: row.message,
    fileChanges,
  };
}
