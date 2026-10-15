import { getConfiguration } from "../configuration/getConfiguration";
import type { DiffEntry } from "../types/DiffEntry";
import { getJson } from "./getJson";

export async function showDiff(fromChangesetId: string, toChangesetId: string): Promise<void> {
  const url = `${getConfiguration().serverUrl}/diffs/${fromChangesetId}/${toChangesetId}`;
  const diff = await getJson<DiffEntry[]>(url);
  if (!diff) {
    throw new Error("one of those changesets does not exist");
  }
  for (const diffEntry of diff) {
    console.log(`${diffEntry.change.padEnd(9)} ${diffEntry.path}`);
  }
}
