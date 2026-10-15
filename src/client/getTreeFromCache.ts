import { getConfiguration } from "../configuration/getConfiguration";
import type { ChangesetId } from "../types/ChangesetId";
import type { Tree } from "../types/Tree";
import { getJson } from "./getJson";

export async function getTreeFromCache(changesetId: ChangesetId, path: string): Promise<Tree> {
  const url = `${getConfiguration().cacheUrl}/changesets/${changesetId}/tree?path=${encodeURIComponent(path)}`;
  const tree = await getJson<Tree>(url);
  if (!tree) {
    throw new Error(`changeset ${changesetId} does not exist`);
  }
  return tree;
}
