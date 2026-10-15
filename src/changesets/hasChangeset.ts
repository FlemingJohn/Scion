import { getDatabase } from "../database/getDatabase";
import type { ChangesetId } from "../types/ChangesetId";

export async function hasChangeset(changesetId: ChangesetId): Promise<boolean> {
  const database = getDatabase();
  const rows = await database`select 1 from changesets where id = ${changesetId}`;
  return rows.length === 1;
}
