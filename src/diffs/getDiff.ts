import { getFileMap } from "../trees/getFileMap";
import type { ChangesetId } from "../types/ChangesetId";
import type { DiffEntry } from "../types/DiffEntry";
import { compareFileMaps } from "./compareFileMaps";

export async function getDiff(fromChangesetId: ChangesetId, toChangesetId: ChangesetId): Promise<DiffEntry[] | null> {
  const [before, after] = await Promise.all([getFileMap(fromChangesetId), getFileMap(toChangesetId)]);
  if (!before || !after) {
    return null;
  }
  return compareFileMaps(before, after);
}
