import { getDatabase } from "../database/getDatabase";
import type { Tree } from "../types/Tree";

export async function saveTree(tree: Tree): Promise<void> {
  const database = getDatabase();
  await database`
    insert into trees (changeset_id, path, entries)
    values (${tree.changesetId}, ${tree.path}, ${JSON.stringify(tree.entries)}::jsonb)
    on conflict (changeset_id, path) do nothing
  `;
}
