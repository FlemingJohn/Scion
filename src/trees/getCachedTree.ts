import { getDatabase } from "../database/getDatabase";
import type { ChangesetId } from "../types/ChangesetId";
import type { Tree } from "../types/Tree";

export async function getCachedTree(changesetId: ChangesetId, path: string): Promise<Tree | null> {
  const database = getDatabase();
  const rows = await database`
    select entries
    from trees
    where changeset_id = ${changesetId} and path = ${path}
  `;
  if (rows.length === 0) {
    return null;
  }
  return { changesetId, path, entries: rows[0].entries };
}
