import { getDatabase } from "../database/getDatabase";
import type { ChangesetId } from "../types/ChangesetId";

export async function createBranch(branchName: string, changesetId: ChangesetId): Promise<boolean> {
  const database = getDatabase();
  const result = await database`
    insert into branches (name, changeset_id)
    values (${branchName}, ${changesetId})
    on conflict (name) do nothing
  `;
  return result.count === 1;
}
