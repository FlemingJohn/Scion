import { getDatabase } from "../database/getDatabase";
import type { Branch } from "../types/Branch";

export async function getBranch(branchName: string): Promise<Branch | null> {
  const database = getDatabase();
  const rows = await database`select name, changeset_id from branches where name = ${branchName}`;
  if (rows.length === 0) {
    return null;
  }
  return { name: rows[0].name, changesetId: rows[0].changeset_id };
}
