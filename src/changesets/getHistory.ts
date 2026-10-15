import { getDatabase } from "../database/getDatabase";
import type { Changeset } from "../types/Changeset";
import type { ChangesetId } from "../types/ChangesetId";
import { getFileChanges } from "./getFileChanges";
import { makeChangesetFromRow } from "./makeChangesetFromRow";

export async function getHistory(changesetId: ChangesetId, limit: number): Promise<Changeset[]> {
  const database = getDatabase();
  const rows = await database`
    with recursive history as (
      select id, parent_id, author, author_date, message, 1 as depth
      from changesets
      where id = ${changesetId}
      union all
      select changesets.id, changesets.parent_id, changesets.author, changesets.author_date, changesets.message, history.depth + 1
      from changesets
      join history on changesets.id = history.parent_id
      where history.depth < ${limit}
    )
    select id, parent_id, author, author_date, message
    from history
    order by depth
  `;
  const fileChanges = await getFileChanges(rows.map((row) => row.id));
  return rows.map((row) => makeChangesetFromRow(row, fileChanges.get(row.id) ?? []));
}
