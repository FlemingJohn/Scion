import { getHistory } from "../changesets/getHistory";
import type { ChangesetId } from "../types/ChangesetId";
import type { FileMap } from "../types/FileMap";
import { makeFileMap } from "./makeFileMap";

const maximumHistoryDepth = 1_000_000;

export async function getFileMap(changesetId: ChangesetId): Promise<FileMap | null> {
  const historyNewestFirst = await getHistory(changesetId, maximumHistoryDepth);
  if (historyNewestFirst.length === 0) {
    return null;
  }
  return makeFileMap(historyNewestFirst.reverse());
}
