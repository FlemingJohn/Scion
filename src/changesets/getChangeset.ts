import { getDatabase } from "../database/getDatabase";
import type { Changeset } from "../types/Changeset";
import type { ChangesetId } from "../types/ChangesetId";
import { getFileChanges } from "./getFileChanges";
import { makeChangesetFromRow } from "./makeChangesetFromRow";

export async function getChangeset(changesetId: ChangesetId): Promise<Changeset | null> {
  const database = getDatabase();
  const rows = await database`
    select id, parent_id, author, author_date, message
    from changesets
    where id = ${changesetId}
  `;
  if (rows.length === 0) {
    return null;
  }
  const fileChanges = await getFileChanges([changesetId]);
  return makeChangesetFromRow(rows[0], fileChanges.get(changesetId) ?? []);
}
