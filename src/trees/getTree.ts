import type { ChangesetId } from "../types/ChangesetId";
import type { Tree } from "../types/Tree";
import { getCachedTree } from "./getCachedTree";
import { getFileMap } from "./getFileMap";
import { makeTree } from "./makeTree";
import { saveTree } from "./saveTree";

export async function getTree(changesetId: ChangesetId, path: string): Promise<Tree | null> {
  const cachedTree = await getCachedTree(changesetId, path);
  if (cachedTree) {
    return cachedTree;
  }
  const fileMap = await getFileMap(changesetId);
  if (!fileMap) {
    return null;
  }
  const tree = makeTree(changesetId, fileMap, path);
  await saveTree(tree);
  return tree;
}
